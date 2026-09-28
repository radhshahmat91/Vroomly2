const cloudinary = require('cloudinary').v2;

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Uploads a file buffer (from multer memoryStorage) to Cloudinary and
 * resolves with the secure URL. Rejects with a clear, catchable error if
 * Cloudinary credentials were never configured, instead of letting the
 * SDK throw an opaque error deep in a promise chain.
 */
function uploadBuffer(buffer, folder = 'vroomly') {
  return new Promise((resolve, reject) => {
    if (!isConfigured) {
      return reject(
        new Error('Image uploads are not configured on this server (missing Cloudinary credentials).')
      );
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

module.exports = { cloudinary, isConfigured, uploadBuffer };
