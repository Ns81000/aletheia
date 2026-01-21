import SearchBox from '@/components/search/SearchBox';
import Container from '@/components/layout/Container';
import { Shield, Clock, Database } from 'lucide-react';

export default function HomePage() {
  return (
    <Container>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="mb-12 sm:mb-16 text-center">
            <h1 className="mb-4 text-4xl sm:text-5xl md:text-display-1 font-bold tracking-tight text-black dark:text-white">
              Aletheia
            </h1>
            <p className="mb-2 text-lg sm:text-xl md:text-heading-1 text-gray-600 dark:text-gray-400">
              Security Intelligence Platform
            </p>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-body text-gray-500 dark:text-gray-500 px-4">
              Understanding your certificate's security posture through transparency and direct analysis.
            </p>
          </div>

          {/* Search Component */}
          <div className="relative z-10 mb-16 sm:mb-20">
            <SearchBox />
          </div>

          {/* Quick Examples */}
          <div className="mb-20 sm:mb-24 text-center">
            <p className="mb-4 text-label uppercase tracking-wider text-gray-500 dark:text-gray-500">
              Try a domain
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
              {['github.com', 'google.com', 'vercel.com', 'openai.com'].map((domain) => (
                <a
                  key={domain}
                  href={`/analyze/${domain}`}
                  className="rounded-lg border border-gray-200 bg-white px-4 sm:px-6 py-2 sm:py-2.5 font-mono text-xs sm:text-technical transition-all hover:border-black hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-white"
                >
                  {domain}
                </a>
              ))}
            </div>
          </div>

          {/* Three-Column Feature Grid */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <div className="group space-y-4 rounded-xl border border-gray-200 bg-white p-6 sm:p-8 transition-all hover:border-gray-400 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800">
                <Shield className="h-6 w-6 text-black dark:text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg sm:text-heading-2 font-semibold text-black dark:text-white">
                Direct Connection
              </h3>
              <p className="text-sm sm:text-body-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Real-time analysis of your server's current security configuration and certificate status through direct TLS connection.
              </p>
            </div>

            <div className="group space-y-4 rounded-xl border border-gray-200 bg-white p-6 sm:p-8 transition-all hover:border-gray-400 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800">
                <Clock className="h-6 w-6 text-black dark:text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg sm:text-heading-2 font-semibold text-black dark:text-white">
                Historical Analysis
              </h3>
              <p className="text-sm sm:text-body-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Explore certificate history and detect renewal patterns through Certificate Transparency logs. Track security evolution over time.
              </p>
            </div>

            <div className="group space-y-4 rounded-xl border border-gray-200 bg-white p-6 sm:p-8 transition-all hover:border-gray-400 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800">
                <Database className="h-6 w-6 text-black dark:text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg sm:text-heading-2 font-semibold text-black dark:text-white">
                Transparency Logs
              </h3>
              <p className="text-sm sm:text-body-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Discover subdomains and analyze certificate issuance patterns through public transparency logs for comprehensive security insights.
              </p>
            </div>
          </div>

          {/* Educational Section */}
          <div className="mt-20 sm:mt-24 space-y-8 border-t border-gray-200 pt-12 sm:pt-16 dark:border-gray-800">
            <div className="text-center px-4">
              <h2 className="mb-4 text-xl sm:text-2xl md:text-heading-1 font-semibold text-black dark:text-white">
                Why Certificate Security Matters
              </h2>
              <p className="mx-auto max-w-3xl text-sm sm:text-base md:text-body text-gray-600 dark:text-gray-400">
                SSL/TLS certificates are the foundation of secure web communication. They encrypt data in transit, verify server identity, and protect against impersonation attacks.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
                <h4 className="text-sm sm:text-base font-semibold text-black dark:text-white">Encryption</h4>
                <p className="text-xs sm:text-body-sm text-gray-600 dark:text-gray-400">
                  Certificates enable end-to-end encryption, ensuring that sensitive data like passwords, credit cards, and personal information cannot be intercepted by attackers.
                </p>
              </div>

              <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
                <h4 className="text-sm sm:text-base font-semibold text-black dark:text-white">Authentication</h4>
                <p className="text-xs sm:text-body-sm text-gray-600 dark:text-gray-400">
                  They verify server identity through a chain of trust, protecting against man-in-the-middle attacks and ensuring you're connecting to the legitimate server.
                </p>
              </div>

              <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
                <h4 className="text-sm sm:text-base font-semibold text-black dark:text-white">Trust Indicators</h4>
                <p className="text-xs sm:text-body-sm text-gray-600 dark:text-gray-400">
                  Modern browsers display security indicators (padlock icon) based on certificate validity, helping users identify secure connections at a glance.
                </p>
              </div>

              <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
                <h4 className="text-sm sm:text-base font-semibold text-black dark:text-white">Compliance</h4>
                <p className="text-xs sm:text-body-sm text-gray-600 dark:text-gray-400">
                  Many regulations (PCI DSS, HIPAA, GDPR) require proper certificate implementation and strong encryption standards for data protection compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
