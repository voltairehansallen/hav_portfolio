'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Button from '../../../../components/dashboard/ui/Button';

export default function MessagesDashboardPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/messages');
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markAsRead = async (msg) => {
    await api.put(`/messages/${msg.id}`, { read: true });
    load();
  };

  const handleDelete = async (msg) => {
    if (!confirm(`Supprimer le message de "${msg.name}" ?`)) return;
    await api.delete(`/messages/${msg.id}`);
    load();
  };

  if (loading) return <p className="font-mono text-sm text-muted">// chargement...</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Messages</h1>

      {messages.length === 0 ? (
        <p className="font-mono text-sm text-muted">// aucun message reçu</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded border p-4 ${
                msg.read ? 'border-panel-border bg-panel' : 'border-vision bg-panel'
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-body font-semibold text-white">
                  {msg.name} <span className="font-mono text-xs text-muted">({msg.email})</span>
                </p>
                <p className="font-mono text-xs text-muted">
                  {new Date(msg.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              {msg.subject && <p className="mt-1 text-sm text-vision">{msg.subject}</p>}
              <p className="mt-2 text-sm text-muted">{msg.message}</p>

              <div className="mt-3 flex gap-2">
                {!msg.read && (
                  <Button variant="ghost" onClick={() => markAsRead(msg)}>
                    marquer comme lu
                  </Button>
                )}
                <Button variant="danger" onClick={() => handleDelete(msg)}>
                  supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
