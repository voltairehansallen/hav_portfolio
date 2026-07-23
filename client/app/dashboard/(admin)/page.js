'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/api';

const COUNTERS = [
  { key: 'skills', label: 'skills' },
  { key: 'projects', label: 'projects' },
  { key: 'certifications', label: 'certifications' },
  { key: 'education', label: 'education' },
  { key: 'experience', label: 'experience' },
  { key: 'journey', label: 'journey' },
];

export default function OverviewPage() {
  const [counts, setCounts] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    async function load() {
      const results = await Promise.all(
        COUNTERS.map((c) => api.get(`/${c.key}`).then((r) => r.data.length).catch(() => 0))
      );
      const next = {};
      COUNTERS.forEach((c, i) => {
        next[c.key] = results[i];
      });
      setCounts(next);

      try {
        const { data } = await api.get('/messages');
        setUnreadMessages(data.filter((m) => !m.read).length);
      } catch {
        setUnreadMessages(0);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Overview</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {COUNTERS.map((c) => (
          <div key={c.key} className="rounded border border-panel-border bg-panel p-4">
            <p className="font-mono text-xs text-muted">{c.label}</p>
            <p className="mt-1 font-display text-3xl font-bold text-vision">
              {counts ? counts[c.key] : '—'}
            </p>
          </div>
        ))}

        <div className="rounded border border-panel-border bg-panel p-4">
          <p className="font-mono text-xs text-muted">messages non lus</p>
          <p className="mt-1 font-display text-3xl font-bold text-ambition">{unreadMessages}</p>
        </div>
      </div>
    </div>
  );
}
