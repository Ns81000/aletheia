'use client';

import { format, differenceInDays } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

interface TimelineScrubberProps {
    validFrom: string;
    validTo: string;
}

export default function TimelineScrubber({ validFrom, validTo }: TimelineScrubberProps) {
    const startDate = new Date(validFrom);
    const endDate = new Date(validTo);
    const now = new Date();

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

    const daysRemaining = differenceInDays(endDate, now);
    const isExpiringSoon = daysRemaining < 30;

    return (
        <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                <Clock className="h-6 w-6 text-black dark:text-white" />
                Validity Timeline
            </h2>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                {/* Progress Bar Container */}
                <div className="relative mb-4 h-4 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                    {/* Active Progress */}
                    <div
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${isExpiringSoon ? 'bg-gray-500 dark:bg-gray-600' : 'bg-black dark:bg-white'
                            }`}
                        style={{ width: `${progress}%` }}
                    >
                        {/* Current Indicator */}
                        <div className="absolute -right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-inherit shadow-lg dark:border-black" />

                        {/* Tooltip */}
                        <div className="absolute -right-8 -top-12 w-20 text-center rounded-md bg-black px-2 py-1 text-xs font-bold text-white shadow-lg dark:bg-white dark:text-black">
                            TODAY
                            <div className="absolute bottom-0 left-1/2 -mb-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-black dark:bg-white" />
                        </div>
                    </div>
                </div>

                {/* Dates and Labels Below Timeline */}
                <div className="flex justify-between items-start">
                    <div className="text-left">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Issued</div>
                        <div className="text-base font-bold text-black dark:text-white">{format(startDate, 'MMM dd, yyyy')}</div>
                    </div>

                    <div className="text-center">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Today</div>
                        <div className="text-base font-bold text-black dark:text-white">{format(now, 'MMM dd, yyyy')}</div>
                    </div>

                    <div className="text-right">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Expires</div>
                        <div className={`text-base font-bold ${isExpiringSoon ? 'text-gray-600 dark:text-gray-400' : 'text-black dark:text-white'}`}>
                            {format(endDate, 'MMM dd, yyyy')}
                        </div>
                    </div>
                </div>

                {/* Status Text */}
                <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-gray-50 p-3 font-medium text-black dark:bg-gray-900 dark:text-white">
                    <Calendar className="h-5 w-5" />
                    <span>
                        {daysRemaining > 0
                            ? `${daysRemaining} days remaining`
                            : `Expired ${Math.abs(daysRemaining)} days ago`}
                    </span>
                </div>
            </div>
        </div>
    );
}
