import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aletheia - SSL/TLS Certificate Intelligence',
  description: 'Understand your website\'s security, beautifully.',
  keywords: ['ssl', 'tls', 'certificate', 'security', 'https', 'encryption'],
  authors: [{ name: 'Aletheia' }],
  openGraph: {
    title: 'Aletheia - SSL/TLS Certificate Intelligence',
    description: 'Understand your website\'s security, beautifully.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-white dark:bg-[#0A0A0A] text-black dark:text-white transition-colors">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
