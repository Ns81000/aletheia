'use client';

import { Globe } from 'lucide-react';

interface SubdomainGridProps {
    subdomains: string[];
}

export default function SubdomainGrid({ subdomains }: SubdomainGridProps) {
    return (
        <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <Globe className="h-6 w-6 text-black dark:text-white" />
                Discovered Subdomains
                <span className="ml-2 rounded-full bg-light-bg px-2 py-1 text-sm font-normal text-light-text-secondary dark:bg-dark-bg dark:text-dark-text-secondary">
                    {subdomains.length}
                </span>
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subdomains.slice(0, 24).map((subdomain, index) => (
                    <div
                        key={index}
                        className="group flex items-center gap-3 rounded-lg border border-light-border bg-white/50 p-3 transition-all hover:border-gray-400 hover:shadow-md dark:border-dark-border dark:bg-dark-glass dark:hover:border-gray-600"
                    >
                        <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
                        <span className="truncate font-mono text-sm text-light-text dark:text-dark-text">
                            {subdomain}
                        </span>
                    </div>
                ))}

                {subdomains.length > 24 && (
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-light-border bg-light-bg/50 p-3 text-sm text-light-text-secondary dark:border-dark-border dark:bg-dark-bg/50 dark:text-dark-text-secondary">
                        +{subdomains.length - 24} more subdomains
                    </div>
                )}
            </div>
        </div>
    );
}
