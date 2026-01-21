'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, AlertCircle } from 'lucide-react';

export default function SearchBox() {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateDomain = (input: string): boolean => {
    // Remove protocol if present
    let cleanDomain = input.replace(/^https?:\/\//, '');
    // Remove path if present
    cleanDomain = cleanDomain.split('/')[0];
    // Remove port if present
    cleanDomain = cleanDomain.split(':')[0];
    // Remove trailing dot
    cleanDomain = cleanDomain.replace(/\.$/, '');

    // Basic domain validation regex
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    return domainRegex.test(cleanDomain);
  };

  const parseDomain = (input: string): string => {
    let cleanDomain = input.replace(/^https?:\/\//, '');
    cleanDomain = cleanDomain.split('/')[0];
    cleanDomain = cleanDomain.split(':')[0];
    cleanDomain = cleanDomain.replace(/\.$/, '');
    return cleanDomain.toLowerCase();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!domain.trim()) {
      setError('Please enter a domain name');
      return;
    }

    if (!validateDomain(domain)) {
      setError('Please enter a valid domain name (e.g., example.com)');
      return;
    }

    const cleanDomain = parseDomain(domain);
    setIsLoading(true);

    // Navigate to analysis page
    router.push(`/analyze/${cleanDomain}`);
  };

  const handleInputChange = (value: string) => {
    setDomain(value);
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={domain}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter domain or URL... (e.g., example.com)"
          className={`w-full rounded-lg border px-4 py-4 pr-12 text-lg placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 ${error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-200 focus:ring-black dark:border-gray-800 dark:focus:ring-white'
            } bg-white text-black dark:bg-gray-950 dark:text-white`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-black p-2 text-white transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          aria-label="Search"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
        Accepts: example.com, https://example.com, www.example.com
      </p>
    </form>
  );
}
