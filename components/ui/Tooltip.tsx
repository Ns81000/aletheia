'use client';

import { ReactNode, useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string | ReactNode;
  children?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({
  content,
  children,
  position = 'top',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-flex">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help"
      >
        {children || <HelpCircle className="h-4 w-4 text-gray-400" />}
      </div>

      {isVisible && (
        <div
          className={`absolute z-50 w-64 rounded-lg border border-light-border bg-white p-3 text-sm shadow-lg dark:border-dark-border dark:bg-gray-800 ${positionClasses[position]}`}
        >
          <div className="text-light-text dark:text-dark-text">{content}</div>
        </div>
      )}
    </div>
  );
}
