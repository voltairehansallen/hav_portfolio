'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import api from '../../lib/api';

const SESSION_KEY = 'hav-ai-session-id';

const SUGGESTIONS = [
  'Quels sont ses projets ?',
  'Quelles sont ses compétences ?',
  'Comment le contacter ?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  // Le widget public n'a pas sa place dans le dashboard admin
  if (pathname?.startsWith('/dashboard')) return null;

  const sendMessage = async (e, presetText) => {
    e?.preventDefault();
    const text = (presetText ?? input).trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setSending(true);

    try {
      const sessionId = localStorage.getItem(SESSION_KEY) || undefined;
      const { data } = await api.post('/hav-ai/chat', { sessionId, message: text });
      localStorage.setItem(SESSION_KEY, data.sessionId);
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: "// erreur : impossible de contacter HAV AI pour l'instant" },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="hav-ai-panel"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-vision bg-panel text-vision shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        <span className="sr-only">Ouvrir HAV AI</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="hav-ai-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[480px] w-[calc(100vw-2.5rem)] max-w-sm flex-col rounded-lg border border-panel-border bg-panel shadow-2xl sm:w-96"
          >
            <div className="flex items-center gap-2 border-b border-panel-border px-4 py-3 font-mono text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-online" />
              HAV_AI — assistant du portfolio
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="font-mono text-xs text-muted">
                    // salut, je suis HAV_AI 👋 pose-moi une question sur le parcours, les
                    compétences ou les projets
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={(e) => sendMessage(e, s)}
                        className="rounded-full border border-panel-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-vision hover:text-vision"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'ml-auto bg-vision text-bg'
                      : 'bg-bg text-white'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {sending && (
                <div className="max-w-[85%] rounded bg-bg px-3 py-2 font-mono text-xs text-muted">
                  ...
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2 border-t border-panel-border p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écris un message..."
                className="flex-1 rounded border border-panel-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-vision"
              />
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-1.5 rounded border border-vision px-3 py-2 font-mono text-xs text-vision transition-all hover:bg-vision hover:text-bg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
