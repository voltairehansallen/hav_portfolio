const prisma = require('../config/prisma');
const asyncHandler = require('./asyncHandler');

/**
 * Génère { getAll, getOne, create, update, remove } pour un modèle Prisma donné.
 * @param {string} modelName - nom du modèle Prisma (ex: 'skill', 'project')
 * @param {object} options - { orderBy, include }
 */
function crudFactory(modelName, options = {}) {
  const model = prisma[modelName];
  if (!model) {
    throw new Error(`Modèle Prisma inconnu: ${modelName}`);
  }
  const orderBy = options.orderBy || { id: 'asc' };
  const include = options.include;

  const getAll = asyncHandler(async (req, res) => {
    const items = await model.findMany({ orderBy, include });
    res.json(items);
  });

  const getOne = asyncHandler(async (req, res) => {
    const item = await model.findUnique({ where: { id: Number(req.params.id) }, include });
    if (!item) return res.status(404).json({ error: 'Ressource introuvable' });
    res.json(item);
  });

  const create = asyncHandler(async (req, res) => {
    const item = await model.create({ data: req.body });
    res.status(201).json(item);
  });

  const update = asyncHandler(async (req, res) => {
    const item = await model.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(item);
  });

  const remove = asyncHandler(async (req, res) => {
    await model.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  });

  return { getAll, getOne, create, update, remove };
}

module.exports = crudFactory;
