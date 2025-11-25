let storage;
let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  if (process.env.CLOUD_NAME && process.env.CLOUD_API && process.env.CLOUD_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API,
      api_secret: process.env.CLOUD_API_SECRET,
    });

    storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'wanderlust_DEV',
        allowed_formats: ['png', 'jpg', 'jpeg'],
      },
    });
  } else {
    throw new Error('Cloudinary env not configured');
  }
  module.exports = { cloudinary, storage };
} catch (err) {
  const multer = require('multer');
  const path = require('path');
  const uploadPath = path.join(__dirname, 'public', 'uploads');
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  module.exports = { storage };
}
