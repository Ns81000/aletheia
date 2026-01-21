'use client';

import { Shield, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ComplianceReport, ComplianceRequirement } from '@/lib/security/compliance-checker';

interface ComplianceReportProps {
  reports: ComplianceReport[];
  overallCompliance: number;
}

export function ComplianceReportComponent({ reports, overallCompliance }: ComplianceReportProps) {
  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <Shield className="w-5 h-5 text-black dark:text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold text-black dark:text-white">Compliance Overview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Industry standard validation
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-3xl font-bold text-black dark:text-white">{overallCompliance}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Compliance</div>
          </div>
        </div>

        {/* Standard cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {reports.map((report) => (
            <div
              key={report.standard}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 sm:p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-black dark:text-white">{report.standard}</h4>
                <StatusBadge status={report.overallStatus} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Score</span>
                  <span className="font-semibold text-black dark:text-white">
                    {report.complianceScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Requirements</span>
                  <span className="font-semibold text-black dark:text-white">
                    {report.compliantRequirements}/{report.totalRequirements}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed reports for each standard */}
      {reports.map((report) => (
        <StandardReport key={report.standard} report={report} />
      ))}
    </div>
  );
}

function StandardReport({ report }: { report: ComplianceReport }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black dark:text-white">{report.standard}</h3>
        <StatusBadge status={report.overallStatus} />
      </div>

      <div className="space-y-3">
        {report.requirements.map((requirement, idx) => (
          <RequirementCard key={idx} requirement={requirement} />
        ))}
      </div>
    </div>
  );
}

function RequirementCard({ requirement }: { requirement: ComplianceRequirement }) {
  if (requirement.status === 'not-applicable') {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-4">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {requirement.status === 'compliant' ? (
            <CheckCircle2 className="w-5 h-5 text-black dark:text-white" strokeWidth={1.5} />
          ) : requirement.status === 'partial' ? (
            <Info className="w-5 h-5 text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
          ) : (
            <AlertCircle className="w-5 h-5 text-gray-500 dark:text-gray-500" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2">
            <h4 className="font-semibold text-black dark:text-white break-words">{requirement.requirement}</h4>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
              {requirement.id}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {requirement.description}
          </p>

          <div className="bg-white dark:bg-black rounded-lg p-3 mb-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">
              Assessment
            </div>
            <div className="text-sm text-black dark:text-white">
              {requirement.details}
            </div>
          </div>

          {requirement.reference && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Reference: {requirement.reference}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'compliant' | 'non-compliant' | 'partial' }) {
  const colors = {
    compliant: 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white',
    partial: 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white',
    'non-compliant': 'bg-gray-400 dark:bg-gray-600 text-white dark:text-black',
  };

  const labels = {
    compliant: 'Compliant',
    partial: 'Partial',
    'non-compliant': 'Non-Compliant',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}
