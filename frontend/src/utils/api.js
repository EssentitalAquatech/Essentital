


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

// // utils/api.js - Update these functions

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
// // DEALER API FUNCTIONS - ADD THESE
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



////ye uper vala sahi hai 






















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

// ✅ NEW: GridFS Image URL Builder
export const getGridFSImageUrl = (fileId, bucketType = 'documents') => {
  if (!fileId) return "/profile.png";
  return `${API_URL}/api/farmers/image/${bucketType}/${fileId}`;
};

// ✅ Helper to get image from farmer/pond object
export const getImageFromObject = (obj, type = 'photo') => {
  if (!obj) return "/profile.png";
  
  // Check for URL first (GridFS)
  if (type === 'photo' && obj.photoUrl) {
    return obj.photoUrl.startsWith('http') ? obj.photoUrl : `${API_URL}${obj.photoUrl}`;
  }
  if (type === 'pondImage' && obj.pondImageUrl) {
    return obj.pondImageUrl.startsWith('http') ? obj.pondImageUrl : `${API_URL}${obj.pondImageUrl}`;
  }
  if (type === 'selfie' && obj.uploadSelfieUrl) {
    return obj.uploadSelfieUrl.startsWith('http') ? obj.uploadSelfieUrl : `${API_URL}${obj.uploadSelfieUrl}`;
  }
  
  // Fallback to old buffer format (for backward compatibility)
  if (obj[type]) {
    return bufferToBase64(obj[type]);
  }
  
  return "/profile.png";
};

// ✅ UPDATED IMAGE URL BUILDER FOR BUFFER IMAGES (backward compatibility)
export const getImageUrl = (userId, imageType = "profile") => {
  if (!userId) return "/profile.png";
  return `${BASE_URL.replace(/\/$/, "")}/api/images/${userId}/${imageType}`;
};

// ✅ DEALER IMAGE URL BUILDER
export const getDealerImageUrl = (dealerId) => {
  if (!dealerId) return "/no-image.png";
  return `${BASE_URL.replace(/\/$/, "")}/api/dealers/${dealerId}/image`;
};

// ✅ FIXED: GET IMAGE URLs for buffers
export const getAgentImage = (agentId, imageType) => {
  return `${API_URL}/api/images/${agentId}/${imageType}`;
};

// ✅ NEW: GridFS specific functions
export const getFarmerPhotoUrl = (farmerId) => {
  return `${API_URL}/api/farmers/photo/${farmerId}`;
};

export const getPondImageUrl = (pondId) => {
  return `${API_URL}/api/farmers/pond/image/${pondId}`;
};

export const getPondSelfieUrl = (pondId) => {
  return `${API_URL}/api/farmers/pond/selfie/${pondId}`;
};

export const getPondFileUrl = (fileId) => {
  return `${API_URL}/api/farmers/image/documents/${fileId}`;
};

export const getFishFileUrl = (fileId) => {
  return `${API_URL}/api/farmers/image/documents/${fileId}`;
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

// ✅ BUFFER TO BASE64 (for backward compatibility only)
export const bufferToBase64 = (bufferData) => {
  if (!bufferData) return "/profile.png";
  
  try {
    if (typeof bufferData === 'string') {
      if (bufferData.startsWith('data:')) return bufferData;
      return `data:image/jpeg;base64,${bufferData}`;
    }
    
    if (bufferData.data && Array.isArray(bufferData.data)) {
      const base64 = btoa(
        new Uint8Array(bufferData.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:image/jpeg;base64,${base64}`;
    }
    
    if (Array.isArray(bufferData)) {
      const base64 = btoa(
        new Uint8Array(bufferData)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:image/jpeg;base64,${base64}`;
    }
    
    if (bufferData instanceof Uint8Array || bufferData.buffer) {
      const base64 = btoa(
        new Uint8Array(bufferData)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:image/jpeg;base64,${base64}`;
    }
  } catch (error) {
    console.error("Buffer conversion error:", error);
  }
  
  return "/profile.png";
};

// ==============================================
// DEALER API FUNCTIONS
// ==============================================

// ✅ ADD DEALER
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
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error adding dealer:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ✅ GET DEALERS
export const getDealers = async (userId) => {
  try {
    const response = await api.get('/api/dealers', {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dealers:', error);
    throw error;
  }
};

// ✅ GET DEALER BY ID
export const getDealerById = async (id) => {
  try {
    const response = await api.get(`/api/dealers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dealer:', error);
    throw error;
  }
};

// ✅ UPDATE DEALER
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
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating dealer:', error);
    throw error;
  }
};

// ✅ DELETE DEALER
export const deleteDealer = async (id) => {
  try {
    const response = await api.delete(`/api/dealers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting dealer:', error);
    throw error;
  }
};

// ✅ GET DEALER IMAGE
export const fetchDealerImage = async (dealerId) => {
  try {
    const response = await api.get(`/api/dealers/${dealerId}/image`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Error fetching dealer image:', error);
    return null;
  }
};

export { BASE_URL };
export default api;