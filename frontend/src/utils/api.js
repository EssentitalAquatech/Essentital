




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








//second time


// import axios from "axios";

// export const API_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:2008";

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: false,
// });

// /* ===============================
//    🔐 REQUEST INTERCEPTOR
//    - Har request me token attach
// ================================ */
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* ===============================
//    🚨 RESPONSE INTERCEPTOR
//    - Token expire → logout
// ================================ */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.clear();
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// /* ===============================
//    🖼️ SAFE IMAGE URL BUILDER
// ================================ */
// export const getImageUrl = (path) => {
//   if (!path) return "/profile.png";

//   if (path.startsWith("http://") || path.startsWith("https://")) {
//     return path;
//   }

//   const cleanPath = path.startsWith("/") ? path.slice(1) : path;

//   return `${API_URL.replace(/\/$/, "")}/${cleanPath}`;
// };

// export default api;















// import axios from "axios";

// export const API_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:2008";

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: false,
// });

// /* ===============================
//    🔐 REQUEST INTERCEPTOR
//    - Har request me token attach
// ================================ */
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* ===============================
//    🚨 RESPONSE INTERCEPTOR
//    - Token expire → logout
// ================================ */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.clear();
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// /* ===============================
//    🖼️ SAFE IMAGE URL BUILDER
// ================================ */
// export const getImageUrl = (path) => {
//   if (!path) return "/profile.png";

//   // अगर पहले से ही full URL है
//   if (path.startsWith("http://") || path.startsWith("https://")) {
//     return path;
//   }

//   // अगर path में "uploads/" पहले से है
//   if (path.includes("uploads/")) {
//     // पहले से "uploads/" है तो direct use करो
//     return `${API_URL.replace(/\/$/, "")}/${path}`;
//   }

//   // नहीं तो सामान्य तरीके से
//   const cleanPath = path.startsWith("/") ? path.slice(1) : path;
//   return `${API_URL.replace(/\/$/, "")}/${cleanPath}`;
// };

// export default api;





export const getImageUrl = (path) => {
  if (!path) return "/profile.png";
  
  // Agar already full URL hai
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  // Agar path me pehle se "uploads/" hai toh direct use karo
  if (path.includes("uploads/")) {
    // Extra "/uploads/" na add karein
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${API_URL.replace(/\/$/, "")}/${cleanPath}`;
  }
  
  // Agar sirf filename hai toh "uploads/" prefix add karo
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_URL.replace(/\/$/, "")}/uploads/${cleanPath}`;
};