// Comprehensive risk assessment engine
// Calculates risk scores based on vulnerabilities, compliance, and attack vectors

import { VulnerabilityReport } from './vulnerability-checker';
import { ComplianceAssessment } from './compliance-checker';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';

export interface AttackVector {
  id: string;
  name: string;
  likelihood: 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
  impact: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  exploitability: string;
  mitigation: string;
}

export interface RemediationAction {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  benefit: string;
}

export interface RiskAssessment {
  overallRiskScore: number;
  riskLevel: RiskLevel;
  attackVectors: AttackVector[];
  remediationActions: RemediationAction[];
  riskFactors: {
    vulnerabilities: number;
    compliance: number;
    configuration: number;
    exposure: number;
  };
  businessImpact: {
    confidentiality: RiskLevel;
    integrity: RiskLevel;
    availability: RiskLevel;
  };
}

// Calculate risk from vulnerabilities
function assessVulnerabilityRisk(vulnReport: VulnerabilityReport): {
  score: number;
  vectors: AttackVector[];
} {
  const vectors: AttackVector[] = [];
  let score = 100;

  // Critical vulnerabilities
  if (vulnReport.critical.length > 0) {
    score -= vulnReport.critical.length * 25;
    
    vulnReport.critical.forEach(vuln => {
      vectors.push({
        id: vuln.id,
        name: vuln.title,
        likelihood: 'very-high',
        impact: 'critical',
        description: vuln.description,
        exploitability: 'Publicly known exploits exist. Automated scanning tools actively detect this vulnerability.',
        mitigation: vuln.recommendation,
      });
    });
  }

  // High severity vulnerabilities
  if (vulnReport.high.length > 0) {
    score -= vulnReport.high.length * 15;
    
    vulnReport.high.forEach(vuln => {
      vectors.push({
        id: vuln.id,
        name: vuln.title,
        likelihood: 'high',
        impact: 'high',
        description: vuln.description,
        exploitability: 'Well-documented attack methods available. Requires moderate technical skill.',
        mitigation: vuln.recommendation,
      });
    });
  }

  // Medium severity vulnerabilities
  if (vulnReport.medium.length > 0) {
    score -= vulnReport.medium.length * 8;
    
    vulnReport.medium.forEach(vuln => {
      vectors.push({
        id: vuln.id,
        name: vuln.title,
        likelihood: 'medium',
        impact: 'medium',
        description: vuln.description,
        exploitability: 'Exploitation requires specific conditions or advanced techniques.',
        mitigation: vuln.recommendation,
      });
    });
  }

  return { score: Math.max(0, score), vectors };
}

// Calculate risk from compliance gaps
function assessComplianceRisk(complianceAssessment: ComplianceAssessment): {
  score: number;
  actions: RemediationAction[];
} {
  const actions: RemediationAction[] = [];
  const complianceScore = complianceAssessment.overallCompliance;

  // Generate remediation actions for non-compliant requirements
  complianceAssessment.reports.forEach(report => {
    report.requirements
      .filter(req => req.status === 'non-compliant')
      .forEach(req => {
        actions.push({
          id: req.id,
          priority: 'high',
          title: `${report.standard}: ${req.requirement}`,
          description: req.details,
          effort: 'medium',
          timeframe: '1-2 weeks',
          benefit: `Achieve ${report.standard} compliance requirement`,
        });
      });
  });

  return { score: complianceScore, actions };
}

// Assess configuration risks
function assessConfigurationRisk(certData: {
  tlsVersion: string;
  cipherSuite: string;
  publicKey: { algorithm: string; bits: number };
  daysRemaining: number;
  isExpiringSoon: boolean;
  isSelfSigned: boolean;
}): {
  score: number;
  actions: RemediationAction[];
} {
  let score = 100;
  const actions: RemediationAction[] = [];

  // TLS version scoring
  if (certData.tlsVersion === 'TLS 1.3') {
    score = 100;
  } else if (certData.tlsVersion === 'TLS 1.2') {
    score = 90;
  } else if (certData.tlsVersion === 'TLS 1.1') {
    score = 60;
    actions.push({
      id: 'CONFIG_TLS11',
      priority: 'high',
      title: 'Upgrade to TLS 1.2 or TLS 1.3',
      description: 'TLS 1.1 is deprecated and lacks modern security features',
      effort: 'medium',
      timeframe: '1 week',
      benefit: 'Prevent protocol downgrade attacks and enable modern cipher suites',
    });
  } else if (certData.tlsVersion === 'TLS 1.0') {
    score = 40;
    actions.push({
      id: 'CONFIG_TLS10',
      priority: 'critical',
      title: 'Upgrade to TLS 1.2 or TLS 1.3 immediately',
      description: 'TLS 1.0 has known vulnerabilities (BEAST, CRIME) and is no longer considered secure',
      effort: 'medium',
      timeframe: 'Immediate',
      benefit: 'Protect against known protocol-level attacks',
    });
  } else if (certData.tlsVersion.includes('SSL')) {
    score = 10;
    actions.push({
      id: 'CONFIG_SSL',
      priority: 'critical',
      title: 'Disable SSL protocols immediately',
      description: 'SSL 2.0 and SSL 3.0 are critically vulnerable and must not be used',
      effort: 'low',
      timeframe: 'Immediate',
      benefit: 'Prevent POODLE, DROWN, and other SSL-specific attacks',
    });
  }

  // Key size scoring
  if (certData.publicKey.bits < 2048) {
    score -= 20;
    actions.push({
      id: 'CONFIG_KEYSIZE',
      priority: 'high',
      title: 'Upgrade to 2048-bit or 4096-bit keys',
      description: `Current ${certData.publicKey.bits}-bit key size is below industry standards`,
      effort: 'high',
      timeframe: '2-4 weeks',
      benefit: 'Meet compliance requirements and protect against brute-force attacks',
    });
  }

  // Expiration management
  if (certData.isExpiringSoon) {
    score -= 15;
    actions.push({
      id: 'CONFIG_EXPIRING',
      priority: 'high',
      title: 'Renew certificate before expiration',
      description: `Certificate expires in ${certData.daysRemaining} days`,
      effort: 'low',
      timeframe: 'This week',
      benefit: 'Prevent service disruption and maintain user trust',
    });
  }

  // Self-signed certificate
  if (certData.isSelfSigned) {
    score -= 25;
    actions.push({
      id: 'CONFIG_SELFSIGNED',
      priority: 'critical',
      title: 'Replace self-signed certificate with CA-issued certificate',
      description: 'Self-signed certificates trigger browser warnings and are not trusted by default',
      effort: 'low',
      timeframe: '1-2 days',
      benefit: 'Eliminate browser warnings and establish trust with users',
    });
  }

  return { score: Math.max(0, score), actions };
}

// Assess exposure risk
function assessExposureRisk(certData: {
  subjectAltNames: string[];
  isWildcard: boolean;
}, subdomainCount: number): {
  score: number;
  actions: RemediationAction[];
} {
  let score = 100;
  const actions: RemediationAction[] = [];

  // Wildcard certificate risk
  if (certData.isWildcard) {
    score -= 10;
    actions.push({
      id: 'EXPOSURE_WILDCARD',
      priority: 'medium',
      title: 'Review wildcard certificate usage',
      description: 'Wildcard certificates increase attack surface if private key is compromised',
      effort: 'medium',
      timeframe: '2-4 weeks',
      benefit: 'Limit blast radius of potential key compromise',
    });
  }

  // Large number of SANs
  if (certData.subjectAltNames.length > 10) {
    score -= 5;
  }

  // Many discovered subdomains
  if (subdomainCount > 20) {
    score -= 15;
    actions.push({
      id: 'EXPOSURE_SUBDOMAINS',
      priority: 'medium',
      title: 'Audit and secure all subdomains',
      description: `${subdomainCount} subdomains discovered. Each is a potential entry point.`,
      effort: 'high',
      timeframe: '4-8 weeks',
      benefit: 'Reduce attack surface and prevent subdomain takeover',
    });
  }

  return { score: Math.max(0, score), actions };
}

// Comprehensive risk assessment
export function performRiskAssessment(
  vulnReport: VulnerabilityReport,
  complianceAssessment: ComplianceAssessment,
  certData: {
    tlsVersion: string;
    cipherSuite: string;
    publicKey: { algorithm: string; bits: number };
    daysRemaining: number;
    isExpiringSoon: boolean;
    isSelfSigned: boolean;
    subjectAltNames: string[];
    isWildcard: boolean;
  },
  subdomainCount: number
): RiskAssessment {
  // Calculate component scores
  const vulnRisk = assessVulnerabilityRisk(vulnReport);
  const complianceRisk = assessComplianceRisk(complianceAssessment);
  const configRisk = assessConfigurationRisk(certData);
  const exposureRisk = assessExposureRisk(certData, subdomainCount);

  // Weighted risk calculation (lower is worse)
  const riskFactors = {
    vulnerabilities: vulnRisk.score,
    compliance: complianceRisk.score,
    configuration: configRisk.score,
    exposure: exposureRisk.score,
  };

  const overallRiskScore = Math.round(
    (vulnRisk.score * 0.35) + // Vulnerabilities: 35%
    (complianceRisk.score * 0.25) + // Compliance: 25%
    (configRisk.score * 0.25) + // Configuration: 25%
    (exposureRisk.score * 0.15) // Exposure: 15%
  );

  // Determine risk level
  let riskLevel: RiskLevel;
  if (overallRiskScore >= 90) riskLevel = 'minimal';
  else if (overallRiskScore >= 75) riskLevel = 'low';
  else if (overallRiskScore >= 60) riskLevel = 'medium';
  else if (overallRiskScore >= 40) riskLevel = 'high';
  else riskLevel = 'critical';

  // Combine remediation actions and sort by priority
  const allActions = [
    ...complianceRisk.actions,
    ...configRisk.actions,
    ...exposureRisk.actions,
  ];

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedActions = allActions.sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  // Assess business impact
  const businessImpact = {
    confidentiality: calculateImpact(vulnRisk.score, complianceRisk.score),
    integrity: calculateImpact(configRisk.score, vulnRisk.score),
    availability: calculateImpact(configRisk.score, exposureRisk.score),
  };

  return {
    overallRiskScore,
    riskLevel,
    attackVectors: vulnRisk.vectors,
    remediationActions: sortedActions,
    riskFactors,
    businessImpact,
  };
}

function calculateImpact(score1: number, score2: number): RiskLevel {
  const avg = (score1 + score2) / 2;
  if (avg >= 90) return 'minimal';
  if (avg >= 75) return 'low';
  if (avg >= 60) return 'medium';
  if (avg >= 40) return 'high';
  return 'critical';
}
