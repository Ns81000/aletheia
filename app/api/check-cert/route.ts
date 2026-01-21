import { NextRequest, NextResponse } from 'next/server';
import * as tls from 'tls';
import { CertificateData, ApiResponse } from '@/types/certificate';

// Helper function to parse domain
function parseDomain(input: string): string {
  let domain = input.replace(/^https?:\/\//, '');
  domain = domain.split('/')[0];
  domain = domain.split(':')[0];
  domain = domain.replace(/\.$/, '');
  return domain.toLowerCase();
}

// Helper function to calculate security grade
function calculateSecurityGrade(
  tlsVersion: string,
  publicKeyBits: number,
  signatureAlgorithm: string,
  daysRemaining: number,
  isSelfSigned: boolean
): { grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'; score: number; issues: string[] } {
  let score = 100;
  const issues: string[] = [];

  // Check TLS version
  if (!tlsVersion.includes('1.3')) {
    score -= 10;
    issues.push('Not using TLS 1.3');
  }

  // Check key size
  if (publicKeyBits < 2048) {
    score -= 20;
    issues.push('Key size less than 2048 bits');
  }

  // Check expiration
  if (daysRemaining < 7) {
    score -= 15;
    issues.push('Expires in less than 7 days');
  } else if (daysRemaining < 30) {
    score -= 5;
    issues.push('Expires in less than 30 days');
  }

  // Check self-signed
  if (isSelfSigned) {
    score -= 50;
    issues.push('Self-signed certificate');
  }

  // Check signature algorithm
  if (signatureAlgorithm.toLowerCase().includes('sha1')) {
    score -= 30;
    issues.push('Using deprecated SHA-1');
  }

  const finalScore = Math.max(0, score);
  const grade =
    finalScore >= 95 ? 'A+' :
    finalScore >= 90 ? 'A' :
    finalScore >= 80 ? 'B' :
    finalScore >= 70 ? 'C' :
    finalScore >= 60 ? 'D' : 'F';

  return { grade, score: finalScore, issues };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain: rawDomain } = body;

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

    // Check certificate using TLS connection
    const certData = await new Promise<CertificateData>((resolve, reject) => {
      const options = {
        host: domain,
        port: 443,
        servername: domain,
        rejectUnauthorized: false, // Allow self-signed certs
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
          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          const now = new Date();
          const daysRemaining = Math.ceil(
            (validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          const isSelfSigned = cert.issuer?.CN === cert.subject?.CN;
          const isWildcard = cert.subject?.CN?.startsWith('*.');

          // Get certificate chain
          const chain: any[] = [];
          let currentCert = cert;
          while (currentCert.issuerCertificate && currentCert.issuerCertificate !== currentCert) {
            chain.push({
              subject: currentCert.issuerCertificate.subject?.CN || 'Unknown',
              issuer: currentCert.issuerCertificate.issuer?.CN || 'Unknown',
              validFrom: currentCert.issuerCertificate.valid_from,
              validTo: currentCert.issuerCertificate.valid_to,
            });
            currentCert = currentCert.issuerCertificate;
          }

          // Calculate security metrics
          const publicKeyBits = cert.bits || 0;
          const { grade, score, issues } = calculateSecurityGrade(
            protocol || '',
            publicKeyBits,
            cert.ext_key_usage?.join(', ') || '',
            daysRemaining,
            isSelfSigned
          );

          const result: CertificateData = {
            domain,
            valid: daysRemaining > 0,
            issuer: {
              commonName: cert.issuer?.CN || '',
              organization: cert.issuer?.O || '',
              country: cert.issuer?.C || '',
            },
            subject: {
              commonName: cert.subject?.CN || '',
              organization: cert.subject?.O,
              country: cert.subject?.C,
            },
            validFrom: validFrom.toISOString(),
            validTo: validTo.toISOString(),
            daysRemaining,
            subjectAltNames: cert.subjectaltname
              ? cert.subjectaltname.split(', ').map((s: string) => s.replace('DNS:', ''))
              : [],
            serialNumber: cert.serialNumber || '',
            fingerprint: cert.fingerprint || '',
            fingerprintSha256: cert.fingerprint256 || '',
            publicKey: {
              algorithm: cert.pubkey ? 'RSA' : 'Unknown',
              bits: publicKeyBits,
            },
            signatureAlgorithm: cert.ext_key_usage?.join(', ') || 'Unknown',
            version: 3,
            tlsVersion: protocol || 'Unknown',
            cipherSuite: cipher?.name || 'Unknown',
            certificateChain: chain,
            securityGrade: grade,
            securityScore: score,
            securityIssues: issues,
            isWildcard,
            isSelfSigned,
            isExpiringSoon: daysRemaining < 30,
          };

          socket.destroy();
          resolve(result);
        } catch (err) {
          socket.destroy();
          reject(err);
        }
      });

      socket.on('error', (err: Error) => {
        reject(err);
      });

      socket.setTimeout(20000, () => {
        socket.destroy();
        reject(new Error('Connection timeout - server took too long to respond'));
      });
    });

    return NextResponse.json<ApiResponse<CertificateData>>({
      success: true,
      data: certData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Certificate check error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check certificate',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
