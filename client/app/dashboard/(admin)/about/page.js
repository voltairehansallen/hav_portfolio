'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Field from '../../../../components/dashboard/ui/Field';
import Button from '../../../../components/dashboard/ui/Button';

const EMPTY = {
  name: '',
  headline: '',
  bio: '',
  humility: '',
  ambition: '',
  vision: '',
  mission: '',
  philosophy: '',
  quote: '',
  photoUrl: '',
  cvUrl: '',
};

export default function AboutDashboardPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get('/about')
      .then(({ data }) => {
        if (data) setForm({ ...EMPTY, ...data });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/about', form);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="font-mono text-sm text-muted">// chargement...</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">About</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <Field label="nom" name="name" value={form.name} onChange={handleChange} />
        <Field label="headline" name="headline" value={form.headline} onChange={handleChange} required />
        <Field label="bio" name="bio" as="textarea" rows={3} value={form.bio} onChange={handleChange} required />
        <Field label="humility" name="humility" as="textarea" rows={2} value={form.humility} onChange={handleChange} required />
        <Field label="ambition" name="ambition" as="textarea" rows={2} value={form.ambition} onChange={handleChange} required />
        <Field label="vision" name="vision" as="textarea" rows={2} value={form.vision} onChange={handleChange} required />
        <Field label="mission" name="mission" as="textarea" rows={2} value={form.mission} onChange={handleChange} />
        <Field label="philosophie" name="philosophy" as="textarea" rows={2} value={form.philosophy} onChange={handleChange} />
        <Field label="citation personnelle" name="quote" value={form.quote} onChange={handleChange} />
        <Field label="photoUrl (via uploads)" name="photoUrl" type="url" value={form.photoUrl} onChange={handleChange} />
        <Field label="cvUrl (via uploads)" name="cvUrl" type="url" value={form.cvUrl} onChange={handleChange} />

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'sauvegarde...' : 'sauvegarder'}
          </Button>
          {saved && <span className="font-mono text-sm text-online">// sauvegardé</span>}
        </div>
      </form>
    </div>
  );
}
