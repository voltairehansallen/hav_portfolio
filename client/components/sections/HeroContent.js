'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { FolderOpen, Download, Mail } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

const BOOT_LINES = [
  'HAV_OS v1.0 — initializing personal runtime...',
  'loading modules: humility.core ✓ ambition.core ✓ vision.core ✓',
  'status: ready',
];

const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Vitesse de frappe, en ms par caractère
const TYPE_SPEED = 14;
const LINE_PAUSE = 200;

function useTypedLines(lines) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVisibleCount(lines.length);
      setDone(true);
      return;
    }

    if (visibleCount >= lines.length) {
      setDone(true);
      return;
    }
    const line = lines[visibleCount];
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setCurrentText(line.slice(0, i));
      if (i >= line.length) {
        clearInterval(interval);
        setTimeout(() => {
          setVisibleCount((c) => c + 1);
          setCurrentText('');
        }, LINE_PAUSE);
      }
    }, TYPE_SPEED);
    return () => clearInterval(interval);
  }, [visibleCount, lines]);

  return { visibleCount, currentText, done };
}

function BootLog({ onDone }) {
  const { visibleCount, currentText, done } = useTypedLines(BOOT_LINES);

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  return (
    <div className="mb-8 space-y-1 font-mono text-xs text-muted sm:text-sm" aria-hidden="true">
      {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
        <p key={i}>
          <span className="text-online">&gt;</span> {line}
        </p>
      ))}
      {visibleCount < BOOT_LINES.length && (
        <p>
          <span className="text-online">&gt;</span> {currentText}
          <span className="animate-blink text-vision">▌</span>
        </p>
      )}
    </div>
  );
}

function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1200, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on('change', (v) => setDisplay(Math.round(v)));
  }, [spring]);

  return <span ref={ref}>{display}</span>;
}

function StatsBar({ stats }) {
  const items = [
    { value: stats.projects, label: 'projets' },
    { value: stats.skills, label: 'compétences' },
    { value: stats.certifications, label: 'certifications' },
  ];

  return (
    <div className="mt-10 grid grid-cols-3 divide-x divide-panel-border border-t border-panel-border pt-6">
      {items.map((item) => (
        <div key={item.label} className="px-2 text-center first:pl-0 sm:text-left sm:first:pl-0">
          <p className="font-display text-2xl font-bold text-vision sm:text-3xl">
            <AnimatedCounter value={item.value} />+
          </p>
          <p className="font-mono text-xs text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-vision/20 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-ambition/10 blur-[100px]" />
    </div>
  );
}

export default function HeroContent({ about, stats }) {
  const { t } = useLanguage();
  const [bootDone, setBootDone] = useState(false);
  const hasProfile = Boolean(about?.name);

  // Fallback : tant que le nom n'est pas renseigné dans le dashboard,
  // on garde le hero générique centré plutôt que d'inventer un contenu.
  if (!hasProfile) {
    return (
      <section className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center overflow-hidden px-4 py-16">
        <AmbientGlow />
        <BootLog onDone={() => setBootDone(true)} />
        <motion.div initial="hidden" animate={bootDone ? 'show' : 'hidden'} variants={reveal}>
          <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl">
            Humility. Ambition.
            <br />
            <span className="text-vision">Vision.</span>
          </h1>
          <p className="mt-6 max-w-xl font-body text-base text-muted sm:text-lg">
            Aspirant data analyst — je transforme des données brutes en décisions claires,
            et je construis les outils qui les portent.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 font-mono text-sm">
            <a href="#projects" className="flex items-center gap-2 rounded border border-vision px-5 py-3 text-vision transition-all hover:bg-vision hover:text-bg active:scale-95">
              <FolderOpen size={16} /> {t.hero.viewProjects}
            </a>
            <a href="#contact" className="flex items-center gap-2 rounded border border-panel-border px-5 py-3 text-white transition-all hover:border-ambition hover:text-ambition active:scale-95">
              {t.hero.contact}
            </a>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto grid min-h-[90vh] max-w-6xl items-center gap-12 overflow-hidden px-4 py-16 md:grid-cols-2">
      <AmbientGlow />
      <div>
        <BootLog onDone={() => setBootDone(true)} />
        <motion.div initial="hidden" animate={bootDone ? 'show' : 'hidden'} variants={reveal}>
          <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl">
            {about.name}
          </h1>
          <p className="mt-3 font-mono text-sm text-vision sm:text-base">{about.headline}</p>
          <p className="mt-6 max-w-xl font-body text-base text-muted sm:text-lg">{about.bio}</p>

          <div className="mt-8 flex flex-wrap gap-4 font-mono text-sm">
            <a href="#contact" className="flex items-center gap-2 rounded bg-vision px-5 py-3 font-medium text-bg transition-all hover:opacity-90 active:scale-95">
              <Mail size={16} /> {t.hero.contact}
            </a>
            <a href="#projects" className="flex items-center gap-2 rounded border border-panel-border px-5 py-3 text-white transition-all hover:border-vision hover:text-vision active:scale-95">
              <FolderOpen size={16} /> {t.hero.viewProjects}
            </a>
          </div>

          {about.cvUrl && (
            <a
              href={about.cvUrl}
              download
              className="mt-4 flex w-fit items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-ambition"
            >
              <Download size={14} /> {t.hero.downloadCv}
            </a>
          )}

          {stats && (stats.projects > 0 || stats.skills > 0 || stats.certifications > 0) && (
            <StatsBar stats={stats} />
          )}
        </motion.div>
      </div>

      {about.photoUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: bootDone ? 1 : 0, scale: bootDone ? 1 : 0.96 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-sm"
        >
          {/* Cadre à coins façon interface système */}
          <div className="pointer-events-none absolute -inset-3 z-10">
            <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-vision" />
            <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-vision" />
            <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-vision" />
            <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-vision" />
          </div>

          {/* Next/Image en mode "fill" — le parent contrôle déjà la taille via aspect-ratio */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-panel-border">
            <Image
              src={about.photoUrl}
              alt={about.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              priority
            />
          </div>

          <span className="absolute -right-2 top-8 z-20 rounded-full border border-vision bg-panel px-3 py-1.5 font-mono text-xs text-vision shadow-lg sm:-right-4">
            ● Data Analyst
          </span>
          <span className="absolute -left-2 bottom-8 z-20 rounded-full border border-ambition bg-panel px-3 py-1.5 font-mono text-xs text-ambition shadow-lg sm:-left-4">
            ▲ Full-Stack Dev
          </span>
        </motion.div>
      )}
    </section>
  );
}
