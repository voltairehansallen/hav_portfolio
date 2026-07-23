import Panel from '../ui/Panel';
import { Award } from 'lucide-react';
import EntryRow from '../ui/EntryRow';
import api from '../../lib/api';
import { formatDate } from '../../lib/formatDate';

async function getCertifications() {
  try {
    const { data } = await api.get('/certifications');
    return data;
  } catch {
    return [];
  }
}

export default async function Certifications() {
  const certifications = await getCertifications();

  if (certifications.length === 0) {
    return (
      <Panel id="certifications" label="CERTIFICATIONS.log" icon={<Award size={14} />}>
        <p className="font-mono text-sm text-muted">// aucune certification enregistrée</p>
      </Panel>
    );
  }

  return (
    <Panel id="certifications" label="CERTIFICATIONS.log" title="Certifications" icon={<Award size={14} />}>
      {certifications.map((cert) => (
        <EntryRow
          key={cert.id}
          title={cert.title}
          subtitle={cert.issuer}
          meta={formatDate(cert.issueDate)}
        />
      ))}
    </Panel>
  );
}
