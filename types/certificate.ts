export interface CertificateIssuer {
  commonName: string;
  organization: string;
  country: string;
}

export interface CertificateSubject {
  commonName: string;
  organization?: string;
  country?: string;
}

export interface PublicKeyInfo {
  algorithm: string;
  bits: number;
}

export interface ChainCertificate {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
}

export interface CertificateData {
  domain: string;
  valid: boolean;
  issuer: CertificateIssuer;
  subject: CertificateSubject;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  subjectAltNames: string[];
  serialNumber: string;
  fingerprint: string;
  fingerprintSha256: string;
  publicKey: PublicKeyInfo;
  signatureAlgorithm: string;
  version: number;
  tlsVersion: string;
  cipherSuite: string;
  certificateChain: ChainCertificate[];
  securityGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  securityScore: number;
  securityIssues: string[];
  isWildcard: boolean;
  isSelfSigned: boolean;
  isExpiringSoon: boolean;
}

export interface CTLogCertificate {
  id: string;
  loggedAt: string;
  notBefore: string;
  notAfter: string;
  issuer: {
    commonName: string;
    organization: string;
  };
  commonName: string;
  subjectAltNames: string[];
  serialNumber: string;
  isCurrent: boolean;
  isExpired: boolean;
}

export interface RenewalPattern {
  detected: boolean;
  intervalDays?: number;
  isAutomated?: boolean;
}

export interface IssuerHistory {
  issuer: string;
  firstSeen: string;
  lastSeen: string;
  count: number;
}

export interface CTLogStats {
  averageValidityDays: number;
  mostRecentIssuer: string;
  certificateAuthorities: string[];
}

export interface CTLogData {
  domain: string;
  totalCertificates: number;
  certificates: CTLogCertificate[];
  subdomains: string[];
  renewalPattern: RenewalPattern;
  issuerHistory: IssuerHistory[];
  stats: CTLogStats;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  cached?: boolean;
}
