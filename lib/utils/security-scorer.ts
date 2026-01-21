export interface SecurityScore {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  issues: string[];
}

/**
 * Calculate security grade based on certificate properties
 */
export function calculateSecurityGrade(cert: {
  tlsVersion?: string;
  publicKey: { algorithm: string; bits: number };
  daysRemaining: number;
  isSelfSigned: boolean;
  signatureAlgorithm: string;
  certificateChain?: unknown[];
}): SecurityScore {
  let score = 100;
  const issues: string[] = [];

  // Check TLS version (20 points)
  if (cert.tlsVersion) {
    if (!cert.tlsVersion.includes('1.3') && !cert.tlsVersion.includes('1.2')) {
      score -= 20;
      issues.push('Using outdated TLS version (older than TLS 1.2)');
    } else if (!cert.tlsVersion.includes('1.3')) {
      score -= 5;
      issues.push('Not using TLS 1.3 (latest version)');
    }
  }

  // Check key size (25 points)
  if (cert.publicKey.algorithm === 'RSA') {
    if (cert.publicKey.bits < 2048) {
      score -= 25;
      issues.push('RSA key size is less than 2048 bits (insecure)');
    } else if (cert.publicKey.bits < 4096) {
      score -= 5;
      issues.push('RSA key size could be stronger (consider 4096 bits)');
    }
  } else if (cert.publicKey.algorithm === 'EC' || cert.publicKey.algorithm.startsWith('EC')) {
    if (cert.publicKey.bits < 256) {
      score -= 20;
      issues.push('ECC key size is less than 256 bits');
    }
  }

  // Check expiration (15 points)
  if (cert.daysRemaining < 0) {
    score -= 50;
    issues.push('Certificate has expired!');
  } else if (cert.daysRemaining < 7) {
    score -= 15;
    issues.push('Certificate expires in less than 7 days');
  } else if (cert.daysRemaining < 30) {
    score -= 5;
    issues.push('Certificate expires in less than 30 days');
  }

  // Check self-signed (50 points)
  if (cert.isSelfSigned) {
    score -= 50;
    issues.push('Self-signed certificate (not trusted by browsers)');
  }

  // Check signature algorithm (30 points)
  if (cert.signatureAlgorithm.toLowerCase().includes('sha1')) {
    score -= 30;
    issues.push('Using deprecated SHA-1 signature algorithm');
  } else if (cert.signatureAlgorithm.toLowerCase().includes('md5')) {
    score -= 40;
    issues.push('Using insecure MD5 signature algorithm');
  }

  // Check certificate chain
  if (cert.certificateChain && cert.certificateChain.length === 0) {
    score -= 10;
    issues.push('No certificate chain found');
  }

  // Calculate final grade
  const finalScore = Math.max(0, score);
  const grade: SecurityScore['grade'] =
    finalScore >= 97 ? 'A+' :
    finalScore >= 90 ? 'A' :
    finalScore >= 80 ? 'B' :
    finalScore >= 70 ? 'C' :
    finalScore >= 60 ? 'D' : 'F';

  return { grade, score: finalScore, issues };
}

/**
 * Get color for security grade
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'text-green-600 dark:text-green-400';
    case 'B':
      return 'text-blue-600 dark:text-blue-400';
    case 'C':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'D':
      return 'text-orange-600 dark:text-orange-400';
    case 'F':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

/**
 * Get background color for security grade
 */
export function getGradeBgColor(grade: string): string {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'bg-green-100 dark:bg-green-900/20';
    case 'B':
      return 'bg-blue-100 dark:bg-blue-900/20';
    case 'C':
      return 'bg-yellow-100 dark:bg-yellow-900/20';
    case 'D':
      return 'bg-orange-100 dark:bg-orange-900/20';
    case 'F':
      return 'bg-red-100 dark:bg-red-900/20';
    default:
      return 'bg-gray-100 dark:bg-gray-900/20';
  }
}
