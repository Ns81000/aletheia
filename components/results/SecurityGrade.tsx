'use client';

import SecurityShield from './SecurityShield';
import SecurityExplainer from '@/components/education/SecurityExplainer';

interface SecurityGradeProps {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  issues: string[];
}

export default function SecurityGrade({ grade, score, issues }: SecurityGradeProps) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Visual Shield */}
      <div className="flex justify-center lg:w-1/3">
        <div className="scale-75 sm:scale-100">
          <SecurityShield grade={grade} score={score} />
        </div>
      </div>

      {/* Right: Context & Explanation */}
      <div className="flex-1 space-y-6">
        <SecurityExplainer grade={grade} score={score} />

        {/* Issues List (if any) */}
        {issues.length > 0 && (
          <div className="rounded-xl border border-light-border bg-white/50 p-6 backdrop-blur-sm dark:border-dark-border dark:bg-dark-glass">
            <h4 className="mb-3 font-semibold text-light-text dark:text-white">
              Improvements Needed
            </h4>
            <ul className="space-y-2">
              {issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-gray-500" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
