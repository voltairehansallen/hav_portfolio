const router = require('express').Router();
const { upload } = require('../../config/upload');
const auth = require('../../middlewares/auth.middleware');
const { uploadFile, listMedia, deleteMedia } = require('./uploads.controller');

router.post('/', auth, upload.single('file'), uploadFile);
router.get('/', auth, listMedia);
router.delete('/:id', auth, deleteMedia);

module.exports = router;
