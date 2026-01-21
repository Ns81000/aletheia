'use client';

import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface SecurityExplainerProps {
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    score: number;
}

export default function SecurityExplainer({ grade, score }: SecurityExplainerProps) {
    const getExplanation = () => {
        if (['A+', 'A'].includes(grade)) {
            return {
                title: 'Excellent Security',
                description: 'This site uses modern encryption standards. Your connection is secure and private.',
                color: 'text-green-700 dark:text-gray-300',
                icon: ShieldCheck,
                borderColor: 'border-green-200 dark:border-gray-700',
                bgGlow: 'bg-green-50 dark:bg-gray-900',
                iconBg: 'bg-green-100 dark:bg-gray-800',
            };
        } else if (['B', 'C'].includes(grade)) {
            return {
                title: 'Adequate Security',
                description: 'This site is secure but uses some older configurations. It could be optimized.',
                color: 'text-yellow-700 dark:text-gray-400',
                icon: Shield,
                borderColor: 'border-yellow-200 dark:border-gray-700',
                bgGlow: 'bg-yellow-50 dark:bg-gray-900',
                iconBg: 'bg-yellow-100 dark:bg-gray-800',
            };
        } else {
            return {
                title: 'Weak Security',
                description: 'This site has serious security issues. Your connection might not be fully private.',
                color: 'text-red-700 dark:text-gray-500',
                icon: ShieldAlert,
                borderColor: 'border-red-200 dark:border-gray-700',
                bgGlow: 'bg-red-50 dark:bg-gray-900',
                iconBg: 'bg-red-100 dark:bg-gray-800',
            };
        }
    };

    const content = getExplanation();
    const Icon = content.icon;

    return (
        <div className={`relative overflow-hidden rounded-xl border ${content.borderColor} ${content.bgGlow} p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-md`}>
            <div className="flex items-start gap-4">
                <div className={`rounded-full p-3 ${content.iconBg} ${content.color}`}>
                    <Icon className="h-8 w-8" />
                </div>
                <div>
                    <h3 className={`mb-1 text-lg font-bold ${content.color}`}>
                        {content.title}
                    </h3>
                    <p className="text-gray-700 dark:text-dark-text-secondary">
                        {content.description}
                    </p>
                </div>
            </div>

            {/* Decorative background element */}
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${content.bgGlow} blur-3xl`} />
        </div>
    );
}
