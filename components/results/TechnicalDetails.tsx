'use client';

import { CertificateData } from '@/types/certificate';
import DefinitionTooltip from '@/components/education/DefinitionTooltip';
import { Cpu, Globe, Key, Lock, Server } from 'lucide-react';

interface TechnicalDetailsProps {
    data: CertificateData;
}

export default function TechnicalDetails({ data }: TechnicalDetailsProps) {
    const sections = [
        {
            title: 'Encryption',
            icon: Lock,
            items: [
                {
                    label: 'Protocol',
                    value: data.tlsVersion,
                    desc: 'The language used for secure communication.',
                    isGood: data.tlsVersion === 'TLS 1.3',
                },
                {
                    label: 'Cipher Suite',
                    value: data.cipherSuite,
                    desc: 'The specific set of algorithms used to encrypt data.',
                    isGood: !data.cipherSuite.includes('CBC') && !data.cipherSuite.includes('RSA'),
                },
            ],
        },
        {
            title: 'Identity',
            icon: Globe,
            items: [
                {
                    label: 'Common Name',
                    value: data.subject.commonName,
                    desc: 'The primary domain name this certificate protects.',
                    isGood: undefined,
                },
                {
                    label: 'Organization',
                    value: data.subject.organization || 'Not Validated (DV)',
                    desc: 'The company that owns this website.',
                    isGood: undefined,
                },
            ],
        },
        {
            title: 'Cryptography',
            icon: Key,
            items: [
                {
                    label: 'Key Size',
                    value: `${data.publicKey.algorithm} ${data.publicKey.bits} bits`,
                    desc: 'The strength of the mathematical lock.',
                    isGood: data.publicKey.bits >= 2048,
                },
                {
                    label: 'Signature',
                    value: data.signatureAlgorithm,
                    desc: 'The method used to prove the certificate is authentic.',
                    isGood: data.signatureAlgorithm.includes('SHA256') || data.signatureAlgorithm.includes('SHA384'),
                },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <Cpu className="h-6 w-6 text-black dark:text-white" />
                Technical DNA
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => (
                    <div
                        key={section.title}
                        className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-400 hover:shadow-md dark:border-dark-border dark:bg-dark-glass dark:hover:border-gray-700"
                    >
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-gray-50 p-2 dark:bg-dark-bg">
                                <section.icon className="h-5 w-5 text-gray-700 dark:text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                        </div>

                        <div className="space-y-4">
                            {section.items.map((item) => (
                                <div key={item.label} className="relative">
                                    <div className="mb-1 flex items-center justify-between text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        <DefinitionTooltip term={item.label} definition={item.desc}>
                                            {item.label}
                                        </DefinitionTooltip>
                                    </div>
                                    <div className="font-mono text-sm font-medium break-all">
                                        {item.value}
                                    </div>

                                    {/* Status Indicator Line */}
                                    {item.isGood !== undefined && (
                                        <div
                                            className={`absolute -left-6 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full transition-all group-hover:w-2 ${
                                                item.isGood ? 'bg-black dark:bg-white' : 'bg-gray-400 dark:bg-gray-600'
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
