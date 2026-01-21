import { format, formatDistanceToNow, differenceInDays } from 'date-fns';

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}

/**
 * Get relative time from now
 */
export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Get days remaining until date
 */
export function getDaysRemaining(date: string | Date): number {
  return differenceInDays(new Date(date), new Date());
}

/**
 * Check if certificate is expiring soon (< 30 days)
 */
export function isExpiringSoon(date: string | Date): boolean {
  const days = getDaysRemaining(date);
  return days >= 0 && days < 30;
}

/**
 * Check if certificate is expired
 */
export function isExpired(date: string | Date): boolean {
  return getDaysRemaining(date) < 0;
}

/**
 * Format validity period
 */
export function formatValidityPeriod(from: string | Date, to: string | Date): string {
  const fromDate = formatDate(from);
  const toDate = formatDate(to);
  const days = differenceInDays(new Date(to), new Date(from));
  return `${fromDate} - ${toDate} (${days} days)`;
}
