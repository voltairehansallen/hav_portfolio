const asyncHandler = require('../../utils/asyncHandler');
const authService = require('./auth.service');
const env = require('../../config/env');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login(email, password);

  // En production, front et back sont sur des domaines différents (Railway) —
  // un cookie "Lax" ne serait pas envoyé sur ces requêtes cross-site.
  // "None" + secure fonctionne car Railway sert en HTTPS.
  const isProd = env.nodeEnv === 'production';

  // Cookie httpOnly = protège contre le vol de token via XSS
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });

  res.json({ user, token });
});

const logout = (req, res) => {
  const isProd = env.nodeEnv === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  res.status(204).send();
};

const me = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { login, logout, me };
