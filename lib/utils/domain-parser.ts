/**
 * Parse and clean domain from various input formats
 * Accepts: example.com, https://example.com, www.example.com, etc.
 * Returns: example.com (cleaned lowercase domain)
 */
export function parseDomain(input: string): string {
  if (!input) {
    throw new Error('Domain input is required');
  }

  // Remove protocol
  let domain = input.replace(/^https?:\/\//, '');

  // Remove path
  domain = domain.split('/')[0];

  // Remove port
  domain = domain.split(':')[0];

  // Remove trailing dot
  domain = domain.replace(/\.$/, '');

  // Convert to lowercase
  domain = domain.toLowerCase();

  // Validate
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
  if (!domainRegex.test(domain)) {
    throw new Error('Invalid domain format');
  }

  return domain;
}

/**
 * Validate if a string is a valid domain
 */
export function isValidDomain(input: string): boolean {
  try {
    parseDomain(input);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract hostname from URL
 */
export function extractHostname(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname;
  } catch {
    return parseDomain(url);
  }
}
