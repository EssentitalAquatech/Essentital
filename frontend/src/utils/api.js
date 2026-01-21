




import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// ✅ SAFE IMAGE URL BUILDER (REPLACE ONLY THIS)
export const getImageUrl = (path) => {
  // fallback image
  if (!path) return "/profile.png";

  // already full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // normalize path
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${API_URL.replace(/\/$/, "")}/${cleanPath}`;
};

export default api;






