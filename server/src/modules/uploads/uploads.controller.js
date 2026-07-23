const fs = require('fs');
const path = require('path');
const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const { UPLOAD_DIR } = require('../../config/upload');
const env = require('../../config/env');

const VALID_TYPES = ['IMAGE', 'PDF', 'LOGO'];

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu' });
  }

  const type = req.body.type;
  if (!VALID_TYPES.includes(type)) {
    fs.unlinkSync(req.file.path); // nettoie le fichier déjà écrit sur disque
    return res.status(400).json({ error: `type doit être l'un de : ${VALID_TYPES.join(', ')}` });
  }

  const projectId = req.body.projectId ? Number(req.body.projectId) : null;
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  const media = await prisma.media.create({
    data: {
      url,
      filename: req.file.filename,
      type,
      projectId,
    },
  });

  res.status(201).json(media);
});

const listMedia = asyncHandler(async (req, res) => {
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(media);
});

const deleteMedia = asyncHandler(async (req, res) => {
  const media = await prisma.media.findUnique({ where: { id: Number(req.params.id) } });
  if (!media) return res.status(404).json({ error: 'Média introuvable' });

  const filePath = path.join(UPLOAD_DIR, media.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await prisma.media.delete({ where: { id: media.id } });
  res.status(204).send();
});

module.exports = { uploadFile, listMedia, deleteMedia };
