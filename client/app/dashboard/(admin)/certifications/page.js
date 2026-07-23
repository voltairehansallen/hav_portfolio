'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Field from '../../../../components/dashboard/ui/Field';
import Button from '../../../../components/dashboard/ui/Button';
import DataTable from '../../../../components/dashboard/DataTable';
import { toDateInputValue, toISODateTime } from '../../../../lib/formatDate';

const EMPTY = { title: '', issuer: '', issueDate: '', credentialUrl: '', fileUrl: '', order: 0 };

const COLUMNS = [
  { key: 'title', label: 'titre' },
  { key: 'issuer', label: 'organisme' },
  { key: 'issueDate', label: 'date', render: (row) => toDateInputValue(row.issueDate) },
];

export default function CertificationsDashboardPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/certifications');
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
    const payload = { ...form, issueDate: toISODateTime(form.issueDate), order: Number(form.order) };
    if (editingId) {
      await api.put(`/certifications/${editingId}`, payload);
    } else {
      await api.post('/certifications', payload);
    }
    setForm(EMPTY);
    setEditingId(null);
    load();
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      issuer: row.issuer,
      issueDate: toDateInputValue(row.issueDate),
      credentialUrl: row.credentialUrl || '',
      fileUrl: row.fileUrl || '',
      order: row.order,
    });
  };

  const handleDelete = async (row) => {
    if (!confirm(`Supprimer "${row.title}" ?`)) return;
    await api.delete(`/certifications/${row.id}`);
    load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Certifications</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid max-w-2xl gap-4 rounded border border-panel-border bg-panel p-4 sm:grid-cols-2"
      >
        <Field label="titre" name="title" value={form.title} onChange={handleChange} required />
        <Field label="organisme" name="issuer" value={form.issuer} onChange={handleChange} required />
        <Field label="date d'obtention" name="issueDate" type="date" value={form.issueDate} onChange={handleChange} required />
        <Field label="ordre" name="order" type="number" value={form.order} onChange={handleChange} />
        <Field label="URL du diplôme (LinkedIn, etc.)" name="credentialUrl" type="url" value={form.credentialUrl} onChange={handleChange} />
        <Field label="fileUrl (via uploads)" name="fileUrl" type="url" value={form.fileUrl} onChange={handleChange} />

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
