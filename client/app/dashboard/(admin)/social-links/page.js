'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Field from '../../../../components/dashboard/ui/Field';
import Button from '../../../../components/dashboard/ui/Button';
import DataTable from '../../../../components/dashboard/DataTable';

const EMPTY = { platform: '', url: '', icon: '', order: 0 };

const COLUMNS = [
  { key: 'platform', label: 'plateforme' },
  { key: 'url', label: 'URL' },
];

export default function SocialLinksDashboardPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/social-links');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'order' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, icon: form.icon || null, order: Number(form.order) };
    if (editingId) {
      await api.put(`/social-links/${editingId}`, payload);
    } else {
      await api.post('/social-links', payload);
    }
    setForm(EMPTY);
    setEditingId(null);
    load();
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({ platform: row.platform, url: row.url, icon: row.icon || '', order: row.order });
  };

  const handleDelete = async (row) => {
    if (!confirm(`Supprimer "${row.platform}" ?`)) return;
    await api.delete(`/social-links/${row.id}`);
    load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Social Links</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid max-w-2xl gap-4 rounded border border-panel-border bg-panel p-4 sm:grid-cols-2"
      >
        <Field label="plateforme" name="platform" value={form.platform} onChange={handleChange} required placeholder="GitHub" />
        <Field label="URL" name="url" type="url" value={form.url} onChange={handleChange} required />
        <Field label="icône (optionnel)" name="icon" value={form.icon} onChange={handleChange} />
        <Field label="ordre" name="order" type="number" value={form.order} onChange={handleChange} />

        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit">{editingId ? 'mettre_a_jour' : 'ajouter'}</Button>
          {editingId && (
            <Button type="button" variant="ghost" onClick={cancelEdit}>
              annuler
            </Button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="font-mono text-sm text-muted">// chargement...</p>
      ) : (
        <DataTable columns={COLUMNS} rows={items} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
