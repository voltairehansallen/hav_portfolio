# HAV OS Portfolio — Client

Frontend Next.js du portfolio personnel HAV OS.

## Stack
Next.js (App Router) · React · Tailwind CSS · Framer Motion · Axios

## Installation

1. `npm install`
2. Copier `.env.local.example` en `.env.local`
3. Vérifier que le backend tourne sur `http://localhost:5000` (voir `hav-os-portfolio-server`)
4. `npm run dev`
5. Ouvrir `http://localhost:3000`

## Direction de design (V1 — dark uniquement)

Concept "interface système" : le site se présente comme le système d'exploitation
personnel HAV OS (boot sequence, barre de statut façon taskbar, sections en panneaux
nommés type fichier système).

**Palette centralisée en CSS variables** (`app/globals.css`, bloc `:root`) — une seule
source de vérité, `tailwind.config.js` y fait référence via `rgb(var(--x) / <alpha>)`.
Les noms de tokens Tailwind (`bg`, `panel`, `vision`, `ambition`, `muted`, `online`)
restent identiques à travers tout le projet ; seules leurs valeurs changent, donc changer
la palette ne nécessite jamais de toucher aux composants.

Palette monochrome (Cinder / Chimney / Sea Lion / Blue Dolphin / Black Metal) — ces 5
couleurs forment une échelle de luminosité quasi parfaite, réutilisée comme échelle
`primary-50` → `primary-900`.

| Token | Valeur | Usage |
|---|---|---|
| `bg` | `#24292E` (Cinder) | Fond général |
| `panel` | `#373D42` | Panneaux/cartes |
| `panel-border` | `#4A5156` (Chimney) | Bordures |
| `vision` (= `primary-50`) | `#BDC7CE` (Blue Dolphin) | Accent principal (liens, focus, CTA) |
| `ambition` (= `primary-200`) | `#808A92` (Sea Lion) | Accent secondaire |
| `muted` | `#656D74` | Texte secondaire |
| `online` | `#BDC7CE` | Indicateur de statut (pas de vert dans cette palette, utilise l'accent clair) |

Typographies : Space Grotesk (titres), Inter (texte), JetBrains Mono (labels/données système).

Mobile-first : toutes les classes Tailwind partent du mobile, `md:`/`lg:` ajoutent les
ajustements desktop. Menu nav en hamburger sous `md`, nav complète au-dessus.

⚠️ Pas de curseur personnalisé (retiré à la demande — préférence utilisateur, curseur
natif partout).

### Effets "premium" ajoutés

- **Barre de progression de scroll** (`components/ScrollProgress.js`) — fine ligne en haut
  de page, se remplit avec la position de lecture
- **Compteurs animés** dans la barre de stats du hero — comptent de 0 jusqu'à la vraie
  valeur quand ils entrent dans le viewport
- **Halo lumineux ambiant** dans le hero — deux formes floues en dégradé, discrètes,
  purement décoratives (`aria-hidden`)
- **Cartes projets avec image** — si un média `IMAGE` est lié au projet (upload avec
  `projectId`), il s'affiche en couverture avec effet de zoom + overlay au survol

## Ce qui est fait

- Layout racine avec les 3 polices chargées via `next/font`
- `StatusBar` — nav responsive (taskbar desktop / menu mobile) + sélecteur FR/EN
- `Hero` — deux modes :
  - **Fallback** (tant que `about.name` n'est pas renseigné) : hero centré générique
  - **Personnalisé** (dès que `about.name` existe) : deux colonnes, photo encadrée façon
    interface système avec badges flottants ("Data Analyst" / "Full-Stack Dev"), CTA
    "Prendre un rendez-vous" (pointe vers `#contact`), lien de téléchargement CV
- `lib/LanguageContext.js` — sélecteur FR/EN fonctionnel pour la nav et le hero
  (persisté en `localStorage`). ⚠️ Ne traduit **que** ces textes statiques — le contenu
  venant de l'API (About, Projects, etc.) reste dans la langue où il a été saisi ; une
  vraie traduction du contenu serait une étape à part (probablement un champ par langue
  en base, ou un service de traduction)
- `About`, `Skills`, `Projects`, `Certifications`, `Education`, `Experience`, `Journey` —
  sections connectées à l'API, chacune avec un état vide propre si la donnée n'existe pas
  encore en base
- `Contact` — formulaire connecté à `POST /api/messages`, avec gestion succès/erreur, +
  liens sociaux
- `ChatWidget` — bulle flottante HAV AI, connectée à `POST /api/hav-ai/chat`, historique de
  session gardé en `localStorage`

## Améliorations UI/UX premium (icônes, animations, footer)

- **Icônes** (Lucide React) sur la navbar, les boutons, les panneaux de section, le
  dashboard et le footer
- **Favicon** — généré nativement par Next.js (`app/icon.js`, `app/apple-icon.js`,
  `app/manifest.js`), monogramme "H" dans les couleurs HAV OS, aucun outil externe requis
- **Navbar** — effet verre (glass) au scroll, lien actif détecté via `IntersectionObserver`
  pendant le défilement
- **Hero** — vrai effet de frappe (typing) sur la séquence de boot, respecte
  `prefers-reduced-motion`
- **Panels** (About, Skills, Projects...) — animation d'apparition au scroll (fade + slide),
  ombre portée au survol
- **Boutons** — états hover/active/loading/disabled avec icônes, micro-interaction
  `active:scale-95`
- **Footer** — logo HAV, devise (Humility • Ambition • Vision), nav rapide, réseaux sociaux,
  copyright, bouton retour en haut
- **HAV AI** — message d'accueil, 3 suggestions de questions cliquables, masqué sur
  `/dashboard` (widget public uniquement)

⚠️ Volontairement **non ajouté** : curseur personnalisé — mauvais pour l'accessibilité et
sans effet sur mobile/tactile, à l'écart des bonnes pratiques même si mentionné dans le
brief initial. Dis-moi si tu le veux quand même.

## Dashboard admin

Zone protégée du même projet (pas un repo séparé), sur `/dashboard` — redirige vers
`/dashboard/login` si non connecté. Utilise le cookie JWT `httpOnly` posé par le backend
au login — pas de gestion manuelle de token côté client.

- `middleware.js` — bloque l'accès à `/dashboard/*` si le cookie `token` est absent
  (première ligne de défense ; l'autorisation réelle reste vérifiée côté backend à chaque
  appel API, donc pas de faille même si le middleware était contourné)

| Page | Contenu |
|---|---|
| `/dashboard/login` | Formulaire de connexion admin |
| `/dashboard` | Overview — compteurs par module + messages non lus |
| `/dashboard/about` | Formulaire singleton (GET + PUT) |
| `/dashboard/skills` | CRUD complet |
| `/dashboard/projects` | CRUD complet (stack technique en champ texte, converti en tableau) |
| `/dashboard/certifications` | CRUD complet |
| `/dashboard/education` | CRUD complet |
| `/dashboard/experience` | CRUD complet |
| `/dashboard/journey` | CRUD complet (timeline) |
| `/dashboard/social-links` | CRUD complet |
| `/dashboard/uploads` | Upload de fichiers (images/PDF), copie d'URL, suppression |
| `/dashboard/messages` | Liste des messages, marquer comme lu, supprimer |

Le dashboard est maintenant complet — tous les modules prévus dans le cahier des charges
initial sont gérables sans toucher au code.

Pour lier une photo/CV/certificat : uploade le fichier via `/dashboard/uploads`, clique
"copier url", colle l'URL dans le champ correspondant (`photoUrl`/`cvUrl` dans About,
`fileUrl` dans Certifications).

## Prêt pour la production (correctifs récents)

- **Auth cross-domain** : cookie `sameSite: 'none'` + `secure` en production (Railway sert
  en HTTPS) — sans ça, la connexion au dashboard échoue quand front/back sont sur des
  domaines différents
- **Vérification de session côté client** : `app/dashboard/(admin)/layout.js` interroge
  `/api/auth/me` au chargement plutôt que de lire le cookie via middleware — fonctionne
  peu importe le domaine (le middleware Next.js ne peut pas voir un cookie posé par un
  autre domaine, donc il a été retiré)
- **Session expirée** : intercepteur Axios (`lib/api.js`) redirige vers `/dashboard/login`
  si une requête échoue en 401 pendant qu'on est dans le dashboard
- **SEO** : `generateMetadata` dynamique (titre/description depuis About),
  `opengraph-image` généré à la volée, `sitemap.xml`, `robots.txt`, JSON-LD Schema.org
  (type `Person`)
- **Images optimisées** : `next/image` sur les photos (About, Hero) — lazy loading et
  formats optimisés automatiques ; le pattern de domaine autorisé se déduit de
  `NEXT_PUBLIC_API_URL`, pas besoin de réédition manuelle après déploiement
- **Validation** : champs URL du dashboard passés en `type="url"` (validation navigateur)

⚠️ Variable d'env à ajouter : `NEXT_PUBLIC_SITE_URL` (voir `.env.local.example`) — utilisée
par le SEO (URLs absolues, sitemap, Schema.org).

## Prochaines étapes (à valider une par une)
- [ ] Déploiement sur Railway (backend + frontend)
- [ ] Recherche, notifications, Command Palette (V2, non critique)
- [ ] Tests automatisés
