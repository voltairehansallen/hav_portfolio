'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      await api.post('/messages', form);
      setStatus('sent');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Échec de l\'envoi, réessaie plus tard');
    }
  };

  if (status === 'sent') {
    return (
      <p className="flex items-center gap-2 font-mono text-sm text-online">
        <CheckCircle2 size={16} /> message envoyé — je réponds généralement sous 48h
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="nom" name="name" value={form.name} onChange={handleChange} required />
      <Field
        label="email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <div className="sm:col-span-2">
        <Field label="sujet" name="subject" value={form.subject} onChange={handleChange} />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block font-mono text-xs text-muted" htmlFor="message">
          message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={form.message}
          onChange={handleChange}
          className="w-full rounded border border-panel-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-vision"
        />
      </div>

      {status === 'error' && (
        <p className="sm:col-span-2 font-mono text-sm text-ambition">// {errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="sm:col-span-2 mt-2 flex w-fit items-center gap-2 rounded border border-vision px-5 py-3 font-mono text-sm text-vision transition-all hover:bg-vision hover:text-bg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={16} className="animate-spin" /> envoi_en_cours...
          </>
        ) : (
          <>
            <Send size={16} /> envoyer
          </>
        )}
      </button>
    </form>
  );
}

function Field({ label, name, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded border border-panel-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-vision"
      />
    </div>
  );
}
