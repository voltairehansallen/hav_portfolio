import Panel from '../ui/Panel';
import { Map } from 'lucide-react';
import api from '../../lib/api';
import { formatDate } from '../../lib/formatDate';

async function getJourney() {
  try {
    const { data } = await api.get('/journey');
    return data;
  } catch {
    return [];
  }
}

export default async function Journey() {
  const journey = await getJourney();

  if (journey.length === 0) {
    return (
      <Panel id="journey" label="JOURNEY.log" icon={<Map size={14} />}>
        <p className="font-mono text-sm text-muted">// aucune étape enregistrée</p>
      </Panel>
    );
  }

  return (
    <Panel id="journey" label="JOURNEY.log" title="Parcours" icon={<Map size={14} />}>
      <ol className="relative space-y-8 border-l border-panel-border pl-6">
        {journey.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-vision" />
            <p className="font-mono text-xs text-muted">{formatDate(entry.date)}</p>
            <p className="mt-1 font-body font-semibold text-white">{entry.title}</p>
            <p className="mt-1 text-sm text-muted">{entry.description}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
