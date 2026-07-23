const prisma = require('../../config/prisma');

/**
 * Récupère toutes les données publiques du portfolio et les formate
 * en texte compact pour servir de contexte strict à HAV AI.
 * Le chatbot ne doit répondre qu'à partir de ce texte.
 */
async function buildPortfolioContext() {
  const [about, skills, projects, certifications, education, experience, journey, socialLinks] =
    await Promise.all([
      prisma.about.findFirst(),
      prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      prisma.project.findMany({ orderBy: { order: 'asc' } }),
      prisma.certification.findMany({ orderBy: { order: 'asc' } }),
      prisma.education.findMany({ orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.journeyEntry.findMany({ orderBy: { order: 'asc' } }),
      prisma.socialLink.findMany({ orderBy: { order: 'asc' } }),
    ]);

  const lines = [];

  if (about) {
    lines.push(`## À propos`);
    if (about.name) lines.push(`Nom : ${about.name}`);
    lines.push(`${about.headline}`);
    lines.push(about.bio);
    lines.push(`Humility: ${about.humility}`);
    lines.push(`Ambition: ${about.ambition}`);
    lines.push(`Vision: ${about.vision}`);
    if (about.mission) lines.push(`Mission: ${about.mission}`);
    if (about.philosophy) lines.push(`Philosophie: ${about.philosophy}`);
    if (about.quote) lines.push(`Citation personnelle: "${about.quote}"`);
  }

  if (skills.length) {
    lines.push(`\n## Compétences`);
    skills.forEach((s) => lines.push(`- ${s.name} (${s.category}, niveau ${s.level}/100)`));
  }

  if (projects.length) {
    lines.push(`\n## Projets`);
    projects.forEach((p) => {
      const stack = Array.isArray(p.techStack) ? p.techStack.join(', ') : '';
      lines.push(`- ${p.title}: ${p.description} [Stack: ${stack}]`);
    });
  }

  if (certifications.length) {
    lines.push(`\n## Certifications`);
    certifications.forEach((c) =>
      lines.push(`- ${c.title} (${c.issuer}, ${c.issueDate.toISOString().slice(0, 10)})`)
    );
  }

  if (education.length) {
    lines.push(`\n## Éducation`);
    education.forEach((e) => lines.push(`- ${e.degree} — ${e.school}`));
  }

  if (experience.length) {
    lines.push(`\n## Expérience`);
    experience.forEach((e) => lines.push(`- ${e.title} chez ${e.company}`));
  }

  if (journey.length) {
    lines.push(`\n## Parcours`);
    journey.forEach((j) => lines.push(`- ${j.title}: ${j.description}`));
  }

  if (socialLinks.length) {
    lines.push(`\n## Liens`);
    socialLinks.forEach((s) => lines.push(`- ${s.platform}: ${s.url}`));
  }

  return lines.join('\n');
}

module.exports = { buildPortfolioContext };
