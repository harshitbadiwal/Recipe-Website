const { v2: cloudinary } = require('cloudinary');
const config = require('../config/env.config');

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

/**
 * Upload binary Buffer to Cloudinary via stream
 * @param {Buffer} fileBuffer - The binary image buffer
 * @param {String} folder - Cloudinary destination folder
 * @returns {Promise<Object>} Upload result object containing url, public_id, format, width, height
 */
const uploadToCloudinary = (fileBuffer, folder = 'recipe_website') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary by public_id
 * @param {String} publicId
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
