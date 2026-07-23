require('dotenv').config();

const BASE_URL = process.env.IMPORT_API_URL || `http://localhost:${process.env.PORT || 5000}/api`;

const ABOUT = {
  name: 'Hans Allen Voltaire',
  headline: 'Étudiant en Informatique · Aspirant Data Analyst',
  bio: "Je suis Hans Allen Voltaire, étudiant en dernière année d'Informatique à l'Université de Port-au-Prince en Haïti. Je suis passionné par l'analyse de données, les technologies, le développement logiciel et la résolution de problèmes. Mon objectif est de construire des solutions numériques qui permettent de transformer des données en décisions utiles. Je développe continuellement mes compétences afin de devenir un Data Analyst reconnu en Haïti puis à l'international.",
  humility:
    "Je reste calme, réfléchi et discipliné, curieux et toujours prêt à apprendre. J'accorde plus d'importance aux résultats qu'aux paroles, et je préfère construire dans le silence.",
  ambition:
    'Devenir Data Analyst, construire un portfolio professionnel solide, créer des projets concrets, obtenir une expérience internationale et développer des solutions utilisant l\'intelligence artificielle.',
  vision:
    "Devenir l'un des meilleurs Data Analysts d'Haïti, construire plusieurs produits numériques, créer une entreprise reconnue dans le domaine de la donnée, atteindre l'indépendance financière et aider ma famille.",
  mission:
    'Construire des solutions intelligentes qui permettent aux entreprises de prendre de meilleures décisions grâce aux données. Partager mes connaissances, créer des projets utiles et aider mon pays grâce à la technologie.',
  philosophy:
    "Je crois que les résultats sont plus importants que les promesses. J'apprends continuellement. Je préfère construire dans le silence. Chaque projet est une opportunité d'apprendre.",
  quote: 'Construire aujourd\'hui ce dont je serai fier demain.',
};

// Niveaux neutres par défaut (55) — le document fourni ne précisait aucun niveau de
// maîtrise réel. Power BI et Anglais sont marqués "en apprentissage/en progression"
// dans le document, donc mis plus bas. Ajuste ces chiffres depuis le dashboard.
const SKILLS = [
  // Data & Analyse
  { name: 'Python', category: 'Data & Analyse', level: 55 },
  { name: 'SQL', category: 'Data & Analyse', level: 55 },
  { name: 'Excel', category: 'Data & Analyse', level: 55 },
  { name: 'Power BI', category: 'Data & Analyse', level: 35 },
  { name: 'Statistiques', category: 'Data & Analyse', level: 55 },
  { name: 'Analyse de données', category: 'Data & Analyse', level: 55 },
  { name: 'Visualisation de données', category: 'Data & Analyse', level: 55 },

  // Développement
  { name: 'HTML', category: 'Développement', level: 55 },
  { name: 'CSS', category: 'Développement', level: 55 },
  { name: 'JavaScript', category: 'Développement', level: 55 },
  { name: 'Node.js', category: 'Développement', level: 55 },
  { name: 'Express.js', category: 'Développement', level: 55 },
  { name: 'MySQL', category: 'Développement', level: 55 },
  { name: 'Git', category: 'Développement', level: 55 },
  { name: 'GitHub', category: 'Développement', level: 55 },
  { name: 'API REST', category: 'Développement', level: 55 },

  // Design & Marketing
  { name: 'Marketing Digital', category: 'Design & Marketing', level: 55 },
  { name: 'Adobe Photoshop', category: 'Design & Marketing', level: 55 },
  { name: 'Adobe Illustrator', category: 'Design & Marketing', level: 55 },
  { name: 'Adobe InDesign', category: 'Design & Marketing', level: 55 },
  { name: 'Canva', category: 'Design & Marketing', level: 55 },

  // Outils
  { name: 'VS Code', category: 'Outils', level: 55 },
  { name: 'XAMPP', category: 'Outils', level: 55 },
  { name: 'Railway', category: 'Outils', level: 55 },
  { name: 'Vercel', category: 'Outils', level: 55 },
  { name: 'Postman', category: 'Outils', level: 55 },
  { name: 'Figma', category: 'Outils', level: 55 },

  // Langues
  { name: 'Français', category: 'Langues', level: 90 },
  { name: 'Créole Haïtien', category: 'Langues', level: 90 },
  { name: 'Anglais', category: 'Langues', level: 40 },
].map((s, i) => ({ ...s, order: i + 1 }));

const PROJECTS = [
  {
    title: 'HAV OS Portfolio',
    slug: 'hav-os-portfolio',
    description: 'Portfolio professionnel avec dashboard et assistant IA.',
    techStack: ['Next.js', 'Node.js', 'Express.js', 'MySQL', 'Prisma'],
    order: 1,
  },
  {
    title: 'Nexio',
    slug: 'nexio',
    description: "Plateforme e-commerce avec intégration d'IA.",
    techStack: [],
    order: 2,
  },
  {
    title: 'HAVGrowth',
    slug: 'havgrowth',
    description:
      'Projet personnel autour de la finance, de la gestion de patrimoine et de l\'investissement.',
    techStack: [],
    order: 3,
  },
];

async function login() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env');
  }
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login échoué: ${res.status} ${await res.text()}`);
  const { token } = await res.json();
  return token;
}

async function apiRequest(token, method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    console.error(`  ✗ ${method} ${path} → ${res.status} ${await res.text()}`);
    return null;
  }
  return res.json();
}

async function getExisting(token, path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

async function main() {
  console.log(`Connexion à ${BASE_URL}...`);
  const token = await login();
  console.log('Connecté.\n');

  console.log('About...');
  await apiRequest(token, 'PUT', '/about', ABOUT);
  console.log('  ✓ About mis à jour\n');

  console.log(`Skills (${SKILLS.length})...`);
  const existingSkills = await getExisting(token, '/skills');
  const existingSkillNames = new Set(existingSkills.map((s) => s.name));
  for (const skill of SKILLS) {
    if (existingSkillNames.has(skill.name)) {
      console.log(`  → ${skill.name} (déjà présent, ignoré)`);
      continue;
    }
    await apiRequest(token, 'POST', '/skills', skill);
    console.log(`  ✓ ${skill.name}`);
  }

  console.log(`\nProjects (${PROJECTS.length})...`);
  const existingProjects = await getExisting(token, '/projects');
  const existingSlugs = new Set(existingProjects.map((p) => p.slug));
  for (const project of PROJECTS) {
    if (existingSlugs.has(project.slug)) {
      console.log(`  → ${project.title} (déjà présent, ignoré)`);
      continue;
    }
    await apiRequest(token, 'POST', '/projects', project);
    console.log(`  ✓ ${project.title}`);
  }

  console.log('\nTerminé. Certifications, Education, Experience et Journey restent à');
  console.log('remplir manuellement (dates/organismes précis non fournis).');
  console.log('Ce script peut être relancé sans risque de doublons.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
