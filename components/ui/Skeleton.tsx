interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
}: SkeletonProps) {
  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'text'
      ? 'rounded h-4'
      : 'rounded-lg';

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 ${variantClass} ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-light-border bg-white p-6 dark:border-dark-border dark:bg-gray-900">
      <Skeleton className="mb-4 h-6 w-1/3" variant="text" />
      <Skeleton className="mb-2 h-4 w-full" variant="text" />
      <Skeleton className="mb-2 h-4 w-5/6" variant="text" />
      <Skeleton className="h-4 w-4/6" variant="text" />
    </div>
  );
}
