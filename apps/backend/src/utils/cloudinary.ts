import cloudinary from "cloudinary";
import streamifier from "streamifier";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

interface UploadOptions {
  buffer: Buffer;
  publicId: string;
  resourceType?: "image" | "video" | "raw";
}

interface UploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: any; // for additional Cloudinary response fields
}

export const uploader = {
  uploadStreamToCloudinary: ({
    buffer,
    publicId,
    resourceType = "raw",
  }: UploadOptions): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadResult);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  },
};
