




// import axios from "axios";

// export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: false,
// });

// // ✅ SAFE IMAGE URL BUILDER (REPLACE ONLY THIS)
// export const getImageUrl = (path) => {
//   // fallback image
//   if (!path) return "/profile.png";

//   // already full URL
//   if (path.startsWith("http://") || path.startsWith("https://")) {
//     return path;
//   }

//   // normalize path
//   const cleanPath = path.startsWith("/") ? path.slice(1) : path;

//   return `${API_URL.replace(/\/$/, "")}/${cleanPath}`;
// };

// export default api;





import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// ✅ UPDATED: SMART IMAGE URL BUILDER
export const getImageUrl = (path) => {
  if (!path || path === "/profile.png") {
    return "/profile.png"; // fallback image
  }

  // If path already contains "uploads/" (from database)
  if (path.includes("uploads/")) {
    // Remove any leading slashes or "uploads/" duplicates
    let cleanPath = path.replace(/^\/+/, "");
    if (cleanPath.startsWith("uploads/")) {
      cleanPath = cleanPath.replace("uploads/", "");
    }
    return `${API_URL}/uploads/${cleanPath}`;
  }

  // If it's a relative path from database
  if (path.startsWith("uploads/")) {
    return `${API_URL}/${path}`;
  }

  // If it's a filename only (from MongoDB)
  return `${API_URL}/uploads/${path}`;
};

export default api;
