import { CertificateData } from '@/types/certificate';
import { format, differenceInDays } from 'date-fns';
import { ChevronRight, AlertTriangle, CheckCircle2, Minus } from 'lucide-react';

interface CertificateComparisonProps {
  previous: CertificateData;
  current: CertificateData;
}

type ChangeType = 'improvement' | 'degradation' | 'neutral';

interface Comparison {
  label: string;
  previous: string;
  current: string;
  change: ChangeType;
  note?: string;
}

export default function CertificateComparison({ previous, current }: CertificateComparisonProps) {
  const previousValidityDays = differenceInDays(
    new Date(previous.validTo),
    new Date(previous.validFrom)
  );
  const currentValidityDays = differenceInDays(
    new Date(current.validTo),
    new Date(current.validFrom)
  );

  const comparisons: Comparison[] = [
    {
      label: 'TLS Version',
      previous: previous.tlsVersion,
      current: current.tlsVersion,
      change: current.tlsVersion > previous.tlsVersion ? 'improvement' : 
              current.tlsVersion < previous.tlsVersion ? 'degradation' : 'neutral',
      note: current.tlsVersion > previous.tlsVersion ? 'Upgraded to more secure protocol' : undefined
    },
    {
      label: 'Key Algorithm',
      previous: previous.publicKey.algorithm,
      current: current.publicKey.algorithm,
      change: 'neutral'
    },
    {
      label: 'Key Size',
      previous: `${previous.publicKey.bits} bits`,
      current: `${current.publicKey.bits} bits`,
      change: current.publicKey.bits > previous.publicKey.bits ? 'improvement' :
              current.publicKey.bits < previous.publicKey.bits ? 'degradation' : 'neutral',
      note: current.publicKey.bits > previous.publicKey.bits ? 'Increased encryption strength' : undefined
    },
    {
      label: 'Signature Algorithm',
      previous: previous.signatureAlgorithm,
      current: current.signatureAlgorithm,
      change: 'neutral'
    },
    {
      label: 'Security Grade',
      previous: previous.securityGrade,
      current: current.securityGrade,
      change: getGradeChange(previous.securityGrade, current.securityGrade)
    },
    {
      label: 'Security Score',
      previous: `${previous.securityScore}/100`,
      current: `${current.securityScore}/100`,
      change: current.securityScore > previous.securityScore ? 'improvement' :
              current.securityScore < previous.securityScore ? 'degradation' : 'neutral'
    },
    {
      label: 'Certificate Authority',
      previous: previous.issuer.organization,
      current: current.issuer.organization,
      change: 'neutral'
    },
    {
      label: 'Validity Period',
      previous: `${previousValidityDays} days`,
      current: `${currentValidityDays} days`,
      change: 'neutral'
    }
  ];

  const improvementCount = comparisons.filter(c => c.change === 'improvement').length;
  const degradationCount = comparisons.filter(c => c.change === 'degradation').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <h3 className="mb-4 text-heading-3 font-bold text-black dark:text-white">
          Certificate Evolution
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-1 text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Previous Certificate
            </div>
            <div className="text-body-sm text-gray-600 dark:text-gray-400">
              Issued: {format(new Date(previous.validFrom), 'MMM dd, yyyy')}
            </div>
            <div className="text-body-sm text-gray-600 dark:text-gray-400">
              Expired: {format(new Date(previous.validTo), 'MMM dd, yyyy')}
            </div>
          </div>
          
          <div>
            <div className="mb-1 text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Current Certificate
            </div>
            <div className="text-body-sm text-gray-600 dark:text-gray-400">
              Issued: {format(new Date(current.validFrom), 'MMM dd, yyyy')}
            </div>
            <div className="text-body-sm text-gray-600 dark:text-gray-400">
              Expires: {format(new Date(current.validTo), 'MMM dd, yyyy')}
            </div>
          </div>
        </div>

        {/* Change Summary */}
        <div className="mt-6 flex items-center gap-6 border-t border-gray-200 pt-6 dark:border-gray-800">
          {improvementCount > 0 && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
              <span className="text-body-sm text-gray-600 dark:text-gray-400">
                {improvementCount} improvement{improvementCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          {degradationCount > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
              <span className="text-body-sm text-gray-600 dark:text-gray-400">
                {degradationCount} degradation{degradationCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          {improvementCount === 0 && degradationCount === 0 && (
            <div className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
              <span className="text-body-sm text-gray-600 dark:text-gray-400">
                No significant changes
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="space-y-3">
        {comparisons.map((comparison, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="mb-3 text-label font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {comparison.label}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Previous Value */}
              <div className="flex-1">
                <div className="rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-900">
                  <div className="text-body text-gray-900 dark:text-gray-100">
                    {comparison.previous}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                {comparison.change === 'improvement' && (
                  <div className="rounded-full bg-black p-2 dark:bg-white">
                    <ChevronRight className="h-4 w-4 text-white dark:text-black" strokeWidth={2} />
                  </div>
                )}
                {comparison.change === 'degradation' && (
                  <div className="rounded-full bg-gray-300 p-2 dark:bg-gray-700">
                    <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" strokeWidth={2} />
                  </div>
                )}
                {comparison.change === 'neutral' && (
                  <div className="rounded-full bg-gray-200 p-2 dark:bg-gray-800">
                    <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" strokeWidth={2} />
                  </div>
                )}
              </div>

              {/* Current Value */}
              <div className="flex-1">
                <div
                  className={`rounded-lg px-4 py-3 ${
                    comparison.change === 'improvement'
                      ? 'bg-black dark:bg-white'
                      : comparison.change === 'degradation'
                      ? 'bg-gray-100 dark:bg-gray-900'
                      : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <div
                    className={`text-body ${
                      comparison.change === 'improvement'
                        ? 'text-white dark:text-black'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {comparison.current}
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            {comparison.note && (
              <div className="mt-3 flex items-start gap-2 text-body-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                <span>{comparison.note}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Assessment */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
        <h4 className="mb-3 text-body font-semibold text-black dark:text-white">
          Overall Assessment
        </h4>
        <p className="text-body-sm text-gray-600 dark:text-gray-400">
          {improvementCount > 0 && degradationCount === 0 &&
            'The new certificate represents a security improvement over the previous one. All changes maintain or enhance security posture.'}
          {improvementCount === 0 && degradationCount > 0 &&
            'The new certificate shows some degradation in security parameters. Review the changes and consider upgrading to maintain optimal security.'}
          {improvementCount > 0 && degradationCount > 0 &&
            'The new certificate shows mixed changes with both improvements and degradations. Evaluate the specific changes to understand the overall security impact.'}
          {improvementCount === 0 && degradationCount === 0 &&
            'The new certificate maintains the same security level as the previous one. This is a standard renewal with no significant changes to security parameters.'}
        </p>
      </div>
    </div>
  );
}

function getGradeChange(previousGrade: string, currentGrade: string): ChangeType {
  const gradeOrder = ['F', 'E', 'D', 'C', 'B', 'A', 'A+'];
  const prevIndex = gradeOrder.indexOf(previousGrade);
  const currIndex = gradeOrder.indexOf(currentGrade);
  
  if (currIndex > prevIndex) return 'improvement';
  if (currIndex < prevIndex) return 'degradation';
  return 'neutral';
}
