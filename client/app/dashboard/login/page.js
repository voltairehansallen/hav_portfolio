'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/login', form);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Échec de la connexion');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-panel-border bg-panel p-6"
      >
        <p className="mb-1 font-mono text-xs text-online">// HAV_OS admin</p>
        <h1 className="mb-6 font-display text-2xl font-bold text-white">Connexion</h1>

        <div className="mb-4">
          <label className="mb-1 block font-mono text-xs text-muted" htmlFor="email">
            email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded border border-panel-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-vision"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block font-mono text-xs text-muted" htmlFor="password">
            mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded border border-panel-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-vision"
          />
        </div>

        {error && <p className="mb-4 font-mono text-sm text-ambition">// {error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded border border-vision py-3 font-mono text-sm text-vision transition-colors hover:bg-vision hover:text-bg disabled:opacity-50"
        >
          {loading ? 'connexion...' : 'se_connecter'}
        </button>
      </form>
    </div>
  );
}
