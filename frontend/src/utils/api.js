




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









//ye uper vala sahi hai 






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
//   if (!path) return "/profile.png";

//   // already full URL
//   if (path.startsWith("http://") || path.startsWith("https://")) {
//     return path;
//   }

//   // normalize path - remove leading slash
//   const cleanPath = path.startsWith("/") ? path.slice(1) : path;

//   // Use BASE_URL which is now properly defined
//   return `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
// };

// // Export for use in other components
// export { BASE_URL };
// export default api;

//ye uper vala bhi sahi hai 












import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";
const BASE_URL = import.meta.env.VITE_BASE_URL || API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// ✅ UPDATED IMAGE URL BUILDER FOR BINARY FILES
export const getImageUrl = (path) => {
  // If it's already a full URL or data URL
  if (!path) return "/profile.png";
  
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // If it's an API path for binary files
  if (path.startsWith("/api/")) {
    return `${BASE_URL}${path}`;
  }

  // For regular uploaded files (if you still have some)
  if (path.startsWith("uploads/")) {
    return `${BASE_URL}/${path}`;
  }

  // Default fallback
  return "/profile.png";
};

// ✅ Helper to get farmer photo URL
export const getFarmerPhotoUrl = (farmerId) => {
  if (!farmerId) return "/profile.png";
  return `${BASE_URL}/api/farmers/file/${farmerId}/photo`;
};

// ✅ Helper to get pond image URL
export const getPondImageUrl = (farmerId, pondId) => {
  if (!farmerId || !pondId) return "/pond-placeholder.png";
  return `${BASE_URL}/api/farmers/file/${farmerId}/pond-image?pondId=${pondId}`;
};

// ✅ Helper to get pond file URL
export const getPondFileUrl = (farmerId, pondId, index) => {
  return `${BASE_URL}/api/farmers/file/${farmerId}/pond-file?pondId=${pondId}&index=${index}`;
};

// ✅ Helper to get fish file URL
export const getFishFileUrl = (farmerId, pondId, index) => {
  return `${BASE_URL}/api/farmers/file/${farmerId}/fish-file?pondId=${pondId}&index=${index}`;
};

// Export for use in other components
export { BASE_URL };
export default api;