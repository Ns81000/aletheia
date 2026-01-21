import { CertificateData } from '@/types/certificate';
import { differenceInDays } from 'date-fns';

export interface ScoreItem {
  category: string;
  score: number;
  maxScore: number;
  description: string;
  details: string[];
}

export function calculateScoreBreakdown(certData: CertificateData): {
  items: ScoreItem[];
  totalScore: number;
  maxTotalScore: number;
} {
  const items: ScoreItem[] = [];

  // 1. Protocol Security (25 points)
  let protocolScore = 0;
  const protocolDetails: string[] = [];
  
  if (certData.tlsVersion === 'TLS 1.3') {
    protocolScore = 25;
    protocolDetails.push('Using latest TLS 1.3 protocol');
  } else if (certData.tlsVersion === 'TLS 1.2') {
    protocolScore = 20;
    protocolDetails.push('Using secure TLS 1.2 protocol');
  } else if (certData.tlsVersion === 'TLS 1.1') {
    protocolScore = 10;
    protocolDetails.push('Using outdated TLS 1.1 protocol');
  } else {
    protocolScore = 0;
    protocolDetails.push('Using insecure or outdated protocol');
  }

  items.push({
    category: 'Protocol Security',
    score: protocolScore,
    maxScore: 25,
    description: 'Evaluation of the TLS/SSL protocol version in use',
    details: protocolDetails
  });

  // 2. Encryption Strength (25 points)
  let encryptionScore = 0;
  const encryptionDetails: string[] = [];

  if (certData.publicKey.bits >= 4096) {
    encryptionScore = 25;
    encryptionDetails.push('Exceptional key size (4096+ bits)');
  } else if (certData.publicKey.bits >= 2048) {
    encryptionScore = 20;
    encryptionDetails.push('Strong key size (2048+ bits)');
  } else if (certData.publicKey.bits >= 1024) {
    encryptionScore = 10;
    encryptionDetails.push('Weak key size (1024 bits)');
  } else {
    encryptionScore = 0;
    encryptionDetails.push('Insecure key size');
  }

  // Algorithm bonus
  if (certData.publicKey.algorithm === 'RSA' || certData.publicKey.algorithm === 'ECDSA') {
    encryptionDetails.push(`Modern ${certData.publicKey.algorithm} algorithm`);
  }

  items.push({
    category: 'Encryption Strength',
    score: encryptionScore,
    maxScore: 25,
    description: 'Assessment of key size and cryptographic algorithms',
    details: encryptionDetails
  });

  // 3. Certificate Authority Trust (20 points)
  let trustScore = 0;
  const trustDetails: string[] = [];

  if (!certData.isSelfSigned) {
    trustScore = 20;
    trustDetails.push('Issued by trusted Certificate Authority');
    trustDetails.push(`CA: ${certData.issuer.organization}`);
  } else {
    trustScore = 0;
    trustDetails.push('Self-signed certificate (not trusted)');
  }

  items.push({
    category: 'Certificate Authority Trust',
    score: trustScore,
    maxScore: 20,
    description: 'Verification of certificate issuer trustworthiness',
    details: trustDetails
  });

  // 4. Certificate Validity (15 points)
  let validityScore = 0;
  const validityDetails: string[] = [];
  const validityDays = differenceInDays(
    new Date(certData.validTo),
    new Date(certData.validFrom)
  );

  if (certData.daysRemaining > 30) {
    validityScore = 15;
    validityDetails.push(`Valid for ${certData.daysRemaining} more days`);
  } else if (certData.daysRemaining > 7) {
    validityScore = 10;
    validityDetails.push(`Expires soon (${certData.daysRemaining} days remaining)`);
  } else if (certData.daysRemaining > 0) {
    validityScore = 5;
    validityDetails.push(`Expires very soon (${certData.daysRemaining} days remaining)`);
  } else {
    validityScore = 0;
    validityDetails.push('Certificate has expired');
  }

  // Validity period assessment
  if (validityDays <= 398) {
    validityDetails.push('Appropriate validity period (≤398 days)');
  } else {
    validityDetails.push('Excessive validity period');
  }

  items.push({
    category: 'Certificate Validity',
    score: validityScore,
    maxScore: 15,
    description: 'Current validity status and expiration timeline',
    details: validityDetails
  });

  // 5. Configuration & Best Practices (15 points)
  let configScore = 0;
  const configDetails: string[] = [];

  // Check signature algorithm
  if (certData.signatureAlgorithm.includes('SHA256') || 
      certData.signatureAlgorithm.includes('SHA384') || 
      certData.signatureAlgorithm.includes('SHA512')) {
    configScore += 5;
    configDetails.push('Using secure SHA-2 signature algorithm');
  } else {
    configDetails.push('Weak signature algorithm detected');
  }

  // Check for wildcard (neutral)
  if (certData.isWildcard) {
    configScore += 3;
    configDetails.push('Wildcard certificate supports subdomains');
  }

  // Check for Subject Alternative Names
  if (certData.subjectAltNames && certData.subjectAltNames.length > 1) {
    configScore += 3;
    configDetails.push(`${certData.subjectAltNames.length} domains protected`);
  }

  // No security issues
  if (certData.securityIssues.length === 0) {
    configScore += 4;
    configDetails.push('No security issues detected');
  } else {
    configDetails.push(`${certData.securityIssues.length} security issue(s) found`);
  }

  items.push({
    category: 'Configuration & Best Practices',
    score: configScore,
    maxScore: 15,
    description: 'Adherence to security standards and recommendations',
    details: configDetails
  });

  const totalScore = items.reduce((sum, item) => sum + item.score, 0);
  const maxTotalScore = items.reduce((sum, item) => sum + item.maxScore, 0);

  return {
    items,
    totalScore,
    maxTotalScore
  };
}
