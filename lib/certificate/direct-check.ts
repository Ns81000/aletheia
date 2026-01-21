import * as tls from 'tls';
import { CertificateData } from '@/types/certificate';
import { calculateSecurityGrade } from '@/lib/utils/security-scorer';
import { getDaysRemaining } from '@/lib/utils/date-formatter';

/**
 * Check SSL/TLS certificate by connecting directly to the server
 */
export async function checkCertificateDirect(
  domain: string
): Promise<CertificateData> {
  return new Promise((resolve, reject) => {
    const options: tls.ConnectionOptions = {
      host: domain,
      port: 443,
      servername: domain,
      rejectUnauthorized: false, // We want to check even invalid certs
    };

    const socket = tls.connect(options, () => {
      try {
        const cert = socket.getPeerCertificate(true);
        const cipher = socket.getCipher();
        const protocol = socket.getProtocol();

        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          reject(new Error('No certificate found'));
          return;
        }

        // Parse certificate data
        const validFrom = cert.valid_from;
        const validTo = cert.valid_to;
        const daysRemaining = getDaysRemaining(validTo);

        // Parse subject and issuer
        const subject = parseCertSubject(cert.subject);
        const issuer = parseCertIssuer(cert.issuer);

        // Get SANs
        const subjectAltNames = cert.subjectaltname
          ? cert.subjectaltname
              .split(', ')
              .map((san: string) => san.replace('DNS:', ''))
          : [];

        // Check if wildcard
        const isWildcard = subjectAltNames.some((san: string) =>
          san.startsWith('*.')
        );

        // Check if self-signed
        const isSelfSigned = cert.subject.CN === cert.issuer.CN;

        // Get public key info
        const publicKey = {
          algorithm: cert.pubkey ? getKeyAlgorithm(cert) : 'Unknown',
          bits: cert.bits || 0,
        };

        // Build certificate chain
        const certificateChain = buildCertificateChain(cert);

        // Calculate security grade
        const securityAnalysis = calculateSecurityGrade({
          tlsVersion: protocol || '',
          publicKey,
          daysRemaining,
          isSelfSigned,
          signatureAlgorithm: (cert as any).signatureAlgorithm || 'Unknown',
          certificateChain,
        });

        const certificateData: CertificateData = {
          domain,
          valid: (cert as any).valid !== undefined ? (cert as any).valid : true,
          issuer: {
            commonName: issuer.CN || '',
            organization: issuer.O || '',
            country: issuer.C || '',
          },
          subject: {
            commonName: subject.CN || '',
            organization: subject.O,
            country: subject.C,
          },
          validFrom,
          validTo,
          daysRemaining,
          subjectAltNames,
          serialNumber: cert.serialNumber || '',
          fingerprint: cert.fingerprint || '',
          fingerprintSha256: cert.fingerprint256 || '',
          publicKey,
          signatureAlgorithm: (cert as any).signatureAlgorithm || 'Unknown',
          version: (cert as any).version || 3,
          tlsVersion: protocol || 'Unknown',
          cipherSuite: cipher ? `${cipher.name} (${cipher.version})` : 'Unknown',
          certificateChain,
          securityGrade: securityAnalysis.grade,
          securityScore: securityAnalysis.score,
          securityIssues: securityAnalysis.issues,
          isWildcard,
          isSelfSigned,
          isExpiringSoon: daysRemaining < 30 && daysRemaining >= 0,
        };

        socket.destroy();
        resolve(certificateData);
      } catch (error) {
        socket.destroy();
        reject(error);
      }
    });

    socket.on('error', (error: Error) => {
      reject(new Error(`Connection failed: ${error.message}`));
    });

    socket.setTimeout(10000, () => {
      socket.destroy();
      reject(new Error('Connection timeout'));
    });
  });
}

function parseCertSubject(subject: any): any {
  if (!subject) return {};
  return subject;
}

function parseCertIssuer(issuer: any): any {
  if (!issuer) return {};
  return issuer;
}

function getKeyAlgorithm(cert: any): string {
  if (!cert.pubkey) return 'Unknown';
  // Node.js doesn't directly expose the algorithm, infer from bits
  if (cert.bits >= 2048) {
    return 'RSA';
  }
  if (cert.bits >= 256 && cert.bits < 512) {
    return 'EC';
  }
  return 'RSA'; // Default assumption
}

function buildCertificateChain(cert: any): any[] {
  const chain = [];
  let current = cert;

  while (current) {
    chain.push({
      subject: current.subject?.CN || 'Unknown',
      issuer: current.issuer?.CN || 'Unknown',
      validFrom: current.valid_from,
      validTo: current.valid_to,
    });

    // Move to issuer certificate
    current = current.issuerCertificate;

    // Prevent infinite loop (self-signed root)
    if (current && current.fingerprint === cert.fingerprint) {
      break;
    }
  }

  return chain;
}
