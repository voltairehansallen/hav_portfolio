function errorHandler(err, req, res, next) {
  console.error(err);

  // Erreurs Multer (upload de fichiers)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Fichier trop volumineux (max 10 Mo)' });
    }
    return res.status(400).json({ error: `Erreur upload: ${err.message}` });
  }
  if (err.message && err.message.includes('Type de fichier non autorisé')) {
    return res.status(400).json({ error: err.message });
  }

  // Erreurs Prisma connues
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Cette valeur existe déjà (contrainte unique)' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Ressource introuvable' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Erreur serveur' });
}

module.exports = errorHandler;
