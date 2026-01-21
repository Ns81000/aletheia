import { CertificateData } from '@/types/certificate';
import { format } from 'date-fns';
import { Calendar, Shield, Key, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface CurrentCertificateProps {
  certificate: CertificateData;
}

export default function CurrentCertificate({ certificate }: CurrentCertificateProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getExpirationStatus = () => {
    if (certificate.daysRemaining < 0) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        text: 'Expired',
        color: 'text-red-500',
      };
    } else if (certificate.daysRemaining < 30) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        text: `Expires in ${certificate.daysRemaining} days`,
        color: 'text-yellow-500',
      };
    } else {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        text: `Valid for ${certificate.daysRemaining} more days`,
        color: 'text-green-500',
      };
    }
  };

  const status = getExpirationStatus();

  return (
    <div className="rounded-lg border border-light-border p-6 dark:border-dark-border">
      <h2 className="mb-6 text-lg font-semibold">Current Certificate Details</h2>

      {/* Status Banner */}
      <div className={`mb-6 flex items-center gap-3 rounded-lg border p-4 ${status.color} border-current/20 bg-current/5`}>
        {status.icon}
        <div>
          <div className="font-semibold">{certificate.valid ? 'Valid Certificate' : 'Invalid Certificate'}</div>
          <div className="text-sm">{status.text}</div>
        </div>
      </div>

      {/* Certificate Information Grid */}
      <div className="space-y-4">
        {/* Issued By */}
        <div className="flex items-start gap-3">
          <Shield className="mt-1 h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary">
              Issued By
            </div>
            <div className="font-medium">{certificate.issuer.commonName}</div>
            {certificate.issuer.organization && (
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {certificate.issuer.organization}
              </div>
            )}
          </div>
        </div>

        {/* Valid For */}
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary">
              Valid For
            </div>
            <div className="font-medium">{certificate.subject.commonName}</div>
            {certificate.subjectAltNames.length > 1 && (
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                + {certificate.subjectAltNames.length - 1} more domains
              </div>
            )}
          </div>
        </div>

        {/* Validity Period */}
        <div className="flex items-start gap-3">
          <Calendar className="mt-1 h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary">
              Validity Period
            </div>
            <div className="font-medium">
              {formatDate(certificate.validFrom)} - {formatDate(certificate.validTo)}
            </div>
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {Math.ceil((new Date(certificate.validTo).getTime() - new Date(certificate.validFrom).getTime()) / (1000 * 60 * 60 * 24))} days total
            </div>
          </div>
        </div>

        {/* Public Key */}
        <div className="flex items-start gap-3">
          <Key className="mt-1 h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary">
              Public Key
            </div>
            <div className="font-medium">
              {certificate.publicKey.algorithm} {certificate.publicKey.bits} bits
            </div>
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {certificate.publicKey.bits >= 2048 ? '✓ Strong encryption' : '⚠ Weak encryption'}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-6 border-t border-light-border pt-6 dark:border-dark-border">
        <h3 className="mb-3 text-sm font-semibold">Additional Information</h3>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">TLS Version</span>
            <span className="font-medium">{certificate.tlsVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">Cipher Suite</span>
            <span className="font-medium">{certificate.cipherSuite}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">Serial Number</span>
            <span className="font-mono text-xs">{certificate.serialNumber}</span>
          </div>
          {certificate.isWildcard && (
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Type</span>
              <span className="font-medium">Wildcard Certificate</span>
            </div>
          )}
          {certificate.isSelfSigned && (
            <div className="rounded bg-yellow-50 p-2 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
              ⚠ Self-Signed Certificate
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
