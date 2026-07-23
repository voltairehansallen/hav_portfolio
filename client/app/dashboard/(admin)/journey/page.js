'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Field from '../../../../components/dashboard/ui/Field';
import Button from '../../../../components/dashboard/ui/Button';
import DataTable from '../../../../components/dashboard/DataTable';
import { toDateInputValue, toISODateTime } from '../../../../lib/formatDate';

const EMPTY = { date: '', title: '', description: '', icon: '', order: 0 };

const COLUMNS = [
  { key: 'title', label: 'titre' },
  { key: 'date', label: 'date', render: (row) => toDateInputValue(row.date) },
];

export default function JourneyDashboardPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/journey');
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
    const payload = { ...form, date: toISODateTime(form.date), icon: form.icon || null, order: Number(form.order) };
    if (editingId) {
      await api.put(`/journey/${editingId}`, payload);
    } else {
      await api.post('/journey', payload);
    }
    setForm(EMPTY);
    setEditingId(null);
    load();
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      date: toDateInputValue(row.date),
      title: row.title,
      description: row.description,
      icon: row.icon || '',
      order: row.order,
    });
  };

  const handleDelete = async (row) => {
    if (!confirm(`Supprimer "${row.title}" ?`)) return;
    await api.delete(`/journey/${row.id}`);
    load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Journey</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid max-w-2xl gap-4 rounded border border-panel-border bg-panel p-4 sm:grid-cols-2"
      >
        <Field label="date" name="date" type="date" value={form.date} onChange={handleChange} required />
        <Field label="ordre" name="order" type="number" value={form.order} onChange={handleChange} />
        <Field label="titre" name="title" value={form.title} onChange={handleChange} required />
        <Field label="icône (optionnel)" name="icon" value={form.icon} onChange={handleChange} />
        <div className="sm:col-span-2">
          <Field label="description" name="description" as="textarea" rows={2} value={form.description} onChange={handleChange} required />
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
