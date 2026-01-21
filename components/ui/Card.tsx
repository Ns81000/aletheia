import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({ children, className = '', title, description }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-light-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-dark-border dark:bg-gray-900 ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
