







// import React, { useState, useEffect } from "react";
// import api, { getImageUrl } from "../utils/api";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./mainPage.css";

// // Import Lucide icons
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2 } from "lucide-react";

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

//   // ✅ 1️⃣ Farmer form empty state - PHOTO FIELD ADDED
//   const emptyFarmer = {
//     name: "", contact: "", age: "", gender: "", village: "",
//     pondCount: "", adhar: "", familyMembers: "", familyOccupation: "",
//     photo: null,              // ✅ ADD THIS
//     photoExisting: ""         // ✅ UPDATE MODE ke liye
//   };

//   // Pond form empty state
//   const emptyPond = {
//     // Pond Details
//     pondArea: "", pondAreaUnit: "acre", pondDepth: "", pondImage: null,
//     overflow: "No", receivesSunlight: "Yes", treesOnBanks: "No",
//     neighbourhood: "Agriculture Farm", wastewaterEnters: "No",
//     // Species & files
//     species: "",
//     pondFiles: [],
//     fishFiles: [],
//     // Stocking & quantities
//     dateOfStocking: "", qtySeedInitially: "", currentQty: "", avgSize: ">200gram",
//     // Feed
//     feedType: "Market Feed", feedOther: "", feedFreq: "Once a day", 
//     feedQtyPerDay: "", feedTime: "6:00 am-10:00am",
//     recentFeedChanges: "", reducedAppetite: "No",
//     // Water quality
//     waterTemperature: "", pH: "", DO: "", ammoniaLevel: "Medium", 
//     phytoplanktonLevel: "Medium", waterHardness: "1",
//     algaeBloom: "No", pondWaterColor: "Light Green", sourceOfWater: "Rainwater",
//     // Disease / symptoms
//     diseaseSymptoms: "No", symptomsObserved: "", symptoms: [],
//     symptomsAffect: "All",
//     fishDeaths: "",
//     // Observation
//     farmObservedDate: "", farmObservedTime: "",
//     // misc
//     notes: "",
//     lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
//     pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No"
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
//     if (!userId) return console.error("UserId not found in localStorage");
//     fetchFarmers();
//     const savedLang = localStorage.getItem("lang");
//     if (savedLang) i18n.changeLanguage(savedLang);
//   }, []);

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
//       const res = await api.get(`/api/farmers/all?userId=${userId}&includeShared=false`);
//       setFarmers(res.data || []);
//     } catch (err) {
//       console.log("Fetch Farmers Error:", err);
//     } finally {
//       setLoading(prev => ({ ...prev, fetchFarmers: false }));
//     }
//   };

//   // ✅ 3️⃣ Add Farmer API me photo FormData me bhejo
//   const addFarmer = async () => {
//     if (!newFarmer.name || !newFarmer.contact) return alert("Name and contact required");
    
//     const formData = new FormData();
    
//     // ✅ FIX: photo alag se handle karo
//     for (let key in newFarmer) {
//       if (key === "photo" || key === "photoExisting") continue;
//       formData.append(key, newFarmer[key] ?? "");
//     }
    
//     formData.append("userId", userId);
    
//     // ✅ IMPORTANT: photo file ko alag se append karo
//     if (newFarmer.photo) {
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
//       alert("Server error. See console.");
//     } finally {
//       setLoading(prev => ({ ...prev, addFarmer: false }));
//     }
//   };

//   // ✅ 4️⃣ Update Farmer API me bhi photo bhejo
//   const updateFarmer = async () => {
//     if (!editingFarmerId) return;
    
//     const formData = new FormData();
    
//     // ✅ FIX: photo alag se handle karo
//     for (let key in newFarmer) {
//       if (key === "photo" || key === "photoExisting") continue;
//       formData.append(key, newFarmer[key] ?? "");
//     }
    
//     formData.append("userId", userId);
    
//     // ✅ IMPORTANT: photo file ko alag se append karo
//     if (newFarmer.photo) {
//       formData.append("photo", newFarmer.photo);
//     }

//     try {
//       setLoading(prev => ({ ...prev, updateFarmer: true }));
//       const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       setFarmers(farmers.map(f => (f._id === res.data._id ? res.data : f)));
//       setShowForm(false);
//       setEditingFarmerId(null);
//       setNewFarmer(emptyFarmer);
//       setIsUpdateMode(false);
//     } catch (err) {
//       console.error("Update Farmer Error:", err);
//       alert("Server error. See console.");
//     } finally {
//       setLoading(prev => ({ ...prev, updateFarmer: false }));
//     }
//   };

//   // Add Pond to Farmer
//   const addPond = async () => {
//     if (!currentFarmerId) return alert("Farmer ID missing");
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     const skipFiles = ["pondFiles", "fishFiles", "pondImage", "symptoms"];
//     for (let key in newPond) {
//       if (skipFiles.includes(key)) continue;
//       formData.append(key, newPond[key] ?? "");
//     }
//     formData.set("symptomsObserved", symptomsStr);

//     if (newPond.pondImage) formData.append("pondImage", newPond.pondImage);
//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => formData.append("pondFiles", f));
//     }
//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => formData.append("fishFiles", f));
//     }

//     try {
//       setLoading(prev => ({ ...prev, addPond: true }));
//       const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Update local state
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? res.data.farmer : f
//       ));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//     } catch (err) {
//       console.error("Add Pond Error:", err);
//       alert("Server error. See console.");
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

//     const skipFiles = ["pondFiles", "fishFiles", "pondImage", "symptoms"];
//     for (let key in newPond) {
//       if (skipFiles.includes(key)) continue;
//       formData.append(key, newPond[key] ?? "");
//     }
//     formData.set("symptomsObserved", symptomsStr);

//     if (newPond.pondImage) formData.append("pondImage", newPond.pondImage);
//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => formData.append("pondFiles", f));
//     }
//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => formData.append("fishFiles", f));
//     }

//     try {
//       setLoading(prev => ({ ...prev, updatePond: true }));
//       const res = await api.put(`/api/farmers/update-pond/${currentFarmerId}/${editingPondId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Update local state
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? res.data.farmer : f
//       ));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setEditingPondId(null);
//     } catch (err) {
//       console.error("Update Pond Error:", err);
//       alert("Server error. See console.");
//     } finally {
//       setLoading(prev => ({ ...prev, updatePond: false }));
//     }
//   };

//   // ✅ 5️⃣ Edit Farmer open karte waqt existing photo set karo
//   const openEdit = (farmer) => {
//     setIsUpdateMode(true);
//     const pre = { ...emptyFarmer };
//     Object.keys(pre).forEach(k => {
//       if (farmer[k] !== undefined && farmer[k] !== null) {
//         pre[k] = farmer[k];
//       }
//     });

//     pre.photoExisting = farmer.photo || ""; // ✅ ADD THIS

//     setNewFarmer(pre);
//     setEditingFarmerId(farmer._id);
//     setShowForm(true);
//   };

//   // Open Add Pond Form
//   const openAddPond = (farmerId) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(null);
//     setNewPond(emptyPond);
//     setShowPondForm(true);
//   };

//   // Open Edit Pond Form
//   const openEditPond = (farmerId, pond) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(pond.pondId);
    
//     const pre = { ...emptyPond };
//     Object.keys(pre).forEach(k => {
//       if (pond[k] !== undefined && pond[k] !== null) {
//         pre[k] = pond[k];
//       }
//     });

//     // Handle symptoms
//     if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
//       pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
//       pre.symptomsObserved = pond.symptomsObserved;
//     }

//     pre.pondFilesExisting = pond.pondFiles || [];
//     pre.fishFilesExisting = pond.fishFiles || [];
//     pre.pondImageExisting = pond.pondImage || "";

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

//   const renderExistingFiles = (list) => {
//     if (!list || list.length === 0) return null;
//     return (
//       <div style={{ marginTop: 6 }}>
//         {list.map((fn, i) => (
//           <div key={i}><a target="_blank" rel="noreferrer" href={getImageUrl(`/uploads/${fn}`)}>{fn}</a></div>
//         ))}
//       </div>
//     );
//   };

//   const totalFarmers = farmers.length;
//   const totalPonds = farmers.reduce((sum, f) => sum + Number(f.pondCount || 0), 0);

//   const [searchId, setSearchId] = useState("");




// const handleSearch = async () => {
//   if (!searchId) {
//     await fetchFarmers();
//     return;
//   }

//   setLoading(prev => ({ ...prev, search: true }));
//   try {
//     const filtered = farmers.filter(f =>
//       f.farmerId.toLowerCase().includes(searchId.toLowerCase())
//     );

//     if (filtered.length > 0) {
//       const remaining = farmers.filter(f => !filtered.includes(f));
//       setFarmers([...filtered, ...remaining]);
//     } else {
//       await fetchFarmers();
//     }
//   } finally {
//     setLoading(prev => ({ ...prev, search: false }));
//   }
// };





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
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//               alt="User"
//               className="mobile-profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
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
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//               alt="User"
//               className="profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5>{username}</h5>
//           </div>

//           {isMobile && (
//             <button 
//               className="sidebar-close-btn"
//               onClick={() => setIsSidebarOpen(false)}
//               aria-label="Close menu"
//               disabled={loading.fetchFarmers}
//             >
//               <X size={20} />
//             </button>
//           )}
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

          

// <div className="search-section d-flex gap-2">
//   <input
//     type="text"
//     placeholder={t('farmerSearchById')}
//     className="form-control"
//     value={searchId}
//     onChange={(e) => setSearchId(e.target.value)}
//     disabled={loading.search}
//   />

//   <button
//     className="btn btn-sm btn-primary"
//     onClick={handleSearch}
//     disabled={loading.search}
//   >
//     {loading.search ? <ButtonLoader /> : "Search"}
//   </button>
// </div>




//         </div>

//         <div className="list-title">{t('farmersList')}</div>
//         <div className="farmers-list">
//           {loading.fetchFarmers ? (
//             <div className="text-center py-5">
//               <ButtonLoader />
//               <p>Loading farmers...</p>
//             </div>
//           ) : (
//             farmers.map(f => (
//               <div key={f._id} className="farmer-box">
//                 {/* ✅ 6️⃣ Farmer card image render FIX */}
//                 <img
//                   src={
//                     f.photo
//                       ? getImageUrl(`${f.photo}`)
//                       : "/profile.png"
//                   }
//                   alt="Profile"
//                   className="profile-pic"
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
//               <h6>Farmer Details</h6>
//               <div className="row g-2">
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Name" 
//                     value={newFarmer.name} 
//                     onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Contact Number" 
//                     value={newFarmer.contact} 
//                     onChange={e => setNewFarmer({ ...newFarmer, contact: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>
                
//                 <div className="col-md-3">
//                   <input 
//                     type="number" 
//                     className="form-control" 
//                     placeholder="Age" 
//                     value={newFarmer.age} 
//                     onChange={e => setNewFarmer({ ...newFarmer, age: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Gender" 
//                     value={newFarmer.gender} 
//                     onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Aadhar" 
//                     value={newFarmer.adhar} 
//                     onChange={e => setNewFarmer({ ...newFarmer, adhar: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Members" 
//                     value={newFarmer.familyMembers} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyMembers: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Occupation" 
//                     value={newFarmer.familyOccupation} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyOccupation: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Village" 
//                     value={newFarmer.village} 
//                     onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 {/* ✅ 2️⃣ Farmer form ke andar IMAGE INPUT add karo */}
//                 <div className="col-md-12">
//                   <label>Farmer Photo (max 5MB)</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="form-control"
//                     onChange={(e) =>
//                       setNewFarmer({ ...newFarmer, photo: e.target.files[0] })
//                     }
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />

//                   {/* ✅ UPDATE MODE me existing photo */}
//                   {newFarmer.photoExisting && (
//                     <div style={{ marginTop: 6 }}>
//                       <img
//                         src={getImageUrl(newFarmer.photoExisting)}
//                         alt="Existing Farmer"
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

//             {/* UPDATED MODAL FORM GRID */}
//             <div className="modal-form-grid">
              
//               {/* Pond Details */}
//               <div className="modal-section">
//                 <h6>Pond Details</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond area (eg. 1 acre)" 
//                       value={newPond.pondArea} 
//                       onChange={e => setNewPond({ ...newPond, pondArea: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-2">
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondAreaUnit} 
//                       onChange={e => setNewPond({ ...newPond, pondAreaUnit: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option value="acre">acre</option>
//                       <option value="hectare">hectare</option>
//                       <option value="footsquare">footsquare</option>
//                     </select>
//                   </div>
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond depth (ft)" 
//                       value={newPond.pondDepth} 
//                       onChange={e => setNewPond({ ...newPond, pondDepth: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond image (GPS) - max 10MB</label>
//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       className="form-control" 
//                       onChange={e => setNewPond({ ...newPond, pondImage: e.target.files[0] })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {newPond.pondImageExisting && <div style={{ marginTop: 6 }}>
//                       <a target="_blank" rel="noreferrer" href={getImageUrl(`/uploads/${newPond.pondImageExisting}`)}>
//                         Existing: {newPond.pondImageExisting}
//                       </a>
//                     </div>}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload Pond Picture/Video (up to 5, 100MB each)</label>
//                     <input 
//                       type="file" 
//                       className="form-control" 
//                       multiple 
//                       onChange={e => setNewPond({ ...newPond, pondFiles: Array.from(e.target.files) })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {renderExistingFiles(newPond.pondFilesExisting)}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Overflow from somewhere in pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.overflow} 
//                       onChange={e => setNewPond({ ...newPond, overflow: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond receives proper Sunlight?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.receivesSunlight} 
//                       onChange={e => setNewPond({ ...newPond, receivesSunlight: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Trees present on banks?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.treesOnBanks} 
//                       onChange={e => setNewPond({ ...newPond, treesOnBanks: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Neighbourhood</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.neighbourhood} 
//                       onChange={e => setNewPond({ ...newPond, neighbourhood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Agriculture Farm</option>
//                       <option>Pond</option>
//                       <option>Road</option>
//                       <option>Residential Area</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Does wastewater enter pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.wastewaterEnters} 
//                       onChange={e => setNewPond({ ...newPond, wastewaterEnters: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Species & Stocking */}
//               <div className="modal-section">
//                 <h6>Species & Stocking</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Fish Species Cultured" 
//                       value={newPond.species} 
//                       onChange={e => setNewPond({ ...newPond, species: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label>Date of Stocking</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.dateOfStocking} 
//                       onChange={e => setNewPond({ ...newPond, dateOfStocking: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="Quantity of Seed initially in Pond" 
//                       value={newPond.qtySeedInitially} 
//                       onChange={e => setNewPond({ ...newPond, qtySeedInitially: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Current Quantity of Fish in Pond" 
//                       value={newPond.currentQty} 
//                       onChange={e => setNewPond({ ...newPond, currentQty: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Average size of fishes</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.avgSize} 
//                       onChange={e => setNewPond({ ...newPond, avgSize: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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
//                 <h6>Feed Details</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <label>Feed Type Used</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedType} 
//                       onChange={e => setNewPond({ ...newPond, feedType: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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
//                     <label>Feed frequency</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedFreq} 
//                       onChange={e => setNewPond({ ...newPond, feedFreq: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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
//                       placeholder="Feed quantity given per day (in kg)" 
//                       value={newPond.feedQtyPerDay} 
//                       onChange={e => setNewPond({ ...newPond, feedQtyPerDay: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Approx time of feeding</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.feedTime} 
//                       onChange={e => setNewPond({ ...newPond, feedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Any recent changes in feed or feeding behaviour" 
//                       value={newPond.recentFeedChanges} 
//                       onChange={e => setNewPond({ ...newPond, recentFeedChanges: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Do fish show reduced appetite?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.reducedAppetite} 
//                       onChange={e => setNewPond({ ...newPond, reducedAppetite: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Water Quality */}
//               <div className="modal-section">
//                 <h6>Water Quality</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="Water Temp (°C)" 
//                       value={newPond.waterTemperature} 
//                       onChange={e => setNewPond({ ...newPond, waterTemperature: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="pH measured" 
//                       value={newPond.pH} 
//                       onChange={e => setNewPond({ ...newPond, pH: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="DO measured" 
//                       value={newPond.DO} 
//                       onChange={e => setNewPond({ ...newPond, DO: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <label>Ammonia (NH₃) Level</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.ammoniaLevel} 
//                       onChange={e => setNewPond({ ...newPond, ammoniaLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Phytoplankton Levels</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.phytoplanktonLevel} 
//                       onChange={e => setNewPond({ ...newPond, phytoplanktonLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Water Hardness</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.waterHardness} 
//                       onChange={e => setNewPond({ ...newPond, waterHardness: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Any visible algae bloom?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.algaeBloom} 
//                       onChange={e => setNewPond({ ...newPond, algaeBloom: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Pond Water Colour</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondWaterColor} 
//                       onChange={e => setNewPond({ ...newPond, pondWaterColor: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Light Green</option><option>Dark Green</option><option>Yellowish Green</option>
//                       <option>Brownish Green</option><option>Yellow</option><option>Muddy Brown</option>
//                       <option>Black</option><option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Source of Water</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.sourceOfWater} 
//                       onChange={e => setNewPond({ ...newPond, sourceOfWater: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Rainwater</option><option>Pump</option><option>River</option><option>Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Disease & Symptoms */}
//               <div className="modal-section">
//                 <h6>Disease & Symptoms</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <label>Any disease symptoms?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.diseaseSymptoms} 
//                       onChange={e => setNewPond({ ...newPond, diseaseSymptoms: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   {/* UPDATED SYMPTOMS SECTION */}
//                   <div className="col-md-12">
//                     <label>Symptoms observed (check / or type)</label>
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
//                         placeholder="Or type symptoms comma separated" 
//                         value={newPond.symptomsObserved} 
//                         onChange={e => setNewPond({ ...newPond, symptomsObserved: e.target.value })}
//                         disabled={loading.addPond || loading.updatePond}
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="How many fish have died (cumulative)?" 
//                       value={newPond.fishDeaths} 
//                       onChange={e => setNewPond({ ...newPond, fishDeaths: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Are symptoms affecting all fish or only a few?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.symptomsAffect} 
//                       onChange={e => setNewPond({ ...newPond, symptomsAffect: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>All</option><option>Few</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload fish images/videos (up to 5)</label>
//                     <input 
//                       type="file" 
//                       className="form-control" 
//                       multiple 
//                       onChange={e => setNewPond({ ...newPond, fishFiles: Array.from(e.target.files) })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {renderExistingFiles(newPond.fishFilesExisting)}
//                   </div>
//                 </div>
//               </div>

//               {/* Observation & Misc */}
//               <div className="modal-section">
//                 <h6>Observation & Misc</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <label>Date of Farm Observed</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.farmObservedDate} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedDate: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label>Time of Farm Observed</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.farmObservedTime} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Which species farmer cultured last time?</label>
//                     <input 
//                       className="form-control" 
//                       value={newPond.lastSpecies} 
//                       onChange={e => setNewPond({ ...newPond, lastSpecies: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Does farmer completely harvest the last crop?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.lastHarvestComplete} 
//                       onChange={e => setNewPond({ ...newPond, lastHarvestComplete: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any recent heavy rains or floods?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.recentRainFlood} 
//                       onChange={e => setNewPond({ ...newPond, recentRainFlood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any pesticide/chemical runoff near pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pesticideRunoff} 
//                       onChange={e => setNewPond({ ...newPond, pesticideRunoff: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any construction/activity near pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.constructionNear} 
//                       onChange={e => setNewPond({ ...newPond, constructionNear: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any sudden temperature change recently?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.suddenTempChange} 
//                       onChange={e => setNewPond({ ...newPond, suddenTempChange: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-12">
//                     <label>Notes / Remarks</label>
//                     <textarea 
//                       className="form-control" 
//                       rows={3} 
//                       value={newPond.notes} 
//                       onChange={e => setNewPond({ ...newPond, notes: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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




// import React, { useState, useEffect } from "react";
// import api, { getImageUrl } from "../utils/api";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./mainPage.css";

// // Import Lucide icons
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2 } from "lucide-react";

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

//   // ✅ 1️⃣ Farmer form empty state - PHOTO FIELD ADDED
//   const emptyFarmer = {
//     name: "", contact: "", age: "", gender: "", village: "",
//     pondCount: "", adhar: "", familyMembers: "", familyOccupation: "",
//     photo: null,              // ✅ ADD THIS
//     photoExisting: ""         // ✅ UPDATE MODE ke liye
//   };

//   // Pond form empty state
//   const emptyPond = {
//     // Pond Details
//     pondArea: "", pondAreaUnit: "acre", pondDepth: "", pondImage: null,
//     overflow: "No", receivesSunlight: "Yes", treesOnBanks: "No",
//     neighbourhood: "Agriculture Farm", wastewaterEnters: "No",
//     // Species & files
//     species: "",
//     pondFiles: [],
//     fishFiles: [],
//     // Stocking & quantities
//     dateOfStocking: "", qtySeedInitially: "", currentQty: "", avgSize: ">200gram",
//     // Feed
//     feedType: "Market Feed", feedOther: "", feedFreq: "Once a day", 
//     feedQtyPerDay: "", feedTime: "6:00 am-10:00am",
//     recentFeedChanges: "", reducedAppetite: "No",
//     // Water quality
//     waterTemperature: "", pH: "", DO: "", ammoniaLevel: "Medium", 
//     phytoplanktonLevel: "Medium", waterHardness: "1",
//     algaeBloom: "No", pondWaterColor: "Light Green", sourceOfWater: "Rainwater",
//     // Disease / symptoms
//     diseaseSymptoms: "No", symptomsObserved: "", symptoms: [],
//     symptomsAffect: "All",
//     fishDeaths: "",
//     // Observation
//     farmObservedDate: "", farmObservedTime: "",
//     // misc
//     notes: "",
//     lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
//     pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No"
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
//     if (!userId) return console.error("UserId not found in localStorage");
//     fetchFarmers();
//     const savedLang = localStorage.getItem("lang");
//     if (savedLang) i18n.changeLanguage(savedLang);
//   }, []);

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
//       const res = await api.get(`/api/farmers/all?userId=${userId}&includeShared=false`);
//       setFarmers(res.data || []);
//     } catch (err) {
//       console.log("Fetch Farmers Error:", err);
//     } finally {
//       setLoading(prev => ({ ...prev, fetchFarmers: false }));
//     }
//   };

//   // ✅ 3️⃣ Add Farmer API me photo FormData me bhejo
//   const addFarmer = async () => {
//     if (!newFarmer.name || !newFarmer.contact) return alert("Name and contact required");
    
//     const formData = new FormData();
    
//     // ✅ FIX: photo alag se handle karo
//     for (let key in newFarmer) {
//       if (key === "photo" || key === "photoExisting") continue;
//       formData.append(key, newFarmer[key] ?? "");
//     }
    
//     formData.append("userId", userId);
    
//     // ✅ IMPORTANT: photo file ko alag se append karo (CHECK File instance)
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
//       alert("Server error. See console.");
//     } finally {
//       setLoading(prev => ({ ...prev, addFarmer: false }));
//     }
//   };

//   // ✅ 4️⃣ Update Farmer API me bhi photo bhejo
//   const updateFarmer = async () => {
//     if (!editingFarmerId) return;
    
//     const formData = new FormData();
    
//     // ✅ FIX: photo alag se handle karo
//     for (let key in newFarmer) {
//       if (key === "photo" || key === "photoExisting") continue;
//       formData.append(key, newFarmer[key] ?? "");
//     }
    
//     formData.append("userId", userId);
    
//     // ✅ IMPORTANT: photo file ko alag se append karo (CHECK File instance)
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     }

//     try {
//       setLoading(prev => ({ ...prev, updateFarmer: true }));
//       const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       setFarmers(farmers.map(f => (f._id === res.data._id ? res.data : f)));
//       setShowForm(false);
//       setEditingFarmerId(null);
//       setNewFarmer(emptyFarmer);
//       setIsUpdateMode(false);
//     } catch (err) {
//       console.error("Update Farmer Error:", err);
//       alert("Server error. See console.");
//     } finally {
//       setLoading(prev => ({ ...prev, updateFarmer: false }));
//     }
//   };

//   // Add Pond to Farmer
//   const addPond = async () => {
//     if (!currentFarmerId) return alert("Farmer ID missing");
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     const skipFiles = ["pondFiles", "fishFiles", "pondImage", "symptoms"];
//     for (let key in newPond) {
//       if (skipFiles.includes(key)) continue;
//       formData.append(key, newPond[key] ?? "");
//     }
//     formData.set("symptomsObserved", symptomsStr);

//     if (newPond.pondImage instanceof File) formData.append("pondImage", newPond.pondImage);
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
//       setLoading(prev => ({ ...prev, addPond: true }));
//       const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Update local state
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? res.data.farmer : f
//       ));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//     } catch (err) {
//       console.error("Add Pond Error:", err);
//       alert("Server error. See console.");
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

//     const skipFiles = ["pondFiles", "fishFiles", "pondImage", "symptoms"];
//     for (let key in newPond) {
//       if (skipFiles.includes(key)) continue;
//       formData.append(key, newPond[key] ?? "");
//     }
//     formData.set("symptomsObserved", symptomsStr);

//     if (newPond.pondImage instanceof File) formData.append("pondImage", newPond.pondImage);
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
      
//       // Update local state
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? res.data.farmer : f
//       ));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setEditingPondId(null);
//     } catch (err) {
//       console.error("Update Pond Error:", err);
//       alert("Server error. See console.");
//     } finally {
//       setLoading(prev => ({ ...prev, updatePond: false }));
//     }
//   };

//   // ✅ 5️⃣ Edit Farmer open karte waqt existing photo set karo
//   const openEdit = (farmer) => {
//     setIsUpdateMode(true);
//     const pre = { ...emptyFarmer };
//     Object.keys(pre).forEach(k => {
//       if (farmer[k] !== undefined && farmer[k] !== null) {
//         pre[k] = farmer[k];
//       }
//     });

//     // ✅ FIX: photo null rakho, photoExisting me existing photo
//     pre.photo = null;
//     pre.photoExisting = farmer.photo || ""; // ✅ ADD THIS

//     setNewFarmer(pre);
//     setEditingFarmerId(farmer._id);
//     setShowForm(true);
//   };

//   // Open Add Pond Form
//   const openAddPond = (farmerId) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(null);
//     setNewPond(emptyPond);
//     setShowPondForm(true);
//   };

//   // Open Edit Pond Form
//   const openEditPond = (farmerId, pond) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(pond.pondId);
    
//     const pre = { ...emptyPond };
//     Object.keys(pre).forEach(k => {
//       if (pond[k] !== undefined && pond[k] !== null) {
//         pre[k] = pond[k];
//       }
//     });

//     // Handle symptoms
//     if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
//       pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
//       pre.symptomsObserved = pond.symptomsObserved;
//     }

//     // ✅ FIX: files null rakho, existing alag se
//     pre.pondFiles = [];
//     pre.fishFiles = [];
//     pre.pondImage = null;
    
//     pre.pondFilesExisting = pond.pondFiles || [];
//     pre.fishFilesExisting = pond.fishFiles || [];
//     pre.pondImageExisting = pond.pondImage || "";

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

//   const renderExistingFiles = (list) => {
//     if (!list || list.length === 0) return null;
//     return (
//       <div style={{ marginTop: 6 }}>
//         {list.map((fn, i) => (
//           <div key={i}>
//             <a target="_blank" rel="noreferrer" href={getImageUrl(fn)}>
//               {fn.split('/').pop()}
//             </a>
//           </div>
//         ))}
//       </div>
//     );
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
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
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
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//               alt="User"
//               className="profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//                 e.target.onerror = null;
//               }}
//             />
//             <h5>{username}</h5>
//           </div>

//           {isMobile && (
//             <button 
//               className="sidebar-close-btn"
//               onClick={() => setIsSidebarOpen(false)}
//               aria-label="Close menu"
//               disabled={loading.fetchFarmers}
//             >
//               <X size={20} />
//             </button>
//           )}
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
//           ) : (
//             farmers.map(f => (
//               <div key={f._id} className="farmer-box">
//                 {/* ✅ FIXED: Farmer card image render FIX */}
//                 <img
//                   src={f.photo ? getImageUrl(f.photo) : "/profile.png"}
//                   alt={f.name}
//                   className="profile-pic"
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
//               <h6>Farmer Details</h6>
//               <div className="row g-2">
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Name" 
//                     value={newFarmer.name} 
//                     onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Contact Number" 
//                     value={newFarmer.contact} 
//                     onChange={e => setNewFarmer({ ...newFarmer, contact: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>
                
//                 <div className="col-md-3">
//                   <input 
//                     type="number" 
//                     className="form-control" 
//                     placeholder="Age" 
//                     value={newFarmer.age} 
//                     onChange={e => setNewFarmer({ ...newFarmer, age: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Gender" 
//                     value={newFarmer.gender} 
//                     onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Aadhar" 
//                     value={newFarmer.adhar} 
//                     onChange={e => setNewFarmer({ ...newFarmer, adhar: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Members" 
//                     value={newFarmer.familyMembers} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyMembers: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Occupation" 
//                     value={newFarmer.familyOccupation} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyOccupation: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Village" 
//                     value={newFarmer.village} 
//                     onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 {/* ✅ 2️⃣ Farmer form ke andar IMAGE INPUT add karo */}
//                 <div className="col-md-12">
//                   <label>Farmer Photo (max 5MB)</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="form-control"
//                     onChange={(e) =>
//                       setNewFarmer({ ...newFarmer, photo: e.target.files[0] })
//                     }
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />

//                   {/* ✅ UPDATE MODE me existing photo */}
//                   {newFarmer.photoExisting && (
//                     <div style={{ marginTop: 6 }}>
//                       <img
//                         src={getImageUrl(newFarmer.photoExisting)}
//                         alt="Existing Farmer"
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
//                 <h6>Pond Details</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond area (eg. 1 acre)" 
//                       value={newPond.pondArea} 
//                       onChange={e => setNewPond({ ...newPond, pondArea: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-2">
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondAreaUnit} 
//                       onChange={e => setNewPond({ ...newPond, pondAreaUnit: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option value="acre">acre</option>
//                       <option value="hectare">hectare</option>
//                       <option value="footsquare">footsquare</option>
//                     </select>
//                   </div>
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond depth (ft)" 
//                       value={newPond.pondDepth} 
//                       onChange={e => setNewPond({ ...newPond, pondDepth: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond image (GPS) - max 10MB</label>
//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       className="form-control" 
//                       onChange={e => setNewPond({ ...newPond, pondImage: e.target.files[0] })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {newPond.pondImageExisting && <div style={{ marginTop: 6 }}>
//                       <a target="_blank" rel="noreferrer" href={getImageUrl(newPond.pondImageExisting)}>
//                         Existing: {newPond.pondImageExisting.split('/').pop()}
//                       </a>
//                     </div>}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload Pond Picture/Video (up to 5, 100MB each)</label>
//                     <input 
//                       type="file" 
//                       className="form-control" 
//                       multiple 
//                       onChange={e => setNewPond({ ...newPond, pondFiles: Array.from(e.target.files) })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {renderExistingFiles(newPond.pondFilesExisting)}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Overflow from somewhere in pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.overflow} 
//                       onChange={e => setNewPond({ ...newPond, overflow: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond receives proper Sunlight?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.receivesSunlight} 
//                       onChange={e => setNewPond({ ...newPond, receivesSunlight: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Trees present on banks?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.treesOnBanks} 
//                       onChange={e => setNewPond({ ...newPond, treesOnBanks: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Neighbourhood</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.neighbourhood} 
//                       onChange={e => setNewPond({ ...newPond, neighbourhood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Agriculture Farm</option>
//                       <option>Pond</option>
//                       <option>Road</option>
//                       <option>Residential Area</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Does wastewater enter pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.wastewaterEnters} 
//                       onChange={e => setNewPond({ ...newPond, wastewaterEnters: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Species & Stocking */}
//               <div className="modal-section">
//                 <h6>Species & Stocking</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Fish Species Cultured" 
//                       value={newPond.species} 
//                       onChange={e => setNewPond({ ...newPond, species: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label>Date of Stocking</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.dateOfStocking} 
//                       onChange={e => setNewPond({ ...newPond, dateOfStocking: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="Quantity of Seed initially in Pond" 
//                       value={newPond.qtySeedInitially} 
//                       onChange={e => setNewPond({ ...newPond, qtySeedInitially: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Current Quantity of Fish in Pond" 
//                       value={newPond.currentQty} 
//                       onChange={e => setNewPond({ ...newPond, currentQty: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Average size of fishes</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.avgSize} 
//                       onChange={e => setNewPond({ ...newPond, avgSize: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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
//                 <h6>Feed Details</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <label>Feed Type Used</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedType} 
//                       onChange={e => setNewPond({ ...newPond, feedType: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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
//                     <label>Feed frequency</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedFreq} 
//                       onChange={e => setNewPond({ ...newPond, feedFreq: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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
//                       placeholder="Feed quantity given per day (in kg)" 
//                       value={newPond.feedQtyPerDay} 
//                       onChange={e => setNewPond({ ...newPond, feedQtyPerDay: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Approx time of feeding</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.feedTime} 
//                       onChange={e => setNewPond({ ...newPond, feedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Any recent changes in feed or feeding behaviour" 
//                       value={newPond.recentFeedChanges} 
//                       onChange={e => setNewPond({ ...newPond, recentFeedChanges: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Do fish show reduced appetite?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.reducedAppetite} 
//                       onChange={e => setNewPond({ ...newPond, reducedAppetite: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Water Quality */}
//               <div className="modal-section">
//                 <h6>Water Quality</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="Water Temp (°C)" 
//                       value={newPond.waterTemperature} 
//                       onChange={e => setNewPond({ ...newPond, waterTemperature: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="pH measured" 
//                       value={newPond.pH} 
//                       onChange={e => setNewPond({ ...newPond, pH: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="DO measured" 
//                       value={newPond.DO} 
//                       onChange={e => setNewPond({ ...newPond, DO: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <label>Ammonia (NH₃) Level</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.ammoniaLevel} 
//                       onChange={e => setNewPond({ ...newPond, ammoniaLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Phytoplankton Levels</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.phytoplanktonLevel} 
//                       onChange={e => setNewPond({ ...newPond, phytoplanktonLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Water Hardness</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.waterHardness} 
//                       onChange={e => setNewPond({ ...newPond, waterHardness: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Any visible algae bloom?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.algaeBloom} 
//                       onChange={e => setNewPond({ ...newPond, algaeBloom: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Pond Water Colour</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondWaterColor} 
//                       onChange={e => setNewPond({ ...newPond, pondWaterColor: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Light Green</option><option>Dark Green</option><option>Yellowish Green</option>
//                       <option>Brownish Green</option><option>Yellow</option><option>Muddy Brown</option>
//                       <option>Black</option><option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Source of Water</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.sourceOfWater} 
//                       onChange={e => setNewPond({ ...newPond, sourceOfWater: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Rainwater</option><option>Pump</option><option>River</option><option>Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Disease & Symptoms */}
//               <div className="modal-section">
//                 <h6>Disease & Symptoms</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <label>Any disease symptoms?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.diseaseSymptoms} 
//                       onChange={e => setNewPond({ ...newPond, diseaseSymptoms: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   {/* UPDATED SYMPTOMS SECTION */}
//                   <div className="col-md-12">
//                     <label>Symptoms observed (check / or type)</label>
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
//                         placeholder="Or type symptoms comma separated" 
//                         value={newPond.symptomsObserved} 
//                         onChange={e => setNewPond({ ...newPond, symptomsObserved: e.target.value })}
//                         disabled={loading.addPond || loading.updatePond}
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="How many fish have died (cumulative)?" 
//                       value={newPond.fishDeaths} 
//                       onChange={e => setNewPond({ ...newPond, fishDeaths: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Are symptoms affecting all fish or only a few?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.symptomsAffect} 
//                       onChange={e => setNewPond({ ...newPond, symptomsAffect: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>All</option><option>Few</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload fish images/videos (up to 5)</label>
//                     <input 
//                       type="file" 
//                       className="form-control" 
//                       multiple 
//                       onChange={e => setNewPond({ ...newPond, fishFiles: Array.from(e.target.files) })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {renderExistingFiles(newPond.fishFilesExisting)}
//                   </div>
//                 </div>
//               </div>

//               {/* Observation & Misc */}
//               <div className="modal-section">
//                 <h6>Observation & Misc</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <label>Date of Farm Observed</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.farmObservedDate} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedDate: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label>Time of Farm Observed</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.farmObservedTime} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Which species farmer cultured last time?</label>
//                     <input 
//                       className="form-control" 
//                       value={newPond.lastSpecies} 
//                       onChange={e => setNewPond({ ...newPond, lastSpecies: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Does farmer completely harvest the last crop?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.lastHarvestComplete} 
//                       onChange={e => setNewPond({ ...newPond, lastHarvestComplete: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any recent heavy rains or floods?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.recentRainFlood} 
//                       onChange={e => setNewPond({ ...newPond, recentRainFlood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any pesticide/chemical runoff near pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pesticideRunoff} 
//                       onChange={e => setNewPond({ ...newPond, pesticideRunoff: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any construction/activity near pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.constructionNear} 
//                       onChange={e => setNewPond({ ...newPond, constructionNear: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any sudden temperature change recently?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.suddenTempChange} 
//                       onChange={e => setNewPond({ ...newPond, suddenTempChange: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-12">
//                     <label>Notes / Remarks</label>
//                     <textarea 
//                       className="form-control" 
//                       rows={3} 
//                       value={newPond.notes} 
//                       onChange={e => setNewPond({ ...newPond, notes: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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



























// import React, { useState, useEffect } from "react";
// import api, { getImageUrl } from "../utils/api";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./mainPage.css";

// // Import Lucide icons
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2 } from "lucide-react";

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

// // ✅ FIXED: Helper function for farmer image
// // const getFarmerImage = (farmer) => {
// //   if (!farmer || !farmer.photo) return "/profile.png";
// //   return getImageUrl(farmer.photo);
// // };

// // Helper function update karo
// const getFarmerImage = (farmer) => {
//   if (!farmer || !farmer.photo) return "/profile.png";
  
//   // Debug line
//   console.log("Farmer photo path:", farmer.photo);
//   console.log("Full URL:", getImageUrl(farmer.photo));
  
//   return getImageUrl(farmer.photo);
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

//   // ✅ 1️⃣ Farmer form empty state - PHOTO FIELD ADDED
//   const emptyFarmer = {
//     name: "", contact: "", age: "", gender: "", village: "",
//     pondCount: "", adhar: "", familyMembers: "", familyOccupation: "",
//     photo: null,              // ✅ ADD THIS
//     photoExisting: ""         // ✅ UPDATE MODE ke liye
//   };

//   // Pond form empty state
//   const emptyPond = {
//     // Pond Details
//     pondArea: "", pondAreaUnit: "acre", pondDepth: "", pondImage: null,
//     overflow: "No", receivesSunlight: "Yes", treesOnBanks: "No",
//     neighbourhood: "Agriculture Farm", wastewaterEnters: "No",
//     // Species & files
//     species: "",
//     pondFiles: [],
//     fishFiles: [],
//     // Stocking & quantities
//     dateOfStocking: "", qtySeedInitially: "", currentQty: "", avgSize: ">200gram",
//     // Feed
//     feedType: "Market Feed", feedOther: "", feedFreq: "Once a day", 
//     feedQtyPerDay: "", feedTime: "6:00 am-10:00am",
//     recentFeedChanges: "", reducedAppetite: "No",
//     // Water quality
//     waterTemperature: "", pH: "", DO: "", ammoniaLevel: "Medium", 
//     phytoplanktonLevel: "Medium", waterHardness: "1",
//     algaeBloom: "No", pondWaterColor: "Light Green", sourceOfWater: "Rainwater",
//     // Disease / symptoms
//     diseaseSymptoms: "No", symptomsObserved: "", symptoms: [],
//     symptomsAffect: "All",
//     fishDeaths: "",
//     // Observation
//     farmObservedDate: "", farmObservedTime: "",
//     // misc
//     notes: "",
//     lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
//     pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No"
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
//     if (!userId) return console.error("UserId not found in localStorage");
//     fetchFarmers();
//     const savedLang = localStorage.getItem("lang");
//     if (savedLang) i18n.changeLanguage(savedLang);
//   }, []);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   // const fetchFarmers = async () => {
//   //   try {
//   //     setLoading(prev => ({ ...prev, fetchFarmers: true }));
//   //     const res = await api.get(`/api/farmers/all?userId=${userId}&includeShared=false`);
      
//   //     // ✅ FIXED: Sirf direct data set karo, koi normalize mat karo
//   //     setFarmers(res.data || []);
//   //   } catch (err) {
//   //     console.log("Fetch Farmers Error:", err);
//   //   } finally {
//   //     setLoading(prev => ({ ...prev, fetchFarmers: false }));
//   //   }
//   // };

//   const fetchFarmers = async () => {
//   try {
//     setLoading(prev => ({ ...prev, fetchFarmers: true }));
//     const res = await api.get(`/api/farmers/all?userId=${userId}&includeShared=false`);
    
//     // DEBUG: Check what data is coming
//     console.log("📊 Farmers data received:", res.data);
//     if (res.data && res.data.length > 0) {
//       console.log("📸 First farmer's photo path:", res.data[0].photo);
//       console.log("🔗 Full photo URL would be:", getImageUrl(res.data[0].photo));
//     }
    
//     setFarmers(res.data || []);
//   } catch (err) {
//     console.log("Fetch Farmers Error:", err);
//   } finally {
//     setLoading(prev => ({ ...prev, fetchFarmers: false }));
//   }
// };

//   // ✅ 3️⃣ Add Farmer API me photo FormData me bhejo
//   const addFarmer = async () => {
//     if (!newFarmer.name || !newFarmer.contact) return alert("Name and contact required");
    
//     const formData = new FormData();
    
//     // ✅ FIX: photo alag se handle karo
//     for (let key in newFarmer) {
//       if (key === "photo" || key === "photoExisting") continue;
//       formData.append(key, newFarmer[key] ?? "");
//     }
    
//     formData.append("userId", userId);
    
//     // ✅ IMPORTANT: photo file ko alag se append karo (CHECK File instance)
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
//       alert("Server error. See console.");
//     } finally {
//       setLoading(prev => ({ ...prev, addFarmer: false }));
//     }
//   };

//   // ✅ 4️⃣ Update Farmer API me bhi photo bhejo
//   const updateFarmer = async () => {
//     if (!editingFarmerId) return;
    
//     const formData = new FormData();
    
//     // ✅ FIX: photo alag se handle karo
//     for (let key in newFarmer) {
//       if (key === "photo" || key === "photoExisting") continue;
//       formData.append(key, newFarmer[key] ?? "");
//     }
    
//     formData.append("userId", userId);
    
//     // ✅ IMPORTANT: photo file ko alag se append karo (CHECK File instance)
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     }

//     try {
//       setLoading(prev => ({ ...prev, updateFarmer: true }));
//       const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // ✅ STEP 4: Update Farmer ke baad photo safe rakho
//       setFarmers(farmers.map(f =>
//         f._id === res.data._id
//           ? { ...res.data, photo: res.data.photo || f.photo }
//           : f
//       ));
      
//       setShowForm(false);
//       setEditingFarmerId(null);
//       setNewFarmer(emptyFarmer);
//       setIsUpdateMode(false);
//     } catch (err) {
//       console.error("Update Farmer Error:", err);
//       alert("Server error. See console.");
//     } finally {
//       setLoading(prev => ({ ...prev, updateFarmer: false }));
//     }
//   };

//   // Add Pond to Farmer
//   const addPond = async () => {
//     if (!currentFarmerId) return alert("Farmer ID missing");
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     const skipFiles = ["pondFiles", "fishFiles", "pondImage", "symptoms"];
//     for (let key in newPond) {
//       if (skipFiles.includes(key)) continue;
//       formData.append(key, newPond[key] ?? "");
//     }
//     formData.set("symptomsObserved", symptomsStr);

//     if (newPond.pondImage instanceof File) formData.append("pondImage", newPond.pondImage);
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
//       setLoading(prev => ({ ...prev, addPond: true }));
//       const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       // Update local state
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? res.data.farmer : f
//       ));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//     } catch (err) {
//       console.error("Add Pond Error:", err);
//       alert("Server error. See console.");
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

//     const skipFiles = ["pondFiles", "fishFiles", "pondImage", "symptoms"];
//     for (let key in newPond) {
//       if (skipFiles.includes(key)) continue;
//       formData.append(key, newPond[key] ?? "");
//     }
//     formData.set("symptomsObserved", symptomsStr);

//     if (newPond.pondImage instanceof File) formData.append("pondImage", newPond.pondImage);
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
      
//       // Update local state
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? res.data.farmer : f
//       ));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setEditingPondId(null);
//     } catch (err) {
//       console.error("Update Pond Error:", err);
//       alert("Server error. See console.");
//     } finally {
//       setLoading(prev => ({ ...prev, updatePond: false }));
//     }
//   };

//   // ✅ 5️⃣ Edit Farmer open karte waqt existing photo set karo
//   const openEdit = (farmer) => {
//     setIsUpdateMode(true);
//     const pre = { ...emptyFarmer };
//     Object.keys(pre).forEach(k => {
//       if (farmer[k] !== undefined && farmer[k] !== null) {
//         pre[k] = farmer[k];
//       }
//     });

//     // ✅ FIX: photo null rakho, photoExisting me existing photo
//     pre.photo = null;
//     pre.photoExisting = farmer.photo || ""; // ✅ ADD THIS

//     setNewFarmer(pre);
//     setEditingFarmerId(farmer._id);
//     setShowForm(true);
//   };

//   // Open Add Pond Form
//   const openAddPond = (farmerId) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(null);
//     setNewPond(emptyPond);
//     setShowPondForm(true);
//   };

//   // Open Edit Pond Form
//   const openEditPond = (farmerId, pond) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(pond.pondId);
    
//     const pre = { ...emptyPond };
//     Object.keys(pre).forEach(k => {
//       if (pond[k] !== undefined && pond[k] !== null) {
//         pre[k] = pond[k];
//       }
//     });

//     // Handle symptoms
//     if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
//       pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
//       pre.symptomsObserved = pond.symptomsObserved;
//     }

//     // ✅ FIX: files null rakho, existing alag se
//     pre.pondFiles = [];
//     pre.fishFiles = [];
//     pre.pondImage = null;
    
//     pre.pondFilesExisting = pond.pondFiles || [];
//     pre.fishFilesExisting = pond.fishFiles || [];
//     pre.pondImageExisting = pond.pondImage || "";

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

//   const renderExistingFiles = (list) => {
//     if (!list || list.length === 0) return null;
//     return (
//       <div style={{ marginTop: 6 }}>
//         {list.map((fn, i) => (
//           <div key={i}>
//             <a target="_blank" rel="noreferrer" href={getImageUrl(fn)}>
//               {fn.split('/').pop()}
//             </a>
//           </div>
//         ))}
//       </div>
//     );
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
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
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
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//               alt="User"
//               className="profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//                 e.target.onerror = null;
//               }}
//             />
//             <h5>{username}</h5>
//           </div>

//           {/* {isMobile && (
//             <button 
//               className="sidebar-close-btn"
//               onClick={() => setIsSidebarOpen(false)}
//               aria-label="Close menu"
//               disabled={loading.fetchFarmers}
//             >
//               <X size={20} />
//             </button>
//           )} */}
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
//           ) : (
//             farmers.map(f => (
//               <div key={f._id} className="farmer-box">
//                 {/* ✅ FIXED: Farmer image using corrected helper function */}
//                 <img
//                       // src={f.photo ? getImageUrl(f.photo) : "/profile.png"}
//                        src={getImageUrl(f.image)}
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
//               <h6>Farmer Details</h6>
//               <div className="row g-2">
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Name" 
//                     value={newFarmer.name} 
//                     onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Contact Number" 
//                     value={newFarmer.contact} 
//                     onChange={e => setNewFarmer({ ...newFarmer, contact: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>
                
//                 <div className="col-md-3">
//                   <input 
//                     type="number" 
//                     className="form-control" 
//                     placeholder="Age" 
//                     value={newFarmer.age} 
//                     onChange={e => setNewFarmer({ ...newFarmer, age: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Gender" 
//                     value={newFarmer.gender} 
//                     onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Aadhar" 
//                     value={newFarmer.adhar} 
//                     onChange={e => setNewFarmer({ ...newFarmer, adhar: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Members" 
//                     value={newFarmer.familyMembers} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyMembers: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Family Occupation" 
//                     value={newFarmer.familyOccupation} 
//                     onChange={e => setNewFarmer({ ...newFarmer, familyOccupation: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <input 
//                     className="form-control" 
//                     placeholder="Village" 
//                     value={newFarmer.village} 
//                     onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   />
//                 </div>

//                 {/* ✅ 2️⃣ Farmer form ke andar IMAGE INPUT add karo */}
//                 <div className="col-md-12">
//                   <label>Farmer Photo (max 5MB)</label>
//                   {/* <input
//                     type="file"
//                     accept="image/*"
//                     className="form-control"
//                     onChange={(e) =>
//                       setNewFarmer({ ...newFarmer, photo: e.target.files[0] })
//                     }
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                   /> */}

//                  <input
//   type="file"
//   className="form-control"
//   accept="image/*,video/*"
//   capture="environment"
//   onChange={(e) =>
//     setNewFarmer({ ...newFarmer, photo: e.target.files[0] })
//   }
//   disabled={loading.addFarmer || loading.updateFarmer}
// />



//                   {/* ✅ UPDATE MODE me existing photo */}
//                   {newFarmer.photoExisting && (
//                     <div style={{ marginTop: 6 }}>
//                       <img
//                         src={getImageUrl(newFarmer.photoExisting)}
//                         alt="Existing Farmer"
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
//                 <h6>Pond Details</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond area (eg. 1 acre)" 
//                       value={newPond.pondArea} 
//                       onChange={e => setNewPond({ ...newPond, pondArea: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-2">
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondAreaUnit} 
//                       onChange={e => setNewPond({ ...newPond, pondAreaUnit: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option value="acre">acre</option>
//                       <option value="hectare">hectare</option>
//                       <option value="footsquare">footsquare</option>
//                     </select>
//                   </div>
//                   <div className="col-md-4">
//                     <input 
//                       className="form-control" 
//                       placeholder="Pond depth (ft)" 
//                       value={newPond.pondDepth} 
//                       onChange={e => setNewPond({ ...newPond, pondDepth: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond image (GPS) - max 10MB</label>
//                     {/* <input 
//                       type="file" 
//                       accept="image/*" 
//                       className="form-control" 
//                       onChange={e => setNewPond({ ...newPond, pondImage: e.target.files[0] })}
//                       disabled={loading.addPond || loading.updatePond}
//                     /> */}

// <input 
//   type="file"
//   className="form-control"
//   accept="image/*,video/*"
//   capture="environment"
//   onChange={e =>
//     setNewPond({ ...newPond, pondImage: e.target.files[0] })
//   }
//   disabled={loading.addPond || loading.updatePond}
// />



//                     {newPond.pondImageExisting && <div style={{ marginTop: 6 }}>
//                       <a target="_blank" rel="noreferrer" href={getImageUrl(newPond.pondImageExisting)}>
//                         Existing: {newPond.pondImageExisting.split('/').pop()}
//                       </a>
//                     </div>}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload Pond Picture/Video (up to 5, 100MB each)</label>
//                     {/* <input 
//                       type="file" 
//                       className="form-control" 
//                       multiple 
//                       onChange={e => setNewPond({ ...newPond, pondFiles: Array.from(e.target.files) })}
//                       disabled={loading.addPond || loading.updatePond}
//                     /> */}


// <input 
//   type="file"
//   className="form-control"
//   accept="image/*,video/*"
//   capture="environment"
//   multiple
//   onChange={e =>
//     setNewPond({ ...newPond, pondFiles: Array.from(e.target.files) })
//   }
//   disabled={loading.addPond || loading.updatePond}
// />





                    
//                     {renderExistingFiles(newPond.pondFilesExisting)}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Overflow from somewhere in pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.overflow} 
//                       onChange={e => setNewPond({ ...newPond, overflow: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Pond receives proper Sunlight?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.receivesSunlight} 
//                       onChange={e => setNewPond({ ...newPond, receivesSunlight: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Trees present on banks?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.treesOnBanks} 
//                       onChange={e => setNewPond({ ...newPond, treesOnBanks: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Neighbourhood</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.neighbourhood} 
//                       onChange={e => setNewPond({ ...newPond, neighbourhood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Agriculture Farm</option>
//                       <option>Pond</option>
//                       <option>Road</option>
//                       <option>Residential Area</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Does wastewater enter pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.wastewaterEnters} 
//                       onChange={e => setNewPond({ ...newPond, wastewaterEnters: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Species & Stocking */}
//               <div className="modal-section">
//                 <h6>Species & Stocking</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Fish Species Cultured" 
//                       value={newPond.species} 
//                       onChange={e => setNewPond({ ...newPond, species: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label>Date of Stocking</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.dateOfStocking} 
//                       onChange={e => setNewPond({ ...newPond, dateOfStocking: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   {/* <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="Quantity of Seed initially in Pond" 
//                       value={newPond.qtySeedInitially} 
//                       onChange={e => setNewPond({ ...newPond, qtySeedInitially: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Current Quantity of Fish in Pond" 
//                       value={newPond.currentQty} 
//                       onChange={e => setNewPond({ ...newPond, currentQty: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div> */}


// <div className="col-md-6">
//   <input 
//     type="text"
//     className="form-control" 
//     placeholder="Quantity of Seed initially in Pond (eg: 1100 or 13kg)" 
//     value={newPond.qtySeedInitially} 
//     onChange={e => setNewPond({ ...newPond, qtySeedInitially: e.target.value })}
//     disabled={loading.addPond || loading.updatePond}
//   />
// </div>
// <div className="col-md-6">
//   <input 
//     type="text"
//     className="form-control" 
//     placeholder="Current Quantity of Fish in Pond (eg: 900 or 12kg)" 
//     value={newPond.currentQty} 
//     onChange={e => setNewPond({ ...newPond, currentQty: e.target.value })}
//     disabled={loading.addPond || loading.updatePond}
//   />
// </div>




//                   <div className="col-md-6">
//                     <label>Average size of fishes</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.avgSize} 
//                       onChange={e => setNewPond({ ...newPond, avgSize: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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
//                 <h6>Feed Details</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <label>Feed Type Used</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedType} 
//                       onChange={e => setNewPond({ ...newPond, feedType: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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
//                     <label>Feed frequency</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.feedFreq} 
//                       onChange={e => setNewPond({ ...newPond, feedFreq: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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
//                       placeholder="Feed quantity given per day (in kg)" 
//                       value={newPond.feedQtyPerDay} 
//                       onChange={e => setNewPond({ ...newPond, feedQtyPerDay: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Approx time of feeding</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.feedTime} 
//                       onChange={e => setNewPond({ ...newPond, feedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       className="form-control" 
//                       placeholder="Any recent changes in feed or feeding behaviour" 
//                       value={newPond.recentFeedChanges} 
//                       onChange={e => setNewPond({ ...newPond, recentFeedChanges: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Do fish show reduced appetite?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.reducedAppetite} 
//                       onChange={e => setNewPond({ ...newPond, reducedAppetite: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option>
//                       <option>No</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Water Quality */}
//               <div className="modal-section">
//                 <h6>Water Quality</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="Water Temp (°C)" 
//                       value={newPond.waterTemperature} 
//                       onChange={e => setNewPond({ ...newPond, waterTemperature: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="pH measured" 
//                       value={newPond.pH} 
//                       onChange={e => setNewPond({ ...newPond, pH: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <input 
//                       className="form-control" 
//                       placeholder="DO measured" 
//                       value={newPond.DO} 
//                       onChange={e => setNewPond({ ...newPond, DO: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <label>Ammonia (NH₃) Level</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.ammoniaLevel} 
//                       onChange={e => setNewPond({ ...newPond, ammoniaLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Phytoplankton Levels</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.phytoplanktonLevel} 
//                       onChange={e => setNewPond({ ...newPond, phytoplanktonLevel: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Water Hardness</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.waterHardness} 
//                       onChange={e => setNewPond({ ...newPond, waterHardness: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Any visible algae bloom?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.algaeBloom} 
//                       onChange={e => setNewPond({ ...newPond, algaeBloom: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Pond Water Colour</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pondWaterColor} 
//                       onChange={e => setNewPond({ ...newPond, pondWaterColor: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Light Green</option><option>Dark Green</option><option>Yellowish Green</option>
//                       <option>Brownish Green</option><option>Yellow</option><option>Muddy Brown</option>
//                       <option>Black</option><option>Other</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Source of Water</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.sourceOfWater} 
//                       onChange={e => setNewPond({ ...newPond, sourceOfWater: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Rainwater</option><option>Pump</option><option>River</option><option>Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Disease & Symptoms */}
//               <div className="modal-section">
//                 <h6>Disease & Symptoms</h6>
//                 <div className="row g-2">
//                   <div className="col-md-3">
//                     <label>Any disease symptoms?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.diseaseSymptoms} 
//                       onChange={e => setNewPond({ ...newPond, diseaseSymptoms: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   {/* UPDATED SYMPTOMS SECTION */}
//                   <div className="col-md-12">
//                     <label>Symptoms observed (check / or type)</label>
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
//                         placeholder="Or type symptoms comma separated" 
//                         value={newPond.symptomsObserved} 
//                         onChange={e => setNewPond({ ...newPond, symptomsObserved: e.target.value })}
//                         disabled={loading.addPond || loading.updatePond}
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     <input 
//                       type="number" 
//                       className="form-control" 
//                       placeholder="How many fish have died (cumulative)?" 
//                       value={newPond.fishDeaths} 
//                       onChange={e => setNewPond({ ...newPond, fishDeaths: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Are symptoms affecting all fish or only a few?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.symptomsAffect} 
//                       onChange={e => setNewPond({ ...newPond, symptomsAffect: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>All</option><option>Few</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload fish images/videos (up to 5)</label>
//                     {/* <input 
//                       type="file" 
//                       className="form-control" 
//                       multiple 
//                       onChange={e => setNewPond({ ...newPond, fishFiles: Array.from(e.target.files) })}
//                       disabled={loading.addPond || loading.updatePond}
//                     /> */}

// <input
//   type="file"
//   accept="image/*,video/*"
//   capture="environment"
//   multiple
//   className="form-control"
//   onChange={e =>
//     setNewPond({
//       ...newPond,
//       fishFiles: Array.from(e.target.files)
//     })
//   }
//   disabled={loading.addPond || loading.updatePond}
// />


//                     {renderExistingFiles(newPond.fishFilesExisting)}
//                   </div>
//                 </div>
//               </div>

//               {/* Observation & Misc */}
//               <div className="modal-section">
//                 <h6>Observation & Misc</h6>
//                 <div className="row g-2">
//                   <div className="col-md-4">
//                     <label>Date of Farm Observed</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={newPond.farmObservedDate} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedDate: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label>Time of Farm Observed</label>
//                     <input 
//                       type="time" 
//                       className="form-control" 
//                       value={newPond.farmObservedTime} 
//                       onChange={e => setNewPond({ ...newPond, farmObservedTime: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Which species farmer cultured last time?</label>
//                     <input 
//                       className="form-control" 
//                       value={newPond.lastSpecies} 
//                       onChange={e => setNewPond({ ...newPond, lastSpecies: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label>Does farmer completely harvest the last crop?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.lastHarvestComplete} 
//                       onChange={e => setNewPond({ ...newPond, lastHarvestComplete: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any recent heavy rains or floods?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.recentRainFlood} 
//                       onChange={e => setNewPond({ ...newPond, recentRainFlood: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any pesticide/chemical runoff near pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.pesticideRunoff} 
//                       onChange={e => setNewPond({ ...newPond, pesticideRunoff: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any construction/activity near pond?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.constructionNear} 
//                       onChange={e => setNewPond({ ...newPond, constructionNear: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-4">
//                     <label>Any sudden temperature change recently?</label>
//                     <select 
//                       className="form-control" 
//                       value={newPond.suddenTempChange} 
//                       onChange={e => setNewPond({ ...newPond, suddenTempChange: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
//                     >
//                       <option>Yes</option><option>No</option>
//                     </select>
//                   </div>

//                   <div className="col-md-12">
//                     <label>Notes / Remarks</label>
//                     <textarea 
//                       className="form-control" 
//                       rows={3} 
//                       value={newPond.notes} 
//                       onChange={e => setNewPond({ ...newPond, notes: e.target.value })}
//                       disabled={loading.addPond || loading.updatePond}
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












// uper vala code sahi hai 




// import React, { useState, useEffect } from "react";
// import api, { getImageUrl } from "../utils/api";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./mainPage.css";

// // Import Lucide icons
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2 } from "lucide-react";

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



// // Helper function for farmer image - FIXED
// const getFarmerImage = (farmer) => {
//   if (!farmer) return "/profile.png";
  
//   if (farmer.photo) {
//     const url = getImageUrl(farmer.photo);
//     console.log(`Farmer ${farmer.name} photo URL:`, url);
//     return url;
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

//   // Farmer form empty state - ALL FIELDS INCLUDED AS PER SCHEMA
//   const emptyFarmer = {
//     name: "", contact: "", age: "", gender: "", village: "",
//     pondCount: "0", adhar: "", familyMembers: "", familyOccupation: "",
//     photo: null,
//     photoExisting: "",
//     // Farmer level files (required in schema)
//     pondFiles: [],
//     fishFiles: []
//   };

//   // Pond form empty state - ALL FIELDS INCLUDED AS PER SCHEMA
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
//     // Observation
//     farmObservedDate: "", farmObservedTime: "",
//     // History & Environment
//     lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
//     pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No",
//     // Notes
//     notes: "",
//     // Files (required in schema)
//     pondFiles: [],
//     fishFiles: []
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
//     if (!userId) return console.error("UserId not found in localStorage");
//     fetchFarmers();
//     const savedLang = localStorage.getItem("lang");
//     if (savedLang) i18n.changeLanguage(savedLang);
//   }, []);

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
//       const res = await api.get(`/api/farmers/all?userId=${userId}&includeShared=false`);
      
//       console.log("Farmers data received:", res.data);
//       if (res.data && res.data.length > 0) {
//         console.log("First farmer's photo path:", res.data[0].photo);
//         console.log("First farmer object:", res.data[0]);
    
//       console.log("Constructed URL:", getImageUrl(res.data[0].photo));
//       }
      
//       setFarmers(res.data || []);
//     } catch (err) {
//       console.log("Fetch Farmers Error:", err);
//     } finally {
//       setLoading(prev => ({ ...prev, fetchFarmers: false }));
//     }
//   };

//   // Add Farmer with ALL REQUIRED FIELDS
//   const addFarmer = async () => {
//     // Check required fields
//     if (!newFarmer.name || !newFarmer.contact || !newFarmer.age || 
//         !newFarmer.gender || !newFarmer.adhar || !newFarmer.familyMembers || 
//         !newFarmer.familyOccupation || !newFarmer.village) {
//       return alert("Please fill all required fields: Name, Contact, Age, Gender, Aadhar, Family Members, Family Occupation, Village");
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
    
//     // Handle photo (required)
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     } else {
//       return alert("Farmer photo is required");
//     }
    
//     // Handle farmer level files (required in schema)
//     if (newFarmer.pondFiles && newFarmer.pondFiles.length > 0) {
//       newFarmer.pondFiles.forEach((file, index) => {
//         if (file instanceof File) {
//           formData.append(`pondFiles`, file);
//         }
//       });
//     } else {
//       // If no files, add empty array
//       formData.append("pondFiles", JSON.stringify([]));
//     }
    
//     if (newFarmer.fishFiles && newFarmer.fishFiles.length > 0) {
//       newFarmer.fishFiles.forEach((file, index) => {
//         if (file instanceof File) {
//           formData.append(`fishFiles`, file);
//         }
//       });
//     } else {
//       formData.append("fishFiles", JSON.stringify([]));
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
//       alert("Server error: " + (err.response?.data?.message || err.message));
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
    
//     // Handle photo
//     if (newFarmer.photo instanceof File) {
//       formData.append("photo", newFarmer.photo);
//     } else if (newFarmer.photoExisting) {
//       // Keep existing photo if no new one uploaded
//       formData.append("photo", newFarmer.photoExisting);
//     }

//     try {
//       setLoading(prev => ({ ...prev, updateFarmer: true }));
//       const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       setFarmers(farmers.map(f =>
//         f._id === res.data._id
//           ? { ...res.data, photo: res.data.photo || f.photo }
//           : f
//       ));
      
//       setShowForm(false);
//       setEditingFarmerId(null);
//       setNewFarmer(emptyFarmer);
//       setIsUpdateMode(false);
//     } catch (err) {
//       console.error("Update Farmer Error:", err);
//       alert("Server error: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updateFarmer: false }));
//     }
//   };

//   // Add Pond to Farmer with ALL REQUIRED FIELDS
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
    
//     const formData = new FormData();
//     const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
//       ? newPond.symptoms.join(", ")
//       : (newPond.symptomsObserved || "");

//     // Add all pond fields
//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
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
    
//     formData.set("symptomsObserved", symptomsStr);

//     // Handle required files
//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     } else {
//       return alert("Pond image is required");
//     }

//     // Handle pond files (required)
//     if (newPond.pondFiles && newPond.pondFiles.length > 0) {
//       newPond.pondFiles.forEach((f) => {
//         if (f instanceof File) formData.append("pondFiles", f);
//       });
//     } else {
//       formData.append("pondFiles", JSON.stringify([]));
//     }

//     // Handle fish files (required)
//     if (newPond.fishFiles && newPond.fishFiles.length > 0) {
//       newPond.fishFiles.forEach((f) => {
//         if (f instanceof File) formData.append("fishFiles", f);
//       });
//     } else {
//       formData.append("fishFiles", JSON.stringify([]));
//     }

//     try {
//       setLoading(prev => ({ ...prev, addPond: true }));
//       const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? res.data.farmer : f
//       ));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//     } catch (err) {
//       console.error("Add Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.message || err.message));
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

//     // Add all pond fields
//     const pondFields = [
//       'pondArea', 'pondAreaUnit', 'pondDepth',
//       'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//       'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//       'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
//       'recentFeedChanges', 'reducedAppetite',
//       'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
//       'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//       'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
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
    
//     formData.set("symptomsObserved", symptomsStr);

//     // Handle files - only append if new ones are uploaded
//     if (newPond.pondImage instanceof File) {
//       formData.append("pondImage", newPond.pondImage);
//     } else if (newPond.pondImageExisting) {
//       formData.append("pondImage", newPond.pondImageExisting);
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
      
//       setFarmers(farmers.map(f => 
//         f._id === currentFarmerId ? res.data.farmer : f
//       ));
//       setShowPondForm(false);
//       setNewPond(emptyPond);
//       setCurrentFarmerId(null);
//       setEditingPondId(null);
//     } catch (err) {
//       console.error("Update Pond Error:", err);
//       alert("Server error: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(prev => ({ ...prev, updatePond: false }));
//     }
//   };

//   // Edit Farmer
//   const openEdit = (farmer) => {
//     setIsUpdateMode(true);
//     const pre = { ...emptyFarmer };
//     Object.keys(pre).forEach(k => {
//       if (farmer[k] !== undefined && farmer[k] !== null) {
//         pre[k] = farmer[k];
//       }
//     });

//     pre.photo = null;
//     pre.photoExisting = farmer.photo || "";

//     setNewFarmer(pre);
//     setEditingFarmerId(farmer._id);
//     setShowForm(true);
//   };

//   // Open Add Pond Form
//   const openAddPond = (farmerId) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(null);
//     setNewPond(emptyPond);
//     setShowPondForm(true);
//   };

//   // Open Edit Pond Form
//   const openEditPond = (farmerId, pond) => {
//     setCurrentFarmerId(farmerId);
//     setEditingPondId(pond.pondId);
    
//     const pre = { ...emptyPond };
//     Object.keys(pre).forEach(k => {
//       if (pond[k] !== undefined && pond[k] !== null) {
//         pre[k] = pond[k];
//       }
//     });

//     // Handle symptoms
//     if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
//       pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
//       pre.symptomsObserved = pond.symptomsObserved;
//     }

//     // Keep existing files
//     pre.pondFiles = [];
//     pre.fishFiles = [];
//     pre.pondImage = null;
    
//     pre.pondFilesExisting = pond.pondFiles || [];
//     pre.fishFilesExisting = pond.fishFiles || [];
//     pre.pondImageExisting = pond.pondImage || "";

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

//   const renderExistingFiles = (list) => {
//     if (!list || list.length === 0) return null;
//     return (
//       <div style={{ marginTop: 6 }}>
//         {list.map((fn, i) => (
//           <div key={i}>
//             <a target="_blank" rel="noreferrer" href={getImageUrl(fn)}>
//               {fn.split('/').pop()}
//             </a>
//           </div>
//         ))}
//       </div>
//     );
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
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
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
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
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

//                 <div className="col-md-3">
//                   <input 
//                     className="form-control" 
//                     placeholder="Gender *" 
//                     value={newFarmer.gender} 
//                     onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required
//                   />
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
//                     placeholder="Village *" 
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
//                     onChange={(e) =>
//                       setNewFarmer({ ...newFarmer, photo: e.target.files[0] })
//                     }
//                     disabled={loading.addFarmer || loading.updateFarmer}
//                     required={!isUpdateMode}
//                   />

//                   {/* UPDATE MODE me existing photo */}
//                   {newFarmer.photoExisting && (
//                     <div style={{ marginTop: 6 }}>
//                       <img
//                         // src={getImageUrl(newFarmer.photoExisting)}
                       
//   src={getImageUrl(farmer.photo)}
//   alt={farmer.name}
  


                       
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
//                       onChange={e =>
//                         setNewPond({ ...newPond, pondImage: e.target.files[0] })
//                       }
//                       disabled={loading.addPond || loading.updatePond}
//                       required={!editingPondId}
//                     />

//                     {newPond.pondImageExisting && <div style={{ marginTop: 6 }}>
//                       <a target="_blank" rel="noreferrer" href={getImageUrl(newPond.pondImageExisting)}>
//                         Existing: {newPond.pondImageExisting.split('/').pop()}
//                       </a>
//                     </div>}
//                   </div>

//                   <div className="col-md-6">
//                     <label>Upload Pond Picture/Video (required) *</label>
//                     <input 
//                       type="file"
//                       className="form-control"
//                       accept="image/*,video/*"
//                       capture="environment"
//                       multiple
//                       onChange={e =>
//                         setNewPond({ ...newPond, pondFiles: Array.from(e.target.files) })
//                       }
//                       disabled={loading.addPond || loading.updatePond}
//                     />
                    
//                     {renderExistingFiles(newPond.pondFilesExisting)}
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
//                       placeholder="How many fish have died (cumulative)? *" 
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
//                       onChange={e =>
//                         setNewPond({
//                           ...newPond,
//                           fishFiles: Array.from(e.target.files)
//                         })
//                       }
//                       disabled={loading.addPond || loading.updatePond}
//                     />
//                     {renderExistingFiles(newPond.fishFilesExisting)}
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






















//buffer ke liye
import React, { useState, useEffect } from "react";
// import api from "../utils/api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mainPage.css";
import { getProfileImage } from "../utils/profileImage";
// jahan tu <img> use kar raha hai
import api, { getImageUrl } from "../utils/api"; // path check kar le

// Import Lucide icons
import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader2 } from "lucide-react";

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
  "Erratic swimming", 
  "Loss of appetite",
  "Gasping at surface",
  "Lesions or ulcers",
  "Fin rot",
  "Fish Lice",
  "Discoloration or white patches",
  "Scale loss",
  "Swollen abdomen",
  "Fungal/cotton-like growth",
  "Flared gills",
  "Mucus secretion",
  "Blood spots",
  "Other"
];

// Helper function to convert buffer to base64 URL
const bufferToBase64 = (bufferData) => {
  if (!bufferData) return "/profile.png";
  
  try {
    // If it's already a base64 string or URL
    if (typeof bufferData === 'string') {
      if (bufferData.startsWith('data:')) {
        return bufferData;
      }
      // Try to parse as base64
      return `data:image/jpeg;base64,${bufferData}`;
    }
    
    // If it's a Buffer object
    if (bufferData.data && Array.isArray(bufferData.data)) {
      const base64 = btoa(
        new Uint8Array(bufferData.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:image/jpeg;base64,${base64}`;
    }
    
    // If it's an array (Buffer array)
    if (Array.isArray(bufferData)) {
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

// Helper function for farmer image
const getFarmerImage = (farmer) => {
  if (!farmer) return "/profile.png";
  
  // If photo is a buffer, convert to base64
  if (farmer.photo) {
    return bufferToBase64(farmer.photo);
  }
  
  // If photo is stored as base64 string in the database
  if (typeof farmer.photo === 'string' && farmer.photo.startsWith('data:')) {
    return farmer.photo;
  }
  
  return "/profile.png";
};

// Helper function for pond image
const getPondImage = (pond) => {
  if (!pond) return "/profile.png";
  
  if (pond.pondImage) {
    return bufferToBase64(pond.pondImage);
  }
  
  if (typeof pond.pondImage === 'string' && pond.pondImage.startsWith('data:')) {
    return pond.pondImage;
  }
  
  return "/profile.png";
};

function MainPage() {
  const { t, i18n } = useTranslation();
  const username = localStorage.getItem("username") || "User";
  const photo = localStorage.getItem("photo") || "/profile.png";
  const userId = localStorage.getItem("userId");

  const [farmers, setFarmers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPondForm, setShowPondForm] = useState(false);
  const [editingFarmerId, setEditingFarmerId] = useState(null);
  const [editingPondId, setEditingPondId] = useState(null);
  const [currentFarmerId, setCurrentFarmerId] = useState(null);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  
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

  // Farmer form empty state
  const emptyFarmer = {
    name: "", contact: "", age: "", gender: "", village: "",
    pondCount: "0", adhar: "", familyMembers: "", familyOccupation: "",
    photo: null,
    photoBuffer: null, // Store existing photo buffer
  };

  // Pond form empty state
  const emptyPond = {
    // Pond Details
    pondArea: "", pondAreaUnit: "acre", pondDepth: "", pondImage: null,
    overflow: "No", receivesSunlight: "Yes", treesOnBanks: "No",
    neighbourhood: "Agriculture Farm", wastewaterEnters: "No",
    // Species & Stocking
    species: "", dateOfStocking: "", qtySeedInitially: "", 
    currentQty: "", avgSize: ">200gram",
    // Feed Details
    feedType: "Market Feed", feedOther: "", feedFreq: "Once a day", 
    feedQtyPerDay: "", feedTime: "6:00 am-10:00am",
    recentFeedChanges: "", reducedAppetite: "No",
    // Water Quality
    waterTemperature: "", pH: "", DO: "", ammoniaLevel: "Medium", 
    phytoplanktonLevel: "Medium", waterHardness: "1",
    algaeBloom: "No", pondWaterColor: "Light Green", sourceOfWater: "Rainwater",
    // Disease & Symptoms
    diseaseSymptoms: "No", symptomsObserved: "", symptoms: [],
    symptomsAffect: "All", fishDeaths: "",
    // Observation
    farmObservedDate: "", farmObservedTime: "",
    // History & Environment
    lastSpecies: "", lastHarvestComplete: "Yes", recentRainFlood: "No",
    pesticideRunoff: "No", constructionNear: "No", suddenTempChange: "No",
    // Notes
    notes: "",
    // Files
    pondFiles: [],
    fishFiles: [],
    // Store existing buffers
    pondImageBuffer: null,
    pondFilesBuffers: [],
    fishFilesBuffers: []
  };

  const [newFarmer, setNewFarmer] = useState(emptyFarmer);
  const [newPond, setNewPond] = useState(emptyPond);

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

  const fetchFarmers = async () => {
    try {
      setLoading(prev => ({ ...prev, fetchFarmers: true }));
      const res = await api.get(`/api/farmers/all?userId=${userId}`);
      
      console.log("Farmers data received:", res.data);
      setFarmers(res.data || []);
    } catch (err) {
      console.error("Fetch Farmers Error:", err);
      alert("Error fetching farmers: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(prev => ({ ...prev, fetchFarmers: false }));
    }
  };

  // Convert File to Base64 for preview
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Add Farmer
  const addFarmer = async () => {
    // Check required fields
    if (!newFarmer.name || !newFarmer.contact || !newFarmer.age || 
        !newFarmer.gender || !newFarmer.adhar || !newFarmer.familyMembers || 
        !newFarmer.familyOccupation || !newFarmer.village) {
      return alert("Please fill all required fields: Name, Contact, Age, Gender, Aadhar, Family Members, Family Occupation, Village");
    }
    
    if (!newFarmer.photo) {
      return alert("Farmer photo is required");
    }
    
    const formData = new FormData();
    
    // Add all farmer fields
    const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
                         'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
    farmerFields.forEach(field => {
      if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
        formData.append(field, newFarmer[field].toString());
      }
    });
    
    formData.append("userId", userId);
    formData.append("createdBy", userId);
    
    // Handle photo
    if (newFarmer.photo instanceof File) {
      formData.append("photo", newFarmer.photo);
    } else if (newFarmer.photo) {
      // If it's a base64 string, convert to blob
      const base64Response = await fetch(newFarmer.photo);
      const blob = await base64Response.blob();
      formData.append("photo", blob, "photo.jpg");
    }
    
    // Handle farmer level files
    if (newFarmer.pondFiles && newFarmer.pondFiles.length > 0) {
      newFarmer.pondFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("pondFiles", file);
        }
      });
    }
    
    if (newFarmer.fishFiles && newFarmer.fishFiles.length > 0) {
      newFarmer.fishFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("fishFiles", file);
        }
      });
    }

    try {
      setLoading(prev => ({ ...prev, addFarmer: true }));
      const res = await api.post(`/api/farmers/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Convert photo buffer to base64 for display
      const farmerWithPhoto = {
        ...res.data,
        photo: bufferToBase64(res.data.photo)
      };
      
      setFarmers([...farmers, farmerWithPhoto]);
      setShowForm(false);
      setNewFarmer(emptyFarmer);
      // alert("Farmer added successfully!");
    } catch (err) {
      console.error("Add Farmer Error:", err);
      alert("Server error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(prev => ({ ...prev, addFarmer: false }));
    }
  };

  // Update Farmer
  const updateFarmer = async () => {
    if (!editingFarmerId) return;
    
    const formData = new FormData();
    
    // Add all farmer fields
    const farmerFields = ['name', 'contact', 'age', 'gender', 'adhar', 
                         'familyMembers', 'familyOccupation', 'village', 'pondCount'];
    
    farmerFields.forEach(field => {
      if (newFarmer[field] !== undefined && newFarmer[field] !== null) {
        formData.append(field, newFarmer[field].toString());
      }
    });
    
    formData.append("userId", userId);
    
    // Handle photo - only update if new photo is uploaded
    if (newFarmer.photo instanceof File) {
      formData.append("photo", newFarmer.photo);
    }
    // If no new photo, server will keep the existing one

    try {
      setLoading(prev => ({ ...prev, updateFarmer: true }));
      const res = await api.put(`/api/farmers/update/${editingFarmerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Convert photo buffer to base64 for display
      const updatedFarmer = {
        ...res.data,
        photo: bufferToBase64(res.data.photo)
      };
      
      setFarmers(farmers.map(f =>
        f._id === res.data._id ? updatedFarmer : f
      ));
      
      setShowForm(false);
      setEditingFarmerId(null);
      setNewFarmer(emptyFarmer);
      setIsUpdateMode(false);
      // alert("Farmer updated successfully!");
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
    
    // Validate required fields
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
    
    if (!newPond.pondImage) {
      return alert("Pond image is required");
    }
    
    const formData = new FormData();
    const symptomsStr = (newPond.symptoms && newPond.symptoms.length > 0)
      ? newPond.symptoms.join(", ")
      : (newPond.symptomsObserved || "");

    // Add all pond fields
    const pondFields = [
      'pondArea', 'pondAreaUnit', 'pondDepth',
      'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
      'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
      'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
      'recentFeedChanges', 'reducedAppetite',
      'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
      'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
      'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
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

    // Handle required files
    if (newPond.pondImage instanceof File) {
      formData.append("pondImage", newPond.pondImage);
    } else if (newPond.pondImage) {
      // If it's a base64 string, convert to blob
      const base64Response = await fetch(newPond.pondImage);
      const blob = await base64Response.blob();
      formData.append("pondImage", blob, "pondImage.jpg");
    }

    // Handle pond files
    if (newPond.pondFiles && newPond.pondFiles.length > 0) {
      newPond.pondFiles.forEach((f) => {
        if (f instanceof File) formData.append("pondFiles", f);
      });
    }

    // Handle fish files
    if (newPond.fishFiles && newPond.fishFiles.length > 0) {
      newPond.fishFiles.forEach((f) => {
        if (f instanceof File) formData.append("fishFiles", f);
      });
    }

    try {
      setLoading(prev => ({ ...prev, addPond: true }));
      const res = await api.post(`/api/farmers/add-pond/${currentFarmerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Convert pond image buffers to base64 for display
      const updatedPonds = res.data.farmer.ponds.map(pond => ({
        ...pond,
        pondImage: bufferToBase64(pond.pondImage)
      }));
      
      const updatedFarmer = {
        ...res.data.farmer,
        ponds: updatedPonds
      };
      
      setFarmers(farmers.map(f => 
        f._id === currentFarmerId ? updatedFarmer : f
      ));
      
      setShowPondForm(false);
      setNewPond(emptyPond);
      setCurrentFarmerId(null);
      // alert("Pond added successfully!");
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

    // Add all pond fields
    const pondFields = [
      'pondArea', 'pondAreaUnit', 'pondDepth',
      'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
      'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
      'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime', 
      'recentFeedChanges', 'reducedAppetite',
      'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel', 
      'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
      'diseaseSymptoms', 'symptomsAffect', 'fishDeaths',
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

    // Handle files - only append if new ones are uploaded
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

    try {
      setLoading(prev => ({ ...prev, updatePond: true }));
      const res = await api.put(`/api/farmers/update-pond/${currentFarmerId}/${editingPondId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Convert pond image buffers to base64 for display
      const updatedPonds = res.data.farmer.ponds.map(pond => ({
        ...pond,
        pondImage: bufferToBase64(pond.pondImage)
      }));
      
      const updatedFarmer = {
        ...res.data.farmer,
        ponds: updatedPonds
      };
      
      setFarmers(farmers.map(f => 
        f._id === currentFarmerId ? updatedFarmer : f
      ));
      
      setShowPondForm(false);
      setNewPond(emptyPond);
      setCurrentFarmerId(null);
      setEditingPondId(null);
      // alert("Pond updated successfully!");
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
    const pre = { ...emptyFarmer };
    
    // Copy all farmer data
    Object.keys(pre).forEach(k => {
      if (farmer[k] !== undefined && farmer[k] !== null) {
        pre[k] = farmer[k];
      }
    });

    // Store existing photo buffer and set photo preview
    pre.photoBuffer = farmer.photo;
    pre.photo = getFarmerImage(farmer); // Convert to base64 for preview

    setNewFarmer(pre);
    setEditingFarmerId(farmer._id);
    setShowForm(true);
  };

  // Open Add Pond Form
  const openAddPond = (farmerId) => {
    setCurrentFarmerId(farmerId);
    setEditingPondId(null);
    setNewPond(emptyPond);
    setShowPondForm(true);
  };

  // Open Edit Pond Form
  const openEditPond = async (farmerId, pond) => {
    setCurrentFarmerId(farmerId);
    setEditingPondId(pond.pondId);
    
    const pre = { ...emptyPond };
    
    // Copy all pond data
    Object.keys(pre).forEach(k => {
      if (pond[k] !== undefined && pond[k] !== null && k !== 'pondImage') {
        pre[k] = pond[k];
      }
    });

    // Handle symptoms
    if (typeof pond.symptomsObserved === "string" && pond.symptomsObserved.trim() !== "") {
      pre.symptoms = pond.symptomsObserved.split(",").map(s => s.trim()).filter(Boolean);
      pre.symptomsObserved = pond.symptomsObserved;
    }

    // Store existing buffers and set previews
    pre.pondImageBuffer = pond.pondImage;
    pre.pondImage = getPondImage(pond); // Convert to base64 for preview
    
    pre.pondFilesBuffers = pond.pondFiles || [];
    pre.fishFilesBuffers = pond.fishFiles || [];

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

  // Handle photo file change for farmer
  const handleFarmerPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setNewFarmer({ ...newFarmer, photo: base64 });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        setNewFarmer({ ...newFarmer, photo: file });
      }
    }
  };

  // Handle pond image file change
  const handlePondImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setNewPond({ ...newPond, pondImage: base64 });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        setNewPond({ ...newPond, pondImage: file });
      }
    }
  };

  // Handle pond files change
  const handlePondFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewPond({ ...newPond, pondFiles: files });
  };

  // Handle fish files change
  const handleFishFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewPond({ ...newPond, fishFiles: files });
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
        f.farmerId.toLowerCase().includes(searchId.toLowerCase())
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

  // Loader component for buttons
  const ButtonLoader = () => (
    <Loader2 className="spin-loader" size={16} />
  );

  return (
    <div className="dashboard-container">
      {/* ================= MOBILE NAVBAR ================= */}
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
              // src={photo}
                // src={getImageUrl(userId, "profile")}
                src={getProfileImage(userId)}
              alt="User"
              className="mobile-profile-pic"
              onError={(e) => {
                e.target.src = "/profile.png";
                e.target.onerror = null;
              }}
            />
          </div>
        </div>
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
        <div className="sidebar-close-container">
          <div className="profile-section text-center mb-4">
            <img
              // src={photo}
                // src={getImageUrl(userId, "profile")}
                src={getProfileImage(userId)}
              alt="User"
              className="profile-pic"
              onError={(e) => {
                e.target.src = "/profile.png";
                e.target.onerror = null;
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

        {/* ================= LANGUAGE ================= */}
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

      {/* ================= OVERLAY FOR MOBILE ================= */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ================= RIGHT SECTION ================= */}
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

        {/* CARDS AND SEARCH SECTION */}
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
                    e.target.onerror = null;
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

                {/* Pond List with Update Buttons */}
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

                {/* If no ponds, show Add Pond button */}
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

      {/* Farmer Modal Form */}
      {showForm && (
        <div className="form-modal">
          <div className="form-box" style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            <h5>{isUpdateMode ? "Update Farmer" : t('addFarmer')}</h5>
            
            <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
              <h6>Farmer Details (All fields are required)</h6>
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
                  <input 
                    className="form-control" 
                    placeholder="Gender *" 
                    value={newFarmer.gender} 
                    onChange={e => setNewFarmer({ ...newFarmer, gender: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <input 
                    className="form-control" 
                    placeholder="Aadhar *" 
                    value={newFarmer.adhar} 
                    onChange={e => setNewFarmer({ ...newFarmer, adhar: e.target.value })}
                    disabled={loading.addFarmer || loading.updateFarmer}
                    required
                  />
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
                    placeholder="Village *" 
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

                  {/* Show current photo preview */}
                  {newFarmer.photo && (
                    <div style={{ marginTop: 6 }}>
                      <img
                        src={newFarmer.photo}
                        alt="Preview"
                        style={{ width: 80, height: 80, borderRadius: "50%" }}
                        onError={(e) => {
                          e.target.src = "/profile.png";
                          e.target.onerror = null;
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

            {/* UPDATED MODAL FORM GRID */}
            <div className="modal-form-grid">
              
              {/* Pond Details */}
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

                    {newPond.pondImage && (
                      <div style={{ marginTop: 6 }}>
                        <img
                          src={newPond.pondImage}
                          alt="Pond preview"
                          style={{ width: 80, height: 80, borderRadius: "4px" }}
                          onError={(e) => {
                            e.target.src = "/profile.png";
                            e.target.onerror = null;
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
                      placeholder="How many fish have died (cumulative)? *" 
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