






import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";
const BASE_URL = import.meta.env.VITE_BASE_URL || API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// ✅ UPDATED & IMPROVED IMAGE URL BUILDER
export const getImageUrl = (path) => {
  // fallback image
  if (!path) return "/profile.png";

  // already full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // normalize path - remove leading slash
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Use BASE_URL which is now properly defined
  return `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
};

// Export for use in other components
export { BASE_URL };
export default api;

// //ye uper vala  sahi hai 




















// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";
// const BASE_URL = import.meta.env.VITE_BASE_URL || API_URL;

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: false,
// });

// // ✅ UPDATED & IMPROVED IMAGE URL BUILDER
// export const getImageUrl = (path) => {
//   // fallback image
//   if (!path || path.trim() === "") return "/profile.png";

//   // already full URL
//   if (path.startsWith("http://") || path.startsWith("https://")) {
//     return path;
//   }

//   // Check if path already has uploads prefix
//   let cleanPath = path;
//   if (cleanPath.startsWith("uploads/")) {
//     cleanPath = cleanPath.replace(/^uploads\//, '');
//   }

//   // Use BASE_URL
//   return `${BASE_URL.replace(/\/$/, "")}/uploads/${cleanPath}`;
// };

// // Export for use in other components
// export { BASE_URL };
// export default api;