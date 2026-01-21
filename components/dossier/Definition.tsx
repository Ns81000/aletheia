'use client';

import { ReactNode, useState } from 'react';

interface DefinitionProps {
  term: string;
  definition: string;
  children?: ReactNode;
}

export default function Definition({ term, definition, children }: DefinitionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        className="cursor-help border-b border-dashed border-gray-400 dark:border-gray-600"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children || term}
      </span>

      {isHovered && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2 text-body-sm text-black shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:text-white">
          <span className="block font-semibold">{term}</span>
          <span className="block max-w-xs whitespace-normal text-gray-600 dark:text-gray-400">
            {definition}
          </span>
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -ml-1 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950" />
        </span>
      )}
    </span>
  );
}
