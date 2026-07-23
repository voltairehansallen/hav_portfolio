const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { chat } = require('./hav-ai.controller');
const { requireFields } = require('../../middlewares/validate.middleware');

// Limite dédiée : chaque appel consomme un appel Gemini (coût réel)
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { error: "Trop de messages envoyés à HAV AI, réessaie dans quelques minutes" },
});

router.post('/chat', chatLimiter, requireFields(['message']), chat);

module.exports = router;
