import { CTLogData } from '@/types/certificate';
import { format } from 'date-fns';
import { History, TrendingUp } from 'lucide-react';

interface CertificateHistoryProps {
  ctData: CTLogData;
}

export default function CertificateHistory({ ctData }: CertificateHistoryProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <History className="h-6 w-6 text-black dark:text-white" />
        Certificate History
      </h2>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Certificates Found', value: ctData.totalCertificates },
          { label: 'Subdomains', value: ctData.subdomains.length },
          { label: 'Avg. Validity', value: `${ctData.stats.averageValidityDays} days` },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-dark-border dark:bg-dark-glass">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-dark-text-secondary">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Renewal Pattern */}
      {ctData.renewalPattern.detected && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3 text-green-700 dark:text-gray-100">
            <TrendingUp className="h-5 w-5" />
            <div>
              <div className="font-bold">Automated Renewal Detected</div>
              <div className="text-sm opacity-80 text-green-800 dark:text-green-100/80">
                Certificates are renewed approximately every {ctData.renewalPattern.intervalDays} days
                {ctData.renewalPattern.isAutomated && ' (automated process)'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-glass">
        <h3 className="mb-6 font-semibold text-gray-900 dark:text-white">Recent Certificates</h3>
        <div className="relative space-y-8">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-dark-border" />

          {ctData.certificates.slice(0, 5).map((cert) => {
            const isExpired = new Date(cert.notAfter) < new Date();
            const isCurrent = cert.isCurrent;

            return (
              <div key={cert.id} className="relative pl-12">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1 h-10 w-10 rounded-full border-4 border-white bg-white shadow-sm transition-transform hover:scale-110 dark:border-dark-bg dark:bg-dark-bg flex items-center justify-center ${isCurrent
                    ? 'border-green-500 text-green-600 dark:border-white dark:text-white'
                    : isExpired
                      ? 'text-gray-400 dark:text-dark-text-secondary'
                      : 'text-blue-500 dark:text-gray-300'
                    }`}
                >
                  <div className={`h-3 w-3 rounded-full ${isCurrent ? 'bg-green-500 dark:bg-white' : isExpired ? 'bg-gray-300' : 'bg-blue-500 dark:bg-gray-300'
                    }`} />
                </div>

                <div className="group relative rounded-lg border border-transparent bg-gray-50 p-4 transition-all hover:border-gray-200 hover:bg-white hover:shadow-md dark:bg-dark-bg/50 dark:hover:border-dark-border dark:hover:bg-dark-bg">
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-gray-300 transition-colors">
                        {cert.commonName}
                      </div>
                      <div className="font-mono text-xs text-gray-500 dark:text-dark-text-secondary">
                        {formatDate(cert.notBefore)} - {formatDate(cert.notAfter)}
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-gray-800 dark:text-gray-100">
                        CURRENT
                      </span>
                    )}
                    {isExpired && !isCurrent && (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-500 dark:bg-gray-800">
                        EXPIRED
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-dark-text-secondary">
                    <div>Issued by: {cert.issuer.commonName}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
