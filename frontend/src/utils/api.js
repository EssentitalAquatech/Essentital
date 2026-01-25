




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

// ✅ FIXED: Image URL builder that handles different path formats
export const getImageUrl = (path) => {
  // fallback image
  if (!path || path.trim() === "") return "/profile.png";

  // already full URL (http:// or https://)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    // If it's already a full URL, return as-is
    console.log(`Already full URL: ${path}`);
    return path;
  }

  // Handle image API routes (like /api/images/{userId}/profile)
  if (path.startsWith("/api/images/") || path.startsWith("api/images/")) {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const fullUrl = `${API_URL}/${cleanPath}`;
    console.log(`Image API URL: ${fullUrl}`);
    return fullUrl;
  }

  // Handle uploads paths
  let cleanPath = path;
  
  // Remove leading slash if exists
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.slice(1);
  }
  
  // Check if it already has uploads prefix
  if (cleanPath.startsWith("uploads/")) {
    // If it already has uploads/, use as-is
    const fullUrl = `${BASE_URL}/${cleanPath}`;
    console.log(`Uploads path (already correct): ${fullUrl}`);
    return fullUrl;
  } else {
    // If it doesn't have uploads/, add it
    const fullUrl = `${BASE_URL}/uploads/${cleanPath}`;
    console.log(`Uploads path (added prefix): ${fullUrl}`);
    return fullUrl;
  }
};

// For debugging
console.log("BASE_URL:", BASE_URL);
console.log("API_URL:", API_URL);

// Export for use in other components
export { BASE_URL };
export default api;