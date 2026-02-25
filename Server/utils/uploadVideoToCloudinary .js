const cloudinary = require("cloudinary").v2;

exports.uploadVideoToCloudinary = async (file, folder) => {
  if (!file) {
    throw new Error("No video file provided");
  }

  const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error("Invalid video format");
  }

  return await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
    resource_type: "video",
    chunk_size: 6 * 1024 * 1024, // for large videos
  });
};
