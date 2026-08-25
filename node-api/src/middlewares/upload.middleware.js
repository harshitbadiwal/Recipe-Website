const multer = require('multer');
const { AppError } = require('../utils/apiError');
const HTTP_STATUS = require('../constants/httpStatusCodes');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Only image files (jpeg, png, webp, gif) are allowed!', HTTP_STATUS.BAD_REQUEST),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size
  },
});

module.exports = upload;
