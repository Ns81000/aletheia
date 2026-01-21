import { ReactNode } from 'react';

interface SectionProps {
  number?: string; // Roman numerals: 'I', 'II', 'III', etc.
  title: string;
  children: ReactNode;
  id?: string;
}

export default function Section({ number, title, children, id }: SectionProps) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      {/* Section Header */}
      <div className="mb-6 border-b border-gray-200 pb-3 dark:border-gray-800">
        <h2 className="text-heading-1 font-semibold tracking-tight text-black dark:text-white">
          {number && <span className="mr-3 text-gray-400 dark:text-gray-600">{number}.</span>}
          {title}
        </h2>
      </div>

      {/* Section Content */}
      <div className="space-y-6">{children}</div>
    </section>
  );
}
