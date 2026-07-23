const router = require('express').Router();
const { getAbout, upsertAbout } = require('./about.controller');
const auth = require('../../middlewares/auth.middleware');
const { requireFields } = require('../../middlewares/validate.middleware');

router.get('/', getAbout);
router.put(
  '/',
  auth,
  requireFields(['headline', 'bio', 'humility', 'ambition', 'vision']),
  upsertAbout
);

module.exports = router;
