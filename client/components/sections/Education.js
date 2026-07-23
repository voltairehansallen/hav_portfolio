import Panel from '../ui/Panel';
import { GraduationCap } from 'lucide-react';
import EntryRow from '../ui/EntryRow';
import api from '../../lib/api';
import { formatDate } from '../../lib/formatDate';

async function getEducation() {
  try {
    const { data } = await api.get('/education');
    return data;
  } catch {
    return [];
  }
}

export default async function Education() {
  const education = await getEducation();

  if (education.length === 0) {
    return (
      <Panel id="education" label="EDUCATION.log" icon={<GraduationCap size={14} />}>
        <p className="font-mono text-sm text-muted">// aucune formation enregistrée</p>
      </Panel>
    );
  }

  return (
    <Panel id="education" label="EDUCATION.log" title="Éducation" icon={<GraduationCap size={14} />}>
      {education.map((entry) => (
        <EntryRow
          key={entry.id}
          title={entry.degree}
          subtitle={entry.school}
          description={entry.description}
          meta={`${formatDate(entry.startDate)} — ${entry.endDate ? formatDate(entry.endDate) : 'présent'}`}
        />
      ))}
    </Panel>
  );
}
