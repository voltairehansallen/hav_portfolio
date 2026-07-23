'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Field from '../../../../components/dashboard/ui/Field';
import Button from '../../../../components/dashboard/ui/Button';

const TYPES = ['IMAGE', 'PDF', 'LOGO'];

export default function UploadsDashboardPage() {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [type, setType] = useState('IMAGE');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const load = async () => {
    const { data } = await api.get('/uploads');
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      await api.post('/uploads', formData);
      setFile(null);
      e.target.reset();
      load();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Supprimer "${item.filename}" ?`)) return;
    await api.delete(`/uploads/${item.id}`);
    load();
  };

  const copyUrl = (item) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Uploads</h1>

      <form
        onSubmit={handleUpload}
        className="mb-8 flex max-w-2xl flex-wrap items-end gap-4 rounded border border-panel-border bg-panel p-4"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block font-mono text-xs text-muted" htmlFor="file">
            fichier (image ou PDF, max 10 Mo)
          </label>
          <input
            id="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full text-sm text-white file:mr-3 file:rounded file:border file:border-panel-border file:bg-bg file:px-3 file:py-2 file:text-white"
          />
        </div>

        <Field
          label="type"
          name="type"
          as="select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Field>

        <Button type="submit" disabled={uploading || !file}>
          {uploading ? 'envoi...' : 'uploader'}
        </Button>
      </form>

      {loading ? (
        <p className="font-mono text-sm text-muted">// chargement...</p>
      ) : media.length === 0 ? (
        <p className="font-mono text-sm text-muted">// aucun fichier uploadé</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="rounded border border-panel-border bg-panel p-3">
              {item.type === 'PDF' ? (
                <div className="flex h-24 items-center justify-center rounded bg-bg font-mono text-xs text-muted">
                  PDF
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.filename} className="h-24 w-full rounded object-cover" />
              )}
              <p className="mt-2 truncate font-mono text-xs text-muted" title={item.filename}>
                {item.filename}
              </p>
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" className="flex-1 text-xs" onClick={() => copyUrl(item)}>
                  {copiedId === item.id ? 'copié !' : 'copier url'}
                </Button>
                <Button variant="danger" className="text-xs" onClick={() => handleDelete(item)}>
                  suppr.
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
