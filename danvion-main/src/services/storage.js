import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseClient";

// Upload a File object to Firebase Storage and return a public URL
export async function uploadImage(file, folder = "images") {
  if (!file) throw new Error("No file provided");

  if (!storage) {
    throw new Error(
      "Firebase storage is not configured. Check your Firebase web app config.",
    );
  }

  const safeName = file.name.replace(/\s+/g, "_");
  const filename = `${folder}/${Date.now()}_${safeName}`;
  const fileRef = ref(storage, filename);

  await uploadBytes(fileRef, file, {
    contentType: file.type || "application/octet-stream",
  });

  return getDownloadURL(fileRef);
}
