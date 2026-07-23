# HAV OS Portfolio — Server

API backend du portfolio personnel HAV OS.

## Stack
Node.js · Express · Prisma · MySQL · JWT · bcrypt

## Installation

1. `npm install`
2. Copier `.env.example` en `.env` et renseigner `DATABASE_URL` (ex: instance MySQL sur Railway)
3. `npm run prisma:generate`
4. `npm run prisma:migrate` — crée la table `users` en base
5. `npm run dev`

## Vérifier que ça fonctionne

`GET http://localhost:5000/api/health` doit renvoyer `{ "status": "ok" }`.

## Créer le compte admin (une seule fois)

1. Renseigne `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans `.env`
2. `npm run prisma:seed`
3. Connexion : `POST /api/auth/login` avec `{ "email": ..., "password": ... }`

Il n'y a pas de route d'inscription publique — un seul admin, créé par ce script.

## Routes disponibles

| Méthode | Route | Accès |
|---|---|---|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Protégé |
| GET | `/api/auth/me` | Protégé |
| GET | `/api/about` | Public |
| PUT | `/api/about` | Protégé |
| GET/POST/PUT/DELETE | `/api/skills`, `/api/projects`, `/api/certifications`, `/api/education`, `/api/experience`, `/api/journey`, `/api/social-links` | GET public, écriture protégée |
| POST | `/api/messages` | Public (formulaire contact) |
| GET/PUT/DELETE | `/api/messages` | Protégé |
| POST | `/api/hav-ai/chat` | Public — `{ sessionId?, message }` → `{ sessionId, reply }` |
| POST | `/api/uploads` | Protégé — form-data `file` + `type` (IMAGE/PDF/LOGO) [+ `projectId` optionnel] |
| GET | `/api/uploads` | Protégé — liste tous les médias |
| DELETE | `/api/uploads/:id` | Protégé — supprime le fichier disque + l'entrée DB |

## HAV AI

Chatbot alimenté par Gemini (`gemini-3.6-flash` par défaut). Il répond uniquement à partir
des données réelles du portfolio (About, Skills, Projects, Certifications, Education,
Experience, Journey, Social Links), injectées comme instruction système stricte à chaque
appel. L'historique de conversation est gardé en mémoire côté serveur, par `sessionId`
(généré automatiquement si absent), avec expiration après 30 min d'inactivité.

Nécessite `GEMINI_API_KEY` dans `.env` (clé créée sur https://aistudio.google.com/apikey).

## Uploads

Stockage **local sur disque** (dossier `uploads/` à la racine, servi statiquement sur
`/uploads/<filename>`). Formats acceptés : JPEG, PNG, WEBP, GIF, PDF — max 10 Mo.

⚠️ **Limite connue et assumée** : le système de fichiers de Railway est éphémère — les
fichiers uploadés seront perdus à chaque redeploy. Acceptable pour la V1 ; si ça devient
gênant, migrer vers Cloudinary (gratuit, fait pour ce cas) sans changer le reste de
l'architecture — seul `uploads.controller.js` serait à adapter.

Pour associer une image à un projet précis, passe `projectId` lors de l'upload — sinon le
média reste "libre" (utile pour un logo ou un CV qu'on relie via `photoUrl`/`cvUrl` dans le
module About plutôt que via la relation `Media`).

## Import du profil

`scripts/import-profile.js` remplit About/Skills/Projects via l'API (voir `npm run
import:profile`). Idempotent — relançable sans dupliquer.

## Prêt pour la production

- **Cookie cross-domain** : `sameSite: 'none'` + `secure: true` en production
  (`NODE_ENV=production`) — nécessaire quand front et back sont sur des domaines
  différents (Railway). En dev local, reste en `lax` (pas besoin de HTTPS).

## Prochaines étapes (à valider une par une)
- [x] Schéma Prisma complet
- [x] Module Auth (login admin, middleware JWT)
- [x] Modules CRUD (about, skills, projects, certifications, education, experience, journey, social-links, messages)
- [x] Module HAV AI (chatbot Gemini, contexte strict, historique par session)
- [x] Module Uploads (stockage local, images + PDF)
- [x] Frontend Next.js
- [ ] Déploiement Railway
