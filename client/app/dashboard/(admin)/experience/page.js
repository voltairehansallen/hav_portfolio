'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Field from '../../../../components/dashboard/ui/Field';
import Button from '../../../../components/dashboard/ui/Button';
import DataTable from '../../../../components/dashboard/DataTable';
import { toDateInputValue, toISODateTime } from '../../../../lib/formatDate';

const EMPTY = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  order: 0,
};

const COLUMNS = [
  { key: 'title', label: 'poste' },
  { key: 'company', label: 'entreprise' },
  { key: 'startDate', label: 'début', render: (row) => toDateInputValue(row.startDate) },
];

export default function ExperienceDashboardPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/experience');
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

  const buildPayload = () => ({
    title: form.title,
    company: form.company,
    location: form.location || null,
    startDate: toISODateTime(form.startDate),
    endDate: toISODateTime(form.endDate),
    description: form.description || null,
    order: Number(form.order),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildPayload();
    if (editingId) {
      await api.put(`/experience/${editingId}`, payload);
    } else {
      await api.post('/experience', payload);
    }
    setForm(EMPTY);
    setEditingId(null);
    load();
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      company: row.company,
      location: row.location || '',
      startDate: toDateInputValue(row.startDate),
      endDate: toDateInputValue(row.endDate),
      description: row.description || '',
      order: row.order,
    });
  };

  const handleDelete = async (row) => {
    if (!confirm(`Supprimer "${row.title}" ?`)) return;
    await api.delete(`/experience/${row.id}`);
    load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Experience</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid max-w-2xl gap-4 rounded border border-panel-border bg-panel p-4 sm:grid-cols-2"
      >
        <Field label="poste" name="title" value={form.title} onChange={handleChange} required />
        <Field label="entreprise" name="company" value={form.company} onChange={handleChange} required />
        <Field label="lieu" name="location" value={form.location} onChange={handleChange} />
        <Field label="ordre" name="order" type="number" value={form.order} onChange={handleChange} />
        <Field label="début" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
        <Field label="fin (vide = en cours)" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
        <div className="sm:col-span-2">
          <Field label="description" name="description" as="textarea" rows={2} value={form.description} onChange={handleChange} />
        </div>

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
