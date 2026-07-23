import Panel from '../ui/Panel';
import { Briefcase } from 'lucide-react';
import EntryRow from '../ui/EntryRow';
import api from '../../lib/api';
import { formatDate } from '../../lib/formatDate';

async function getExperience() {
  try {
    const { data } = await api.get('/experience');
    return data;
  } catch {
    return [];
  }
}

export default async function Experience() {
  const experience = await getExperience();

  if (experience.length === 0) {
    return (
      <Panel id="experience" label="EXPERIENCE.log" icon={<Briefcase size={14} />}>
        <p className="font-mono text-sm text-muted">// aucune expérience enregistrée</p>
      </Panel>
    );
  }

  return (
    <Panel id="experience" label="EXPERIENCE.log" title="Expérience" icon={<Briefcase size={14} />}>
      {experience.map((entry) => (
        <EntryRow
          key={entry.id}
          title={entry.title}
          subtitle={entry.company}
          description={entry.description}
          meta={`${formatDate(entry.startDate)} — ${entry.endDate ? formatDate(entry.endDate) : 'présent'}`}
        />
      ))}
    </Panel>
  );
}
