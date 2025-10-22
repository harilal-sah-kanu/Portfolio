import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Upload file buffer to ImageKit
export const uploadToImageKit = async (
  fileBuffer,
  fileName,
  folder = "portfolio"
) => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer, // required
      fileName: fileName, // required
      folder: folder,
      useUniqueFileName: true,
      tags: ["portfolio"],
    });
    return result;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
};

// Delete file from ImageKit
export const deleteFromImageKit = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("Error deleting from ImageKit:", error);
  }
};

// Get authentication parameters for client-side upload
export const getImageKitAuthParams = () => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  return authenticationParameters;
};

export default imagekit;
