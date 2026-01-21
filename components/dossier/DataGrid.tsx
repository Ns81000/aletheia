import { ReactNode } from 'react';

interface DataGridProps {
  data: Record<string, string | number | ReactNode>;
  columns?: 1 | 2 | 3;
}

export default function DataGrid({ data, columns = 2 }: DataGridProps) {
  const entries = Object.entries(data);

  return (
    <div
      className={`grid gap-x-6 gap-y-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-950 ${
        columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {entries.map(([label, value]) => (
        <div key={label} className="flex flex-col space-y-1 min-w-0">
          <dt className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </dt>
          <dd className="font-mono text-technical-sm sm:text-technical text-black dark:text-white break-all overflow-wrap-anywhere">
            {value}
          </dd>
        </div>
      ))}
    </div>
  );
}
