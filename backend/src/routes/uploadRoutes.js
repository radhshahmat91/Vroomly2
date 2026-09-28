const express = require('express');
const { uploadImage, uploadImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);
router.post('/image', upload.single('image'), uploadImage);
router.post('/images', upload.array('images', 12), uploadImages);

module.exports = router;
