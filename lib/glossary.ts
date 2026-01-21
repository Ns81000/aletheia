export interface GlossaryTerm {
  term: string;
  definition: string;
  learnMore?: string;
}

export const glossary: Record<string, GlossaryTerm> = {
  'TLS': {
    term: 'Transport Layer Security',
    definition: 'A cryptographic protocol that provides secure communication over a computer network. It encrypts data transmitted between your browser and a server.',
    learnMore: '/learn/tls'
  },
  'SSL': {
    term: 'Secure Sockets Layer',
    definition: 'The predecessor to TLS. Though deprecated, the term "SSL certificate" is still commonly used to refer to TLS certificates.',
    learnMore: '/learn/ssl'
  },
  'Certificate Authority': {
    term: 'Certificate Authority (CA)',
    definition: 'A trusted organization that issues digital certificates. Browsers trust a pre-installed list of CAs, which forms the basis of web security.',
    learnMore: '/learn/ca'
  },
  'RSA': {
    term: 'RSA Encryption',
    definition: 'A public-key cryptosystem widely used for secure data transmission. Named after its inventors: Rivest, Shamir, and Adleman.',
    learnMore: '/learn/rsa'
  },
  'Cipher Suite': {
    term: 'Cipher Suite',
    definition: 'A set of algorithms that help secure a network connection. It includes key exchange, authentication, encryption, and message authentication code (MAC) algorithms.',
    learnMore: '/learn/cipher-suite'
  },
  'Subject Alternative Name': {
    term: 'Subject Alternative Name (SAN)',
    definition: 'An extension to X.509 certificates that allows multiple hostnames to be protected by a single certificate. Includes domain names, IP addresses, and email addresses.',
    learnMore: '/learn/san'
  },
  'Certificate Chain': {
    term: 'Certificate Chain',
    definition: 'A hierarchical sequence of certificates from the end-entity certificate up to the root CA certificate. Each certificate is signed by the one above it.',
    learnMore: '/learn/chain'
  },
  'Public Key': {
    term: 'Public Key',
    definition: 'The publicly available part of an asymmetric key pair used in encryption. Can be shared openly and is used to encrypt data or verify signatures.',
    learnMore: '/learn/public-key'
  },
  'Private Key': {
    term: 'Private Key',
    definition: 'The secret part of an asymmetric key pair. Must be kept secure and is used to decrypt data or create digital signatures.',
    learnMore: '/learn/private-key'
  },
  'Root Certificate': {
    term: 'Root Certificate',
    definition: 'A self-signed certificate at the top of a certificate chain. Browsers and operating systems maintain a list of trusted root certificates.',
    learnMore: '/learn/root-cert'
  },
  'Intermediate Certificate': {
    term: 'Intermediate Certificate',
    definition: 'A certificate that sits between the root certificate and end-entity certificate. It helps distribute the trust chain and protects root certificates.',
    learnMore: '/learn/intermediate'
  },
  'Self-Signed Certificate': {
    term: 'Self-Signed Certificate',
    definition: 'A certificate signed by its own private key rather than a trusted CA. Browsers will show security warnings for these certificates.',
    learnMore: '/learn/self-signed'
  },
  'Wildcard Certificate': {
    term: 'Wildcard Certificate',
    definition: 'A certificate that covers a domain and all its subdomains at one level. Indicated by an asterisk (*) in the domain name (e.g., *.example.com).',
    learnMore: '/learn/wildcard'
  },
  'SHA-256': {
    term: 'SHA-256',
    definition: 'A cryptographic hash function that produces a 256-bit hash value. Part of the SHA-2 family and widely used in certificate signatures.',
    learnMore: '/learn/sha256'
  },
  'X.509': {
    term: 'X.509',
    definition: 'A standard format for public key certificates. Defines the structure of certificates used in TLS/SSL and other cryptographic protocols.',
    learnMore: '/learn/x509'
  },
  'Certificate Transparency': {
    term: 'Certificate Transparency (CT)',
    definition: 'An open framework for monitoring and auditing certificates. All certificates issued by major CAs are logged publicly, making mis-issuance detectable.',
    learnMore: '/learn/ct'
  },
  'Serial Number': {
    term: 'Serial Number',
    definition: 'A unique identifier assigned to each certificate by the issuing CA. Used to track and potentially revoke certificates.',
    learnMore: '/learn/serial'
  },
  'Fingerprint': {
    term: 'Fingerprint',
    definition: 'A hash of the entire certificate used as a unique identifier. SHA-256 fingerprints are the current standard.',
    learnMore: '/learn/fingerprint'
  },
  'OCSP': {
    term: 'Online Certificate Status Protocol',
    definition: 'A protocol for checking if a certificate has been revoked. Provides real-time validation of certificate status.',
    learnMore: '/learn/ocsp'
  },
  'Key Size': {
    term: 'Key Size',
    definition: 'The length of the cryptographic key measured in bits. Larger keys are more secure but require more computational resources. 2048 bits is the current minimum for RSA.',
    learnMore: '/learn/key-size'
  },
  'Forward Secrecy': {
    term: 'Forward Secrecy',
    definition: 'A property of key exchange protocols ensuring that session keys will not be compromised even if the server\'s private key is compromised in the future.',
    learnMore: '/learn/forward-secrecy'
  },
  'HSTS': {
    term: 'HTTP Strict Transport Security',
    definition: 'A security header that tells browsers to only connect to a website over HTTPS, preventing downgrade attacks.',
    learnMore: '/learn/hsts'
  },
  'CAA Record': {
    term: 'Certification Authority Authorization',
    definition: 'A DNS record that specifies which CAs are allowed to issue certificates for a domain. Helps prevent unauthorized certificate issuance.',
    learnMore: '/learn/caa'
  },
  'ECC': {
    term: 'Elliptic Curve Cryptography',
    definition: 'A public-key cryptography approach based on elliptic curves. Provides similar security to RSA with smaller key sizes.',
    learnMore: '/learn/ecc'
  },
  'DV Certificate': {
    term: 'Domain Validated Certificate',
    definition: 'A certificate that only validates domain ownership. The simplest and quickest to obtain, used by most websites.',
    learnMore: '/learn/dv'
  },
  'OV Certificate': {
    term: 'Organization Validated Certificate',
    definition: 'A certificate that validates both domain ownership and organization identity. Requires additional verification documents.',
    learnMore: '/learn/ov'
  },
  'EV Certificate': {
    term: 'Extended Validation Certificate',
    definition: 'The highest level of certificate validation. Requires thorough vetting of the organization and displays the company name in some browsers.',
    learnMore: '/learn/ev'
  },
  'Signature Algorithm': {
    term: 'Signature Algorithm',
    definition: 'The cryptographic algorithm used to sign the certificate. Common examples include RSA with SHA-256 (sha256WithRSAEncryption).',
    learnMore: '/learn/signature'
  },
  'Validity Period': {
    term: 'Validity Period',
    definition: 'The time span during which a certificate is considered valid. Modern certificates have a maximum validity of 398 days (about 13 months).',
    learnMore: '/learn/validity'
  },
  'Common Name': {
    term: 'Common Name (CN)',
    definition: 'The fully qualified domain name (FQDN) of the server. Historically the primary identifier in certificates, now supplemented by SANs.',
    learnMore: '/learn/cn'
  },
  'Issuer': {
    term: 'Issuer',
    definition: 'The Certificate Authority that signed and issued the certificate. Identified by its distinguished name.',
    learnMore: '/learn/issuer'
  },
  'Subject': {
    term: 'Subject',
    definition: 'The entity (usually a domain or organization) that the certificate identifies. Described by a distinguished name.',
    learnMore: '/learn/subject'
  },
  'Distinguished Name': {
    term: 'Distinguished Name (DN)',
    definition: 'A naming standard used to identify entities in certificates. Includes fields like Common Name, Organization, Country, etc.',
    learnMore: '/learn/dn'
  },
  'Revocation': {
    term: 'Certificate Revocation',
    definition: 'The process of invalidating a certificate before its expiration date. Usually done when a private key is compromised or no longer needed.',
    learnMore: '/learn/revocation'
  },
  'CRL': {
    term: 'Certificate Revocation List',
    definition: 'A list of revoked certificates published by a CA. An older method of checking certificate status, largely replaced by OCSP.',
    learnMore: '/learn/crl'
  },
  'Key Exchange': {
    term: 'Key Exchange',
    definition: 'The method used to securely establish a shared secret between client and server. Examples include RSA and Diffie-Hellman.',
    learnMore: '/learn/key-exchange'
  },
  'Diffie-Hellman': {
    term: 'Diffie-Hellman',
    definition: 'A key exchange protocol that allows two parties to establish a shared secret over an insecure channel. Forms the basis of forward secrecy.',
    learnMore: '/learn/dh'
  },
  'MAC': {
    term: 'Message Authentication Code',
    definition: 'A short piece of information used to authenticate a message and verify its integrity. Ensures data hasn\'t been tampered with.',
    learnMore: '/learn/mac'
  },
  'PFS': {
    term: 'Perfect Forward Secrecy',
    definition: 'See Forward Secrecy. Ensures that past communications remain secure even if long-term keys are compromised.',
    learnMore: '/learn/pfs'
  },
  'SNI': {
    term: 'Server Name Indication',
    definition: 'An extension to TLS that allows a server to present multiple certificates on the same IP address and port.',
    learnMore: '/learn/sni'
  },
  'ALPN': {
    term: 'Application-Layer Protocol Negotiation',
    definition: 'A TLS extension that allows clients and servers to negotiate which protocol will be used (HTTP/1.1, HTTP/2, etc.).',
    learnMore: '/learn/alpn'
  },
  'Handshake': {
    term: 'TLS Handshake',
    definition: 'The process by which client and server establish a secure connection. Includes authentication, cipher suite negotiation, and key exchange.',
    learnMore: '/learn/handshake'
  },
  'Session Resumption': {
    term: 'Session Resumption',
    definition: 'A mechanism to reuse previously established security parameters, speeding up subsequent TLS connections.',
    learnMore: '/learn/session'
  },
  'AEAD': {
    term: 'Authenticated Encryption with Associated Data',
    definition: 'A cipher mode that provides both encryption and authentication in a single operation. Used in modern cipher suites like AES-GCM.',
    learnMore: '/learn/aead'
  },
  'PCI DSS': {
    term: 'Payment Card Industry Data Security Standard',
    definition: 'Security standards for organizations that handle credit card information. Requires strong TLS configurations.',
    learnMore: '/learn/pci-dss'
  },
  'HIPAA': {
    term: 'Health Insurance Portability and Accountability Act',
    definition: 'US legislation that mandates data privacy and security for medical information. Requires encryption of health data in transit.',
    learnMore: '/learn/hipaa'
  },
  'GDPR': {
    term: 'General Data Protection Regulation',
    definition: 'EU regulation on data protection and privacy. Requires appropriate security measures including encryption for personal data.',
    learnMore: '/learn/gdpr'
  },
  'SOC 2': {
    term: 'Service Organization Control 2',
    definition: 'An auditing procedure ensuring service providers securely manage customer data. Includes requirements for encryption and security.',
    learnMore: '/learn/soc2'
  },
  'Zero-Day': {
    term: 'Zero-Day Vulnerability',
    definition: 'A security flaw that is unknown to the software vendor or has no available patch. Can affect TLS implementations.',
    learnMore: '/learn/zero-day'
  },
  'Man-in-the-Middle': {
    term: 'Man-in-the-Middle Attack',
    definition: 'An attack where an attacker intercepts communication between two parties. Proper certificate validation prevents this.',
    learnMore: '/learn/mitm'
  },
};

export function getDefinition(key: string): GlossaryTerm | undefined {
  return glossary[key];
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(glossary).filter(
    (entry) =>
      entry.term.toLowerCase().includes(lowercaseQuery) ||
      entry.definition.toLowerCase().includes(lowercaseQuery)
  );
}
