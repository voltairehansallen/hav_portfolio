# HAV OS Portfolio

Monorepo — portfolio personnel avec dashboard admin et assistant IA.

## Structure

```
hav-os-portfolio/
├── server/    # Backend — Node.js, Express, Prisma, MySQL
└── client/    # Frontend — Next.js (site public + dashboard admin)
```

Chaque dossier a son propre `package.json`, `README.md`, et `.env.example` — ce sont deux
applications indépendantes qui communiquent uniquement via l'API REST (`server/` expose
`/api/*`, `client/` l'appelle en HTTP). Les regrouper dans un seul repo ne change rien à
leur fonctionnement, juste à la façon dont on les héberge/versionne.

## Développement local

```bash
# Terminal 1 — backend
cd server
npm install
cp .env.example .env   # renseigne DATABASE_URL, JWT_SECRET, etc.
npm run prisma:migrate
npm run dev             # http://localhost:5000

# Terminal 2 — frontend
cd client
npm install
cp .env.local.example .env.local
npm run dev              # http://localhost:3000
```

Voir `server/README.md` et `client/README.md` pour le détail de chaque application.

## Déploiement sur Railway (monorepo)

Railway permet à plusieurs services de pointer vers des sous-dossiers différents du même
repo GitHub, via le paramètre **Root Directory** :

1. Pousse ce dossier entier comme un seul repo GitHub
2. Sur Railway, crée un service depuis ce repo → **Settings → Source → Root Directory** →
   mets `server` → Railway ne build/déploie que ce sous-dossier
3. Crée un deuxième service depuis le **même repo** → **Root Directory** → `client`
4. Le reste de la configuration (variables d'environnement, domaines) est identique à un
   déploiement multi-repo classique.
"# hav_portfolio" 
"# hav_portfolio" 
