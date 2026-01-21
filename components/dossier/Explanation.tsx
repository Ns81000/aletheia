import { ReactNode } from 'react';

interface ExplanationProps {
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'emphasis';
}

export default function Explanation({ title = 'What This Means', children, variant = 'default' }: ExplanationProps) {
  return (
    <div
      className={`rounded-lg border p-6 ${
        variant === 'emphasis'
          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
          : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900'
      }`}
    >
      <h4 className={`mb-3 text-label-lg font-semibold uppercase tracking-wide ${
        variant === 'emphasis' ? 'text-white dark:text-black' : 'text-gray-700 dark:text-gray-300'
      }`}>
        {title}
      </h4>
      <div className={`space-y-3 text-body-sm leading-relaxed ${
        variant === 'emphasis' ? 'text-gray-200 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'
      }`}>
        {children}
      </div>
    </div>
  );
}
