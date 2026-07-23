'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Field from '../../../../components/dashboard/ui/Field';
import Button from '../../../../components/dashboard/ui/Button';
import DataTable from '../../../../components/dashboard/DataTable';

const EMPTY = { name: '', category: '', level: 50, order: 0 };

const COLUMNS = [
  { key: 'name', label: 'nom' },
  { key: 'category', label: 'catégorie' },
  { key: 'level', label: 'niveau', render: (row) => `${row.level}%` },
];

export default function SkillsDashboardPage() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/skills');
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'level' || name === 'order' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/skills/${editingId}`, form);
    } else {
      await api.post('/skills', form);
    }
    setForm(EMPTY);
    setEditingId(null);
    load();
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({ name: row.name, category: row.category, level: row.level, order: row.order });
  };

  const handleDelete = async (row) => {
    if (!confirm(`Supprimer "${row.name}" ?`)) return;
    await api.delete(`/skills/${row.id}`);
    load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Skills</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid max-w-2xl gap-4 rounded border border-panel-border bg-panel p-4 sm:grid-cols-2"
      >
        <Field label="nom" name="name" value={form.name} onChange={handleChange} required />
        <Field label="catégorie" name="category" value={form.category} onChange={handleChange} required />
        <Field label="niveau (0-100)" name="level" type="number" min="0" max="100" value={form.level} onChange={handleChange} />
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
        <DataTable columns={COLUMNS} rows={skills} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
