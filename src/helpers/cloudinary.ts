import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const Cloudinary = {
  uploadDocument: async (localFilePath: string) => {
    if (!localFilePath) return null;

    try {
      const pdf = await cloudinary.uploader
        .upload(localFilePath, {
          folder: "Mira",
          quality: "auto",
        })
        .catch((error) => {
          console.log("CLOUDINARY upload ERROR : ", error);
        });

      console.log("Cloudinary : ", pdf);

      return pdf;
    } catch (error) {
      fs.unlinkSync(localFilePath);

      console.log("CLOUDINARY upload ERROR : ", error);

      return null;
    }
  },
};
