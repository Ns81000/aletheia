import { ReactNode } from 'react';

interface ComparisonProps {
  headers: string[];
  rows: Array<{
    label: string;
    values: (string | number | ReactNode)[];
  }>;
}

export default function Comparison({ headers, rows }: ComparisonProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-label uppercase tracking-wide text-gray-700 dark:text-gray-300">
              Property
            </th>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-label uppercase tracking-wide text-gray-700 dark:text-gray-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-900">
              <td className="px-6 py-4 font-medium text-black dark:text-white">
                {row.label}
              </td>
              {row.values.map((value, valueIndex) => (
                <td
                  key={valueIndex}
                  className="px-6 py-4 font-mono text-technical text-gray-700 dark:text-gray-300"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
