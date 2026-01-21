'use client';

import { CertificateData } from '@/types/certificate';
import { BookOpen, Check, Shield, Lock, Globe } from 'lucide-react';

interface DetailedAnalysisProps {
    data: CertificateData;
}

export default function DetailedAnalysis({ data }: DetailedAnalysisProps) {
    return (
        <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                <BookOpen className="h-6 w-6 text-black dark:text-white" />
                Detailed Security Analysis
            </h2>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Identity Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-glass">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Globe className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Identity Verification</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-dark-text-secondary">Subject Name</div>
                            <div className="font-mono text-sm break-all text-gray-900 dark:text-white">{data.subject.commonName}</div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-dark-text-secondary">Alternative Names (SANs)</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {data.subjectAltNames.slice(0, 5).map((san, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono text-gray-700 border border-gray-200 dark:bg-dark-bg dark:text-dark-text-secondary dark:border-dark-border">
                                        {san}
                                    </span>
                                ))}
                                {data.subjectAltNames.length > 5 && (
                                    <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-dark-text-secondary">
                                        +{data.subjectAltNames.length - 5} more
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm dark:bg-dark-bg/50">
                            <span className="font-bold text-blue-700 dark:text-blue-400">What this means:</span>
                            <p className="mt-1 text-blue-900/80 dark:text-dark-text-secondary">
                                This certificate proves that the server you are connecting to is authorized to represent <strong>{data.subject.commonName}</strong>. The "Subject Alternative Names" list all other domains this single certificate is valid for.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Encryption Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-glass">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-green-50 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <Lock className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Encryption Strength</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-dark-text-secondary">Protocol</div>
                                <div className="font-mono text-sm text-gray-900 dark:text-white">{data.tlsVersion}</div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-dark-text-secondary">Key Size</div>
                                <div className="font-mono text-sm text-gray-900 dark:text-white">{data.publicKey.bits} bits</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-dark-text-secondary">Cipher Suite</div>
                            <div className="font-mono text-xs break-all text-gray-900 dark:text-white">{data.cipherSuite}</div>
                        </div>

                        <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm dark:bg-dark-bg/50">
                            <span className="font-bold text-green-700 dark:text-green-400">What this means:</span>
                            <p className="mt-1 text-green-900/80 dark:text-dark-text-secondary">
                                Your connection is encrypted using <strong>{data.publicKey.algorithm}</strong> with a <strong>{data.publicKey.bits}-bit key</strong>. This makes it mathematically impossible for attackers to read your data without the private key.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trust Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-glass lg:col-span-2">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Trust & Authentication</h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-dark-text-secondary">Issuer</div>
                                <div className="font-medium text-gray-900 dark:text-white">{data.issuer.organization}</div>
                                <div className="text-xs text-gray-500 dark:text-dark-text-secondary">{data.issuer.commonName}</div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-dark-text-secondary">Signature Algorithm</div>
                                <div className="font-mono text-sm text-gray-900 dark:text-white">{data.signatureAlgorithm}</div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-purple-50 p-4 text-sm dark:bg-dark-bg/50">
                            <span className="font-bold text-purple-700 dark:text-purple-400">What this means:</span>
                            <p className="mt-2 text-purple-900/80 dark:text-dark-text-secondary">
                                This certificate was issued by <strong>{data.issuer.organization}</strong>, a trusted Certificate Authority (CA). Your browser trusts this CA, and therefore trusts this certificate. The signature algorithm ensures the certificate hasn't been tampered with.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
