




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

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getImageUrl = (path) => {
  if (!path) return "/profile.png";

  // already full url
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path.replace("http://", "https://");
  }

  // remove starting slash
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // final image url
  return `${BASE_URL}/${cleanPath}`;
};

export default API_URL;
