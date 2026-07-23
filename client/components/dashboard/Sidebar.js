'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, User, Wrench, FolderKanban, Award, GraduationCap,
  Briefcase, Map, Share2, Upload, Mail, LogOut, TerminalSquare,
} from 'lucide-react';
import api from '../../lib/api';

const LINKS = [
  { href: '/dashboard', label: 'overview', icon: LayoutDashboard },
  { href: '/dashboard/about', label: 'about', icon: User },
  { href: '/dashboard/skills', label: 'skills', icon: Wrench },
  { href: '/dashboard/projects', label: 'projects', icon: FolderKanban },
  { href: '/dashboard/certifications', label: 'certifications', icon: Award },
  { href: '/dashboard/education', label: 'education', icon: GraduationCap },
  { href: '/dashboard/experience', label: 'experience', icon: Briefcase },
  { href: '/dashboard/journey', label: 'journey', icon: Map },
  { href: '/dashboard/social-links', label: 'social-links', icon: Share2 },
  { href: '/dashboard/uploads', label: 'uploads', icon: Upload },
  { href: '/dashboard/messages', label: 'messages', icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await api.post('/auth/logout');
    router.push('/dashboard/login');
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-panel-border bg-panel p-4">
      <div className="mb-8 flex items-center gap-2 font-mono text-sm">
        <TerminalSquare size={16} className="text-vision" />
        <span className="h-2 w-2 animate-blink rounded-full bg-online" />
        HAV_OS
      </div>

      <nav className="flex-1 space-y-1 font-mono text-sm">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded px-3 py-2 transition-colors ${
              pathname === href
                ? 'bg-bg text-vision'
                : 'text-muted hover:text-white'
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 rounded border border-panel-border px-3 py-2 text-left font-mono text-sm text-muted transition-all hover:border-ambition hover:text-ambition active:scale-95"
      >
        <LogOut size={15} />
        logout
      </button>
    </aside>
  );
}
