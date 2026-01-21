'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

interface DefinitionTooltipProps {
    term: string;
    definition: string;
    children?: React.ReactNode;
}

export default function DefinitionTooltip({
    term,
    definition,
    children,
}: DefinitionTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span className="relative inline-flex items-center gap-1">
            {children && <span className="font-medium">{children}</span>}
            <button
                type="button"
                className="text-light-text-secondary hover:text-light-accent dark:text-dark-text-secondary dark:hover:text-neon-blue transition-colors"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
                aria-label={`Definition of ${term}`}
            >
                <Info className="h-4 w-4" />
            </button>

            {/* Tooltip */}
            <div
                className={`absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 transform rounded-lg border border-light-border bg-white p-4 shadow-glass backdrop-blur-md transition-all duration-200 dark:border-dark-border dark:bg-dark-glass ${isVisible
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible translate-y-2 opacity-0'
                    }`}
            >
                <div className="mb-1 font-bold text-light-text dark:text-white">
                    {term}
                </div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {definition}
                </div>

                {/* Arrow */}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-light-border bg-white dark:border-dark-border dark:bg-dark-bg" />
            </div>
        </span>
    );
}
