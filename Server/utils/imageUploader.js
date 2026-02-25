const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, width, height) => {
  return await cloudinary.uploader.upload(file.tempFilePath, {
    folder: folder,
    width: width,
    height: height,
    crop: "scale",
  });
};
