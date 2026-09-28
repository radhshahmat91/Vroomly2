const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/apiError');
const { uploadBuffer } = require('../config/cloudinary');

// POST /api/uploads/image  (multipart/form-data, field name "image")
// POST /api/uploads/images (multipart/form-data, field name "images", up to 12)
// Used for avatars and car photos alike — the caller decides what to do
// with the returned URL(s).
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file was provided');
  const folder = req.body.folder === 'avatars' ? 'vroomly/avatars' : 'vroomly/cars';
  const url = await uploadBuffer(req.file.buffer, folder);
  res.json({ success: true, url });
});

const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.length) throw new ApiError(400, 'No image files were provided');
  const folder = req.body.folder === 'avatars' ? 'vroomly/avatars' : 'vroomly/cars';
  const urls = await Promise.all(req.files.map((file) => uploadBuffer(file.buffer, folder)));
  res.json({ success: true, urls });
});

module.exports = { uploadImage, uploadImages };
