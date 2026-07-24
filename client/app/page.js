import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Certifications from '../components/sections/Certifications';
import Education from '../components/sections/Education';
import Experience from '../components/sections/Experience';
import Journey from '../components/sections/Journey';
import Contact from '../components/sections/Contact';
import api from '../lib/api';

// La page dépend de données qui changent via le dashboard (About, Skills, Projects...).
// On utilise Axios ici, pas le fetch natif de Next.js — Next n'a donc aucun moyen de
// détecter automatiquement cette dépendance et figerait la page en statique au build,
// avec les données du moment du déploiement, sans jamais se mettre à jour ensuite.
export const dynamic = 'force-dynamic';

async function getAbout() {
  try {
    const { data } = await api.get('/about');
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const about = await getAbout();
  if (!about?.name) return {};

  const title = `${about.name} — ${about.headline}`;
  const description = about.bio?.slice(0, 155) || undefined;

  return {
    title,
    description,
  };
}

export default async function HomePage() {
  const about = await getAbout();

  // Schema.org — aide les moteurs de recherche à comprendre qui est la page,
  // sans rien changer au rendu visible.
  const personSchema = about?.name
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: about.name,
        jobTitle: about.headline,
        description: about.bio,
        image: about.photoUrl || undefined,
        url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
      }
    : null;

  return (
    <main>
      {personSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      )}
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <Education />
      <Experience />
      <Journey />
      <Contact />
    </main>
  );
}
