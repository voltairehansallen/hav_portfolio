'use client';

import { usePathname } from 'next/navigation';
import { ArrowUp, TerminalSquare, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { socialIcon } from '../../lib/socialIcon';

export default function Footer() {
  const pathname = usePathname();
  const [socialLinks, setSocialLinks] = useState([]);
  const [cvUrl, setCvUrl] = useState(null);

  useEffect(() => {
    api
      .get('/social-links')
      .then(({ data }) => setSocialLinks(data))
      .catch(() => setSocialLinks([]));

    api
      .get('/about')
      .then(({ data }) => setCvUrl(data?.cvUrl || null))
      .catch(() => setCvUrl(null));
  }, []);

  if (pathname?.startsWith('/dashboard')) return null;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-panel-border">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 font-mono text-sm text-white">
              <TerminalSquare size={16} className="text-vision" />
              HAV_OS
            </div>
            <p className="mt-1 font-mono text-xs text-muted">
              Humility <span className="text-panel-border">•</span> Ambition{' '}
              <span className="text-panel-border">•</span> Vision
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 font-mono text-xs text-muted">
            <a href="#about" className="transition-colors hover:text-vision">about</a>
            <a href="#skills" className="transition-colors hover:text-vision">skills</a>
            <a href="#projects" className="transition-colors hover:text-vision">projects</a>
            <a href="#journey" className="transition-colors hover:text-vision">journey</a>
            <a href="#contact" className="transition-colors hover:text-vision">contact</a>
          </nav>

          {(socialLinks.length > 0 || cvUrl) && (
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon = socialIcon(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.platform}
                    className="rounded border border-panel-border p-2 text-muted transition-colors hover:border-vision hover:text-vision"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
              {cvUrl && (
                <a
                  href={cvUrl}
                  download
                  aria-label="CV"
                  className="rounded border border-panel-border p-2 text-muted transition-colors hover:border-ambition hover:text-ambition"
                >
                  <FileText size={15} />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-panel-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} HAV OS. Tous droits réservés.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 rounded border border-panel-border px-3 py-1.5 font-mono text-xs text-muted transition-all hover:border-vision hover:text-vision active:scale-95"
          >
            <ArrowUp size={13} /> haut de page
          </button>
        </div>
      </div>
    </footer>
  );
}
