import { ReactNode } from 'react';

interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  isCurrent?: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative space-y-8">
      {/* Timeline line */}
      <div className="absolute left-[9px] top-3 bottom-3 w-0.5 bg-gray-200 dark:bg-gray-800" />

      {events.map((event, index) => (
        <div key={index} className="relative pl-8">
          {/* Timeline dot */}
          <div
            className={`absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 ${
              event.isCurrent
                ? 'border-black bg-black dark:border-white dark:bg-white'
                : 'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950'
            }`}
          />

          {/* Event content */}
          <div className="space-y-1">
            <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {event.date}
            </div>
            <div className="font-medium text-black dark:text-white">
              {event.title}
              {event.isCurrent && (
                <span className="ml-2 rounded bg-black px-2 py-0.5 text-label uppercase text-white dark:bg-white dark:text-black">
                  Current
                </span>
              )}
            </div>
            {event.description && (
              <div className="text-body-sm text-gray-600 dark:text-gray-400">
                {event.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
