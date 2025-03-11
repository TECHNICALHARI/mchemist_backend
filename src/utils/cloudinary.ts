import { v2 as cloudinary } from "cloudinary";
import { appConfig } from "../config/config";

cloudinary.config({
  cloud_name: appConfig.CLOUDINARY_CLOUD_NAME,
  api_key: appConfig.CLOUDINARY_API_KEY,
  api_secret: appConfig.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (buffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `ecommerce/${folder}` },
      (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(new Error("Image upload failed"));
        }
        resolve(uploadResult?.secure_url || "");
      }
    );
    stream.end(buffer);
  });
};

// Process multiple images dynamically
export const uploadMultipleToCloudinary = async (
  files: { [key: string]: Express.Multer.File[] },
  folder: string
): Promise<{ [key: string]: string[] }> => {
  const uploadedImages: { [key: string]: string[] } = {};

  for (const key in files) {
    uploadedImages[key] = await Promise.all(
      files[key].map(async (file) => await uploadToCloudinary(file.buffer, folder))
    );
  }
  return uploadedImages;
};
