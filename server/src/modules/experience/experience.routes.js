const router = require('express').Router();
const crudFactory = require('../../utils/crudFactory');
const auth = require('../../middlewares/auth.middleware');
const { requireFields } = require('../../middlewares/validate.middleware');

const { getAll, getOne, create, update, remove } = crudFactory('experience', {
  orderBy: { order: 'asc' },
});

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', auth, requireFields(['title', 'company', 'startDate']), create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
