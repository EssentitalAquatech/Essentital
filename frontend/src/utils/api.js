




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

// ✅ UPDATED & FIXED IMAGE URL BUILDER
export const getImageUrl = (path) => {
  // fallback image
  if (!path || path.trim() === "") return "/profile.png";

  // already full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Handle different path formats
  let cleanPath = path;
  
  // Remove 'uploads/' if it appears twice
  if (path.includes("uploads/uploads/")) {
    cleanPath = path.replace("uploads/uploads/", "uploads/");
  }
  
  // Remove leading slash if exists
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.slice(1);
  }

  // Ensure we're not double adding uploads
  if (!cleanPath.startsWith("uploads/") && !cleanPath.startsWith("api/")) {
    cleanPath = `uploads/${cleanPath}`;
  }

  // Construct full URL
  const fullUrl = `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
  console.log(`Image URL constructed: ${fullUrl} from original: ${path}`);
  return fullUrl;
};

// For debugging
console.log("BASE_URL:", BASE_URL);
console.log("API_URL:", API_URL);

// Export for use in other components
export { BASE_URL };
export default api;