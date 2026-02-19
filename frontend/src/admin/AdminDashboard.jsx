



// // AdminDashboard.js
// import React, { useEffect, useState } from "react";
// import api from "../utils/api";
// import { useNavigate } from "react-router-dom";
// import "./AdminDashboard.css";

// import { getProfileImage } from "../utils/profileImage";

// function AdminDashboard() {
//   const [agents, setAgents] = useState([]);
//   const [selectedAgent, setSelectedAgent] = useState(null);
//   const [farmers, setFarmers] = useState([]);
//   const [dealers, setDealers] = useState([]);
//   const [viewType, setViewType] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalImage, setModalImage] = useState("");

//   const [historyModalOpen, setHistoryModalOpen] = useState(false);
//   const [historyData, setHistoryData] = useState([]);
//   const [historyTitle, setHistoryTitle] = useState("");

//   const [accessRequests, setAccessRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedFarmer, setSelectedFarmer] = useState(null);
//   const [showPondDetails, setShowPondDetails] = useState(false);
//   const [selectedPond, setSelectedPond] = useState(null);
//   const [pondDetailsModalOpen, setPondDetailsModalOpen] = useState(false);

//   const navigate = useNavigate();

// // ✅ COMPLETELY FIXED: Smart image URL resolver for all types
// const getImageUrl = (imagePath, imageType = "profile", userId = null, pondId = null) => {
//   try {
//     const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";
    
//     console.log(`🔗 getImageUrl called:`, { imagePath, imageType, userId, pondId });
    
//     // Handle null/undefined
//     if (!imagePath || imagePath === "null" || imagePath === "undefined") {
//       return "/no-image.png";
//     }
    
//     // If imagePath is already a URL (like data:image or http), return as is
//     if (typeof imagePath === 'string' && (imagePath.startsWith('data:') || imagePath.startsWith('http'))) {
//       return imagePath;
//     }
    
//     // Handle different image types
//     switch(imageType) {
//       // Agent images
//       case "profile":
//       case "aadharFront":
//       case "aadharBack":
//       case "pan":
//       case "savingImg":
//         if (typeof imagePath === 'string' && /^[0-9a-fA-F]{24}$/.test(imagePath)) {
//           return `${API_URL}/api/images/${imagePath}/${imageType}`;
//         }
//         return "/profile.png";
      
//       // Farmer image
//       case "farmer":
//         if (typeof imagePath === 'string' && /^[0-9a-fA-F]{24}$/.test(imagePath)) {
//           return `${API_URL}/api/images/farmer/photo/${imagePath}`;
//         }
//         return "/profile.png";
      
//       // Dealer image
//       case "dealer":
//         if (typeof imagePath === 'string' && /^[0-9a-fA-F]{24}$/.test(imagePath)) {
//           return `${API_URL}/api/images/dealer/image/${imagePath}`;
//         }
//         return "/no-image.png";
      
//       // Pond image
//       case "pond":
//         // If pondId is provided (for pond thumbnail)
//         if (pondId && typeof pondId === 'string') {
//           // Check if pondId is ObjectId or pond code
//           if (/^[0-9a-fA-F]{24}$/.test(pondId)) {
//             return `${API_URL}/api/images/pond/image/${pondId}`;
//           } else if (pondId.includes('FAR-') && pondId.includes('-P')) {
//             return `${API_URL}/api/images/pond/image/${pondId}`;
//           }
//         }
        
//         // If imagePath is a pond ID
//         if (typeof imagePath === 'string') {
//           if (/^[0-9a-fA-F]{24}$/.test(imagePath)) {
//             return `${API_URL}/api/images/pond/image/${imagePath}`;
//           } else if (imagePath.includes('FAR-') && imagePath.includes('-P')) {
//             return `${API_URL}/api/images/pond/image/${imagePath}`;
//           }
//         }
//         return "/no-image.png";
      
//       // Pond files
//       case "pondFiles":
//         if (pondId && typeof imagePath === 'number') {
//           if (/^[0-9a-fA-F]{24}$/.test(pondId)) {
//             return `${API_URL}/api/images/pond/file/${pondId}/${imagePath}`;
//           } else if (pondId.includes('FAR-') && pondId.includes('-P')) {
//             return `${API_URL}/api/images/pond/file/${pondId}/${imagePath}`;
//           }
//         }
//         return "/no-image.png";
      
//       // Fish files
//       case "fishFiles":
//         if (pondId && typeof imagePath === 'number') {
//           if (/^[0-9a-fA-F]{24}$/.test(pondId)) {
//             return `${API_URL}/api/images/fish/file/${pondId}/${imagePath}`;
//           } else if (pondId.includes('FAR-') && pondId.includes('-P')) {
//             return `${API_URL}/api/images/fish/file/${pondId}/${imagePath}`;
//           }
//         }
//         return "/no-image.png";
      
//       default:
//         console.warn(`Unknown imageType: ${imageType}`);
//         return "/no-image.png";
//     }
    
//   } catch (error) {
//     console.error("❌ Error in getImageUrl:", error, "Input:", imagePath);
//     return "/no-image.png";
//   }
// };

// // ✅ FIXED: Get agent image URL
// const getAgentImageUrl = (agent, type) => {
//   if (!agent || !agent._id) return "/profile.png";
  
//   return getImageUrl(agent._id, type);
// };

// // ✅ SIMPLIFIED: Get farmer image URL
// const getFarmerImageUrl = (farmer) => {
//   if (!farmer || !farmer._id) {
//     console.log("No farmer or farmer._id found");
//     return "/profile.png";
//   }
  
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";
//   const url = `${API_URL}/api/images/farmer/photo/${farmer._id}`;
  
//   console.log(`Farmer image URL for ${farmer._id}:`, url);
//   return url;
// };

// // ✅ FIXED: Get pond image URL
// const getPondImageUrl = (pond, pondId) => {
//   if (!pond) {
//     console.log("❌ No pond object provided");
//     return "/no-image.png";
//   }
  
//   const apiUrl = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";
  
//   // Debug logs
//   console.log("🔍 Pond object in getPondImageUrl:", {
//     pondId: pond._id,
//     pondPondId: pond.pondId,
//     passedPondId: pondId,
//     fullPond: pond
//   });
  
//   // Priority 1: Use pond.pondId (like FAR-2026-00006-P2)
//   if (pond.pondId && typeof pond.pondId === 'string') {
//     const url = `${apiUrl}/api/images/pond/image/${pond.pondId}`;
//     console.log(`✅ Using pond.pondId URL:`, url);
//     return url;
//   }
  
//   // Priority 2: Use pond._id (ObjectId)
//   if (pond._id && /^[0-9a-fA-F]{24}$/.test(pond._id)) {
//     const url = `${apiUrl}/api/images/pond/image/${pond._id}`;
//     console.log(`✅ Using pond._id URL:`, url);
//     return url;
//   }
  
//   // Priority 3: Use passed pondId parameter
//   if (pondId) {
//     const url = `${apiUrl}/api/images/pond/image/${pondId}`;
//     console.log(`✅ Using passed pondId URL:`, url);
//     return url;
//   }
  
//   // Priority 4: Try to extract from pond object
//   if (pond.pondImage && pond.pondImage._id) {
//     const url = `${apiUrl}/api/images/pond/image/${pond.pondImage._id}`;
//     console.log(`✅ Using pond.pondImage._id URL:`, url);
//     return url;
//   }
  
//   console.log(`❌ No valid pond ID found, returning fallback`);
//   return "/no-image.png";
// };

// // const getDealerImageUrl = (dealer) => {
// //   if (!dealer) {
// //     console.log("❌ No dealer object provided");
// //     return "/no-image.png";
// //   }
  
// //   console.log(`🔍 Dealer object in getDealerImageUrl:`, {
// //     _id: dealer._id,
// //     name: dealer.name,
// //     hasImage: !!dealer.image,
// //     imageData: dealer.image?.data ? `Exists, type: ${typeof dealer.image.data}` : 'no data'
// //   });
  
// //   // ✅ FIXED: CORRECT API URL
// //   const apiUrl = "https://essential-r440.onrender.com";
  
// //   // Strategy 1: Try direct API endpoint first
// //   if (dealer._id && /^[0-9a-fA-F]{24}$/.test(dealer._id)) {
// //     const url = `${apiUrl}/api/dealers/${dealer._id}/image`;
// //     console.log(`✅ Strategy 1: Direct API URL:`, url);
// //     return url;
// //   }
  
// //   // Strategy 2: Handle MongoDB Binary data directly (fallback)
// //   if (dealer.image && dealer.image.data) {
// //     try {
// //       console.log("🔄 Processing MongoDB Binary image data...");
      
// //       // Convert buffer to data URL
// //       if (dealer.image.data && typeof dealer.image.data === 'object') {
// //         let base64String;
        
// //         // Method 1: Already base64 string
// //         if (typeof dealer.image.data === 'string') {
// //           base64String = dealer.image.data;
// //         }
// //         // Method 2: Buffer to base64
// //         else if (dealer.image.data.buffer) {
// //           const uint8Array = new Uint8Array(dealer.image.data.buffer);
// //           base64String = btoa(String.fromCharCode.apply(null, uint8Array));
// //         }
// //         // Method 3: Direct array
// //         else if (Array.isArray(dealer.image.data)) {
// //           base64String = btoa(String.fromCharCode.apply(null, dealer.image.data));
// //         }
        
// //         if (base64String) {
// //           const contentType = dealer.image.contentType || 'image/png';
// //           const dataUrl = `data:${contentType};base64,${base64String}`;
          
// //           console.log(`✅ Strategy 2: Converted Binary to data URL`);
// //           return dataUrl;
// //         }
// //       }
// //     } catch (error) {
// //       console.error("❌ Error converting Binary image:", error);
// //     }
// //   }
  
// //   console.log(`❌ No valid dealer image found, using fallback`);
// //   return "/no-image.png";
// // };

// // ✅ SIMPLE & CORRECT: Get dealer image URL

// // ✅ UPDATED: Correct dealer image URL
// const getDealerImageUrl = (dealer) => {
//   if (!dealer || !dealer._id) return "/no-image.png";
  
//   const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";
  
//   // CORRECT ROUTE: Use the images route, not dealers route
//   return `${API_URL}/api/images/dealer/image/${dealer._id}`;
// };












// // ✅ FIXED: Get pond files URLs
// const getPondFilesUrls = (pondFiles, pondId, pond = null) => {
//   console.log(`🔄 getPondFilesUrls called:`, { 
//     pondFilesCount: pondFiles?.length, 
//     pondId,
//     pond: pond
//   });
  
//   if (!pondFiles || !Array.isArray(pondFiles) || pondFiles.length === 0 || !pondId) {
//     console.log(`❌ No pond files or pondId`);
//     return [];
//   }
  
//   const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";
  
//   const urls = pondFiles.map((file, index) => {
//     // CORRECTED: Use pond ID from the pond object itself
//     let pondCode;
    
//     // Priority 1: Use pond.pondId (like FAR-2026-00003-P1) if available
//     if (pond && pond.pondId && typeof pond.pondId === 'string') {
//       pondCode = pond.pondId;
//       console.log(`✅ Using pond.pondId for files: ${pondCode}`);
//     } 
//     // Priority 2: Use the pondId parameter if it's a pond code
//     else if (pondId && typeof pondId === 'string' && pondId.includes('FAR-') && pondId.includes('-P')) {
//       pondCode = pondId;
//       console.log(`✅ Using pondId parameter for files: ${pondCode}`);
//     }
//     // Priority 3: Use selectedPond if available
//     else if (selectedPond && selectedPond.pondId) {
//       pondCode = selectedPond.pondId;
//       console.log(`✅ Using selectedPond for files: ${pondCode}`);
//     }
//     // Priority 4: Try to get from farmers data
//     else if (selectedFarmer && selectedFarmer.ponds) {
//       const farmerPond = selectedFarmer.ponds.find(p => p._id === pondId || p.pondId === pondId);
//       if (farmerPond && farmerPond.pondId) {
//         pondCode = farmerPond.pondId;
//         console.log(`✅ Found pond code from farmer data: ${pondCode}`);
//       }
//     }
//     // Fallback: Use the passed pondId
//     else {
//       pondCode = pondId;
//       console.log(`⚠️ Using passed pondId (may need conversion): ${pondCode}`);
//     }
    
//     // IMPORTANT: Try BOTH URL patterns - one might work
//     const urlPatterns = [
//       `${API_URL}/api/images/pond/file/${pondCode}/${index}`,
//       `${API_URL}/api/pond/${pondCode}/files/${index}`,
//       `${API_URL}/api/pond/files/${pondCode}/${index}`
//     ];
    
//     console.log(`🔄 Trying URL patterns for pond file ${index}:`, urlPatterns);
    
//     // Return the first URL pattern (frontend will try it)
//     return urlPatterns[0];
//   });
  
//   return urls;
// };

// // ✅ FIXED: Get fish files URLs
// const getFishFilesUrls = (fishFiles, pondId, pond = null) => {
//   console.log(`🔄 getFishFilesUrls called:`, { 
//     fishFilesCount: fishFiles?.length, 
//     pondId,
//     pond: pond
//   });
  
//   if (!fishFiles || !Array.isArray(fishFiles) || fishFiles.length === 0 || !pondId) {
//     console.log(`❌ No fish files or pondId`);
//     return [];
//   }
  
//   const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";
  
//   const urls = fishFiles.map((file, index) => {
//     // CORRECTED: Use pond ID from the pond object itself
//     let pondCode;
    
//     // Priority 1: Use pond.pondId (like FAR-2026-00003-P1) if available
//     if (pond && pond.pondId && typeof pond.pondId === 'string') {
//       pondCode = pond.pondId;
//       console.log(`✅ Using pond.pondId for fish files: ${pondCode}`);
//     } 
//     // Priority 2: Use the pondId parameter if it's a pond code
//     else if (pondId && typeof pondId === 'string' && pondId.includes('FAR-') && pondId.includes('-P')) {
//       pondCode = pondId;
//       console.log(`✅ Using pondId parameter for fish files: ${pondCode}`);
//     }
//     // Priority 3: Use selectedPond if available
//     else if (selectedPond && selectedPond.pondId) {
//       pondCode = selectedPond.pondId;
//       console.log(`✅ Using selectedPond for fish files: ${pondCode}`);
//     }
//     // Priority 4: Try to get from farmers data
//     else if (selectedFarmer && selectedFarmer.ponds) {
//       const farmerPond = selectedFarmer.ponds.find(p => p._id === pondId || p.pondId === pondId);
//       if (farmerPond && farmerPond.pondId) {
//         pondCode = farmerPond.pondId;
//         console.log(`✅ Found pond code from farmer data for fish: ${pondCode}`);
//       }
//     }
//     // Fallback: Use the passed pondId
//     else {
//       pondCode = pondId;
//       console.log(`⚠️ Using passed pondId for fish (may need conversion): ${pondCode}`);
//     }
    
//     // IMPORTANT: Try BOTH URL patterns - one might work
//     const urlPatterns = [
//       `${API_URL}/api/images/fish/file/${pondCode}/${index}`,
//       `${API_URL}/api/fish/${pondCode}/files/${index}`,
//       `${API_URL}/api/fish/files/${pondCode}/${index}`
//     ];
    
//     console.log(`🔄 Trying URL patterns for fish file ${index}:`, urlPatterns);
    
//     // Return the first URL pattern (frontend will try it)
//     return urlPatterns[0];
//   });
  
//   return urls;
// };

//   // Filtering
//   const filteredFarmers = farmers.filter((f) =>
//     (f.farmerId || "").toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const filteredDealers = dealers.filter((d) =>
//     (d.name || "").toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Load agents
//   useEffect(() => {
//     setLoading(true);
//     api
//       .get("/api/admin/agents")
//       .then((res) => {
//         setAgents(res.data || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//       });
//   }, []);

//   // Load access requests
//   const loadAccessRequests = () => {
//     api
//       .get("/api/access/requests")
//       .then((res) => setAccessRequests(res.data || []))
//       .catch(() => {});
//   };

//   useEffect(() => {
//     loadAccessRequests();
//     const id = setInterval(loadAccessRequests, 10000);
//     return () => clearInterval(id);
//   }, []);

//   // Load agent data with FIXED image loading
//   const loadAgentData = (agentId, type) => {
//     setLoading(true);
//     setSelectedFarmer(null);
//     setShowPondDetails(false);
//     api
//       .get(`/api/admin/agents/${agentId}/details`)
//       .then((res) => {
//         // Ensure farmers have their images loaded properly
//         const farmersWithImages = (res.data.farmers || []).map(farmer => ({
//           ...farmer,
//           // Ensure photo URL is properly set
//           photoUrl: getFarmerImageUrl(farmer)
//         }));
        
//         // Ensure dealers have their images loaded properly
//         const dealersWithImages = (res.data.dealers || []).map(dealer => ({
//           ...dealer,
//           // Ensure image URL is properly set
//           imageUrl: getDealerImageUrl(dealer)
//         }));
        
//         setFarmers(farmersWithImages);
//         setDealers(dealersWithImages);
//         const ag = agents.find((a) => a._id === agentId) || null;
//         setSelectedAgent(ag);
//         setViewType(type);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//       });
//   };

//   // ✅ Open Farmer Details with Ponds
//   const openFarmerDetails = (farmer) => {
//     setSelectedFarmer(farmer);
//     setShowPondDetails(true);
//   };

//   // ✅ Open Pond Details Modal with FIXED image URLs
//   const openPondDetails = (pond) => {
//     console.log("🔄 Opening pond details:", {
//       pondId: pond.pondId,
//       pond_Id: pond._id,
//       hasPondFiles: pond.pondFiles?.length,
//       hasFishFiles: pond.fishFiles?.length
//     });
    
//     // Enhance pond object with proper image URLs
//     const enhancedPond = {
//       ...pond,
//       pondImageUrl: getPondImageUrl(pond, pond._id),
//       // PASS THE POND OBJECT HERE - This is the key fix!
//       pondFilesUrls: getPondFilesUrls(pond.pondFiles, pond._id, pond),
//       fishFilesUrls: getFishFilesUrls(pond.fishFiles, pond._id, pond)
//     };
    
//     console.log("Enhanced pond with URLs:", {
//       pondImageUrl: enhancedPond.pondImageUrl,
//       pondFilesUrls: enhancedPond.pondFilesUrls,
//       fishFilesUrls: enhancedPond.fishFilesUrls
//     });
    
//     setSelectedPond(enhancedPond);
//     setPondDetailsModalOpen(true);
//   };

//   // Modal open/close
//   const openModal = (imgUrl) => {
//     setModalImage(imgUrl);
//     setModalOpen(true);
//   };
//   const closeModal = () => {
//     setModalOpen(false);
//     setModalImage("");
//   };

//   const closePondDetailsModal = () => {
//     setPondDetailsModalOpen(false);
//     setSelectedPond(null);
//   };

//   // Access Allow / Reject
//   const handleAllow = (requestId) => {
//     api
//       .post("/api/access/allow", { requestId })
//       .then(() => {
//         localStorage.setItem("accessApproved", "true");
//         setAccessRequests((prev) => prev.filter((r) => r._id !== requestId));
//       })
//       .catch((err) => console.log(err));
//   };
//   const handleReject = (requestId) => {
//     api
//       .post("/api/access/reject", { requestId })
//       .then(() =>
//         setAccessRequests((prev) => prev.filter((r) => r._id !== requestId))
//       )
//       .catch((err) => console.log(err));
//   };

//   // Excel download functions
//   const downloadSingleExcel = (item, fileName) => {
//     const header = Object.keys(item);
//     const csvRows = [
//       header.join(","),
//       header.map((key) => JSON.stringify(item[key] || "")).join(","),
//     ];
//     const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = `${fileName}.csv`;
//     a.click();
//   };

//   // ✅ Download farmer data with ALL ponds
//   const downloadFarmerExcelWithAllPonds = (farmersData) => {
//     if (!farmersData.length) return;
    
//     try {
//       const allRows = [];
      
//       const farmerHeaders = [
//         "Farmer ID", "Name", "Contact", "Age", "Gender", "Village", 
//         "Aadhar", "Family Members", "Family Occupation", "Photo", 
//         "Pond Count", "Created At", "Updated At", "Agent ID", "Agent Name"
//       ];
      
//       const pondHeaders = [
//         "Pond ID", "Pond Number", "Pond Area", "Area Unit", "Pond Depth",
//         "Latitude", "Longitude",
//         "Overflow", "Receives Sunlight", "Trees on Banks", "Neighbourhood", "Wastewater Enters",
//         "Species", "Date of Stocking", "Initial Seed Qty", "Current Fish Qty", "Average Size",
//         "Feed Type", "Feed Other", "Feed Frequency", "Feed Qty/Day", "Feed Time",
//         "Recent Feed Changes", "Reduced Appetite", "Water Temperature", "pH", "DO",
//         "Ammonia Level", "Phytoplankton Level", "Water Hardness", "Algae Bloom", "Pond Water Color",
//         "Source of Water", "Disease Symptoms", "Symptoms Observed", "Fish Deaths", "Symptoms Affect",
//         "Farm Observed Date", "Farm Observed Time", "Last Species", "Last Harvest Complete",
//         "Recent Rain/Flood", "Pesticide Runoff", "Construction Near", "Sudden Temp Change",
//         "Notes", "Pond Image Link", "Pond Files", "Fish Files", "Created At", "Updated At"
//       ];
      
//       const allHeaders = [...farmerHeaders, ...pondHeaders.map(h => `Pond_${h}`)];
//       allRows.push(allHeaders);
      
//       farmersData.forEach(farmer => {
//         const farmerBasicData = [
//           farmer.farmerId || "",
//           farmer.name || "",
//           farmer.contact || "",
//           farmer.age || "",
//           farmer.gender || "",
//           farmer.village || "",
//           farmer.adhar || "",
//           farmer.familyMembers || "",
//           farmer.familyOccupation || "",
//           getFarmerImageUrl(farmer),
//           farmer.pondCount || 0,
//           farmer.createdAt ? new Date(farmer.createdAt).toLocaleString() : "",
//           farmer.updatedAt ? new Date(farmer.updatedAt).toLocaleString() : "",
//           selectedAgent?._id || "",
//           selectedAgent?.name || ""
//         ];
        
//         if (farmer.ponds && farmer.ponds.length > 0) {
//           farmer.ponds.forEach(pond => {
//             const pondImageLink = getPondImageUrl(pond, pond._id);
            
//             const pondData = [
//               pond.pondId || "",
//               pond.pondNumber || "",
//               pond.pondArea || "",
//               pond.pondAreaUnit || "",
//               pond.pondDepth || "",
//               pond.latitude || "",
//               pond.longitude || "",
//               pond.overflow || "",
//               pond.receivesSunlight || "",
//               pond.treesOnBanks || "",
//               pond.neighbourhood || "",
//               pond.wastewaterEnters || "",
//               pond.species || "",
//               pond.dateOfStocking || "",
//               pond.qtySeedInitially || "",
//               pond.currentQty || "",
//               pond.avgSize || "",
//               pond.feedType || "",
//               pond.feedOther || "",
//               pond.feedFreq || "",
//               pond.feedQtyPerDay || "",
//               pond.feedTime || "",
//               pond.recentFeedChanges || "",
//               pond.reducedAppetite || "",
//               pond.waterTemperature || "",
//               pond.pH || "",
//               pond.DO || "",
//               pond.ammoniaLevel || "",
//               pond.phytoplanktonLevel || "",
//               pond.waterHardness || "",
//               pond.algaeBloom || "",
//               pond.pondWaterColor || "",
//               pond.sourceOfWater || "",
//               pond.diseaseSymptoms || "",
//               pond.symptomsObserved || "",
//               pond.fishDeaths || "",
//               pond.symptomsAffect || "",
//               pond.farmObservedDate || "",
//               pond.farmObservedTime || "",
//               pond.lastSpecies || "",
//               pond.lastHarvestComplete || "",
//               pond.recentRainFlood || "",
//               pond.pesticideRunoff || "",
//               pond.constructionNear || "",
//               pond.suddenTempChange || "",
//               pond.notes || "",
//               pondImageLink,
//               Array.isArray(pond.pondFiles) ? 
//                 pond.pondFiles.map(file => getImageUrl(file, "pond", pond._id)).join("; ") : "",
//               Array.isArray(pond.fishFiles) ? 
//                 pond.fishFiles.map(file => getImageUrl(file, "fish", pond._id)).join("; ") : "",
//               pond.createdAt ? new Date(pond.createdAt).toLocaleString() : "",
//               pond.updatedAt ? new Date(pond.updatedAt).toLocaleString() : ""
//             ];
            
//             const combinedRow = [...farmerBasicData, ...pondData];
//             allRows.push(combinedRow);
//           });
//         } else {
//           const emptyPondData = new Array(pondHeaders.length).fill("");
//           const combinedRow = [...farmerBasicData, ...emptyPondData];
//           allRows.push(combinedRow);
//         }
//       });
      
//       const csvContent = allRows.map(row => 
//         row.map(cell => {
//           const cellStr = String(cell);
//           if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
//             return `"${cellStr.replace(/"/g, '""')}"`;
//           }
//           return cellStr;
//         }).join(",")
//       ).join("\n");
      
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.setAttribute("href", url);
//       link.setAttribute("download", `Farmers_With_Ponds_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//     } catch (error) {
//       console.error("Error generating Excel:", error);
//       alert("Error generating Excel file. Check console for details.");
//     }
//   };

//   // ✅ NEW FUNCTION: Download single farmer data with all ponds
//   const downloadSingleFarmerData = (farmer) => {
//     try {
//       const allRows = [];
      
//       const farmerHeaders = [
//         "Farmer ID", "Name", "Contact", "Age", "Gender", "Village", 
//         "Aadhar", "Family Members", "Family Occupation", "Photo", 
//         "Pond Count", "Created At", "Updated At", "Agent ID", "Agent Name"
//       ];
      
//       const pondHeaders = [
//         "Pond ID", "Pond Number", "Pond Area", "Area Unit", "Pond Depth",
//         "Latitude", "Longitude",
//         "Overflow", "Receives Sunlight", "Trees on Banks", "Neighbourhood", "Wastewater Enters",
//         "Species", "Date of Stocking", "Initial Seed Qty", "Current Fish Qty", "Average Size",
//         "Feed Type", "Feed Other", "Feed Frequency", "Feed Qty/Day", "Feed Time",
//         "Recent Feed Changes", "Reduced Appetite", "Water Temperature", "pH", "DO",
//         "Ammonia Level", "Phytoplankton Level", "Water Hardness", "Algae Bloom", "Pond Water Color",
//         "Source of Water", "Disease Symptoms", "Symptoms Observed", "Fish Deaths", "Symptoms Affect",
//         "Farm Observed Date", "Farm Observed Time", "Last Species", "Last Harvest Complete",
//         "Recent Rain/Flood", "Pesticide Runoff", "Construction Near", "Sudden Temp Change",
//         "Notes", "Pond Image Link", "Pond Files", "Fish Files", "Created At", "Updated At"
//       ];
      
//       const allHeaders = [...farmerHeaders, ...pondHeaders.map(h => `Pond_${h}`)];
//       allRows.push(allHeaders);
      
//       const farmerBasicData = [
//         farmer.farmerId || "",
//         farmer.name || "",
//         farmer.contact || "",
//         farmer.age || "",
//         farmer.gender || "",
//         farmer.village || "",
//         farmer.adhar || "",
//         farmer.familyMembers || "",
//         farmer.familyOccupation || "",
//         getFarmerImageUrl(farmer),
//         farmer.pondCount || 0,
//         farmer.createdAt ? new Date(farmer.createdAt).toLocaleString() : "",
//         farmer.updatedAt ? new Date(farmer.updatedAt).toLocaleString() : "",
//         selectedAgent?._id || "",
//         selectedAgent?.name || ""
//       ];
      
//       if (farmer.ponds && farmer.ponds.length > 0) {
//         farmer.ponds.forEach(pond => {
//           const pondImageLink = getPondImageUrl(pond, pond._id);
          
//           const pondData = [
//             pond.pondId || "",
//             pond.pondNumber || "",
//             pond.pondArea || "",
//             pond.pondAreaUnit || "",
//             pond.pondDepth || "",
//             pond.latitude || "",
//             pond.longitude || "",
//             pond.overflow || "",
//             pond.receivesSunlight || "",
//             pond.treesOnBanks || "",
//             pond.neighbourhood || "",
//             pond.wastewaterEnters || "",
//             pond.species || "",
//             pond.dateOfStocking || "",
//             pond.qtySeedInitially || "",
//             pond.currentQty || "",
//             pond.avgSize || "",
//             pond.feedType || "",
//             pond.feedOther || "",
//             pond.feedFreq || "",
//             pond.feedQtyPerDay || "",
//             pond.feedTime || "",
//             pond.recentFeedChanges || "",
//             pond.reducedAppetite || "",
//             pond.waterTemperature || "",
//             pond.pH || "",
//             pond.DO || "",
//             pond.ammoniaLevel || "",
//             pond.phytoplanktonLevel || "",
//             pond.waterHardness || "",
//             pond.algaeBloom || "",
//             pond.pondWaterColor || "",
//             pond.sourceOfWater || "",
//             pond.diseaseSymptoms || "",
//             pond.symptomsObserved || "",
//             pond.fishDeaths || "",
//             pond.symptomsAffect || "",
//             pond.farmObservedDate || "",
//             pond.farmObservedTime || "",
//             pond.lastSpecies || "",
//             pond.lastHarvestComplete || "",
//             pond.recentRainFlood || "",
//             pond.pesticideRunoff || "",
//             pond.constructionNear || "",
//             pond.suddenTempChange || "",
//             pond.notes || "",
//             pondImageLink,
//             Array.isArray(pond.pondFiles) ? 
//               pond.pondFiles.map(file => getImageUrl(file, "pond", pond._id)).join("; ") : "",
//             Array.isArray(pond.fishFiles) ? 
//               pond.fishFiles.map(file => getImageUrl(file, "fish", pond._id)).join("; ") : "",
//             pond.createdAt ? new Date(pond.createdAt).toLocaleString() : "",
//             pond.updatedAt ? new Date(pond.updatedAt).toLocaleString() : ""
//           ];
          
//           const combinedRow = [...farmerBasicData, ...pondData];
//           allRows.push(combinedRow);
//         });
//       } else {
//         const emptyPondData = new Array(pondHeaders.length).fill("");
//         const combinedRow = [...farmerBasicData, ...emptyPondData];
//         allRows.push(combinedRow);
//       }
      
//       const csvContent = allRows.map(row => 
//         row.map(cell => {
//           const cellStr = String(cell);
//           if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
//             return `"${cellStr.replace(/"/g, '""')}"`;
//           }
//           return cellStr;
//         }).join(",")
//       ).join("\n");
      
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.setAttribute("href", url);
//       link.setAttribute("download", `${farmer.farmerId}_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//     } catch (error) {
//       console.error("Error downloading single farmer data:", error);
//       alert("Error downloading farmer data. Check console for details.");
//     }
//   };

//   // ✅ Download simple Excel (legacy function - for dealers)
//   const downloadExcel = (items, fileName) => {
//     if (!items.length) return;
//     const header = Object.keys(items[0]);
//     const csvRows = [
//       header.join(","),
//       ...items.map((row) =>
//         header.map((key) => JSON.stringify(row[key] || "")).join(",")
//       ),
//     ];
//     const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = `${fileName}.csv`;
//     a.click();
//   };

//   // Open History modal function
//   const openHistoryModal = (itemId, type, name) => {
//     setHistoryTitle(name);
//     console.log(`🔍 Opening history for: ${type} - ${itemId} - ${name}`);
    
//     api
//       .get(`/api/history/${type}/${itemId}`)
//       .then((res) => {
//         console.log("📊 History API Response:", res.data);
        
//         const transformedData = (res.data || []).map(item => {
//           return {
//             ...item,
//             timestamp: item.createdAt || new Date(),
//             actionType: item.actionType || "updated"
//           };
//         });
        
//         console.log("📊 Transformed Data:", transformedData);
//         setHistoryData(transformedData);
//         setHistoryModalOpen(true);
//       })
//       .catch((err) => {
//         console.error("❌ History API Error:", err);
//         setHistoryData([]);
//         setHistoryModalOpen(true);
//       });
//   };

//   // Close History modal
//   const closeHistoryModal = () => {
//     setHistoryModalOpen(false);
//     setHistoryData([]);
//     setHistoryTitle("");
//   };

//   // Farmer basic fields (for card view)
//   const farmerBasicFields = [
//     { label: "Farmer ID", key: "farmerId" },
//     { label: "Name", key: "name" },
//     { label: "Contact", key: "contact" },
//     { label: "Age", key: "age" },
//     { label: "Gender", key: "gender" },
//     { label: "Village", key: "village" },
//     { label: "Aadhar", key: "adhar" },
//     { label: "Family Members", key: "familyMembers" },
//     { label: "Occupation", key: "familyOccupation" },
//   ];

//   // Pond fields for details modal
//   const pondDetailFields = [
//     { label: "Pond ID", key: "pondId" },
//     { label: "Pond Number", key: "pondNumber" },
//     { label: "Pond Area", key: "pondArea" },
//     { label: "Area Unit", key: "pondAreaUnit" },
//     { label: "Pond Depth", key: "pondDepth" },
//     { label: "Latitude", key: "latitude" },
//     { label: "Longitude", key: "longitude" },
//     { label: "Overflow", key: "overflow" },
//     { label: "Sunlight", key: "receivesSunlight" },
//     { label: "Trees on Banks", key: "treesOnBanks" },
//     { label: "Neighbourhood", key: "neighbourhood" },
//     { label: "Wastewater Enters", key: "wastewaterEnters" },
//     { label: "Species", key: "species" },
//     { label: "Date of Stocking", key: "dateOfStocking" },
//     { label: "Initial Seed Qty", key: "qtySeedInitially" },
//     { label: "Current Fish Qty", key: "currentQty" },
//     { label: "Average Size", key: "avgSize" },
//     { label: "Feed Type", key: "feedType" },
//     { label: "Feed Other", key: "feedOther" },
//     { label: "Feed Frequency", key: "feedFreq" },
//     { label: "Feed Qty/Day", key: "feedQtyPerDay" },
//     { label: "Feed Time", key: "feedTime" },
//     { label: "Recent Changes", key: "recentFeedChanges" },
//     { label: "Reduced Appetite", key: "reducedAppetite" },
//     { label: "Water Temperature", key: "waterTemperature" },
//     { label: "pH", key: "pH" },
//     { label: "DO", key: "DO" },
//     { label: "Ammonia Level", key: "ammoniaLevel" },
//     { label: "Phytoplankton", key: "phytoplanktonLevel" },
//     { label: "Water Hardness", key: "waterHardness" },
//     { label: "Algae Bloom", key: "algaeBloom" },
//     { label: "Water Color", key: "pondWaterColor" },
//     { label: "Water Source", key: "sourceOfWater" },
//     { label: "Disease Symptoms", key: "diseaseSymptoms" },
//     { label: "Symptoms Observed", key: "symptomsObserved" },
//     { label: "Fish Deaths", key: "fishDeaths" },
//     { label: "Symptoms Affect", key: "symptomsAffect" },
//     { label: "Farm Observed Date", key: "farmObservedDate" },
//     { label: "Farm Observed Time", key: "farmObservedTime" },
//     { label: "Last Species", key: "lastSpecies" },
//     { label: "Last Harvest Complete", key: "lastHarvestComplete" },
//     { label: "Recent Rain/Flood", key: "recentRainFlood" },
//     { label: "Pesticide Runoff", key: "pesticideRunoff" },
//     { label: "Construction Near", key: "constructionNear" },
//     { label: "Sudden Temp Change", key: "suddenTempChange" },
//     { label: "Notes", key: "notes" },
//     { label: "Pond Image", key: "pondImage", isClickableLink: true },
//     { label: "Pond Files", key: "pondFiles", isFileArray: true },
//     { label: "Fish Files", key: "fishFiles", isFileArray: true },
//     { label: "Created At", key: "createdAt" },
//     { label: "Updated At", key: "updatedAt" },
//   ];

//   // Dealer fields - FIXED: Added image field check
//   const dealerFields = [
//     { label: "Image", key: "image", isImage: true },
//     { label: "Name", key: "name" },
//     { label: "Mobile", key: "contact" },
//     { label: "Shop Address", key: "shopAddress" },
//     { label: "GST Number", key: "gstNumber" },
//   ];

//   // Render Farmer Card with Ponds
//   const renderFarmerCardWithPonds = (data) => (
//     <div className="vertical-cards">
//       {data.map((farmer) => (
//         <div className="farmer-card" key={farmer._id}>
//           <div className="farmer-card-header">
//             <div className="farmer-profile-header">
//               <img 
//                 src={`https://essential-r440.onrender.com/api/images/farmer/photo/${farmer._id}`}
//                 alt="Farmer"
//                 className="farmer-avatar"
//                 onClick={() => openModal(`https://essential-r440.onrender.com/api/images/farmer/photo/${farmer._id}`)}
//                 onError={(e) => {
//                   console.error(`❌ Image failed to load for farmer ${farmer._id}:`, e.target.src);
                  
//                   // Try alternative URL
//                   const altUrl = `http://localhost:2008/api/images/farmer/photo/${farmer._id}`;
//                   console.log(`Trying alternative URL: ${altUrl}`);
//                   e.target.src = altUrl;
                  
//                   // If that also fails, use fallback
//                   e.target.onerror = () => {
//                     e.target.src = "/profile.png";
//                     e.target.onerror = null;
//                   };
//                 }}
//                 onLoad={(e) => {
//                   console.log(`✅ Image loaded successfully for farmer ${farmer._id}:`, e.target.src);
//                 }}
//               />

//               <div>
//                 <h4>{farmer.name} ({farmer.farmerId})</h4>
//                 <p>{farmer.contact} • {farmer.village}</p>
//               </div>
//             </div>

//             <div className="farmer-actions">
//               <button
//                 onClick={() => downloadSingleFarmerData(farmer)}
//                 className="download-farmer-btn"
//                 style={{
//                   marginRight: "10px",
//                   padding: "8px 16px",
//                   background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px"
//                 }}
//                 title={`Download ${farmer.farmerId} data`}
//               >
//                 ⬇️ Download
//               </button>
              
//               <button
//                 onClick={() => openFarmerDetails(farmer)}
//                 className="card-view-details-btn"
//               >
//                 {showPondDetails && selectedFarmer?._id === farmer._id ? "Hide Ponds" : "View Ponds"}
//               </button>
//             </div>
//           </div>
          
//           {/* Farmer Basic Info */}
//           <div className="farmer-basic-info">
//             {farmerBasicFields.map(({ label, key }) => (
//               <div className="info-row" key={key}>
//                 <strong>{label}:</strong>
//                 <span>{farmer[key] || "N/A"}</span>
//               </div>
//             ))}
//           </div>
          
//           {/* Ponds List (if expanded) */}
//           {showPondDetails && selectedFarmer?._id === farmer._id && (
//             <div className="ponds-section">
//               <h5>Ponds ({farmer.ponds?.length || 0})</h5>
              
//               {farmer.ponds && farmer.ponds.length > 0 ? (
//                 <div className="ponds-list">
//                   {farmer.ponds.map((pond, index) => (
//                     <div className="pond-card" key={pond.pondId || index}>
//                       <div className="pond-card-header">
//                         <div className="pond-header-info">
//                           <h6>Pond {pond.pondNumber || index + 1}: {pond.pondId}</h6>
//                           {pond.pondImage && (
//                             <img 
//                               src={getPondImageUrl(pond, pond._id)}
//                               alt="Pond"
//                               className="pond-thumbnail"
//                               onClick={() => openModal(getPondImageUrl(pond, pond._id))}
//                               onError={(e) => {
//                                 console.error(`❌ Pond image failed to load for ${pond.pondId || pond._id}:`, {
//                                   currentSrc: e.target.src,
//                                   pondId: pond.pondId,
//                                   pond_Id: pond._id
//                                 });
                                
//                                 // Try multiple alternative URLs
//                                 const alternatives = [
//                                   `https://essential-r440.onrender.com/api/images/pond/image/${pond.pondId}`,
//                                   `https://essential-r440.onrender.com/api/images/pond/image/${pond._id}`,
//                                   `http://localhost:2008/api/images/pond/image/${pond.pondId}`,
//                                   `http://localhost:2008/api/images/pond/image/${pond._id}`
//                                 ];
                                
//                                 let currentIndex = alternatives.indexOf(e.target.src);
//                                 let nextIndex = currentIndex + 1;
                                
//                                 if (nextIndex < alternatives.length) {
//                                   console.log(`🔄 Trying alternative pond URL: ${alternatives[nextIndex]}`);
//                                   e.target.src = alternatives[nextIndex];
//                                 } else {
//                                   console.log(`❌ All alternatives failed, using fallback`);
//                                   e.target.src = "/no-image.png";
//                                   e.target.onerror = null;
//                                 }
//                               }}
//                               onLoad={(e) => {
//                                 console.log(`✅ Pond image loaded successfully: ${pond.pondId || pond._id}`);
//                               }}
//                             />
//                           )}
//                         </div>
//                         <div className="pond-actions">
//                           <button
//                             onClick={() => openPondDetails(pond)}
//                             className="pond-view-btn"
//                           >
//                             View Details
//                           </button>
//                           <button
//                             onClick={() => openHistoryModal(pond.pondId, "pond", pond.pondId)}
//                             className="pond-history-btn"
//                           >
//                             Pond History
//                           </button>
//                         </div>
//                       </div>
                      
//                       <div className="pond-basic-info">
//                         <div><strong>Species:</strong> {pond.species || "Not specified"}</div>
//                         <div><strong>Area:</strong> {pond.pondArea || "N/A"} {pond.pondAreaUnit}</div>
//                         <div><strong>Location:</strong> {pond.latitude ? `${pond.latitude}, ${pond.longitude}` : "N/A"}</div>
//                         <div><strong>Last Updated:</strong> {
//                           pond.updatedAt ? new Date(pond.updatedAt).toLocaleDateString('en-IN') : "N/A"
//                         }</div>
//                       </div>
                      
//                       {/* ✅ UPDATED: Pond Files Preview with fixed onError handling */}
//                       {(pond.pondFiles && pond.pondFiles.length > 0) && (
//                         <div className="pond-files-preview">
//                           <strong>Pond Files:</strong>
//                           <div className="files-preview">
//                             {getPondFilesUrls(pond.pondFiles, pond._id, pond).slice(0, 3).map((url, idx) => (
//                               <img 
//                                 key={idx}
//                                 src={url}
//                                 alt={`Pond File ${idx + 1}`}
//                                 className="file-preview"
//                                 onClick={() => openModal(url)}
//                                 onError={(e) => {
//                                   console.error(`❌ Pond file ${idx} failed to load:`, url);
                                  
//                                   // Try alternative URL patterns
//                                   const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";
//                                   const alternativeUrls = [
//                                     `${API_URL}/api/pond/${pond.pondId}/files/${idx}`,
//                                     `${API_URL}/api/pond/files/${pond.pondId}/${idx}`,
//                                     `${API_URL}/api/pond/${pond._id}/files/${idx}`,
//                                     `${API_URL}/api/pond/files/${pond._id}/${idx}`
//                                   ];
                                  
//                                   // Try next alternative
//                                   let currentIndex = alternativeUrls.indexOf(e.target.src);
//                                   let nextIndex = currentIndex + 1;
                                  
//                                   if (nextIndex < alternativeUrls.length) {
//                                     console.log(`🔄 Trying alternative pond file URL:`, alternativeUrls[nextIndex]);
//                                     e.target.src = alternativeUrls[nextIndex];
//                                   } else {
//                                     console.log(`❌ All alternatives failed, using fallback`);
//                                     e.target.src = "/no-image.png";
//                                     e.target.onerror = null;
//                                   }
//                                 }}
//                                 onLoad={(e) => {
//                                   console.log(`✅ Pond file ${idx} loaded successfully:`, url);
//                                 }}
//                               />
//                             ))}
//                             {pond.pondFiles.length > 3 && (
//                               <div className="more-files">+{pond.pondFiles.length - 3} more</div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="no-ponds">No ponds found for this farmer.</div>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   // ✅ FIXED: Render Dealer Card with proper image handling
//   const renderDealerCard = (data) => (
//     <div className="vertical-cards">
//       {data.map((item) => (
//         <div className="dealer-card" key={item._id}>
//           <div className="dealer-card-header">
//             <div className="dealer-profile">
       
// {/* // ✅ WORKING: Direct buffer conversion in img tag */}
// <img
//   src={`https://essential-r440.onrender.com/api/images/dealer/image/${item._id}`}
//   alt={`Dealer ${item.name}`}
//   className="dealer-avatar"
//   onError={(e) => {
//     console.error(`❌ API image failed for ${item.name}`);
    
//     // Try buffer conversion
//     if (item.image?.data) {
//       try {
//         const buffer = item.image.data;
        
//         // SIMPLE CONVERSION - Try all methods
//         if (buffer.buffer instanceof ArrayBuffer) {
//           const uint8Array = new Uint8Array(buffer.buffer);
//           let binary = '';
//           for (let i = 0; i < uint8Array.length; i++) {
//             binary += String.fromCharCode(uint8Array[i]);
//           }
//           const base64 = btoa(binary);
//           e.target.src = `data:${item.image.contentType || 'image/png'};base64,${base64}`;
//           return;
//         }
        
//         // If buffer is already an array
//         if (Array.isArray(buffer)) {
//           let binary = '';
//           for (let i = 0; i < buffer.length; i++) {
//             binary += String.fromCharCode(buffer[i]);
//           }
//           const base64 = btoa(binary);
//           e.target.src = `data:${item.image.contentType || 'image/png'};base64,${base64}`;
//           return;
//         }
//       } catch (err) {
//         console.error("Buffer conversion failed:", err);
//       }
//     }
    
//     // Final fallback
//     e.target.src = "/no-image.png";
//   }}
//   onLoad={(e) => {
//     console.log(`✅ Image loaded successfully for ${item.name}`);
//   }}
// />
//               <div>
//                 <h4>{item.name || "N/A"}</h4>
//                 <p>{item.contact || "N/A"}</p>
//               </div>
//             </div>

//             <button
//               onClick={() => downloadSingleExcel(item, `dealer_${item.name}`)}
//               className="download-dealer-btn"
//             >
//               ⬇️ Download
//             </button>
//           </div>
          
//           <div className="dealer-details">
//             {dealerFields
//               .filter(field => !field.isImage)
//               .map(({ label, key }) => (
//                 <div className="detail-row" key={key}>
//                   <strong>{label}:</strong>
//                   <span>{item[key] || "N/A"}</span>
//                 </div>
//               ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   if (loading && agents.length === 0) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="admin-dashboard">
//       {/* <h2>All Agents</h2> */}
//       <div className="essential-aquatech-header">
//   <div className="company-logo-container">
//     <img 
//       src="/CompanyLogo.png" 
//       alt="Essential Aquatech Logo" 
//       className="company-logo"
//       onError={(e) => {
//         console.error("Logo failed to load, using fallback");
//         e.target.src = "/logo.png"; // Fallback if logo doesn't exist
//         e.target.onerror = null;
//       }}
//     />
//   </div>
//   <div className="company-title-container">
//     <h2 className="company-title">
//       Essential Aquatech
//       <span className="trademark-symbol">™</span>
//     </h2>
//   </div>
// </div>

//       {/* <button
//         onClick={() => navigate("/weather-dashboard")}
//         className="weather-dashboard-btn"
//       >
//         🌦️ Weather Dashboard
//       </button> */}

//       <button 
//         onClick={() => navigate("/orders-dashboard")}
//         style={{
//           marginBottom: '25px',
//           marginLeft: "15px",
//           padding: '14px 28px',
//           background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//           color: 'white',
//           border: 'none',
//           borderRadius: '12px',
//           cursor: 'pointer',
//           fontSize: '16px',
//           fontWeight: '600',
//           transition: 'all 0.3s ease',
//           display: 'inline-flex',
//           alignItems: 'center',
//           gap: '10px',
//           boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
//           position: 'relative',
//           overflow: 'hidden',
//           outline: 'none',
//           fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
//         }}
//         onMouseEnter={(e) => {
//           e.target.style.transform = 'translateY(-3px)';
//           e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.35)';
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.transform = 'translateY(0)';
//           e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.25)';
//         }}
//         onMouseDown={(e) => {
//           e.target.style.transform = 'translateY(1px)';
//         }}
//         onMouseUp={(e) => {
//           e.target.style.transform = 'translateY(-3px)';
//         }}
//       >
//         📦  Orders Dashboard
//       </button>

//       {/* <button
//         onClick={() => navigate("/astronomical-dashboard")}
//         style={{
//           marginLeft: "15px",
//           marginBottom: '25px',
//           padding: '14px 28px',
        
//           background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
//           color: 'white',
//           border: 'none',
//           borderRadius: '12px',
//           cursor: 'pointer',
//           fontSize: '16px',
//           fontWeight: '600',
//           display: 'inline-flex',
//           alignItems: 'center',
//           gap: '10px',
//           boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
//         }}
//       >
//         🌌 Astronomical Dashboard
//       </button> */}

//       <button
//   onClick={() => navigate("/astronomical-dashboard")}
//   onMouseEnter={(e) => {
//     e.currentTarget.style.transform = "translateY(-2px)";
//     e.currentTarget.style.boxShadow =
//       "0 6px 20px rgba(30, 144, 255, 0.4)";
//     e.currentTarget.style.background =
//       "linear-gradient(135deg, #0066CC 0%, #004C99 100%)";
//   }}
//   onMouseLeave={(e) => {
//     e.currentTarget.style.transform = "translateY(0)";
//     e.currentTarget.style.boxShadow =
//       "0 4px 15px rgba(99, 102, 241, 0.35)";
//     e.currentTarget.style.background =
//       "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)";
//   }}
//   style={{
//     marginLeft: "15px",
//     marginBottom: "25px",
//     padding: "14px 10px",
//     background: "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)",
//     color: "white",
//     border: "none",
//     borderRadius: "12px",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: "600",
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "10px",
//     boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
//     transition: "all 0.3s ease" // 🔥 smooth hover
//   }}
// >
//   🌌 Astronomical Dashboard
// </button>



//  <button
//         onClick={() => navigate("/satellite-dashboard")}
//         // style={{
//         //   marginLeft: "15px",
//         //   marginBottom: '25px',
//         //   padding: '14px 28px',
//         //   background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
//         //   color: 'white',
//         //   border: 'none',
//         //   borderRadius: '12px',
//         //   cursor: 'pointer',
//         //   fontSize: '16px',
//         //   fontWeight: '600',
//         //   display: 'inline-flex',
//         //   alignItems: 'center',
//         //   gap: '10px',
//         //   boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
//         // }}
//         style={{
//           marginBottom: '25px',
//           marginLeft: "15px",
//           padding: '14px 24px',
//           background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//           color: 'white',
//           border: 'none',
//           borderRadius: '12px',
//           cursor: 'pointer',
//           fontSize: '16px',
//           fontWeight: '600',
//           transition: 'all 0.3s ease',
//           display: 'inline-flex',
//           alignItems: 'center',
//           gap: '10px',
//           boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
//           position: 'relative',
//           overflow: 'hidden',
//           outline: 'none',
//           fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
//         }}
//         onMouseEnter={(e) => {
//           e.target.style.transform = 'translateY(-3px)';
//           e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.35)';
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.transform = 'translateY(0)';
//           e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.25)';
//         }}
//         onMouseDown={(e) => {
//           e.target.style.transform = 'translateY(1px)';
//         }}
//         onMouseUp={(e) => {
//           e.target.style.transform = 'translateY(-3px)';
//         }}
//       >
//         🛰️ Satellite Dashboard
//       </button>

//  {/* <button
//         onClick={() => navigate("/weather-dashboard")}
//         className="weather-dashboard-btn"
//       >
//         🌦️ Weather Dashboard
//       </button> */}




//          <button
//   onClick={() => navigate("/weather-dashboard")}
//   onMouseEnter={(e) => {
//     e.currentTarget.style.transform = "translateY(-2px)";
//     e.currentTarget.style.boxShadow =
//       "0 6px 20px rgba(30, 144, 255, 0.4)";
//     e.currentTarget.style.background =
//       "linear-gradient(135deg, #0066CC 0%, #004C99 100%)";
//   }}
//   onMouseLeave={(e) => {
//     e.currentTarget.style.transform = "translateY(0)";
//     e.currentTarget.style.boxShadow =
//       "0 4px 15px rgba(99, 102, 241, 0.35)";
//     e.currentTarget.style.background =
//       "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)";
//   }}
//   style={{
//     marginLeft: "15px",
//     marginBottom: "25px",
//     padding: "14px 28px",
//     background: "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)",
//     color: "white",
//     border: "none",
//     borderRadius: "12px",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: "600",
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "10px",
//     boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
//     transition: "all 0.3s ease" // 🔥 smooth hover
//   }}
// >
//   🌦️ Weather Dashboard
// </button>



//       {/* Access Requests */}
//       <div className="notification-box">
//         <h3>Access Requests</h3>
//         {accessRequests.length === 0 ? (
//           <p>No pending access requests</p>
//         ) : (
//           accessRequests.map((r) => (
//             <div key={r._id} className="notification-item">
//               <div>
//                 <strong>{r.requesterId?.name || "Unknown"}</strong> wants to view{" "}
//                 <strong>{r.targetAgentId?.name || "Unknown"}</strong>
//               </div>
//               <div>
//                 <button onClick={() => handleAllow(r._id)}>Allow</button>
//                 <button onClick={() => handleReject(r._id)}>Reject</button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* ✅ UPDATED: Agents Table with corrected image URLs */}
//       <table className="agents-table">
//         <thead>
//           <tr>
//             <th>Profile</th>
//             <th>Name</th>
//             <th>Mobile</th>
//             <th>Email</th>
//             <th>Age</th>
//             <th>Address</th>
//             <th>Aadhar Front</th>
//             <th>Aadhar Back</th>
//             <th>PAN</th>
//             <th>Account No</th>
//             <th>IFSC</th>
//             <th>Saving Img</th>
//             <th>More</th>
//           </tr>
//         </thead>
//         <tbody>
//           {agents.map((a) => (
//             <tr key={a._id}>
//               <td>
//                 {a.profilePic && (
//                   <img
//                     src={getProfileImage(a._id)}
//                     alt="Profile"
//                     className="table-image"
//                     onClick={() => openModal(getAgentImageUrl(a, "profile"))}
//                     onError={(e) => {
//                       e.target.src = "/profile.png";
//                       e.target.onerror = null;
//                     }}
//                   />
//                 )}
//               </td>
//               <td>{a.name}</td>
//               <td>{a.mobile}</td>
//               <td>{a.email}</td>
//               <td>{a.age}</td>
//               <td>{a.address}</td>
//               <td>
//                 {a.aadharFront && (
//                   <img
//                     src={getAgentImageUrl(a, "aadharFront")}
//                     alt="Aadhar Front"
//                     className="table-image"
//                     onClick={() => openModal(getAgentImageUrl(a, "aadharFront"))}
//                     onError={(e) => {
//                       e.target.src = "/no-image.png";
//                       e.target.onerror = null;
//                     }}
//                   />
//                 )}
//               </td>
//               <td>
//                 {a.aadharBack && (
//                   <img
//                     src={getAgentImageUrl(a, "aadharBack")}
//                     alt="Aadhar Back"
//                     className="table-image"
//                     onClick={() => openModal(getAgentImageUrl(a, "aadharBack"))}
//                     onError={(e) => {
//                       e.target.src = "/no-image.png";
//                       e.target.onerror = null;
//                     }}
//                   />
//                 )}
//               </td>
//               <td>
//                 {a.panCard && (
//                   <img
//                     src={getAgentImageUrl(a, "pan")}
//                     alt="PAN"
//                     className="table-image"
//                     onClick={() => openModal(getAgentImageUrl(a, "pan"))}
//                     onError={(e) => {
//                       e.target.src = "/no-image.png";
//                       e.target.onerror = null;
//                     }}
//                   />
//                 )}
//               </td>
//               <td>{a.accountNumber}</td>
//               <td>{a.ifsc}</td>
//               <td>
//                 {a.savingAccountImage && (
//                   <img
//                     src={getAgentImageUrl(a, "savingImg")}
//                     alt="Passbook"
//                     className="table-image"
//                     onClick={() => openModal(getAgentImageUrl(a, "savingImg"))}
//                     onError={(e) => {
//                       e.target.src = "/no-image.png";
//                       e.target.onerror = null;
//                     }}
//                   />
//                 )}
//               </td>
//               <td className="agent-actions">
//                 <button onClick={() => loadAgentData(a._id, "farmer")}>
//                   Added Farmers
//                 </button>
//                 <button onClick={() => loadAgentData(a._id, "dealer")}>
//                   Added Dealers
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ADDED: Mobile Agents List - Mobile View */}
//       <div className="mobile-agents-list">
//         {agents.map((a) => (
//           <div className="agent-card" key={a._id}>
//             <div className="agent-card-header">
//               {a.profilePic && (
//                 <img
//                   src={getAgentImageUrl(a, "profile")}
//                   alt="Profile"
//                   className="agent-avatar"
//                   onClick={() => openModal(getAgentImageUrl(a, "profile"))}
//                   onError={(e) => {
//                     e.target.src = "/profile.png";
//                     e.target.onerror = null;
//                   }}
//                 />
//               )}
//               <div className="agent-info">
//                 <h4>{a.name}</h4>
//                 <p>{a.email}</p>
//                 <p>{a.mobile}</p>
//               </div>
//             </div>
            
//             <div className="agent-details-grid">
//               <div className="detail-item">
//                 <strong>Age:</strong>
//                 <span>{a.age}</span>
//               </div>
//               <div className="detail-item">
//                 <strong>Address:</strong>
//                 <span>{a.address}</span>
//               </div>
//               <div className="detail-item">
//                 <strong>Account No:</strong>
//                 <span>{a.accountNumber}</span>
//               </div>
//               <div className="detail-item">
//                 <strong>IFSC:</strong>
//                 <span>{a.ifsc}</span>
//               </div>
//             </div>
            
//             <div className="document-images">
//               {a.aadharFront && (
//                 <img
//                   src={getAgentImageUrl(a, "aadharFront")}
//                   alt="Aadhar Front"
//                   className="doc-image"
//                   onClick={() => openModal(getAgentImageUrl(a, "aadharFront"))}
//                   onError={(e) => {
//                     e.target.src = "/no-image.png";
//                     e.target.onerror = null;
//                   }}
//                 />
//               )}
//               {a.aadharBack && (
//                 <img
//                   src={getAgentImageUrl(a, "aadharBack")}
//                   alt="Aadhar Back"
//                   className="doc-image"
//                   onClick={() => openModal(getAgentImageUrl(a, "aadharBack"))}
//                   onError={(e) => {
//                     e.target.src = "/no-image.png";
//                     e.target.onerror = null;
//                   }}
//                 />
//               )}
//               {a.panCard && (
//                 <img
//                   src={getAgentImageUrl(a, "pan")}
//                   alt="PAN"
//                   className="doc-image"
//                   onClick={() => openModal(getAgentImageUrl(a, "pan"))}
//                   onError={(e) => {
//                     e.target.src = "/no-image.png";
//                     e.target.onerror = null;
//                   }}
//                 />
//               )}
//               {a.savingAccountImage && (
//                 <img
//                   src={getAgentImageUrl(a, "savingImg")}
//                   alt="Passbook"
//                   className="doc-image"
//                   onClick={() => openModal(getAgentImageUrl(a, "savingImg"))}
//                   onError={(e) => {
//                     e.target.src = "/no-image.png";
//                     e.target.onerror = null;
//                   }}
//                 />
//               )}
//             </div>
            
//             <div className="agent-card-actions">
//               <button onClick={() => loadAgentData(a._id, "farmer")}>
//                 Added Farmers
//               </button>
//               <button onClick={() => loadAgentData(a._id, "dealer")}>
//                 Added Dealers
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Farmers Section */}
//       {viewType === "farmer" && (
//         <>
//           <h3>Farmers of {selectedAgent?.name}</h3>
//           <div className="action-buttons">
//             <button
//               onClick={() => downloadFarmerExcelWithAllPonds(filteredFarmers)}
//               className="download-excel-btn"
//               style={{ 
//                 background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
//                 padding: "12px 24px",
//                 fontSize: "16px",
//                 fontWeight: "600"
//               }}
//             >
//               📥 Download Farmers Excel (with ALL Ponds)
//             </button>
//             <input
//               placeholder="Search by Farmer ID"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//           </div>
//           {loading ? (
//             <div className="loading">Loading farmers data...</div>
//           ) : filteredFarmers.length > 0 ? (
//             renderFarmerCardWithPonds(filteredFarmers)
//           ) : (
//             <div className="empty-state">No farmers found.</div>
//           )}
//         </>
//       )}

//       {/* Dealers Section */}
//       {viewType === "dealer" && (
//         <>
//           <h3>Dealers of {selectedAgent?.name}</h3>
//           <div className="action-buttons">
//             <button
//               onClick={() => downloadExcel(filteredDealers, "dealers_list")}
//               className="download-excel-btn"
//               style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}
//             >
//               📥 Download Dealers Excel
//             </button>
//             <input
//               placeholder="Search by Dealer Name"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//           </div>
//           {loading ? (
//             <div className="loading">Loading dealers data...</div>
//           ) : filteredDealers.length > 0 ? (
//             renderDealerCard(filteredDealers)
//           ) : (
//             <div className="empty-state">No dealers found.</div>
//           )}
//         </>
//       )}

//       {/* Image Modal */}
//       {modalOpen && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-modal-btn" onClick={closeModal}>×</button>
//             <img src={modalImage} alt="preview" className="modal-image" />
//           </div>
//         </div>
//       )}

//       {/* Pond Details Modal */}
//       {pondDetailsModalOpen && selectedPond && (
//         <div className="modal-overlay" onClick={closePondDetailsModal}>
//           <div className="pond-details-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>
//                 Pond Details: {selectedPond.pondId}
//                 <button className="close-btn" onClick={closePondDetailsModal}>×</button>
//               </h3>
//             </div>
            
//             <div className="modal-content">
//               <div className="pond-details-grid">
//                 {pondDetailFields.map(({ label, key, isClickableLink, isFileArray }) => {
//                   const value = selectedPond[key];
                  
//                   if (isClickableLink && key === "pondImage" && value) {
//                     const imageUrl = getPondImageUrl(selectedPond, selectedPond._id);
//                     return (
//                       <div className="detail-row" key={key}>
//                         <strong>{label}:</strong>
//                         <div className="clickable-link-container">
//                           <a 
//                             href={imageUrl} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="clickable-link"
//                           >
//                             🔗 View Pond Image
//                           </a>
//                           <br />
//                           <img 
//                             src={imageUrl}
//                             alt="Pond"
//                             onClick={() => openModal(imageUrl)}
//                             className="clickable-image"
//                             onError={(e) => {
//                               e.target.src = "/no-image.png";
//                               e.target.onerror = null;
//                             }}
//                           />
//                         </div>
//                       </div>
//                     );
//                   }
                  
//                   if (isFileArray && value && value.length > 0) {
//                     const urls = key === "pondFiles" 
//                       ? selectedPond.pondFilesUrls 
//                       : selectedPond.fishFilesUrls;
                    
//                     return (
//                       <div className="detail-row" key={key}>
//                         <strong>{label}:</strong>
//                         <div className="file-list">
//                           {urls && urls.length > 0 ? (
//                             urls.map((fileUrl, idx) => (
//                               <div key={idx} className="file-item">
//                                 <a 
//                                   href={fileUrl} 
//                                   target="_blank" 
//                                   rel="noopener noreferrer"
//                                   className="file-link"
//                                 >
//                                   📎 {key === "pondFiles" ? `Pond File ${idx + 1}` : `Fish File ${idx + 1}`}
//                                 </a>
//                                 <img
//                                   src={fileUrl}
//                                   alt={`${key} ${idx + 1}`}
//                                   onClick={() => openModal(fileUrl)}
//                                   className="clickable-thumbnail"
//                                   onError={(e) => {
//                                     e.target.src = "/no-image.png";
//                                     e.target.onerror = null;
//                                   }}
//                                 />
//                               </div>
//                             ))
//                           ) : (
//                             <span>No files available</span>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   }
                  
//                   return (
//                     <div className="detail-row" key={key}>
//                       <strong>{label}:</strong>
//                       <span>{value || "N/A"}</span>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* ✅ ADDED: Pond Files Section with FIXED image loading */}
//               {selectedPond.pondFilesUrls && selectedPond.pondFilesUrls.length > 0 && (
//                 <div className="file-preview-section">
//                   <strong>Pond Files ({selectedPond.pondFilesUrls.length}):</strong>
//                   <div className="file-grid">
//                     {selectedPond.pondFilesUrls.map((url, idx) => (
//                       <div key={idx} className="file-item">
//                         <img 
//                           src={url}
//                           alt={`Pond File ${idx + 1}`}
//                           className="preview-img"
//                           onClick={() => openModal(url)}
//                           onError={(e) => {
//                             console.error(`❌ Pond file ${idx} failed to load:`, url);
                            
//                             // Try alternative URL patterns
//                             const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";
//                             const alternativeUrls = [
//                               `${API_URL}/api/pond/${selectedPond.pondId}/files/${idx}`,
//                               `${API_URL}/api/pond/files/${selectedPond.pondId}/${idx}`,
//                               `${API_URL}/api/pond/${selectedPond._id}/files/${idx}`,
//                               `${API_URL}/api/pond/files/${selectedPond._id}/${idx}`
//                             ];
                            
//                             // Try next alternative
//                             let currentIndex = alternativeUrls.indexOf(e.target.src);
//                             let nextIndex = currentIndex + 1;
                            
//                             if (nextIndex < alternativeUrls.length) {
//                               console.log(`🔄 Trying alternative pond file URL:`, alternativeUrls[nextIndex]);
//                               e.target.src = alternativeUrls[nextIndex];
//                             } else {
//                               console.log(`❌ All alternatives failed, using fallback`);
//                               e.target.src = "/no-image.png";
//                               e.target.onerror = null;
//                             }
//                           }}
//                           onLoad={(e) => {
//                             console.log(`✅ Pond file ${idx} loaded successfully:`, url);
//                           }}
//                         />
//                         <div className="file-label">Pond File {idx + 1}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ✅ ADDED: Fish Files Section with FIXED image loading */}
//               {selectedPond.fishFilesUrls && selectedPond.fishFilesUrls.length > 0 && (
//                 <div className="file-preview-section">
//                   <strong>Fish Files ({selectedPond.fishFilesUrls.length}):</strong>
//                   <div className="file-grid">
//                     {selectedPond.fishFilesUrls.map((url, idx) => (
//                       <div key={idx} className="file-item">
//                         <img 
//                           src={url}
//                           alt={`Fish File ${idx + 1}`}
//                           className="preview-img"
//                           onClick={() => openModal(url)}
//                           onError={(e) => {
//                             console.error(`❌ Fish file ${idx} failed to load:`, url);
                            
//                             // Try alternative URL patterns
//                             const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";
//                             const alternativeUrls = [
//                               `${API_URL}/api/fish/${selectedPond.pondId}/files/${idx}`,
//                               `${API_URL}/api/fish/files/${selectedPond.pondId}/${idx}`,
//                               `${API_URL}/api/fish/${selectedPond._id}/files/${idx}`,
//                               `${API_URL}/api/fish/files/${selectedPond._id}/${idx}`
//                             ];
                            
//                             // Try next alternative
//                             let currentIndex = alternativeUrls.indexOf(e.target.src);
//                             let nextIndex = currentIndex + 1;
                            
//                             if (nextIndex < alternativeUrls.length) {
//                               console.log(`🔄 Trying alternative fish file URL:`, alternativeUrls[nextIndex]);
//                               e.target.src = alternativeUrls[nextIndex];
//                             } else {
//                               console.log(`❌ All alternatives failed, using fallback`);
//                               e.target.src = "/no-image.png";
//                               e.target.onerror = null;
//                             }
//                           }}
//                           onLoad={(e) => {
//                             console.log(`✅ Fish file ${idx} loaded successfully:`, url);
//                           }}
//                         />
//                         <div className="file-label">Fish File {idx + 1}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 onClick={() => {
//                   const headers = ["Field", "Value"];
//                   const rows = [];
                  
//                   pondDetailFields.forEach(({ label, key }) => {
//                     const value = selectedPond[key];
//                     let displayValue = value || "N/A";
                    
//                     if (Array.isArray(value)) {
//                       displayValue = value.join("; ");
//                     }
                    
//                     if (key === "pondImage" && value) {
//                       displayValue = getPondImageUrl(selectedPond, selectedPond._id);
//                     }
                    
//                     if ((key === "pondFiles" || key === "fishFiles") && value) {
//                       const urls = key === "pondFiles" 
//                         ? selectedPond.pondFilesUrls 
//                         : selectedPond.fishFilesUrls;
//                       displayValue = urls ? urls.join("; ") : "No files";
//                     }
                    
//                     rows.push([label, displayValue]);
//                   });
                  
//                   if (selectedFarmer) {
//                     rows.push(["", ""]);
//                     rows.push(["FARMER INFORMATION", ""]);
//                     farmerBasicFields.forEach(({ label, key }) => {
//                       rows.push([label, selectedFarmer[key] || "N/A"]);
//                     });
//                   }
                  
//                   if (selectedAgent) {
//                     rows.push(["", ""]);
//                     rows.push(["AGENT INFORMATION", ""]);
//                     rows.push(["Agent Name", selectedAgent.name]);
//                     rows.push(["Agent Mobile", selectedAgent.mobile]);
//                     rows.push(["Agent Email", selectedAgent.email]);
//                   }
                  
//                   const csvContent = [
//                     headers.join(","),
//                     ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
//                   ].join("\n");
                  
//                   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//                   const url = URL.createObjectURL(blob);
//                   const link = document.createElement("a");
//                   link.setAttribute("href", url);
//                   link.setAttribute("download", `${selectedPond.pondId}_full_details.csv`);
//                   link.style.visibility = "hidden";
//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);
//                 }}
//                 className="download-all-btn"
//               >
//                 ⬇️ Download All Data (CSV)
//               </button>
              
//               <button 
//                 onClick={() => openHistoryModal(selectedPond.pondId, "pond", selectedPond.pondId)}
//                 className="history-btn"
//               >
//                 📜 View History
//               </button>
              
//               <button onClick={closePondDetailsModal} className="close-modal-btn">
//                 ✕ Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* History Modal */}
//       {historyModalOpen && (
//         <div className="modal-overlay" onClick={closeHistoryModal}>
//           <div className="history-modal" onClick={(e) => e.stopPropagation()}>
//             <h3>
//               History of {historyTitle}
//               <button className="close-btn" onClick={closeHistoryModal}>×</button>
//             </h3>
            
//             {historyData.length === 0 ? (
//               <div className="history-empty-state">
//                 <h4>No History Found</h4>
//                 <p>No changes have been recorded for this item yet.</p>
//               </div>
//             ) : (
//               <>
//                 <div className="history-stats">
//                   <div className="stat-card">
//                     <h4>Total Changes</h4>
//                     <p>{historyData.length}</p>
//                   </div>
//                   <div className="stat-card">
//                     <h4>Last Updated</h4>
//                     <p>
//                       {new Date(
//                         Math.max(...historyData.map(h => new Date(h.createdAt || h.timestamp)))
//                       ).toLocaleDateString('en-IN')}
//                     </p>
//                   </div>
//                   <div className="stat-card">
//                     <h4>Changes Today</h4>
//                     <p>
//                       {
//                         historyData.filter(h => 
//                           new Date(h.createdAt || h.timestamp).toDateString() === new Date().toDateString()
//                         ).length
//                       }
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="history-table-container">
//                   <table className="history-table">
//                     <thead>
//                       <tr>
//                         <th>Type</th>
//                         <th>Field</th>
//                         <th>Changes</th>
//                         <th>Changed By</th>
//                         <th>Timestamp</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {historyData
//                         .sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp))
//                         .map((h, idx) => (
//                           <tr key={idx}>
//                             <td>
//                               <span className={`change-badge ${h.actionType || 'updated'}`}>
//                                 {h.actionType ? h.actionType.toUpperCase() : 'UPDATED'}
//                               </span>
//                             </td>
//                             <td>
//                               {Array.isArray(h.changes) ? (
//                                 h.changes.map((c, i) => (
//                                   <div key={i}>{c.field}</div>
//                                 ))
//                               ) : (
//                                 Object.keys(h.changes || {}).length > 0 ? (
//                                   Object.keys(h.changes || {}).map((k, i) => <div key={i}>{k}</div>)
//                                 ) : (
//                                   <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
//                                     No field changes detected
//                                   </div>
//                                 )
//                               )}
//                             </td>
//                             <td>
//                               {Array.isArray(h.changes) ? (
//                                 h.changes.map((c, i) => (
//                                   <div key={i}>
//                                     <span className="old-value">{JSON.stringify(c.old || 'N/A')}</span> → 
//                                     <span className="new-value">{JSON.stringify(c.new || 'N/A')}</span>
//                                   </div>
//                                 ))
//                               ) : Object.keys(h.changes || {}).length > 0 ? (
//                                 Object.entries(h.changes || {}).map(([key, value]) => (
//                                   <div key={key}>
//                                     <span className="old-value">{JSON.stringify(value.old || 'N/A')}</span> → 
//                                     <span className="new-value">{JSON.stringify(value.new || 'N/A')}</span>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
//                                   Only metadata updated
//                                 </div>
//                               )}
//                             </td>
//                             <td>
//                               <div className="user-info">
//                                 <div className="user-avatar">
//                                   {h.updatedBy?.name?.charAt(0) || 'A'}
//                                 </div>
//                                 <div>
//                                   <div style={{ fontWeight: '600' }}>
//                                     {h.updatedBy?.name || 'Admin'}
//                                   </div>
//                                   <div style={{ fontSize: '12px', color: '#6b7280' }}>
//                                     {h.updatedBy?.role || 'System'}
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td>
//                               <div className="timestamp">
//                                 {new Date(h.createdAt || h.timestamp).toLocaleString('en-IN', {
//                                   day: '2-digit',
//                                   month: 'short',
//                                   year: 'numeric',
//                                   hour: '2-digit',
//                                   minute: '2-digit'
//                                 })}
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;































// AdminDashboard.jsx - COMPLETE FIXED VERSION
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [viewType, setViewType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyTitle, setHistoryTitle] = useState("");

  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showPondDetails, setShowPondDetails] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [pondDetailsModalOpen, setPondDetailsModalOpen] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";

  // ==================== COMPLETE IMAGE URL HELPERS ====================

  // ✅ UNIVERSAL IMAGE GETTER - Handles ALL cases (Cloudinary, MongoDB, ObjectId)
  const getImageUrl = (imageData, type = 'general') => {
    try {
      // Debug log
      console.log(`🔍 getImageUrl called:`, { imageData, type });

      // NULL/UNDEFINED check
      if (!imageData || imageData === "null" || imageData === "undefined") {
        return "/no-image.png";
      }

      // CASE 1: Already a full Cloudinary URL
      if (typeof imageData === 'string' && imageData.includes('cloudinary.com')) {
        return imageData;
      }

      // CASE 2: Data URL
      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        return imageData;
      }

      // CASE 3: Already a full HTTP URL
      if (typeof imageData === 'string' && imageData.startsWith('http')) {
        return imageData;
      }

      // CASE 4: MongoDB ObjectId (24 character hex)
      if (typeof imageData === 'string' && /^[0-9a-fA-F]{24}$/.test(imageData)) {
        switch(type) {
          case 'farmer':
            return `${API_URL}/api/images/farmer/photo/${imageData}`;
          case 'dealer':
            return `${API_URL}/api/images/dealer/image/${imageData}`;
          case 'pond':
            return `${API_URL}/api/images/pond/image/${imageData}`;
          case 'agent-profile':
            return `${API_URL}/api/images/${imageData}/profile`;
          case 'agent-aadharFront':
            return `${API_URL}/api/images/${imageData}/aadharFront`;
          case 'agent-aadharBack':
            return `${API_URL}/api/images/${imageData}/aadharBack`;
          case 'agent-pan':
            return `${API_URL}/api/images/${imageData}/pan`;
          case 'agent-savingImg':
            return `${API_URL}/api/images/${imageData}/savingImg`;
          default:
            return `${API_URL}/api/images/${imageData}`;
        }
      }

      // CASE 5: Pond ID format (FAR-XXXX-PX)
      if (typeof imageData === 'string' && imageData.includes('FAR-') && imageData.includes('-P')) {
        return `${API_URL}/api/images/pond/image/${imageData}`;
      }

      // CASE 6: Object with Cloudinary data
      if (typeof imageData === 'object' && imageData !== null) {
        if (imageData.url) return imageData.url;
        if (imageData.secure_url) return imageData.secure_url;
        if (imageData.path) return imageData.path;
      }

      return "/no-image.png";
    } catch (error) {
      console.error("❌ Error in getImageUrl:", error);
      return "/no-image.png";
    }
  };

  // ✅ FARMER IMAGE HELPER
  const getFarmerImageUrl = (farmer) => {
    if (!farmer) return "/profile.png";
    
    // Case 1: Direct Cloudinary URL
    if (farmer.photo) {
      if (typeof farmer.photo === 'string') {
        if (farmer.photo.includes('cloudinary.com')) {
          return farmer.photo;
        }
        // If it's MongoDB ObjectId
        if (/^[0-9a-fA-F]{24}$/.test(farmer.photo)) {
          return `${API_URL}/api/images/farmer/photo/${farmer.photo}`;
        }
      }
      // If photo is object with url
      if (typeof farmer.photo === 'object' && farmer.photo.url) {
        return farmer.photo.url;
      }
    }
    
    // Case 2: Use farmer._id
    if (farmer._id) {
      return `${API_URL}/api/images/farmer/photo/${farmer._id}`;
    }
    
    return "/profile.png";
  };

  // ✅ POND IMAGE HELPER
  const getPondImageUrl = (pond) => {
    if (!pond) return "/no-image.png";
    
    // Case 1: Direct Cloudinary URL in pondImage
    if (pond.pondImage) {
      if (typeof pond.pondImage === 'string') {
        if (pond.pondImage.includes('cloudinary.com')) {
          return pond.pondImage;
        }
      }
      if (typeof pond.pondImage === 'object' && pond.pondImage.url) {
        return pond.pondImage.url;
      }
    }
    
    // Case 2: Use pondId (FAR-XXXX-PX format)
    if (pond.pondId && pond.pondId.includes('FAR-')) {
      return `${API_URL}/api/images/pond/image/${pond.pondId}`;
    }
    
    // Case 3: Use MongoDB _id
    if (pond._id) {
      return `${API_URL}/api/images/pond/image/${pond._id}`;
    }
    
    // Case 4: Check pondImage field as ID
    if (pond.pondImage && typeof pond.pondImage === 'string' && /^[0-9a-fA-F]{24}$/.test(pond.pondImage)) {
      return `${API_URL}/api/images/pond/image/${pond.pondImage}`;
    }
    
    return "/no-image.png";
  };

  // ✅ DEALER IMAGE HELPER
  const getDealerImageUrl = (dealer) => {
    if (!dealer) return "/no-image.png";
    
    // Case 1: Direct Cloudinary URL
    if (dealer.image) {
      if (typeof dealer.image === 'string') {
        if (dealer.image.includes('cloudinary.com')) {
          return dealer.image;
        }
        // If it's MongoDB ObjectId
        if (/^[0-9a-fA-F]{24}$/.test(dealer.image)) {
          return `${API_URL}/api/images/dealer/image/${dealer.image}`;
        }
      }
      // If image is object with url
      if (typeof dealer.image === 'object' && dealer.image.url) {
        return dealer.image.url;
      }
    }
    
    // Case 2: Use dealer._id
    if (dealer._id) {
      return `${API_URL}/api/images/dealer/image/${dealer._id}`;
    }
    
    return "/no-image.png";
  };

  // ✅ AGENT IMAGE HELPER
  const getAgentImageUrl = (agent, imageType) => {
    if (!agent || !agent._id) return "/profile.png";
    
    if (!imageType) return `${API_URL}/api/images/${agent._id}/profile`;
    
    return `${API_URL}/api/images/${agent._id}/${imageType}`;
  };

  // ✅ POND FILES URL HELPER
  const getPondFilesUrls = (pondFiles, pond) => {
    if (!pondFiles || !Array.isArray(pondFiles) || pondFiles.length === 0 || !pond) {
      return [];
    }
    
    return pondFiles.map((file, index) => {
      // If file is already a URL
      if (typeof file === 'string') {
        if (file.includes('cloudinary.com') || file.startsWith('http')) {
          return file;
        }
      }
      
      // Generate API URL
      const pondId = pond.pondId || pond._id;
      return `${API_URL}/api/images/pond/file/${pondId}/${index}`;
    });
  };

  // ✅ FISH FILES URL HELPER
  const getFishFilesUrls = (fishFiles, pond) => {
    if (!fishFiles || !Array.isArray(fishFiles) || fishFiles.length === 0 || !pond) {
      return [];
    }
    
    return fishFiles.map((file, index) => {
      // If file is already a URL
      if (typeof file === 'string') {
        if (file.includes('cloudinary.com') || file.startsWith('http')) {
          return file;
        }
      }
      
      // Generate API URL
      const pondId = pond.pondId || pond._id;
      return `${API_URL}/api/images/fish/file/${pondId}/${index}`;
    });
  };

  // ==================== DATA FETCHING ====================

  // Filtering
  const filteredFarmers = farmers.filter((f) =>
    (f.farmerId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredDealers = dealers.filter((d) =>
    (d.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load agents
  useEffect(() => {
    setLoading(true);
    api
      .get("/api/admin/agents")
      .then((res) => {
        setAgents(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Load access requests
  const loadAccessRequests = () => {
    api
      .get("/api/access/requests")
      .then((res) => setAccessRequests(res.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadAccessRequests();
    const id = setInterval(loadAccessRequests, 10000);
    return () => clearInterval(id);
  }, []);

  // Load agent data
  const loadAgentData = (agentId, type) => {
    setLoading(true);
    setSelectedFarmer(null);
    setShowPondDetails(false);
    api
      .get(`/api/admin/agents/${agentId}/details`)
      .then((res) => {
        // Process farmers with images
        const farmersWithImages = (res.data.farmers || []).map(farmer => ({
          ...farmer,
          photoUrl: getFarmerImageUrl(farmer)
        }));
        
        // Process dealers with images
        const dealersWithImages = (res.data.dealers || []).map(dealer => ({
          ...dealer,
          imageUrl: getDealerImageUrl(dealer)
        }));
        
        setFarmers(farmersWithImages);
        setDealers(dealersWithImages);
        const ag = agents.find((a) => a._id === agentId) || null;
        setSelectedAgent(ag);
        setViewType(type);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // Open Farmer Details with Ponds
  const openFarmerDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowPondDetails(!showPondDetails || selectedFarmer?._id !== farmer._id);
  };

  // Open Pond Details Modal
  const openPondDetails = (pond) => {
    console.log("🔄 Opening pond details:", pond);
    
    // Enhance pond object with proper image URLs
    const enhancedPond = {
      ...pond,
      pondImageUrl: getPondImageUrl(pond),
      pondFilesUrls: getPondFilesUrls(pond.pondFiles, pond),
      fishFilesUrls: getFishFilesUrls(pond.fishFiles, pond)
    };
    
    setSelectedPond(enhancedPond);
    setPondDetailsModalOpen(true);
  };

  // Modal open/close
  const openModal = (imgUrl) => {
    setModalImage(imgUrl);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setModalImage("");
  };

  const closePondDetailsModal = () => {
    setPondDetailsModalOpen(false);
    setSelectedPond(null);
  };

  // Access Allow / Reject
  const handleAllow = (requestId) => {
    api
      .post("/api/access/allow", { requestId })
      .then(() => {
        localStorage.setItem("accessApproved", "true");
        setAccessRequests((prev) => prev.filter((r) => r._id !== requestId));
      })
      .catch((err) => console.log(err));
  };
  
  const handleReject = (requestId) => {
    api
      .post("/api/access/reject", { requestId })
      .then(() =>
        setAccessRequests((prev) => prev.filter((r) => r._id !== requestId))
      )
      .catch((err) => console.log(err));
  };

  // Excel download functions
  const downloadSingleExcel = (item, fileName) => {
    const header = Object.keys(item);
    const csvRows = [
      header.join(","),
      header.map((key) => JSON.stringify(item[key] || "")).join(","),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName}.csv`;
    a.click();
  };

  // Download farmer data with ALL ponds
  const downloadFarmerExcelWithAllPonds = (farmersData) => {
    if (!farmersData.length) return;
    
    try {
      const allRows = [];
      
      const farmerHeaders = [
        "Farmer ID", "Name", "Contact", "Age", "Gender", "Village", 
        "Aadhar", "Family Members", "Family Occupation", "Photo", 
        "Pond Count", "Created At", "Updated At", "Agent ID", "Agent Name"
      ];
      
      const pondHeaders = [
        "Pond ID", "Pond Number", "Pond Area", "Area Unit", "Pond Depth",
        "Latitude", "Longitude",
        "Overflow", "Receives Sunlight", "Trees on Banks", "Neighbourhood", "Wastewater Enters",
        "Species", "Date of Stocking", "Initial Seed Qty", "Current Fish Qty", "Average Size",
        "Feed Type", "Feed Other", "Feed Frequency", "Feed Qty/Day", "Feed Time",
        "Recent Feed Changes", "Reduced Appetite", "Water Temperature", "pH", "DO",
        "Ammonia Level", "Phytoplankton Level", "Water Hardness", "Algae Bloom", "Pond Water Color",
        "Source of Water", "Disease Symptoms", "Symptoms Observed", "Fish Deaths", "Symptoms Affect",
        "Farm Observed Date", "Farm Observed Time", "Last Species", "Last Harvest Complete",
        "Recent Rain/Flood", "Pesticide Runoff", "Construction Near", "Sudden Temp Change",
        "Notes", "Pond Image Link", "Pond Files", "Fish Files", "Created At", "Updated At"
      ];
      
      const allHeaders = [...farmerHeaders, ...pondHeaders.map(h => `Pond_${h}`)];
      allRows.push(allHeaders);
      
      farmersData.forEach(farmer => {
        const farmerBasicData = [
          farmer.farmerId || "",
          farmer.name || "",
          farmer.contact || "",
          farmer.age || "",
          farmer.gender || "",
          farmer.village || "",
          farmer.adhar || "",
          farmer.familyMembers || "",
          farmer.familyOccupation || "",
          getFarmerImageUrl(farmer),
          farmer.pondCount || 0,
          farmer.createdAt ? new Date(farmer.createdAt).toLocaleString() : "",
          farmer.updatedAt ? new Date(farmer.updatedAt).toLocaleString() : "",
          selectedAgent?._id || "",
          selectedAgent?.name || ""
        ];
        
        if (farmer.ponds && farmer.ponds.length > 0) {
          farmer.ponds.forEach(pond => {
            const pondImageLink = getPondImageUrl(pond);
            
            const pondData = [
              pond.pondId || "",
              pond.pondNumber || "",
              pond.pondArea || "",
              pond.pondAreaUnit || "",
              pond.pondDepth || "",
              pond.latitude || "",
              pond.longitude || "",
              pond.overflow || "",
              pond.receivesSunlight || "",
              pond.treesOnBanks || "",
              pond.neighbourhood || "",
              pond.wastewaterEnters || "",
              pond.species || "",
              pond.dateOfStocking || "",
              pond.qtySeedInitially || "",
              pond.currentQty || "",
              pond.avgSize || "",
              pond.feedType || "",
              pond.feedOther || "",
              pond.feedFreq || "",
              pond.feedQtyPerDay || "",
              pond.feedTime || "",
              pond.recentFeedChanges || "",
              pond.reducedAppetite || "",
              pond.waterTemperature || "",
              pond.pH || "",
              pond.DO || "",
              pond.ammoniaLevel || "",
              pond.phytoplanktonLevel || "",
              pond.waterHardness || "",
              pond.algaeBloom || "",
              pond.pondWaterColor || "",
              pond.sourceOfWater || "",
              pond.diseaseSymptoms || "",
              pond.symptomsObserved || "",
              pond.fishDeaths || "",
              pond.symptomsAffect || "",
              pond.farmObservedDate || "",
              pond.farmObservedTime || "",
              pond.lastSpecies || "",
              pond.lastHarvestComplete || "",
              pond.recentRainFlood || "",
              pond.pesticideRunoff || "",
              pond.constructionNear || "",
              pond.suddenTempChange || "",
              pond.notes || "",
              pondImageLink,
              Array.isArray(pond.pondFiles) ? pond.pondFiles.join("; ") : "",
              Array.isArray(pond.fishFiles) ? pond.fishFiles.join("; ") : "",
              pond.createdAt ? new Date(pond.createdAt).toLocaleString() : "",
              pond.updatedAt ? new Date(pond.updatedAt).toLocaleString() : ""
            ];
            
            const combinedRow = [...farmerBasicData, ...pondData];
            allRows.push(combinedRow);
          });
        } else {
          const emptyPondData = new Array(pondHeaders.length).fill("");
          const combinedRow = [...farmerBasicData, ...emptyPondData];
          allRows.push(combinedRow);
        }
      });
      
      const csvContent = allRows.map(row => 
        row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(",")
      ).join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Farmers_With_Ponds_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Error generating Excel file. Check console for details.");
    }
  };

  // Download single farmer data with all ponds
  const downloadSingleFarmerData = (farmer) => {
    try {
      const allRows = [];
      
      const farmerHeaders = [
        "Farmer ID", "Name", "Contact", "Age", "Gender", "Village", 
        "Aadhar", "Family Members", "Family Occupation", "Photo", 
        "Pond Count", "Created At", "Updated At", "Agent ID", "Agent Name"
      ];
      
      const pondHeaders = [
        "Pond ID", "Pond Number", "Pond Area", "Area Unit", "Pond Depth",
        "Latitude", "Longitude",
        "Overflow", "Receives Sunlight", "Trees on Banks", "Neighbourhood", "Wastewater Enters",
        "Species", "Date of Stocking", "Initial Seed Qty", "Current Fish Qty", "Average Size",
        "Feed Type", "Feed Other", "Feed Frequency", "Feed Qty/Day", "Feed Time",
        "Recent Feed Changes", "Reduced Appetite", "Water Temperature", "pH", "DO",
        "Ammonia Level", "Phytoplankton Level", "Water Hardness", "Algae Bloom", "Pond Water Color",
        "Source of Water", "Disease Symptoms", "Symptoms Observed", "Fish Deaths", "Symptoms Affect",
        "Farm Observed Date", "Farm Observed Time", "Last Species", "Last Harvest Complete",
        "Recent Rain/Flood", "Pesticide Runoff", "Construction Near", "Sudden Temp Change",
        "Notes", "Pond Image Link", "Pond Files", "Fish Files", "Created At", "Updated At"
      ];
      
      const allHeaders = [...farmerHeaders, ...pondHeaders.map(h => `Pond_${h}`)];
      allRows.push(allHeaders);
      
      const farmerBasicData = [
        farmer.farmerId || "",
        farmer.name || "",
        farmer.contact || "",
        farmer.age || "",
        farmer.gender || "",
        farmer.village || "",
        farmer.adhar || "",
        farmer.familyMembers || "",
        farmer.familyOccupation || "",
        getFarmerImageUrl(farmer),
        farmer.pondCount || 0,
        farmer.createdAt ? new Date(farmer.createdAt).toLocaleString() : "",
        farmer.updatedAt ? new Date(farmer.updatedAt).toLocaleString() : "",
        selectedAgent?._id || "",
        selectedAgent?.name || ""
      ];
      
      if (farmer.ponds && farmer.ponds.length > 0) {
        farmer.ponds.forEach(pond => {
          const pondImageLink = getPondImageUrl(pond);
          
          const pondData = [
            pond.pondId || "",
            pond.pondNumber || "",
            pond.pondArea || "",
            pond.pondAreaUnit || "",
            pond.pondDepth || "",
            pond.latitude || "",
            pond.longitude || "",
            pond.overflow || "",
            pond.receivesSunlight || "",
            pond.treesOnBanks || "",
            pond.neighbourhood || "",
            pond.wastewaterEnters || "",
            pond.species || "",
            pond.dateOfStocking || "",
            pond.qtySeedInitially || "",
            pond.currentQty || "",
            pond.avgSize || "",
            pond.feedType || "",
            pond.feedOther || "",
            pond.feedFreq || "",
            pond.feedQtyPerDay || "",
            pond.feedTime || "",
            pond.recentFeedChanges || "",
            pond.reducedAppetite || "",
            pond.waterTemperature || "",
            pond.pH || "",
            pond.DO || "",
            pond.ammoniaLevel || "",
            pond.phytoplanktonLevel || "",
            pond.waterHardness || "",
            pond.algaeBloom || "",
            pond.pondWaterColor || "",
            pond.sourceOfWater || "",
            pond.diseaseSymptoms || "",
            pond.symptomsObserved || "",
            pond.fishDeaths || "",
            pond.symptomsAffect || "",
            pond.farmObservedDate || "",
            pond.farmObservedTime || "",
            pond.lastSpecies || "",
            pond.lastHarvestComplete || "",
            pond.recentRainFlood || "",
            pond.pesticideRunoff || "",
            pond.constructionNear || "",
            pond.suddenTempChange || "",
            pond.notes || "",
            pondImageLink,
            Array.isArray(pond.pondFiles) ? pond.pondFiles.join("; ") : "",
            Array.isArray(pond.fishFiles) ? pond.fishFiles.join("; ") : "",
            pond.createdAt ? new Date(pond.createdAt).toLocaleString() : "",
            pond.updatedAt ? new Date(pond.updatedAt).toLocaleString() : ""
          ];
          
          const combinedRow = [...farmerBasicData, ...pondData];
          allRows.push(combinedRow);
        });
      } else {
        const emptyPondData = new Array(pondHeaders.length).fill("");
        const combinedRow = [...farmerBasicData, ...emptyPondData];
        allRows.push(combinedRow);
      }
      
      const csvContent = allRows.map(row => 
        row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(",")
      ).join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${farmer.farmerId}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error downloading single farmer data:", error);
      alert("Error downloading farmer data. Check console for details.");
    }
  };

  // Download simple Excel (for dealers)
  const downloadExcel = (items, fileName) => {
    if (!items.length) return;
    const header = Object.keys(items[0]);
    const csvRows = [
      header.join(","),
      ...items.map((row) =>
        header.map((key) => JSON.stringify(row[key] || "")).join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName}.csv`;
    a.click();
  };

  // Open History modal
  const openHistoryModal = (itemId, type, name) => {
    setHistoryTitle(name);
    api
      .get(`/api/history/${type}/${itemId}`)
      .then((res) => {
        setHistoryData(res.data || []);
        setHistoryModalOpen(true);
      })
      .catch((err) => {
        console.error("❌ History API Error:", err);
        setHistoryData([]);
        setHistoryModalOpen(true);
      });
  };

  // Close History modal
  const closeHistoryModal = () => {
    setHistoryModalOpen(false);
    setHistoryData([]);
    setHistoryTitle("");
  };

  // Farmer basic fields
  const farmerBasicFields = [
    { label: "Farmer ID", key: "farmerId" },
    { label: "Name", key: "name" },
    { label: "Contact", key: "contact" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Village", key: "village" },
    { label: "Aadhar", key: "adhar" },
    { label: "Family Members", key: "familyMembers" },
    { label: "Occupation", key: "familyOccupation" },
  ];

  // Pond fields for details modal
  const pondDetailFields = [
    { label: "Pond ID", key: "pondId" },
    { label: "Pond Number", key: "pondNumber" },
    { label: "Pond Area", key: "pondArea" },
    { label: "Area Unit", key: "pondAreaUnit" },
    { label: "Pond Depth", key: "pondDepth" },
    { label: "Latitude", key: "latitude" },
    { label: "Longitude", key: "longitude" },
    { label: "Overflow", key: "overflow" },
    { label: "Sunlight", key: "receivesSunlight" },
    { label: "Trees on Banks", key: "treesOnBanks" },
    { label: "Neighbourhood", key: "neighbourhood" },
    { label: "Wastewater Enters", key: "wastewaterEnters" },
    { label: "Species", key: "species" },
    { label: "Date of Stocking", key: "dateOfStocking" },
    { label: "Initial Seed Qty", key: "qtySeedInitially" },
    { label: "Current Fish Qty", key: "currentQty" },
    { label: "Average Size", key: "avgSize" },
    { label: "Feed Type", key: "feedType" },
    { label: "Feed Other", key: "feedOther" },
    { label: "Feed Frequency", key: "feedFreq" },
    { label: "Feed Qty/Day", key: "feedQtyPerDay" },
    { label: "Feed Time", key: "feedTime" },
    { label: "Recent Changes", key: "recentFeedChanges" },
    { label: "Reduced Appetite", key: "reducedAppetite" },
    { label: "Water Temperature", key: "waterTemperature" },
    { label: "pH", key: "pH" },
    { label: "DO", key: "DO" },
    { label: "Ammonia Level", key: "ammoniaLevel" },
    { label: "Phytoplankton", key: "phytoplanktonLevel" },
    { label: "Water Hardness", key: "waterHardness" },
    { label: "Algae Bloom", key: "algaeBloom" },
    { label: "Water Color", key: "pondWaterColor" },
    { label: "Water Source", key: "sourceOfWater" },
    { label: "Disease Symptoms", key: "diseaseSymptoms" },
    { label: "Symptoms Observed", key: "symptomsObserved" },
    { label: "Fish Deaths", key: "fishDeaths" },
    { label: "Symptoms Affect", key: "symptomsAffect" },
    { label: "Farm Observed Date", key: "farmObservedDate" },
    { label: "Farm Observed Time", key: "farmObservedTime" },
    { label: "Last Species", key: "lastSpecies" },
    { label: "Last Harvest Complete", key: "lastHarvestComplete" },
    { label: "Recent Rain/Flood", key: "recentRainFlood" },
    { label: "Pesticide Runoff", key: "pesticideRunoff" },
    { label: "Construction Near", key: "constructionNear" },
    { label: "Sudden Temp Change", key: "suddenTempChange" },
    { label: "Notes", key: "notes" },
    { label: "Pond Image", key: "pondImage", isImage: true },
    { label: "Pond Files", key: "pondFiles", isFileArray: true },
    { label: "Fish Files", key: "fishFiles", isFileArray: true },
    { label: "Created At", key: "createdAt" },
    { label: "Updated At", key: "updatedAt" },
  ];

  // Dealer fields
  const dealerFields = [
    { label: "Image", key: "image", isImage: true },
    { label: "Name", key: "name" },
    { label: "Mobile", key: "contact" },
    { label: "Shop Address", key: "shopAddress" },
    { label: "GST Number", key: "gstNumber" },
  ];

  // ==================== RENDER FUNCTIONS ====================

  // Render Farmer Card with Ponds
  const renderFarmerCardWithPonds = (data) => (
    <div className="vertical-cards">
      {data.map((farmer) => (
        <div className="farmer-card" key={farmer._id}>
          <div className="farmer-card-header">
            <div className="farmer-profile-header">
              <img 
                src={getFarmerImageUrl(farmer)}
                alt="Farmer"
                className="farmer-avatar"
                onClick={() => openModal(getFarmerImageUrl(farmer))}
                onError={(e) => {
                  console.log(`❌ Farmer image failed: ${farmer._id}`);
                  e.target.src = "/profile.png";
                  e.target.onerror = null;
                }}
              />

              <div>
                <h4>{farmer.name} ({farmer.farmerId})</h4>
                <p>{farmer.contact} • {farmer.village}</p>
              </div>
            </div>

            <div className="farmer-actions">
              <button
                onClick={() => downloadSingleFarmerData(farmer)}
                className="download-farmer-btn"
                style={{
                  marginRight: "10px",
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
                title={`Download ${farmer.farmerId} data`}
              >
                ⬇️ Download
              </button>
              
              <button
                onClick={() => openFarmerDetails(farmer)}
                className="card-view-details-btn"
              >
                {showPondDetails && selectedFarmer?._id === farmer._id ? "Hide Ponds" : "View Ponds"}
              </button>
            </div>
          </div>
          
          {/* Farmer Basic Info */}
          <div className="farmer-basic-info">
            {farmerBasicFields.map(({ label, key }) => (
              <div className="info-row" key={key}>
                <strong>{label}:</strong>
                <span>{farmer[key] || "N/A"}</span>
              </div>
            ))}
          </div>
          
          {/* Ponds List (if expanded) */}
          {showPondDetails && selectedFarmer?._id === farmer._id && (
            <div className="ponds-section">
              <h5>Ponds ({farmer.ponds?.length || 0})</h5>
              
              {farmer.ponds && farmer.ponds.length > 0 ? (
                <div className="ponds-list">
                  {farmer.ponds.map((pond, index) => (
                    <div className="pond-card" key={pond.pondId || index}>
                      <div className="pond-card-header">
                        <div className="pond-header-info">
                          <h6>Pond {pond.pondNumber || index + 1}: {pond.pondId}</h6>
                          {pond.pondImage && (
                            <img 
                              src={getPondImageUrl(pond)}
                              alt="Pond"
                              className="pond-thumbnail"
                              onClick={() => openModal(getPondImageUrl(pond))}
                              onError={(e) => {
                                console.log(`❌ Pond image failed: ${pond.pondId}`);
                                e.target.src = "/no-image.png";
                                e.target.onerror = null;
                              }}
                            />
                          )}
                        </div>
                        <div className="pond-actions">
                          <button
                            onClick={() => openPondDetails(pond)}
                            className="pond-view-btn"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => openHistoryModal(pond.pondId, "pond", pond.pondId)}
                            className="pond-history-btn"
                          >
                            Pond History
                          </button>
                        </div>
                      </div>
                      
                      <div className="pond-basic-info">
                        <div><strong>Species:</strong> {pond.species || "Not specified"}</div>
                        <div><strong>Area:</strong> {pond.pondArea || "N/A"} {pond.pondAreaUnit}</div>
                        <div><strong>Location:</strong> {pond.latitude ? `${pond.latitude}, ${pond.longitude}` : "N/A"}</div>
                        <div><strong>Last Updated:</strong> {
                          pond.updatedAt ? new Date(pond.updatedAt).toLocaleDateString('en-IN') : "N/A"
                        }</div>
                      </div>
                      
                      {/* Pond Files Preview */}
                      {(pond.pondFiles && pond.pondFiles.length > 0) && (
                        <div className="pond-files-preview">
                          <strong>Pond Files:</strong>
                          <div className="files-preview">
                            {pond.pondFiles.slice(0, 3).map((file, idx) => {
                              const fileUrl = getImageUrl(file, 'pond');
                              return (
                                <img 
                                  key={idx}
                                  src={fileUrl}
                                  alt={`Pond File ${idx + 1}`}
                                  className="file-preview"
                                  onClick={() => openModal(fileUrl)}
                                  onError={(e) => {
                                    e.target.src = "/no-image.png";
                                    e.target.onerror = null;
                                  }}
                                />
                              );
                            })}
                            {pond.pondFiles.length > 3 && (
                              <div className="more-files">+{pond.pondFiles.length - 3} more</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-ponds">No ponds found for this farmer.</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Render Dealer Card
  const renderDealerCard = (data) => (
    <div className="vertical-cards">
      {data.map((item) => (
        <div className="dealer-card" key={item._id}>
          <div className="dealer-card-header">
            <div className="dealer-profile">
              <img
                src={getDealerImageUrl(item)}
                alt={`Dealer ${item.name}`}
                className="dealer-avatar"
                onClick={() => openModal(getDealerImageUrl(item))}
                onError={(e) => {
                  console.log(`❌ Dealer image failed: ${item.name}`);
                  e.target.src = "/no-image.png";
                  e.target.onerror = null;
                }}
              />
              <div>
                <h4>{item.name || "N/A"}</h4>
                <p>{item.contact || "N/A"}</p>
              </div>
            </div>

            <button
              onClick={() => downloadSingleExcel(item, `dealer_${item.name}`)}
              className="download-dealer-btn"
            >
              ⬇️ Download
            </button>
          </div>
          
          <div className="dealer-details">
            {dealerFields
              .filter(field => !field.isImage)
              .map(({ label, key }) => (
                <div className="detail-row" key={key}>
                  <strong>{label}:</strong>
                  <span>{item[key] || "N/A"}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading && agents.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="essential-aquatech-header">
        <div className="company-logo-container">
          <img 
            src="/CompanyLogo.png" 
            alt="Essential Aquatech Logo" 
            className="company-logo"
            onError={(e) => {
              e.target.src = "/logo.png";
              e.target.onerror = null;
            }}
          />
        </div>
        <div className="company-title-container">
          <h2 className="company-title">
            Essential Aquatech
            <span className="trademark-symbol">™</span>
          </h2>
        </div>
      </div>

      <button 
        onClick={() => navigate("/orders-dashboard")}
        style={{
          marginBottom: '25px',
          marginLeft: "15px",
          padding: '14px 28px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          outline: 'none',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.25)';
        }}
        onMouseDown={(e) => {
          e.target.style.transform = 'translateY(1px)';
        }}
        onMouseUp={(e) => {
          e.target.style.transform = 'translateY(-3px)';
        }}
      >
        📦 Orders Dashboard
      </button>

      <button
        onClick={() => navigate("/astronomical-dashboard")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 144, 255, 0.4)";
          e.currentTarget.style.background = "linear-gradient(135deg, #0066CC 0%, #004C99 100%)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.35)";
          e.currentTarget.style.background = "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)";
        }}
        style={{
          marginLeft: "15px",
          marginBottom: "25px",
          padding: "14px 10px",
          background: "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
          transition: "all 0.3s ease"
        }}
      >
        🌌 Astronomical Dashboard
      </button>

      <button
        onClick={() => navigate("/satellite-dashboard")}
        style={{
          marginBottom: '25px',
          marginLeft: "15px",
          padding: '14px 24px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          outline: 'none',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.25)';
        }}
        onMouseDown={(e) => {
          e.target.style.transform = 'translateY(1px)';
        }}
        onMouseUp={(e) => {
          e.target.style.transform = 'translateY(-3px)';
        }}
      >
        🛰️ Satellite Dashboard
      </button>

      <button
        onClick={() => navigate("/weather-dashboard")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 144, 255, 0.4)";
          e.currentTarget.style.background = "linear-gradient(135deg, #0066CC 0%, #004C99 100%)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.35)";
          e.currentTarget.style.background = "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)";
        }}
        style={{
          marginLeft: "15px",
          marginBottom: "25px",
          padding: "14px 28px",
          background: "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
          transition: "all 0.3s ease"
        }}
      >
        🌦️ Weather Dashboard
      </button>

      {/* Access Requests */}
      <div className="notification-box">
        <h3>Access Requests</h3>
        {accessRequests.length === 0 ? (
          <p>No pending access requests</p>
        ) : (
          accessRequests.map((r) => (
            <div key={r._id} className="notification-item">
              <div>
                <strong>{r.requesterId?.name || "Unknown"}</strong> wants to view{" "}
                <strong>{r.targetAgentId?.name || "Unknown"}</strong>
              </div>
              <div>
                <button onClick={() => handleAllow(r._id)}>Allow</button>
                <button onClick={() => handleReject(r._id)}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Agents Table */}
      <table className="agents-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Age</th>
            <th>Address</th>
            <th>Aadhar Front</th>
            <th>Aadhar Back</th>
            <th>PAN</th>
            <th>Account No</th>
            <th>IFSC</th>
            <th>Saving Img</th>
            <th>More</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a._id}>
              <td>
                {a.profilePic && (
                  <img
                    src={getAgentImageUrl(a, "profile")}
                    alt="Profile"
                    className="table-image"
                    onClick={() => openModal(getAgentImageUrl(a, "profile"))}
                    onError={(e) => {
                      e.target.src = "/profile.png";
                      e.target.onerror = null;
                    }}
                  />
                )}
              </td>
              <td>{a.name}</td>
              <td>{a.mobile}</td>
              <td>{a.email}</td>
              <td>{a.age}</td>
              <td>{a.address}</td>
              <td>
                {a.aadharFront && (
                  <img
                    src={getAgentImageUrl(a, "aadharFront")}
                    alt="Aadhar Front"
                    className="table-image"
                    onClick={() => openModal(getAgentImageUrl(a, "aadharFront"))}
                    onError={(e) => {
                      e.target.src = "/no-image.png";
                      e.target.onerror = null;
                    }}
                  />
                )}
              </td>
              <td>
                {a.aadharBack && (
                  <img
                    src={getAgentImageUrl(a, "aadharBack")}
                    alt="Aadhar Back"
                    className="table-image"
                    onClick={() => openModal(getAgentImageUrl(a, "aadharBack"))}
                    onError={(e) => {
                      e.target.src = "/no-image.png";
                      e.target.onerror = null;
                    }}
                  />
                )}
              </td>
              <td>
                {a.panCard && (
                  <img
                    src={getAgentImageUrl(a, "pan")}
                    alt="PAN"
                    className="table-image"
                    onClick={() => openModal(getAgentImageUrl(a, "pan"))}
                    onError={(e) => {
                      e.target.src = "/no-image.png";
                      e.target.onerror = null;
                    }}
                  />
                )}
              </td>
              <td>{a.accountNumber}</td>
              <td>{a.ifsc}</td>
              <td>
                {a.savingAccountImage && (
                  <img
                    src={getAgentImageUrl(a, "savingImg")}
                    alt="Passbook"
                    className="table-image"
                    onClick={() => openModal(getAgentImageUrl(a, "savingImg"))}
                    onError={(e) => {
                      e.target.src = "/no-image.png";
                      e.target.onerror = null;
                    }}
                  />
                )}
              </td>
              <td className="agent-actions">
                <button onClick={() => loadAgentData(a._id, "farmer")}>
                  Added Farmers
                </button>
                <button onClick={() => loadAgentData(a._id, "dealer")}>
                  Added Dealers
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Agents List */}
      <div className="mobile-agents-list">
        {agents.map((a) => (
          <div className="agent-card" key={a._id}>
            <div className="agent-card-header">
              {a.profilePic && (
                <img
                  src={getAgentImageUrl(a, "profile")}
                  alt="Profile"
                  className="agent-avatar"
                  onClick={() => openModal(getAgentImageUrl(a, "profile"))}
                  onError={(e) => {
                    e.target.src = "/profile.png";
                    e.target.onerror = null;
                  }}
                />
              )}
              <div className="agent-info">
                <h4>{a.name}</h4>
                <p>{a.email}</p>
                <p>{a.mobile}</p>
              </div>
            </div>
            
            <div className="agent-details-grid">
              <div className="detail-item">
                <strong>Age:</strong>
                <span>{a.age}</span>
              </div>
              <div className="detail-item">
                <strong>Address:</strong>
                <span>{a.address}</span>
              </div>
              <div className="detail-item">
                <strong>Account No:</strong>
                <span>{a.accountNumber}</span>
              </div>
              <div className="detail-item">
                <strong>IFSC:</strong>
                <span>{a.ifsc}</span>
              </div>
            </div>
            
            <div className="document-images">
              {a.aadharFront && (
                <img
                  src={getAgentImageUrl(a, "aadharFront")}
                  alt="Aadhar Front"
                  className="doc-image"
                  onClick={() => openModal(getAgentImageUrl(a, "aadharFront"))}
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                    e.target.onerror = null;
                  }}
                />
              )}
              {a.aadharBack && (
                <img
                  src={getAgentImageUrl(a, "aadharBack")}
                  alt="Aadhar Back"
                  className="doc-image"
                  onClick={() => openModal(getAgentImageUrl(a, "aadharBack"))}
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                    e.target.onerror = null;
                  }}
                />
              )}
              {a.panCard && (
                <img
                  src={getAgentImageUrl(a, "pan")}
                  alt="PAN"
                  className="doc-image"
                  onClick={() => openModal(getAgentImageUrl(a, "pan"))}
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                    e.target.onerror = null;
                  }}
                />
              )}
              {a.savingAccountImage && (
                <img
                  src={getAgentImageUrl(a, "savingImg")}
                  alt="Passbook"
                  className="doc-image"
                  onClick={() => openModal(getAgentImageUrl(a, "savingImg"))}
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                    e.target.onerror = null;
                  }}
                />
              )}
            </div>
            
            <div className="agent-card-actions">
              <button onClick={() => loadAgentData(a._id, "farmer")}>
                Added Farmers
              </button>
              <button onClick={() => loadAgentData(a._id, "dealer")}>
                Added Dealers
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Farmers Section */}
      {viewType === "farmer" && (
        <>
          <h3>Farmers of {selectedAgent?.name}</h3>
          <div className="action-buttons">
            <button
              onClick={() => downloadFarmerExcelWithAllPonds(filteredFarmers)}
              className="download-excel-btn"
              style={{ 
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              📥 Download Farmers Excel (with ALL Ponds)
            </button>
            <input
              placeholder="Search by Farmer ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          {loading ? (
            <div className="loading">Loading farmers data...</div>
          ) : filteredFarmers.length > 0 ? (
            renderFarmerCardWithPonds(filteredFarmers)
          ) : (
            <div className="empty-state">No farmers found.</div>
          )}
        </>
      )}

      {/* Dealers Section */}
      {viewType === "dealer" && (
        <>
          <h3>Dealers of {selectedAgent?.name}</h3>
          <div className="action-buttons">
            <button
              onClick={() => downloadExcel(filteredDealers, "dealers_list")}
              className="download-excel-btn"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}
            >
              📥 Download Dealers Excel
            </button>
            <input
              placeholder="Search by Dealer Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          {loading ? (
            <div className="loading">Loading dealers data...</div>
          ) : filteredDealers.length > 0 ? (
            renderDealerCard(filteredDealers)
          ) : (
            <div className="empty-state">No dealers found.</div>
          )}
        </>
      )}

      {/* Image Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeModal}>×</button>
            <img src={modalImage} alt="preview" className="modal-image" />
          </div>
        </div>
      )}

      {/* Pond Details Modal */}
      {pondDetailsModalOpen && selectedPond && (
        <div className="modal-overlay" onClick={closePondDetailsModal}>
          <div className="pond-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Pond Details: {selectedPond.pondId}
                <button className="close-btn" onClick={closePondDetailsModal}>×</button>
              </h3>
            </div>
            
            <div className="modal-content">
              <div className="pond-details-grid">
                {pondDetailFields.map(({ label, key, isImage, isFileArray }) => {
                  const value = selectedPond[key];
                  
                  if (isImage && key === "pondImage" && value) {
                    const imageUrl = getPondImageUrl(selectedPond);
                    return (
                      <div className="detail-row" key={key}>
                        <strong>{label}:</strong>
                        <div className="clickable-link-container">
                          <img 
                            src={imageUrl}
                            alt="Pond"
                            onClick={() => openModal(imageUrl)}
                            className="clickable-image"
                            style={{ maxWidth: '200px', maxHeight: '150px', cursor: 'pointer' }}
                            onError={(e) => {
                              e.target.src = "/no-image.png";
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                  
                  if (isFileArray && value && value.length > 0) {
                    const urls = key === "pondFiles" 
                      ? selectedPond.pondFilesUrls 
                      : selectedPond.fishFilesUrls;
                    
                    return (
                      <div className="detail-row" key={key}>
                        <strong>{label}:</strong>
                        <div className="file-list">
                          {urls && urls.length > 0 ? (
                            urls.map((fileUrl, idx) => (
                              <div key={idx} className="file-item" style={{ marginBottom: '10px' }}>
                                <img
                                  src={fileUrl}
                                  alt={`${key} ${idx + 1}`}
                                  onClick={() => openModal(fileUrl)}
                                  style={{ 
                                    maxWidth: '100px', 
                                    maxHeight: '100px', 
                                    cursor: 'pointer',
                                    borderRadius: '4px'
                                  }}
                                  onError={(e) => {
                                    e.target.src = "/no-image.png";
                                    e.target.onerror = null;
                                  }}
                                />
                              </div>
                            ))
                          ) : (
                            <span>No files available</span>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="detail-row" key={key}>
                      <strong>{label}:</strong>
                      <span>{value || "N/A"}</span>
                    </div>
                  );
                })}
              </div>

              {/* Pond Files Section */}
              {selectedPond.pondFilesUrls && selectedPond.pondFilesUrls.length > 0 && (
                <div className="file-preview-section">
                  <strong>Pond Files ({selectedPond.pondFilesUrls.length}):</strong>
                  <div className="file-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {selectedPond.pondFilesUrls.map((url, idx) => (
                      <div key={idx} className="file-item">
                        <img 
                          src={url}
                          alt={`Pond File ${idx + 1}`}
                          className="preview-img"
                          style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => openModal(url)}
                          onError={(e) => {
                            e.target.src = "/no-image.png";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fish Files Section */}
              {selectedPond.fishFilesUrls && selectedPond.fishFilesUrls.length > 0 && (
                <div className="file-preview-section">
                  <strong>Fish Files ({selectedPond.fishFilesUrls.length}):</strong>
                  <div className="file-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {selectedPond.fishFilesUrls.map((url, idx) => (
                      <div key={idx} className="file-item">
                        <img 
                          src={url}
                          alt={`Fish File ${idx + 1}`}
                          className="preview-img"
                          style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => openModal(url)}
                          onError={(e) => {
                            e.target.src = "/no-image.png";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={closePondDetailsModal} className="close-modal-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModalOpen && (
        <div className="modal-overlay" onClick={closeHistoryModal}>
          <div className="history-modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              History of {historyTitle}
              <button className="close-btn" onClick={closeHistoryModal}>×</button>
            </h3>
            
            {historyData.length === 0 ? (
              <div className="history-empty-state">
                <h4>No History Found</h4>
                <p>No changes have been recorded for this item yet.</p>
              </div>
            ) : (
              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                      <th>Changed By</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((h, idx) => (
                      <tr key={idx}>
                        <td>{h.field || 'N/A'}</td>
                        <td>{h.oldValue || 'N/A'}</td>
                        <td>{h.newValue || 'N/A'}</td>
                        <td>{h.changedBy || 'System'}</td>
                        <td>{h.createdAt ? new Date(h.createdAt).toLocaleString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;











