'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Wrench, FolderKanban, Map, Mail, TerminalSquare } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

const NAV_ITEMS = [
  { key: 'about', icon: User },
  { key: 'skills', icon: Wrench },
  { key: 'projects', icon: FolderKanban },
  { key: 'journey', icon: Map },
  { key: 'contact', icon: Mail },
];

export default function StatusBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { lang, t, toggleLang } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.key)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-panel-border bg-bg/90 shadow-lg shadow-black/20 backdrop-blur-md'
          : 'border-transparent bg-bg/60 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 font-mono text-sm">
        <div className="flex items-center gap-2">
          <TerminalSquare size={18} className="text-vision" aria-hidden="true" />
          <span className="h-2 w-2 animate-blink rounded-full bg-online" aria-hidden="true" />
          <span className="text-white">HAV_OS</span>
          <span className="hidden text-muted sm:inline">v1.0</span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ key, icon: Icon }) => (
            <a
              key={key}
              href={`#${key}`}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 transition-colors ${
                activeSection === key
                  ? 'text-vision'
                  : 'text-muted hover:text-white'
              }`}
            >
              <Icon size={14} />
              {t.nav[key]}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleLang}
            className="ml-2 rounded border border-panel-border px-2 py-1 text-xs text-muted transition-colors hover:border-vision hover:text-vision"
            aria-label="Changer de langue"
          >
            {lang.toUpperCase()}
          </button>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded border border-panel-border px-2 py-1 text-xs text-muted"
            aria-label="Changer de langue"
          >
            {lang.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="p-1 text-white transition-transform active:scale-90"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="flex flex-col gap-1 border-t border-panel-border px-4 py-3 font-mono text-sm md:hidden"
        >
          {NAV_ITEMS.map(({ key, icon: Icon }) => (
            <a
              key={key}
              href={`#${key}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 py-2 transition-colors ${
                activeSection === key ? 'text-vision' : 'text-muted hover:text-white'
              }`}
            >
              <Icon size={14} />
              {t.nav[key]}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
