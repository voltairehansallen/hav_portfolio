const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const crudFactory = require('../../utils/crudFactory');
const auth = require('../../middlewares/auth.middleware');
const { requireFields } = require('../../middlewares/validate.middleware');

const { getAll, getOne, create, update, remove } = crudFactory('message', {
  orderBy: { createdAt: 'desc' },
});

// Limite dédiée pour éviter le spam via le formulaire de contact
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de messages envoyés, réessaie plus tard' },
});

// Public — formulaire de contact
router.post(
  '/',
  contactLimiter,
  requireFields(['name', 'email', 'message']),
  create
);

// Protégé — gestion depuis le dashboard
router.get('/', auth, getAll);
router.get('/:id', auth, getOne);
router.put('/:id', auth, update); // ex: marquer comme lu
router.delete('/:id', auth, remove);

module.exports = router;
