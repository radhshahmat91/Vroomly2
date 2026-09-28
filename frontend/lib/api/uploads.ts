import { api } from "../apiClient";

export async function uploadImage(file: File, folder: "cars" | "avatars" = "cars") {
  const form = new FormData();
  form.append("image", file);
  form.append("folder", folder);
  const { data } = await api.post<{ success: true; url: string }>("/uploads/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

export async function uploadImages(files: File[], folder: "cars" | "avatars" = "cars") {
  const form = new FormData();
  files.forEach((f) => form.append("images", f));
  form.append("folder", folder);
  const { data } = await api.post<{ success: true; urls: string[] }>("/uploads/images", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.urls;
}
