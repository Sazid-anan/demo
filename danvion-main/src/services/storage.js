import apiClient from "./apiClient";

// Upload a File object via PHP API and return a public URL.
export async function uploadImage(file, folder = "images") {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await apiClient.upload("/admin/upload.php", formData);
  if (!response?.success || !response?.data?.url) {
    throw new Error(response?.message || "Upload failed");
  }

  return response.data.url;
}
