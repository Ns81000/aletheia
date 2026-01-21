'use client';

import { ChainCertificate } from '@/types/certificate';
import { CheckCircle, Link as LinkIcon, Shield } from 'lucide-react';

interface TrustChainVisualizerProps {
    chain: ChainCertificate[];
}

export default function TrustChainVisualizer({ chain }: TrustChainVisualizerProps) {
    return (
        <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                <LinkIcon className="h-6 w-6 text-black dark:text-white" />
                Chain of Trust
            </h2>

            <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-4 lg:items-start">
                {chain.map((cert, index) => {
                    const isRoot = index === chain.length - 1;
                    const isEndEntity = index === 0;

                    return (
                        <div key={index} className="relative flex flex-col items-center text-center lg:flex-1">
                            {/* Node Icon */}
                            <div className={`z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white shadow-sm transition-all hover:scale-110 dark:bg-dark-bg ${isRoot
                                    ? 'border-gray-300 text-gray-700 dark:border-white dark:text-white'
                                    : isEndEntity
                                        ? 'border-gray-200 text-gray-600 dark:border-gray-300 dark:text-gray-300'
                                        : 'border-gray-100 text-gray-500 dark:border-light-border dark:text-light-text-secondary'
                                }`}>
                                {isRoot ? <Shield className="h-8 w-8" /> : <CheckCircle className="h-8 w-8" />}
                            </div>

                            {/* Card */}
                            <div className="w-full max-w-xs rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-dark-border dark:bg-dark-glass dark:backdrop-blur-sm">
                                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-light-text-secondary/60">
                                    {isRoot ? 'Root CA' : isEndEntity ? 'Your Domain' : 'Intermediate CA'}
                                </div>
                                <div className="mb-3 font-bold text-gray-900 dark:text-white break-words">
                                    {cert.subject}
                                </div>

                                <div className="space-y-2 text-xs text-gray-600 dark:text-dark-text-secondary">
                                    <div className="flex flex-col gap-1 rounded-lg bg-gray-50 p-2 dark:bg-dark-bg/50">
                                        <span className="font-semibold opacity-70">ISSUED BY</span>
                                        <span className="break-words">{cert.issuer}</span>
                                    </div>

                                    {cert.validTo && (
                                        <div className="flex flex-col gap-1 rounded-lg bg-gray-50 p-2 dark:bg-dark-bg/50">
                                            <span className="font-semibold opacity-70">EXPIRES</span>
                                            <span>{new Date(cert.validTo).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
