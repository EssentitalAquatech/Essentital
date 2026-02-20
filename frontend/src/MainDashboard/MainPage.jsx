


// //buffer ke liye
// import React, { useState, useEffect } from "react";
// // import api from "../utils/api";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./mainPage.css";
// import { getProfileImage } from "../utils/profileImage";
// // jahan tu <img> use kar raha hai
// import api, { getImageUrl } from "../utils/api"; // path check kar le

// // Import Lucide icons
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2, MapPin } from "lucide-react";

// function timeAgo(dateStr, t) {
//   if (!dateStr) return t('notUpdated');
//   const now = new Date();
//   const d = new Date(dateStr);
//   const diffMs = now - d;
//   const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//   if (days === 0) return t('today');
//   if (days === 1) return t('oneDayAgo');
//   return t('daysAgo', { count: days });
// }

// const SYMPTOMS_LIST = [
//   "Erratic swimming", 
//   "Loss of appetite",
//   "Gasping at surface",
//   "Lesions or ulcers",
//   "Fin rot",
//   "Fish Lice",
//   "Discoloration or white patches",
//   "Scale loss",
//   "Swollen abdomen",
//   "Fungal/cotton-like growth",
//   "Flared gills",
//   "Mucus secretion",
//   "Blood spots",
//   "Other"
// ];

// // Helper function to convert buffer to base64 URL
// const bufferToBase64 = (bufferData) => {
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
//   } catch (error) {
//     console.error("Buffer conversion error:", error);
//   }
  
//   return "/profile.png";
// };

// // Helper function for farmer image
// const getFarmerImage = (farmer) => {
//   if (!farmer) return "/profile.png";
  
//   // If photo is a buffer, convert to base64
//   if (farmer.photo) {
//     return bufferToBase64(farmer.photo);
//   }
  
//   // If photo is stored as base64 string in the database
//   if (typeof farmer.photo === 'string' && farmer.photo.startsWith('data:')) {
//     return farmer.photo;
//   }
  
//   return "/profile.png";
// };

// // Helper function for pond image
// const getPondImage = (pond) => {
//   if (!pond) return "/profile.png";
  
//   if (pond.pondImage) {
//     return bufferToBase64(pond.pondImage);
//   }
  
//   if (typeof pond.pondImage === 'string' && pond.pondImage.startsWith('data:')) {
//     return pond.pondImage;
//   }
  
//   return "/profile.png";
// };

// function MainPage() {
//   const { t, i18n } = useTranslation();
//   const username = localStorage.getItem("username") || "User";
//   const photo = localStorage.getItem("photo") || "/profile.png";
//   const userId = localStorage.getItem("userId");

//   const [farmers, setFarmers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [showPondForm, setShowPondForm] = useState(false);
//   const [editingFarmerId, setEditingFarmerId] = useState(null);
//   const [editingPondId, setEditingPondId] = useState(null);
//   const [currentFarmerId, setCurrentFarmerId] = useState(null);
//   const [welcomeMsg, setWelcomeMsg] = useState("");
//   const [isUpdateMode, setIsUpdateMode] = useState(false);

//   // Location states
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   // Loading states
//   const [loading, setLoading] = useState({
//     fetchFarmers: false,
//     addFarmer: false,
//     updateFarmer: false,
//     addPond: false,
//     updatePond: false,
//     deleteFarmer: false,
//     deletePond: false,
//     search: false
//   });
  
//   // Mobile sidebar states
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Farmer form empty state
//   const emptyFarmer = {
//     name: "", contact: "", age: "", gender: "", village: "",
//     pondCount: "0", adhar: "", familyMembers: "", familyOccupation: "",
//     photo: null,
//     photoBuffer: null, // Store existing photo buffer
//   };

//   // Pond form empty state
//   const emptyPond = {
//     // Pond Details
//     pondArea: "", pondAreaUnit: "acre", pondDepth: "", pondImage: null,
//     overflow: "No", receivesSunlight: "Yes", treesOnBanks: "No",
//     neighbourhood: "Agriculture Farm", wastewaterEnters: "No",
//     // Species & Stocking
//     species: "", dateOfStocking: "", qtySeedInitially: "", 
//     currentQty: "", avgSize: ">200gram",
//     // Feed Details
//     feedType: "Market Feed", feedOther: "", feedFreq: "Once a day", 
//     feedQtyPerDay: "", feedTime: "6:00 am-10:00am",
//     recentFeedChanges: "", reducedAppetite: "No",
//     // Water Quality
//     waterTemperature: "", pH: "", DO: "", ammoniaLevel: "Medium", 
//     phytoplanktonLevel: "Medium", waterHardness: "1",
//     algaeBloom: "No", pondWaterColor: "Light Green", sourceOfWater: "Rainwater",
//     // Disease & Symptoms
//     diseaseSymptoms: "No", symptomsObserved: "", symptoms: [],
//     symptomsAffect: "All", fishDeaths: "",
//     // Location
//     latitude: "",
//     longitude: "",
//     // Observation
//     farmObservedDate: "", farmObservedTime: "",
//     // History & Environment
//     lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
//     pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No",
//     // Notes
//     notes: "",
//     // Files
//     pondFiles: [],
//     fishFiles: [],
//     // Store existing buffers
//     pondImageBuffer: null,
//     pondFilesBuffers: [],
//     fishFilesBuffers: []
//   };

//   const [newFarmer, setNewFarmer] = useState(emptyFarmer);
//   const [newPond, setNewPond] = useState(emptyPond);

//   // Check if mobile view
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 991);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMobile && isSidebarOpen && 
//           !event.target.closest('.sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Fetch data
//   useEffect(() => {
//     if (!userId) {
//       console.error("UserId not found in localStorage");
//       return;
//     }
//     fetchFarmers();
//     const savedLang = localStorage.getItem("lang");
//     if (savedLang) i18n.changeLanguage(savedLang);
//   }, [userId]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   const fetchFarmers = async () => {
//     try {
//       setLoading(prev => ({ ...prev, fetchFarmers: true }));
//       const res = await api.get(`/api/farmers/all?userId=${userId}`);
      
//       console.log("Farmers data received:", res.data);
//       setFarmers(res.data || []);
//     } catch (err) {
//       console.error("Fetch Farmers Error:", err);
//       alert("Error fetching farmers: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, fetchFarmers: false }));
//     }
//   };

//   // Convert File to Base64 for preview
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   // Get Location Function
//   const getLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return;
//     }

//     setIsGettingLocation(true);
    
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;
        
//         setLatitude(lat.toString());
//         setLongitude(lng.toString());
//         setNewPond({ ...newPond, latitude: lat.toString(), longitude: lng.toString() });
        
//         setIsGettingLocation(false);
//         // alert("Location captured successfully!");
//       },
//       (error) => {
//         setIsGettingLocation(false);
//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             alert("Location access denied. Please enable location permissions.");
//             break;
//           case error.POSITION_UNAVAILABLE:
//             alert("Location information unavailable.");
//             break;
//           case error.TIMEOUT:
//             alert("Location request timed out.");
//             break;
//           default:
//             alert("An unknown error occurred.");
//             break;
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0
//       }
//     );
//   };

//   // Clear Location
//   const clearLocation = () => {
//     setLatitude("");
//     setLongitude("");
//     setNewPond({ ...newPond, latitude: "", longitude: "" });
//   };

//   // Add Farmer
//   const addFarmer = async () => {
//     // Check required fields
//     if (!newFarmer.name || !newFarmer.contact || !newFarmer.age || 
//         !newFarmer.gender || !newFarmer.adhar || !newFarmer.familyMembers || 
//         !newFarmer.familyOccupation || !newFarmer.village) {
//       return alert("Please fill all required fields: Name, Contact, Age, Gender, Aadhar, Family Members, Family Occupation, Village");
//     }
    
//     if (!newFarmer.photo) {
//       return alert("Farmer photo is required");
//     }
    
//     const formData = new FormData();
    
//     // Add all farmer fields
//     const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
//                          'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
//     farmerFields.forEach(field => {
//       if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
//         formData.append(field, newFarmer[field].toString());
//       }
//     });
    
//     formData.append("userId", userId);
//     formData.append("createdBy", userId);
    
//     // Handle photo
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     } else if (newFarmer.photo) {
//       // If it's a base64 string, convert to blob
//       const base64Response = await fetch(newFarmer.photo);
//       const blob = await base64Response.blob();
//       formData.append("photo", blob, "photo.jpg");
//     }
    
//     // Handle farmer level files
//     if (newFarmer.pondFiles && newFarmer.pondFiles.length > 0) {
//       newFarmer.pondFiles.forEach((file) => {
//         if (file instanceof File) {
//           formData.append("pondFiles", file);
//         }
//       });
//     }
    
//     if (newFarmer.fishFiles && newFarmer.fishFiles.length > 0) {
//       newFarmer.fishFiles.forEach((file) => {
//         if (file instanceof File) {
//           formData.append("fishFiles", file);
//         }
//       });
//     }

//     try {
//       setLoading(prev => ({ ...prev, addFarmer: true }));
//       const res = await api.post(`/api/farmers/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Convert photo buffer to base64 for display
//       const farmerWithPhoto = {
//         ...res.data,
//         photo: bufferToBase64(res.data.photo)
//       };
      
//       setFarmers([...farmers, farmerWithPhoto]);
//       setShowForm(false);
//       setNewFarmer(emptyFarmer);
//       // alert("Farmer added successfully!");
//     } catch (err) {
//       console.error("Add Farmer Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, addFarmer: false }));
//     }
//   };

//   // Update Farmer
//   const updateFarmer = async () => {
//     if (!editingFarmerId) return;
    
//     const formData = new FormData();
    
//     // Add all farmer fields
//     const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
//                          'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
//     farmerFields.forEach(field => {
//       if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
//         formData.append(field, newFarmer[field].toString());
//       }
//     });
    
//     formData.append("userId", userId);
    
//     // Handle photo - only update if new photo is uploaded
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     }
//     // If no new photo, server will keep the existing one

//     try {
//       setLoading(prev => ({ ...prev, updateFarmer: true }));
//       const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Convert photo buffer to base64 for display
//       const updatedFarmer = {
//         ...res.data,
//         photo: bufferToBase64(res.data.photo)
//       };
      
//       setFarmers(farmers.map(f =>
//         f._id === res.data._id ? updatedFarmer : f
//       ));
      
//       setShowForm(false);
//       setEditingFarmerId(null);
//       setNewFarmer(emptyFarmer);
//       setIsUpdateMode(false);
//       // alert("Farmer updated successfully!");
//     } catch (err) {
//       console.error("Update Farmer Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updateFarmer: false }));
//     }
//   };

//   // Add Pond to Farmer
//   const addPond = async () => {
//     if (!currentFarmerId) return alert("Farmer ID missing");
    
//     // Validate required fields
//     const requiredPondFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
//       'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
//       'farmObservedDate', 'farmObservedTime'
//     ];
    
//     for (const field of requiredPondFields) {
//       if (!newPond[field]) {
//         return alert(`Please fill required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//       }
//     }
    
//     // Validate location
//     if (!newPond.latitude || !newPond.longitude) {
//       return alert("Please capture location by clicking 'Open My Location' button");
//     }
    
//     if (!newPond.pondImage) {
//       return alert("Pond image is required");
//     }
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     // Add all pond fields including location
//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
//       'latitude', 'longitude', // Add location fields
//       'farmObservedDate', 'farmObservedTime',
//       'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
//       'pesticideRunoff', 'constructionNear', 'suddenTempChange',
//       'notes'
//     ];
    
//     for (let key of pondFields) {
//       if (newPond[key] !== undefined && newPond[key] !== null) {
//         formData.append(key, newPond[key].toString());
//       }
//     }
    
//     formData.append("symptomsObserved", symptomsStr);

//     // Handle required files
//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     } else if (newPond.pondImage) {
//       // If it's a base64 string, convert to blob
//       const base64Response = await fetch(newPond.pondImage);
//       const blob = await base64Response.blob();
//       formData.append("pondImage", blob, "pondImage.jpg");
//     }

//     // Handle pond files
//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => {
//         if (f instanceof File) formData.append("pondFiles", f);
//       });
//     }

//     // Handle fish files
//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => {
//         if (f instanceof File) formData.append("fishFiles", f);
//       });
//     }

//     try {
//       setLoading(prev => ({ ...prev, addPond: true }));
//       const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Convert pond image buffers to base64 for display
//       const updatedPonds = res.data.farmer.ponds.map(pond => ({
//         ...pond,
//         pondImage: bufferToBase64(pond.pondImage)
//       }));
      
//       const updatedFarmer = {
//         ...res.data.farmer,
//         ponds: updatedPonds
//       };
      
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? updatedFarmer : f
//       ));
      
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       // Clear location states
//       setLatitude("");
//       setLongitude("");
//       // alert("Pond added successfully!");
//     } catch (err) {
//       console.error("Add Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, addPond: false }));
//     }
//   };



//   // Update Pond
//   const updatePond = async () => {
//     if (!currentFarmerId || !editingPondId) return;
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     // Add all pond fields including location
//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
//       'latitude', 'longitude', // Add location fields
//       'farmObservedDate', 'farmObservedTime',
//       'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
//       'pesticideRunoff', 'constructionNear', 'suddenTempChange',
//       'notes'
//     ];
    
//     for (let key of pondFields) {
//       if (newPond[key] !== undefined && newPond[key] !== null) {
//         formData.append(key, newPond[key].toString());
//       }
//     }
    
//     formData.append("symptomsObserved", symptomsStr);

//     // Handle files - only append if new ones are uploaded
//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     }

//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => {
//         if (f instanceof File) formData.append("pondFiles", f);
//       });
//     }

//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => {
//         if (f instanceof File) formData.append("fishFiles", f);
//       });
//     }

//     try {
//       setLoading(prev => ({ ...prev, updatePond: true }));
//       const res = await api.put(`/api/farmers/update-pond/${currentFarmerId}/${editingPondId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Convert pond image buffers to base64 for display
//       const updatedPonds = res.data.farmer.ponds.map(pond => ({
//         ...pond,
//         pondImage: bufferToBase64(pond.pondImage)
//       }));
      
//       const updatedFarmer = {
//         ...res.data.farmer,
//         ponds: updatedPonds
//       };
      
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? updatedFarmer : f
//       ));
      
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setEditingPondId(null);
//       // Clear location states
//       setLatitude("");
//       setLongitude("");
//       // alert("Pond updated successfully!");
//     } catch (err) {
//       console.error("Update Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updatePond: false }));
//     }
//   };

//   // Edit Farmer
//   const openEdit = (farmer) => {
//     setIsUpdateMode(true);
//     const pre = { ...emptyFarmer };
    
//     // Copy all farmer data
//     Object.keys(pre).forEach(k => {
//       if (farmer[k] !== undefined && farmer[k] !== null) {
//         pre[k] = farmer[k];
//       }
//     });

//     // Store existing photo buffer and set photo preview
//     pre.photoBuffer = farmer.photo;
//     pre.photo = getFarmerImage(farmer); // Convert to base64 for preview

//     setNewFarmer(pre);
//     setEditingFarmerId(farmer._id);
//     setShowForm(true);
//   };

//   // Open Add Pond Form
//   const openAddPond = (farmerId) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(null);
//     setNewPond(emptyPond);
//     // Clear location states when opening new form
//     setLatitude("");
//     setLongitude("");
//     setShowPondForm(true);
//   };

//   // Open Edit Pond Form
//   const openEditPond = async (farmerId, pond) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(pond.pondId);
    
//     const pre = { ...emptyPond };
    
//     // Copy all pond data including location
//     Object.keys(pre).forEach(k => {
//       if (pond[k] !== undefined && pond[k] !== null && k !== 'pondImage') {
//         pre[k] = pond[k];
//       }
//     });

//     // Handle symptoms
//     if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
//       pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
//       pre.symptomsObserved = pond.symptomsObserved;
//     }

//     // Store existing buffers and set previews
//     pre.pondImageBuffer = pond.pondImage;
//     pre.pondImage = getPondImage(pond); // Convert to base64 for preview
    
//     pre.pondFilesBuffers = pond.pondFiles || [];
//     pre.fishFilesBuffers = pond.fishFiles || [];

//     // Set location states
//     if (pond.latitude && pond.longitude) {
//       setLatitude(pond.latitude.toString());
//       setLongitude(pond.longitude.toString());
//     } else {
//       setLatitude("");
//       setLongitude("");
//     }

//     setNewPond(pre);
//     setShowPondForm(true);
//   };

//   const toggleSymptom = (s) => {
//     const arr = newPond.symptoms ? [...newPond.symptoms] : [];
//     const idx = arr.indexOf(s);
//     if (idx === -1) arr.push(s); else arr.splice(idx, 1);
//     setNewPond({ ...newPond, symptoms: arr, symptomsObserved: arr.join(", ") });
//   };

//   useEffect(() => {
//     const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";

//     const message = isFirstLogin
//       ? `Welcome, ${username}`
//       : `Welcome Back, ${username}`;

//     setWelcomeMsg(message);

//     if (isFirstLogin) {
//       localStorage.setItem("isFirstLogin", "false");
//     }
//   }, [username]);

//   // Handle photo file change for farmer
//   const handleFarmerPhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         const base64 = await fileToBase64(file);
//         setNewFarmer({ ...newFarmer, photo: base64 });
//       } catch (error) {
//         console.error("Error converting file to base64:", error);
//         setNewFarmer({ ...newFarmer, photo: file });
//       }
//     }
//   };

//   // Handle pond image file change
//   const handlePondImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         const base64 = await fileToBase64(file);
//         setNewPond({ ...newPond, pondImage: base64 });
//       } catch (error) {
//         console.error("Error converting file to base64:", error);
//         setNewPond({ ...newPond, pondImage: file });
//       }
//     }
//   };

//   // Handle pond files change
//   const handlePondFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPond({ ...newPond, pondFiles: files });
//   };

//   // Handle fish files change
//   const handleFishFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPond({ ...newPond, fishFiles: files });
//   };

//   const totalFarmers = farmers.length;
//   const totalPonds = farmers.reduce((sum, f) => sum + Number(f.pondCount || 0), 0);

//   const [searchId, setSearchId] = useState("");

//   const handleSearch = async () => {
//     if (!searchId) {
//       await fetchFarmers();
//       return;
//     }

//     setLoading(prev => ({ ...prev, search: true }));
//     try {
//       const filtered = farmers.filter(f =>
//         f.farmerId.toLowerCase().includes(searchId.toLowerCase())
//       );

//       if (filtered.length > 0) {
//         const remaining = farmers.filter(f => !filtered.includes(f));
//         setFarmers([...filtered, ...remaining]);
//       } else {
//         await fetchFarmers();
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, search: false }));
//     }
//   };

//   // Loader component for buttons
//   const ButtonLoader = () => (
//     <Loader2 className="spin-loader" size={16} />
//   );

//   return (
//     <div className="dashboard-container">
//       {/* ================= MOBILE NAVBAR ================= */}
//       {isMobile && (
//         <div className="mobile-navbar">
//           <button 
//             className="mobile-menu-toggle"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             aria-label="Toggle menu"
//             disabled={loading.fetchFarmers}
//           >
//             {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
          
//           <div className="mobile-logo">
//             <h3>Dashboard</h3>
//           </div>
          
//           <div className="mobile-profile">
//             <img
//               // src={photo}
//                 // src={getImageUrl(userId, "profile")}
//                 src={getProfileImage(userId)}
//               alt="User"
//               className="mobile-profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//                 e.target.onerror = null;
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* ================= SIDEBAR ================= */}
//       <div className={`sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="profile-section text-center mb-4">
//             <img
//               // src={photo}
//                 // src={getImageUrl(userId, "profile")}
//                 src={getProfileImage(userId)}
//               alt="User"
//               className="profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//                 e.target.onerror = null;
//               }}
//             />
//             <h5>{username}</h5>
//           </div>
//         </div>

//         <ul className="menu">
//           <li>
//             <Link to="/profile" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <User size={18} /> {t('profile')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dashboard" className="menu-btn active" onClick={() => setIsSidebarOpen(false)}>
//               <Home size={18} /> {t('dashboard')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/helpcenter" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <HelpCircle size={18} /> {t('helpCenter')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dealers" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <ShoppingBag size={18} /> {t('dealers')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/agents" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <Users size={18} /> {t('agents')}
//             </Link>
//           </li>
//         </ul>

//         {/* ================= LANGUAGE ================= */}
//         <div className="language-section mb-4">
//           <h6>{t("chooseLanguage")}</h6>
//           <select
//             className="form-select form-select-sm"
//             value={i18n.language}
//             onChange={(e) => changeLanguage(e.target.value)}
//             disabled={loading.fetchFarmers}
//           >
//             <option value="en">English</option>
//             <option value="hi">हिन्दी</option>
//             <option value="bn">বাংলা</option>
//             <option value="as">অসমীয়া</option>
//             <option value="ta">தமிழ்</option>
//             <option value="kn">ಕನ್ನಡ</option>
//             <option value="mr">मराठी</option>
//           </select>
//         </div>
//       </div>

//       {/* ================= OVERLAY FOR MOBILE ================= */}
//       {isMobile && isSidebarOpen && (
//         <div 
//           className="sidebar-overlay"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}

//       {/* ================= RIGHT SECTION ================= */}
//       <div className={`right-section ${isMobile ? 'mobile-view' : ''}`}>
//         <div className="top-bar">
//           <h2>{welcomeMsg}</h2>
//           <button 
//             className="add-btn d-flex align-items-center gap-1"
//             onClick={() => { 
//               setShowForm(true); 
//               setEditingFarmerId(null); 
//               setNewFarmer(emptyFarmer);
//               setIsUpdateMode(false);
//             }}
//             disabled={loading.fetchFarmers}
//           >
//             + <span>{t('addFarmer')}</span>
//           </button>
//         </div>

//         {/* CARDS AND SEARCH SECTION */}
//         <div className="cards-and-search">
//           <div className="cards-section">
//             <div className="card">
//               <h5>{t('totalFarmers')}</h5>
//               <p className="display-6">
//                 {loading.fetchFarmers ? <ButtonLoader /> : totalFarmers}
//               </p>
//             </div>
//             <div className="card">
//               <h5>{t('totalPonds')}</h5>
//               <p className="display-6">
//                 {loading.fetchFarmers ? <ButtonLoader /> : totalPonds}
//               </p>
//             </div>
//           </div>

//           <div className="search-section d-flex gap-2">
//             <input
//               type="text"
//               placeholder={t('farmerSearchById')}
//               className="form-control"
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//               disabled={loading.search}
//             />

//             <button
//               className="btn btn-sm btn-primary"
//               onClick={handleSearch}
//               disabled={loading.search}
//             >
//               {loading.search ? <ButtonLoader /> : "Search"}
//             </button>
//           </div>
//         </div>

//         <div className="list-title">{t('farmersList')}</div>
//         <div className="farmers-list">
//           {loading.fetchFarmers ? (
//             <div className="text-center py-5">
//               <ButtonLoader />
//               <p>Loading farmers...</p>
//             </div>
//           ) : farmers.length === 0 ? (
//             <div className="text-center py-5">
//               <p>No farmers found. Add your first farmer!</p>
//             </div>
//           ) : (
//             farmers.map(f => (
//               <div key={f._id} className="farmer-box">
//                 <img
//                   src={getFarmerImage(f)}
//                   alt={f.name}
//                   className="profile-pic"
//                   loading="lazy"
//                   onError={(e) => {
//                     e.target.src = "/profile.png";
//                     e.target.onerror = null;
//                   }}
//                 />

//                 <div style={{ flex: 1 }}>
//                   <p><b>{t('farmerName')}:</b> {f.name}</p>
//                   <p><b>{t('farmerId')}:</b> {f.farmerId}</p>
//                   <p><b>{t('contactNumber')}:</b> {f.contact}</p>
//                   <p><b>{t('pondCount')}:</b> {f.pondCount}</p>
//                   <p className="updated-text" style={{ fontSize: "0.85rem" }}>
//                     <b>{t('updated')}:</b> {timeAgo(f.updatedAt || f.createdAt, t)}
//                   </p>
//                 </div>

//                 {/* Pond List with Update Buttons */}
//                 {f.ponds && f.ponds.length > 0 && (
//                   <div style={{ marginTop: 10, width: "100%" }}>
//                     <h6>Pond List</h6>
//                     <button 
//                       className="btn btn-sm btn-success mb-2"
//                       onClick={() => openAddPond(f._id)}
//                       disabled={loading.addPond}
//                     >
//                       {loading.addPond ? <ButtonLoader /> : "+ Add Pond"}
//                     </button>
                    
//                     {/* Desktop Table View */}
//                     <div className="table-container">
//                       <table className="table table-sm table-bordered">
//                         <thead>
//                           <tr>
//                             <th>Pond No.</th>
//                             <th>Pond ID</th>
//                             <th>Species</th>
//                             <th>Last Updated</th>
//                             <th>Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {f.ponds.map((pond, index) => (
//                             <tr key={pond.pondId}>
//                               <td>{pond.pondNumber || index + 1}</td>
//                               <td>{pond.pondId}</td>
//                               <td>{pond.species || "Not specified"}</td>
//                               <td>{timeAgo(pond.updatedAt || pond.createdAt, t)}</td>
//                               <td>
//                                 <button 
//                                   className="btn btn-sm btn-primary"
//                                   onClick={() => openEditPond(f._id, pond)}
//                                   disabled={loading.updatePond}
//                                 >
//                                   {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
                    
//                     {/* Mobile Card View */}
//                     <div className="mobile-pond-view">
//                       {f.ponds.map((pond, index) => (
//                         <div key={pond.pondId} className="mobile-pond-card">
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Pond No.</span>
//                             <span className="mobile-pond-value">{pond.pondNumber || index + 1}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Pond ID</span>
//                             <span className="mobile-pond-value">{pond.pondId}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Species</span>
//                             <span className="mobile-pond-value">{pond.species || "Not specified"}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Last Updated</span>
//                             <span className="mobile-pond-value">{timeAgo(pond.updatedAt || pond.createdAt, t)}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Actions</span>
//                             <span className="mobile-pond-value">
//                               <button 
//                                 className="btn btn-sm btn-primary"
//                                 onClick={() => openEditPond(f._id, pond)}
//                                 style={{ width: "100%", marginTop: "4px" }}
//                                 disabled={loading.updatePond}
//                               >
//                                 {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                               </button>
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* If no ponds, show Add Pond button */}
//                 {(!f.ponds || f.ponds.length === 0) && (
//                   <div style={{ marginTop: 10 }}>
//                     <button 
//                       className="btn btn-sm btn-success"
//                       onClick={() => openAddPond(f._id)}
//                       disabled={loading.addPond}
//                     >
//                       {loading.addPond ? <ButtonLoader /> : "+ Add First Pond"}
//                     </button>
//                   </div>
//                 )}

//                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                   <button 
//                     className="btn btn-sm btn-outline-primary" 
//                     onClick={() => openEdit(f)}
//                     disabled={loading.updateFarmer}
//                   >
//                     {loading.updateFarmer ? <ButtonLoader /> : t('updateFarmer')}
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Farmer Modal Form */}
//       {showForm && (
//         <div className="form-modal">
//           <div className="form-box" style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}>
//             <h5>{isUpdateMode ? "Update Farmer" : t('addFarmer')}</h5>
            
//             <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
//               <h6>Farmer Details (All fields are required)</h6>
//               <div className="row g-2">
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Name *" 
//                     value={newFarmer.name} 
//                     onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Contact Number *" 
//                     value={newFarmer.contact} 
//                     onChange={e => setNewFarmer({ ...newFarmer, contact: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>
                
//                 <div className="col-md-3">
//                   <input 
//                     type="number" 
//                     className="form-control" 
//                     placeholder="Age *" 
//                     value={newFarmer.age} 
//                     onChange={e => setNewFarmer({ ...newFarmer, age: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 {/* <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Gender *" 
//                     value={newFarmer.gender} 
//                     onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div> */}

//                   <div className="col-md-3">
//   <select 
//     className="form-control" 
//     value={newFarmer.gender} 
//     onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
//     disabled={loading.addFarmer || loading.updateFarmer}
//     required
//   >
//     <option value="">Select Gender *</option>
//     <option value="Male">Male</option>
//     <option value="Female">Female</option>
//     <option value="Other">Other</option>
//   </select>
// </div>


//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Aadhar *" 
//                     value={newFarmer.adhar} 
//                     onChange={e => setNewFarmer({ ...newFarmer, adhar: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Members *" 
//                     value={newFarmer.familyMembers} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyMembers: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Occupation *" 
//                     value={newFarmer.familyOccupation} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyOccupation: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Address *" 
//                     value={newFarmer.village} 
//                     onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-12">
//                   <label>Farmer Photo (required) *</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     accept="image/*,video/*"
//                     capture="environment"
//                     onChange={handleFarmerPhotoChange}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required={!isUpdateMode}
//                   />

//                   {/* Show current photo preview */}
//                   {newFarmer.photo && (
//                     <div style={{ marginTop: 6 }}>
//                       <img
//                         src={newFarmer.photo}
//                         alt="Preview"
//                         style={{ width: 80, height: 80, borderRadius: "50%" }}
//                         onError={(e) => {
//                           e.target.src = "/profile.png";
//                           e.target.onerror = null;
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//               {isUpdateMode ? (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={updateFarmer}
//                     disabled={loading.updateFarmer}
//                   >
//                     {loading.updateFarmer ? <ButtonLoader /> : "Update Farmer"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowForm(false); 
//                       setEditingFarmerId(null); 
//                       setNewFarmer(emptyFarmer);
//                       setIsUpdateMode(false);
//                     }}
//                     disabled={loading.updateFarmer}
//                   >
//                     {t('cancel')}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={addFarmer}
//                     disabled={loading.addFarmer}
//                   >
//                     {loading.addFarmer ? <ButtonLoader /> : t('submit')}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowForm(false); 
//                       setNewFarmer(emptyFarmer);
//                     }}
//                     disabled={loading.addFarmer}
//                   >
//                     {t('cancel')}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pond Modal Form */}
//       {showPondForm && (
//         <div className="form-modal">
//           <div className="form-box" style={{ width: "850px", maxHeight: "90vh", overflowY: "auto" }}>
//             <h5>{editingPondId ? "Update Pond" : "Add New Pond"}</h5>

//             {/* UPDATED MODAL FORM GRID */}
//             <div className="modal-form-grid">
              
//               {/* Pond Details */}
//               <div className="modal-section">
//                 <h6>Pond Details (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond area (eg. 1 acre) *" 
//                       value={newPond.pondArea} 
//                       onChange={e => setNewPond({ ...newPond, pondArea: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-2">
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondAreaUnit} 
//                       onChange={e => setNewPond({ ...newPond, pondAreaUnit: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option value="acre">acre</option>
//                       <option value="hectare">hectare</option>
//                       <option value="footsquare">footsquare</option>
//                     </select>
//                   </div>
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond depth (ft) *" 
//                       value={newPond.pondDepth} 
//                       onChange={e => setNewPond({ ...newPond, pondDepth: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond image (GPS) - required *</label>
//                     <input 
//                       type="file"
//                       className="form-control"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       onChange={handlePondImageChange}
//                       disabled={loading.addPond || loading.updatePond}
//                       required={!editingPondId}
//                     />

//                     {newPond.pondImage && (
//                       <div style={{ marginTop: 6 }}>
//                         <img
//                           src={newPond.pondImage}
//                           alt="Pond preview"
//                           style={{ width: 80, height: 80, borderRadius: "4px" }}
//                           onError={(e) => {
//                             e.target.src = "/profile.png";
//                             e.target.onerror = null;
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload Pond Picture/Video (required) *</label>
//                     <input 
//                       type="file"
//                       className="form-control"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       multiple
//                       onChange={handlePondFilesChange}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
                    
//                     {newPond.pondFiles && newPond.pondFiles.length > 0 && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>{newPond.pondFiles.length} file(s) selected</small>
//                       </div>
//                     )}

//                   </div>

//                   <div className="col-md-6">
//                     <label>Overflow from somewhere in pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.overflow} 
//                       onChange={e => setNewPond({ ...newPond, overflow: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond receives proper Sunlight? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.receivesSunlight} 
//                       onChange={e => setNewPond({ ...newPond, receivesSunlight: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Trees present on banks? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.treesOnBanks} 
//                       onChange={e => setNewPond({ ...newPond, treesOnBanks: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Neighbourhood *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.neighbourhood} 
//                       onChange={e => setNewPond({ ...newPond, neighbourhood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Agriculture Farm</option>
//                       <option>Pond</option>
//                       <option>Road</option>
//                       <option>Residential Area</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Does wastewater enter pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.wastewaterEnters} 
//                       onChange={e => setNewPond({ ...newPond, wastewaterEnters: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Location Section */}
//               <div className="modal-section">
//                 <h6>Location (Required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-12 mb-2">
//                     <button 
//                       type="button"
//                       className="btn btn-primary w-45 d-flex align-items-center justify-content-center gap-2"
//                       onClick={getLocation}
//                       disabled={isGettingLocation || loading.addPond || loading.updatePond}
//                     >
//                       {isGettingLocation ? <ButtonLoader /> : <MapPin size={16} />}
//                       {isGettingLocation ? "Getting Location..." : "📍 Open My Location"}
//                     </button>
//                     {/* <small className="text-muted">Click to capture your current GPS location</small> */}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Latitude *</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newPond.latitude || ""}
//                       readOnly
//                       placeholder="Latitude will auto-fill"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Longitude *</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newPond.longitude || ""}
//                       readOnly
//                       placeholder="Longitude will auto-fill"
//                       required
//                     />
//                   </div>

//                   {(newPond.latitude || newPond.longitude) && (
//                     <div className="col-md-12">
//                       <button
//                         type="button"
//                         className="btn btn-outline-secondary btn-sm"
//                         onClick={clearLocation}
//                         disabled={loading.addPond || loading.updatePond}
//                       >
//                         Clear Location
//                       </button>
//                       <small className="text-success ms-2">
//                         ✓ Location captured: {newPond.latitude}, {newPond.longitude}
//                       </small>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Species & Stocking */}
//               <div className="modal-section">
//                 <h6>Species & Stocking (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Fish Species Cultured *" 
//                       value={newPond.species} 
//                       onChange={e => setNewPond({ ...newPond, species: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label>Date of Stocking *</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.dateOfStocking} 
//                       onChange={e => setNewPond({ ...newPond, dateOfStocking: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="text"
//                       className="form-control" 
//                       placeholder="Quantity of Seed initially in Pond *" 
//                       value={newPond.qtySeedInitially} 
//                       onChange={e => setNewPond({ ...newPond, qtySeedInitially: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       type="text"
//                       className="form-control" 
//                       placeholder="Current Quantity of Fish in Pond *" 
//                       value={newPond.currentQty} 
//                       onChange={e => setNewPond({ ...newPond, currentQty: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Average size of fishes *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.avgSize} 
//                       onChange={e => setNewPond({ ...newPond, avgSize: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>&gt;200gram</option>
//                       <option>200-500 gram</option>
//                       <option>500-750 gram</option>
//                       <option>&lt;750gram</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Feed Details */}
//               <div className="modal-section">
//                 <h6>Feed Details (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <label>Feed Type Used *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedType} 
//                       onChange={e => setNewPond({ ...newPond, feedType: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Market Feed</option>
//                       <option>Homemade Feed</option>
//                       <option>Both</option>
//                       <option>Other</option>
//                     </select>
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="If Other, mention" 
//                       value={newPond.feedOther} 
//                       onChange={e => setNewPond({ ...newPond, feedOther: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Feed frequency *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedFreq} 
//                       onChange={e => setNewPond({ ...newPond, feedFreq: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Once a day</option>
//                       <option>twice a day</option>
//                       <option>thrice a day</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Feed quantity given per day (in kg) *" 
//                       value={newPond.feedQtyPerDay} 
//                       onChange={e => setNewPond({ ...newPond, feedQtyPerDay: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Approx time of feeding *</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.feedTime} 
//                       onChange={e => setNewPond({ ...newPond, feedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Any recent changes in feed or feeding behaviour *" 
//                       value={newPond.recentFeedChanges} 
//                       onChange={e => setNewPond({ ...newPond, recentFeedChanges: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Do fish show reduced appetite? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.reducedAppetite} 
//                       onChange={e => setNewPond({ ...newPond, reducedAppetite: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Water Quality */}
//               <div className="modal-section">
//                 <h6>Water Quality (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="Water Temp (°C) *" 
//                       value={newPond.waterTemperature} 
//                       onChange={e => setNewPond({ ...newPond, waterTemperature: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="pH measured *" 
//                       value={newPond.pH} 
//                       onChange={e => setNewPond({ ...newPond, pH: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="DO measured *" 
//                       value={newPond.DO} 
//                       onChange={e => setNewPond({ ...newPond, DO: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <label>Ammonia (NH₃) Level *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.ammoniaLevel} 
//                       onChange={e => setNewPond({ ...newPond, ammoniaLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Phytoplankton Levels *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.phytoplanktonLevel} 
//                       onChange={e => setNewPond({ ...newPond, phytoplanktonLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Water Hardness *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.waterHardness} 
//                       onChange={e => setNewPond({ ...newPond, waterHardness: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Any visible algae bloom? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.algaeBloom} 
//                       onChange={e => setNewPond({ ...newPond, algaeBloom: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Pond Water Colour *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondWaterColor} 
//                       onChange={e => setNewPond({ ...newPond, pondWaterColor: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Light Green</option><option>Dark Green</option><option>Yellowish Green</option>
//                       <option>Brownish Green</option><option>Yellow</option><option>Muddy Brown</option>
//                       <option>Black</option><option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Source of Water *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.sourceOfWater} 
//                       onChange={e => setNewPond({ ...newPond, sourceOfWater: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Rainwater</option><option>Pump</option><option>River</option><option>Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Disease & Symptoms */}
//               <div className="modal-section">
//                 <h6>Disease & Symptoms (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <label>Any disease symptoms? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.diseaseSymptoms} 
//                       onChange={e => setNewPond({ ...newPond, diseaseSymptoms: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   {/* SYMPTOMS SECTION */}
//                   <div className="col-md-12">
//                     <label>Symptoms observed (check / or type) *</label>
//                     <div className="symptoms-grid">
//                       {SYMPTOMS_LIST.map(s => (
//                         <label key={s} className="symptom-checkbox">
//                           <input 
//                             type="checkbox" 
//                             checked={newPond.symptoms?.includes(s)} 
//                             onChange={() => toggleSymptom(s)} 
//                             disabled={loading.addPond || loading.updatePond}
//                           /> 
//                           <span>{s}</span>
//                         </label>
//                       ))}
//                     </div>
//                     <div style={{ marginTop: 8 }}>
//                       <input 
//                         className="form-control" 
//                         placeholder="Or type symptoms comma separated *" 
//                         value={newPond.symptomsObserved} 
//                         onChange={e => setNewPond({ ...newPond, symptomsObserved: e.target.value })}
//                         disabled={loading.addPond || loading.updatePond}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="How many fish have died last 15 days(cumulative)? *" 
//                       value={newPond.fishDeaths} 
//                       onChange={e => setNewPond({ ...newPond, fishDeaths: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Are symptoms affecting all fish or only a few? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.symptomsAffect} 
//                       onChange={e => setNewPond({ ...newPond, symptomsAffect: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>All</option><option>Few</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload fish images/videos (required) *</label>
//                     <input
//                       type="file"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       multiple
//                       className="form-control"
//                       onChange={handleFishFilesChange}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {newPond.fishFiles && newPond.fishFiles.length > 0 && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>{newPond.fishFiles.length} file(s) selected</small>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Observation & Misc */}
//               <div className="modal-section">
//                 <h6>Observation & Misc (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <label>Date of Farm Observed *</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.farmObservedDate} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedDate: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label>Time of Farm Observed *</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.farmObservedTime} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Which species farmer cultured last time? *</label>
//                     <input 
//                       className="form-control" 
//                       value={newPond.lastSpecies} 
//                       onChange={e => setNewPond({ ...newPond, lastSpecies: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Does farmer completely harvest the last crop? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.lastHarvestComplete} 
//                       onChange={e => setNewPond({ ...newPond, lastHarvestComplete: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any recent heavy rains or floods? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.recentRainFlood} 
//                       onChange={e => setNewPond({ ...newPond, recentRainFlood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any pesticide/chemical runoff near pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pesticideRunoff} 
//                       onChange={e => setNewPond({ ...newPond, pesticideRunoff: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any construction/activity near pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.constructionNear} 
//                       onChange={e => setNewPond({ ...newPond, constructionNear: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any sudden temperature change recently? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.suddenTempChange} 
//                       onChange={e => setNewPond({ ...newPond, suddenTempChange: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-12">
//                     <label>Notes / Remarks *</label>
//                     <textarea 
//                       className="form-control" 
//                       rows={3} 
//                       value={newPond.notes} 
//                       onChange={e => setNewPond({ ...newPond, notes: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     ></textarea>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//               {editingPondId ? (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={updatePond}
//                     disabled={loading.updatePond}
//                   >
//                     {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowPondForm(false); 
//                       setNewPond(emptyPond);
//                       setCurrentFarmerId(null);
//                       setEditingPondId(null);
//                       // Clear location states
//                       setLatitude("");
//                       setLongitude("");
//                     }}
//                     disabled={loading.updatePond}
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={addPond}
//                     disabled={loading.addPond}
//                   >
//                     {loading.addPond ? <ButtonLoader /> : "Add Pond"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowPondForm(false); 
//                       setNewPond(emptyPond);
//                       setCurrentFarmerId(null);
//                       // Clear location states
//                       setLatitude("");
//                       setLongitude("");
//                     }}
//                     disabled={loading.addPond}
//                   >
//                     Cancel
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MainPage;





//ye bina selfie ke 









// //buffer ke liye
// import React, { useState, useEffect } from "react";
// // import api from "../utils/api";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./mainPage.css";
// import { getProfileImage } from "../utils/profileImage";
// // jahan tu <img> use kar raha hai
// import api, { getImageUrl } from "../utils/api"; // path check kar le

// // Import Lucide icons
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2, MapPin } from "lucide-react";

// function timeAgo(dateStr, t) {
//   if (!dateStr) return t('notUpdated');
//   const now = new Date();
//   const d = new Date(dateStr);
//   const diffMs = now - d;
//   const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//   if (days === 0) return t('today');
//   if (days === 1) return t('oneDayAgo');
//   return t('daysAgo', { count: days });
// }

// const SYMPTOMS_LIST = [
//   "Erratic swimming", 
//   "Loss of appetite",
//   "Gasping at surface",
//   "Lesions or ulcers",
//   "Fin rot",
//   "Fish Lice",
//   "Discoloration or white patches",
//   "Scale loss",
//   "Swollen abdomen",
//   "Fungal/cotton-like growth",
//   "Flared gills",
//   "Mucus secretion",
//   "Blood spots",
//   "Other"
// ];

// // Helper function to convert buffer to base64 URL
// const bufferToBase64 = (bufferData) => {
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
//   } catch (error) {
//     console.error("Buffer conversion error:", error);
//   }
  
//   return "/profile.png";
// };

// // Helper function for farmer image
// const getFarmerImage = (farmer) => {
//   if (!farmer) return "/profile.png";
  
//   // If photo is a buffer, convert to base64
//   if (farmer.photo) {
//     return bufferToBase64(farmer.photo);
//   }
  
//   // If photo is stored as base64 string in the database
//   if (typeof farmer.photo === 'string' && farmer.photo.startsWith('data:')) {
//     return farmer.photo;
//   }
  
//   return "/profile.png";
// };

// // Helper function for pond image
// const getPondImage = (pond) => {
//   if (!pond) return "/profile.png";
  
//   if (pond.pondImage) {
//     return bufferToBase64(pond.pondImage);
//   }
  
//   if (typeof pond.pondImage === 'string' && pond.pondImage.startsWith('data:')) {
//     return pond.pondImage;
//   }
  
//   return "/profile.png";
// };

// function MainPage() {
//   const { t, i18n } = useTranslation();
//   const username = localStorage.getItem("username") || "User";
//   const photo = localStorage.getItem("photo") || "/profile.png";
//   const userId = localStorage.getItem("userId");

//   const [farmers, setFarmers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [showPondForm, setShowPondForm] = useState(false);
//   const [editingFarmerId, setEditingFarmerId] = useState(null);
//   const [editingPondId, setEditingPondId] = useState(null);
//   const [currentFarmerId, setCurrentFarmerId] = useState(null);
//   const [welcomeMsg, setWelcomeMsg] = useState("");
//   const [isUpdateMode, setIsUpdateMode] = useState(false);

//   // Location states
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   // Selfie states
//   const [selfieFile, setSelfieFile] = useState(null);
//   const [selfiePreview, setSelfiePreview] = useState(null);

//   // Loading states
//   const [loading, setLoading] = useState({
//     fetchFarmers: false,
//     addFarmer: false,
//     updateFarmer: false,
//     addPond: false,
//     updatePond: false,
//     deleteFarmer: false,
//     deletePond: false,
//     search: false
//   });
  
//   // Mobile sidebar states
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Farmer form empty state
//   const emptyFarmer = {
//     name: "", contact: "", age: "", gender: "", village: "",
//     pondCount: "0", adhar: "", familyMembers: "", familyOccupation: "",
//     photo: null,
//     photoBuffer: null, // Store existing photo buffer
//   };

//   // Pond form empty state
//   const emptyPond = {
//     // Pond Details
//     pondArea: "", pondAreaUnit: "acre", pondDepth: "", pondImage: null,
//     overflow: "No", receivesSunlight: "Yes", treesOnBanks: "No",
//     neighbourhood: "Agriculture Farm", wastewaterEnters: "No",
//     // Species & Stocking
//     species: "", dateOfStocking: "", qtySeedInitially: "", 
//     currentQty: "", avgSize: ">200gram",
//     // Feed Details
//     feedType: "Market Feed", feedOther: "", feedFreq: "Once a day", 
//     feedQtyPerDay: "", feedTime: "6:00 am-10:00am",
//     recentFeedChanges: "", reducedAppetite: "No",
//     // Water Quality
//     waterTemperature: "", pH: "", DO: "", ammoniaLevel: "Medium", 
//     phytoplanktonLevel: "Medium", waterHardness: "1",
//     algaeBloom: "No", pondWaterColor: "Light Green", sourceOfWater: "Rainwater",
//     // Disease & Symptoms
//     diseaseSymptoms: "No", symptomsObserved: "", symptoms: [],
//     symptomsAffect: "All", fishDeaths: "",
//     // Location
//     latitude: "",
//     longitude: "",
//     // Observation
//     farmObservedDate: "", farmObservedTime: "",
//     // History & Environment
//     lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
//     pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No",
//     // Notes
//     notes: "",
//     // Files
//     pondFiles: [],
//     fishFiles: [],
//     uploadSelfie: null,  // Add this line
//     uploadSelfieBuffer: null, // Add this line
//     // Store existing buffers
//     pondImageBuffer: null,
//     pondFilesBuffers: [],
//     fishFilesBuffers: []
//   };

//   const [newFarmer, setNewFarmer] = useState(emptyFarmer);
//   const [newPond, setNewPond] = useState(emptyPond);

//   // Check if mobile view
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 991);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMobile && isSidebarOpen && 
//           !event.target.closest('.sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Fetch data
//   useEffect(() => {
//     if (!userId) {
//       console.error("UserId not found in localStorage");
//       return;
//     }
//     fetchFarmers();
//     const savedLang = localStorage.getItem("lang");
//     if (savedLang) i18n.changeLanguage(savedLang);
//   }, [userId]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   const fetchFarmers = async () => {
//     try {
//       setLoading(prev => ({ ...prev, fetchFarmers: true }));
//       const res = await api.get(`/api/farmers/all?userId=${userId}`);
      
//       console.log("Farmers data received:", res.data);
//       setFarmers(res.data || []);
//     } catch (err) {
//       console.error("Fetch Farmers Error:", err);
//       alert("Error fetching farmers: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, fetchFarmers: false }));
//     }
//   };

//   // Convert File to Base64 for preview
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   // Get Location Function
//   const getLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return;
//     }

//     setIsGettingLocation(true);
    
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;
        
//         setLatitude(lat.toString());
//         setLongitude(lng.toString());
//         setNewPond({ ...newPond, latitude: lat.toString(), longitude: lng.toString() });
        
//         setIsGettingLocation(false);
//         // alert("Location captured successfully!");
//       },
//       (error) => {
//         setIsGettingLocation(false);
//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             alert("Location access denied. Please enable location permissions.");
//             break;
//           case error.POSITION_UNAVAILABLE:
//             alert("Location information unavailable.");
//             break;
//           case error.TIMEOUT:
//             alert("Location request timed out.");
//             break;
//           default:
//             alert("An unknown error occurred.");
//             break;
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0
//       }
//     );
//   };

//   // Clear Location
//   const clearLocation = () => {
//     setLatitude("");
//     setLongitude("");
//     setNewPond({ ...newPond, latitude: "", longitude: "" });
//   };

//   // Add Farmer
//   const addFarmer = async () => {
//     // Check required fields
//     if (!newFarmer.name || !newFarmer.contact || !newFarmer.age || 
//         !newFarmer.gender || !newFarmer.adhar || !newFarmer.familyMembers || 
//         !newFarmer.familyOccupation || !newFarmer.village) {
//       return alert("Please fill all required fields: Name, Contact, Age, Gender, Aadhar, Family Members, Family Occupation, Village");
//     }
    
//     if (!newFarmer.photo) {
//       return alert("Farmer photo is required");
//     }
    
//     const formData = new FormData();
    
//     // Add all farmer fields
//     const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
//                          'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
//     farmerFields.forEach(field => {
//       if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
//         formData.append(field, newFarmer[field].toString());
//       }
//     });
    
//     formData.append("userId", userId);
//     formData.append("createdBy", userId);
    
//     // Handle photo
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     } else if (newFarmer.photo) {
//       // If it's a base64 string, convert to blob
//       const base64Response = await fetch(newFarmer.photo);
//       const blob = await base64Response.blob();
//       formData.append("photo", blob, "photo.jpg");
//     }
    
//     // Handle farmer level files
//     if (newFarmer.pondFiles && newFarmer.pondFiles.length > 0) {
//       newFarmer.pondFiles.forEach((file) => {
//         if (file instanceof File) {
//           formData.append("pondFiles", file);
//         }
//       });
//     }
    
//     if (newFarmer.fishFiles && newFarmer.fishFiles.length > 0) {
//       newFarmer.fishFiles.forEach((file) => {
//         if (file instanceof File) {
//           formData.append("fishFiles", file);
//         }
//       });
//     }

//     try {
//       setLoading(prev => ({ ...prev, addFarmer: true }));
//       const res = await api.post(`/api/farmers/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Convert photo buffer to base64 for display
//       const farmerWithPhoto = {
//         ...res.data,
//         photo: bufferToBase64(res.data.photo)
//       };
      
//       setFarmers([...farmers, farmerWithPhoto]);
//       setShowForm(false);
//       setNewFarmer(emptyFarmer);
//       // alert("Farmer added successfully!");
//     } catch (err) {
//       console.error("Add Farmer Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, addFarmer: false }));
//     }
//   };

//   // Update Farmer
//   const updateFarmer = async () => {
//     if (!editingFarmerId) return;
    
//     const formData = new FormData();
    
//     // Add all farmer fields
//     const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
//                          'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
//     farmerFields.forEach(field => {
//       if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
//         formData.append(field, newFarmer[field].toString());
//       }
//     });
    
//     formData.append("userId", userId);
    
//     // Handle photo - only update if new photo is uploaded
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     }
//     // If no new photo, server will keep the existing one

//     try {
//       setLoading(prev => ({ ...prev, updateFarmer: true }));
//       const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Convert photo buffer to base64 for display
//       const updatedFarmer = {
//         ...res.data,
//         photo: bufferToBase64(res.data.photo)
//       };
      
//       setFarmers(farmers.map(f =>
//         f._id === res.data._id ? updatedFarmer : f
//       ));
      
//       setShowForm(false);
//       setEditingFarmerId(null);
//       setNewFarmer(emptyFarmer);
//       setIsUpdateMode(false);
//       // alert("Farmer updated successfully!");
//     } catch (err) {
//       console.error("Update Farmer Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updateFarmer: false }));
//     }
//   };

//   // Add Pond to Farmer
//   const addPond = async () => {
//     if (!currentFarmerId) return alert("Farmer ID missing");
    
//     // Validate required fields
//     const requiredPondFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
//       'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
//       'farmObservedDate', 'farmObservedTime'
//     ];
    
//     for (const field of requiredPondFields) {
//       if (!newPond[field]) {
//         return alert(`Please fill required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//       }
//     }
    
//     // Validate location
//     if (!newPond.latitude || !newPond.longitude) {
//       return alert("Please capture location by clicking 'Open My Location' button");
//     }
    
//     if (!newPond.pondImage) {
//       return alert("Pond image is required");
//     }
    
//     // ❌ REMOVED SELFIE VALIDATION - NO LONGER REQUIRED
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     // Add all pond fields including location
//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
//       'latitude', 'longitude', // Add location fields
//       'farmObservedDate', 'farmObservedTime',
//       'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
//       'pesticideRunoff', 'constructionNear', 'suddenTempChange',
//       'notes'
//     ];
    
//     for (let key of pondFields) {
//       if (newPond[key] !== undefined && newPond[key] !== null) {
//         formData.append(key, newPond[key].toString());
//       }
//     }
    
//     formData.append("symptomsObserved", symptomsStr);

//     // Handle required files
//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     } else if (newPond.pondImage) {
//       // If it's a base64 string, convert to blob
//       const base64Response = await fetch(newPond.pondImage);
//       const blob = await base64Response.blob();
//       formData.append("pondImage", blob, "pondImage.jpg");
//     }

//     // Handle pond files
//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => {
//         if (f instanceof File) formData.append("pondFiles", f);
//       });
//     }

//     // Handle fish files
//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => {
//         if (f instanceof File) formData.append("fishFiles", f);
//       });
//     }

//     // Handle selfie (optional now)
//     if (selfieFile) {
//       formData.append("uploadSelfie", selfieFile);
//     } else if (newPond.uploadSelfie instanceof File) {
//       formData.append("uploadSelfie", newPond.uploadSelfie);
//     } else if (newPond.uploadSelfieBuffer) {
//       // If updating and we have existing buffer, don't append (server will keep existing)
//     }

//     try {
//       setLoading(prev => ({ ...prev, addPond: true }));
//       const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Convert pond image buffers to base64 for display
//       const updatedPonds = res.data.farmer.ponds.map(pond => ({
//         ...pond,
//         pondImage: bufferToBase64(pond.pondImage)
//       }));
      
//       const updatedFarmer = {
//         ...res.data.farmer,
//         ponds: updatedPonds
//       };
      
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? updatedFarmer : f
//       ));
      
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       // Clear location states
//       setLatitude("");
//       setLongitude("");
//       // Clear selfie state
//       setSelfieFile(null);
//       setSelfiePreview(null);
//       // alert("Pond added successfully!");
//     } catch (err) {
//       console.error("Add Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, addPond: false }));
//     }
//   };

//   // Update Pond
//   const updatePond = async () => {
//     if (!currentFarmerId || !editingPondId) return;
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     // Add all pond fields including location
//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
//       'latitude', 'longitude', // Add location fields
//       'farmObservedDate', 'farmObservedTime',
//       'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
//       'pesticideRunoff', 'constructionNear', 'suddenTempChange',
//       'notes'
//     ];
    
//     for (let key of pondFields) {
//       if (newPond[key] !== undefined && newPond[key] !== null) {
//         formData.append(key, newPond[key].toString());
//       }
//     }
    
//     formData.append("symptomsObserved", symptomsStr);

//     // Handle files - only append if new ones are uploaded
//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     }

//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => {
//         if (f instanceof File) formData.append("pondFiles", f);
//       });
//     }

//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => {
//         if (f instanceof File) formData.append("fishFiles", f);
//       });
//     }

//     // Handle selfie - only append if new one is uploaded
//     if (selfieFile) {
//       formData.append("uploadSelfie", selfieFile);
//     }

//     try {
//       setLoading(prev => ({ ...prev, updatePond: true }));
//       const res = await api.put(`/api/farmers/update-pond/${currentFarmerId}/${editingPondId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Convert pond image buffers to base64 for display
//       const updatedPonds = res.data.farmer.ponds.map(pond => ({
//         ...pond,
//         pondImage: bufferToBase64(pond.pondImage)
//       }));
      
//       const updatedFarmer = {
//         ...res.data.farmer,
//         ponds: updatedPonds
//       };
      
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? updatedFarmer : f
//       ));
      
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setEditingPondId(null);
//       // Clear location states
//       setLatitude("");
//       setLongitude("");
//       // Clear selfie state
//       setSelfieFile(null);
//       setSelfiePreview(null);
//       // alert("Pond updated successfully!");
//     } catch (err) {
//       console.error("Update Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updatePond: false }));
//     }
//   };

//   // Edit Farmer
//   const openEdit = (farmer) => {
//     setIsUpdateMode(true);
//     const pre = { ...emptyFarmer };
    
//     // Copy all farmer data
//     Object.keys(pre).forEach(k => {
//       if (farmer[k] !== undefined && farmer[k] !== null) {
//         pre[k] = farmer[k];
//       }
//     });

//     // Store existing photo buffer and set photo preview
//     pre.photoBuffer = farmer.photo;
//     pre.photo = getFarmerImage(farmer); // Convert to base64 for preview

//     setNewFarmer(pre);
//     setEditingFarmerId(farmer._id);
//     setShowForm(true);
//   };

//   // Open Add Pond Form
//   const openAddPond = (farmerId) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(null);
//     setNewPond(emptyPond);
//     // Clear location states when opening new form
//     setLatitude("");
//     setLongitude("");
//     // Clear selfie states
//     setSelfieFile(null);
//     setSelfiePreview(null);
//     setShowPondForm(true);
//   };

//   // Open Edit Pond Form
//   const openEditPond = async (farmerId, pond) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(pond.pondId);
    
//     const pre = { ...emptyPond };
    
//     // Copy all pond data including location
//     Object.keys(pre).forEach(k => {
//       if (pond[k] !== undefined && pond[k] !== null && k !== 'pondImage' && k !== 'uploadSelfie') {
//         pre[k] = pond[k];
//       }
//     });

//     // Handle symptoms
//     if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
//       pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
//       pre.symptomsObserved = pond.symptomsObserved;
//     }

//     // Store existing buffers and set previews
//     pre.pondImageBuffer = pond.pondImage;
//     pre.pondImage = getPondImage(pond); // Convert to base64 for preview
    
//     pre.pondFilesBuffers = pond.pondFiles || [];
//     pre.fishFilesBuffers = pond.fishFiles || [];

//     // Load existing selfie if available
//     if (pond.uploadSelfie) {
//       pre.uploadSelfieBuffer = pond.uploadSelfie;
//       pre.uploadSelfie = bufferToBase64(pond.uploadSelfie);
//       setSelfiePreview(bufferToBase64(pond.uploadSelfie));
//     }

//     // Set location states
//     if (pond.latitude && pond.longitude) {
//       setLatitude(pond.latitude.toString());
//       setLongitude(pond.longitude.toString());
//     } else {
//       setLatitude("");
//       setLongitude("");
//     }

//     setNewPond(pre);
//     setShowPondForm(true);
//   };

//   const toggleSymptom = (s) => {
//     const arr = newPond.symptoms ? [...newPond.symptoms] : [];
//     const idx = arr.indexOf(s);
//     if (idx === -1) arr.push(s); else arr.splice(idx, 1);
//     setNewPond({ ...newPond, symptoms: arr, symptomsObserved: arr.join(", ") });
//   };

//   useEffect(() => {
//     const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";

//     const message = isFirstLogin
//       ? `Welcome, ${username}`
//       : `Welcome Back, ${username}`;

//     setWelcomeMsg(message);

//     if (isFirstLogin) {
//       localStorage.setItem("isFirstLogin", "false");
//     }
//   }, [username]);

//   // Handle photo file change for farmer
//   const handleFarmerPhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         const base64 = await fileToBase64(file);
//         setNewFarmer({ ...newFarmer, photo: base64 });
//       } catch (error) {
//         console.error("Error converting file to base64:", error);
//         setNewFarmer({ ...newFarmer, photo: file });
//       }
//     }
//   };

//   // Handle pond image file change
//   const handlePondImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         const base64 = await fileToBase64(file);
//         setNewPond({ ...newPond, pondImage: base64 });
//       } catch (error) {
//         console.error("Error converting file to base64:", error);
//         setNewPond({ ...newPond, pondImage: file });
//       }
//     }
//   };

//   // Handle pond files change
//   const handlePondFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPond({ ...newPond, pondFiles: files });
//   };

//   // Handle fish files change
//   const handleFishFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPond({ ...newPond, fishFiles: files });
//   };

//   // Handle selfie capture
//   const handleSelfieCapture = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         const base64 = await fileToBase64(file);
//         setSelfiePreview(base64);
//         setSelfieFile(file);
//         setNewPond({ ...newPond, uploadSelfie: file });
//       } catch (error) {
//         console.error("Error converting selfie to base64:", error);
//         setSelfieFile(file);
//         setSelfiePreview(null);
//         setNewPond({ ...newPond, uploadSelfie: file });
//       }
//     }
//   };

//   const totalFarmers = farmers.length;
//   const totalPonds = farmers.reduce((sum, f) => sum + Number(f.pondCount || 0), 0);

//   const [searchId, setSearchId] = useState("");

//   const handleSearch = async () => {
//     if (!searchId) {
//       await fetchFarmers();
//       return;
//     }

//     setLoading(prev => ({ ...prev, search: true }));
//     try {
//       const filtered = farmers.filter(f =>
//         f.farmerId.toLowerCase().includes(searchId.toLowerCase())
//       );

//       if (filtered.length > 0) {
//         const remaining = farmers.filter(f => !filtered.includes(f));
//         setFarmers([...filtered, ...remaining]);
//       } else {
//         await fetchFarmers();
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, search: false }));
//     }
//   };

//   // Loader component for buttons
//   const ButtonLoader = () => (
//     <Loader2 className="spin-loader" size={16} />
//   );

//   return (
//     <div className="dashboard-container">
//       {/* ================= MOBILE NAVBAR ================= */}
//       {isMobile && (
//         <div className="mobile-navbar">
//           <button 
//             className="mobile-menu-toggle"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             aria-label="Toggle menu"
//             disabled={loading.fetchFarmers}
//           >
//             {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
          
//           <div className="mobile-logo">
//             <h3>Dashboard</h3>
//           </div>
          
//           <div className="mobile-profile">
//             <img
//               src={getProfileImage(userId)}
//               alt="User"
//               className="mobile-profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//                 e.target.onerror = null;
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* ================= SIDEBAR ================= */}
//       <div className={`sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="profile-section text-center mb-4">
//             <img
//               src={getProfileImage(userId)}
//               alt="User"
//               className="profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//                 e.target.onerror = null;
//               }}
//             />
//             <h5>{username}</h5>
//           </div>
//         </div>

//         <ul className="menu">
//           <li>
//             <Link to="/profile" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <User size={18} /> {t('profile')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dashboard" className="menu-btn active" onClick={() => setIsSidebarOpen(false)}>
//               <Home size={18} /> {t('dashboard')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/helpcenter" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <HelpCircle size={18} /> {t('helpCenter')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dealers" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <ShoppingBag size={18} /> {t('dealers')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/agents" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <Users size={18} /> {t('agents')}
//             </Link>
//           </li>
//         </ul>

//         {/* ================= LANGUAGE ================= */}
//         <div className="language-section mb-4">
//           <h6>{t("chooseLanguage")}</h6>
//           <select
//             className="form-select form-select-sm"
//             value={i18n.language}
//             onChange={(e) => changeLanguage(e.target.value)}
//             disabled={loading.fetchFarmers}
//           >
//             <option value="en">English</option>
//             <option value="hi">हिन्दी</option>
//             <option value="bn">বাংলা</option>
//             <option value="as">অসমীয়া</option>
//             <option value="ta">தமிழ்</option>
//             <option value="kn">ಕನ್ನಡ</option>
//             <option value="mr">मराठी</option>
//           </select>
//         </div>
//       </div>

//       {/* ================= OVERLAY FOR MOBILE ================= */}
//       {isMobile && isSidebarOpen && (
//         <div 
//           className="sidebar-overlay"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}

//       {/* ================= RIGHT SECTION ================= */}
//       <div className={`right-section ${isMobile ? 'mobile-view' : ''}`}>
//         <div className="top-bar">
//           <h2>{welcomeMsg}</h2>
//           <button 
//             className="add-btn d-flex align-items-center gap-1"
//             onClick={() => { 
//               setShowForm(true); 
//               setEditingFarmerId(null); 
//               setNewFarmer(emptyFarmer);
//               setIsUpdateMode(false);
//             }}
//             disabled={loading.fetchFarmers}
//           >
//             + <span>{t('addFarmer')}</span>
//           </button>
//         </div>

//         {/* CARDS AND SEARCH SECTION */}
//         <div className="cards-and-search">
//           <div className="cards-section">
//             <div className="card">
//               <h5>{t('totalFarmers')}</h5>
//               <p className="display-6">
//                 {loading.fetchFarmers ? <ButtonLoader /> : totalFarmers}
//               </p>
//             </div>
//             <div className="card">
//               <h5>{t('totalPonds')}</h5>
//               <p className="display-6">
//                 {loading.fetchFarmers ? <ButtonLoader /> : totalPonds}
//               </p>
//             </div>
//           </div>

//           <div className="search-section d-flex gap-2">
//             <input
//               type="text"
//               placeholder={t('farmerSearchById')}
//               className="form-control"
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//               disabled={loading.search}
//             />

//             <button
//               className="btn btn-sm btn-primary"
//               onClick={handleSearch}
//               disabled={loading.search}
//             >
//               {loading.search ? <ButtonLoader /> : "Search"}
//             </button>
//           </div>
//         </div>

//         <div className="list-title">{t('farmersList')}</div>
//         <div className="farmers-list">
//           {loading.fetchFarmers ? (
//             <div className="text-center py-5">
//               <ButtonLoader />
//               <p>Loading farmers...</p>
//             </div>
//           ) : farmers.length === 0 ? (
//             <div className="text-center py-5">
//               <p>No farmers found. Add your first farmer!</p>
//             </div>
//           ) : (
//             farmers.map(f => (
//               <div key={f._id} className="farmer-box">
//                 <img
//                   src={getFarmerImage(f)}
//                   alt={f.name}
//                   className="profile-pic"
//                   loading="lazy"
//                   onError={(e) => {
//                     e.target.src = "/profile.png";
//                     e.target.onerror = null;
//                   }}
//                 />

//                 <div style={{ flex: 1 }}>
//                   <p><b>{t('farmerName')}:</b> {f.name}</p>
//                   <p><b>{t('farmerId')}:</b> {f.farmerId}</p>
//                   <p><b>{t('contactNumber')}:</b> {f.contact}</p>
//                   <p><b>{t('pondCount')}:</b> {f.pondCount}</p>
//                   <p className="updated-text" style={{ fontSize: "0.85rem" }}>
//                     <b>{t('updated')}:</b> {timeAgo(f.updatedAt || f.createdAt, t)}
//                   </p>
//                 </div>

//                 {/* Pond List with Update Buttons */}
//                 {f.ponds && f.ponds.length > 0 && (
//                   <div style={{ marginTop: 10, width: "100%" }}>
//                     <h6>Pond List</h6>
//                     <button 
//                       className="btn btn-sm btn-success mb-2"
//                       onClick={() => openAddPond(f._id)}
//                       disabled={loading.addPond}
//                     >
//                       {loading.addPond ? <ButtonLoader /> : "+ Add Pond"}
//                     </button>
                    
//                     {/* Desktop Table View */}
//                     <div className="table-container">
//                       <table className="table table-sm table-bordered">
//                         <thead>
//                           <tr>
//                             <th>Pond No.</th>
//                             <th>Pond ID</th>
//                             <th>Species</th>
//                             <th>Selfie</th>
//                             <th>Last Updated</th>
//                             <th>Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {f.ponds.map((pond, index) => (
//                             <tr key={pond.pondId}>
//                               <td>{pond.pondNumber || index + 1}</td>
//                               <td>{pond.pondId}</td>
//                               <td>{pond.species || "Not specified"}</td>
//                               <td>
//                                 {pond.uploadSelfie && (
//                                   <img
//                                     src={bufferToBase64(pond.uploadSelfie)}
//                                     alt="Selfie"
//                                     style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
//                                     onClick={() => window.open(bufferToBase64(pond.uploadSelfie), '_blank')}
//                                     title="Click to view selfie"
//                                   />
//                                 )}
//                               </td>
//                               <td>{timeAgo(pond.updatedAt || pond.createdAt, t)}</td>
//                               <td>
//                                 <button 
//                                   className="btn btn-sm btn-primary"
//                                   onClick={() => openEditPond(f._id, pond)}
//                                   disabled={loading.updatePond}
//                                 >
//                                   {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
                    
//                     {/* Mobile Card View */}
//                     <div className="mobile-pond-view">
//                       {f.ponds.map((pond, index) => (
//                         <div key={pond.pondId} className="mobile-pond-card">
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Pond No.</span>
//                             <span className="mobile-pond-value">{pond.pondNumber || index + 1}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Pond ID</span>
//                             <span className="mobile-pond-value">{pond.pondId}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Species</span>
//                             <span className="mobile-pond-value">{pond.species || "Not specified"}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Selfie</span>
//                             <span className="mobile-pond-value">
//                               {pond.uploadSelfie && (
//                                 <img
//                                   src={bufferToBase64(pond.uploadSelfie)}
//                                   alt="Selfie"
//                                   style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
//                                   onClick={() => window.open(bufferToBase64(pond.uploadSelfie), '_blank')}
//                                   title="Click to view selfie"
//                                 />
//                               )}
//                             </span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Last Updated</span>
//                             <span className="mobile-pond-value">{timeAgo(pond.updatedAt || pond.createdAt, t)}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Actions</span>
//                             <span className="mobile-pond-value">
//                               <button 
//                                 className="btn btn-sm btn-primary"
//                                 onClick={() => openEditPond(f._id, pond)}
//                                 style={{ width: "100%", marginTop: "4px" }}
//                                 disabled={loading.updatePond}
//                               >
//                                 {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                               </button>
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* If no ponds, show Add Pond button */}
//                 {(!f.ponds || f.ponds.length === 0) && (
//                   <div style={{ marginTop: 10 }}>
//                     <button 
//                       className="btn btn-sm btn-success"
//                       onClick={() => openAddPond(f._id)}
//                       disabled={loading.addPond}
//                     >
//                       {loading.addPond ? <ButtonLoader /> : "+ Add First Pond"}
//                     </button>
//                   </div>
//                 )}

//                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                   <button 
//                     className="btn btn-sm btn-outline-primary" 
//                     onClick={() => openEdit(f)}
//                     disabled={loading.updateFarmer}
//                   >
//                     {loading.updateFarmer ? <ButtonLoader /> : t('updateFarmer')}
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Farmer Modal Form */}
//       {showForm && (
//         <div className="form-modal">
//           <div className="form-box" style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}>
//             <h5>{isUpdateMode ? "Update Farmer" : t('addFarmer')}</h5>
            
//             <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
//               <h6>Farmer Details (All fields are required)</h6>
//               <div className="row g-2">
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Name *" 
//                     value={newFarmer.name} 
//                     onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Contact Number *" 
//                     value={newFarmer.contact} 
//                     onChange={e => setNewFarmer({ ...newFarmer, contact: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>
                
//                 <div className="col-md-3">
//                   <input 
//                     type="number" 
//                     className="form-control" 
//                     placeholder="Age *" 
//                     value={newFarmer.age} 
//                     onChange={e => setNewFarmer({ ...newFarmer, age: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <select 
//                     className="form-control" 
//                     value={newFarmer.gender} 
//                     onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   >
//                     <option value="">Select Gender *</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Aadhar *" 
//                     value={newFarmer.adhar} 
//                     onChange={e => setNewFarmer({ ...newFarmer, adhar: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Members *" 
//                     value={newFarmer.familyMembers} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyMembers: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Occupation *" 
//                     value={newFarmer.familyOccupation} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyOccupation: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Address *" 
//                     value={newFarmer.village} 
//                     onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-12">
//                   <label>Farmer Photo (required) *</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     accept="image/*,video/*"
//                     capture="environment"
//                     onChange={handleFarmerPhotoChange}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required={!isUpdateMode}
//                   />

//                   {/* Show current photo preview */}
//                   {newFarmer.photo && (
//                     <div style={{ marginTop: 6 }}>
//                       <img
//                         src={newFarmer.photo}
//                         alt="Preview"
//                         style={{ width: 80, height: 80, borderRadius: "50%" }}
//                         onError={(e) => {
//                           e.target.src = "/profile.png";
//                           e.target.onerror = null;
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//               {isUpdateMode ? (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={updateFarmer}
//                     disabled={loading.updateFarmer}
//                   >
//                     {loading.updateFarmer ? <ButtonLoader /> : "Update Farmer"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowForm(false); 
//                       setEditingFarmerId(null); 
//                       setNewFarmer(emptyFarmer);
//                       setIsUpdateMode(false);
//                     }}
//                     disabled={loading.updateFarmer}
//                   >
//                     {t('cancel')}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={addFarmer}
//                     disabled={loading.addFarmer}
//                   >
//                     {loading.addFarmer ? <ButtonLoader /> : t('submit')}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowForm(false); 
//                       setNewFarmer(emptyFarmer);
//                     }}
//                     disabled={loading.addFarmer}
//                   >
//                     {t('cancel')}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pond Modal Form */}
//       {showPondForm && (
//         <div className="form-modal">
//           <div className="form-box" style={{ width: "850px", maxHeight: "90vh", overflowY: "auto" }}>
//             <h5>{editingPondId ? "Update Pond" : "Add New Pond"}</h5>

//             {/* UPDATED MODAL FORM GRID */}
//             <div className="modal-form-grid">
              
//               {/* Pond Details */}
//               <div className="modal-section">
//                 <h6>Pond Details (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond area (eg. 1 acre) *" 
//                       value={newPond.pondArea} 
//                       onChange={e => setNewPond({ ...newPond, pondArea: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-2">
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondAreaUnit} 
//                       onChange={e => setNewPond({ ...newPond, pondAreaUnit: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option value="acre">acre</option>
//                       <option value="hectare">hectare</option>
//                       <option value="footsquare">footsquare</option>
//                     </select>
//                   </div>
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond depth (ft) *" 
//                       value={newPond.pondDepth} 
//                       onChange={e => setNewPond({ ...newPond, pondDepth: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond image (GPS) - required *</label>
//                     <input 
//                       type="file"
//                       className="form-control"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       onChange={handlePondImageChange}
//                       disabled={loading.addPond || loading.updatePond}
//                       required={!editingPondId}
//                     />

//                     {newPond.pondImage && (
//                       <div style={{ marginTop: 6 }}>
//                         <img
//                           src={newPond.pondImage}
//                           alt="Pond preview"
//                           style={{ width: 80, height: 80, borderRadius: "4px" }}
//                           onError={(e) => {
//                             e.target.src = "/profile.png";
//                             e.target.onerror = null;
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload Pond Picture/Video (required) *</label>
//                     <input 
//                       type="file"
//                       className="form-control"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       multiple
//                       onChange={handlePondFilesChange}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
                    
//                     {newPond.pondFiles && newPond.pondFiles.length > 0 && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>{newPond.pondFiles.length} file(s) selected</small>
//                       </div>
//                     )}

//                   </div>

//                   <div className="col-md-6">
//                     <label>Overflow from somewhere in pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.overflow} 
//                       onChange={e => setNewPond({ ...newPond, overflow: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond receives proper Sunlight? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.receivesSunlight} 
//                       onChange={e => setNewPond({ ...newPond, receivesSunlight: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Trees present on banks? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.treesOnBanks} 
//                       onChange={e => setNewPond({ ...newPond, treesOnBanks: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Neighbourhood *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.neighbourhood} 
//                       onChange={e => setNewPond({ ...newPond, neighbourhood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Agriculture Farm</option>
//                       <option>Pond</option>
//                       <option>Road</option>
//                       <option>Residential Area</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Does wastewater enter pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.wastewaterEnters} 
//                       onChange={e => setNewPond({ ...newPond, wastewaterEnters: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Location Section */}
//               <div className="modal-section">
//                 <h6>Location (Required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-12 mb-2">
//                     <button 
//                       type="button"
//                       className="btn btn-primary w-45 d-flex align-items-center justify-content-center gap-2"
//                       onClick={getLocation}
//                       disabled={isGettingLocation || loading.addPond || loading.updatePond}
//                     >
//                       {isGettingLocation ? <ButtonLoader /> : <MapPin size={16} />}
//                       {isGettingLocation ? "Getting Location..." : "📍 Open My Location"}
//                     </button>
//                     {/* <small className="text-muted">Click to capture your current GPS location</small> */}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Latitude *</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newPond.latitude || ""}
//                       readOnly
//                       placeholder="Latitude will auto-fill"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Longitude *</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newPond.longitude || ""}
//                       readOnly
//                       placeholder="Longitude will auto-fill"
//                       required
//                     />
//                   </div>

//                   {(newPond.latitude || newPond.longitude) && (
//                     <div className="col-md-12">
//                       <button
//                         type="button"
//                         className="btn btn-outline-secondary btn-sm"
//                         onClick={clearLocation}
//                         disabled={loading.addPond || loading.updatePond}
//                       >
//                         Clear Location
//                       </button>
//                       <small className="text-success ms-2">
//                         ✓ Location captured: {newPond.latitude}, {newPond.longitude}
//                       </small>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Species & Stocking */}
//               <div className="modal-section">
//                 <h6>Species & Stocking (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Fish Species Cultured *" 
//                       value={newPond.species} 
//                       onChange={e => setNewPond({ ...newPond, species: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label>Date of Stocking *</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.dateOfStocking} 
//                       onChange={e => setNewPond({ ...newPond, dateOfStocking: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="text"
//                       className="form-control" 
//                       placeholder="Quantity of Seed initially in Pond *" 
//                       value={newPond.qtySeedInitially} 
//                       onChange={e => setNewPond({ ...newPond, qtySeedInitially: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       type="text"
//                       className="form-control" 
//                       placeholder="Current Quantity of Fish in Pond *" 
//                       value={newPond.currentQty} 
//                       onChange={e => setNewPond({ ...newPond, currentQty: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Average size of fishes *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.avgSize} 
//                       onChange={e => setNewPond({ ...newPond, avgSize: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>&gt;200gram</option>
//                       <option>200-500 gram</option>
//                       <option>500-750 gram</option>
//                       <option>&lt;750gram</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Feed Details */}
//               <div className="modal-section">
//                 <h6>Feed Details (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <label>Feed Type Used *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedType} 
//                       onChange={e => setNewPond({ ...newPond, feedType: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Market Feed</option>
//                       <option>Homemade Feed</option>
//                       <option>Both</option>
//                       <option>Other</option>
//                     </select>
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="If Other, mention" 
//                       value={newPond.feedOther} 
//                       onChange={e => setNewPond({ ...newPond, feedOther: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Feed frequency *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedFreq} 
//                       onChange={e => setNewPond({ ...newPond, feedFreq: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Once a day</option>
//                       <option>twice a day</option>
//                       <option>thrice a day</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Feed quantity given per day (in kg) *" 
//                       value={newPond.feedQtyPerDay} 
//                       onChange={e => setNewPond({ ...newPond, feedQtyPerDay: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Approx time of feeding *</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.feedTime} 
//                       onChange={e => setNewPond({ ...newPond, feedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Any recent changes in feed or feeding behaviour *" 
//                       value={newPond.recentFeedChanges} 
//                       onChange={e => setNewPond({ ...newPond, recentFeedChanges: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Do fish show reduced appetite? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.reducedAppetite} 
//                       onChange={e => setNewPond({ ...newPond, reducedAppetite: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Water Quality */}
//               <div className="modal-section">
//                 <h6>Water Quality (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="Water Temp (°C) *" 
//                       value={newPond.waterTemperature} 
//                       onChange={e => setNewPond({ ...newPond, waterTemperature: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="pH measured *" 
//                       value={newPond.pH} 
//                       onChange={e => setNewPond({ ...newPond, pH: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="DO measured *" 
//                       value={newPond.DO} 
//                       onChange={e => setNewPond({ ...newPond, DO: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <label>Ammonia (NH₃) Level *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.ammoniaLevel} 
//                       onChange={e => setNewPond({ ...newPond, ammoniaLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Phytoplankton Levels *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.phytoplanktonLevel} 
//                       onChange={e => setNewPond({ ...newPond, phytoplanktonLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Water Hardness *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.waterHardness} 
//                       onChange={e => setNewPond({ ...newPond, waterHardness: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Any visible algae bloom? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.algaeBloom} 
//                       onChange={e => setNewPond({ ...newPond, algaeBloom: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Pond Water Colour *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondWaterColor} 
//                       onChange={e => setNewPond({ ...newPond, pondWaterColor: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Light Green</option><option>Dark Green</option><option>Yellowish Green</option>
//                       <option>Brownish Green</option><option>Yellow</option><option>Muddy Brown</option>
//                       <option>Black</option><option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Source of Water *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.sourceOfWater} 
//                       onChange={e => setNewPond({ ...newPond, sourceOfWater: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Rainwater</option><option>Pump</option><option>River</option><option>Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Disease & Symptoms */}
//               <div className="modal-section">
//                 <h6>Disease & Symptoms (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <label>Any disease symptoms? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.diseaseSymptoms} 
//                       onChange={e => setNewPond({ ...newPond, diseaseSymptoms: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   {/* SYMPTOMS SECTION */}
//                   <div className="col-md-12">
//                     <label>Symptoms observed (check / or type) *</label>
//                     <div className="symptoms-grid">
//                       {SYMPTOMS_LIST.map(s => (
//                         <label key={s} className="symptom-checkbox">
//                           <input 
//                             type="checkbox" 
//                             checked={newPond.symptoms?.includes(s)} 
//                             onChange={() => toggleSymptom(s)} 
//                             disabled={loading.addPond || loading.updatePond}
//                           /> 
//                           <span>{s}</span>
//                         </label>
//                       ))}
//                     </div>
//                     <div style={{ marginTop: 8 }}>
//                       <input 
//                         className="form-control" 
//                         placeholder="Or type symptoms comma separated *" 
//                         value={newPond.symptomsObserved} 
//                         onChange={e => setNewPond({ ...newPond, symptomsObserved: e.target.value })}
//                         disabled={loading.addPond || loading.updatePond}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="How many fish have died last 15 days(cumulative)? *" 
//                       value={newPond.fishDeaths} 
//                       onChange={e => setNewPond({ ...newPond, fishDeaths: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Are symptoms affecting all fish or only a few? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.symptomsAffect} 
//                       onChange={e => setNewPond({ ...newPond, symptomsAffect: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>All</option><option>Few</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload fish images/videos (required) *</label>
//                     <input
//                       type="file"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       multiple
//                       className="form-control"
//                       onChange={handleFishFilesChange}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {newPond.fishFiles && newPond.fishFiles.length > 0 && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>{newPond.fishFiles.length} file(s) selected</small>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Selfie Upload Section - NOW OPTIONAL */}
//               <div className="modal-section">
//                 <h6>Selfie with Fish/Pond (Optional)</h6>  {/* ← Changed text to Optional */}
//                 <div className="row g-2">
//                   <div className="col-md-12">
//                     <label>Upload Your Selfie with Fish/Pond</label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       accept="image/*"
//                       capture="user"  // This opens front camera for selfie
//                       onChange={handleSelfieCapture}
//                       disabled={loading.addPond || loading.updatePond}
//                       // required={!editingPondId}  {/* ← COMMENTED OUT OR REMOVED THIS LINE */}
//                     />
                    
//                     {selfiePreview && (
//                       <div style={{ marginTop: 10, textAlign: 'center' }}>
//                         <p>Selfie Preview:</p>
//                         <img
//                           src={selfiePreview}
//                           alt="Selfie preview"
//                           style={{ 
//                             width: 150, 
//                             height: 150, 
//                             borderRadius: '8px',
//                             objectFit: 'cover',
//                             border: '2px solid #28a745'
//                           }}
//                           onError={(e) => {
//                             e.target.src = "/profile.png";
//                             e.target.onerror = null;
//                           }}
//                         />
//                       </div>
//                     )}
                    
//                     {!selfiePreview && newPond.uploadSelfieBuffer && editingPondId && (
//                       <div style={{ marginTop: 10, textAlign: 'center' }}>
//                         <p>Current Selfie:</p>
//                         <img
//                           src={bufferToBase64(newPond.uploadSelfieBuffer)}
//                           alt="Current selfie"
//                           style={{ 
//                             width: 150, 
//                             height: 150, 
//                             borderRadius: '8px',
//                             objectFit: 'cover',
//                             border: '2px solid #17a2b8'
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Observation & Misc */}
//               <div className="modal-section">
//                 <h6>Observation & Misc (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <label>Date of Farm Observed *</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.farmObservedDate} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedDate: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label>Time of Farm Observed *</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.farmObservedTime} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Which species farmer cultured last time? *</label>
//                     <input 
//                       className="form-control" 
//                       value={newPond.lastSpecies} 
//                       onChange={e => setNewPond({ ...newPond, lastSpecies: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Does farmer completely harvest the last crop? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.lastHarvestComplete} 
//                       onChange={e => setNewPond({ ...newPond, lastHarvestComplete: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any recent heavy rains or floods? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.recentRainFlood} 
//                       onChange={e => setNewPond({ ...newPond, recentRainFlood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any pesticide/chemical runoff near pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pesticideRunoff} 
//                       onChange={e => setNewPond({ ...newPond, pesticideRunoff: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any construction/activity near pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.constructionNear} 
//                       onChange={e => setNewPond({ ...newPond, constructionNear: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any sudden temperature change recently? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.suddenTempChange} 
//                       onChange={e => setNewPond({ ...newPond, suddenTempChange: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-12">
//                     <label>Notes / Remarks *</label>
//                     <textarea 
//                       className="form-control" 
//                       rows={3} 
//                       value={newPond.notes} 
//                       onChange={e => setNewPond({ ...newPond, notes: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     ></textarea>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//               {editingPondId ? (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={updatePond}
//                     disabled={loading.updatePond}
//                   >
//                     {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowPondForm(false); 
//                       setNewPond(emptyPond);
//                       setCurrentFarmerId(null);
//                       setEditingPondId(null);
//                       // Clear location states
//                       setLatitude("");
//                       setLongitude("");
//                       // Clear selfie state
//                       setSelfieFile(null);
//                       setSelfiePreview(null);
//                     }}
//                     disabled={loading.updatePond}
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={addPond}
//                     disabled={loading.addPond}
//                   >
//                     {loading.addPond ? <ButtonLoader /> : "Add Pond"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowPondForm(false); 
//                       setNewPond(emptyPond);
//                       setCurrentFarmerId(null);
//                       // Clear location states
//                       setLatitude("");
//                       setLongitude("");
//                       // Clear selfie state
//                       setSelfieFile(null);
//                       setSelfiePreview(null);
//                     }}
//                     disabled={loading.addPond}
//                   >
//                     Cancel
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MainPage;



// // // ye selfi ke 















































// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./mainPage.css";
// import api, { getImageUrl, getProfileImage } from "../utils/api";

// // Import Lucide icons
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2, MapPin } from "lucide-react";

// function timeAgo(dateStr, t) {
//   if (!dateStr) return t('notUpdated');
//   const now = new Date();
//   const d = new Date(dateStr);
//   const diffMs = now - d;
//   const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//   if (days === 0) return t('today');
//   if (days === 1) return t('oneDayAgo');
//   return t('daysAgo', { count: days });
// }

// const SYMPTOMS_LIST = [
//   "Erratic swimming", "Loss of appetite", "Gasping at surface",
//   "Lesions or ulcers", "Fin rot", "Fish Lice",
//   "Discoloration or white patches", "Scale loss", "Swollen abdomen",
//   "Fungal/cotton-like growth", "Flared gills", "Mucus secretion",
//   "Blood spots", "Other"
// ];

// // SIMPLE IMAGE HELPERS
// const getFarmerImage = (farmer) => {
//   return getImageUrl(farmer?.photo);
// };

// const getPondImage = (pond) => {
//   return getImageUrl(pond?.pondImage);
// };

// const getSelfieImage = (pond) => {
//   return getImageUrl(pond?.uploadSelfie);
// };

// function MainPage() {
//   const { t, i18n } = useTranslation();
//   const username = localStorage.getItem("username") || "User";
//   const userId = localStorage.getItem("userId");

//   const [farmers, setFarmers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [showPondForm, setShowPondForm] = useState(false);
//   const [editingFarmerId, setEditingFarmerId] = useState(null);
//   const [editingPondId, setEditingPondId] = useState(null);
//   const [currentFarmerId, setCurrentFarmerId] = useState(null);
//   const [welcomeMsg, setWelcomeMsg] = useState("");
//   const [isUpdateMode, setIsUpdateMode] = useState(false);

//   // Location states
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   // Selfie states
//   const [selfieFile, setSelfieFile] = useState(null);
//   const [selfiePreview, setSelfiePreview] = useState(null);

//   // Loading states
//   const [loading, setLoading] = useState({
//     fetchFarmers: false,
//     addFarmer: false,
//     updateFarmer: false,
//     addPond: false,
//     updatePond: false,
//     deleteFarmer: false,
//     deletePond: false,
//     search: false
//   });
  
//   // Mobile sidebar states
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Farmer form empty state
//   const emptyFarmer = {
//     name: "", contact: "", age: "", gender: "", village: "",
//     pondCount: "0", adhar: "", familyMembers: "", familyOccupation: "",
//     photo: null,
//   };

//   // Pond form empty state
//   const emptyPond = {
//     pondArea: "", pondAreaUnit: "acre", pondDepth: "", pondImage: null,
//     overflow: "No", receivesSunlight: "Yes", treesOnBanks: "No",
//     neighbourhood: "Agriculture Farm", wastewaterEnters: "No",
//     species: "", dateOfStocking: "", qtySeedInitially: "", 
//     currentQty: "", avgSize: ">200gram",
//     feedType: "Market Feed", feedOther: "", feedFreq: "Once a day", 
//     feedQtyPerDay: "", feedTime: "6:00 am-10:00am",
//     recentFeedChanges: "", reducedAppetite: "No",
//     waterTemperature: "", pH: "", DO: "", ammoniaLevel: "Medium", 
//     phytoplanktonLevel: "Medium", waterHardness: "1",
//     algaeBloom: "No", pondWaterColor: "Light Green", sourceOfWater: "Rainwater",
//     diseaseSymptoms: "No", symptomsObserved: "", symptoms: [],
//     symptomsAffect: "All", fishDeaths: "",
//     latitude: "", longitude: "",
//     farmObservedDate: "", farmObservedTime: "",
//     lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
//     pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No",
//     notes: "",
//     pondFiles: [],
//     fishFiles: [],
//     uploadSelfie: null,
//   };

//   const [newFarmer, setNewFarmer] = useState(emptyFarmer);
//   const [newPond, setNewPond] = useState(emptyPond);

//   // Check if mobile view
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 991);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMobile && isSidebarOpen && 
//           !event.target.closest('.sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Fetch data
//   useEffect(() => {
//     if (!userId) {
//       console.error("UserId not found in localStorage");
//       return;
//     }
//     fetchFarmers();
//     const savedLang = localStorage.getItem("lang");
//     if (savedLang) i18n.changeLanguage(savedLang);
//   }, [userId]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   const fetchFarmers = async () => {
//     try {
//       setLoading(prev => ({ ...prev, fetchFarmers: true }));
//       const res = await api.get(`/api/farmers/all?userId=${userId}`);
//       console.log("Farmers data received:", res.data);
//       setFarmers(res.data || []);
//     } catch (err) {
//       console.error("Fetch Farmers Error:", err);
//     } finally {
//       setLoading(prev => ({ ...prev, fetchFarmers: false }));
//     }
//   };

//   // Convert File to Base64 for preview ONLY
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   // Get Location Function
//   const getLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return;
//     }
//     setIsGettingLocation(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;
//         setLatitude(lat.toString());
//         setLongitude(lng.toString());
//         setNewPond({ ...newPond, latitude: lat.toString(), longitude: lng.toString() });
//         setIsGettingLocation(false);
//       },
//       (error) => {
//         setIsGettingLocation(false);
//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             alert("Location access denied. Please enable location permissions.");
//             break;
//           case error.POSITION_UNAVAILABLE:
//             alert("Location information unavailable.");
//             break;
//           case error.TIMEOUT:
//             alert("Location request timed out.");
//             break;
//           default:
//             alert("An unknown error occurred.");
//             break;
//         }
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
//     );
//   };

//   // Clear Location
//   const clearLocation = () => {
//     setLatitude("");
//     setLongitude("");
//     setNewPond({ ...newPond, latitude: "", longitude: "" });
//   };

//   // Add Farmer
//   const addFarmer = async () => {
//     if (!newFarmer.name || !newFarmer.contact || !newFarmer.age || 
//         !newFarmer.gender || !newFarmer.adhar || !newFarmer.familyMembers || 
//         !newFarmer.familyOccupation || !newFarmer.village) {
//       return alert("Please fill all required fields: Name, Contact, Age, Gender, Aadhar, Family Members, Family Occupation, Village");
//     }
    
//     if (!newFarmer.photo) {
//       return alert("Farmer photo is required");
//     }
    
//     const formData = new FormData();
//     const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
//                          'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
//     farmerFields.forEach(field => {
//       if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
//         formData.append(field, newFarmer[field].toString());
//       }
//     });
    
//     formData.append("userId", userId);
//     formData.append("createdBy", userId);
    
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     }

//     try {
//       setLoading(prev => ({ ...prev, addFarmer: true }));
//       const res = await api.post(`/api/farmers/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       setFarmers([...farmers, res.data]);
//       setShowForm(false);
//       setNewFarmer(emptyFarmer);
//     } catch (err) {
//       console.error("Add Farmer Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, addFarmer: false }));
//     }
//   };

//   // Update Farmer
//   const updateFarmer = async () => {
//     if (!editingFarmerId) return;
    
//     const formData = new FormData();
//     const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
//                          'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
//     farmerFields.forEach(field => {
//       if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
//         formData.append(field, newFarmer[field].toString());
//       }
//     });
    
//     formData.append("userId", userId);
    
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     }

//     try {
//       setLoading(prev => ({ ...prev, updateFarmer: true }));
//       const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       setFarmers(farmers.map(f => f._id === res.data._id ? res.data : f));
//       setShowForm(false);
//       setEditingFarmerId(null);
//       setNewFarmer(emptyFarmer);
//       setIsUpdateMode(false);
//     } catch (err) {
//       console.error("Update Farmer Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updateFarmer: false }));
//     }
//   };

//   // Add Pond to Farmer
//   const addPond = async () => {
//     if (!currentFarmerId) return alert("Farmer ID missing");
    
//     const requiredPondFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
//       'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
//       'farmObservedDate', 'farmObservedTime'
//     ];
    
//     for (const field of requiredPondFields) {
//       if (!newPond[field]) {
//         return alert(`Please fill required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//       }
//     }
    
//     if (!newPond.latitude || !newPond.longitude) {
//       return alert("Please capture location by clicking 'Open My Location' button");
//     }
    
//     if (!newPond.pondImage) {
//       return alert("Pond image is required");
//     }
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
//       'latitude', 'longitude',
//       'farmObservedDate', 'farmObservedTime',
//       'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
//       'pesticideRunoff', 'constructionNear', 'suddenTempChange',
//       'notes'
//     ];
    
//     for (let key of pondFields) {
//       if (newPond[key] !== undefined && newPond[key] !== null) {
//         formData.append(key, newPond[key].toString());
//       }
//     }
    
//     formData.append("symptomsObserved", symptomsStr);

//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     }

//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => {
//         if (f instanceof File) formData.append("pondFiles", f);
//       });
//     }

//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => {
//         if (f instanceof File) formData.append("fishFiles", f);
//       });
//     }

//     if (selfieFile) {
//       formData.append("uploadSelfie", selfieFile);
//     }

//     try {
//       setLoading(prev => ({ ...prev, addPond: true }));
//       const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       setFarmers(farmers.map(f => f._id === currentFarmerId ? res.data.farmer : f));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setLatitude("");
//       setLongitude("");
//       setSelfieFile(null);
//       setSelfiePreview(null);
//     } catch (err) {
//       console.error("Add Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, addPond: false }));
//     }
//   };

//   // Update Pond
//   const updatePond = async () => {
//     if (!currentFarmerId || !editingPondId) return;
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
//       'latitude', 'longitude',
//       'farmObservedDate', 'farmObservedTime',
//       'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
//       'pesticideRunoff', 'constructionNear', 'suddenTempChange',
//       'notes'
//     ];
    
//     for (let key of pondFields) {
//       if (newPond[key] !== undefined && newPond[key] !== null) {
//         formData.append(key, newPond[key].toString());
//       }
//     }
    
//     formData.append("symptomsObserved", symptomsStr);

//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     }

//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => {
//         if (f instanceof File) formData.append("pondFiles", f);
//       });
//     }

//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => {
//         if (f instanceof File) formData.append("fishFiles", f);
//       });
//     }

//     if (selfieFile) {
//       formData.append("uploadSelfie", selfieFile);
//     }

//     try {
//       setLoading(prev => ({ ...prev, updatePond: true }));
//       const res = await api.put(`/api/farmers/update-pond/${currentFarmerId}/${editingPondId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       setFarmers(farmers.map(f => f._id === currentFarmerId ? res.data.farmer : f));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setEditingPondId(null);
//       setLatitude("");
//       setLongitude("");
//       setSelfieFile(null);
//       setSelfiePreview(null);
//     } catch (err) {
//       console.error("Update Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updatePond: false }));
//     }
//   };

//   // Edit Farmer
//   const openEdit = (farmer) => {
//     setIsUpdateMode(true);
//     setNewFarmer({
//       ...emptyFarmer,
//       ...farmer,
//       photo: null
//     });
//     setEditingFarmerId(farmer._id);
//     setShowForm(true);
//   };

//   // Open Add Pond Form
//   const openAddPond = (farmerId) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(null);
//     setNewPond(emptyPond);
//     setLatitude("");
//     setLongitude("");
//     setSelfieFile(null);
//     setSelfiePreview(null);
//     setShowPondForm(true);
//   };

//   // Open Edit Pond Form
//   const openEditPond = async (farmerId, pond) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(pond.pondId);
    
//     const pre = { ...emptyPond, ...pond };
    
//     if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
//       pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
//     }

//     if (pond.uploadSelfie) {
//       setSelfiePreview(getImageUrl(pond.uploadSelfie));
//     }

//     if (pond.latitude && pond.longitude) {
//       setLatitude(pond.latitude.toString());
//       setLongitude(pond.longitude.toString());
//     }

//     setNewPond(pre);
//     setShowPondForm(true);
//   };

//   const toggleSymptom = (s) => {
//     const arr = newPond.symptoms ? [...newPond.symptoms] : [];
//     const idx = arr.indexOf(s);
//     if (idx === -1) arr.push(s); else arr.splice(idx, 1);
//     setNewPond({ ...newPond, symptoms: arr, symptomsObserved: arr.join(", ") });
//   };

//   useEffect(() => {
//     const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";
//     const message = isFirstLogin
//       ? `Welcome, ${username}`
//       : `Welcome Back, ${username}`;
//     setWelcomeMsg(message);
//     if (isFirstLogin) {
//       localStorage.setItem("isFirstLogin", "false");
//     }
//   }, [username]);

//   const handleFarmerPhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewFarmer({ ...newFarmer, photo: file });
//     }
//   };

//   const handlePondImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewPond({ ...newPond, pondImage: file });
//     }
//   };

//   const handlePondFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPond({ ...newPond, pondFiles: files });
//   };

//   const handleFishFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPond({ ...newPond, fishFiles: files });
//   };

//   const handleSelfieCapture = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const base64 = await fileToBase64(file);
//       setSelfiePreview(base64);
//       setSelfieFile(file);
//       setNewPond({ ...newPond, uploadSelfie: file });
//     }
//   };

//   const totalFarmers = farmers.length;
//   const totalPonds = farmers.reduce((sum, f) => sum + Number(f.pondCount || 0), 0);

//   const [searchId, setSearchId] = useState("");

//   const handleSearch = async () => {
//     if (!searchId) {
//       await fetchFarmers();
//       return;
//     }
//     setLoading(prev => ({ ...prev, search: true }));
//     try {
//       const filtered = farmers.filter(f =>
//         f.farmerId.toLowerCase().includes(searchId.toLowerCase())
//       );
//       if (filtered.length > 0) {
//         const remaining = farmers.filter(f => !filtered.includes(f));
//         setFarmers([...filtered, ...remaining]);
//       } else {
//         await fetchFarmers();
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, search: false }));
//     }
//   };

//   const ButtonLoader = () => (
//     <Loader2 className="spin-loader" size={16} />
//   );

//   return (
//     <div className="dashboard-container">
//       {/* Mobile Navbar */}
//       {isMobile && (
//         <div className="mobile-navbar">
//           <button 
//             className="mobile-menu-toggle"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             aria-label="Toggle menu"
//             disabled={loading.fetchFarmers}
//           >
//             {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//           <div className="mobile-logo">
//             <h3>Dashboard</h3>
//           </div>
//           <div className="mobile-profile">
//             <img
//               src={getProfileImage(userId)}
//               alt="User"
//               className="mobile-profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Sidebar */}
//       <div className={`sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="profile-section text-center mb-4">
//             <img
//               src={getProfileImage(userId)}
//               alt="User"
//               className="profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5>{username}</h5>
//           </div>
//         </div>

//         <ul className="menu">
//           <li>
//             <Link to="/profile" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <User size={18} /> {t('profile')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dashboard" className="menu-btn active" onClick={() => setIsSidebarOpen(false)}>
//               <Home size={18} /> {t('dashboard')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/helpcenter" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <HelpCircle size={18} /> {t('helpCenter')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dealers" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <ShoppingBag size={18} /> {t('dealers')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/agents" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <Users size={18} /> {t('agents')}
//             </Link>
//           </li>
//         </ul>

//         {/* Language Selector */}
//         <div className="language-section mb-4">
//           <h6>{t("chooseLanguage")}</h6>
//           <select
//             className="form-select form-select-sm"
//             value={i18n.language}
//             onChange={(e) => changeLanguage(e.target.value)}
//             disabled={loading.fetchFarmers}
//           >
//             <option value="en">English</option>
//             <option value="hi">हिन्दी</option>
//             <option value="bn">বাংলা</option>
//             <option value="as">অসমীয়া</option>
//             <option value="ta">தமிழ்</option>
//             <option value="kn">ಕನ್ನಡ</option>
//             <option value="mr">मराठी</option>
//           </select>
//         </div>
//       </div>

//       {/* Overlay for Mobile */}
//       {isMobile && isSidebarOpen && (
//         <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
//       )}

//       {/* Right Section */}
//       <div className={`right-section ${isMobile ? 'mobile-view' : ''}`}>
//         <div className="top-bar">
//           <h2>{welcomeMsg}</h2>
//           <button 
//             className="add-btn d-flex align-items-center gap-1"
//             onClick={() => { 
//               setShowForm(true); 
//               setEditingFarmerId(null); 
//               setNewFarmer(emptyFarmer);
//               setIsUpdateMode(false);
//             }}
//             disabled={loading.fetchFarmers}
//           >
//             + <span>{t('addFarmer')}</span>
//           </button>
//         </div>

//         {/* Cards and Search */}
//         <div className="cards-and-search">
//           <div className="cards-section">
//             <div className="card">
//               <h5>{t('totalFarmers')}</h5>
//               <p className="display-6">
//                 {loading.fetchFarmers ? <ButtonLoader /> : totalFarmers}
//               </p>
//             </div>
//             <div className="card">
//               <h5>{t('totalPonds')}</h5>
//               <p className="display-6">
//                 {loading.fetchFarmers ? <ButtonLoader /> : totalPonds}
//               </p>
//             </div>
//           </div>

//           <div className="search-section d-flex gap-2">
//             <input
//               type="text"
//               placeholder={t('farmerSearchById')}
//               className="form-control"
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//               disabled={loading.search}
//             />
//             <button
//               className="btn btn-sm btn-primary"
//               onClick={handleSearch}
//               disabled={loading.search}
//             >
//               {loading.search ? <ButtonLoader /> : "Search"}
//             </button>
//           </div>
//         </div>

//         <div className="list-title">{t('farmersList')}</div>
//         <div className="farmers-list">
//           {loading.fetchFarmers ? (
//             <div className="text-center py-5">
//               <ButtonLoader />
//               <p>Loading farmers...</p>
//             </div>
//           ) : farmers.length === 0 ? (
//             <div className="text-center py-5">
//               <p>No farmers found. Add your first farmer!</p>
//             </div>
//           ) : (
//             farmers.map(f => (
//               <div key={f._id} className="farmer-box">
//                 <img
//                   src={getFarmerImage(f)}
//                   alt={f.name}
//                   className="profile-pic"
//                   loading="lazy"
//                   onError={(e) => {
//                     e.target.src = "/profile.png";
//                   }}
//                 />

//                 <div style={{ flex: 1 }}>
//                   <p><b>{t('farmerName')}:</b> {f.name}</p>
//                   <p><b>{t('farmerId')}:</b> {f.farmerId}</p>
//                   <p><b>{t('contactNumber')}:</b> {f.contact}</p>
//                   <p><b>{t('pondCount')}:</b> {f.pondCount}</p>
//                   <p className="updated-text" style={{ fontSize: "0.85rem" }}>
//                     <b>{t('updated')}:</b> {timeAgo(f.updatedAt || f.createdAt, t)}
//                   </p>
//                 </div>

//                 {/* Pond List */}
//                 {f.ponds && f.ponds.length > 0 && (
//                   <div style={{ marginTop: 10, width: "100%" }}>
//                     <h6>Pond List</h6>
//                     <button 
//                       className="btn btn-sm btn-success mb-2"
//                       onClick={() => openAddPond(f._id)}
//                       disabled={loading.addPond}
//                     >
//                       {loading.addPond ? <ButtonLoader /> : "+ Add Pond"}
//                     </button>
                    
//                     {/* Desktop Table View */}
//                     <div className="table-container">
//                       <table className="table table-sm table-bordered">
//                         <thead>
//                           <tr>
//                             <th>Pond No.</th>
//                             <th>Pond ID</th>
//                             <th>Species</th>
//                             <th>Selfie</th>
//                             <th>Last Updated</th>
//                             <th>Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {f.ponds.map((pond, index) => (
//                             <tr key={pond.pondId}>
//                               <td>{pond.pondNumber || index + 1}</td>
//                               <td>{pond.pondId}</td>
//                               <td>{pond.species || "Not specified"}</td>
//                               <td>
//                                 {pond.uploadSelfie && (
//                                   <img
//                                     src={getSelfieImage(pond)}
//                                     alt="Selfie"
//                                     style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
//                                     onClick={() => window.open(getSelfieImage(pond), '_blank')}
//                                     title="Click to view selfie"
//                                     onError={(e) => {
//                                       e.target.style.display = 'none';
//                                     }}
//                                   />
//                                 )}
//                               </td>
//                               <td>{timeAgo(pond.updatedAt || pond.createdAt, t)}</td>
//                               <td>
//                                 <button 
//                                   className="btn btn-sm btn-primary"
//                                   onClick={() => openEditPond(f._id, pond)}
//                                   disabled={loading.updatePond}
//                                 >
//                                   {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
                    
//                     {/* Mobile Card View */}
//                     <div className="mobile-pond-view">
//                       {f.ponds.map((pond, index) => (
//                         <div key={pond.pondId} className="mobile-pond-card">
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Pond No.</span>
//                             <span className="mobile-pond-value">{pond.pondNumber || index + 1}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Pond ID</span>
//                             <span className="mobile-pond-value">{pond.pondId}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Species</span>
//                             <span className="mobile-pond-value">{pond.species || "Not specified"}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Selfie</span>
//                             <span className="mobile-pond-value">
//                               {pond.uploadSelfie && (
//                                 <img
//                                   src={getSelfieImage(pond)}
//                                   alt="Selfie"
//                                   style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
//                                   onClick={() => window.open(getSelfieImage(pond), '_blank')}
//                                   title="Click to view selfie"
//                                   onError={(e) => {
//                                     e.target.style.display = 'none';
//                                   }}
//                                 />
//                               )}
//                             </span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Last Updated</span>
//                             <span className="mobile-pond-value">{timeAgo(pond.updatedAt || pond.createdAt, t)}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Actions</span>
//                             <span className="mobile-pond-value">
//                               <button 
//                                 className="btn btn-sm btn-primary"
//                                 onClick={() => openEditPond(f._id, pond)}
//                                 style={{ width: "100%", marginTop: "4px" }}
//                                 disabled={loading.updatePond}
//                               >
//                                 {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                               </button>
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {(!f.ponds || f.ponds.length === 0) && (
//                   <div style={{ marginTop: 10 }}>
//                     <button 
//                       className="btn btn-sm btn-success"
//                       onClick={() => openAddPond(f._id)}
//                       disabled={loading.addPond}
//                     >
//                       {loading.addPond ? <ButtonLoader /> : "+ Add First Pond"}
//                     </button>
//                   </div>
//                 )}

//                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                   <button 
//                     className="btn btn-sm btn-outline-primary" 
//                     onClick={() => openEdit(f)}
//                     disabled={loading.updateFarmer}
//                   >
//                     {loading.updateFarmer ? <ButtonLoader /> : t('updateFarmer')}
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Farmer Modal Form */}
//       {showForm && (
//         <div className="form-modal">
//           <div className="form-box" style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}>
//             <h5>{isUpdateMode ? "Update Farmer" : t('addFarmer')}</h5>
            
//             <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
//               <h6>Farmer Details (All fields are required)</h6>
//               <div className="row g-2">
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Name *" 
//                     value={newFarmer.name} 
//                     onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Contact Number *" 
//                     value={newFarmer.contact} 
//                     onChange={e => setNewFarmer({ ...newFarmer, contact: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>
                
//                 <div className="col-md-3">
//                   <input 
//                     type="number" 
//                     className="form-control" 
//                     placeholder="Age *" 
//                     value={newFarmer.age} 
//                     onChange={e => setNewFarmer({ ...newFarmer, age: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <select 
//                     className="form-control" 
//                     value={newFarmer.gender} 
//                     onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   >
//                     <option value="">Select Gender *</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Aadhar *" 
//                     value={newFarmer.adhar} 
//                     onChange={e => setNewFarmer({ ...newFarmer, adhar: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Members *" 
//                     value={newFarmer.familyMembers} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyMembers: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Occupation *" 
//                     value={newFarmer.familyOccupation} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyOccupation: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Address *" 
//                     value={newFarmer.village} 
//                     onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-12">
//                   <label>Farmer Photo (required) *</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     accept="image/*,video/*"
//                     capture="environment"
//                     onChange={handleFarmerPhotoChange}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required={!isUpdateMode}
//                   />

//                   {newFarmer.photo && !(newFarmer.photo instanceof File) && (
//                     <div style={{ marginTop: 6 }}>
//                       <img
//                         src={getImageUrl(newFarmer.photo)}
//                         alt="Preview"
//                         style={{ width: 80, height: 80, borderRadius: "50%" }}
//                         onError={(e) => {
//                           e.target.src = "/profile.png";
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//               {isUpdateMode ? (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={updateFarmer}
//                     disabled={loading.updateFarmer}
//                   >
//                     {loading.updateFarmer ? <ButtonLoader /> : "Update Farmer"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowForm(false); 
//                       setEditingFarmerId(null); 
//                       setNewFarmer(emptyFarmer);
//                       setIsUpdateMode(false);
//                     }}
//                     disabled={loading.updateFarmer}
//                   >
//                     {t('cancel')}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={addFarmer}
//                     disabled={loading.addFarmer}
//                   >
//                     {loading.addFarmer ? <ButtonLoader /> : t('submit')}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowForm(false); 
//                       setNewFarmer(emptyFarmer);
//                     }}
//                     disabled={loading.addFarmer}
//                   >
//                     {t('cancel')}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pond Modal Form */}
//       {showPondForm && (
//         <div className="form-modal">
//           <div className="form-box" style={{ width: "850px", maxHeight: "90vh", overflowY: "auto" }}>
//             <h5>{editingPondId ? "Update Pond" : "Add New Pond"}</h5>

//             {/* Modal Form Grid */}
//             <div className="modal-form-grid">
              
//               {/* Pond Details Section */}
//               <div className="modal-section">
//                 <h6>Pond Details (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond area (eg. 1 acre) *" 
//                       value={newPond.pondArea} 
//                       onChange={e => setNewPond({ ...newPond, pondArea: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-2">
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondAreaUnit} 
//                       onChange={e => setNewPond({ ...newPond, pondAreaUnit: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option value="acre">acre</option>
//                       <option value="hectare">hectare</option>
//                       <option value="footsquare">footsquare</option>
//                     </select>
//                   </div>
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond depth (ft) *" 
//                       value={newPond.pondDepth} 
//                       onChange={e => setNewPond({ ...newPond, pondDepth: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond image (GPS) - required *</label>
//                     <input 
//                       type="file"
//                       className="form-control"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       onChange={handlePondImageChange}
//                       disabled={loading.addPond || loading.updatePond}
//                       required={!editingPondId}
//                     />

//                     {newPond.pondImage && newPond.pondImage instanceof File && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>New file selected</small>
//                       </div>
//                     )}

//                     {editingPondId && !(newPond.pondImage instanceof File) && newPond.pondImage && (
//                       <div style={{ marginTop: 6 }}>
//                         <img
//                           src={getImageUrl(newPond.pondImage)}
//                           alt="Pond preview"
//                           style={{ width: 80, height: 80, borderRadius: "4px" }}
//                           onError={(e) => {
//                             e.target.src = "/profile.png";
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload Pond Picture/Video (required) *</label>
//                     <input 
//                       type="file"
//                       className="form-control"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       multiple
//                       onChange={handlePondFilesChange}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
                    
//                     {newPond.pondFiles && newPond.pondFiles.length > 0 && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>{newPond.pondFiles.length} file(s) selected</small>
//                       </div>
//                     )}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Overflow from somewhere in pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.overflow} 
//                       onChange={e => setNewPond({ ...newPond, overflow: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond receives proper Sunlight? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.receivesSunlight} 
//                       onChange={e => setNewPond({ ...newPond, receivesSunlight: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Trees present on banks? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.treesOnBanks} 
//                       onChange={e => setNewPond({ ...newPond, treesOnBanks: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Neighbourhood *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.neighbourhood} 
//                       onChange={e => setNewPond({ ...newPond, neighbourhood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Agriculture Farm</option>
//                       <option>Pond</option>
//                       <option>Road</option>
//                       <option>Residential Area</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Does wastewater enter pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.wastewaterEnters} 
//                       onChange={e => setNewPond({ ...newPond, wastewaterEnters: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Location Section */}
//               <div className="modal-section">
//                 <h6>Location (Required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-12 mb-2">
//                     <button 
//                       type="button"
//                       className="btn btn-primary w-45 d-flex align-items-center justify-content-center gap-2"
//                       onClick={getLocation}
//                       disabled={isGettingLocation || loading.addPond || loading.updatePond}
//                     >
//                       {isGettingLocation ? <ButtonLoader /> : <MapPin size={16} />}
//                       {isGettingLocation ? "Getting Location..." : "📍 Open My Location"}
//                     </button>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Latitude *</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newPond.latitude || ""}
//                       readOnly
//                       placeholder="Latitude will auto-fill"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Longitude *</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newPond.longitude || ""}
//                       readOnly
//                       placeholder="Longitude will auto-fill"
//                       required
//                     />
//                   </div>

//                   {(newPond.latitude || newPond.longitude) && (
//                     <div className="col-md-12">
//                       <button
//                         type="button"
//                         className="btn btn-outline-secondary btn-sm"
//                         onClick={clearLocation}
//                         disabled={loading.addPond || loading.updatePond}
//                       >
//                         Clear Location
//                       </button>
//                       <small className="text-success ms-2">
//                         ✓ Location captured: {newPond.latitude}, {newPond.longitude}
//                       </small>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Species & Stocking */}
//               <div className="modal-section">
//                 <h6>Species & Stocking (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Fish Species Cultured *" 
//                       value={newPond.species} 
//                       onChange={e => setNewPond({ ...newPond, species: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label>Date of Stocking *</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.dateOfStocking} 
//                       onChange={e => setNewPond({ ...newPond, dateOfStocking: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="text"
//                       className="form-control" 
//                       placeholder="Quantity of Seed initially in Pond *" 
//                       value={newPond.qtySeedInitially} 
//                       onChange={e => setNewPond({ ...newPond, qtySeedInitially: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       type="text"
//                       className="form-control" 
//                       placeholder="Current Quantity of Fish in Pond *" 
//                       value={newPond.currentQty} 
//                       onChange={e => setNewPond({ ...newPond, currentQty: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Average size of fishes *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.avgSize} 
//                       onChange={e => setNewPond({ ...newPond, avgSize: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>&gt;200gram</option>
//                       <option>200-500 gram</option>
//                       <option>500-750 gram</option>
//                       <option>&lt;750gram</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Feed Details */}
//               <div className="modal-section">
//                 <h6>Feed Details (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <label>Feed Type Used *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedType} 
//                       onChange={e => setNewPond({ ...newPond, feedType: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Market Feed</option>
//                       <option>Homemade Feed</option>
//                       <option>Both</option>
//                       <option>Other</option>
//                     </select>
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="If Other, mention" 
//                       value={newPond.feedOther} 
//                       onChange={e => setNewPond({ ...newPond, feedOther: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Feed frequency *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedFreq} 
//                       onChange={e => setNewPond({ ...newPond, feedFreq: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Once a day</option>
//                       <option>twice a day</option>
//                       <option>thrice a day</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Feed quantity given per day (in kg) *" 
//                       value={newPond.feedQtyPerDay} 
//                       onChange={e => setNewPond({ ...newPond, feedQtyPerDay: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Approx time of feeding *</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.feedTime} 
//                       onChange={e => setNewPond({ ...newPond, feedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Any recent changes in feed or feeding behaviour *" 
//                       value={newPond.recentFeedChanges} 
//                       onChange={e => setNewPond({ ...newPond, recentFeedChanges: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Do fish show reduced appetite? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.reducedAppetite} 
//                       onChange={e => setNewPond({ ...newPond, reducedAppetite: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Water Quality */}
//               <div className="modal-section">
//                 <h6>Water Quality (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="Water Temp (°C) *" 
//                       value={newPond.waterTemperature} 
//                       onChange={e => setNewPond({ ...newPond, waterTemperature: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="pH measured *" 
//                       value={newPond.pH} 
//                       onChange={e => setNewPond({ ...newPond, pH: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="DO measured *" 
//                       value={newPond.DO} 
//                       onChange={e => setNewPond({ ...newPond, DO: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <label>Ammonia (NH₃) Level *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.ammoniaLevel} 
//                       onChange={e => setNewPond({ ...newPond, ammoniaLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Phytoplankton Levels *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.phytoplanktonLevel} 
//                       onChange={e => setNewPond({ ...newPond, phytoplanktonLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Water Hardness *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.waterHardness} 
//                       onChange={e => setNewPond({ ...newPond, waterHardness: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Any visible algae bloom? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.algaeBloom} 
//                       onChange={e => setNewPond({ ...newPond, algaeBloom: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Pond Water Colour *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondWaterColor} 
//                       onChange={e => setNewPond({ ...newPond, pondWaterColor: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Light Green</option><option>Dark Green</option><option>Yellowish Green</option>
//                       <option>Brownish Green</option><option>Yellow</option><option>Muddy Brown</option>
//                       <option>Black</option><option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Source of Water *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.sourceOfWater} 
//                       onChange={e => setNewPond({ ...newPond, sourceOfWater: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Rainwater</option><option>Pump</option><option>River</option><option>Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Disease & Symptoms */}
//               <div className="modal-section">
//                 <h6>Disease & Symptoms (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <label>Any disease symptoms? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.diseaseSymptoms} 
//                       onChange={e => setNewPond({ ...newPond, diseaseSymptoms: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   {/* SYMPTOMS SECTION */}
//                   <div className="col-md-12">
//                     <label>Symptoms observed (check / or type) *</label>
//                     <div className="symptoms-grid">
//                       {SYMPTOMS_LIST.map(s => (
//                         <label key={s} className="symptom-checkbox">
//                           <input 
//                             type="checkbox" 
//                             checked={newPond.symptoms?.includes(s)} 
//                             onChange={() => toggleSymptom(s)} 
//                             disabled={loading.addPond || loading.updatePond}
//                           /> 
//                           <span>{s}</span>
//                         </label>
//                       ))}
//                     </div>
//                     <div style={{ marginTop: 8 }}>
//                       <input 
//                         className="form-control" 
//                         placeholder="Or type symptoms comma separated *" 
//                         value={newPond.symptomsObserved} 
//                         onChange={e => setNewPond({ ...newPond, symptomsObserved: e.target.value })}
//                         disabled={loading.addPond || loading.updatePond}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="How many fish have died last 15 days(cumulative)? *" 
//                       value={newPond.fishDeaths} 
//                       onChange={e => setNewPond({ ...newPond, fishDeaths: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Are symptoms affecting all fish or only a few? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.symptomsAffect} 
//                       onChange={e => setNewPond({ ...newPond, symptomsAffect: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>All</option><option>Few</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload fish images/videos (required) *</label>
//                     <input
//                       type="file"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       multiple
//                       className="form-control"
//                       onChange={handleFishFilesChange}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {newPond.fishFiles && newPond.fishFiles.length > 0 && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>{newPond.fishFiles.length} file(s) selected</small>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Selfie Upload Section - OPTIONAL */}
//               <div className="modal-section">
//                 <h6>Selfie with Fish/Pond (Optional)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-12">
//                     <label>Upload Your Selfie with Fish/Pond</label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       accept="image/*"
//                       capture="user"
//                       onChange={handleSelfieCapture}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
                    
//                     {selfiePreview && (
//                       <div style={{ marginTop: 10, textAlign: 'center' }}>
//                         <p>Selfie Preview:</p>
//                         <img
//                           src={selfiePreview}
//                           alt="Selfie preview"
//                           style={{ 
//                             width: 150, 
//                             height: 150, 
//                             borderRadius: '8px',
//                             objectFit: 'cover',
//                             border: '2px solid #28a745'
//                           }}
//                         />
//                       </div>
//                     )}
                    
//                     {editingPondId && !selfiePreview && newPond.uploadSelfie && (
//                       <div style={{ marginTop: 10, textAlign: 'center' }}>
//                         <p>Current Selfie:</p>
//                         <img
//                           src={getImageUrl(newPond.uploadSelfie)}
//                           alt="Current selfie"
//                           style={{ 
//                             width: 150, 
//                             height: 150, 
//                             borderRadius: '8px',
//                             objectFit: 'cover',
//                             border: '2px solid #17a2b8'
//                           }}
//                           onError={(e) => {
//                             e.target.style.display = 'none';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Observation & Misc */}
//               <div className="modal-section">
//                 <h6>Observation & Misc (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <label>Date of Farm Observed *</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.farmObservedDate} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedDate: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label>Time of Farm Observed *</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.farmObservedTime} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Which species farmer cultured last time? *</label>
//                     <input 
//                       className="form-control" 
//                       value={newPond.lastSpecies} 
//                       onChange={e => setNewPond({ ...newPond, lastSpecies: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Does farmer completely harvest the last crop? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.lastHarvestComplete} 
//                       onChange={e => setNewPond({ ...newPond, lastHarvestComplete: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any recent heavy rains or floods? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.recentRainFlood} 
//                       onChange={e => setNewPond({ ...newPond, recentRainFlood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any pesticide/chemical runoff near pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pesticideRunoff} 
//                       onChange={e => setNewPond({ ...newPond, pesticideRunoff: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any construction/activity near pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.constructionNear} 
//                       onChange={e => setNewPond({ ...newPond, constructionNear: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any sudden temperature change recently? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.suddenTempChange} 
//                       onChange={e => setNewPond({ ...newPond, suddenTempChange: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-12">
//                     <label>Notes / Remarks *</label>
//                     <textarea 
//                       className="form-control" 
//                       rows={3} 
//                       value={newPond.notes} 
//                       onChange={e => setNewPond({ ...newPond, notes: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     ></textarea>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//               {editingPondId ? (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={updatePond}
//                     disabled={loading.updatePond}
//                   >
//                     {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowPondForm(false); 
//                       setNewPond(emptyPond);
//                       setCurrentFarmerId(null);
//                       setEditingPondId(null);
//                       setLatitude("");
//                       setLongitude("");
//                       setSelfieFile(null);
//                       setSelfiePreview(null);
//                     }}
//                     disabled={loading.updatePond}
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={addPond}
//                     disabled={loading.addPond}
//                   >
//                     {loading.addPond ? <ButtonLoader /> : "Add Pond"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowPondForm(false); 
//                       setNewPond(emptyPond);
//                       setCurrentFarmerId(null);
//                       setLatitude("");
//                       setLongitude("");
//                       setSelfieFile(null);
//                       setSelfiePreview(null);
//                     }}
//                     disabled={loading.addPond}
//                   >
//                     Cancel Button
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MainPage;
















// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./mainPage.css";
// import api, { getImageUrl, getProfileImage } from "../utils/api";

// // Import Lucide icons
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2, MapPin } from "lucide-react";

// function timeAgo(dateStr, t) {
//   if (!dateStr) return t('notUpdated');
//   const now = new Date();
//   const d = new Date(dateStr);
//   const diffMs = now - d;
//   const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//   if (days === 0) return t('today');
//   if (days === 1) return t('oneDayAgo');
//   return t('daysAgo', { count: days });
// }

// const SYMPTOMS_LIST = [
//   "Erratic swimming", "Loss of appetite", "Gasping at surface",
//   "Lesions or ulcers", "Fin rot", "Fish Lice",
//   "Discoloration or white patches", "Scale loss", "Swollen abdomen",
//   "Fungal/cotton-like growth", "Flared gills", "Mucus secretion",
//   "Blood spots", "Other"
// ];

// // SIMPLE IMAGE HELPERS
// const getFarmerImage = (farmer) => {
//   return getImageUrl(farmer?.photo);
// };

// const getPondImage = (pond) => {
//   return getImageUrl(pond?.pondImage);
// };

// const getSelfieImage = (pond) => {
//   return getImageUrl(pond?.uploadSelfie);
// };

// function MainPage() {
//   const { t, i18n } = useTranslation();
//   const username = localStorage.getItem("username") || "User";
//   const userId = localStorage.getItem("userId");

//   // ✅ FORCE RE-RENDER WHEN PHOTO UPDATES
//   const [photoKey, setPhotoKey] = useState(Date.now());

//   const [farmers, setFarmers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [showPondForm, setShowPondForm] = useState(false);
//   const [editingFarmerId, setEditingFarmerId] = useState(null);
//   const [editingPondId, setEditingPondId] = useState(null);
//   const [currentFarmerId, setCurrentFarmerId] = useState(null);
//   const [welcomeMsg, setWelcomeMsg] = useState("");
//   const [isUpdateMode, setIsUpdateMode] = useState(false);

//   // Location states
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   // Selfie states
//   const [selfieFile, setSelfieFile] = useState(null);
//   const [selfiePreview, setSelfiePreview] = useState(null);

//   // Loading states
//   const [loading, setLoading] = useState({
//     fetchFarmers: false,
//     addFarmer: false,
//     updateFarmer: false,
//     addPond: false,
//     updatePond: false,
//     deleteFarmer: false,
//     deletePond: false,
//     search: false
//   });
  
//   // Mobile sidebar states
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Farmer form empty state
//   const emptyFarmer = {
//     name: "", contact: "", age: "", gender: "", village: "",
//     pondCount: "0", adhar: "", familyMembers: "", familyOccupation: "",
//     photo: null,
//   };

//   // Pond form empty state
//   const emptyPond = {
//     pondArea: "", pondAreaUnit: "acre", pondDepth: "", pondImage: null,
//     overflow: "No", receivesSunlight: "Yes", treesOnBanks: "No",
//     neighbourhood: "Agriculture Farm", wastewaterEnters: "No",
//     species: "", dateOfStocking: "", qtySeedInitially: "", 
//     currentQty: "", avgSize: ">200gram",
//     feedType: "Market Feed", feedOther: "", feedFreq: "Once a day", 
//     feedQtyPerDay: "", feedTime: "6:00 am-10:00am",
//     recentFeedChanges: "", reducedAppetite: "No",
//     waterTemperature: "", pH: "", DO: "", ammoniaLevel: "Medium", 
//     phytoplanktonLevel: "Medium", waterHardness: "1",
//     algaeBloom: "No", pondWaterColor: "Light Green", sourceOfWater: "Rainwater",
//     diseaseSymptoms: "No", symptomsObserved: "", symptoms: [],
//     symptomsAffect: "All", fishDeaths: "",
//     latitude: "", longitude: "",
//     farmObservedDate: "", farmObservedTime: "",
//     lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
//     pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No",
//     notes: "",
//     pondFiles: [],
//     fishFiles: [],
//     uploadSelfie: null,
//   };

//   const [newFarmer, setNewFarmer] = useState(emptyFarmer);
//   const [newPond, setNewPond] = useState(emptyPond);

//   // ✅ FIX: Check for photo updates from localStorage and custom events
//   useEffect(() => {
//     // Function to update photo key when localStorage changes
//     const handleStorageChange = (e) => {
//       if (e.key === "photoUpdateTime") {
//         console.log("Photo update detected in MainPage from storage event, updating key");
//         setPhotoKey(Date.now());
//       }
//     };

//     // Check for existing photo update time on mount
//     const checkPhotoUpdate = () => {
//       const photoUpdateTime = localStorage.getItem("photoUpdateTime");
//       if (photoUpdateTime) {
//         console.log("Initial photo update time found:", photoUpdateTime);
//         setPhotoKey(parseInt(photoUpdateTime));
//       }
//     };

//     // Run initial check
//     checkPhotoUpdate();

//     // Listen for storage events (when photo updates in another tab)
//     window.addEventListener("storage", handleStorageChange);

//     // Custom event listener for same-tab updates (this is the key part!)
//     const handlePhotoUpdate = (event) => {
//       console.log("Photo update event received in MainPage", event.detail);
//       setPhotoKey(Date.now());
//     };

//     window.addEventListener("photoUpdate", handlePhotoUpdate);

//     // Also check periodically (backup mechanism)
//     const intervalId = setInterval(() => {
//       const currentPhotoTime = localStorage.getItem("photoUpdateTime");
//       if (currentPhotoTime && parseInt(currentPhotoTime) !== photoKey) {
//         console.log("Periodic check detected photo update");
//         setPhotoKey(parseInt(currentPhotoTime));
//       }
//     }, 1000); // Check every second

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       window.removeEventListener("photoUpdate", handlePhotoUpdate);
//       clearInterval(intervalId);
//     };
//   }, [photoKey]);

//   // Check if mobile view
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 991);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMobile && isSidebarOpen && 
//           !event.target.closest('.sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Fetch data
//   useEffect(() => {
//     if (!userId) {
//       console.error("UserId not found in localStorage");
//       return;
//     }
//     fetchFarmers();
//     const savedLang = localStorage.getItem("lang");
//     if (savedLang) i18n.changeLanguage(savedLang);
//   }, [userId]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   const fetchFarmers = async () => {
//     try {
//       setLoading(prev => ({ ...prev, fetchFarmers: true }));
//       const res = await api.get(`/api/farmers/all?userId=${userId}`);
//       console.log("Farmers data received:", res.data);
//       setFarmers(res.data || []);
//     } catch (err) {
//       console.error("Fetch Farmers Error:", err);
//     } finally {
//       setLoading(prev => ({ ...prev, fetchFarmers: false }));
//     }
//   };

//   // Convert File to Base64 for preview ONLY
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   // Get Location Function
//   const getLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return;
//     }
//     setIsGettingLocation(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;
//         setLatitude(lat.toString());
//         setLongitude(lng.toString());
//         setNewPond({ ...newPond, latitude: lat.toString(), longitude: lng.toString() });
//         setIsGettingLocation(false);
//       },
//       (error) => {
//         setIsGettingLocation(false);
//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             alert("Location access denied. Please enable location permissions.");
//             break;
//           case error.POSITION_UNAVAILABLE:
//             alert("Location information unavailable.");
//             break;
//           case error.TIMEOUT:
//             alert("Location request timed out.");
//             break;
//           default:
//             alert("An unknown error occurred.");
//             break;
//         }
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
//     );
//   };

//   // Clear Location
//   const clearLocation = () => {
//     setLatitude("");
//     setLongitude("");
//     setNewPond({ ...newPond, latitude: "", longitude: "" });
//   };

//   // Add Farmer
//   const addFarmer = async () => {
//     if (!newFarmer.name || !newFarmer.contact || !newFarmer.age || 
//         !newFarmer.gender || !newFarmer.adhar || !newFarmer.familyMembers || 
//         !newFarmer.familyOccupation || !newFarmer.village) {
//       return alert("Please fill all required fields: Name, Contact, Age, Gender, Aadhar, Family Members, Family Occupation, Village");
//     }
    
//     if (!newFarmer.photo) {
//       return alert("Farmer photo is required");
//     }
    
//     const formData = new FormData();
//     const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
//                          'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
//     farmerFields.forEach(field => {
//       if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
//         formData.append(field, newFarmer[field].toString());
//       }
//     });
    
//     formData.append("userId", userId);
//     formData.append("createdBy", userId);
    
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     }

//     try {
//       setLoading(prev => ({ ...prev, addFarmer: true }));
//       const res = await api.post(`/api/farmers/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       setFarmers([...farmers, res.data]);
//       setShowForm(false);
//       setNewFarmer(emptyFarmer);
//     } catch (err) {
//       console.error("Add Farmer Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, addFarmer: false }));
//     }
//   };

//   // Update Farmer
//   const updateFarmer = async () => {
//     if (!editingFarmerId) return;
    
//     const formData = new FormData();
//     const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
//                          'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
//     farmerFields.forEach(field => {
//       if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
//         formData.append(field, newFarmer[field].toString());
//       }
//     });
    
//     formData.append("userId", userId);
    
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     }

//     try {
//       setLoading(prev => ({ ...prev, updateFarmer: true }));
//       const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       setFarmers(farmers.map(f => f._id === res.data._id ? res.data : f));
//       setShowForm(false);
//       setEditingFarmerId(null);
//       setNewFarmer(emptyFarmer);
//       setIsUpdateMode(false);
//     } catch (err) {
//       console.error("Update Farmer Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updateFarmer: false }));
//     }
//   };

//   // Add Pond to Farmer
//   const addPond = async () => {
//     if (!currentFarmerId) return alert("Farmer ID missing");
    
//     const requiredPondFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
//       'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
//       'farmObservedDate', 'farmObservedTime'
//     ];
    
//     for (const field of requiredPondFields) {
//       if (!newPond[field]) {
//         return alert(`Please fill required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//       }
//     }
    
//     if (!newPond.latitude || !newPond.longitude) {
//       return alert("Please capture location by clicking 'Open My Location' button");
//     }
    
//     if (!newPond.pondImage) {
//       return alert("Pond image is required");
//     }
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
//       'latitude', 'longitude',
//       'farmObservedDate', 'farmObservedTime',
//       'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
//       'pesticideRunoff', 'constructionNear', 'suddenTempChange',
//       'notes'
//     ];
    
//     for (let key of pondFields) {
//       if (newPond[key] !== undefined && newPond[key] !== null) {
//         formData.append(key, newPond[key].toString());
//       }
//     }
    
//     formData.append("symptomsObserved", symptomsStr);

//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     }

//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => {
//         if (f instanceof File) formData.append("pondFiles", f);
//       });
//     }

//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => {
//         if (f instanceof File) formData.append("fishFiles", f);
//       });
//     }

//     if (selfieFile) {
//       formData.append("uploadSelfie", selfieFile);
//     }

//     try {
//       setLoading(prev => ({ ...prev, addPond: true }));
//       const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       setFarmers(farmers.map(f => f._id === currentFarmerId ? res.data.farmer : f));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setLatitude("");
//       setLongitude("");
//       setSelfieFile(null);
//       setSelfiePreview(null);
//     } catch (err) {
//       console.error("Add Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, addPond: false }));
//     }
//   };

//   // Update Pond
//   const updatePond = async () => {
//     if (!currentFarmerId || !editingPondId) return;
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
//       'latitude', 'longitude',
//       'farmObservedDate', 'farmObservedTime',
//       'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
//       'pesticideRunoff', 'constructionNear', 'suddenTempChange',
//       'notes'
//     ];
    
//     for (let key of pondFields) {
//       if (newPond[key] !== undefined && newPond[key] !== null) {
//         formData.append(key, newPond[key].toString());
//       }
//     }
    
//     formData.append("symptomsObserved", symptomsStr);

//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     }

//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => {
//         if (f instanceof File) formData.append("pondFiles", f);
//       });
//     }

//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => {
//         if (f instanceof File) formData.append("fishFiles", f);
//       });
//     }

//     if (selfieFile) {
//       formData.append("uploadSelfie", selfieFile);
//     }

//     try {
//       setLoading(prev => ({ ...prev, updatePond: true }));
//       const res = await api.put(`/api/farmers/update-pond/${currentFarmerId}/${editingPondId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       setFarmers(farmers.map(f => f._id === currentFarmerId ? res.data.farmer : f));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setEditingPondId(null);
//       setLatitude("");
//       setLongitude("");
//       setSelfieFile(null);
//       setSelfiePreview(null);
//     } catch (err) {
//       console.error("Update Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updatePond: false }));
//     }
//   };

//   // Edit Farmer
//   const openEdit = (farmer) => {
//     setIsUpdateMode(true);
//     setNewFarmer({
//       ...emptyFarmer,
//       ...farmer,
//       photo: null
//     });
//     setEditingFarmerId(farmer._id);
//     setShowForm(true);
//   };

//   // Open Add Pond Form
//   const openAddPond = (farmerId) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(null);
//     setNewPond(emptyPond);
//     setLatitude("");
//     setLongitude("");
//     setSelfieFile(null);
//     setSelfiePreview(null);
//     setShowPondForm(true);
//   };

//   // Open Edit Pond Form
//   const openEditPond = async (farmerId, pond) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(pond.pondId);
    
//     const pre = { ...emptyPond, ...pond };
    
//     if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
//       pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
//     }

//     if (pond.uploadSelfie) {
//       setSelfiePreview(getImageUrl(pond.uploadSelfie));
//     }

//     if (pond.latitude && pond.longitude) {
//       setLatitude(pond.latitude.toString());
//       setLongitude(pond.longitude.toString());
//     }

//     setNewPond(pre);
//     setShowPondForm(true);
//   };

//   const toggleSymptom = (s) => {
//     const arr = newPond.symptoms ? [...newPond.symptoms] : [];
//     const idx = arr.indexOf(s);
//     if (idx === -1) arr.push(s); else arr.splice(idx, 1);
//     setNewPond({ ...newPond, symptoms: arr, symptomsObserved: arr.join(", ") });
//   };

//   useEffect(() => {
//     const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";
//     const message = isFirstLogin
//       ? `Welcome, ${username}`
//       : `Welcome Back, ${username}`;
//     setWelcomeMsg(message);
//     if (isFirstLogin) {
//       localStorage.setItem("isFirstLogin", "false");
//     }
//   }, [username]);

//   const handleFarmerPhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewFarmer({ ...newFarmer, photo: file });
//     }
//   };

//   const handlePondImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewPond({ ...newPond, pondImage: file });
//     }
//   };

//   const handlePondFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPond({ ...newPond, pondFiles: files });
//   };

//   const handleFishFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPond({ ...newPond, fishFiles: files });
//   };

//   const handleSelfieCapture = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const base64 = await fileToBase64(file);
//       setSelfiePreview(base64);
//       setSelfieFile(file);
//       setNewPond({ ...newPond, uploadSelfie: file });
//     }
//   };

//   const totalFarmers = farmers.length;
//   const totalPonds = farmers.reduce((sum, f) => sum + Number(f.pondCount || 0), 0);

//   const [searchId, setSearchId] = useState("");

//   const handleSearch = async () => {
//     if (!searchId) {
//       await fetchFarmers();
//       return;
//     }
//     setLoading(prev => ({ ...prev, search: true }));
//     try {
//       const filtered = farmers.filter(f =>
//         f.farmerId.toLowerCase().includes(searchId.toLowerCase())
//       );
//       if (filtered.length > 0) {
//         const remaining = farmers.filter(f => !filtered.includes(f));
//         setFarmers([...filtered, ...remaining]);
//       } else {
//         await fetchFarmers();
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, search: false }));
//     }
//   };

//   const ButtonLoader = () => (
//     <Loader2 className="spin-loader" size={16} />
//   );

//   // ✅ DEBUG: Check what URL is being generated
//   const imageUrl = getProfileImage(userId);
//   console.log("MainPage profile image URL:", imageUrl, "Photo key:", photoKey);

//   return (
//     <div className="dashboard-container">
//       {/* Mobile Navbar */}
//       {isMobile && (
//         <div className="mobile-navbar">
//           <button 
//             className="mobile-menu-toggle"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             aria-label="Toggle menu"
//             disabled={loading.fetchFarmers}
//           >
//             {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//           <div className="mobile-logo">
//             <h3>Dashboard</h3>
//           </div>
//           <div className="mobile-profile">
//             <img
//               // key={photoKey} // ✅ Force re-render on photo update
//               // src={getProfileImage(userId)}
//                key={photoKey}
//   src={`${getProfileImage(userId)}?t=${photoKey}`}
//               alt="User"
//               className="mobile-profile-pic"
//               onError={(e) => {
//                 console.log("Mobile profile image error, using fallback");
//                 e.target.src = "/profile.png";
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Sidebar */}
//       <div className={`sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="profile-section text-center mb-4">
//             <img
//               // key={photoKey} // ✅ Force re-render on photo update
//               // src={getProfileImage(userId)}
//                key={photoKey}
//   src={`${getProfileImage(userId)}?t=${photoKey}`}
//               alt="User"
//               className="profile-pic"
//               onError={(e) => {
//                 console.log("Sidebar profile image error, using fallback");
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5>{username}</h5>
//           </div>
//         </div>

//         <ul className="menu">
//           <li>
//             <Link to="/profile" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <User size={18} /> {t('profile')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dashboard" className="menu-btn active" onClick={() => setIsSidebarOpen(false)}>
//               <Home size={18} /> {t('dashboard')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/helpcenter" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <HelpCircle size={18} /> {t('helpCenter')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dealers" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <ShoppingBag size={18} /> {t('dealers')}
//             </Link>
//           </li>
//           <li>
//             <Link to="/agents" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
//               <Users size={18} /> {t('agents')}
//             </Link>
//           </li>
//         </ul>

//         {/* Language Selector */}
//         <div className="language-section mb-4">
//           <h6>{t("chooseLanguage")}</h6>
//           <select
//             className="form-select form-select-sm"
//             value={i18n.language}
//             onChange={(e) => changeLanguage(e.target.value)}
//             disabled={loading.fetchFarmers}
//           >
//             <option value="en">English</option>
//             <option value="hi">हिन्दी</option>
//             <option value="bn">বাংলা</option>
//             <option value="as">অসমীয়া</option>
//             <option value="ta">தமிழ்</option>
//             <option value="kn">ಕನ್ನಡ</option>
//             <option value="mr">मराठी</option>
//           </select>
//         </div>
//       </div>

//       {/* Overlay for Mobile */}
//       {isMobile && isSidebarOpen && (
//         <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
//       )}

//       {/* Right Section */}
//       <div className={`right-section ${isMobile ? 'mobile-view' : ''}`}>
//         <div className="top-bar">
//           <h2>{welcomeMsg}</h2>
//           <button 
//             className="add-btn d-flex align-items-center gap-1"
//             onClick={() => { 
//               setShowForm(true); 
//               setEditingFarmerId(null); 
//               setNewFarmer(emptyFarmer);
//               setIsUpdateMode(false);
//             }}
//             disabled={loading.fetchFarmers}
//           >
//             + <span>{t('addFarmer')}</span>
//           </button>
//         </div>

//         {/* Cards and Search */}
//         <div className="cards-and-search">
//           <div className="cards-section">
//             <div className="card">
//               <h5>{t('totalFarmers')}</h5>
//               <p className="display-6">
//                 {loading.fetchFarmers ? <ButtonLoader /> : totalFarmers}
//               </p>
//             </div>
//             <div className="card">
//               <h5>{t('totalPonds')}</h5>
//               <p className="display-6">
//                 {loading.fetchFarmers ? <ButtonLoader /> : totalPonds}
//               </p>
//             </div>
//           </div>

//           <div className="search-section d-flex gap-2">
//             <input
//               type="text"
//               placeholder={t('farmerSearchById')}
//               className="form-control"
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//               disabled={loading.search}
//             />
//             <button
//               className="btn btn-sm btn-primary"
//               onClick={handleSearch}
//               disabled={loading.search}
//             >
//               {loading.search ? <ButtonLoader /> : "Search"}
//             </button>
//           </div>
//         </div>

//         <div className="list-title">{t('farmersList')}</div>
//         <div className="farmers-list">
//           {loading.fetchFarmers ? (
//             <div className="text-center py-5">
//               <ButtonLoader />
//               <p>Loading farmers...</p>
//             </div>
//           ) : farmers.length === 0 ? (
//             <div className="text-center py-5">
//               <p>No farmers found. Add your first farmer!</p>
//             </div>
//           ) : (
//             farmers.map(f => (
//               <div key={f._id} className="farmer-box">
//                 <img
//                   src={getFarmerImage(f)}
//                   alt={f.name}
//                   className="profile-pic"
//                   loading="lazy"
//                   onError={(e) => {
//                     e.target.src = "/profile.png";
//                   }}
//                 />

//                 <div style={{ flex: 1 }}>
//                   <p><b>{t('farmerName')}:</b> {f.name}</p>
//                   <p><b>{t('farmerId')}:</b> {f.farmerId}</p>
//                   <p><b>{t('contactNumber')}:</b> {f.contact}</p>
//                   <p><b>{t('pondCount')}:</b> {f.pondCount}</p>
//                   <p className="updated-text" style={{ fontSize: "0.85rem" }}>
//                     <b>{t('updated')}:</b> {timeAgo(f.updatedAt || f.createdAt, t)}
//                   </p>
//                 </div>

//                 {/* Pond List */}
//                 {f.ponds && f.ponds.length > 0 && (
//                   <div style={{ marginTop: 10, width: "100%" }}>
//                     <h6>Pond List</h6>
//                     <button 
//                       className="btn btn-sm btn-success mb-2"
//                       onClick={() => openAddPond(f._id)}
//                       disabled={loading.addPond}
//                     >
//                       {loading.addPond ? <ButtonLoader /> : "+ Add Pond"}
//                     </button>
                    
//                     {/* Desktop Table View */}
//                     <div className="table-container">
//                       <table className="table table-sm table-bordered">
//                         <thead>
//                           <tr>
//                             <th>Pond No.</th>
//                             <th>Pond ID</th>
//                             <th>Species</th>
//                             <th>Selfie</th>
//                             <th>Last Updated</th>
//                             <th>Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {f.ponds.map((pond, index) => (
//                             <tr key={pond.pondId}>
//                               <td>{pond.pondNumber || index + 1}</td>
//                               <td>{pond.pondId}</td>
//                               <td>{pond.species || "Not specified"}</td>
//                               <td>
//                                 {pond.uploadSelfie && (
//                                   <img
//                                     src={getSelfieImage(pond)}
//                                     alt="Selfie"
//                                     style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
//                                     onClick={() => window.open(getSelfieImage(pond), '_blank')}
//                                     title="Click to view selfie"
//                                     onError={(e) => {
//                                       e.target.style.display = 'none';
//                                     }}
//                                   />
//                                 )}
//                               </td>
//                               <td>{timeAgo(pond.updatedAt || pond.createdAt, t)}</td>
//                               <td>
//                                 <button 
//                                   className="btn btn-sm btn-primary"
//                                   onClick={() => openEditPond(f._id, pond)}
//                                   disabled={loading.updatePond}
//                                 >
//                                   {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
                    
//                     {/* Mobile Card View */}
//                     <div className="mobile-pond-view">
//                       {f.ponds.map((pond, index) => (
//                         <div key={pond.pondId} className="mobile-pond-card">
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Pond No.</span>
//                             <span className="mobile-pond-value">{pond.pondNumber || index + 1}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Pond ID</span>
//                             <span className="mobile-pond-value">{pond.pondId}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Species</span>
//                             <span className="mobile-pond-value">{pond.species || "Not specified"}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Selfie</span>
//                             <span className="mobile-pond-value">
//                               {pond.uploadSelfie && (
//                                 <img
//                                   src={getSelfieImage(pond)}
//                                   alt="Selfie"
//                                   style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
//                                   onClick={() => window.open(getSelfieImage(pond), '_blank')}
//                                   title="Click to view selfie"
//                                   onError={(e) => {
//                                     e.target.style.display = 'none';
//                                   }}
//                                 />
//                               )}
//                             </span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Last Updated</span>
//                             <span className="mobile-pond-value">{timeAgo(pond.updatedAt || pond.createdAt, t)}</span>
//                           </div>
//                           <div className="mobile-pond-row">
//                             <span className="mobile-pond-label">Actions</span>
//                             <span className="mobile-pond-value">
//                               <button 
//                                 className="btn btn-sm btn-primary"
//                                 onClick={() => openEditPond(f._id, pond)}
//                                 style={{ width: "100%", marginTop: "4px" }}
//                                 disabled={loading.updatePond}
//                               >
//                                 {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                               </button>
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {(!f.ponds || f.ponds.length === 0) && (
//                   <div style={{ marginTop: 10 }}>
//                     <button 
//                       className="btn btn-sm btn-success"
//                       onClick={() => openAddPond(f._id)}
//                       disabled={loading.addPond}
//                     >
//                       {loading.addPond ? <ButtonLoader /> : "+ Add First Pond"}
//                     </button>
//                   </div>
//                 )}

//                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                   <button 
//                     className="btn btn-sm btn-outline-primary" 
//                     onClick={() => openEdit(f)}
//                     disabled={loading.updateFarmer}
//                   >
//                     {loading.updateFarmer ? <ButtonLoader /> : t('updateFarmer')}
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Farmer Modal Form */}
//       {showForm && (
//         <div className="form-modal">
//           <div className="form-box" style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}>
//             <h5>{isUpdateMode ? "Update Farmer" : t('addFarmer')}</h5>
            
//             <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
//               <h6>Farmer Details (All fields are required)</h6>
//               <div className="row g-2">
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Name *" 
//                     value={newFarmer.name} 
//                     onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Contact Number *" 
//                     value={newFarmer.contact} 
//                     onChange={e => setNewFarmer({ ...newFarmer, contact: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>
                
//                 <div className="col-md-3">
//                   <input 
//                     type="number" 
//                     className="form-control" 
//                     placeholder="Age *" 
//                     value={newFarmer.age} 
//                     onChange={e => setNewFarmer({ ...newFarmer, age: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <select 
//                     className="form-control" 
//                     value={newFarmer.gender} 
//                     onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   >
//                     <option value="">Select Gender *</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Aadhar *" 
//                     value={newFarmer.adhar} 
//                     onChange={e => setNewFarmer({ ...newFarmer, adhar: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Members *" 
//                     value={newFarmer.familyMembers} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyMembers: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Occupation *" 
//                     value={newFarmer.familyOccupation} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyOccupation: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Address *" 
//                     value={newFarmer.village} 
//                     onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-12">
//                   <label>Farmer Photo (required) *</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     accept="image/*,video/*"
//                     capture="environment"
//                     onChange={handleFarmerPhotoChange}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required={!isUpdateMode}
//                   />

//                   {newFarmer.photo && !(newFarmer.photo instanceof File) && (
//                     <div style={{ marginTop: 6 }}>
//                       <img
//                         src={getImageUrl(newFarmer.photo)}
//                         alt="Preview"
//                         style={{ width: 80, height: 80, borderRadius: "50%" }}
//                         onError={(e) => {
//                           e.target.src = "/profile.png";
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//               {isUpdateMode ? (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={updateFarmer}
//                     disabled={loading.updateFarmer}
//                   >
//                     {loading.updateFarmer ? <ButtonLoader /> : "Update Farmer"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowForm(false); 
//                       setEditingFarmerId(null); 
//                       setNewFarmer(emptyFarmer);
//                       setIsUpdateMode(false);
//                     }}
//                     disabled={loading.updateFarmer}
//                   >
//                     {t('cancel')}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={addFarmer}
//                     disabled={loading.addFarmer}
//                   >
//                     {loading.addFarmer ? <ButtonLoader /> : t('submit')}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowForm(false); 
//                       setNewFarmer(emptyFarmer);
//                     }}
//                     disabled={loading.addFarmer}
//                   >
//                     {t('cancel')}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pond Modal Form */}
//       {showPondForm && (
//         <div className="form-modal">
//           <div className="form-box" style={{ width: "850px", maxHeight: "90vh", overflowY: "auto" }}>
//             <h5>{editingPondId ? "Update Pond" : "Add New Pond"}</h5>

//             {/* Modal Form Grid */}
//             <div className="modal-form-grid">
              
//               {/* Pond Details Section */}
//               <div className="modal-section">
//                 <h6>Pond Details (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond area (eg. 1 acre) *" 
//                       value={newPond.pondArea} 
//                       onChange={e => setNewPond({ ...newPond, pondArea: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-2">
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondAreaUnit} 
//                       onChange={e => setNewPond({ ...newPond, pondAreaUnit: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option value="acre">acre</option>
//                       <option value="hectare">hectare</option>
//                       <option value="footsquare">footsquare</option>
//                     </select>
//                   </div>
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond depth (ft) *" 
//                       value={newPond.pondDepth} 
//                       onChange={e => setNewPond({ ...newPond, pondDepth: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond image (GPS) - required *</label>
//                     <input 
//                       type="file"
//                       className="form-control"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       onChange={handlePondImageChange}
//                       disabled={loading.addPond || loading.updatePond}
//                       required={!editingPondId}
//                     />

//                     {newPond.pondImage && newPond.pondImage instanceof File && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>New file selected</small>
//                       </div>
//                     )}

//                     {editingPondId && !(newPond.pondImage instanceof File) && newPond.pondImage && (
//                       <div style={{ marginTop: 6 }}>
//                         <img
//                           src={getImageUrl(newPond.pondImage)}
//                           alt="Pond preview"
//                           style={{ width: 80, height: 80, borderRadius: "4px" }}
//                           onError={(e) => {
//                             e.target.src = "/profile.png";
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload Pond Picture/Video (required) *</label>
//                     <input 
//                       type="file"
//                       className="form-control"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       multiple
//                       onChange={handlePondFilesChange}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
                    
//                     {newPond.pondFiles && newPond.pondFiles.length > 0 && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>{newPond.pondFiles.length} file(s) selected</small>
//                       </div>
//                     )}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Overflow from somewhere in pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.overflow} 
//                       onChange={e => setNewPond({ ...newPond, overflow: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond receives proper Sunlight? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.receivesSunlight} 
//                       onChange={e => setNewPond({ ...newPond, receivesSunlight: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Trees present on banks? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.treesOnBanks} 
//                       onChange={e => setNewPond({ ...newPond, treesOnBanks: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Neighbourhood *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.neighbourhood} 
//                       onChange={e => setNewPond({ ...newPond, neighbourhood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Agriculture Farm</option>
//                       <option>Pond</option>
//                       <option>Road</option>
//                       <option>Residential Area</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Does wastewater enter pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.wastewaterEnters} 
//                       onChange={e => setNewPond({ ...newPond, wastewaterEnters: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Location Section */}
//               <div className="modal-section">
//                 <h6>Location (Required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-12 mb-2">
//                     <button 
//                       type="button"
//                       className="btn btn-primary w-45 d-flex align-items-center justify-content-center gap-2"
//                       onClick={getLocation}
//                       disabled={isGettingLocation || loading.addPond || loading.updatePond}
//                     >
//                       {isGettingLocation ? <ButtonLoader /> : <MapPin size={16} />}
//                       {isGettingLocation ? "Getting Location..." : "📍 Open My Location"}
//                     </button>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Latitude *</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newPond.latitude || ""}
//                       readOnly
//                       placeholder="Latitude will auto-fill"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Longitude *</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newPond.longitude || ""}
//                       readOnly
//                       placeholder="Longitude will auto-fill"
//                       required
//                     />
//                   </div>

//                   {(newPond.latitude || newPond.longitude) && (
//                     <div className="col-md-12">
//                       <button
//                         type="button"
//                         className="btn btn-outline-secondary btn-sm"
//                         onClick={clearLocation}
//                         disabled={loading.addPond || loading.updatePond}
//                       >
//                         Clear Location
//                       </button>
//                       <small className="text-success ms-2">
//                         ✓ Location captured: {newPond.latitude}, {newPond.longitude}
//                       </small>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Species & Stocking */}
//               <div className="modal-section">
//                 <h6>Species & Stocking (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Fish Species Cultured *" 
//                       value={newPond.species} 
//                       onChange={e => setNewPond({ ...newPond, species: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label>Date of Stocking *</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.dateOfStocking} 
//                       onChange={e => setNewPond({ ...newPond, dateOfStocking: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="text"
//                       className="form-control" 
//                       placeholder="Quantity of Seed initially in Pond *" 
//                       value={newPond.qtySeedInitially} 
//                       onChange={e => setNewPond({ ...newPond, qtySeedInitially: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       type="text"
//                       className="form-control" 
//                       placeholder="Current Quantity of Fish in Pond *" 
//                       value={newPond.currentQty} 
//                       onChange={e => setNewPond({ ...newPond, currentQty: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Average size of fishes *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.avgSize} 
//                       onChange={e => setNewPond({ ...newPond, avgSize: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>&gt;200gram</option>
//                       <option>200-500 gram</option>
//                       <option>500-750 gram</option>
//                       <option>&lt;750gram</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Feed Details */}
//               <div className="modal-section">
//                 <h6>Feed Details (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <label>Feed Type Used *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedType} 
//                       onChange={e => setNewPond({ ...newPond, feedType: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Market Feed</option>
//                       <option>Homemade Feed</option>
//                       <option>Both</option>
//                       <option>Other</option>
//                     </select>
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="If Other, mention" 
//                       value={newPond.feedOther} 
//                       onChange={e => setNewPond({ ...newPond, feedOther: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Feed frequency *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedFreq} 
//                       onChange={e => setNewPond({ ...newPond, feedFreq: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Once a day</option>
//                       <option>twice a day</option>
//                       <option>thrice a day</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Feed quantity given per day (in kg) *" 
//                       value={newPond.feedQtyPerDay} 
//                       onChange={e => setNewPond({ ...newPond, feedQtyPerDay: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Approx time of feeding *</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.feedTime} 
//                       onChange={e => setNewPond({ ...newPond, feedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Any recent changes in feed or feeding behaviour *" 
//                       value={newPond.recentFeedChanges} 
//                       onChange={e => setNewPond({ ...newPond, recentFeedChanges: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Do fish show reduced appetite? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.reducedAppetite} 
//                       onChange={e => setNewPond({ ...newPond, reducedAppetite: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Water Quality */}
//               <div className="modal-section">
//                 <h6>Water Quality (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="Water Temp (°C) *" 
//                       value={newPond.waterTemperature} 
//                       onChange={e => setNewPond({ ...newPond, waterTemperature: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="pH measured *" 
//                       value={newPond.pH} 
//                       onChange={e => setNewPond({ ...newPond, pH: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="DO measured *" 
//                       value={newPond.DO} 
//                       onChange={e => setNewPond({ ...newPond, DO: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <label>Ammonia (NH₃) Level *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.ammoniaLevel} 
//                       onChange={e => setNewPond({ ...newPond, ammoniaLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Phytoplankton Levels *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.phytoplanktonLevel} 
//                       onChange={e => setNewPond({ ...newPond, phytoplanktonLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Water Hardness *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.waterHardness} 
//                       onChange={e => setNewPond({ ...newPond, waterHardness: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Any visible algae bloom? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.algaeBloom} 
//                       onChange={e => setNewPond({ ...newPond, algaeBloom: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Pond Water Colour *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondWaterColor} 
//                       onChange={e => setNewPond({ ...newPond, pondWaterColor: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Light Green</option><option>Dark Green</option><option>Yellowish Green</option>
//                       <option>Brownish Green</option><option>Yellow</option><option>Muddy Brown</option>
//                       <option>Black</option><option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Source of Water *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.sourceOfWater} 
//                       onChange={e => setNewPond({ ...newPond, sourceOfWater: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Rainwater</option><option>Pump</option><option>River</option><option>Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Disease & Symptoms */}
//               <div className="modal-section">
//                 <h6>Disease & Symptoms (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <label>Any disease symptoms? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.diseaseSymptoms} 
//                       onChange={e => setNewPond({ ...newPond, diseaseSymptoms: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   {/* SYMPTOMS SECTION */}
//                   <div className="col-md-12">
//                     <label>Symptoms observed (check / or type) *</label>
//                     <div className="symptoms-grid">
//                       {SYMPTOMS_LIST.map(s => (
//                         <label key={s} className="symptom-checkbox">
//                           <input 
//                             type="checkbox" 
//                             checked={newPond.symptoms?.includes(s)} 
//                             onChange={() => toggleSymptom(s)} 
//                             disabled={loading.addPond || loading.updatePond}
//                           /> 
//                           <span>{s}</span>
//                         </label>
//                       ))}
//                     </div>
//                     <div style={{ marginTop: 8 }}>
//                       <input 
//                         className="form-control" 
//                         placeholder="Or type symptoms comma separated *" 
//                         value={newPond.symptomsObserved} 
//                         onChange={e => setNewPond({ ...newPond, symptomsObserved: e.target.value })}
//                         disabled={loading.addPond || loading.updatePond}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="How many fish have died last 15 days(cumulative)? *" 
//                       value={newPond.fishDeaths} 
//                       onChange={e => setNewPond({ ...newPond, fishDeaths: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Are symptoms affecting all fish or only a few? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.symptomsAffect} 
//                       onChange={e => setNewPond({ ...newPond, symptomsAffect: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>All</option><option>Few</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload fish images/videos (required) *</label>
//                     <input
//                       type="file"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       multiple
//                       className="form-control"
//                       onChange={handleFishFilesChange}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {newPond.fishFiles && newPond.fishFiles.length > 0 && (
//                       <div style={{ marginTop: 6 }}>
//                         <small>{newPond.fishFiles.length} file(s) selected</small>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Selfie Upload Section - OPTIONAL */}
//               <div className="modal-section">
//                 <h6>Selfie with Farmer</h6>
//                 <div className="row g-2">
//                   <div className="col-md-12">
//                     <label>Upload Your Selfie with Farmer</label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       accept="image/*"
//                       capture="user"
//                       onChange={handleSelfieCapture}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
                    
//                     {selfiePreview && (
//                       <div style={{ marginTop: 10, textAlign: 'center' }}>
//                         <p>Selfie Preview:</p>
//                         <img
//                           src={selfiePreview}
//                           alt="Selfie preview"
//                           style={{ 
//                             width: 150, 
//                             height: 150, 
//                             borderRadius: '8px',
//                             objectFit: 'cover',
//                             border: '2px solid #28a745'
//                           }}
//                         />
//                       </div>
//                     )}
                    
//                     {editingPondId && !selfiePreview && newPond.uploadSelfie && (
//                       <div style={{ marginTop: 10, textAlign: 'center' }}>
//                         <p>Current Selfie:</p>
//                         <img
//                           src={getImageUrl(newPond.uploadSelfie)}
//                           alt="Current selfie"
//                           style={{ 
//                             width: 150, 
//                             height: 150, 
//                             borderRadius: '8px',
//                             objectFit: 'cover',
//                             border: '2px solid #17a2b8'
//                           }}
//                           onError={(e) => {
//                             e.target.style.display = 'none';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Observation & Misc */}
//               <div className="modal-section">
//                 <h6>Observation & Misc (All fields required)</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <label>Date of Farm Observed *</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.farmObservedDate} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedDate: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label>Time of Farm Observed *</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.farmObservedTime} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Which species farmer cultured last time? *</label>
//                     <input 
//                       className="form-control" 
//                       value={newPond.lastSpecies} 
//                       onChange={e => setNewPond({ ...newPond, lastSpecies: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Does farmer completely harvest the last crop? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.lastHarvestComplete} 
//                       onChange={e => setNewPond({ ...newPond, lastHarvestComplete: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any recent heavy rains or floods? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.recentRainFlood} 
//                       onChange={e => setNewPond({ ...newPond, recentRainFlood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any pesticide/chemical runoff near pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pesticideRunoff} 
//                       onChange={e => setNewPond({ ...newPond, pesticideRunoff: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any construction/activity near pond? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.constructionNear} 
//                       onChange={e => setNewPond({ ...newPond, constructionNear: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any sudden temperature change recently? *</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.suddenTempChange} 
//                       onChange={e => setNewPond({ ...newPond, suddenTempChange: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-12">
//                     <label>Notes / Remarks *</label>
//                     <textarea 
//                       className="form-control" 
//                       rows={3} 
//                       value={newPond.notes} 
//                       onChange={e => setNewPond({ ...newPond, notes: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                       required
//                     ></textarea>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//               {editingPondId ? (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={updatePond}
//                     disabled={loading.updatePond}
//                   >
//                     {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowPondForm(false); 
//                       setNewPond(emptyPond);
//                       setCurrentFarmerId(null);
//                       setEditingPondId(null);
//                       setLatitude("");
//                       setLongitude("");
//                       setSelfieFile(null);
//                       setSelfiePreview(null);
//                     }}
//                     disabled={loading.updatePond}
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button 
//                     className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
//                     onClick={addPond}
//                     disabled={loading.addPond}
//                   >
//                     {loading.addPond ? <ButtonLoader /> : "Add Pond"}
//                   </button>
//                   <button 
//                     className="btn btn-secondary flex-grow-1" 
//                     onClick={() => { 
//                       setShowPondForm(false); 
//                       setNewPond(emptyPond);
//                       setCurrentFarmerId(null);
//                       setLatitude("");
//                       setLongitude("");
//                       setSelfieFile(null);
//                       setSelfiePreview(null);
//                     }}
//                     disabled={loading.addPond}
//                   >
//                     Cancel
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MainPage;













////ye vala bilkul sahi hai 











import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mainPage.css";
import api, { getImageUrl, getProfileImage } from "../utils/api";

// Import Lucide icons
import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2, MapPin } from "lucide-react";

function timeAgo(dateStr, t) {
  if (!dateStr) return t('notUpdated');
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return t('today');
  if (days === 1) return t('oneDayAgo');
  return t('daysAgo', { count: days });
}

const SYMPTOMS_LIST = [
  "Erratic swimming", "Loss of appetite", "Gasping at surface",
  "Lesions or ulcers", "Fin rot", "Fish Lice",
  "Discoloration or white patches", "Scale loss", "Swollen abdomen",
  "Fungal/cotton-like growth", "Flared gills", "Mucus secretion",
  "Blood spots", "Other"
];

// SIMPLE IMAGE HELPERS
const getFarmerImage = (farmer) => {
  return getImageUrl(farmer?.photo);
};

const getPondImage = (pond) => {
  return getImageUrl(pond?.pondImage);
};

const getSelfieImage = (pond) => {
  return getImageUrl(pond?.uploadSelfie);
};

function MainPage() {
  const { t, i18n } = useTranslation();
  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("userId");

  // ✅ FORCE RE-RENDER WHEN PHOTO UPDATES
  const [photoKey, setPhotoKey] = useState(Date.now());

  const [farmers, setFarmers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPondForm, setShowPondForm] = useState(false);
  const [editingFarmerId, setEditingFarmerId] = useState(null);
  const [editingPondId, setEditingPondId] = useState(null);
  const [currentFarmerId, setCurrentFarmerId] = useState(null);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Location states
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Selfie states
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  // Loading states
  const [loading, setLoading] = useState({
    fetchFarmers: false,
    addFarmer: false,
    updateFarmer: false,
    addPond: false,
    updatePond: false,
    deleteFarmer: false,
    deletePond: false,
    search: false
  });
  
  // Mobile sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Farmer form empty state - Aadhar is now optional (can be empty string)
  const emptyFarmer = {
    name: "", contact: "", age: "", gender: "", village: "",
    pondCount: "0", adhar: "", familyMembers: "", familyOccupation: "",
    photo: null,
  };

  // Pond form empty state
  const emptyPond = {
    pondArea: "", pondAreaUnit: "acre", pondDepth: "", pondImage: null,
    overflow: "No", receivesSunlight: "Yes", treesOnBanks: "No",
    neighbourhood: "Agriculture Farm", wastewaterEnters: "No",
    species: "", dateOfStocking: "", qtySeedInitially: "", 
    currentQty: "", avgSize: ">200gram",
    feedType: "Market Feed", feedOther: "", feedFreq: "Once a day", 
    feedQtyPerDay: "", feedTime: "6:00 am-10:00am",
    recentFeedChanges: "", reducedAppetite: "No",
    waterTemperature: "", pH: "", DO: "", ammoniaLevel: "Medium", 
    phytoplanktonLevel: "Medium", waterHardness: "1",
    algaeBloom: "No", pondWaterColor: "Light Green", sourceOfWater: "Rainwater",
    diseaseSymptoms: "No", symptomsObserved: "", symptoms: [],
    symptomsAffect: "All", fishDeaths: "",
    latitude: "", longitude: "",
    farmObservedDate: "", farmObservedTime: "",
    lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
    pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No",
    notes: "",
    pondFiles: [],
    fishFiles: [],
    uploadSelfie: null,
  };

  const [newFarmer, setNewFarmer] = useState(emptyFarmer);
  const [newPond, setNewPond] = useState(emptyPond);

  // ✅ FIX: Check for photo updates from localStorage and custom events
  useEffect(() => {
    // Function to update photo key when localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === "photoUpdateTime") {
        console.log("Photo update detected in MainPage from storage event, updating key");
        setPhotoKey(Date.now());
      }
    };

    // Check for existing photo update time on mount
    const checkPhotoUpdate = () => {
      const photoUpdateTime = localStorage.getItem("photoUpdateTime");
      if (photoUpdateTime) {
        console.log("Initial photo update time found:", photoUpdateTime);
        setPhotoKey(parseInt(photoUpdateTime));
      }
    };

    // Run initial check
    checkPhotoUpdate();

    // Listen for storage events (when photo updates in another tab)
    window.addEventListener("storage", handleStorageChange);

    // Custom event listener for same-tab updates
    const handlePhotoUpdate = (event) => {
      console.log("Photo update event received in MainPage", event.detail);
      setPhotoKey(Date.now());
    };

    window.addEventListener("photoUpdate", handlePhotoUpdate);

    // Also check periodically (backup mechanism)
    const intervalId = setInterval(() => {
      const currentPhotoTime = localStorage.getItem("photoUpdateTime");
      if (currentPhotoTime && parseInt(currentPhotoTime) !== photoKey) {
        console.log("Periodic check detected photo update");
        setPhotoKey(parseInt(currentPhotoTime));
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("photoUpdate", handlePhotoUpdate);
      clearInterval(intervalId);
    };
  }, [photoKey]);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen && 
          !event.target.closest('.sidebar') && 
          !event.target.closest('.mobile-menu-toggle')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  // Fetch data
  useEffect(() => {
    if (!userId) {
      console.error("UserId not found in localStorage");
      return;
    }
    fetchFarmers();
    const savedLang = localStorage.getItem("lang");
    if (savedLang) i18n.changeLanguage(savedLang);
  }, [userId]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [window.location.pathname]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  // ✅ FIXED fetchFarmers function with better error handling
  const fetchFarmers = async () => {
    try {
      setLoading(prev => ({ ...prev, fetchFarmers: true }));
      
      const storedUserId = localStorage.getItem("userId");
      console.log("Fetching farmers for userId:", storedUserId);
      console.log("userId length:", storedUserId?.length);
      
      if (!storedUserId) {
        console.error("No userId found in localStorage");
        setFarmers([]);
        return;
      }
      
      const res = await api.get(`/api/farmers/all?userId=${storedUserId}`);
      console.log("Farmers data received:", res.data);
      setFarmers(res.data || []);
    } catch (err) {
      console.error("Fetch Farmers Error Details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        userId: localStorage.getItem("userId")
      });
      
      // Show user-friendly error message
      alert(`Failed to fetch farmers: ${err.response?.data?.error || err.message}`);
      
      // Set empty farmers array to prevent UI errors
      setFarmers([]);
    } finally {
      setLoading(prev => ({ ...prev, fetchFarmers: false }));
    }
  };

  // Convert File to Base64 for preview ONLY
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Get Location Function
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setNewPond({ ...newPond, latitude: lat.toString(), longitude: lng.toString() });
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("Location access denied. Please enable location permissions.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information unavailable.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out.");
            break;
          default:
            alert("An unknown error occurred.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Clear Location
  const clearLocation = () => {
    setLatitude("");
    setLongitude("");
    setNewPond({ ...newPond, latitude: "", longitude: "" });
  };

  // ✅ FIXED Add Farmer - Updated validation to make Aadhar optional
  const addFarmer = async () => {
    // Required fields - Aadhar is now optional, so removed from validation
    if (!newFarmer.name || !newFarmer.contact || !newFarmer.age || 
        !newFarmer.gender || !newFarmer.familyMembers || 
        !newFarmer.familyOccupation || !newFarmer.village) {
      return alert("Please fill all required fields: Name, Contact, Age, Gender, Family Members, Family Occupation, Village");
    }
    
    // Optional: Validate Aadhar only if provided
    if (newFarmer.adhar && newFarmer.adhar.trim() !== "") {
      if (!/^\d{12}$/.test(newFarmer.adhar)) {
        return alert("Aadhar number must be exactly 12 digits if provided");
      }
    }
    
    if (!newFarmer.photo) {
      return alert("Farmer photo is required");
    }
    
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      return alert("User ID not found. Please log in again.");
    }
    
    const formData = new FormData();
    const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
                         'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
    farmerFields.forEach(field => {
      if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
        formData.append(field, newFarmer[field].toString());
      }
    });
    
    formData.append("userId", storedUserId);
    formData.append("createdBy", storedUserId);
    
    if (newFarmer.photo instanceof File) {
      formData.append("photo", newFarmer.photo);
    }

    try {
      setLoading(prev => ({ ...prev, addFarmer: true }));
      const res = await api.post(`/api/farmers/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFarmers([...farmers, res.data]);
      setShowForm(false);
      setNewFarmer(emptyFarmer);
      alert("Farmer added successfully!");
    } catch (err) {
      console.error("Add Farmer Error:", err);
      alert("Server error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(prev => ({ ...prev, addFarmer: false }));
    }
  };

  // ✅ FIXED Update Farmer - Updated validation to make Aadhar optional
  const updateFarmer = async () => {
    if (!editingFarmerId) return;
    
    // Optional: Validate Aadhar only if provided
    if (newFarmer.adhar && newFarmer.adhar.trim() !== "") {
      if (!/^\d{12}$/.test(newFarmer.adhar)) {
        return alert("Aadhar number must be exactly 12 digits if provided");
      }
    }
    
    const storedUserId = localStorage.getItem("userId");
    const formData = new FormData();
    const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
                         'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
    farmerFields.forEach(field => {
      if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
        formData.append(field, newFarmer[field].toString());
      }
    });
    
    formData.append("userId", storedUserId);
    
    if (newFarmer.photo instanceof File) {
      formData.append("photo", newFarmer.photo);
    }

    try {
      setLoading(prev => ({ ...prev, updateFarmer: true }));
      const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setFarmers(farmers.map(f => f._id === res.data._id ? res.data : f));
      setShowForm(false);
      setEditingFarmerId(null);
      setNewFarmer(emptyFarmer);
      setIsUpdateMode(false);
      alert("Farmer updated successfully!");
    } catch (err) {
      console.error("Update Farmer Error:", err);
      alert("Server error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(prev => ({ ...prev, updateFarmer: false }));
    }
  };

  // Add Pond to Farmer
  const addPond = async () => {
    if (!currentFarmerId) return alert("Farmer ID missing");
    
    const requiredPondFields = [
      'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
      'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
      'farmObservedDate', 'farmObservedTime'
    ];
    
    for (const field of requiredPondFields) {
      if (!newPond[field]) {
        return alert(`Please fill required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      }
    }
    
    if (!newPond.latitude || !newPond.longitude) {
      return alert("Please capture location by clicking 'Open My Location' button");
    }
    
    if (!newPond.pondImage) {
      return alert("Pond image is required");
    }
    
    const formData = new FormData();
    const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
      ? newPond.symptoms.join(", ")
      : (newPond.symptomsObserved || "");

    const pondFields = [
      'pondArea', 'pondAreaUnit', 'pondDepth',
      'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
      'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
      'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
      'recentFeedChanges', 'reducedAppetite',
      'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
      'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
      'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
      'latitude', 'longitude',
      'farmObservedDate', 'farmObservedTime',
      'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
      'pesticideRunoff', 'constructionNear', 'suddenTempChange',
      'notes'
    ];
    
    for (let key of pondFields) {
      if (newPond[key] !== undefined && newPond[key] !== null) {
        formData.append(key, newPond[key].toString());
      }
    }
    
    formData.append("symptomsObserved", symptomsStr);

    if (newPond.pondImage instanceof File) {
      formData.append("pondImage", newPond.pondImage);
    }

    if (newPond.pondFiles && newPond.pondFiles.length > 0) {
      newPond.pondFiles.forEach((f) => {
        if (f instanceof File) formData.append("pondFiles", f);
      });
    }

    if (newPond.fishFiles && newPond.fishFiles.length > 0) {
      newPond.fishFiles.forEach((f) => {
        if (f instanceof File) formData.append("fishFiles", f);
      });
    }

    if (selfieFile) {
      formData.append("uploadSelfie", selfieFile);
    }

    try {
      setLoading(prev => ({ ...prev, addPond: true }));
      const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setFarmers(farmers.map(f => f._id === currentFarmerId ? res.data.farmer : f));
      setShowPondForm(false);
      setNewPond(emptyPond);
      setCurrentFarmerId(null);
      setLatitude("");
      setLongitude("");
      setSelfieFile(null);
      setSelfiePreview(null);
      alert("Pond added successfully!");
    } catch (err) {
      console.error("Add Pond Error:", err);
      alert("Server error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(prev => ({ ...prev, addPond: false }));
    }
  };

  // Update Pond
  const updatePond = async () => {
    if (!currentFarmerId || !editingPondId) return;
    
    const formData = new FormData();
    const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
      ? newPond.symptoms.join(", ")
      : (newPond.symptomsObserved || "");

    const pondFields = [
      'pondArea', 'pondAreaUnit', 'pondDepth',
      'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
      'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
      'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
      'recentFeedChanges', 'reducedAppetite',
      'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
      'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
      'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
      'latitude', 'longitude',
      'farmObservedDate', 'farmObservedTime',
      'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
      'pesticideRunoff', 'constructionNear', 'suddenTempChange',
      'notes'
    ];
    
    for (let key of pondFields) {
      if (newPond[key] !== undefined && newPond[key] !== null) {
        formData.append(key, newPond[key].toString());
      }
    }
    
    formData.append("symptomsObserved", symptomsStr);

    if (newPond.pondImage instanceof File) {
      formData.append("pondImage", newPond.pondImage);
    }

    if (newPond.pondFiles && newPond.pondFiles.length > 0) {
      newPond.pondFiles.forEach((f) => {
        if (f instanceof File) formData.append("pondFiles", f);
      });
    }

    if (newPond.fishFiles && newPond.fishFiles.length > 0) {
      newPond.fishFiles.forEach((f) => {
        if (f instanceof File) formData.append("fishFiles", f);
      });
    }

    if (selfieFile) {
      formData.append("uploadSelfie", selfieFile);
    }

    try {
      setLoading(prev => ({ ...prev, updatePond: true }));
      const res = await api.put(`/api/farmers/update-pond/${currentFarmerId}/${editingPondId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setFarmers(farmers.map(f => f._id === currentFarmerId ? res.data.farmer : f));
      setShowPondForm(false);
      setNewPond(emptyPond);
      setCurrentFarmerId(null);
      setEditingPondId(null);
      setLatitude("");
      setLongitude("");
      setSelfieFile(null);
      setSelfiePreview(null);
      alert("Pond updated successfully!");
    } catch (err) {
      console.error("Update Pond Error:", err);
      alert("Server error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(prev => ({ ...prev, updatePond: false }));
    }
  };

  // Edit Farmer
  const openEdit = (farmer) => {
    setIsUpdateMode(true);
    setNewFarmer({
      ...emptyFarmer,
      ...farmer,
      photo: null
    });
    setEditingFarmerId(farmer._id);
    setShowForm(true);
  };

  // Open Add Pond Form
  const openAddPond = (farmerId) => {
    setCurrentFarmerId(farmerId);
    setEditingPondId(null);
    setNewPond(emptyPond);
    setLatitude("");
    setLongitude("");
    setSelfieFile(null);
    setSelfiePreview(null);
    setShowPondForm(true);
  };

  // Open Edit Pond Form
  const openEditPond = async (farmerId, pond) => {
    setCurrentFarmerId(farmerId);
    setEditingPondId(pond.pondId);
    
    const pre = { ...emptyPond, ...pond };
    
    if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
      pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
    }

    if (pond.uploadSelfie) {
      setSelfiePreview(getImageUrl(pond.uploadSelfie));
    }

    if (pond.latitude && pond.longitude) {
      setLatitude(pond.latitude.toString());
      setLongitude(pond.longitude.toString());
    }

    setNewPond(pre);
    setShowPondForm(true);
  };

  const toggleSymptom = (s) => {
    const arr = newPond.symptoms ? [...newPond.symptoms] : [];
    const idx = arr.indexOf(s);
    if (idx === -1) arr.push(s); else arr.splice(idx, 1);
    setNewPond({ ...newPond, symptoms: arr, symptomsObserved: arr.join(", ") });
  };

  useEffect(() => {
    const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";
    const message = isFirstLogin
      ? `Welcome, ${username}`
      : `Welcome Back, ${username}`;
    setWelcomeMsg(message);
    if (isFirstLogin) {
      localStorage.setItem("isFirstLogin", "false");
    }
  }, [username]);

  const handleFarmerPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFarmer({ ...newFarmer, photo: file });
    }
  };

  const handlePondImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPond({ ...newPond, pondImage: file });
    }
  };

  const handlePondFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewPond({ ...newPond, pondFiles: files });
  };

  const handleFishFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewPond({ ...newPond, fishFiles: files });
  };

  const handleSelfieCapture = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setSelfiePreview(base64);
      setSelfieFile(file);
      setNewPond({ ...newPond, uploadSelfie: file });
    }
  };

  const totalFarmers = farmers.length;
  const totalPonds = farmers.reduce((sum, f) => sum + Number(f.pondCount || 0), 0);

  const [searchId, setSearchId] = useState("");

  const handleSearch = async () => {
    if (!searchId) {
      await fetchFarmers();
      return;
    }
    setLoading(prev => ({ ...prev, search: true }));
    try {
      const filtered = farmers.filter(f =>
        f.farmerId && f.farmerId.toLowerCase().includes(searchId.toLowerCase())
      );
      if (filtered.length > 0) {
        const remaining = farmers.filter(f => !filtered.includes(f));
        setFarmers([...filtered, ...remaining]);
      } else {
        await fetchFarmers();
      }
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  const ButtonLoader = () => (
    <Loader2 className="spin-loader" size={16} />
  );

  return (
    <div className="dashboard-container">
      {/* Mobile Navbar */}
      {isMobile && (
        <div className="mobile-navbar">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
            disabled={loading.fetchFarmers}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="mobile-logo">
            <h3>Dashboard</h3>
          </div>
          <div className="mobile-profile">
            <img
              key={photoKey}
              src={`${getProfileImage(userId)}?t=${photoKey}`}
              alt="User"
              className="mobile-profile-pic"
              onError={(e) => {
                console.log("Mobile profile image error, using fallback");
                e.target.src = "/profile.png";
              }}
            />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
        <div className="sidebar-close-container">
          <div className="profile-section text-center mb-4">
            <img
              key={photoKey}
              src={`${getProfileImage(userId)}?t=${photoKey}`}
              alt="User"
              className="profile-pic"
              onError={(e) => {
                console.log("Sidebar profile image error, using fallback");
                e.target.src = "/profile.png";
              }}
            />
            <h5>{username}</h5>
          </div>
        </div>

        <ul className="menu">
          <li>
            <Link to="/profile" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
              <User size={18} /> {t('profile')}
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="menu-btn active" onClick={() => setIsSidebarOpen(false)}>
              <Home size={18} /> {t('dashboard')}
            </Link>
          </li>
          <li>
            <Link to="/helpcenter" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
              <HelpCircle size={18} /> {t('helpCenter')}
            </Link>
          </li>
          <li>
            <Link to="/dealers" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
              <ShoppingBag size={18} /> {t('dealers')}
            </Link>
          </li>
          <li>
            <Link to="/agents" className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
              <Users size={18} /> {t('agents')}
            </Link>
          </li>
        </ul>

        {/* Language Selector */}
        <div className="language-section mb-4">
          <h6>{t("chooseLanguage")}</h6>
          <select
            className="form-select form-select-sm"
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            disabled={loading.fetchFarmers}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
            <option value="as">অসমীয়া</option>
            <option value="ta">தமிழ்</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Right Section */}
      <div className={`right-section ${isMobile ? 'mobile-view' : ''}`}>
        <div className="top-bar">
          <h2>{welcomeMsg}</h2>
          <button 
            className="add-btn d-flex align-items-center gap-1"
            onClick={() => { 
              setShowForm(true); 
              setEditingFarmerId(null); 
              setNewFarmer(emptyFarmer);
              setIsUpdateMode(false);
            }}
            disabled={loading.fetchFarmers}
          >
            + <span>{t('addFarmer')}</span>
          </button>
        </div>

        {/* Cards and Search */}
        <div className="cards-and-search">
          <div className="cards-section">
            <div className="card">
              <h5>{t('totalFarmers')}</h5>
              <p className="display-6">
                {loading.fetchFarmers ? <ButtonLoader /> : totalFarmers}
              </p>
            </div>
            <div className="card">
              <h5>{t('totalPonds')}</h5>
              <p className="display-6">
                {loading.fetchFarmers ? <ButtonLoader /> : totalPonds}
              </p>
            </div>
          </div>

          <div className="search-section d-flex gap-2">
            <input
              type="text"
              placeholder={t('farmerSearchById')}
              className="form-control"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              disabled={loading.search}
            />
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSearch}
              disabled={loading.search}
            >
              {loading.search ? <ButtonLoader /> : "Search"}
            </button>
          </div>
        </div>

        <div className="list-title">{t('farmersList')}</div>
        <div className="farmers-list">
          {loading.fetchFarmers ? (
            <div className="text-center py-5">
              <ButtonLoader />
              <p>Loading farmers...</p>
            </div>
          ) : farmers.length === 0 ? (
            <div className="text-center py-5">
              <p>No farmers found. Add your first farmer!</p>
            </div>
          ) : (
            farmers.map(f => (
              <div key={f._id} className="farmer-box">
                <img
                  src={getFarmerImage(f)}
                  alt={f.name}
                  className="profile-pic"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/profile.png";
                  }}
                />

                <div style={{ flex: 1 }}>
                  <p><b>{t('farmerName')}:</b> {f.name}</p>
                  <p><b>{t('farmerId')}:</b> {f.farmerId}</p>
                  <p><b>{t('contactNumber')}:</b> {f.contact}</p>
                  <p><b>{t('pondCount')}:</b> {f.pondCount}</p>
                  <p className="updated-text" style={{ fontSize: "0.85rem" }}>
                    <b>{t('updated')}:</b> {timeAgo(f.updatedAt || f.createdAt, t)}
                  </p>
                </div>

                {/* Pond List */}
                {f.ponds && f.ponds.length > 0 && (
                  <div style={{ marginTop: 10, width: "100%" }}>
                    <h6>Pond List</h6>
                    <button 
                      className="btn btn-sm btn-success mb-2"
                      onClick={() => openAddPond(f._id)}
                      disabled={loading.addPond}
                    >
                      {loading.addPond ? <ButtonLoader /> : "+ Add Pond"}
                    </button>
                    
                    {/* Desktop Table View */}
                    <div className="table-container">
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th>Pond No.</th>
                            <th>Pond ID</th>
                            <th>Species</th>
                            <th>Selfie</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {f.ponds.map((pond, index) => (
                            <tr key={pond.pondId}>
                              <td>{pond.pondNumber || index + 1}</td>
                              <td>{pond.pondId}</td>
                              <td>{pond.species || "Not specified"}</td>
                              <td>
                                {pond.uploadSelfie && (
                                  <img
                                    src={getSelfieImage(pond)}
                                    alt="Selfie"
                                    style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
                                    onClick={() => window.open(getSelfieImage(pond), '_blank')}
                                    title="Click to view selfie"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                )}
                              </td>
                              <td>{timeAgo(pond.updatedAt || pond.createdAt, t)}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-primary"
                                  onClick={() => openEditPond(f._id, pond)}
                                  disabled={loading.updatePond}
                                >
                                  {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile Card View */}
                    <div className="mobile-pond-view">
                      {f.ponds.map((pond, index) => (
                        <div key={pond.pondId} className="mobile-pond-card">
                          <div className="mobile-pond-row">
                            <span className="mobile-pond-label">Pond No.</span>
                            <span className="mobile-pond-value">{pond.pondNumber || index + 1}</span>
                          </div>
                          <div className="mobile-pond-row">
                            <span className="mobile-pond-label">Pond ID</span>
                            <span className="mobile-pond-value">{pond.pondId}</span>
                          </div>
                          <div className="mobile-pond-row">
                            <span className="mobile-pond-label">Species</span>
                            <span className="mobile-pond-value">{pond.species || "Not specified"}</span>
                          </div>
                          <div className="mobile-pond-row">
                            <span className="mobile-pond-label">Selfie</span>
                            <span className="mobile-pond-value">
                              {pond.uploadSelfie && (
                                <img
                                  src={getSelfieImage(pond)}
                                  alt="Selfie"
                                  style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
                                  onClick={() => window.open(getSelfieImage(pond), '_blank')}
                                  title="Click to view selfie"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                            </span>
                          </div>
                          <div className="mobile-pond-row">
                            <span className="mobile-pond-label">Last Updated</span>
                            <span className="mobile-pond-value">{timeAgo(pond.updatedAt || pond.createdAt, t)}</span>
                          </div>
                          <div className="mobile-pond-row">
                            <span className="mobile-pond-label">Actions</span>
                            <span className="mobile-pond-value">
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => openEditPond(f._id, pond)}
                                style={{ width: "100%", marginTop: "4px" }}
                                disabled={loading.updatePond}
                              >
                                {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
                              </button>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!f.ponds || f.ponds.length === 0) && (
                  <div style={{ marginTop: 10 }}>
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => openAddPond(f._id)}
                      disabled={loading.addPond}
                    >
                      {loading.addPond ? <ButtonLoader /> : "+ Add First Pond"}
                    </button>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => openEdit(f)}
                    disabled={loading.updateFarmer}
                  >
                    {loading.updateFarmer ? <ButtonLoader /> : t('updateFarmer')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Farmer Modal Form - Updated with Aadhar optional */}
      {showForm && (
        <div className="form-modal">
          <div className="form-box" style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            <h5>{isUpdateMode ? "Update Farmer" : t('addFarmer')}</h5>
            
            <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
              <h6>Farmer Details (All fields are required except Aadhar)</h6>
              <div className="row g-2">
                <div className="col-md-6">
                  <input 
                    className="form-control" 
                    placeholder="Name *" 
                    value={newFarmer.name} 
                    onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input 
                    className="form-control" 
                    placeholder="Contact Number *" 
                    value={newFarmer.contact} 
                    onChange={e => setNewFarmer({ ...newFarmer, contact: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required
                  />
                </div>
                
                <div className="col-md-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Age *" 
                    value={newFarmer.age} 
                    onChange={e => setNewFarmer({ ...newFarmer, age: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <select 
                    className="form-control" 
                    value={newFarmer.gender} 
                    onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required
                  >
                    <option value="">Select Gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <input 
                    className="form-control" 
                    placeholder="Aadhar (Optional - 12 digits if provided)" 
                    value={newFarmer.adhar} 
                    onChange={e => setNewFarmer({ ...newFarmer, adhar: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                  />
                  <small className="text-muted">* Optional, 12 digits if provided</small>
                </div>

                <div className="col-md-3">
                  <input 
                    className="form-control" 
                    placeholder="Family Members *" 
                    value={newFarmer.familyMembers} 
                    onChange={e => setNewFarmer({ ...newFarmer, familyMembers: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <input 
                    className="form-control" 
                    placeholder="Family Occupation *" 
                    value={newFarmer.familyOccupation} 
                    onChange={e => setNewFarmer({ ...newFarmer, familyOccupation: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <input 
                    className="form-control" 
                    placeholder="Address *" 
                    value={newFarmer.village} 
                    onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required
                  />
                </div>

                <div className="col-md-12">
                  <label>Farmer Photo (required) *</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*,video/*"
                    capture="environment"
                    onChange={handleFarmerPhotoChange}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required={!isUpdateMode}
                  />

                  {newFarmer.photo && !(newFarmer.photo instanceof File) && (
                    <div style={{ marginTop: 6 }}>
                      <img
                        src={getImageUrl(newFarmer.photo)}
                        alt="Preview"
                        style={{ width: 80, height: 80, borderRadius: "50%" }}
                        onError={(e) => {
                          e.target.src = "/profile.png";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              {isUpdateMode ? (
                <>
                  <button 
                    className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
                    onClick={updateFarmer}
                    disabled={loading.updateFarmer}
                  >
                    {loading.updateFarmer ? <ButtonLoader /> : "Update Farmer"}
                  </button>
                  <button 
                    className="btn btn-secondary flex-grow-1" 
                    onClick={() => { 
                      setShowForm(false); 
                      setEditingFarmerId(null); 
                      setNewFarmer(emptyFarmer);
                      setIsUpdateMode(false);
                    }}
                    disabled={loading.updateFarmer}
                  >
                    {t('cancel')}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
                    onClick={addFarmer}
                    disabled={loading.addFarmer}
                  >
                    {loading.addFarmer ? <ButtonLoader /> : t('submit')}
                  </button>
                  <button 
                    className="btn btn-secondary flex-grow-1" 
                    onClick={() => { 
                      setShowForm(false); 
                      setNewFarmer(emptyFarmer);
                    }}
                    disabled={loading.addFarmer}
                  >
                    {t('cancel')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pond Modal Form */}
      {showPondForm && (
        <div className="form-modal">
          <div className="form-box" style={{ width: "850px", maxHeight: "90vh", overflowY: "auto" }}>
            <h5>{editingPondId ? "Update Pond" : "Add New Pond"}</h5>

            {/* Modal Form Grid */}
            <div className="modal-form-grid">
              
              {/* Pond Details Section */}
              <div className="modal-section">
                <h6>Pond Details (All fields required)</h6>
                <div className="row g-2">
                  <div className="col-md-4">
                    <input 
                      className="form-control" 
                      placeholder="Pond area (eg. 1 acre) *" 
                      value={newPond.pondArea} 
                      onChange={e => setNewPond({ ...newPond, pondArea: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <select 
                      className="form-control" 
                      value={newPond.pondAreaUnit} 
                      onChange={e => setNewPond({ ...newPond, pondAreaUnit: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option value="acre">acre</option>
                      <option value="hectare">hectare</option>
                      <option value="footsquare">footsquare</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input 
                      className="form-control" 
                      placeholder="Pond depth (ft) *" 
                      value={newPond.pondDepth} 
                      onChange={e => setNewPond({ ...newPond, pondDepth: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Pond image (GPS) - required *</label>
                    <input 
                      type="file"
                      className="form-control"
                      accept="image/*,video/*"
                      capture="environment"
                      onChange={handlePondImageChange}
                      disabled={loading.addPond || loading.updatePond}
                      required={!editingPondId}
                    />

                    {newPond.pondImage && newPond.pondImage instanceof File && (
                      <div style={{ marginTop: 6 }}>
                        <small>New file selected</small>
                      </div>
                    )}

                    {editingPondId && !(newPond.pondImage instanceof File) && newPond.pondImage && (
                      <div style={{ marginTop: 6 }}>
                        <img
                          src={getImageUrl(newPond.pondImage)}
                          alt="Pond preview"
                          style={{ width: 80, height: 80, borderRadius: "4px" }}
                          onError={(e) => {
                            e.target.src = "/profile.png";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label>Upload Pond Picture/Video (required) *</label>
                    <input 
                      type="file"
                      className="form-control"
                      accept="image/*,video/*"
                      capture="environment"
                      multiple
                      onChange={handlePondFilesChange}
                      disabled={loading.addPond || loading.updatePond}
                    />
                    
                    {newPond.pondFiles && newPond.pondFiles.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        <small>{newPond.pondFiles.length} file(s) selected</small>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label>Overflow from somewhere in pond? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.overflow} 
                      onChange={e => setNewPond({ ...newPond, overflow: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Pond receives proper Sunlight? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.receivesSunlight} 
                      onChange={e => setNewPond({ ...newPond, receivesSunlight: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Trees present on banks? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.treesOnBanks} 
                      onChange={e => setNewPond({ ...newPond, treesOnBanks: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Neighbourhood *</label>
                    <select 
                      className="form-control" 
                      value={newPond.neighbourhood} 
                      onChange={e => setNewPond({ ...newPond, neighbourhood: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Agriculture Farm</option>
                      <option>Pond</option>
                      <option>Road</option>
                      <option>Residential Area</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Does wastewater enter pond? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.wastewaterEnters} 
                      onChange={e => setNewPond({ ...newPond, wastewaterEnters: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="modal-section">
                <h6>Location (Required)</h6>
                <div className="row g-2">
                  <div className="col-md-12 mb-2">
                    <button 
                      type="button"
                      className="btn btn-primary w-45 d-flex align-items-center justify-content-center gap-2"
                      onClick={getLocation}
                      disabled={isGettingLocation || loading.addPond || loading.updatePond}
                    >
                      {isGettingLocation ? <ButtonLoader /> : <MapPin size={16} />}
                      {isGettingLocation ? "Getting Location..." : "📍 Open My Location"}
                    </button>
                  </div>

                  <div className="col-md-6">
                    <label>Latitude *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPond.latitude || ""}
                      readOnly
                      placeholder="Latitude will auto-fill"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Longitude *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPond.longitude || ""}
                      readOnly
                      placeholder="Longitude will auto-fill"
                      required
                    />
                  </div>

                  {(newPond.latitude || newPond.longitude) && (
                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={clearLocation}
                        disabled={loading.addPond || loading.updatePond}
                      >
                        Clear Location
                      </button>
                      <small className="text-success ms-2">
                        ✓ Location captured: {newPond.latitude}, {newPond.longitude}
                      </small>
                    </div>
                  )}
                </div>
              </div>

              {/* Species & Stocking */}
              <div className="modal-section">
                <h6>Species & Stocking (All fields required)</h6>
                <div className="row g-2">
                  <div className="col-md-6">
                    <input 
                      className="form-control" 
                      placeholder="Fish Species Cultured *" 
                      value={newPond.species} 
                      onChange={e => setNewPond({ ...newPond, species: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Date of Stocking *</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={newPond.dateOfStocking} 
                      onChange={e => setNewPond({ ...newPond, dateOfStocking: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input 
                      type="text"
                      className="form-control" 
                      placeholder="Quantity of Seed initially in Pond *" 
                      value={newPond.qtySeedInitially} 
                      onChange={e => setNewPond({ ...newPond, qtySeedInitially: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input 
                      type="text"
                      className="form-control" 
                      placeholder="Current Quantity of Fish in Pond *" 
                      value={newPond.currentQty} 
                      onChange={e => setNewPond({ ...newPond, currentQty: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Average size of fishes *</label>
                    <select 
                      className="form-control" 
                      value={newPond.avgSize} 
                      onChange={e => setNewPond({ ...newPond, avgSize: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>&gt;200gram</option>
                      <option>200-500 gram</option>
                      <option>500-750 gram</option>
                      <option>&lt;750gram</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Feed Details */}
              <div className="modal-section">
                <h6>Feed Details (All fields required)</h6>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label>Feed Type Used *</label>
                    <select 
                      className="form-control" 
                      value={newPond.feedType} 
                      onChange={e => setNewPond({ ...newPond, feedType: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Market Feed</option>
                      <option>Homemade Feed</option>
                      <option>Both</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input 
                      className="form-control" 
                      placeholder="If Other, mention" 
                      value={newPond.feedOther} 
                      onChange={e => setNewPond({ ...newPond, feedOther: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Feed frequency *</label>
                    <select 
                      className="form-control" 
                      value={newPond.feedFreq} 
                      onChange={e => setNewPond({ ...newPond, feedFreq: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Once a day</option>
                      <option>twice a day</option>
                      <option>thrice a day</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <input 
                      className="form-control" 
                      placeholder="Feed quantity given per day (in kg) *" 
                      value={newPond.feedQtyPerDay} 
                      onChange={e => setNewPond({ ...newPond, feedQtyPerDay: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Approx time of feeding *</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      value={newPond.feedTime} 
                      onChange={e => setNewPond({ ...newPond, feedTime: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input 
                      className="form-control" 
                      placeholder="Any recent changes in feed or feeding behaviour *" 
                      value={newPond.recentFeedChanges} 
                      onChange={e => setNewPond({ ...newPond, recentFeedChanges: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Do fish show reduced appetite? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.reducedAppetite} 
                      onChange={e => setNewPond({ ...newPond, reducedAppetite: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Water Quality */}
              <div className="modal-section">
                <h6>Water Quality (All fields required)</h6>
                <div className="row g-2">
                  <div className="col-md-3">
                    <input 
                      className="form-control" 
                      placeholder="Water Temp (°C) *" 
                      value={newPond.waterTemperature} 
                      onChange={e => setNewPond({ ...newPond, waterTemperature: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input 
                      className="form-control" 
                      placeholder="pH measured *" 
                      value={newPond.pH} 
                      onChange={e => setNewPond({ ...newPond, pH: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input 
                      className="form-control" 
                      placeholder="DO measured *" 
                      value={newPond.DO} 
                      onChange={e => setNewPond({ ...newPond, DO: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label>Ammonia (NH₃) Level *</label>
                    <select 
                      className="form-control" 
                      value={newPond.ammoniaLevel} 
                      onChange={e => setNewPond({ ...newPond, ammoniaLevel: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label>Phytoplankton Levels *</label>
                    <select 
                      className="form-control" 
                      value={newPond.phytoplanktonLevel} 
                      onChange={e => setNewPond({ ...newPond, phytoplanktonLevel: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label>Water Hardness *</label>
                    <select 
                      className="form-control" 
                      value={newPond.waterHardness} 
                      onChange={e => setNewPond({ ...newPond, waterHardness: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label>Any visible algae bloom? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.algaeBloom} 
                      onChange={e => setNewPond({ ...newPond, algaeBloom: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option><option>No</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label>Pond Water Colour *</label>
                    <select 
                      className="form-control" 
                      value={newPond.pondWaterColor} 
                      onChange={e => setNewPond({ ...newPond, pondWaterColor: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Light Green</option><option>Dark Green</option><option>Yellowish Green</option>
                      <option>Brownish Green</option><option>Yellow</option><option>Muddy Brown</option>
                      <option>Black</option><option>Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Source of Water *</label>
                    <select 
                      className="form-control" 
                      value={newPond.sourceOfWater} 
                      onChange={e => setNewPond({ ...newPond, sourceOfWater: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Rainwater</option><option>Pump</option><option>River</option><option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Disease & Symptoms */}
              <div className="modal-section">
                <h6>Disease & Symptoms (All fields required)</h6>
                <div className="row g-2">
                  <div className="col-md-3">
                    <label>Any disease symptoms? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.diseaseSymptoms} 
                      onChange={e => setNewPond({ ...newPond, diseaseSymptoms: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option><option>No</option>
                    </select>
                  </div>

                  {/* SYMPTOMS SECTION */}
                  <div className="col-md-12">
                    <label>Symptoms observed (check / or type) *</label>
                    <div className="symptoms-grid">
                      {SYMPTOMS_LIST.map(s => (
                        <label key={s} className="symptom-checkbox">
                          <input 
                            type="checkbox" 
                            checked={newPond.symptoms?.includes(s)} 
                            onChange={() => toggleSymptom(s)} 
                            disabled={loading.addPond || loading.updatePond}
                          /> 
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <input 
                        className="form-control" 
                        placeholder="Or type symptoms comma separated *" 
                        value={newPond.symptomsObserved} 
                        onChange={e => setNewPond({ ...newPond, symptomsObserved: e.target.value })}
                        disabled={loading.addPond || loading.updatePond}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="How many fish have died last 15 days(cumulative)? *" 
                      value={newPond.fishDeaths} 
                      onChange={e => setNewPond({ ...newPond, fishDeaths: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Are symptoms affecting all fish or only a few? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.symptomsAffect} 
                      onChange={e => setNewPond({ ...newPond, symptomsAffect: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>All</option><option>Few</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Upload fish images/videos (required) *</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      capture="environment"
                      multiple
                      className="form-control"
                      onChange={handleFishFilesChange}
                      disabled={loading.addPond || loading.updatePond}
                    />
                    {newPond.fishFiles && newPond.fishFiles.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        <small>{newPond.fishFiles.length} file(s) selected</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selfie Upload Section - OPTIONAL */}
              <div className="modal-section">
                <h6>Selfie with Farmer</h6>
                <div className="row g-2">
                  <div className="col-md-12">
                    <label>Upload Your Selfie with Farmer</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      capture="user"
                      onChange={handleSelfieCapture}
                      disabled={loading.addPond || loading.updatePond}
                    />
                    
                    {selfiePreview && (
                      <div style={{ marginTop: 10, textAlign: 'center' }}>
                        <p>Selfie Preview:</p>
                        <img
                          src={selfiePreview}
                          alt="Selfie preview"
                          style={{ 
                            width: 150, 
                            height: 150, 
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '2px solid #28a745'
                          }}
                        />
                      </div>
                    )}
                    
                    {editingPondId && !selfiePreview && newPond.uploadSelfie && (
                      <div style={{ marginTop: 10, textAlign: 'center' }}>
                        <p>Current Selfie:</p>
                        <img
                          src={getImageUrl(newPond.uploadSelfie)}
                          alt="Current selfie"
                          style={{ 
                            width: 150, 
                            height: 150, 
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '2px solid #17a2b8'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Observation & Misc */}
              <div className="modal-section">
                <h6>Observation & Misc (All fields required)</h6>
                <div className="row g-2">
                  <div className="col-md-4">
                    <label>Date of Farm Observed *</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={newPond.farmObservedDate} 
                      onChange={e => setNewPond({ ...newPond, farmObservedDate: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label>Time of Farm Observed *</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      value={newPond.farmObservedTime} 
                      onChange={e => setNewPond({ ...newPond, farmObservedTime: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Which species farmer cultured last time? *</label>
                    <input 
                      className="form-control" 
                      value={newPond.lastSpecies} 
                      onChange={e => setNewPond({ ...newPond, lastSpecies: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Does farmer completely harvest the last crop? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.lastHarvestComplete} 
                      onChange={e => setNewPond({ ...newPond, lastHarvestComplete: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option><option>No</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label>Any recent heavy rains or floods? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.recentRainFlood} 
                      onChange={e => setNewPond({ ...newPond, recentRainFlood: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option><option>No</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label>Any pesticide/chemical runoff near pond? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.pesticideRunoff} 
                      onChange={e => setNewPond({ ...newPond, pesticideRunoff: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option><option>No</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label>Any construction/activity near pond? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.constructionNear} 
                      onChange={e => setNewPond({ ...newPond, constructionNear: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option><option>No</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label>Any sudden temperature change recently? *</label>
                    <select 
                      className="form-control" 
                      value={newPond.suddenTempChange} 
                      onChange={e => setNewPond({ ...newPond, suddenTempChange: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    >
                      <option>Yes</option><option>No</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label>Notes / Remarks *</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      value={newPond.notes} 
                      onChange={e => setNewPond({ ...newPond, notes: e.target.value })}
                      disabled={loading.addPond || loading.updatePond}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              {editingPondId ? (
                <>
                  <button 
                    className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
                    onClick={updatePond}
                    disabled={loading.updatePond}
                  >
                    {loading.updatePond ? <ButtonLoader /> : "Update Pond"}
                  </button>
                  <button 
                    className="btn btn-secondary flex-grow-1" 
                    onClick={() => { 
                      setShowPondForm(false); 
                      setNewPond(emptyPond);
                      setCurrentFarmerId(null);
                      setEditingPondId(null);
                      setLatitude("");
                      setLongitude("");
                      setSelfieFile(null);
                      setSelfiePreview(null);
                    }}
                    disabled={loading.updatePond}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2" 
                    onClick={addPond}
                    disabled={loading.addPond}
                  >
                    {loading.addPond ? <ButtonLoader /> : "Add Pond"}
                  </button>
                  <button 
                    className="btn btn-secondary flex-grow-1" 
                    onClick={() => { 
                      setShowPondForm(false); 
                      setNewPond(emptyPond);
                      setCurrentFarmerId(null);
                      setLatitude("");
                      setLongitude("");
                      setSelfieFile(null);
                      setSelfiePreview(null);
                    }}
                    disabled={loading.addPond}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;