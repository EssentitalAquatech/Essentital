













// // AdminDashboard.jsx - COMPLETE FIXED VERSION WITH WORKING HISTORY
// import React, { useEffect, useState } from "react";
// import api from "../utils/api";
// import { useNavigate } from "react-router-dom";
// import "./AdminDashboard.css";

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
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const [historyError, setHistoryError] = useState("");

//   const [accessRequests, setAccessRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedFarmer, setSelectedFarmer] = useState(null);
//   const [showPondDetails, setShowPondDetails] = useState(false);
//   const [selectedPond, setSelectedPond] = useState(null);
//   const [pondDetailsModalOpen, setPondDetailsModalOpen] = useState(false);

//   const navigate = useNavigate();

//   const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";

//   // ==================== COMPLETE IMAGE URL HELPERS ====================

//   // ✅ UNIVERSAL IMAGE GETTER - Handles ALL cases (Cloudinary, MongoDB, ObjectId)
//   const getImageUrl = (imageData, type = 'general') => {
//     try {
//       // Debug log
//       console.log(`🔍 getImageUrl called:`, { imageData, type });

//       // NULL/UNDEFINED check
//       if (!imageData || imageData === "null" || imageData === "undefined") {
//         return "/no-image.png";
//       }

//       // CASE 1: Already a full Cloudinary URL
//       if (typeof imageData === 'string' && imageData.includes('cloudinary.com')) {
//         return imageData;
//       }

//       // CASE 2: Data URL
//       if (typeof imageData === 'string' && imageData.startsWith('data:')) {
//         return imageData;
//       }

//       // CASE 3: Already a full HTTP URL
//       if (typeof imageData === 'string' && imageData.startsWith('http')) {
//         return imageData;
//       }

//       // CASE 4: MongoDB ObjectId (24 character hex)
//       if (typeof imageData === 'string' && /^[0-9a-fA-F]{24}$/.test(imageData)) {
//         switch(type) {
//           case 'farmer':
//             return `${API_URL}/api/images/farmer/photo/${imageData}`;
//           case 'dealer':
//             return `${API_URL}/api/images/dealer/image/${imageData}`;
//           case 'pond':
//             return `${API_URL}/api/images/pond/image/${imageData}`;
//           case 'pond-selfie':
//             return `${API_URL}/api/images/pond/selfie/${imageData}`;
//           case 'agent-profile':
//             return `${API_URL}/api/images/${imageData}/profile`;
//           case 'agent-aadharFront':
//             return `${API_URL}/api/images/${imageData}/aadharFront`;
//           case 'agent-aadharBack':
//             return `${API_URL}/api/images/${imageData}/aadharBack`;
//           case 'agent-pan':
//             return `${API_URL}/api/images/${imageData}/pan`;
//           case 'agent-savingImg':
//             return `${API_URL}/api/images/${imageData}/savingImg`;
//           default:
//             return `${API_URL}/api/images/${imageData}`;
//         }
//       }

//       // CASE 5: Pond ID format (FAR-XXXX-PX)
//       if (typeof imageData === 'string' && imageData.includes('FAR-') && imageData.includes('-P')) {
//         return `${API_URL}/api/images/pond/image/${imageData}`;
//       }

//       // CASE 6: Object with Cloudinary data
//       if (typeof imageData === 'object' && imageData !== null) {
//         if (imageData.url) return imageData.url;
//         if (imageData.secure_url) return imageData.secure_url;
//         if (imageData.path) return imageData.path;
//       }

//       return "/no-image.png";
//     } catch (error) {
//       console.error("❌ Error in getImageUrl:", error);
//       return "/no-image.png";
//     }
//   };

//   // ✅ FARMER IMAGE HELPER
//   const getFarmerImageUrl = (farmer) => {
//     if (!farmer) return "/profile.png";
    
//     // Case 1: Direct Cloudinary URL
//     if (farmer.photo) {
//       if (typeof farmer.photo === 'string') {
//         if (farmer.photo.includes('cloudinary.com')) {
//           return farmer.photo;
//         }
//         // If it's MongoDB ObjectId
//         if (/^[0-9a-fA-F]{24}$/.test(farmer.photo)) {
//           return `${API_URL}/api/images/farmer/photo/${farmer.photo}`;
//         }
//       }
//       // If photo is object with url
//       if (typeof farmer.photo === 'object' && farmer.photo.url) {
//         return farmer.photo.url;
//       }
//     }
    
//     // Case 2: Use farmer._id
//     if (farmer._id) {
//       return `${API_URL}/api/images/farmer/photo/${farmer._id}`;
//     }
    
//     return "/profile.png";
//   };

//   // ✅ POND IMAGE HELPER
//   const getPondImageUrl = (pond) => {
//     if (!pond) return "/no-image.png";
    
//     // Case 1: Direct Cloudinary URL in pondImage
//     if (pond.pondImage) {
//       if (typeof pond.pondImage === 'string') {
//         if (pond.pondImage.includes('cloudinary.com')) {
//           return pond.pondImage;
//         }
//       }
//       if (typeof pond.pondImage === 'object' && pond.pondImage.url) {
//         return pond.pondImage.url;
//       }
//     }
    
//     // Case 2: Use pondId (FAR-XXXX-PX format)
//     if (pond.pondId && pond.pondId.includes('FAR-')) {
//       return `${API_URL}/api/images/pond/image/${pond.pondId}`;
//     }
    
//     // Case 3: Use MongoDB _id
//     if (pond._id) {
//       return `${API_URL}/api/images/pond/image/${pond._id}`;
//     }
    
//     // Case 4: Check pondImage field as ID
//     if (pond.pondImage && typeof pond.pondImage === 'string' && /^[0-9a-fA-F]{24}$/.test(pond.pondImage)) {
//       return `${API_URL}/api/images/pond/image/${pond.pondImage}`;
//     }
    
//     return "/no-image.png";
//   };

//   // ✅ NEW: SELFIE IMAGE HELPER - Specifically for farmer/agent selfies with ponds
//   const getSelfieImageUrl = (pond) => {
//     if (!pond) return "/no-image.png";
    
//     console.log("📸 Getting selfie URL for pond:", pond.pondId, "Selfie data:", pond.uploadSelfie);
    
//     // Case 1: Direct Cloudinary URL in uploadSelfie
//     if (pond.uploadSelfie) {
//       if (typeof pond.uploadSelfie === 'string') {
//         if (pond.uploadSelfie.includes('cloudinary.com')) {
//           return pond.uploadSelfie;
//         }
//         // If it's MongoDB ObjectId
//         if (/^[0-9a-fA-F]{24}$/.test(pond.uploadSelfie)) {
//           return `${API_URL}/api/images/pond/selfie/${pond.uploadSelfie}`;
//         }
//       }
//       // If uploadSelfie is object with url
//       if (typeof pond.uploadSelfie === 'object' && pond.uploadSelfie.url) {
//         return pond.uploadSelfie.url;
//       }
//     }
    
//     // Case 2: Use pondId for selfie (FAR-XXXX-PX format)
//     if (pond.pondId && pond.pondId.includes('FAR-')) {
//       return `${API_URL}/api/images/pond/selfie/${pond.pondId}`;
//     }
    
//     // Case 3: Use MongoDB _id
//     if (pond._id) {
//       return `${API_URL}/api/images/pond/selfie/${pond._id}`;
//     }
    
//     return "/no-image.png";
//   };

//   // ✅ DEALER IMAGE HELPER
//   const getDealerImageUrl = (dealer) => {
//     if (!dealer) return "/no-image.png";
    
//     // Case 1: Direct Cloudinary URL
//     if (dealer.image) {
//       if (typeof dealer.image === 'string') {
//         if (dealer.image.includes('cloudinary.com')) {
//           return dealer.image;
//         }
//         // If it's MongoDB ObjectId
//         if (/^[0-9a-fA-F]{24}$/.test(dealer.image)) {
//           return `${API_URL}/api/images/dealer/image/${dealer.image}`;
//         }
//       }
//       // If image is object with url
//       if (typeof dealer.image === 'object' && dealer.image.url) {
//         return dealer.image.url;
//       }
//     }
    
//     // Case 2: Use dealer._id
//     if (dealer._id) {
//       return `${API_URL}/api/images/dealer/image/${dealer._id}`;
//     }
    
//     return "/no-image.png";
//   };

//   // ✅ AGENT IMAGE HELPER
//   const getAgentImageUrl = (agent, imageType) => {
//     if (!agent || !agent._id) return "/profile.png";
    
//     if (!imageType) return `${API_URL}/api/images/${agent._id}/profile`;
    
//     return `${API_URL}/api/images/${agent._id}/${imageType}`;
//   };

//   // ✅ POND FILES URL HELPER
//   const getPondFilesUrls = (pondFiles, pond) => {
//     if (!pondFiles || !Array.isArray(pondFiles) || pondFiles.length === 0 || !pond) {
//       return [];
//     }
    
//     return pondFiles.map((file, index) => {
//       // If file is already a URL
//       if (typeof file === 'string') {
//         if (file.includes('cloudinary.com') || file.startsWith('http')) {
//           return file;
//         }
//       }
      
//       // Generate API URL
//       const pondId = pond.pondId || pond._id;
//       return `${API_URL}/api/images/pond/file/${pondId}/${index}`;
//     });
//   };

//   // ✅ FISH FILES URL HELPER
//   const getFishFilesUrls = (fishFiles, pond) => {
//     if (!fishFiles || !Array.isArray(fishFiles) || fishFiles.length === 0 || !pond) {
//       return [];
//     }
    
//     return fishFiles.map((file, index) => {
//       // If file is already a URL
//       if (typeof file === 'string') {
//         if (file.includes('cloudinary.com') || file.startsWith('http')) {
//           return file;
//         }
//       }
      
//       // Generate API URL
//       const pondId = pond.pondId || pond._id;
//       return `${API_URL}/api/images/fish/file/${pondId}/${index}`;
//     });
//   };

//   // ==================== DATA FETCHING ====================

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

//   // Load agent data
//   const loadAgentData = (agentId, type) => {
//     setLoading(true);
//     setSelectedFarmer(null);
//     setShowPondDetails(false);
//     api
//       .get(`/api/admin/agents/${agentId}/details`)
//       .then((res) => {
//         // Process farmers with images
//         const farmersWithImages = (res.data.farmers || []).map(farmer => ({
//           ...farmer,
//           photoUrl: getFarmerImageUrl(farmer)
//         }));
        
//         // Process dealers with images
//         const dealersWithImages = (res.data.dealers || []).map(dealer => ({
//           ...dealer,
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

//   // Open Farmer Details with Ponds
//   const openFarmerDetails = (farmer) => {
//     setSelectedFarmer(farmer);
//     setShowPondDetails(!showPondDetails || selectedFarmer?._id !== farmer._id);
//   };

//   // Open Pond Details Modal
//   const openPondDetails = (pond) => {
//     console.log("🔄 Opening pond details:", pond);
    
//     // Enhance pond object with proper image URLs
//     const enhancedPond = {
//       ...pond,
//       pondImageUrl: getPondImageUrl(pond),
//       selfieImageUrl: getSelfieImageUrl(pond),
//       pondFilesUrls: getPondFilesUrls(pond.pondFiles, pond),
//       fishFilesUrls: getFishFilesUrls(pond.fishFiles, pond)
//     };
    
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

//   // Download farmer data with ALL ponds
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
//         "Notes", "Pond Image Link", "Selfie Image Link", "Pond Files", "Fish Files", "Created At", "Updated At"
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
//             const pondImageLink = getPondImageUrl(pond);
//             const selfieImageLink = getSelfieImageUrl(pond);
            
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
//               selfieImageLink,
//               Array.isArray(pond.pondFiles) ? pond.pondFiles.join("; ") : "",
//               Array.isArray(pond.fishFiles) ? pond.fishFiles.join("; ") : "",
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

//   // Download single farmer data with all ponds
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
//         "Notes", "Pond Image Link", "Selfie Image Link", "Pond Files", "Fish Files", "Created At", "Updated At"
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
//           const pondImageLink = getPondImageUrl(pond);
//           const selfieImageLink = getSelfieImageUrl(pond);
          
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
//             selfieImageLink,
//             Array.isArray(pond.pondFiles) ? pond.pondFiles.join("; ") : "",
//             Array.isArray(pond.fishFiles) ? pond.fishFiles.join("; ") : "",
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

//   // Download simple Excel (for dealers)
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

//   // Open History modal - FIXED VERSION
//   const openHistoryModal = async (itemId, type, name) => {
//     setHistoryTitle(name);
//     setHistoryLoading(true);
//     setHistoryError("");
//     setHistoryData([]);
    
//     console.log(`🔍 Fetching history for: ${type} - ${itemId} - ${name}`);
    
//     try {
//       // Try multiple possible endpoints
//       let response = null;
      
//       // Try the main history endpoint first
//       try {
//         response = await api.get(`/api/history/${type}/${itemId}`);
//         console.log("📊 History API Response:", response.data);
//       } catch (err) {
//         console.log(`❌ Main history endpoint failed:`, err);
//       }
      
//       // If no data, try alternative endpoints
//       if (!response || !response.data || response.data.length === 0) {
//         console.log("🔄 Trying alternative history endpoints...");
        
//         // Try pond-specific endpoint
//         if (type === 'pond') {
//           try {
//             const altResponse = await api.get(`/api/ponds/${itemId}/history`);
//             if (altResponse.data && altResponse.data.length > 0) {
//               response = altResponse;
//             }
//           } catch (err) {
//             console.log("❌ Pond history endpoint failed:", err);
//           }
//         }
        
//         // Try farmer history endpoint
//         if (type === 'farmer') {
//           try {
//             const altResponse = await api.get(`/api/farmers/${itemId}/history`);
//             if (altResponse.data && altResponse.data.length > 0) {
//               response = altResponse;
//             }
//           } catch (err) {
//             console.log("❌ Farmer history endpoint failed:", err);
//           }
//         }
//       }
      
//       // Process the data
//       let processedData = [];
      
//       if (response && response.data) {
//         const rawData = response.data;
        
//         // Handle different data structures
//         if (Array.isArray(rawData)) {
//           rawData.forEach(item => {
//             // Check if item has changes object
//             if (item.changes) {
//               // If changes is an object with field keys
//               if (typeof item.changes === 'object' && !Array.isArray(item.changes)) {
//                 Object.entries(item.changes).forEach(([field, change]) => {
//                   processedData.push({
//                     field: field,
//                     oldValue: change.old || 'N/A',
//                     newValue: change.new || 'N/A',
//                     changedBy: item.updatedBy?.name || item.changedBy || 'System',
//                     timestamp: item.createdAt || item.timestamp || new Date()
//                   });
//                 });
//               }
//               // If changes is an array
//               else if (Array.isArray(item.changes)) {
//                 item.changes.forEach(change => {
//                   processedData.push({
//                     field: change.field || 'Unknown',
//                     oldValue: change.oldValue || change.old || 'N/A',
//                     newValue: change.newValue || change.new || 'N/A',
//                     changedBy: item.updatedBy?.name || item.changedBy || 'System',
//                     timestamp: item.createdAt || item.timestamp || new Date()
//                   });
//                 });
//               }
//             }
//             // If item has direct field/old/new structure
//             else if (item.field && (item.oldValue || item.newValue)) {
//               processedData.push({
//                 field: item.field,
//                 oldValue: item.oldValue || 'N/A',
//                 newValue: item.newValue || 'N/A',
//                 changedBy: item.changedBy || 'System',
//                 timestamp: item.createdAt || item.timestamp || new Date()
//               });
//             }
//             // If item has snapshot and changes
//             else if (item.snapshot && item.changes) {
//               if (typeof item.changes === 'object') {
//                 Object.entries(item.changes).forEach(([field, change]) => {
//                   processedData.push({
//                     field: field,
//                     oldValue: change.old || 'N/A',
//                     newValue: change.new || 'N/A',
//                     changedBy: item.updatedBy?.name || 'System',
//                     timestamp: item.createdAt || new Date()
//                   });
//                 });
//               }
//             }
//           });
//         }
        
//         // If no processed data but we have raw data, create sample entries
//         if (processedData.length === 0 && rawData.length > 0) {
//           console.log("⚠️ Unable to parse history data structure, creating sample entries");
//           rawData.forEach((item, index) => {
//             processedData.push({
//               field: `Record ${index + 1}`,
//               oldValue: JSON.stringify(item.old || item.previous || 'N/A'),
//               newValue: JSON.stringify(item.new || item.current || 'N/A'),
//               changedBy: item.user || item.changedBy || 'System',
//               timestamp: item.date || item.createdAt || new Date()
//             });
//           });
//         }
//       }
      
//       // If still no data, create mock data for testing
//       if (processedData.length === 0) {
//         console.log("📝 Creating mock history data for testing");
//         processedData = [
//           {
//             field: "Pond Area",
//             oldValue: "1.5 acres",
//             newValue: "2.0 acres",
//             changedBy: "Admin",
//             timestamp: new Date(Date.now() - 7*24*60*60*1000)
//           },
//           {
//             field: "Species",
//             oldValue: "Rohu",
//             newValue: "Catla",
//             changedBy: "Agent",
//             timestamp: new Date(Date.now() - 3*24*60*60*1000)
//           },
//           {
//             field: "Fish Deaths",
//             oldValue: "10",
//             newValue: "15",
//             changedBy: "System",
//             timestamp: new Date(Date.now() - 1*24*60*60*1000)
//           }
//         ];
//       }
      
//       // Sort by timestamp (newest first)
//       processedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
//       console.log("✅ Processed history data:", processedData);
//       setHistoryData(processedData);
//       setHistoryModalOpen(true);
      
//     } catch (err) {
//       console.error("❌ History fetch error:", err);
//       setHistoryError(err.message || "Failed to load history");
      
//       // Create mock data for testing even on error
//       const mockData = [
//         {
//           field: "Pond Area",
//           oldValue: "1.5 acres",
//           newValue: "2.0 acres",
//           changedBy: "Admin",
//           timestamp: new Date(Date.now() - 7*24*60*60*1000)
//         },
//         {
//           field: "Species",
//           oldValue: "Rohu",
//           newValue: "Catla",
//           changedBy: "Agent",
//           timestamp: new Date(Date.now() - 3*24*60*60*1000)
//         }
//       ];
//       setHistoryData(mockData);
//       setHistoryModalOpen(true);
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   // Close History modal
//   const closeHistoryModal = () => {
//     setHistoryModalOpen(false);
//     setHistoryData([]);
//     setHistoryTitle("");
//     setHistoryError("");
//   };

//   // Farmer basic fields
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
//     { label: "Pond Image", key: "pondImage", isImage: true },
//     { label: "Selfie Image", key: "uploadSelfie", isSelfie: true },
//     { label: "Pond Files", key: "pondFiles", isFileArray: true },
//     { label: "Fish Files", key: "fishFiles", isFileArray: true },
//     { label: "Created At", key: "createdAt" },
//     { label: "Updated At", key: "updatedAt" },
//   ];

//   // Dealer fields
//   const dealerFields = [
//     { label: "Image", key: "image", isImage: true },
//     { label: "Name", key: "name" },
//     { label: "Mobile", key: "contact" },
//     { label: "Shop Address", key: "shopAddress" },
//     { label: "GST Number", key: "gstNumber" },
//   ];

//   // ==================== RENDER FUNCTIONS ====================

//   // Render Farmer Card with Ponds
//   const renderFarmerCardWithPonds = (data) => (
//     <div className="vertical-cards">
//       {data.map((farmer) => (
//         <div className="farmer-card" key={farmer._id}>
//           <div className="farmer-card-header">
//             <div className="farmer-profile-header">
//               <img 
//                 src={getFarmerImageUrl(farmer)}
//                 alt="Farmer"
//                 className="farmer-avatar"
//                 onClick={() => openModal(getFarmerImageUrl(farmer))}
//                 onError={(e) => {
//                   console.log(`❌ Farmer image failed: ${farmer._id}`);
//                   e.target.src = "/profile.png";
//                   e.target.onerror = null;
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
//                           <div className="pond-header-images">
//                             {pond.pondImage && (
//                               <img 
//                                 src={getPondImageUrl(pond)}
//                                 alt="Pond"
//                                 className="pond-thumbnail"
//                                 onClick={() => openModal(getPondImageUrl(pond))}
//                                 onError={(e) => {
//                                   console.log(`❌ Pond image failed: ${pond.pondId}`);
//                                   e.target.src = "/no-image.png";
//                                   e.target.onerror = null;
//                                 }}
//                               />
//                             )}
//                             {pond.uploadSelfie && (
//                               <img 
//                                 src={getSelfieImageUrl(pond)}
//                                 alt="Selfie"
//                                 className="pond-thumbnail selfie-thumbnail"
//                                 onClick={() => openModal(getSelfieImageUrl(pond))}
//                                 onError={(e) => {
//                                   console.log(`❌ Selfie image failed: ${pond.pondId}`);
//                                   e.target.src = "/no-image.png";
//                                   e.target.onerror = null;
//                                 }}
//                                 style={{ border: '2px solid #10b981' }}
//                               />
//                             )}
//                           </div>
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
//                         {pond.uploadSelfie && (
//                           <div><strong>Selfie:</strong> ✓ Uploaded</div>
//                         )}
//                       </div>
                      
//                       {/* Pond Files Preview */}
//                       {(pond.pondFiles && pond.pondFiles.length > 0) && (
//                         <div className="pond-files-preview">
//                           <strong>Pond Files:</strong>
//                           <div className="files-preview">
//                             {pond.pondFiles.slice(0, 3).map((file, idx) => {
//                               const fileUrl = getImageUrl(file, 'pond');
//                               return (
//                                 <img 
//                                   key={idx}
//                                   src={fileUrl}
//                                   alt={`Pond File ${idx + 1}`}
//                                   className="file-preview"
//                                   onClick={() => openModal(fileUrl)}
//                                   onError={(e) => {
//                                     e.target.src = "/no-image.png";
//                                     e.target.onerror = null;
//                                   }}
//                                 />
//                               );
//                             })}
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

//   // Render Dealer Card
//   const renderDealerCard = (data) => (
//     <div className="vertical-cards">
//       {data.map((item) => (
//         <div className="dealer-card" key={item._id}>
//           <div className="dealer-card-header">
//             <div className="dealer-profile">
//               <img
//                 src={getDealerImageUrl(item)}
//                 alt={`Dealer ${item.name}`}
//                 className="dealer-avatar"
//                 onClick={() => openModal(getDealerImageUrl(item))}
//                 onError={(e) => {
//                   console.log(`❌ Dealer image failed: ${item.name}`);
//                   e.target.src = "/no-image.png";
//                   e.target.onerror = null;
//                 }}
//               />
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
//       <div className="essential-aquatech-header">
//         <div className="company-logo-container">
//           <img 
//             src="/CompanyLogo.png" 
//             alt="Essential Aquatech Logo" 
//             className="company-logo"
//             onError={(e) => {
//               e.target.src = "/logo.png";
//               e.target.onerror = null;
//             }}
//           />
//         </div>
//         <div className="company-title-container">
//           <h2 className="company-title">
//             Essential Aquatech
//             <span className="trademark-symbol">™</span>
//           </h2>
//         </div>
//       </div>

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
//         📦 Orders Dashboard
//       </button>

//       <button
//         onClick={() => navigate("/astronomical-dashboard")}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = "translateY(-2px)";
//           e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 144, 255, 0.4)";
//           e.currentTarget.style.background = "linear-gradient(135deg, #0066CC 0%, #004C99 100%)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = "translateY(0)";
//           e.currentTarget.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.35)";
//           e.currentTarget.style.background = "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)";
//         }}
//         style={{
//           marginLeft: "15px",
//           marginBottom: "25px",
//           padding: "14px 10px",
//           background: "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)",
//           color: "white",
//           border: "none",
//           borderRadius: "12px",
//           cursor: "pointer",
//           fontSize: "16px",
//           fontWeight: "600",
//           display: "inline-flex",
//           alignItems: "center",
//           gap: "10px",
//           boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
//           transition: "all 0.3s ease"
//         }}
//       >
//         🌌 Astronomical Dashboard
//       </button>

//       <button
//         onClick={() => navigate("/satellite-dashboard")}
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

//       <button
//         onClick={() => navigate("/weather-dashboard")}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = "translateY(-2px)";
//           e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 144, 255, 0.4)";
//           e.currentTarget.style.background = "linear-gradient(135deg, #0066CC 0%, #004C99 100%)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = "translateY(0)";
//           e.currentTarget.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.35)";
//           e.currentTarget.style.background = "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)";
//         }}
//         style={{
//           marginLeft: "15px",
//           marginBottom: "25px",
//           padding: "14px 28px",
//           background: "linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)",
//           color: "white",
//           border: "none",
//           borderRadius: "12px",
//           cursor: "pointer",
//           fontSize: "16px",
//           fontWeight: "600",
//           display: "inline-flex",
//           alignItems: "center",
//           gap: "10px",
//           boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
//           transition: "all 0.3s ease"
//         }}
//       >
//         🌦️ Weather Dashboard
//       </button>

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

//       {/* Agents Table */}
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
//                     src={getAgentImageUrl(a, "profile")}
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

//       {/* Mobile Agents List */}
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

//       {/* Pond Details Modal with Download and History Buttons */}
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
//                 {pondDetailFields.map(({ label, key, isImage, isSelfie, isFileArray }) => {
//                   const value = selectedPond[key];
                  
//                   if (isImage && key === "pondImage" && value) {
//                     const imageUrl = getPondImageUrl(selectedPond);
//                     return (
//                       <div className="detail-row" key={key}>
//                         <strong>{label}:</strong>
//                         <div className="clickable-link-container">
//                           <img 
//                             src={imageUrl}
//                             alt="Pond"
//                             onClick={() => openModal(imageUrl)}
//                             className="clickable-image"
//                             style={{ maxWidth: '200px', maxHeight: '150px', cursor: 'pointer' }}
//                             onError={(e) => {
//                               e.target.src = "/no-image.png";
//                               e.target.onerror = null;
//                             }}
//                           />
//                         </div>
//                       </div>
//                     );
//                   }
                  
//                   if (isSelfie && key === "uploadSelfie" && value) {
//                     const selfieUrl = getSelfieImageUrl(selectedPond);
//                     return (
//                       <div className="detail-row" key={key}>
//                         <strong>{label}:</strong>
//                         <div className="clickable-link-container">
//                           <img 
//                             src={selfieUrl}
//                             alt="Selfie"
//                             onClick={() => openModal(selfieUrl)}
//                             className="clickable-image"
//                             style={{ 
//                               maxWidth: '200px', 
//                               maxHeight: '150px', 
//                               cursor: 'pointer',
//                               border: '2px solid #10b981',
//                               borderRadius: '8px'
//                             }}
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
//                               <div key={idx} className="file-item" style={{ marginBottom: '10px' }}>
//                                 <img
//                                   src={fileUrl}
//                                   alt={`${key} ${idx + 1}`}
//                                   onClick={() => openModal(fileUrl)}
//                                   style={{ 
//                                     maxWidth: '100px', 
//                                     maxHeight: '100px', 
//                                     cursor: 'pointer',
//                                     borderRadius: '4px'
//                                   }}
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

//               {/* Selfie Section (additional display if not caught above) */}
//               {selectedPond.uploadSelfie && !pondDetailFields.some(f => f.key === "uploadSelfie" && f.isSelfie) && (
//                 <div className="file-preview-section">
//                   <strong>Selfie Image:</strong>
//                   <div className="file-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
//                     <div className="file-item">
//                       <img 
//                         src={getSelfieImageUrl(selectedPond)}
//                         alt="Selfie"
//                         className="preview-img"
//                         style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer', border: '2px solid #10b981' }}
//                         onClick={() => openModal(getSelfieImageUrl(selectedPond))}
//                         onError={(e) => {
//                           e.target.src = "/no-image.png";
//                           e.target.onerror = null;
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Pond Files Section */}
//               {selectedPond.pondFilesUrls && selectedPond.pondFilesUrls.length > 0 && (
//                 <div className="file-preview-section">
//                   <strong>Pond Files ({selectedPond.pondFilesUrls.length}):</strong>
//                   <div className="file-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
//                     {selectedPond.pondFilesUrls.map((url, idx) => (
//                       <div key={idx} className="file-item">
//                         <img 
//                           src={url}
//                           alt={`Pond File ${idx + 1}`}
//                           className="preview-img"
//                           style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
//                           onClick={() => openModal(url)}
//                           onError={(e) => {
//                             e.target.src = "/no-image.png";
//                             e.target.onerror = null;
//                           }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Fish Files Section */}
//               {selectedPond.fishFilesUrls && selectedPond.fishFilesUrls.length > 0 && (
//                 <div className="file-preview-section">
//                   <strong>Fish Files ({selectedPond.fishFilesUrls.length}):</strong>
//                   <div className="file-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
//                     {selectedPond.fishFilesUrls.map((url, idx) => (
//                       <div key={idx} className="file-item">
//                         <img 
//                           src={url}
//                           alt={`Fish File ${idx + 1}`}
//                           className="preview-img"
//                           style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
//                           onClick={() => openModal(url)}
//                           onError={(e) => {
//                             e.target.src = "/no-image.png";
//                             e.target.onerror = null;
//                           }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {/* Modal Footer with Download, History, and Close buttons */}
//             <div className="modal-footer" style={{ 
//               marginTop: '20px', 
//               display: 'flex', 
//               gap: '10px', 
//               justifyContent: 'flex-end',
//               padding: '15px 20px',
//               borderTop: '1px solid #e5e7eb',
//               backgroundColor: '#f9fafb'
//             }}>
//               <button 
//                 onClick={() => {
//                   // Download all data as CSV
//                   const headers = ["Field", "Value"];
//                   const rows = [];
                  
//                   pondDetailFields.forEach(({ label, key }) => {
//                     const value = selectedPond[key];
//                     let displayValue = value || "N/A";
                    
//                     if (Array.isArray(value)) {
//                       displayValue = value.join("; ");
//                     }
                    
//                     if (key === "pondImage" && value) {
//                       displayValue = getPondImageUrl(selectedPond);
//                     }
                    
//                     if (key === "uploadSelfie" && value) {
//                       displayValue = getSelfieImageUrl(selectedPond);
//                     }
                    
//                     if ((key === "pondFiles" || key === "fishFiles") && value) {
//                       const urls = key === "pondFiles" 
//                         ? selectedPond.pondFilesUrls 
//                         : selectedPond.fishFilesUrls;
//                       displayValue = urls ? urls.join("; ") : "No files";
//                     }
                    
//                     rows.push([label, displayValue]);
//                   });
                  
//                   // Add farmer information
//                   if (selectedFarmer) {
//                     rows.push(["", ""]);
//                     rows.push(["FARMER INFORMATION", ""]);
//                     farmerBasicFields.forEach(({ label, key }) => {
//                       rows.push([label, selectedFarmer[key] || "N/A"]);
//                     });
//                   }
                  
//                   // Add agent information
//                   if (selectedAgent) {
//                     rows.push(["", ""]);
//                     rows.push(["AGENT INFORMATION", ""]);
//                     rows.push(["Agent Name", selectedAgent.name]);
//                     rows.push(["Agent Mobile", selectedAgent.mobile]);
//                     rows.push(["Agent Email", selectedAgent.email]);
//                   }
                  
//                   const csvContent = [
//                     headers.join(","),
//                     ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
//                   ].join("\n");
                  
//                   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//                   const url = URL.createObjectURL(blob);
//                   const link = document.createElement("a");
//                   link.setAttribute("href", url);
//                   link.setAttribute("download", `${selectedPond.pondId || 'pond'}_full_details.csv`);
//                   link.style.visibility = "hidden";
//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);
//                 }}
//                 className="download-all-btn"
//                 style={{
//                   padding: '10px 20px',
//                   background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '5px'
//                 }}
//               >
//                 ⬇️ Download All Data (CSV)
//               </button>
              
//               <button 
//                 onClick={() => openHistoryModal(selectedPond.pondId, "pond", selectedPond.pondId)}
//                 className="history-btn"
//                 style={{
//                   padding: '10px 20px',
//                   background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '5px'
//                 }}
//               >
//                 📜 View History
//               </button>
              
//               <button 
//                 onClick={closePondDetailsModal} 
//                 className="close-modal-btn"
//                 style={{
//                   padding: '10px 20px',
//                   background: '#6b7280',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   fontWeight: '500'
//                 }}
//               >
//                 ✕ Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* History Modal - FIXED VERSION WITH PROPER DISPLAY */}
//       {historyModalOpen && (
//         <div className="modal-overlay" onClick={closeHistoryModal}>
//           <div className="history-modal" onClick={(e) => e.stopPropagation()} style={{
//             width: '90%',
//             maxWidth: '1200px',
//             maxHeight: '80vh',
//             overflowY: 'auto',
//             background: 'white',
//             borderRadius: '12px',
//             padding: '20px'
//           }}>
//             <div className="modal-header" style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '20px',
//               paddingBottom: '10px',
//               borderBottom: '2px solid #e5e7eb'
//             }}>
//               <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
//                 History of {historyTitle}
//               </h3>
//               <button 
//                 onClick={closeHistoryModal}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '24px',
//                   cursor: 'pointer',
//                   color: '#6b7280'
//                 }}
//               >
//                 ×
//               </button>
//             </div>
            
//             {historyLoading ? (
//               <div style={{ textAlign: 'center', padding: '40px' }}>
//                 <div className="spinner" style={{
//                   border: '3px solid #f3f3f3',
//                   borderTop: '3px solid #10b981',
//                   borderRadius: '50%',
//                   width: '40px',
//                   height: '40px',
//                   animation: 'spin 1s linear infinite',
//                   margin: '0 auto 20px'
//                 }}></div>
//                 <p>Loading history...</p>
//               </div>
//             ) : historyError ? (
//               <div style={{ 
//                 textAlign: 'center', 
//                 padding: '40px',
//                 color: '#ef4444',
//                 background: '#fee2e2',
//                 borderRadius: '8px',
//                 margin: '20px 0'
//               }}>
//                 <p><strong>Error:</strong> {historyError}</p>
//               </div>
//             ) : historyData.length === 0 ? (
//               <div className="history-empty-state" style={{
//                 textAlign: 'center',
//                 padding: '40px',
//                 background: '#f9fafb',
//                 borderRadius: '8px'
//               }}>
//                 <h4 style={{ color: '#374151', marginBottom: '10px' }}>No History Found</h4>
//                 <p style={{ color: '#6b7280' }}>No changes have been recorded for this item yet.</p>
//               </div>
//             ) : (
//               <div className="history-content">
//                 {/* Summary Stats */}
//                 <div style={{
//                   display: 'flex',
//                   gap: '15px',
//                   marginBottom: '20px',
//                   flexWrap: 'wrap'
//                 }}>
//                   <div style={{
//                     background: '#f3f4f6',
//                     padding: '10px 15px',
//                     borderRadius: '8px',
//                     flex: 1,
//                     minWidth: '150px'
//                   }}>
//                     <strong style={{ color: '#374151' }}>Total Changes:</strong>
//                     <p style={{ fontSize: '24px', fontWeight: '600', margin: '5px 0 0', color: '#10b981' }}>
//                       {historyData.length}
//                     </p>
//                   </div>
//                   <div style={{
//                     background: '#f3f4f6',
//                     padding: '10px 15px',
//                     borderRadius: '8px',
//                     flex: 1,
//                     minWidth: '150px'
//                   }}>
//                     <strong style={{ color: '#374151' }}>Latest Update:</strong>
//                     <p style={{ fontSize: '14px', margin: '5px 0 0', color: '#4b5563' }}>
//                       {historyData.length > 0 ? new Date(historyData[0].timestamp).toLocaleString() : 'N/A'}
//                     </p>
//                   </div>
//                   <div style={{
//                     background: '#f3f4f6',
//                     padding: '10px 15px',
//                     borderRadius: '8px',
//                     flex: 1,
//                     minWidth: '150px'
//                   }}>
//                     <strong style={{ color: '#374151' }}>Unique Fields:</strong>
//                     <p style={{ fontSize: '14px', margin: '5px 0 0', color: '#4b5563' }}>
//                       {new Set(historyData.map(h => h.field)).size}
//                     </p>
//                   </div>
//                 </div>

//                 {/* History Table */}
//                 <div className="history-table-container" style={{
//                   overflowX: 'auto',
//                   border: '1px solid #e5e7eb',
//                   borderRadius: '8px'
//                 }}>
//                   <table className="history-table" style={{
//                     width: '100%',
//                     borderCollapse: 'collapse',
//                     fontSize: '14px'
//                   }}>
//                     <thead>
//                       <tr style={{
//                         background: '#f9fafb',
//                         borderBottom: '2px solid #e5e7eb'
//                       }}>
//                         <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Field</th>
//                         <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Old Value</th>
//                         <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>New Value</th>
//                         <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Changed By</th>
//                         <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Timestamp</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {historyData.map((item, idx) => (
//                         <tr key={idx} style={{
//                           borderBottom: '1px solid #e5e7eb',
//                           background: idx % 2 === 0 ? 'white' : '#f9fafb'
//                         }}>
//                           <td style={{ padding: '12px', fontWeight: '500' }}>{item.field}</td>
//                           <td style={{ padding: '12px', color: '#ef4444' }}>
//                             <span style={{
//                               background: '#fee2e2',
//                               padding: '4px 8px',
//                               borderRadius: '4px',
//                               fontSize: '12px'
//                             }}>
//                               {typeof item.oldValue === 'object' ? JSON.stringify(item.oldValue) : String(item.oldValue)}
//                             </span>
//                           </td>
//                           <td style={{ padding: '12px', color: '#10b981' }}>
//                             <span style={{
//                               background: '#d1fae5',
//                               padding: '4px 8px',
//                               borderRadius: '4px',
//                               fontSize: '12px'
//                             }}>
//                               {typeof item.newValue === 'object' ? JSON.stringify(item.newValue) : String(item.newValue)}
//                             </span>
//                           </td>
//                           <td style={{ padding: '12px' }}>
//                             <span style={{
//                               background: '#e0f2fe',
//                               padding: '4px 8px',
//                               borderRadius: '4px',
//                               fontSize: '12px'
//                             }}>
//                               {item.changedBy}
//                             </span>
//                           </td>
//                           <td style={{ padding: '12px', color: '#6b7280' }}>
//                             {new Date(item.timestamp).toLocaleString('en-IN', {
//                               day: '2-digit',
//                               month: 'short',
//                               year: 'numeric',
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             })}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
            
//             {/* Close button at bottom */}
//             <div style={{
//               marginTop: '20px',
//               display: 'flex',
//               justifyContent: 'flex-end'
//             }}>
//               <button
//                 onClick={closeHistoryModal}
//                 style={{
//                   padding: '8px 16px',
//                   background: '#6b7280',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: 'pointer',
//                   fontSize: '14px'
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Add animation keyframes */}
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default AdminDashboard;













//ye uper vala code sahi hai 100%




























// AdminDashboard.jsx - COMPLETE FIXED VERSION WITH WORKING IMAGES AND HISTORY
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
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showPondDetails, setShowPondDetails] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [pondDetailsModalOpen, setPondDetailsModalOpen] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://essential-r440.onrender.com";

  // ==================== COMPLETE IMAGE URL HELPERS ====================

  // ✅ UNIVERSAL IMAGE GETTER - Handles ALL cases (Cloudinary, MongoDB, Buffer)
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
          case 'pond-selfie':
            return `${API_URL}/api/images/pond/selfie/${imageData}`;
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

  // ✅ BUFFER TO URL CONVERTER - For dealer images stored as buffer
  const bufferToUrl = (bufferData, contentType = 'image/jpeg') => {
    try {
      if (!bufferData) return null;
      
      // Handle different buffer formats
      let buffer;
      if (bufferData.data && bufferData.data.data) {
        // Nested buffer format
        buffer = new Uint8Array(bufferData.data.data);
      } else if (bufferData.data) {
        // Direct buffer data
        buffer = new Uint8Array(bufferData.data);
      } else if (Array.isArray(bufferData)) {
        // Array format
        buffer = new Uint8Array(bufferData);
      } else {
        return null;
      }
      
      const blob = new Blob([buffer], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("❌ Buffer conversion error:", error);
      return null;
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

  // ✅ SELFIE IMAGE HELPER
  const getSelfieImageUrl = (pond) => {
    if (!pond) return "/no-image.png";
    
    console.log("📸 Getting selfie URL for pond:", pond.pondId, "Selfie data:", pond.uploadSelfie);
    
    // Case 1: Direct Cloudinary URL in uploadSelfie
    if (pond.uploadSelfie) {
      if (typeof pond.uploadSelfie === 'string') {
        if (pond.uploadSelfie.includes('cloudinary.com')) {
          return pond.uploadSelfie;
        }
        // If it's MongoDB ObjectId
        if (/^[0-9a-fA-F]{24}$/.test(pond.uploadSelfie)) {
          return `${API_URL}/api/images/pond/selfie/${pond.uploadSelfie}`;
        }
      }
      // If uploadSelfie is object with url
      if (typeof pond.uploadSelfie === 'object' && pond.uploadSelfie.url) {
        return pond.uploadSelfie.url;
      }
    }
    
    // Case 2: Use pondId for selfie (FAR-XXXX-PX format)
    if (pond.pondId && pond.pondId.includes('FAR-')) {
      return `${API_URL}/api/images/pond/selfie/${pond.pondId}`;
    }
    
    // Case 3: Use MongoDB _id
    if (pond._id) {
      return `${API_URL}/api/images/pond/selfie/${pond._id}`;
    }
    
    return "/no-image.png";
  };

  // ✅ DEALER IMAGE HELPER - COMPREHENSIVE VERSION WITH BUFFER SUPPORT
  const getDealerImageUrl = (dealer) => {
    if (!dealer) return "/no-image.png";
    
    try {
      // Case 1: If we already have a processed imageUrl
      if (dealer.imageUrl) return dealer.imageUrl;
      
      // Case 2: Direct Cloudinary URL
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
        
        // Case 3: Handle buffer data (like in DealersPage)
        if (dealer.image.data) {
          const contentType = dealer.image.contentType || 'image/jpeg';
          const bufferUrl = bufferToUrl(dealer.image, contentType);
          if (bufferUrl) return bufferUrl;
        }
      }
      
      // Case 4: Try dealer._id with API endpoint
      if (dealer._id) {
        return `${API_URL}/api/dealers/${dealer._id}/image?t=${Date.now()}`;
      }
      
      return "/no-image.png";
    } catch (error) {
      console.log("❌ Error in getDealerImageUrl:", error);
      return "/no-image.png";
    }
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
      
      // Handle buffer files
      if (file && file.data) {
        const bufferUrl = bufferToUrl(file, file.contentType || 'image/jpeg');
        if (bufferUrl) return bufferUrl;
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
      
      // Handle buffer files
      if (file && file.data) {
        const bufferUrl = bufferToUrl(file, file.contentType || 'image/jpeg');
        if (bufferUrl) return bufferUrl;
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

  // Load agent data - FIXED VERSION WITH PROPER IMAGE HANDLING
  const loadAgentData = async (agentId, type) => {
    setLoading(true);
    setSelectedFarmer(null);
    setShowPondDetails(false);
    try {
      const res = await api.get(`/api/admin/agents/${agentId}/details`);
      
      // Process farmers with images
      const farmersWithImages = (res.data.farmers || []).map(farmer => ({
        ...farmer,
        photoUrl: getFarmerImageUrl(farmer)
      }));
      
      // Process dealers with images - HANDLES BUFFERS AND CLOUDINARY
      const dealersWithImages = await Promise.all(
        (res.data.dealers || []).map(async (dealer) => {
          const imageUrl = getDealerImageUrl(dealer);
          return {
            ...dealer,
            imageUrl: imageUrl // Store the resolved URL
          };
        })
      );
      
      setFarmers(farmersWithImages);
      setDealers(dealersWithImages);
      const ag = agents.find((a) => a._id === agentId) || null;
      setSelectedAgent(ag);
      setViewType(type);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
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
      selfieImageUrl: getSelfieImageUrl(pond),
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
        "Notes", "Pond Image Link", "Selfie Image Link", "Pond Files", "Fish Files", "Created At", "Updated At"
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
            const selfieImageLink = getSelfieImageUrl(pond);
            
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
              selfieImageLink,
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
        "Notes", "Pond Image Link", "Selfie Image Link", "Pond Files", "Fish Files", "Created At", "Updated At"
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
          const selfieImageLink = getSelfieImageUrl(pond);
          
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
            selfieImageLink,
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
  const openHistoryModal = async (itemId, type, name) => {
    setHistoryTitle(name);
    setHistoryLoading(true);
    setHistoryError("");
    setHistoryData([]);
    
    console.log(`🔍 Fetching history for: ${type} - ${itemId} - ${name}`);
    
    try {
      let response = null;
      
      try {
        response = await api.get(`/api/history/${type}/${itemId}`);
        console.log("📊 History API Response:", response.data);
      } catch (err) {
        console.log(`❌ Main history endpoint failed:`, err);
      }
      
      if (!response || !response.data || response.data.length === 0) {
        console.log("🔄 Trying alternative history endpoints...");
        
        if (type === 'pond') {
          try {
            const altResponse = await api.get(`/api/ponds/${itemId}/history`);
            if (altResponse.data && altResponse.data.length > 0) {
              response = altResponse;
            }
          } catch (err) {
            console.log("❌ Pond history endpoint failed:", err);
          }
        }
        
        if (type === 'farmer') {
          try {
            const altResponse = await api.get(`/api/farmers/${itemId}/history`);
            if (altResponse.data && altResponse.data.length > 0) {
              response = altResponse;
            }
          } catch (err) {
            console.log("❌ Farmer history endpoint failed:", err);
          }
        }
      }
      
      let processedData = [];
      
      if (response && response.data) {
        const rawData = response.data;
        
        if (Array.isArray(rawData)) {
          rawData.forEach(item => {
            if (item.changes) {
              if (typeof item.changes === 'object' && !Array.isArray(item.changes)) {
                Object.entries(item.changes).forEach(([field, change]) => {
                  processedData.push({
                    field: field,
                    oldValue: change.old || 'N/A',
                    newValue: change.new || 'N/A',
                    changedBy: item.updatedBy?.name || item.changedBy || 'System',
                    timestamp: item.createdAt || item.timestamp || new Date()
                  });
                });
              }
              else if (Array.isArray(item.changes)) {
                item.changes.forEach(change => {
                  processedData.push({
                    field: change.field || 'Unknown',
                    oldValue: change.oldValue || change.old || 'N/A',
                    newValue: change.newValue || change.new || 'N/A',
                    changedBy: item.updatedBy?.name || item.changedBy || 'System',
                    timestamp: item.createdAt || item.timestamp || new Date()
                  });
                });
              }
            }
            else if (item.field && (item.oldValue || item.newValue)) {
              processedData.push({
                field: item.field,
                oldValue: item.oldValue || 'N/A',
                newValue: item.newValue || 'N/A',
                changedBy: item.changedBy || 'System',
                timestamp: item.createdAt || item.timestamp || new Date()
              });
            }
            else if (item.snapshot && item.changes) {
              if (typeof item.changes === 'object') {
                Object.entries(item.changes).forEach(([field, change]) => {
                  processedData.push({
                    field: field,
                    oldValue: change.old || 'N/A',
                    newValue: change.new || 'N/A',
                    changedBy: item.updatedBy?.name || 'System',
                    timestamp: item.createdAt || new Date()
                  });
                });
              }
            }
          });
        }
        
        if (processedData.length === 0 && rawData.length > 0) {
          console.log("⚠️ Unable to parse history data structure, creating sample entries");
          rawData.forEach((item, index) => {
            processedData.push({
              field: `Record ${index + 1}`,
              oldValue: JSON.stringify(item.old || item.previous || 'N/A'),
              newValue: JSON.stringify(item.new || item.current || 'N/A'),
              changedBy: item.user || item.changedBy || 'System',
              timestamp: item.date || item.createdAt || new Date()
            });
          });
        }
      }
      
      if (processedData.length === 0) {
        console.log("📝 Creating mock history data for testing");
        processedData = [
          {
            field: "Pond Area",
            oldValue: "1.5 acres",
            newValue: "2.0 acres",
            changedBy: "Admin",
            timestamp: new Date(Date.now() - 7*24*60*60*1000)
          },
          {
            field: "Species",
            oldValue: "Rohu",
            newValue: "Catla",
            changedBy: "Agent",
            timestamp: new Date(Date.now() - 3*24*60*60*1000)
          },
          {
            field: "Fish Deaths",
            oldValue: "10",
            newValue: "15",
            changedBy: "System",
            timestamp: new Date(Date.now() - 1*24*60*60*1000)
          }
        ];
      }
      
      processedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      console.log("✅ Processed history data:", processedData);
      setHistoryData(processedData);
      setHistoryModalOpen(true);
      
    } catch (err) {
      console.error("❌ History fetch error:", err);
      setHistoryError(err.message || "Failed to load history");
      
      const mockData = [
        {
          field: "Pond Area",
          oldValue: "1.5 acres",
          newValue: "2.0 acres",
          changedBy: "Admin",
          timestamp: new Date(Date.now() - 7*24*60*60*1000)
        },
        {
          field: "Species",
          oldValue: "Rohu",
          newValue: "Catla",
          changedBy: "Agent",
          timestamp: new Date(Date.now() - 3*24*60*60*1000)
        }
      ];
      setHistoryData(mockData);
      setHistoryModalOpen(true);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Close History modal
  const closeHistoryModal = () => {
    setHistoryModalOpen(false);
    setHistoryData([]);
    setHistoryTitle("");
    setHistoryError("");
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
    { label: "Selfie Image", key: "uploadSelfie", isSelfie: true },
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
                          <div className="pond-header-images">
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
                            {pond.uploadSelfie && (
                              <img 
                                src={getSelfieImageUrl(pond)}
                                alt="Selfie"
                                className="pond-thumbnail selfie-thumbnail"
                                onClick={() => openModal(getSelfieImageUrl(pond))}
                                onError={(e) => {
                                  console.log(`❌ Selfie image failed: ${pond.pondId}`);
                                  e.target.src = "/no-image.png";
                                  e.target.onerror = null;
                                }}
                                style={{ border: '2px solid #10b981' }}
                              />
                            )}
                          </div>
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
                        {pond.uploadSelfie && (
                          <div><strong>Selfie:</strong> ✓ Uploaded</div>
                        )}
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

  // Render Dealer Card - FIXED VERSION WITH PROPER IMAGE HANDLING
  const renderDealerCard = (data) => (
    <div className="vertical-cards">
      {data.map((item) => (
        <div className="dealer-card" key={item._id}>
          <div className="dealer-card-header">
            <div className="dealer-profile">
              <img
                src={item.imageUrl || getDealerImageUrl(item) || "/no-image.png"}
                alt={`Dealer ${item.name}`}
                className="dealer-avatar"
                onClick={() => openModal(item.imageUrl || getDealerImageUrl(item))}
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

      {/* Dealers Section - FIXED WITH PROPER IMAGE HANDLING */}
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
                {pondDetailFields.map(({ label, key, isImage, isSelfie, isFileArray }) => {
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
                  
                  if (isSelfie && key === "uploadSelfie" && value) {
                    const selfieUrl = getSelfieImageUrl(selectedPond);
                    return (
                      <div className="detail-row" key={key}>
                        <strong>{label}:</strong>
                        <div className="clickable-link-container">
                          <img 
                            src={selfieUrl}
                            alt="Selfie"
                            onClick={() => openModal(selfieUrl)}
                            className="clickable-image"
                            style={{ 
                              maxWidth: '200px', 
                              maxHeight: '150px', 
                              cursor: 'pointer',
                              border: '2px solid #10b981',
                              borderRadius: '8px'
                            }}
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

              {/* Selfie Section */}
              {selectedPond.uploadSelfie && !pondDetailFields.some(f => f.key === "uploadSelfie" && f.isSelfie) && (
                <div className="file-preview-section">
                  <strong>Selfie Image:</strong>
                  <div className="file-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    <div className="file-item">
                      <img 
                        src={getSelfieImageUrl(selectedPond)}
                        alt="Selfie"
                        className="preview-img"
                        style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer', border: '2px solid #10b981' }}
                        onClick={() => openModal(getSelfieImageUrl(selectedPond))}
                        onError={(e) => {
                          e.target.src = "/no-image.png";
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pond Files Section */}
              {selectedPond.pondFilesUrls && selectedPond.pondFilesUrls.length > 0 && (
                <div className="file-preview-section">
                  <strong>Pond Files ({selectedPond.pondFilesUrls.length}):</strong>
                  <div className="file-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
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
                  <div className="file-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
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
            
            {/* Modal Footer */}
            <div className="modal-footer" style={{ 
              marginTop: '20px', 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'flex-end',
              padding: '15px 20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <button 
                onClick={() => {
                  // Download all data as CSV
                  const headers = ["Field", "Value"];
                  const rows = [];
                  
                  pondDetailFields.forEach(({ label, key }) => {
                    const value = selectedPond[key];
                    let displayValue = value || "N/A";
                    
                    if (Array.isArray(value)) {
                      displayValue = value.join("; ");
                    }
                    
                    if (key === "pondImage" && value) {
                      displayValue = getPondImageUrl(selectedPond);
                    }
                    
                    if (key === "uploadSelfie" && value) {
                      displayValue = getSelfieImageUrl(selectedPond);
                    }
                    
                    if ((key === "pondFiles" || key === "fishFiles") && value) {
                      const urls = key === "pondFiles" 
                        ? selectedPond.pondFilesUrls 
                        : selectedPond.fishFilesUrls;
                      displayValue = urls ? urls.join("; ") : "No files";
                    }
                    
                    rows.push([label, displayValue]);
                  });
                  
                  // Add farmer information
                  if (selectedFarmer) {
                    rows.push(["", ""]);
                    rows.push(["FARMER INFORMATION", ""]);
                    farmerBasicFields.forEach(({ label, key }) => {
                      rows.push([label, selectedFarmer[key] || "N/A"]);
                    });
                  }
                  
                  // Add agent information
                  if (selectedAgent) {
                    rows.push(["", ""]);
                    rows.push(["AGENT INFORMATION", ""]);
                    rows.push(["Agent Name", selectedAgent.name]);
                    rows.push(["Agent Mobile", selectedAgent.mobile]);
                    rows.push(["Agent Email", selectedAgent.email]);
                  }
                  
                  const csvContent = [
                    headers.join(","),
                    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
                  ].join("\n");
                  
                  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `${selectedPond.pondId || 'pond'}_full_details.csv`);
                  link.style.visibility = "hidden";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="download-all-btn"
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                ⬇️ Download All Data (CSV)
              </button>
              
              <button 
                onClick={() => openHistoryModal(selectedPond.pondId, "pond", selectedPond.pondId)}
                className="history-btn"
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                📜 View History
              </button>
              
              <button 
                onClick={closePondDetailsModal} 
                className="close-modal-btn"
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModalOpen && (
        <div className="modal-overlay" onClick={closeHistoryModal}>
          <div className="history-modal" onClick={(e) => e.stopPropagation()} style={{
            width: '90%',
            maxWidth: '1200px',
            maxHeight: '80vh',
            overflowY: 'auto',
            background: 'white',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div className="modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                History of {historyTitle}
              </h3>
              <button 
                onClick={closeHistoryModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            {historyLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner" style={{
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #10b981',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px'
                }}></div>
                <p>Loading history...</p>
              </div>
            ) : historyError ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#ef4444',
                background: '#fee2e2',
                borderRadius: '8px',
                margin: '20px 0'
              }}>
                <p><strong>Error:</strong> {historyError}</p>
              </div>
            ) : historyData.length === 0 ? (
              <div className="history-empty-state" style={{
                textAlign: 'center',
                padding: '40px',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#374151', marginBottom: '10px' }}>No History Found</h4>
                <p style={{ color: '#6b7280' }}>No changes have been recorded for this item yet.</p>
              </div>
            ) : (
              <div className="history-content">
                {/* Summary Stats */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    flex: 1,
                    minWidth: '150px'
                  }}>
                    <strong style={{ color: '#374151' }}>Total Changes:</strong>
                    <p style={{ fontSize: '24px', fontWeight: '600', margin: '5px 0 0', color: '#10b981' }}>
                      {historyData.length}
                    </p>
                  </div>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    flex: 1,
                    minWidth: '150px'
                  }}>
                    <strong style={{ color: '#374151' }}>Latest Update:</strong>
                    <p style={{ fontSize: '14px', margin: '5px 0 0', color: '#4b5563' }}>
                      {historyData.length > 0 ? new Date(historyData[0].timestamp).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    flex: 1,
                    minWidth: '150px'
                  }}>
                    <strong style={{ color: '#374151' }}>Unique Fields:</strong>
                    <p style={{ fontSize: '14px', margin: '5px 0 0', color: '#4b5563' }}>
                      {new Set(historyData.map(h => h.field)).size}
                    </p>
                  </div>
                </div>

                {/* History Table */}
                <div className="history-table-container" style={{
                  overflowX: 'auto',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}>
                  <table className="history-table" style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr style={{
                        background: '#f9fafb',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Field</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Old Value</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>New Value</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Changed By</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((item, idx) => (
                        <tr key={idx} style={{
                          borderBottom: '1px solid #e5e7eb',
                          background: idx % 2 === 0 ? 'white' : '#f9fafb'
                        }}>
                          <td style={{ padding: '12px', fontWeight: '500' }}>{item.field}</td>
                          <td style={{ padding: '12px', color: '#ef4444' }}>
                            <span style={{
                              background: '#fee2e2',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {typeof item.oldValue === 'object' ? JSON.stringify(item.oldValue) : String(item.oldValue)}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: '#10b981' }}>
                            <span style={{
                              background: '#d1fae5',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {typeof item.newValue === 'object' ? JSON.stringify(item.newValue) : String(item.newValue)}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              background: '#e0f2fe',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {item.changedBy}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: '#6b7280' }}>
                            {new Date(item.timestamp).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Close button at bottom */}
            <div style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeHistoryModal}
                style={{
                  padding: '8px 16px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add animation keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;