import multer from "multer";

const storage = multer.memoryStorage();

const imageFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, JPG, and PNG formats are allowed"), false);
  }
  cb(null, true);
};

export const uploadImages = (fieldNames: string[] = []) => {
  return multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).fields(fieldNames.map(name => ({ name, maxCount: 5 })));
};
