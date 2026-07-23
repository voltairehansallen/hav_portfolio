const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const { UPLOAD_DIR } = require('./config/upload');

const app = express();

// Sécurité de base
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Fichiers uploadés (images, PDF) servis statiquement
app.use('/uploads', express.static(UPLOAD_DIR));

// Rate limiting global (anti brute-force / abus)
// Plus permissif en dev : le dashboard fait plusieurs appels par page, et le mode
// strict de React en double certains en développement.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.nodeEnv === 'production' ? 200 : 2000,
});
app.use(limiter);

// Route de santé — pour vérifier que l'API + la DB répondent
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: env.nodeEnv });
});

// Modules
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/about', require('./modules/about/about.routes'));
app.use('/api/skills', require('./modules/skills/skills.routes'));
app.use('/api/projects', require('./modules/projects/projects.routes'));
app.use('/api/certifications', require('./modules/certifications/certifications.routes'));
app.use('/api/education', require('./modules/education/education.routes'));
app.use('/api/experience', require('./modules/experience/experience.routes'));
app.use('/api/journey', require('./modules/journey/journey.routes'));
app.use('/api/social-links', require('./modules/social-links/social-links.routes'));
app.use('/api/messages', require('./modules/messages/messages.routes'));
app.use('/api/hav-ai', require('./modules/hav-ai/hav-ai.routes'));
app.use('/api/uploads', require('./modules/uploads/uploads.routes'));

// 404 pour toute route API non trouvée
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route API introuvable' });
});

// Gestionnaire d'erreurs centralisé — doit rester en dernier
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`HAV OS Portfolio API démarrée sur le port ${env.port}`);
});
