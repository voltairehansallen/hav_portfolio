import Panel from '../ui/Panel';
import { Wrench } from 'lucide-react';
import api from '../../lib/api';

async function getSkills() {
  try {
    const { data } = await api.get('/skills');
    return data;
  } catch {
    return [];
  }
}

function groupByCategory(skills) {
  return skills.reduce((groups, skill) => {
    const key = skill.category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(skill);
    return groups;
  }, {});
}

export default async function Skills() {
  const skills = await getSkills();

  if (skills.length === 0) {
    return (
      <Panel id="skills" label="SKILLS.sys" icon={<Wrench size={14} />}>
        <p className="font-mono text-sm text-muted">
          // aucune compétence enregistrée pour l'instant
        </p>
      </Panel>
    );
  }

  const grouped = groupByCategory(skills);

  return (
    <Panel id="skills" label="SKILLS.sys" title="Compétences" icon={<Wrench size={14} />}>
      <div className="grid gap-8 sm:grid-cols-2">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wide text-muted">
              {category}
            </h3>
            <div className="space-y-4">
              {items.map((skill) => (
                <div key={skill.id}>
                  <div className="mb-1 flex justify-between font-mono text-xs">
                    <span className="text-white">{skill.name}</span>
                    <span className="text-muted">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-bg">
                    <div
                      className="h-1.5 rounded-full bg-vision"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
