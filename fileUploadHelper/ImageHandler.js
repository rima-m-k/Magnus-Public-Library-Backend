const multer = require('multer');
const cloudinary = require('./cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const AppError = require('./AppError');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my_folder',
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb( new AppError(422,'Invalid file format. Allowed formats are JPG, JPEG, PNG, and GIF '));
    }
  },
});

module.exports = upload;
