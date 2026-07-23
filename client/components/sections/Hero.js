import api from '../../lib/api';
import HeroContent from './HeroContent';

async function getAbout() {
  try {
    const { data } = await api.get('/about');
    return data;
  } catch {
    return null;
  }
}

async function getStats() {
  try {
    const [projects, skills, certifications] = await Promise.all([
      api.get('/projects'),
      api.get('/skills'),
      api.get('/certifications'),
    ]);
    return {
      projects: projects.data.length,
      skills: skills.data.length,
      certifications: certifications.data.length,
    };
  } catch {
    return { projects: 0, skills: 0, certifications: 0 };
  }
}

export default async function Hero() {
  const [about, stats] = await Promise.all([getAbout(), getStats()]);
  return <HeroContent about={about} stats={stats} />;
}
