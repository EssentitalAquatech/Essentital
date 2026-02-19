







//niche vala sahi hai 



// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";
// const BASE_URL = import.meta.env.VITE_BASE_URL || API_URL;

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: false,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ UPDATED IMAGE URL BUILDER FOR BUFFER IMAGES
// export const getImageUrl = (userId, imageType = "profile") => {
//   if (!userId) return "/profile.png";
  
//   // ✅ New format: /api/images/:userId/:imageType
//   return `${BASE_URL.replace(/\/$/, "")}/api/images/${userId}/${imageType}`;
// };

// // ✅ DEALER IMAGE URL BUILDER
// export const getDealerImageUrl = (dealerId) => {
//   if (!dealerId) return "/no-image.png";
//   return `${BASE_URL.replace(/\/$/, "")}/api/dealers/${dealerId}/image`;
// };

// // ✅ FIXED: GET IMAGE URLs for buffers
// export const getAgentImage = (agentId, imageType) => {
//   return `${API_URL}/api/images/${agentId}/${imageType}`;
// };

// export const getFarmerImage = (farmerId) => {
//   return `${API_URL}/api/images/farmer/photo/${farmerId}`;
// };

// export const getPondImage = (pondId) => {
//   return `${API_URL}/api/images/farmer/pond/image/${pondId}`;
// };

// export const getDealerImage = (dealerId) => {
//   return `${API_URL}/api/dealers/${dealerId}/image`;
// };

// export const getPondFile = (pondId, fileIndex) => {
//   return `${API_URL}/api/images/farmer/pond/file/${pondId}/${fileIndex}`;
// };

// export const getFishFile = (pondId, fileIndex) => {
//   return `${API_URL}/api/images/farmer/fish/file/${pondId}/${fileIndex}`;
// };

// // ✅ ADD SELFIE URL BUILDER FUNCTION
// export const getPondSelfie = (pondId) => {
//   if (!pondId) return "/profile.png";
//   return `${API_URL}/api/images/pond/selfie/${pondId}`;
// };

// // ✅ ADD BUFFER TO BASE64 CONVERSION HELPER
// export const bufferToBase64 = (bufferData) => {
//   if (!bufferData) return "/profile.png";
  
//   try {
//     // If it's already a base64 string or URL
//     if (typeof bufferData === 'string') {
//       if (bufferData.startsWith('data:')) {
//         return bufferData;
//       }
//       // Try to parse as base64
//       return `data:image/jpeg;base64,${bufferData}`;
//     }
    
//     // If it's a Buffer object
//     if (bufferData.data && Array.isArray(bufferData.data)) {
//       const base64 = btoa(
//         new Uint8Array(bufferData.data)
//           .reduce((data, byte) => data + String.fromCharCode(byte), '')
//       );
//       return `data:image/jpeg;base64,${base64}`;
//     }
    
//     // If it's an array (Buffer array)
//     if (Array.isArray(bufferData)) {
//       const base64 = btoa(
//         new Uint8Array(bufferData)
//           .reduce((data, byte) => data + String.fromCharCode(byte), '')
//       );
//       return `data:image/jpeg;base64,${base64}`;
//     }
    
//     // If it's a direct buffer
//     if (bufferData instanceof Uint8Array || bufferData.buffer) {
//       const base64 = btoa(
//         new Uint8Array(bufferData)
//           .reduce((data, byte) => data + String.fromCharCode(byte), '')
//       );
//       return `data:image/jpeg;base64,${base64}`;
//     }
//   } catch (error) {
//     console.error("Buffer conversion error:", error);
//   }
  
//   return "/profile.png";
// };

// // ✅ OLD PATH SUPPORT (backward compatibility)
// export const getLegacyImageUrl = (path) => {
//   if (!path) return "/profile.png";

//   if (path.startsWith("http://") || path.startsWith("https://")) return path;

//   const cleanPath = path.startsWith("/") ? path.slice(1) : path;
//   return `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
// };

// // ✅ Helper function to get auth headers
// export const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   return {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// };

// // ✅ Request interceptor for adding token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ==============================================
// // DEALER API FUNCTIONS
// // ==============================================

// // ✅ ADD DEALER
// export const addDealer = async (dealerData) => {
//   try {
//     const formData = new FormData();
//     formData.append('name', dealerData.name);
//     formData.append('contact', dealerData.contact);
//     formData.append('gstNumber', dealerData.gstNumber);
//     formData.append('shopAddress', dealerData.shopAddress);
//     formData.append('userId', dealerData.userId);
//     formData.append('image', dealerData.image);
    
//     const response = await api.post('/api/dealers', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Error adding dealer:', error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// // ✅ GET DEALERS
// export const getDealers = async (userId) => {
//   try {
//     const response = await api.get('/api/dealers', {
//       params: { userId }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching dealers:', error);
//     throw error;
//   }
// };

// // ✅ GET DEALER BY ID
// export const getDealerById = async (id) => {
//   try {
//     const response = await api.get(`/api/dealers/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching dealer:', error);
//     throw error;
//   }
// };

// // ✅ UPDATE DEALER
// export const updateDealer = async (id, dealerData) => {
//   try {
//     const formData = new FormData();
//     if (dealerData.name) formData.append('name', dealerData.name);
//     if (dealerData.contact) formData.append('contact', dealerData.contact);
//     if (dealerData.gstNumber) formData.append('gstNumber', dealerData.gstNumber);
//     if (dealerData.shopAddress) formData.append('shopAddress', dealerData.shopAddress);
//     if (dealerData.userId) formData.append('userId', dealerData.userId);
//     if (dealerData.image) formData.append('image', dealerData.image);
    
//     const response = await api.put(`/api/dealers/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Error updating dealer:', error);
//     throw error;
//   }
// };

// // ✅ DELETE DEALER
// export const deleteDealer = async (id) => {
//   try {
//     const response = await api.delete(`/api/dealers/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting dealer:', error);
//     throw error;
//   }
// };

// // ✅ GET DEALER IMAGE
// export const fetchDealerImage = async (dealerId) => {
//   try {
//     const response = await api.get(`/api/dealers/${dealerId}/image`, {
//       responseType: 'blob'
//     });
//     return URL.createObjectURL(response.data);
//   } catch (error) {
//     console.error('Error fetching dealer image:', error);
//     return null;
//   }
// };

// export { BASE_URL };
// export default api;



// ////ye uper vala sahi hai bina coludinary 














// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";
// const BASE_URL = import.meta.env.VITE_BASE_URL || API_URL;

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: false,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ SIMPLIFIED: Profile image helper
// export const getProfileImage = (userId) => {
//   if (!userId) return "/profile.png";
//   // Cloudinary URLs are now stored directly in the user object
//   return `${BASE_URL}/api/images/${userId}/profile`;
// };

// // ✅ REMOVED all buffer-related functions:
// // - bufferToBase64 (not needed)
// // - getPondSelfie (use direct URL)
// // - getPondImage (use direct URL)
// // - getFarmerImage (use direct URL)

// // ✅ OLD PATH SUPPORT (backward compatibility)
// export const getLegacyImageUrl = (path) => {
//   if (!path) return "/profile.png";
//   if (path.startsWith("http://") || path.startsWith("https://")) return path;
//   const cleanPath = path.startsWith("/") ? path.slice(1) : path;
//   return `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
// };

// // ✅ Helper function to get auth headers
// export const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   return {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// };

// // ✅ Request interceptor for adding token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ==============================================
// // DEALER API FUNCTIONS (unchanged)
// // ==============================================

// export const addDealer = async (dealerData) => {
//   try {
//     const formData = new FormData();
//     formData.append('name', dealerData.name);
//     formData.append('contact', dealerData.contact);
//     formData.append('gstNumber', dealerData.gstNumber);
//     formData.append('shopAddress', dealerData.shopAddress);
//     formData.append('userId', dealerData.userId);
//     formData.append('image', dealerData.image);
    
//     const response = await api.post('/api/dealers', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Error adding dealer:', error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// export const getDealers = async (userId) => {
//   try {
//     const response = await api.get('/api/dealers', {
//       params: { userId }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching dealers:', error);
//     throw error;
//   }
// };

// export const getDealerById = async (id) => {
//   try {
//     const response = await api.get(`/api/dealers/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching dealer:', error);
//     throw error;
//   }
// };

// export const updateDealer = async (id, dealerData) => {
//   try {
//     const formData = new FormData();
//     if (dealerData.name) formData.append('name', dealerData.name);
//     if (dealerData.contact) formData.append('contact', dealerData.contact);
//     if (dealerData.gstNumber) formData.append('gstNumber', dealerData.gstNumber);
//     if (dealerData.shopAddress) formData.append('shopAddress', dealerData.shopAddress);
//     if (dealerData.userId) formData.append('userId', dealerData.userId);
//     if (dealerData.image) formData.append('image', dealerData.image);
    
//     const response = await api.put(`/api/dealers/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Error updating dealer:', error);
//     throw error;
//   }
// };

// export const deleteDealer = async (id) => {
//   try {
//     const response = await api.delete(`/api/dealers/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting dealer:', error);
//     throw error;
//   }
// };

// export const fetchDealerImage = async (dealerId) => {
//   try {
//     const response = await api.get(`/api/dealers/${dealerId}/image`, {
//       responseType: 'blob'
//     });
//     return URL.createObjectURL(response.data);
//   } catch (error) {
//     console.error('Error fetching dealer image:', error);
//     return null;
//   }
// };

// export { BASE_URL };
// export default api;






//cludinary vala sahi hai but image nhi a rhi hai 


















import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ SIMPLE PROFILE IMAGE HELPER
export const getProfileImage = (userId) => {
  if (!userId) return "/profile.png";
  return `${API_URL}/api/images/${userId}/profile`;
};

// ✅ MAIN IMAGE HELPER - DIRECT CLOUDINARY URL SUPPORT
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/profile.png";
  
  // Agar already full URL hai (Cloudinary, HTTP, HTTPS, Data URL)
  if (imagePath.startsWith('http://') || 
      imagePath.startsWith('https://') || 
      imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Agar relative path hai to backend se jodo
  if (imagePath.startsWith('/')) {
    return `${API_URL}${imagePath}`;
  }
  
  return `${API_URL}/${imagePath}`;
};

// Auth interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Dealer APIs (unchanged)
export const addDealer = async (dealerData) => {
  try {
    const formData = new FormData();
    formData.append('name', dealerData.name);
    formData.append('contact', dealerData.contact);
    formData.append('gstNumber', dealerData.gstNumber);
    formData.append('shopAddress', dealerData.shopAddress);
    formData.append('userId', dealerData.userId);
    formData.append('image', dealerData.image);
    
    const response = await api.post('/api/dealers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding dealer:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getDealers = async (userId) => {
  try {
    const response = await api.get('/api/dealers', { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching dealers:', error);
    throw error;
  }
};

export const getDealerById = async (id) => {
  try {
    const response = await api.get(`/api/dealers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dealer:', error);
    throw error;
  }
};

export const updateDealer = async (id, dealerData) => {
  try {
    const formData = new FormData();
    if (dealerData.name) formData.append('name', dealerData.name);
    if (dealerData.contact) formData.append('contact', dealerData.contact);
    if (dealerData.gstNumber) formData.append('gstNumber', dealerData.gstNumber);
    if (dealerData.shopAddress) formData.append('shopAddress', dealerData.shopAddress);
    if (dealerData.userId) formData.append('userId', dealerData.userId);
    if (dealerData.image) formData.append('image', dealerData.image);
    
    const response = await api.put(`/api/dealers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating dealer:', error);
    throw error;
  }
};

export const deleteDealer = async (id) => {
  try {
    const response = await api.delete(`/api/dealers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting dealer:', error);
    throw error;
  }
};

export default api;