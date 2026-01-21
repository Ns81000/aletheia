'use client';

import Link from 'next/link';
import Container from './Container';
import ThemeToggle from '@/components/ui/ThemeToggle';


export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-light-border bg-light-bg/80 backdrop-blur-sm dark:border-dark-border dark:bg-dark-bg/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold transition-opacity hover:opacity-80"
          >
            <span className="text-black dark:text-white">
              Aletheia
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <ThemeToggle />
          </nav>
        </div>
      </Container>
    </header>
  );
}
