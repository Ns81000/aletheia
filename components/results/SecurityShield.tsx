'use client';

import { useEffect, useState } from 'react';

interface SecurityShieldProps {
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    score: number;
}

export default function SecurityShield({ grade, score }: SecurityShieldProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        // Animate score count up
        const duration = 1500;
        const steps = 60;
        const interval = duration / steps;
        const increment = score / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= score) {
                setAnimatedScore(score);
                clearInterval(timer);
            } else {
                setAnimatedScore(Math.floor(current));
            }
        }, interval);

        return () => clearInterval(timer);
    }, [score]);

    const getColorClasses = () => {
        if (['A+', 'A'].includes(grade)) return 'text-green-600 dark:text-gray-300 stroke-green-600 dark:stroke-gray-300 bg-green-600 dark:bg-gray-300';
        if (['B', 'C'].includes(grade)) return 'text-yellow-600 dark:text-gray-400 stroke-yellow-600 dark:stroke-gray-400 bg-yellow-600 dark:bg-gray-400';
        return 'text-red-600 dark:text-gray-500 stroke-red-600 dark:stroke-gray-500 bg-red-600 dark:bg-gray-500';
    };

    const colorClasses = getColorClasses();

    return (
        <div className="relative flex h-64 w-64 items-center justify-center">
            {/* Outer Glow Ring */}
            <div className={`absolute inset-0 animate-pulse-slow rounded-full opacity-20 blur-2xl ${colorClasses.split(' ').filter(c => c.includes('bg-')).join(' ')}`} />

            {/* Rotating Rings */}
            <svg className={`absolute inset-0 h-full w-full animate-[spin_10s_linear_infinite] ${colorClasses.split(' ').filter(c => c.includes('stroke-')).join(' ')}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
            </svg>

            <svg className={`absolute inset-0 h-full w-full animate-[spin_15s_linear_infinite_reverse] ${colorClasses.split(' ').filter(c => c.includes('stroke-')).join(' ')}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="0.5" strokeDasharray="10 10" opacity="0.5" />
            </svg>

            {/* Main Shield Shape */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div className={`text-6xl font-black tracking-tighter ${colorClasses.split(' ').filter(c => c.includes('text-')).join(' ')} drop-shadow-lg`}>
                    {grade}
                </div>
                <div className="mt-2 font-mono text-sm font-bold tracking-widest opacity-80 text-light-text dark:text-white">
                    SCORE: {animatedScore}/100
                </div>
            </div>
        </div>
    );
}
