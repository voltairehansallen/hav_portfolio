const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');

// Il n'existe qu'une seule ligne "About". On la récupère (ou null si pas encore créée).
const getAbout = asyncHandler(async (req, res) => {
  const about = await prisma.about.findFirst();
  res.json(about);
});

// Upsert : crée la ligne si elle n'existe pas, sinon la met à jour.
const upsertAbout = asyncHandler(async (req, res) => {
  const existing = await prisma.about.findFirst();

  const about = existing
    ? await prisma.about.update({ where: { id: existing.id }, data: req.body })
    : await prisma.about.create({ data: req.body });

  res.json(about);
});

module.exports = { getAbout, upsertAbout };
