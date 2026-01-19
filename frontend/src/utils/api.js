




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







import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://essentital.onrender.com',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    if (config.data instanceof FormData) {
      console.log('📦 Request Data: FormData');
    } else {
      console.log('📦 Request Data:', config.data);
    }
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error('❌ Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Helper function to get image URL
export const getImageUrl = (path) => {
  if (!path) return '/profile.png';
  if (path.startsWith('http')) return path;
  if (path.startsWith('uploads/')) {
    return `${process.env.REACT_APP_API_URL || 'https://essentital.onrender.com'}/${path}`;
  }
  return `${process.env.REACT_APP_API_URL || 'https://essentital.onrender.com'}/api/images/${path}`;
};

export default api;