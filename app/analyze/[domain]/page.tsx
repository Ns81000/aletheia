'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { ArrowLeft, Download } from 'lucide-react';
import { CertificateData, CTLogData, ApiResponse } from '@/types/certificate';
import Section from '@/components/dossier/Section';
import DataGrid from '@/components/dossier/DataGrid';
import Explanation from '@/components/dossier/Explanation';
import Timeline from '@/components/dossier/Timeline';
import Comparison from '@/components/dossier/Comparison';
import ScoreBreakdown from '@/components/dossier/ScoreBreakdown';
import { format } from 'date-fns';
import { generatePDFReport } from '@/lib/utils/pdf-export';
import { calculateScoreBreakdown } from '@/lib/utils/score-calculator';
import { performComprehensiveCheck } from '@/lib/security/vulnerability-checker';
import { VulnerabilityReport } from '@/components/results/VulnerabilityReport';
import { performComplianceCheck } from '@/lib/security/compliance-checker';
import { ComplianceReportComponent } from '@/components/results/ComplianceReport';
import { performRiskAssessment } from '@/lib/security/risk-assessment';
import { RiskAssessmentReport } from '@/components/results/RiskAssessmentReport';

export default function AnalyzePage() {
  const params = useParams();
  const router = useRouter();
  const domain = params.domain as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [ctData, setCTData] = useState<CTLogData | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing...');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!certData) return;
    
    try {
      setIsExporting(true);
      await generatePDFReport(domain, certData, ctData);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (!domain) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Stage 1: Check certificate
        setStage('Connecting to server...');
        setProgress(25);

        const certResponse = await fetch('/api/check-cert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain }),
        });

        const certResult: ApiResponse<CertificateData> = await certResponse.json();

        if (certResult.success && certResult.data) {
          setCertData(certResult.data);
          setProgress(50);
        }

        // Stage 2: Query CT logs
        setStage('Querying Certificate Transparency logs...');
        setProgress(75);

        const ctResponse = await fetch('/api/ct-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, includeSubdomains: true }),
        });

        const ctResult: ApiResponse<CTLogData> = await ctResponse.json();

        if (ctResult.success && ctResult.data) {
          setCTData(ctResult.data);
        }

        setProgress(100);
        setStage('Complete');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching certificate data:', err);
        setError('Failed to analyze certificate. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [domain]);

  if (loading) {
    return (
      <Container>
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="w-full max-w-md text-center">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">{stage}</h2>
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full bg-black dark:bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyzing {domain}...
            </p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-2 text-2xl font-semibold">Error</h2>
            <p className="mb-6 text-light-text-secondary dark:text-dark-text-secondary">
              {error}
            </p>
            <button
              onClick={() => router.push('/')}
              className="rounded-lg bg-light-accent px-6 py-3 text-white transition-colors hover:bg-light-text dark:bg-dark-accent dark:hover:bg-dark-text"
            >
              Try Another Domain
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header with Actions */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 dark:border-gray-800">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-body-sm">Back to Search</span>
          </button>
          
          <button 
            onClick={handleExportPDF}
            disabled={isExporting || !certData}
            className="flex items-center gap-2 rounded-lg border border-black bg-black px-4 py-2 text-body-sm text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
        </div>

        {/* Report Header */}
        <div className="mb-12 space-y-2">
          <h1 className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Security Intelligence Report
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-display-2 font-bold tracking-tight text-black dark:text-white break-words">
            {domain}
          </h2>
          <p className="text-body-sm text-gray-500 dark:text-gray-500">
            Generated: {format(new Date(), 'MMMM dd, yyyy HH:mm')} UTC
          </p>
        </div>

        {/* Dossier Sections */}
        <div className="space-y-16">
          {/* Executive Summary */}
          {certData && (
            <Section number="EXECUTIVE SUMMARY" title="">
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 md:p-8 dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-baseline gap-4">
                  <div>
                    <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Security Grade
                    </div>
                    <div className="text-5xl sm:text-6xl font-bold tracking-tight text-black dark:text-white">
                      {certData.securityGrade}
                    </div>
                  </div>
                  <div>
                    <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Overall Score
                    </div>
                    <div className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                      {certData.securityScore}/100
                    </div>
                  </div>
                </div>

                <p className="mb-6 text-body leading-relaxed text-gray-700 dark:text-gray-300">
                  This certificate demonstrates {certData.securityGrade === 'A+' || certData.securityGrade === 'A' ? 'strong' : certData.securityGrade === 'B' || certData.securityGrade === 'C' ? 'adequate' : 'weak'} security practices with {certData.tlsVersion.includes('1.3') ? 'modern' : 'acceptable'} cryptographic standards.
                </p>

                <div className="space-y-2">
                  <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Key Findings
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-body-sm text-gray-700 dark:text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black dark:bg-white" />
                      {certData.tlsVersion} protocol in use
                    </li>
                    <li className="flex items-start gap-2 text-body-sm text-gray-700 dark:text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black dark:bg-white" />
                      {certData.publicKey.bits}-bit {certData.publicKey.algorithm} encryption
                    </li>
                    <li className="flex items-start gap-2 text-body-sm text-gray-700 dark:text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black dark:bg-white" />
                      Valid for {certData.daysRemaining} more days
                    </li>
                    <li className="flex items-start gap-2 text-body-sm text-gray-700 dark:text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black dark:bg-white" />
                      Issued by {certData.issuer.organization}
                    </li>
                  </ul>
                </div>

                {certData.securityIssues.length > 0 && (
                  <div className="mt-6 space-y-2 border-t border-gray-200 pt-6 dark:border-gray-800">
                    <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Improvements Needed
                    </div>
                    <ul className="space-y-2">
                      {certData.securityIssues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-body-sm text-gray-700 dark:text-gray-300">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Section I: Identity & Trust */}
          {certData && (
            <Section number="I" title="Identity & Trust" id="identity">
              <DataGrid
                data={{
                  'Certificate Subject': certData.subject.commonName,
                  'Organization': certData.subject.organization || 'Not specified',
                  'Country': certData.subject.country || 'Not specified',
                  'Issuer': certData.issuer.commonName,
                  'Issuer Organization': certData.issuer.organization,
                }}
              />

              <div className="space-y-3">
                <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Subject Alternative Names
                </div>
                <div className="flex flex-wrap gap-2">
                  {certData.subjectAltNames.slice(0, 10).map((san, i) => (
                    <span
                      key={i}
                      className="rounded border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-technical-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    >
                      {san}
                    </span>
                  ))}
                  {certData.subjectAltNames.length > 10 && (
                    <span className="px-3 py-1 text-technical-sm text-gray-500">
                      +{certData.subjectAltNames.length - 10} more
                    </span>
                  )}
                </div>
              </div>

              <Explanation title="What This Means">
                <p>
                  This certificate was issued by <strong>{certData.issuer.organization}</strong>, a trusted Certificate Authority that your browser recognizes. The certificate proves that the server you're connecting to is authorized to represent <strong>{certData.subject.commonName}</strong>.
                </p>
                <p className="mt-3">
                  The Subject Alternative Names (SANs) list all domains this single certificate is valid for, allowing one certificate to secure multiple hostnames.
                </p>
              </Explanation>

              <Explanation title="Why It Matters" variant="emphasis">
                <p>
                  Certificate Authorities undergo rigorous audits to maintain browser trust. When you see a valid certificate, you can be confident that:
                </p>
                <ul className="mt-2 space-y-1 pl-5">
                  <li>• The server identity has been verified</li>
                  <li>• The connection is protected from impersonation attacks</li>
                  <li>• Your data is encrypted during transmission</li>
                </ul>
              </Explanation>
            </Section>
          )}

          {/* Section II: Cryptographic Profile */}
          {certData && (
            <Section number="II" title="Cryptographic Profile" id="crypto">
              <DataGrid
                data={{
                  'Encryption Protocol': certData.tlsVersion,
                  'Key Algorithm': certData.publicKey.algorithm,
                  'Key Strength': `${certData.publicKey.bits} bits`,
                  'Signature Algorithm': certData.signatureAlgorithm,
                  'Cipher Suite': certData.cipherSuite,
                  'Certificate Version': `X.509 v${certData.version}`,
                }}
              />

              <Explanation title="Interpretation">
                <p>
                  <strong>{certData.tlsVersion}</strong> is {certData.tlsVersion.includes('1.3') ? 'the latest and most secure' : 'an acceptable'} protocol version. It provides {certData.tlsVersion.includes('1.3') ? 'enhanced security through encrypted handshakes and modern cipher suites' : 'secure communication but could be upgraded to TLS 1.3'}.
                </p>
                <p className="mt-3">
                  The <strong>{certData.publicKey.bits}-bit {certData.publicKey.algorithm}</strong> key provides {certData.publicKey.bits >= 2048 ? 'strong' : 'weak'} cryptographic protection. {certData.publicKey.bits >= 2048 ? 'This meets current security standards and makes it computationally infeasible for attackers to decrypt your data.' : 'This is below recommended standards and should be upgraded.'}
                </p>
              </Explanation>
            </Section>
          )}

          {/* Section III: Validity Period */}
          {certData && (
            <Section number="III" title="Validity Period" id="validity">
              <DataGrid
                columns={1}
                data={{
                  'Issued': format(new Date(certData.validFrom), 'MMMM dd, yyyy HH:mm:ss'),
                  'Expires': format(new Date(certData.validTo), 'MMMM dd, yyyy HH:mm:ss'),
                  'Days Remaining': certData.daysRemaining > 0 ? `${certData.daysRemaining} days` : `Expired ${Math.abs(certData.daysRemaining)} days ago`,
                  'Total Validity': `${Math.ceil((new Date(certData.validTo).getTime() - new Date(certData.validFrom).getTime()) / (1000 * 60 * 60 * 24))} days`,
                }}
              />

              {/* Visual timeline */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <div className="relative mb-8 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full ${
                      certData.daysRemaining < 30 ? 'bg-gray-400' : 'bg-black dark:bg-white'
                    }`}
                    style={{
                      width: `${Math.min(
                        Math.max(
                          ((new Date().getTime() - new Date(certData.validFrom).getTime()) /
                            (new Date(certData.validTo).getTime() - new Date(certData.validFrom).getTime())) *
                            100,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  >
                    <div className="absolute -right-1 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-inherit dark:border-gray-950" />
                  </div>
                </div>

                <div className="flex justify-between text-body-sm text-gray-600 dark:text-gray-400">
                  <div>Issued</div>
                  <div className="font-semibold text-black dark:text-white">Today</div>
                  <div>Expires</div>
                </div>
              </div>

              <Explanation title="Assessment">
                <p>
                  {certData.daysRemaining > 60
                    ? 'This certificate has ample time before expiration. Modern certificates typically have a 90-day validity period to encourage regular rotation and reduce the impact of compromised certificates.'
                    : certData.daysRemaining > 30
                    ? 'This certificate is approaching its renewal period. Most organizations use automated certificate management to ensure seamless renewals.'
                    : certData.daysRemaining > 0
                    ? 'This certificate is nearing expiration and should be renewed soon to prevent service disruptions.'
                    : 'This certificate has expired and is no longer trusted by browsers. Immediate renewal is required.'}
                </p>
              </Explanation>
            </Section>
          )}

          {/* Section IV: Certificate Chain */}
          {certData && certData.certificateChain && certData.certificateChain.length > 0 && (
            <Section number="IV" title="Certificate Chain" id="chain">
              <div className="space-y-4">
                {certData.certificateChain.map((cert, index) => {
                  const isRoot = index === certData.certificateChain.length - 1;
                  const isEndEntity = index === 0;

                  return (
                    <div
                      key={index}
                      className="flex gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                            isRoot
                              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                              : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300'
                          }`}
                        >
                          <span className="text-body-sm font-bold">{index + 1}</span>
                        </div>
                        {!isRoot && (
                          <div className="mt-2 h-8 w-0.5 bg-gray-200 dark:bg-gray-800" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {isRoot ? 'Root CA' : isEndEntity ? 'End Entity' : 'Intermediate CA'}
                        </div>
                        <div className="font-semibold text-black dark:text-white">
                          {cert.subject}
                        </div>
                        <div className="text-body-sm text-gray-600 dark:text-gray-400">
                          Issued by: {cert.issuer}
                        </div>
                        {cert.validTo && (
                          <div className="text-technical-sm text-gray-500 dark:text-gray-500">
                            Valid until: {format(new Date(cert.validTo), 'MMM dd, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Explanation title="Explanation">
                <p>
                  The certificate chain connects your server's certificate to a root certificate that browsers trust implicitly. Each certificate is signed by the one above it, creating a chain of trust.
                </p>
                <p className="mt-3">
                  <strong>End Entity:</strong> Your server's certificate<br />
                  <strong>Intermediate CA:</strong> Acts as a buffer to protect root certificates<br />
                  <strong>Root CA:</strong> Pre-installed in browsers and operating systems
                </p>
              </Explanation>
            </Section>
          )}

          {/* Section V: Historical Analysis */}
          {ctData && ctData.totalCertificates > 0 && (
            <Section number="V" title="Historical Analysis" id="history">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-950">
                  <div className="text-3xl font-bold text-black dark:text-white">
                    {ctData.totalCertificates}
                  </div>
                  <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Certificates Found
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-950">
                  <div className="text-3xl font-bold text-black dark:text-white">
                    {ctData.subdomains.length}
                  </div>
                  <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Subdomains
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-950">
                  <div className="text-3xl font-bold text-black dark:text-white">
                    {ctData.stats.averageValidityDays}
                  </div>
                  <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Avg. Validity Days
                  </div>
                </div>
              </div>

              {ctData.renewalPattern.detected && (
                <div className="rounded-lg border border-black bg-black p-6 text-white dark:border-white dark:bg-white dark:text-black">
                  <div className="text-label-lg font-semibold uppercase tracking-wide">
                    Automated Renewal Detected
                  </div>
                  <p className="mt-2 text-body-sm">
                    Certificates are renewed approximately every <strong>{ctData.renewalPattern.intervalDays} days</strong>
                    {ctData.renewalPattern.isAutomated && ' through an automated process'}.
                  </p>
                </div>
              )}

              <Timeline
                events={ctData.certificates.slice(0, 5).map((cert) => ({
                  date: format(new Date(cert.notBefore), 'MMM dd, yyyy'),
                  title: cert.commonName,
                  description: `Issued by ${cert.issuer.commonName}`,
                  isCurrent: cert.isCurrent,
                }))}
              />

              <Explanation title="Insight">
                <p>
                  This domain {ctData.renewalPattern.detected ? 'follows best practices by implementing automated certificate renewal' : 'has a history of manual certificate management'}. The Certificate Transparency logs show {ctData.totalCertificates} historical certificates, providing a complete audit trail of all certificates ever issued for this domain.
                </p>
              </Explanation>
            </Section>
          )}

          {/* Section VI: Subdomain Discovery */}
          {ctData && ctData.subdomains.length > 0 && (
            <Section number="VI" title="Subdomain Discovery" id="subdomains">
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-4 text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {ctData.subdomains.length} Subdomains Found
                </div>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {ctData.subdomains.slice(0, 12).map((subdomain, i) => (
                    <div
                      key={i}
                      className="rounded border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-technical-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    >
                      {subdomain}
                    </div>
                  ))}
                </div>
                {ctData.subdomains.length > 12 && (
                  <div className="mt-4 text-center text-body-sm text-gray-500">
                    +{ctData.subdomains.length - 12} more subdomains
                  </div>
                )}
              </div>

              <Explanation title="Security Note">
                <p>
                  Subdomains discovered in Certificate Transparency logs reveal your infrastructure footprint. While this transparency is valuable for security monitoring, it also means attackers can map your digital assets.
                </p>
                <p className="mt-3">
                  Ensure all listed subdomains are properly secured, actively maintained, and necessary for your operations.
                </p>
              </Explanation>
            </Section>
          )}

          {/* Section VII: Security Assessment */}
          {certData && (
            <Section number="VII" title="Security Assessment" id="assessment">
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                  <div className="mb-4 text-label-lg font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    Strengths
                  </div>
                  <ul className="space-y-2">
                    {certData.tlsVersion.includes('1.3') && (
                      <li className="flex items-start gap-2 text-body-sm">
                        <span className="mt-1 text-black dark:text-white">✓</span>
                        Modern TLS protocol (1.3) with enhanced security
                      </li>
                    )}
                    {certData.publicKey.bits >= 2048 && (
                      <li className="flex items-start gap-2 text-body-sm">
                        <span className="mt-1 text-black dark:text-white">✓</span>
                        Strong key size ({certData.publicKey.bits}+ bits)
                      </li>
                    )}
                    {!certData.isSelfSigned && (
                      <li className="flex items-start gap-2 text-body-sm">
                        <span className="mt-1 text-black dark:text-white">✓</span>
                        Issued by trusted Certificate Authority
                      </li>
                    )}
                    {ctData?.renewalPattern.detected && (
                      <li className="flex items-start gap-2 text-body-sm">
                        <span className="mt-1 text-black dark:text-white">✓</span>
                        Automated renewal process in place
                      </li>
                    )}
                  </ul>
                </div>

                {certData.securityIssues.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                    <div className="mb-4 text-label-lg font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Areas for Improvement
                    </div>
                    <ul className="space-y-2">
                      {certData.securityIssues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2 text-body-sm">
                          <span className="mt-1 text-gray-400">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Explanation variant="emphasis">
                  <p>
                    <strong>Overall Assessment:</strong> This certificate demonstrates {certData.securityGrade === 'A+' || certData.securityGrade === 'A' ? 'excellent' : certData.securityGrade === 'B' || certData.securityGrade === 'C' ? 'adequate' : 'insufficient'} security hygiene and {certData.securityIssues.length === 0 ? 'follows' : 'partially follows'} industry best practices for secure web communication.
                  </p>
                </Explanation>
              </div>
            </Section>
          )}

          {/* Section VIII: Known Vulnerabilities */}
          {certData && (
            <Section number="VIII" title="Known Vulnerabilities" id="vulnerabilities">
              <VulnerabilityReport
                vulnerabilities={performComprehensiveCheck({
                  tlsVersion: certData.tlsVersion,
                  cipherSuite: certData.cipherSuite,
                  signatureAlgorithm: certData.signatureAlgorithm,
                  publicKey: certData.publicKey,
                })}
              />

              <Explanation title="What This Means">
                <p>
                  Vulnerabilities are weaknesses in cryptographic protocols, algorithms, or configurations that can be exploited by attackers. This assessment checks for publicly known vulnerabilities (CVEs) in the certificate's TLS configuration, cipher suites, signature algorithms, and key sizes.
                </p>
              </Explanation>

              <Explanation title="Why It Matters">
                <p>
                  Even a single critical vulnerability can compromise the entire security of a connection. Attackers actively scan for and exploit known vulnerabilities. Systems using deprecated protocols like SSL 3.0 or weak ciphers like RC4 are particularly at risk from automated attacks.
                </p>
              </Explanation>

              <Explanation title="Recommendations">
                <p>
                  Address critical and high-severity vulnerabilities immediately. Update server configurations to disable vulnerable protocols and cipher suites. Use modern TLS 1.2 or TLS 1.3 with strong cipher suites like AES-GCM or ChaCha20-Poly1305. Regularly monitor for new vulnerability disclosures.
                </p>
              </Explanation>
            </Section>
          )}

          {/* Section IX: Compliance Assessment */}
          {certData && (
            <Section number="IX" title="Compliance Assessment" id="compliance">
              <ComplianceReportComponent
                {...performComplianceCheck({
                  tlsVersion: certData.tlsVersion,
                  cipherSuite: certData.cipherSuite,
                  signatureAlgorithm: certData.signatureAlgorithm,
                  publicKey: certData.publicKey,
                  validTo: certData.validTo,
                  isExpiringSoon: certData.isExpiringSoon,
                })}
              />

              <Explanation title="What This Means">
                <p>
                  Compliance assessment validates your certificate configuration against industry standards including PCI DSS (payment processing), HIPAA (healthcare), GDPR (data protection), and SOC 2 (service organizations). Each standard has specific technical requirements for encryption, key management, and security controls.
                </p>
              </Explanation>

              <Explanation title="Why It Matters">
                <p>
                  Regulatory compliance is mandatory for organizations handling sensitive data. Non-compliance can result in significant fines, legal liability, and loss of customer trust. Many compliance frameworks require regular security assessments and documentation of cryptographic controls.
                </p>
              </Explanation>

              <Explanation title="Recommendations">
                <p>
                  Address all non-compliant requirements immediately, especially for standards relevant to your industry. Document your security posture and maintain evidence of compliance. Implement automated monitoring to detect configuration drift. Consult with compliance experts for comprehensive assessments beyond certificate validation.
                </p>
              </Explanation>
            </Section>
          )}

          {/* Section X: Risk Assessment */}
          {certData && ctData && (
            <Section number="X" title="Risk Assessment" id="risk">
              <RiskAssessmentReport
                assessment={performRiskAssessment(
                  performComprehensiveCheck({
                    tlsVersion: certData.tlsVersion,
                    cipherSuite: certData.cipherSuite,
                    signatureAlgorithm: certData.signatureAlgorithm,
                    publicKey: certData.publicKey,
                  }),
                  performComplianceCheck({
                    tlsVersion: certData.tlsVersion,
                    cipherSuite: certData.cipherSuite,
                    signatureAlgorithm: certData.signatureAlgorithm,
                    publicKey: certData.publicKey,
                    validTo: certData.validTo,
                    isExpiringSoon: certData.isExpiringSoon,
                  }),
                  {
                    tlsVersion: certData.tlsVersion,
                    cipherSuite: certData.cipherSuite,
                    publicKey: certData.publicKey,
                    daysRemaining: certData.daysRemaining,
                    isExpiringSoon: certData.isExpiringSoon,
                    isSelfSigned: certData.isSelfSigned,
                    subjectAltNames: certData.subjectAltNames,
                    isWildcard: certData.isWildcard,
                  },
                  ctData.subdomains.length
                )}
              />

              <Explanation title="What This Means">
                <p>
                  Risk assessment combines vulnerability analysis, compliance gaps, configuration weaknesses, and exposure factors to calculate an overall security risk score. It identifies potential attack vectors, estimates their likelihood and impact, and provides prioritized remediation actions based on effort, timeframe, and security benefit.
                </p>
              </Explanation>

              <Explanation title="Why It Matters">
                <p>
                  Understanding your risk profile enables informed decision-making about security investments. Risk assessment helps prioritize limited resources toward the most critical issues first. It provides a clear roadmap for improvement and helps communicate security posture to stakeholders in business terms (confidentiality, integrity, availability).
                </p>
              </Explanation>

              <Explanation title="Recommendations">
                <p>
                  Focus on critical and high-priority remediation actions first. Address attack vectors with both high likelihood and high impact immediately. Use the timeframe estimates to plan security improvements systematically. Reassess risk regularly after implementing changes to measure progress and identify new issues.
                </p>
              </Explanation>
            </Section>
          )}

          {/* Section XI: Score Breakdown */}
          {certData && (
            <Section number="XI" title="Score Breakdown" id="score">
              <ScoreBreakdown {...calculateScoreBreakdown(certData)} />

              <Explanation title="How Scores Are Calculated">
                <p>
                  The security score is derived from multiple factors including protocol version, encryption strength, certificate authority trust, validity status, and adherence to security best practices. Each category contributes to the overall score, which determines the final security grade.
                </p>
                <p className="mt-3">
                  Scores are based on current industry standards from organizations like the National Institute of Standards and Technology (NIST), the Internet Engineering Task Force (IETF), and security researchers worldwide.
                </p>
              </Explanation>
            </Section>
          )}

          {/* Appendix: Technical Data */}
          {certData && (
            <Section number="APPENDIX" title="Technical Data" id="appendix">
              <DataGrid
                columns={1}
                data={{
                  'Serial Number': certData.serialNumber,
                  'Fingerprint (SHA-1)': certData.fingerprint,
                  'Fingerprint (SHA-256)': certData.fingerprintSha256,
                  'Certificate Version': `X.509 v${certData.version}`,
                  'Wildcard Certificate': certData.isWildcard ? 'Yes' : 'No',
                  'Self-Signed': certData.isSelfSigned ? 'Yes' : 'No',
                }}
              />
            </Section>
          )}
        </div>
      </div>
    </Container>
  );
}
