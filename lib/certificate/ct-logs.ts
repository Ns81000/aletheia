import { CTLogData, CTLogCertificate } from '@/types/certificate';
import { differenceInDays } from 'date-fns';

interface CrtShResponse {
  issuer_ca_id: number;
  issuer_name: string;
  common_name: string;
  name_value: string;
  id: number;
  entry_timestamp: string;
  not_before: string;
  not_after: string;
  serial_number: string;
}

/**
 * Query Certificate Transparency logs via crt.sh API
 */
export async function queryCTLogs(
  domain: string,
  includeSubdomains = true
): Promise<CTLogData> {
  const searchDomain = includeSubdomains ? `%.${domain}` : domain;
  const url = `https://crt.sh/?q=${encodeURIComponent(searchDomain)}&output=json`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Aletheia-Certificate-Checker',
    },
  });

  if (!response.ok) {
    throw new Error(`CT logs query failed: ${response.statusText}`);
  }

  const data: CrtShResponse[] = await response.json();

  if (!data || data.length === 0) {
    return {
      domain,
      totalCertificates: 0,
      certificates: [],
      subdomains: [],
      renewalPattern: {
        detected: false,
      },
      issuerHistory: [],
      stats: {
        averageValidityDays: 0,
        mostRecentIssuer: '',
        certificateAuthorities: [],
      },
    };
  }

  // Process certificates
  const certificates: CTLogCertificate[] = [];
  const subdomainsSet = new Set<string>();
  const issuerMap = new Map<string, { count: number; first: Date; last: Date }>();

  // Remove duplicates and process
  const seenSerials = new Set<string>();
  
  for (const cert of data) {
    if (seenSerials.has(cert.serial_number)) continue;
    seenSerials.add(cert.serial_number);

    const notAfter = new Date(cert.not_after);
    const notBefore = new Date(cert.not_before);
    const isExpired = notAfter < new Date();
    const isCurrent = !isExpired && notBefore <= new Date();

    // Extract subdomains from name_value
    const domains = cert.name_value.split('\n');
    domains.forEach((d) => {
      const clean = d.trim().toLowerCase();
      if (clean && !clean.startsWith('*')) {
        subdomainsSet.add(clean);
      }
    });

    // Track issuer history
    const issuerName = cert.issuer_name;
    const issuerData = issuerMap.get(issuerName) || {
      count: 0,
      first: new Date(cert.entry_timestamp),
      last: new Date(cert.entry_timestamp),
    };
    issuerData.count++;
    const entryDate = new Date(cert.entry_timestamp);
    if (entryDate < issuerData.first) issuerData.first = entryDate;
    if (entryDate > issuerData.last) issuerData.last = entryDate;
    issuerMap.set(issuerName, issuerData);

    certificates.push({
      id: cert.id.toString(),
      loggedAt: cert.entry_timestamp,
      notBefore: cert.not_before,
      notAfter: cert.not_after,
      issuer: {
        commonName: extractCN(cert.issuer_name),
        organization: extractO(cert.issuer_name),
      },
      commonName: cert.common_name,
      subjectAltNames: domains,
      serialNumber: cert.serial_number,
      isCurrent,
      isExpired,
    });
  }

  // Sort by logged date (newest first)
  certificates.sort(
    (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
  );

  // Detect renewal patterns
  const renewalPattern = detectRenewalPattern(certificates);

  // Build issuer history
  const issuerHistory = Array.from(issuerMap.entries()).map(
    ([issuer, data]) => ({
      issuer,
      firstSeen: data.first.toISOString(),
      lastSeen: data.last.toISOString(),
      count: data.count,
    })
  );

  // Calculate statistics
  const validityDays = certificates.map((cert) =>
    differenceInDays(new Date(cert.notAfter), new Date(cert.notBefore))
  );
  const averageValidityDays =
    validityDays.length > 0
      ? Math.round(
          validityDays.reduce((a, b) => a + b, 0) / validityDays.length
        )
      : 0;

  const cas = Array.from(
    new Set(certificates.map((c) => c.issuer.commonName))
  );

  return {
    domain,
    totalCertificates: certificates.length,
    certificates: certificates.slice(0, 100), // Limit to 100 most recent
    subdomains: Array.from(subdomainsSet).sort(),
    renewalPattern,
    issuerHistory,
    stats: {
      averageValidityDays,
      mostRecentIssuer:
        certificates.length > 0 ? certificates[0].issuer.commonName : '',
      certificateAuthorities: cas,
    },
  };
}

function extractCN(distinguishedName: string): string {
  const match = distinguishedName.match(/CN=([^,]+)/);
  return match ? match[1].trim() : distinguishedName;
}

function extractO(distinguishedName: string): string {
  const match = distinguishedName.match(/O=([^,]+)/);
  return match ? match[1].trim() : '';
}

function detectRenewalPattern(
  certificates: CTLogCertificate[]
): {
  detected: boolean;
  intervalDays?: number;
  isAutomated?: boolean;
} {
  if (certificates.length < 3) {
    return { detected: false };
  }

  // Get intervals between certificates
  const intervals: number[] = [];
  for (let i = 0; i < certificates.length - 1 && i < 10; i++) {
    const current = new Date(certificates[i].loggedAt);
    const next = new Date(certificates[i + 1].loggedAt);
    intervals.push(Math.abs(differenceInDays(current, next)));
  }

  if (intervals.length === 0) {
    return { detected: false };
  }

  // Calculate average interval
  const avgInterval = Math.round(
    intervals.reduce((a, b) => a + b, 0) / intervals.length
  );

  // Check if intervals are consistent (within 10 days variance)
  const isConsistent = intervals.every(
    (interval) => Math.abs(interval - avgInterval) < 10
  );

  if (isConsistent && avgInterval > 30) {
    return {
      detected: true,
      intervalDays: avgInterval,
      isAutomated: avgInterval >= 85 && avgInterval <= 95, // Likely Let's Encrypt
    };
  }

  return { detected: false };
}
