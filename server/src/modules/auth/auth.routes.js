const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { login, logout, me } = require('./auth.controller');
const auth = require('../../middlewares/auth.middleware');
const { requireFields } = require('../../middlewares/validate.middleware');
const env = require('../../config/env');

// Limite stricte sur le login pour contrer le brute-force (plus permissive en dev)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.nodeEnv === 'production' ? 10 : 100,
  message: { error: 'Trop de tentatives, réessaie plus tard' },
});

router.post('/login', loginLimiter, requireFields(['email', 'password']), login);
router.post('/logout', auth, logout);
router.get('/me', auth, me);

module.exports = router;
