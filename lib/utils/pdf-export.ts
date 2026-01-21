import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CertificateData, CTLogData } from '@/types/certificate';
import { format, differenceInDays } from 'date-fns';
import { performComprehensiveCheck, Vulnerability } from '@/lib/security/vulnerability-checker';
import { performComplianceCheck, ComplianceReport, ComplianceRequirement } from '@/lib/security/compliance-checker';
import { performRiskAssessment, RiskAssessment, AttackVector, RemediationAction } from '@/lib/security/risk-assessment';

export async function generatePDFReport(
  domain: string,
  certData: CertificateData,
  ctData?: CTLogData | null
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Color definitions (RGB)
  const colors = {
    black: [0, 0, 0] as [number, number, number],
    darkGray: [64, 64, 64] as [number, number, number],
    mediumGray: [115, 115, 115] as [number, number, number],
    lightGray: [163, 163, 163] as [number, number, number],
    veryLightGray: [229, 229, 229] as [number, number, number],
  };

  // Helper function to check if we need a new page
  const checkNewPage = (spaceNeeded: number = 25) => {
    if (yPos + spaceNeeded > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper function to add section with Roman numeral
  const addSection = (title: string, includeTopMargin = true) => {
    if (includeTopMargin) {
      checkNewPage(30);
      yPos += 8;
    } else {
      checkNewPage(25);
      yPos += 3;
    }
    
    // Section background box (very light gray)
    doc.setFillColor(...colors.veryLightGray);
    doc.rect(margin, yPos - 4, contentWidth, 12, 'F');
    
    // Section border (left accent)
    doc.setFillColor(...colors.black);
    doc.rect(margin, yPos - 4, 3, 12, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.black);
    doc.text(title, margin + 8, yPos + 3.5);
    yPos += 16;
  };

  // Helper function to add subsection
  const addSubSection = (title: string) => {
    checkNewPage(15);
    yPos += 3;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.darkGray);
    doc.text(title.toUpperCase(), margin, yPos);
    yPos += 8;
  };

  // Helper function to add text with better spacing
  const addText = (text: string, fontSize = 10, isBold = false, color = colors.mediumGray) => {
    checkNewPage(12);
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += lines.length * (fontSize * 0.5) + 3;
  };

  // Helper to add key-value pair in a box
  const addKeyValue = (key: string, value: string, isInBox = false) => {
    checkNewPage(10);
    
    if (isInBox) {
      // Light background box
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos - 3, contentWidth, 8, 'F');
    }
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.darkGray);
    doc.text(key, margin + 2, yPos + 2);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.black);
    const lines = doc.splitTextToSize(value, contentWidth - 55);
    doc.text(lines, margin + 52, yPos + 2);
    
    yPos += Math.max(8, lines.length * 4.5);
  };

  // Helper to add data grid
  const addDataGrid = (items: Array<[string, string]>) => {
    checkNewPage(items.length * 10 + 5);
    
    // Draw grid background
    doc.setFillColor(...colors.veryLightGray);
    doc.rect(margin, yPos, contentWidth, items.length * 8 + 4, 'F');
    
    // Draw grid border
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, contentWidth, items.length * 8 + 4);
    
    yPos += 4;
    
    items.forEach(([key, value], index) => {
      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, yPos - 2, contentWidth, 8, 'F');
      }
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.mediumGray);
      doc.text(key.toUpperCase(), margin + 3, yPos + 2.5);
      
      doc.setFont('courier', 'normal');
      doc.setTextColor(...colors.black);
      const valueLines = doc.splitTextToSize(value, contentWidth - 60);
      doc.text(valueLines, margin + 55, yPos + 2.5);
      
      yPos += 8;
    });
    
    yPos += 5;
  };

  const addDivider = (thickness = 0.3) => {
    checkNewPage(5);
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(thickness);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
  };

  // Helper to add bullet points with better formatting
  const addBulletPoint = (text: string, symbol = '•') => {
    checkNewPage(8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.mediumGray);
    
    const bulletWidth = doc.getTextWidth(symbol + ' ');
    const lines = doc.splitTextToSize(text, contentWidth - bulletWidth - 5);
    
    doc.text(symbol, margin + 3, yPos);
    doc.text(lines, margin + 3 + bulletWidth, yPos);
    yPos += lines.length * 4.5 + 2;
  };

  // ========== COVER PAGE / HEADER ==========
  // Title with border
  doc.setFillColor(...colors.black);
  doc.rect(margin, yPos, contentWidth, 30, 'F');
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SECURITY INTELLIGENCE REPORT', margin + 5, yPos + 12);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Aletheia Certificate Analysis', margin + 5, yPos + 22);
  
  yPos += 35;

  // Domain box
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, contentWidth, 18, 'F');
  doc.setDrawColor(...colors.lightGray);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, 18);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.mediumGray);
  doc.text('ANALYZED DOMAIN', margin + 5, yPos + 6);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.black);
  doc.text(domain, margin + 5, yPos + 13);
  
  yPos += 23;

  // Metadata
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.mediumGray);
  doc.text(`Report Generated: ${format(new Date(), 'MMMM dd, yyyy')} at ${format(new Date(), 'HH:mm')} UTC`, margin, yPos);
  doc.text(`Report Version: 1.0`, pageWidth - margin - 35, yPos);
  yPos += 12;

  // ========== EXECUTIVE SUMMARY ==========
  addDivider();
  addSection('EXECUTIVE SUMMARY', false);
  
  // Grade and Score in highlighted box
  checkNewPage(25);
  doc.setFillColor(250, 250, 250);
  doc.rect(margin, yPos, contentWidth, 22, 'F');
  doc.setDrawColor(...colors.lightGray);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, 22);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.mediumGray);
  doc.text('SECURITY GRADE', margin + 5, yPos + 6);
  doc.text('SECURITY SCORE', pageWidth / 2, yPos + 6);
  
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.black);
  doc.text(certData.securityGrade, margin + 5, yPos + 16);
  doc.text(`${certData.securityScore}/100`, pageWidth / 2, yPos + 16);
  
  yPos += 27;

  addSubSection('Key Findings');
  addBulletPoint(`${certData.tlsVersion} protocol in use`);
  addBulletPoint(`${certData.publicKey.bits}-bit ${certData.publicKey.algorithm} encryption`);
  addBulletPoint(`Valid for ${certData.daysRemaining} more days`);
  addBulletPoint(`Issued by ${certData.issuer.organization}`);
  if (certData.subjectAltNames && certData.subjectAltNames.length > 1) {
    addBulletPoint(`Covers ${certData.subjectAltNames.length} domain(s)`);
  }
  yPos += 2;

  if (certData.securityIssues.length > 0) {
    addSubSection('Improvements Needed');
    certData.securityIssues.forEach((issue) => {
      addBulletPoint(issue, '⚠');
    });
    yPos += 2;
  }

  // ========== SECTION I: IDENTITY & TRUST ==========
  addDivider();
  addSection('I. IDENTITY & TRUST');
  
  addDataGrid([
    ['Certificate Subject', certData.subject.commonName],
    ['Organization', certData.subject.organization || 'Not specified'],
    ['Issuer', certData.issuer.commonName],
    ['Issuer Organization', certData.issuer.organization],
  ]);

  if (certData.subjectAltNames && certData.subjectAltNames.length > 0) {
    addSubSection('Subject Alternative Names (SANs)');
    certData.subjectAltNames.slice(0, 10).forEach(san => {
      addBulletPoint(san);
    });
    if (certData.subjectAltNames.length > 10) {
      addText(`... and ${certData.subjectAltNames.length - 10} more domains`, 8, false, colors.lightGray);
    }
    yPos += 2;
  }

  addSubSection('What This Means');
  addText(
    `This certificate was issued by ${certData.issuer.organization}, a trusted Certificate Authority. The certificate proves that the server is authorized to represent ${certData.subject.commonName}. Your browser trusts this CA and will accept the certificate without warnings.`,
    9, false, colors.mediumGray
  );
  yPos += 2;

  // ========== SECTION II: CRYPTOGRAPHIC PROFILE ==========
  addDivider();
  addSection('II. CRYPTOGRAPHIC PROFILE');
  
  addDataGrid([
    ['Encryption Protocol', certData.tlsVersion],
    ['Key Algorithm', certData.publicKey.algorithm],
    ['Key Strength', `${certData.publicKey.bits} bits`],
    ['Signature Algorithm', certData.signatureAlgorithm],
    ['Cipher Suite', certData.cipherSuite],
  ]);

  addSubSection('Assessment');
  const keyStrength = certData.publicKey.bits >= 2048 ? 'strong' : certData.publicKey.bits >= 1024 ? 'adequate' : 'weak';
  addText(
    `The certificate uses ${keyStrength} ${certData.publicKey.bits}-bit ${certData.publicKey.algorithm} encryption with ${certData.tlsVersion}. This ${certData.publicKey.bits >= 2048 ? 'meets current security standards' : 'may not meet current security standards'} and provides ${certData.publicKey.bits >= 2048 ? 'robust' : 'limited'} protection against modern cryptographic attacks.`,
    9, false, colors.mediumGray
  );
  yPos += 2;

  // ========== SECTION III: VALIDITY PERIOD ==========
  addDivider();
  addSection('III. VALIDITY PERIOD');
  
  const validityDays = differenceInDays(new Date(certData.validTo), new Date(certData.validFrom));
  const progressPercent = Math.max(0, Math.min(100, ((validityDays - certData.daysRemaining) / validityDays) * 100));
  
  addDataGrid([
    ['Issued', format(new Date(certData.validFrom), 'MMMM dd, yyyy HH:mm:ss')],
    ['Expires', format(new Date(certData.validTo), 'MMMM dd, yyyy HH:mm:ss')],
    ['Days Remaining', certData.daysRemaining > 0 ? `${certData.daysRemaining} days` : `Expired ${Math.abs(certData.daysRemaining)} days ago`],
    ['Total Validity Period', `${validityDays} days`],
  ]);

  // Visual timeline
  checkNewPage(15);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.mediumGray);
  doc.text('CERTIFICATE LIFETIME', margin, yPos);
  yPos += 5;
  
  // Timeline bar
  const barWidth = contentWidth - 10;
  const barHeight = 8;
  doc.setFillColor(...colors.veryLightGray);
  doc.rect(margin + 5, yPos, barWidth, barHeight, 'F');
  doc.setDrawColor(...colors.lightGray);
  doc.setLineWidth(0.5);
  doc.rect(margin + 5, yPos, barWidth, barHeight);
  
  // Progress fill
  if (certData.daysRemaining > 0) {
    doc.setFillColor(...colors.black);
    doc.rect(margin + 5, yPos, (barWidth * progressPercent) / 100, barHeight, 'F');
  }
  
  yPos += 12;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.mediumGray);
  doc.text(format(new Date(certData.validFrom), 'MMM dd, yyyy'), margin + 5, yPos);
  doc.text(format(new Date(certData.validTo), 'MMM dd, yyyy'), pageWidth - margin - 35, yPos);
  yPos += 8;

  addSubSection('Assessment');
  if (certData.daysRemaining > 90) {
    addText(
      `This certificate has ample time before expiration. Most modern certificates have a validity period of 90-398 days. Regular renewal is recommended 30 days before expiration.`,
      9, false, colors.mediumGray
    );
  } else if (certData.daysRemaining > 30) {
    addText(
      `This certificate will expire soon. Plan for renewal within the next ${certData.daysRemaining} days to avoid service disruption.`,
      9, false, colors.mediumGray
    );
  } else if (certData.daysRemaining > 0) {
    addText(
      `⚠ URGENT: This certificate expires in ${certData.daysRemaining} days. Immediate renewal is strongly recommended to prevent security warnings.`,
      9, true, colors.darkGray
    );
  } else {
    addText(
      `⚠ CRITICAL: This certificate has expired ${Math.abs(certData.daysRemaining)} days ago. Users will see security warnings. Renew immediately.`,
      9, true, colors.darkGray
    );
  }
  yPos += 2;

  // ========== SECTION IV: CERTIFICATE CHAIN ==========
  if (certData.certificateChain && certData.certificateChain.length > 0) {
    addDivider();
    addSection('IV. CERTIFICATE CHAIN');
    
    certData.certificateChain.forEach((cert, index) => {
      const isRoot = index === certData.certificateChain.length - 1;
      const isEndEntity = index === 0;
      const label = isRoot ? 'Root CA' : isEndEntity ? 'End Entity' : 'Intermediate CA';
      
      checkNewPage(18);
      
      // Chain level box
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos, contentWidth, 16, 'F');
      doc.setDrawColor(...colors.lightGray);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPos, contentWidth, 16);
      
      // Level badge
      doc.setFillColor(...colors.black);
      doc.rect(margin, yPos, 25, 16, 'F');
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`${index + 1}`, margin + 11, yPos + 11);
      
      // Certificate info
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.mediumGray);
      doc.text(label.toUpperCase(), margin + 30, yPos + 5);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      
      // Truncate long subject names
      const maxSubjectWidth = contentWidth - 35;
      const subjectText = doc.getTextWidth(cert.subject) > maxSubjectWidth
        ? cert.subject.substring(0, 80) + '...'
        : cert.subject;
      const subjectLine = doc.splitTextToSize(subjectText, maxSubjectWidth);
      doc.text(subjectLine[0], margin + 30, yPos + 10);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.mediumGray);
      
      // Truncate long issuer names
      const maxIssuerWidth = contentWidth - 50;
      const issuerText = doc.getTextWidth(cert.issuer) > maxIssuerWidth
        ? cert.issuer.substring(0, 60) + '...'
        : cert.issuer;
      doc.text(`Issued by: ${issuerText}`, margin + 30, yPos + 14);
      
      yPos += 18;
      
      // Arrow connector (except for last item)
      if (index < certData.certificateChain.length - 1) {
        doc.setDrawColor(...colors.lightGray);
        doc.setLineWidth(1);
        doc.line(margin + 12, yPos, margin + 12, yPos + 4);
        // Arrow head
        doc.line(margin + 12, yPos + 4, margin + 10, yPos + 2);
        doc.line(margin + 12, yPos + 4, margin + 14, yPos + 2);
        yPos += 5;
      }
    });
    
    yPos += 5;
    
    addSubSection('Explanation');
    addText(
      'The chain of trust connects your certificate to a root certificate that browsers trust. Each certificate is signed by the one above it, creating a verifiable chain of authenticity.',
      9, false, colors.mediumGray
    );
    yPos += 2;
  }

  // ========== SECTION V: HISTORICAL ANALYSIS ==========
  if (ctData && ctData.totalCertificates > 0) {
    addDivider();
    addSection('V. HISTORICAL ANALYSIS');
    
    // Stats boxes
    checkNewPage(25);
    const boxWidth = (contentWidth - 6) / 3;
    const statsData = [
      ['Total Certificates', ctData.totalCertificates.toString()],
      ['Subdomains Found', ctData.subdomains.length.toString()],
      ['Avg. Validity', `${ctData.stats.averageValidityDays} days`],
    ];
    
    statsData.forEach((stat, i) => {
      const xOffset = margin + (boxWidth + 3) * i;
      doc.setFillColor(250, 250, 250);
      doc.rect(xOffset, yPos, boxWidth, 16, 'F');
      doc.setDrawColor(...colors.lightGray);
      doc.setLineWidth(0.5);
      doc.rect(xOffset, yPos, boxWidth, 16);
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.mediumGray);
      doc.text(stat[0].toUpperCase(), xOffset + 3, yPos + 5);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      doc.text(stat[1], xOffset + 3, yPos + 13);
    });
    yPos += 20;

    addSubSection('Certificate Authorities Used');
    ctData.stats.certificateAuthorities.slice(0, 5).forEach(ca => {
      addBulletPoint(ca);
    });
    yPos += 2;

    if (ctData.renewalPattern.detected) {
      addSubSection('Renewal Pattern');
      addText(
        `Certificates are renewed approximately every ${ctData.renewalPattern.intervalDays} days${
          ctData.renewalPattern.isAutomated ? ' through an automated process (recommended best practice)' : '. Consider implementing automated renewal for reliability'
        }.`,
        9, false, colors.mediumGray
      );
      yPos += 2;
    }

    if (ctData.certificates.length > 0) {
      addSubSection('Recent Certificate History');
      ctData.certificates.slice(0, 5).forEach((cert) => {
        addBulletPoint(
          `${format(new Date(cert.notBefore), 'MMM dd, yyyy')}: ${cert.commonName}${cert.isCurrent ? ' (Current)' : ''}`
        );
      });
      yPos += 2;
    }
    
    addSubSection('Insight');
    if (ctData.renewalPattern.isAutomated) {
      addText(
        'This domain follows best practices by using automated certificate renewal. This ensures continuous security coverage and prevents expiration-related outages.',
        9, false, colors.mediumGray
      );
    } else {
      addText(
        'Consider implementing automated certificate renewal to ensure continuous security coverage and prevent manual oversight errors.',
        9, false, colors.mediumGray
      );
    }
    yPos += 2;
  }

  // ========== SECTION VI: SUBDOMAIN DISCOVERY ==========
  if (ctData && ctData.subdomains.length > 0) {
    addDivider();
    addSection('VI. SUBDOMAIN DISCOVERY');
    
    checkNewPage(20);
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, yPos, contentWidth, 12, 'F');
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, contentWidth, 12);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.mediumGray);
    doc.text('TOTAL SUBDOMAINS DISCOVERED', margin + 5, yPos + 5);
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.black);
    doc.text(ctData.subdomains.length.toString(), margin + 5, yPos + 10);
    
    yPos += 17;

    addSubSection('Discovered Subdomains');
    
    // Create a two-column grid layout for subdomains
    const maxSubdomains = Math.min(40, ctData.subdomains.length);
    const subdomainsPerColumn = 20;
    const columnWidth = (contentWidth / 2) - 2; // Space for two columns with gap
    
    // Track starting position for columns
    const startYPos = yPos;
    let currentColumn = 0;
    let currentColumnY = startYPos; // Track Y position within current column
    
    for (let i = 0; i < maxSubdomains; i++) {
      const row = i % subdomainsPerColumn;
      
      // Move to second column after first 20 items
      if (i === subdomainsPerColumn && i < maxSubdomains) {
        currentColumn = 1;
        currentColumnY = startYPos; // Reset to starting Y position for second column
      }
      
      // Check if we need a new page (only relevant for first column)
      if (currentColumn === 0) {
        checkNewPage(6);
      }
      
      doc.setFontSize(8);
      doc.setFont('courier', 'normal');
      doc.setTextColor(...colors.black);
      
      const xOffset = margin + (currentColumn * (columnWidth + 4));
      doc.text('•', xOffset, currentColumnY);
      
      // Truncate long subdomains if needed
      const subdomain = ctData.subdomains[i];
      const maxLength = columnWidth - 4;
      const subdomainText = doc.getTextWidth(subdomain) > maxLength 
        ? subdomain.substring(0, Math.floor(maxLength / 2)) + '...' 
        : subdomain;
      doc.text(subdomainText, xOffset + 4, currentColumnY);
      
      currentColumnY += 5;
    }
    
    // Position cursor after the tallest column
    if (maxSubdomains > subdomainsPerColumn) {
      // Two columns: set yPos to the max height
      const itemsInSecondColumn = maxSubdomains - subdomainsPerColumn;
      yPos = Math.max(startYPos + (subdomainsPerColumn * 5), startYPos + (itemsInSecondColumn * 5));
    } else {
      // Single column: use the current column Y position
      yPos = currentColumnY;
    }
    
    if (ctData.subdomains.length > maxSubdomains) {
      yPos += 3;
      addText(`... and ${ctData.subdomains.length - maxSubdomains} more subdomains`, 8, false, colors.lightGray);
    }
    
    yPos += 5;
    
    addSubSection('Security Note');
    addText(
      'Subdomains expose your infrastructure topology. Ensure all subdomains are intentional, properly secured, and regularly audited. Unused subdomains should be removed to minimize attack surface.',
      9, false, colors.mediumGray
    );
    yPos += 2;
  }

  // ========== SECTION VII: SECURITY ASSESSMENT ==========
  addDivider();
  addSection('VII. SECURITY ASSESSMENT');
  
  addSubSection('Strengths');
  let strengthCount = 0;
  
  if (certData.tlsVersion.includes('1.3')) {
    addBulletPoint('Modern TLS protocol (1.3) - Enhanced security and performance', '✓');
    strengthCount++;
  } else if (certData.tlsVersion.includes('1.2')) {
    addBulletPoint('Secure TLS protocol (1.2) - Industry standard', '✓');
    strengthCount++;
  }
  if (certData.publicKey.bits >= 2048) {
    addBulletPoint(`Strong key size (${certData.publicKey.bits} bits) - Resistant to brute force`, '✓');
    strengthCount++;
  }
  if (!certData.isSelfSigned) {
    addBulletPoint('Trusted Certificate Authority - Browser recognized', '✓');
    strengthCount++;
  }
  if (ctData?.renewalPattern.detected) {
    addBulletPoint('Automated renewal process - Reduces human error', '✓');
    strengthCount++;
  }
  if (certData.subjectAltNames && certData.subjectAltNames.length > 1) {
    addBulletPoint(`Multi-domain certificate - Covers ${certData.subjectAltNames.length} domains`, '✓');
    strengthCount++;
  }
  if (certData.daysRemaining > 30) {
    addBulletPoint('Valid certificate with adequate time before expiration', '✓');
    strengthCount++;
  }
  
  if (strengthCount === 0) {
    addText('No significant strengths identified in current configuration.', 9, false, colors.mediumGray);
  }
  
  yPos += 3;

  if (certData.securityIssues.length > 0) {
    addSubSection('Areas for Improvement');
    certData.securityIssues.forEach((issue) => {
      addBulletPoint(issue, '⚠');
    });
    yPos += 3;
  }

  addSubSection('Overall Assessment');
  const assessment =
    certData.securityGrade === 'A+' || certData.securityGrade === 'A'
      ? 'excellent'
      : certData.securityGrade === 'B' || certData.securityGrade === 'C'
      ? 'adequate'
      : 'insufficient';
  
  // Assessment box
  checkNewPage(20);
  const assessmentColor: [number, number, number] = 
    assessment === 'excellent' ? [240, 255, 240] :
    assessment === 'adequate' ? [255, 255, 240] : [255, 245, 245];
  
  doc.setFillColor(...assessmentColor);
  doc.rect(margin, yPos, contentWidth, 18, 'F');
  doc.setDrawColor(...colors.lightGray);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, 18);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.black);
  const assessmentText = `This certificate demonstrates ${assessment} security hygiene and ${
    certData.securityIssues.length === 0 ? 'follows' : 'partially follows'
  } industry best practices. ${
    certData.securityGrade === 'A+' || certData.securityGrade === 'A' 
      ? 'No immediate action required. Continue monitoring for expiration.' 
      : 'Review the identified improvements to enhance your security posture.'
  }`;
  const assessmentLines = doc.splitTextToSize(assessmentText, contentWidth - 10);
  doc.text(assessmentLines, margin + 5, yPos + 6);
  
  yPos += 23;

  // ========== SECTION VIII: KNOWN VULNERABILITIES ==========
  addDivider();
  addSection('VIII. KNOWN VULNERABILITIES');

  const vulnReport = performComprehensiveCheck({
    tlsVersion: certData.tlsVersion,
    cipherSuite: certData.cipherSuite,
    signatureAlgorithm: certData.signatureAlgorithm,
    publicKey: certData.publicKey,
  });

  const totalVulns = vulnReport.totalVulnerabilities;

  if (totalVulns === 0) {
    addText('No known vulnerabilities detected in the current configuration.', 9, true, colors.black);
    yPos += 5;
  } else {
    // Summary box
    const summaryData: [string, string][] = [
      ['Total', totalVulns.toString()],
      ['Critical', vulnReport.critical.length.toString()],
      ['High', vulnReport.high.length.toString()],
      ['Medium', vulnReport.medium.length.toString()],
    ];
    
    const boxWidth = (contentWidth - 9) / 4;
    summaryData.forEach((item, i) => {
      const xOffset = margin + (boxWidth + 3) * i;
      doc.setFillColor(250, 250, 250);
      doc.rect(xOffset, yPos, boxWidth, 16, 'F');
      doc.setDrawColor(...colors.lightGray);
      doc.setLineWidth(0.5);
      doc.rect(xOffset, yPos, boxWidth, 16);
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.mediumGray);
      doc.text(item[0].toUpperCase(), xOffset + 3, yPos + 5);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      doc.text(item[1], xOffset + 3, yPos + 13);
    });
    yPos += 20;

    // Helper to add vulnerability card with dynamic height
    const addVulnerabilityCard = (vuln: Vulnerability) => {
      // Calculate required height
      const descLines = doc.splitTextToSize(vuln.description, contentWidth - 8);
      const recLines = doc.splitTextToSize(vuln.recommendation, contentWidth - 8);
      const cardHeight = 20 + (descLines.length * 3.5) + (recLines.length * 3.5);
      
      checkNewPage(cardHeight + 5);
      
      // Card border
      doc.setDrawColor(...colors.lightGray);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPos, contentWidth, cardHeight);
      
      // Title and CVE ID
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      const maxTitleWidth = vuln.cveId ? contentWidth - 40 : contentWidth - 10;
      const titleText = doc.splitTextToSize(vuln.title, maxTitleWidth)[0];
      doc.text(titleText, margin + 4, yPos + 6);
      
      if (vuln.cveId) {
        const cveWidth = doc.getTextWidth(vuln.cveId);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.mediumGray);
        doc.text(vuln.cveId, pageWidth - margin - cveWidth - 4, yPos + 6);
      }
      
      // Description
      let currentY = yPos + 12;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.mediumGray);
      doc.text(descLines, margin + 4, currentY);
      currentY += descLines.length * 3.5 + 4;
      
      // Recommendation
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.mediumGray);
      doc.text('RECOMMENDATION', margin + 4, currentY);
      currentY += 4;
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.black);
      doc.text(recLines, margin + 4, currentY);
      
      yPos += cardHeight + 4;
    };

    // Critical vulnerabilities
    if (vulnReport.critical.length > 0) {
      addSubSection('Critical Severity');
      vulnReport.critical.forEach(vuln => addVulnerabilityCard(vuln));
    }

    // High vulnerabilities
    if (vulnReport.high.length > 0) {
      addSubSection('High Severity');
      vulnReport.high.forEach(vuln => addVulnerabilityCard(vuln));
    }

    // Medium vulnerabilities
    if (vulnReport.medium.length > 0) {
      addSubSection('Medium Severity');
      vulnReport.medium.forEach(vuln => addVulnerabilityCard(vuln));
    }

    // Low vulnerabilities
    if (vulnReport.low.length > 0) {
      addSubSection('Low Severity');
      vulnReport.low.forEach(vuln => addVulnerabilityCard(vuln));
    }
  }

  // ========== SECTION IX: COMPLIANCE ASSESSMENT ==========
  addDivider();
  addSection('IX. COMPLIANCE ASSESSMENT');

  const complianceAssessment = performComplianceCheck({
    tlsVersion: certData.tlsVersion,
    cipherSuite: certData.cipherSuite,
    signatureAlgorithm: certData.signatureAlgorithm,
    publicKey: certData.publicKey,
    validTo: certData.validTo,
    isExpiringSoon: certData.isExpiringSoon,
  });

  // Overall summary
  const overallBox = (contentWidth - 6) / 2;
  doc.setFillColor(250, 250, 250);
  doc.rect(margin, yPos, overallBox, 18, 'F');
  doc.setDrawColor(...colors.lightGray);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, overallBox, 18);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.mediumGray);
  doc.text('OVERALL COMPLIANCE', margin + 3, yPos + 5);
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.black);
  doc.text(`${complianceAssessment.overallCompliance}%`, margin + 3, yPos + 14);
  yPos += 22;

  // Standard scores - display in grid if more than 4
  checkNewPage(20);
  const numStandards = complianceAssessment.reports.length;
  const standardsPerRow = Math.min(4, numStandards);
  const boxWidth = (contentWidth - ((standardsPerRow - 1) * 3)) / standardsPerRow;
  
  complianceAssessment.reports.forEach((report, i) => {
    const row = Math.floor(i / standardsPerRow);
    const col = i % standardsPerRow;
    const xOffset = margin + (boxWidth + 3) * col;
    const currentY = yPos + (row * 19); // 16px height + 3px gap
    
    // Check for new page if needed for additional rows
    if (col === 0 && row > 0) {
      checkNewPage(19);
    }
    
    doc.setFillColor(250, 250, 250);
    doc.rect(xOffset, currentY, boxWidth, 16, 'F');
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.5);
    doc.rect(xOffset, currentY, boxWidth, 16);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.mediumGray);
    doc.text(report.standard, xOffset + 3, currentY + 5);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.black);
    doc.text(`${report.complianceScore}%`, xOffset + 3, currentY + 13);
  });
  
  // Calculate total height used
  const totalRows = Math.ceil(numStandards / standardsPerRow);
  yPos += (totalRows * 19) + 1;

  // Helper to add requirement card with dynamic height
  const addRequirementCard = (requirement: ComplianceRequirement, standard: string) => {
    if (requirement.status === 'not-applicable') return;
    
    // Calculate required height
    const descLines = doc.splitTextToSize(requirement.description, contentWidth - 8);
    const detailLines = doc.splitTextToSize(requirement.details, contentWidth - 8);
    const cardHeight = 18 + (descLines.length * 3.5) + (detailLines.length * 3.5);
    
    checkNewPage(cardHeight + 5);
    
    // Card border
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, contentWidth, cardHeight);
    
    // Status icon (using symbols)
    doc.setFontSize(10);
    const statusSymbol = requirement.status === 'compliant' ? '✓' : 
                        requirement.status === 'partial' ? '◐' : '✗';
    const statusColor = requirement.status === 'compliant' ? colors.black :
                        requirement.status === 'partial' ? colors.mediumGray : colors.darkGray;
    doc.setTextColor(...statusColor);
    doc.text(statusSymbol, margin + 4, yPos + 7);
    
    // Title and ID
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.black);
    const maxTitleWidth = contentWidth - 50;
    const titleText = doc.splitTextToSize(requirement.requirement, maxTitleWidth)[0];
    doc.text(titleText, margin + 12, yPos + 7);
    
    const idWidth = doc.getTextWidth(requirement.id);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.mediumGray);
    doc.text(requirement.id, pageWidth - margin - idWidth - 4, yPos + 7);
    
    // Description
    let currentY = yPos + 13;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.mediumGray);
    doc.text(descLines, margin + 4, currentY);
    currentY += descLines.length * 3.5 + 4;
    
    // Assessment details
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.mediumGray);
    doc.text('ASSESSMENT', margin + 4, currentY);
    currentY += 4;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.black);
    doc.text(detailLines, margin + 4, currentY);
    
    yPos += cardHeight + 3;
  };

  // Standards details
  complianceAssessment.reports.forEach(report => {
    addDivider();
    addSubSection(report.standard);
    
    const reqWithStatus = report.requirements.filter(r => r.status !== 'not-applicable');
    reqWithStatus.forEach(req => addRequirementCard(req, report.standard));
  });

  // ========== SECTION X: RISK ASSESSMENT ==========
  if (ctData) {
    addDivider();
    addSection('X. RISK ASSESSMENT');

    const riskAssessment = performRiskAssessment(
      vulnReport,
      complianceAssessment,
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
    );

    // Overall risk score
    checkNewPage(25);
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, yPos, contentWidth, 20, 'F');
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, contentWidth, 20);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.mediumGray);
    doc.text('OVERALL RISK SCORE', margin + 5, yPos + 6);
    doc.text('RISK LEVEL', pageWidth / 2 + 10, yPos + 6);
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.black);
    doc.text(riskAssessment.overallRiskScore.toString(), margin + 5, yPos + 15);
    
    doc.setFontSize(11);
    doc.text(riskAssessment.riskLevel.toUpperCase(), pageWidth / 2 + 10, yPos + 15);
    yPos += 25;

    // Risk factors
    addSubSection('Risk Factors');
    const riskFactorData: [string, string][] = [
      ['Vulnerabilities', riskAssessment.riskFactors.vulnerabilities.toString()],
      ['Compliance', riskAssessment.riskFactors.compliance.toString()],
      ['Configuration', riskAssessment.riskFactors.configuration.toString()],
      ['Exposure', riskAssessment.riskFactors.exposure.toString()],
    ];
    
    const factorBoxWidth = (contentWidth - 9) / 4;
    riskFactorData.forEach((item, i) => {
      const xOffset = margin + (factorBoxWidth + 3) * i;
      doc.setFillColor(250, 250, 250);
      doc.rect(xOffset, yPos, factorBoxWidth, 16, 'F');
      doc.setDrawColor(...colors.lightGray);
      doc.setLineWidth(0.5);
      doc.rect(xOffset, yPos, factorBoxWidth, 16);
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.mediumGray);
      doc.text(item[0].toUpperCase(), xOffset + 3, yPos + 5);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      doc.text(item[1], xOffset + 3, yPos + 13);
    });
    yPos += 20;

    // Business Impact
    addSubSection('Business Impact (CIA Triad)');
    const impactData: [string, string][] = [
      ['Confidentiality', riskAssessment.businessImpact.confidentiality.toUpperCase()],
      ['Integrity', riskAssessment.businessImpact.integrity.toUpperCase()],
      ['Availability', riskAssessment.businessImpact.availability.toUpperCase()],
    ];
    
    const impactBoxWidth = (contentWidth - 6) / 3;
    impactData.forEach((item, i) => {
      const xOffset = margin + (impactBoxWidth + 3) * i;
      doc.setFillColor(250, 250, 250);
      doc.rect(xOffset, yPos, impactBoxWidth, 12, 'F');
      doc.setDrawColor(...colors.lightGray);
      doc.setLineWidth(0.5);
      doc.rect(xOffset, yPos, impactBoxWidth, 12);
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.mediumGray);
      doc.text(item[0].toUpperCase(), xOffset + 3, yPos + 4);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      doc.text(item[1], xOffset + 3, yPos + 9.5);
    });
    yPos += 16;

    // Attack Vectors
    if (riskAssessment.attackVectors.length > 0) {
      addSubSection('Potential Attack Vectors');
      riskAssessment.attackVectors.slice(0, 5).forEach((vector: AttackVector) => {
        const descLines = doc.splitTextToSize(vector.description, contentWidth - 8);
        const exploitLines = doc.splitTextToSize(vector.exploitability, contentWidth - 8);
        const mitigationLines = doc.splitTextToSize(vector.mitigation, contentWidth - 8);
        const cardHeight = 18 + (descLines.length * 3.5) + (exploitLines.length * 3.5) + (mitigationLines.length * 3.5);
        
        checkNewPage(cardHeight + 5);
        
        doc.setDrawColor(...colors.lightGray);
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, contentWidth, cardHeight);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.black);
        doc.text(vector.name, margin + 4, yPos + 6);
        
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.mediumGray);
        doc.text(`${vector.likelihood.toUpperCase()} LIKELIHOOD | ${vector.impact.toUpperCase()} IMPACT`, 
          pageWidth - margin - 80, yPos + 6);
        
        let currentY = yPos + 12;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.mediumGray);
        doc.text(descLines, margin + 4, currentY);
        currentY += descLines.length * 3.5 + 3;
        
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('EXPLOITABILITY', margin + 4, currentY);
        currentY += 3;
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(exploitLines, margin + 4, currentY);
        currentY += exploitLines.length * 3.5 + 3;
        
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('MITIGATION', margin + 4, currentY);
        currentY += 3;
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.black);
        doc.text(mitigationLines, margin + 4, currentY);
        
        yPos += cardHeight + 4;
      });
    }

    // Remediation Actions
    if (riskAssessment.remediationActions.length > 0) {
      addSubSection('Prioritized Remediation Actions');
      riskAssessment.remediationActions.slice(0, 10).forEach((action: RemediationAction, index: number) => {
        const descLines = doc.splitTextToSize(action.description, contentWidth - 12);
        const cardHeight = 18 + (descLines.length * 3.5);
        
        checkNewPage(cardHeight + 5);
        
        doc.setDrawColor(...colors.lightGray);
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, contentWidth, cardHeight);
        
        // Priority badge
        doc.setFillColor(...colors.black);
        doc.rect(margin, yPos, 18, cardHeight, 'F');
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text((index + 1).toString(), margin + 7, yPos + (cardHeight / 2) + 2);
        
        // Action details
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.black);
        const titleLines = doc.splitTextToSize(action.title, contentWidth - 90);
        doc.text(titleLines[0], margin + 22, yPos + 6);
        
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.mediumGray);
        doc.text(`${action.priority.toUpperCase()} | ${action.effort.toUpperCase()} EFFORT | ${action.timeframe}`, 
          pageWidth - margin - 80, yPos + 6);
        
        doc.setFontSize(8);
        doc.text(descLines, margin + 22, yPos + 11);
        
        yPos += cardHeight + 3;
      });
    }
  }

  // ========== SECTION XI: SCORE BREAKDOWN ==========
  addDivider();
  addSection('XI. SCORE BREAKDOWN');

  const scoreBreakdown = {
    encryption: certData.tlsVersion === 'TLS 1.3' ? 100 : certData.tlsVersion === 'TLS 1.2' ? 90 : 60,
    keyStrength: certData.publicKey.bits >= 4096 ? 100 : certData.publicKey.bits >= 2048 ? 90 : 60,
    validity: certData.daysRemaining > 30 ? 100 : certData.daysRemaining > 0 ? 70 : 0,
    trust: !certData.isSelfSigned ? 100 : 30,
    configuration: certData.securityIssues.length === 0 ? 100 : Math.max(60, 100 - (certData.securityIssues.length * 10)),
  };

  addSubSection('Category Scores');
  const scoreData: [string, string, number][] = [
    ['Encryption Protocol', certData.tlsVersion, scoreBreakdown.encryption],
    ['Key Strength', `${certData.publicKey.bits}-bit ${certData.publicKey.algorithm}`, scoreBreakdown.keyStrength],
    ['Certificate Validity', `${certData.daysRemaining} days remaining`, scoreBreakdown.validity],
    ['Trust & Authority', certData.isSelfSigned ? 'Self-Signed' : certData.issuer.organization, scoreBreakdown.trust],
    ['Configuration', certData.securityIssues.length === 0 ? 'No issues' : `${certData.securityIssues.length} issues`, scoreBreakdown.configuration],
  ];

  scoreData.forEach(([category, detail, score]) => {
    checkNewPage(18);
    
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, yPos, contentWidth, 14, 'F');
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, contentWidth, 14);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.black);
    doc.text(category, margin + 4, yPos + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.mediumGray);
    doc.text(detail, margin + 4, yPos + 10);
    
    // Score bar
    const barWidth = 60;
    const barX = pageWidth - margin - barWidth - 4;
    doc.setFillColor(...colors.veryLightGray);
    doc.rect(barX, yPos + 4, barWidth, 6, 'F');
    doc.setFillColor(...colors.black);
    doc.rect(barX, yPos + 4, (barWidth * score) / 100, 6, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.black);
    doc.text(score.toString(), pageWidth - margin - 20, yPos + 9);
    
    yPos += 16;
  });

  yPos += 3;
  addSubSection('Score Methodology');
  addText(
    'Scores are calculated based on current industry standards from NIST, IETF, and security research. Each category is weighted differently: Encryption (25%), Key Strength (25%), Validity (20%), Trust (20%), Configuration (10%). The final grade reflects the weighted average of all categories.',
    9, false, colors.mediumGray
  );

  // ========== APPENDIX: TECHNICAL DATA ==========
  addDivider();
  addSection('APPENDIX: TECHNICAL DATA');
  
  addDataGrid([
    ['Serial Number', certData.serialNumber],
    ['Fingerprint (SHA-1)', certData.fingerprint],
    ['Fingerprint (SHA-256)', certData.fingerprintSha256],
    ['Certificate Version', `X.509 v${certData.version}`],
    ['Wildcard Certificate', certData.isWildcard ? 'Yes' : 'No'],
    ['Self-Signed', certData.isSelfSigned ? 'Yes' : 'No'],
    ['Expires Soon Warning', certData.isExpiringSoon ? 'Yes (< 30 days)' : 'No'],
  ]);

  // Footer info box
  checkNewPage(20);
  yPos += 5;
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, contentWidth, 22, 'F');
  doc.setDrawColor(...colors.lightGray);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, 22);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.mediumGray);
  doc.text('ABOUT THIS REPORT', margin + 5, yPos + 5);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.mediumGray);
  const footerText = 'This report was generated by Aletheia, a professional SSL/TLS certificate analysis platform. Analysis combines direct certificate inspection with Certificate Transparency log data to provide comprehensive security insights. For questions or support, visit the project repository.';
  const footerLines = doc.splitTextToSize(footerText, contentWidth - 10);
  doc.text(footerLines, margin + 5, yPos + 10);

  // Page numbers and footers on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(...colors.veryLightGray);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.lightGray);
    doc.text(
      `Aletheia Security Intelligence Report`,
      margin,
      pageHeight - 10
    );
    doc.text(
      `${domain}`,
      pageWidth / 2 - doc.getTextWidth(domain) / 2,
      pageHeight - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );
  }

  // Save the PDF
  doc.save(`${domain}-security-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}
