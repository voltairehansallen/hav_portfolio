import Panel from '../ui/Panel';
import Image from 'next/image';
import { User, Download } from 'lucide-react';
import api from '../../lib/api';

async function getAbout() {
  try {
    const { data } = await api.get('/about');
    return data;
  } catch {
    return null;
  }
}

export default async function About() {
  const about = await getAbout();

  if (!about) {
    return (
      <Panel id="about" label="ABOUT.md" icon={<User size={14} />}>
        <p className="font-mono text-sm text-muted">
          // aucune donnée "about" pour l'instant — à renseigner depuis le dashboard
        </p>
      </Panel>
    );
  }

  return (
    <Panel id="about" label="ABOUT.md" title={about.headline} icon={<User size={14} />}>
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="font-body text-base leading-relaxed text-muted sm:text-lg">
            {about.bio}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <ValueBlock label="Humility" value={about.humility} color="text-white" />
            <ValueBlock label="Ambition" value={about.ambition} color="text-ambition" />
            <ValueBlock label="Vision" value={about.vision} color="text-vision" />
          </div>

          {about.cvUrl && (
            <a
              href={about.cvUrl}
              download
              className="mt-8 inline-flex items-center gap-2 rounded border border-panel-border px-5 py-3 font-mono text-sm text-white transition-all hover:border-vision hover:text-vision active:scale-95"
            >
              <Download size={14} /> telecharger_cv
            </a>
          )}
        </div>

        {about.photoUrl && (
          <Image
            src={about.photoUrl}
            alt={about.name || ''}
            width={208}
            height={208}
            className="h-40 w-40 rounded-lg border border-panel-border object-cover sm:h-52 sm:w-52"
          />
        )}
      </div>
    </Panel>
  );
}

function ValueBlock({ label, value, color }) {
  return (
    <div className="rounded border border-panel-border p-4">
      <p className={`font-mono text-xs font-medium ${color}`}>{label}</p>
      <p className="mt-2 text-sm text-muted">{value}</p>
    </div>
  );
}
