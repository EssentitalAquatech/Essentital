






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

// //ye uper vala  sahi hai 










import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";
const BASE_URL = import.meta.env.VITE_BASE_URL || API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ UPDATED IMAGE URL BUILDER FOR BUFFER IMAGES
export const getImageUrl = (userId, imageType = "profile") => {
  if (!userId) return "/profile.png";
  
  // ✅ New format: /api/images/:userId/:imageType
  return `${BASE_URL.replace(/\/$/, "")}/api/images/${userId}/${imageType}`;
};

// ✅ OLD PATH SUPPORT (backward compatibility)
export const getLegacyImageUrl = (path) => {
  if (!path) return "/profile.png";

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
};

// ✅ Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// ✅ Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { BASE_URL };
export default api;