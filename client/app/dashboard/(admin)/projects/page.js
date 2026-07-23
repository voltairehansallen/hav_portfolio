'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Field from '../../../../components/dashboard/ui/Field';
import Button from '../../../../components/dashboard/ui/Button';
import DataTable from '../../../../components/dashboard/DataTable';

const EMPTY = {
  title: '',
  slug: '',
  description: '',
  techStackText: '',
  repoUrl: '',
  demoUrl: '',
  featured: false,
  order: 0,
};

const COLUMNS = [
  { key: 'title', label: 'titre' },
  {
    key: 'techStack',
    label: 'stack',
    render: (row) => (Array.isArray(row.techStack) ? row.techStack.join(', ') : ''),
  },
  { key: 'featured', label: 'mis en avant', render: (row) => (row.featured ? 'oui' : 'non') },
];

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const buildPayload = () => ({
    title: form.title,
    slug: form.slug,
    description: form.description,
    techStack: form.techStackText.split(',').map((t) => t.trim()).filter(Boolean),
    repoUrl: form.repoUrl || null,
    demoUrl: form.demoUrl || null,
    featured: form.featured,
    order: Number(form.order),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildPayload();
    if (editingId) {
      await api.put(`/projects/${editingId}`, payload);
    } else {
      await api.post('/projects', payload);
    }
    setForm(EMPTY);
    setEditingId(null);
    load();
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      slug: row.slug,
      description: row.description,
      techStackText: Array.isArray(row.techStack) ? row.techStack.join(', ') : '',
      repoUrl: row.repoUrl || '',
      demoUrl: row.demoUrl || '',
      featured: row.featured,
      order: row.order,
    });
  };

  const handleDelete = async (row) => {
    if (!confirm(`Supprimer "${row.title}" ?`)) return;
    await api.delete(`/projects/${row.id}`);
    load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Projects</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid max-w-2xl gap-4 rounded border border-panel-border bg-panel p-4 sm:grid-cols-2"
      >
        <Field label="titre" name="title" value={form.title} onChange={handleChange} required />
        <Field label="slug" name="slug" value={form.slug} onChange={handleChange} required />
        <div className="sm:col-span-2">
          <Field label="description" name="description" as="textarea" rows={2} value={form.description} onChange={handleChange} required />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="stack technique (séparée par des virgules)"
            name="techStackText"
            value={form.techStackText}
            onChange={handleChange}
            placeholder="Node.js, MySQL, Prisma"
          />
        </div>
        <Field label="repo URL" name="repoUrl" type="url" value={form.repoUrl} onChange={handleChange} />
        <Field label="demo URL" name="demoUrl" type="url" value={form.demoUrl} onChange={handleChange} />
        <Field label="ordre" name="order" type="number" value={form.order} onChange={handleChange} />

        <label className="flex items-center gap-2 font-mono text-xs text-muted">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          mis en avant
        </label>

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
        <DataTable columns={COLUMNS} rows={projects} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
