import { NextRequest, NextResponse } from 'next/server';
import { CTLogData, ApiResponse, CTLogCertificate } from '@/types/certificate';

// Helper function to parse domain
function parseDomain(input: string): string {
  let domain = input.replace(/^https?:\/\//, '');
  domain = domain.split('/')[0];
  domain = domain.split(':')[0];
  domain = domain.replace(/\.$/, '');
  return domain.toLowerCase();
}

// Helper to detect renewal patterns
function detectRenewalPattern(certificates: CTLogCertificate[]): {
  detected: boolean;
  intervalDays?: number;
  isAutomated?: boolean;
} {
  if (certificates.length < 2) {
    return { detected: false };
  }

  const sorted = [...certificates].sort(
    (a, b) => new Date(b.notBefore).getTime() - new Date(a.notBefore).getTime()
  );

  const intervals: number[] = [];
  for (let i = 0; i < Math.min(sorted.length - 1, 5); i++) {
    const current = new Date(sorted[i].notBefore);
    const previous = new Date(sorted[i + 1].notBefore);
    const daysDiff = Math.abs(
      (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
    );
    intervals.push(daysDiff);
  }

  if (intervals.length === 0) {
    return { detected: false };
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, interval) => sum + Math.abs(interval - avgInterval), 0) / intervals.length;

  // If variance is low, renewal is likely automated
  const isAutomated = variance < 7; // Within a week variance
  const detected = variance < 15; // Within 2 weeks variance

  return {
    detected,
    intervalDays: Math.round(avgInterval),
    isAutomated,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain: rawDomain, includeSubdomains = true, limit = 100 } = body;

    if (!rawDomain) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Domain is required',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const domain = parseDomain(rawDomain);

    // Query crt.sh API with retry logic
    const query = includeSubdomains ? `%.${domain}` : domain;
    const url = `https://crt.sh/?q=${encodeURIComponent(query)}&output=json`;

    let response;
    let lastError;

    // Retry up to 3 times
    for (let i = 0; i < 3; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        response = await fetch(url, {
          headers: {
            'User-Agent': 'Aletheia-Certificate-Checker/1.0',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) break;
        throw new Error(`HTTP ${response.status}`);
      } catch (e) {
        lastError = e;
        // Exponential backoff: 1s, 2s, 3s
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    // If all retries failed, return empty data gracefully
    if (!response || !response.ok) {
      // CT logs unavailable - return empty data without error
      return NextResponse.json<ApiResponse<CTLogData>>({
        success: true,
        data: {
          domain,
          totalCertificates: 0,
          certificates: [],
          subdomains: [],
          renewalPattern: { detected: false },
          issuerHistory: [],
          stats: {
            averageValidityDays: 0,
            mostRecentIssuer: '',
            certificateAuthorities: [],
          },
        },
        timestamp: new Date().toISOString(),
      });
    }

    let rawData;
    try {
      rawData = await response.json();
    } catch (e) {
      // CT logs data unavailable - return empty data
      return NextResponse.json<ApiResponse<CTLogData>>({
        success: true,
        data: {
          domain,
          totalCertificates: 0,
          certificates: [],
          subdomains: [],
          renewalPattern: { detected: false },
          issuerHistory: [],
          stats: {
            averageValidityDays: 0,
            mostRecentIssuer: '',
            certificateAuthorities: [],
          },
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (!Array.isArray(rawData) || rawData.length === 0) {
      return NextResponse.json<ApiResponse<CTLogData>>({
        success: true,
        data: {
          domain,
          totalCertificates: 0,
          certificates: [],
          subdomains: [],
          renewalPattern: { detected: false },
          issuerHistory: [],
          stats: {
            averageValidityDays: 0,
            mostRecentIssuer: '',
            certificateAuthorities: [],
          },
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Process and deduplicate certificates
    const certMap = new Map<string, any>();

    for (const entry of rawData) {
      const serialNumber = entry.serial_number;
      if (!certMap.has(serialNumber)) {
        certMap.set(serialNumber, entry);
      }
    }

    const now = new Date();
    const certificates: CTLogCertificate[] = Array.from(certMap.values())
      .map((entry) => {
        const notBefore = new Date(entry.not_before);
        const notAfter = new Date(entry.not_after);
        const isExpired = notAfter < now;
        const isCurrent = notBefore <= now && notAfter >= now;

        // Parse SANs
        const commonName = entry.common_name || entry.name_value || '';
        const sans = entry.name_value
          ? entry.name_value.split('\n').filter((s: string) => s.trim())
          : [commonName];

        return {
          id: entry.id?.toString() || '',
          loggedAt: entry.entry_timestamp || notBefore.toISOString(),
          notBefore: notBefore.toISOString(),
          notAfter: notAfter.toISOString(),
          issuer: {
            commonName: entry.issuer_name || 'Unknown',
            organization: entry.issuer_name || 'Unknown',
          },
          commonName,
          subjectAltNames: sans,
          serialNumber: entry.serial_number || '',
          isCurrent,
          isExpired,
        };
      })
      .sort((a, b) => new Date(b.notBefore).getTime() - new Date(a.notBefore).getTime())
      .slice(0, limit);

    // Extract unique subdomains
    const subdomainSet = new Set<string>();
    certificates.forEach((cert) => {
      cert.subjectAltNames.forEach((san) => {
        if (san.includes(domain) && san !== domain) {
          subdomainSet.add(san);
        }
      });
    });

    // Detect renewal pattern
    const renewalPattern = detectRenewalPattern(certificates);

    // Build issuer history
    const issuerMap = new Map<string, { firstSeen: Date; lastSeen: Date; count: number }>();
    certificates.forEach((cert) => {
      const issuer = cert.issuer.commonName;
      const date = new Date(cert.notBefore);

      if (issuerMap.has(issuer)) {
        const existing = issuerMap.get(issuer)!;
        existing.count++;
        if (date < existing.firstSeen) existing.firstSeen = date;
        if (date > existing.lastSeen) existing.lastSeen = date;
      } else {
        issuerMap.set(issuer, { firstSeen: date, lastSeen: date, count: 1 });
      }
    });

    const issuerHistory = Array.from(issuerMap.entries())
      .map(([issuer, data]) => ({
        issuer,
        firstSeen: data.firstSeen.toISOString(),
        lastSeen: data.lastSeen.toISOString(),
        count: data.count,
      }))
      .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

    // Calculate stats
    const validityPeriods = certificates.map((cert) => {
      const notBefore = new Date(cert.notBefore);
      const notAfter = new Date(cert.notAfter);
      return (notAfter.getTime() - notBefore.getTime()) / (1000 * 60 * 60 * 24);
    });

    const avgValidity = validityPeriods.length > 0
      ? validityPeriods.reduce((a, b) => a + b, 0) / validityPeriods.length
      : 0;

    const ctLogData: CTLogData = {
      domain,
      totalCertificates: certificates.length,
      certificates,
      subdomains: Array.from(subdomainSet).sort(),
      renewalPattern,
      issuerHistory,
      stats: {
        averageValidityDays: Math.round(avgValidity),
        mostRecentIssuer: issuerHistory[0]?.issuer || '',
        certificateAuthorities: Array.from(new Set(issuerHistory.map((h) => h.issuer))),
      },
    };

    return NextResponse.json<ApiResponse<CTLogData>>({
      success: true,
      data: ctLogData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('CT logs query error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to query CT logs',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
