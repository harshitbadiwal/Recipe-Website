const { uploadToCloudinary } = require('../utils/cloudinary');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const { AppError } = require('../utils/apiError');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class UploadController {
  uploadImage = asyncWrapper(async (req, res) => {
    if (!req.file) {
      throw new AppError('Please select a binary image file to upload', HTTP_STATUS.BAD_REQUEST);
    }

    const folder = req.body.folder || 'recipe_website';
    const result = await uploadToCloudinary(req.file.buffer, folder);

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      'Image uploaded to Cloudinary successfully',
      result
    );
  });
}

module.exports = new UploadController();
