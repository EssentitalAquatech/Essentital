






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

// // ✅ Response interceptor for handling errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
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




//uper vala sahi hai buffer image ke liye












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

// ✅ DEALER IMAGE URL BUILDER
export const getDealerImageUrl = (dealerId) => {
  if (!dealerId) return "/no-image.png";
  return `${BASE_URL.replace(/\/$/, "")}/api/dealers/${dealerId}/image`;
};



// ✅ GET IMAGE URLs for buffers
export const getAgentImage = (agentId, imageType) => {
  return `${API_URL}/api/images/${agentId}/${imageType}`;
};

export const getFarmerImage = (farmerId) => {
  return `${API_URL}/api/images/farmer/photo/${farmerId}`;
};

export const getPondImage = (pondId) => {
  return `${API_URL}/api/images/pond/image/${pondId}`;
};

export const getDealerImage = (dealerId) => {
  return `${API_URL}/api/images/dealer/image/${dealerId}`;
};

export const getPondFile = (pondId, fileIndex) => {
  return `${API_URL}/api/images/pond/file/${pondId}/${fileIndex}`;
};

export const getFishFile = (pondId, fileIndex) => {
  return `${API_URL}/api/images/fish/file/${pondId}/${fileIndex}`;
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
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// ==============================================
// DEALER API FUNCTIONS - ADD THESE
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