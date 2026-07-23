const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Vérifie le token JWT (cookie httpOnly "token" ou header Authorization: Bearer)
 * et attache req.user si valide. Bloque la requête sinon.
 */
function authMiddleware(req, res, next) {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  const token = req.cookies?.token || bearer;

  if (!token) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

module.exports = authMiddleware;
