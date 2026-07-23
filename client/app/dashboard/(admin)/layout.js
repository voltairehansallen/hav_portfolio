'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/dashboard/Sidebar';
import api from '../../../lib/api';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api
      .get('/auth/me')
      .then(() => setChecking(false))
      .catch(() => router.replace('/dashboard/login'));
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="font-mono text-sm text-muted">// vérification de la session...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-bg text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
