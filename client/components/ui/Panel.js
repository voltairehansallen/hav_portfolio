'use client';

import { motion } from 'framer-motion';

export default function Panel({ id, label, title, icon, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mb-6 flex items-center gap-3 font-mono text-xs text-muted sm:text-sm">
          {icon && <span className="text-online">{icon}</span>}
          <span className="text-online">//</span>
          <span>{label}</span>
          <span className="h-px flex-1 bg-panel-border" />
        </div>

        {title && (
          <h2 className="mb-8 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        )}

        <div className="rounded-lg border border-panel-border bg-panel p-5 shadow-lg shadow-black/0 transition-shadow duration-300 hover:shadow-black/30 sm:p-8">
          {children}
        </div>
      </motion.div>
    </section>
  );
}
