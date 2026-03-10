/**
 * Danvion Admin - Storage Service
 *
 * File upload to PHP API
 */

import apiClient from "./apiClient";

/**
 * Upload image file
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder name (not used in current implementation)
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadImage = async (file, folder = "general") => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only images are allowed.");
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("File size exceeds 5MB limit");
  }

  // Create FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  try {
    // Upload to PHP API
    const response = await apiClient.upload("/admin/upload.php", formData);

    if (response.success && response.data?.url) {
      return response.data.url;
    } else {
      throw new Error(response.message || "Upload failed");
    }
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};

export default {
  uploadImage,
};
