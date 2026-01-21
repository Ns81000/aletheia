import Container from './Container';
import { Github, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-light-border bg-light-bg dark:border-dark-border dark:bg-dark-bg">
      <Container>
        <div className="py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Left side */}
            <div className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary md:text-left">
              <p className="mb-1">
                © {currentYear} Aletheia. SSL/TLS Certificate Intelligence.
              </p>
              <p className="flex items-center justify-center gap-1 md:justify-start">
                Made with <Heart className="h-4 w-4 fill-current" /> for a
                safer web • <a href="https://github.com/Ns81000/aletheia" target="_blank" rel="noopener noreferrer" className="hover:text-light-text dark:hover:text-dark-text transition-colors">GitHub</a>
              </p>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/Ns81000/aletheia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-text-secondary transition-colors hover:text-light-text dark:text-dark-text-secondary dark:hover:text-dark-text"
                aria-label="GitHub Repository"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 border-t border-light-border pt-6 text-center text-xs text-light-text-secondary dark:border-dark-border dark:text-dark-text-secondary">
            <p>
              The information provided is for informational purposes only.
              While we strive for accuracy, certificate data can change. Always
              verify critical information independently.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
