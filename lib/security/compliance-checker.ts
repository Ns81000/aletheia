// Compliance validation for industry standards
// Checks against PCI DSS, HIPAA, GDPR, SOC 2 requirements

export type ComplianceStandard = 'PCI DSS' | 'HIPAA' | 'GDPR' | 'SOC 2';

export interface ComplianceRequirement {
  id: string;
  standard: ComplianceStandard;
  requirement: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
  details: string;
  reference?: string;
}

export interface ComplianceReport {
  standard: ComplianceStandard;
  compliantRequirements: number;
  totalRequirements: number;
  complianceScore: number;
  requirements: ComplianceRequirement[];
  overallStatus: 'compliant' | 'non-compliant' | 'partial';
}

// PCI DSS Requirements
// Payment Card Industry Data Security Standard
// https://www.pcisecuritystandards.org/
function checkPCIDSS(certData: {
  tlsVersion: string;
  cipherSuite: string;
  publicKey: { algorithm: string; bits: number };
  signatureAlgorithm: string;
  validTo: string;
  isExpiringSoon: boolean;
}): ComplianceReport {
  const requirements: ComplianceRequirement[] = [];

  // Requirement 4.1: Use strong cryptography for transmission
  const tlsCompliant = certData.tlsVersion === 'TLS 1.2' || certData.tlsVersion === 'TLS 1.3';
  requirements.push({
    id: 'PCI-4.1',
    standard: 'PCI DSS',
    requirement: 'Strong Encryption for Data Transmission',
    description: 'Use TLS 1.2 or higher for all transmission of cardholder data over open networks',
    status: tlsCompliant ? 'compliant' : 'non-compliant',
    details: tlsCompliant
      ? `Using ${certData.tlsVersion}, which meets PCI DSS requirements`
      : `Using ${certData.tlsVersion}. PCI DSS requires TLS 1.2 or TLS 1.3`,
    reference: 'PCI DSS Requirement 4.1',
  });

  // Requirement 4.1.1: Strong cipher suites
  const weakCiphers = ['RC4', 'DES', '3DES', 'NULL', 'ANON', 'EXPORT'];
  const hasWeakCipher = weakCiphers.some(weak => certData.cipherSuite.toUpperCase().includes(weak));
  requirements.push({
    id: 'PCI-4.1.1',
    standard: 'PCI DSS',
    requirement: 'No Weak Cipher Suites',
    description: 'Do not use weak cryptographic algorithms such as DES, 3DES, RC4',
    status: hasWeakCipher ? 'non-compliant' : 'compliant',
    details: hasWeakCipher
      ? `Weak cipher detected: ${certData.cipherSuite}`
      : 'No weak ciphers detected in cipher suite',
    reference: 'PCI DSS Requirement 4.1.1',
  });

  // Requirement 4.1.2: Minimum key strength
  const keyCompliant = certData.publicKey.bits >= 2048;
  requirements.push({
    id: 'PCI-4.1.2',
    standard: 'PCI DSS',
    requirement: 'Minimum 2048-bit Key Size',
    description: 'Use a minimum of 2048-bit RSA keys or equivalent strength',
    status: keyCompliant ? 'compliant' : 'non-compliant',
    details: keyCompliant
      ? `Using ${certData.publicKey.bits}-bit ${certData.publicKey.algorithm} key`
      : `Using ${certData.publicKey.bits}-bit key. PCI DSS requires minimum 2048-bit`,
    reference: 'PCI DSS Requirement 4.1.2',
  });

  // Requirement 6.5.4: Secure certificate management
  requirements.push({
    id: 'PCI-6.5.4',
    standard: 'PCI DSS',
    requirement: 'Certificate Expiration Management',
    description: 'Monitor and manage certificate expiration dates',
    status: certData.isExpiringSoon ? 'partial' : 'compliant',
    details: certData.isExpiringSoon
      ? 'Certificate is expiring soon. Renew before expiration.'
      : 'Certificate expiration is being properly managed',
    reference: 'PCI DSS Requirement 6.5.4',
  });

  // Requirement 4.1.3: No weak signature algorithms
  const weakSignatures = ['MD5', 'SHA-1', 'SHA1'];
  const hasWeakSignature = weakSignatures.some(weak => certData.signatureAlgorithm.toUpperCase().includes(weak));
  requirements.push({
    id: 'PCI-4.1.3',
    standard: 'PCI DSS',
    requirement: 'Strong Signature Algorithms',
    description: 'Use SHA-256 or stronger signature algorithms',
    status: hasWeakSignature ? 'non-compliant' : 'compliant',
    details: hasWeakSignature
      ? `Weak signature algorithm: ${certData.signatureAlgorithm}`
      : `Using ${certData.signatureAlgorithm}, which is acceptable`,
    reference: 'PCI DSS Requirement 4.1.3',
  });

  const compliantCount = requirements.filter(r => r.status === 'compliant').length;
  const totalCount = requirements.length;
  const complianceScore = Math.round((compliantCount / totalCount) * 100);

  return {
    standard: 'PCI DSS',
    compliantRequirements: compliantCount,
    totalRequirements: totalCount,
    complianceScore,
    requirements,
    overallStatus: complianceScore === 100 ? 'compliant' : complianceScore >= 75 ? 'partial' : 'non-compliant',
  };
}

// HIPAA Requirements
// Health Insurance Portability and Accountability Act
// https://www.hhs.gov/hipaa/
function checkHIPAA(certData: {
  tlsVersion: string;
  cipherSuite: string;
  publicKey: { algorithm: string; bits: number };
  signatureAlgorithm: string;
  isExpiringSoon: boolean;
}): ComplianceReport {
  const requirements: ComplianceRequirement[] = [];

  // 164.312(e)(1): Transmission security
  const tlsCompliant = certData.tlsVersion === 'TLS 1.2' || certData.tlsVersion === 'TLS 1.3';
  requirements.push({
    id: 'HIPAA-164.312(e)(1)',
    standard: 'HIPAA',
    requirement: 'Transmission Security',
    description: 'Implement technical security measures to guard against unauthorized access to ePHI transmitted over electronic networks',
    status: tlsCompliant ? 'compliant' : 'non-compliant',
    details: tlsCompliant
      ? `Using ${certData.tlsVersion} for secure transmission`
      : `Using ${certData.tlsVersion}. HIPAA requires TLS 1.2 or higher`,
    reference: '45 CFR § 164.312(e)(1)',
  });

  // 164.312(e)(2)(i): Integrity controls
  const hasIntegrity = !certData.cipherSuite.toUpperCase().includes('NULL') && 
                        !certData.cipherSuite.toUpperCase().includes('EXPORT');
  requirements.push({
    id: 'HIPAA-164.312(e)(2)(i)',
    standard: 'HIPAA',
    requirement: 'Integrity Controls',
    description: 'Implement security measures to ensure ePHI is not improperly altered or destroyed',
    status: hasIntegrity ? 'compliant' : 'non-compliant',
    details: hasIntegrity
      ? 'Cipher suite provides integrity protection'
      : 'Cipher suite lacks proper integrity controls',
    reference: '45 CFR § 164.312(e)(2)(i)',
  });

  // 164.312(e)(2)(ii): Encryption
  const hasEncryption = certData.publicKey.bits >= 2048 &&
                         !['RC4', 'DES', 'NULL'].some(weak => certData.cipherSuite.toUpperCase().includes(weak));
  requirements.push({
    id: 'HIPAA-164.312(e)(2)(ii)',
    standard: 'HIPAA',
    requirement: 'Encryption',
    description: 'Implement a mechanism to encrypt ePHI whenever deemed appropriate',
    status: hasEncryption ? 'compliant' : 'non-compliant',
    details: hasEncryption
      ? `Strong encryption with ${certData.publicKey.bits}-bit keys`
      : 'Encryption strength does not meet HIPAA guidelines',
    reference: '45 CFR § 164.312(e)(2)(ii)',
  });

  // 164.308(a)(7)(ii)(A): Data backup and storage
  requirements.push({
    id: 'HIPAA-164.308(a)(7)(ii)(A)',
    standard: 'HIPAA',
    requirement: 'Data Backup Plan',
    description: 'Establish procedures to create and maintain retrievable exact copies of ePHI',
    status: 'not-applicable',
    details: 'Certificate validation does not assess backup procedures',
    reference: '45 CFR § 164.308(a)(7)(ii)(A)',
  });

  const compliantCount = requirements.filter(r => r.status === 'compliant').length;
  const applicableCount = requirements.filter(r => r.status !== 'not-applicable').length;
  const complianceScore = applicableCount > 0 ? Math.round((compliantCount / applicableCount) * 100) : 0;

  return {
    standard: 'HIPAA',
    compliantRequirements: compliantCount,
    totalRequirements: applicableCount,
    complianceScore,
    requirements,
    overallStatus: complianceScore === 100 ? 'compliant' : complianceScore >= 75 ? 'partial' : 'non-compliant',
  };
}

// GDPR Requirements
// General Data Protection Regulation
// https://gdpr-info.eu/
function checkGDPR(certData: {
  tlsVersion: string;
  cipherSuite: string;
  publicKey: { algorithm: string; bits: number };
}): ComplianceReport {
  const requirements: ComplianceRequirement[] = [];

  // Article 32: Security of processing
  const hasSecureProcessing = (certData.tlsVersion === 'TLS 1.2' || certData.tlsVersion === 'TLS 1.3') &&
                               certData.publicKey.bits >= 2048;
  requirements.push({
    id: 'GDPR-32',
    standard: 'GDPR',
    requirement: 'Security of Processing',
    description: 'Implement appropriate technical measures including encryption of personal data',
    status: hasSecureProcessing ? 'compliant' : 'non-compliant',
    details: hasSecureProcessing
      ? 'Encryption meets GDPR security standards'
      : 'Encryption does not meet GDPR Article 32 requirements',
    reference: 'GDPR Article 32',
  });

  // Article 32(1)(a): Pseudonymisation and encryption
  const hasEncryption = !['RC4', 'DES', 'NULL', 'EXPORT'].some(weak => 
    certData.cipherSuite.toUpperCase().includes(weak)
  );
  requirements.push({
    id: 'GDPR-32(1)(a)',
    standard: 'GDPR',
    requirement: 'Encryption of Personal Data',
    description: 'The encryption of personal data as appropriate',
    status: hasEncryption ? 'compliant' : 'non-compliant',
    details: hasEncryption
      ? 'Strong encryption algorithms in use'
      : 'Weak encryption detected. GDPR requires appropriate encryption',
    reference: 'GDPR Article 32(1)(a)',
  });

  // Article 32(1)(b): Confidentiality
  requirements.push({
    id: 'GDPR-32(1)(b)',
    standard: 'GDPR',
    requirement: 'Ongoing Confidentiality',
    description: 'Ability to ensure ongoing confidentiality of processing systems and services',
    status: 'partial',
    details: 'Certificate provides confidentiality but requires regular monitoring',
    reference: 'GDPR Article 32(1)(b)',
  });

  // Article 25: Data protection by design
  requirements.push({
    id: 'GDPR-25',
    standard: 'GDPR',
    requirement: 'Data Protection by Design',
    description: 'Implement appropriate technical measures to ensure data protection principles',
    status: 'not-applicable',
    details: 'Certificate validation does not assess design-level protections',
    reference: 'GDPR Article 25',
  });

  const compliantCount = requirements.filter(r => r.status === 'compliant').length;
  const applicableCount = requirements.filter(r => r.status !== 'not-applicable').length;
  const complianceScore = applicableCount > 0 ? Math.round((compliantCount / applicableCount) * 100) : 0;

  return {
    standard: 'GDPR',
    compliantRequirements: compliantCount,
    totalRequirements: applicableCount,
    complianceScore,
    requirements,
    overallStatus: complianceScore === 100 ? 'compliant' : complianceScore >= 75 ? 'partial' : 'non-compliant',
  };
}

// SOC 2 Requirements
// System and Organization Controls
// https://us.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report
function checkSOC2(certData: {
  tlsVersion: string;
  cipherSuite: string;
  publicKey: { algorithm: string; bits: number };
  signatureAlgorithm: string;
  isExpiringSoon: boolean;
}): ComplianceReport {
  const requirements: ComplianceRequirement[] = [];

  // CC6.1: Logical and physical access controls
  const hasAccessControls = (certData.tlsVersion === 'TLS 1.2' || certData.tlsVersion === 'TLS 1.3');
  requirements.push({
    id: 'SOC2-CC6.1',
    standard: 'SOC 2',
    requirement: 'Logical and Physical Access Controls',
    description: 'Implement controls to restrict access to sensitive data',
    status: hasAccessControls ? 'compliant' : 'non-compliant',
    details: hasAccessControls
      ? `Access controls enforced via ${certData.tlsVersion}`
      : 'Insufficient access controls. SOC 2 requires modern TLS',
    reference: 'SOC 2 Trust Service Criteria CC6.1',
  });

  // CC6.6: Encryption of data in transit
  const encryptionStrength = certData.publicKey.bits >= 2048 &&
                             !['RC4', 'DES', 'NULL'].some(weak => certData.cipherSuite.toUpperCase().includes(weak));
  requirements.push({
    id: 'SOC2-CC6.6',
    standard: 'SOC 2',
    requirement: 'Encryption of Data in Transit',
    description: 'Protect data in transit using encryption',
    status: encryptionStrength ? 'compliant' : 'non-compliant',
    details: encryptionStrength
      ? 'Strong encryption protects data in transit'
      : 'Weak encryption detected. SOC 2 requires strong cryptography',
    reference: 'SOC 2 Trust Service Criteria CC6.6',
  });

  // CC6.7: Transmission security
  const hasSecureTransmission = !certData.signatureAlgorithm.toUpperCase().includes('MD5') &&
                                 !certData.signatureAlgorithm.toUpperCase().includes('SHA-1');
  requirements.push({
    id: 'SOC2-CC6.7',
    standard: 'SOC 2',
    requirement: 'Secure Data Transmission',
    description: 'Implement measures to protect data during transmission',
    status: hasSecureTransmission ? 'compliant' : 'partial',
    details: hasSecureTransmission
      ? 'Secure signature algorithms protect transmission integrity'
      : 'Weak signature algorithm. Consider upgrading to SHA-256 or higher',
    reference: 'SOC 2 Trust Service Criteria CC6.7',
  });

  // CC7.2: System monitoring
  requirements.push({
    id: 'SOC2-CC7.2',
    standard: 'SOC 2',
    requirement: 'System Monitoring',
    description: 'Monitor system components and detect anomalies',
    status: certData.isExpiringSoon ? 'partial' : 'compliant',
    details: certData.isExpiringSoon
      ? 'Certificate expiring soon. Monitoring should trigger renewal'
      : 'Certificate monitoring appears adequate',
    reference: 'SOC 2 Trust Service Criteria CC7.2',
  });

  const compliantCount = requirements.filter(r => r.status === 'compliant').length;
  const totalCount = requirements.length;
  const complianceScore = Math.round((compliantCount / totalCount) * 100);

  return {
    standard: 'SOC 2',
    compliantRequirements: compliantCount,
    totalRequirements: totalCount,
    complianceScore,
    requirements,
    overallStatus: complianceScore === 100 ? 'compliant' : complianceScore >= 75 ? 'partial' : 'non-compliant',
  };
}

// Comprehensive compliance check
export interface ComplianceAssessment {
  reports: ComplianceReport[];
  overallCompliance: number;
  criticalIssues: string[];
}

export function performComplianceCheck(certData: {
  tlsVersion: string;
  cipherSuite: string;
  publicKey: { algorithm: string; bits: number };
  signatureAlgorithm: string;
  validTo: string;
  isExpiringSoon: boolean;
}): ComplianceAssessment {
  const reports: ComplianceReport[] = [
    checkPCIDSS(certData),
    checkHIPAA(certData),
    checkGDPR(certData),
    checkSOC2(certData),
  ];

  const totalScore = reports.reduce((sum, report) => sum + report.complianceScore, 0);
  const overallCompliance = Math.round(totalScore / reports.length);

  const criticalIssues: string[] = [];
  reports.forEach(report => {
    report.requirements
      .filter(req => req.status === 'non-compliant')
      .forEach(req => {
        criticalIssues.push(`${report.standard}: ${req.requirement}`);
      });
  });

  return {
    reports,
    overallCompliance,
    criticalIssues,
  };
}
