


// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import api, { getImageUrl } from "../utils/api";
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users } from "lucide-react";
// import "./Dealers.css";

// function DealersPage() {
//   const { t, i18n } = useTranslation();
  
//   // Mobile state
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
  
//   // User state
//   const [username, setUsername] = useState("");
//   const [photo, setPhoto] = useState("/default-profile.png");
//   const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "en");
//   const userId = localStorage.getItem("userId");
  
//   // Dealers state
//   const [dealers, setDealers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [dealerName, setDealerName] = useState("");
//   const [contact, setContact] = useState("");
//   const [gstNumber, setGstNumber] = useState("");
//   const [image, setImage] = useState(null);
//   const [shopAddress, setShopAddress] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
  
//   const navigate = useNavigate();

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
//           !event.target.closest('.dealers-sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//     setSelectedLang(lang);
//     setDealers((prev) => [...prev]);
//   };

//   // Fetch user data
//   useEffect(() => {
//     api
//       .get(`/api/user/${userId}`)
//       .then((res) => {
//         const data = res.data;
//         setUsername(data.name || localStorage.getItem("username") || "");
//         setPhoto(data.photo ? getImageUrl(data.photo) : "/default-profile.png");
//       })
//       .catch(() => {
//         setUsername(localStorage.getItem("username") || "");
//         setPhoto(localStorage.getItem("photo") || "/default-profile.png");
//       });
//   }, [userId]);

//   const fetchDealers = async () => {
//     try {
//       const res = await api.get(
//         `/api/dealers?userId=${userId}`
//       );
//       setDealers(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchDealers();
//   }, []);

//   const handleAddDealer = async () => {
//     if (!dealerName || !contact || !gstNumber || !image)
//       return alert(t("fillAllFields"));

//     const formData = new FormData();
//     formData.append("name", dealerName);
//     formData.append("contact", contact);
//     formData.append("gstNumber", gstNumber);
//     formData.append("image", image);
//     formData.append("shopAddress", shopAddress);
//     formData.append("userId", userId);

//     try {
//       await api.post("/api/dealers", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setDealerName("");
//       setContact("");
//       setShopAddress("");
//       setGstNumber("");
//       setImage(null);

//       setShowForm(false);
//       fetchDealers();
//     } catch (err) {
//       console.log(err);
//       alert(t("errorAddingDealer"));
//     }
//   };

//   const getGreeting = () => {
//     let greeting = "Hello";
//     if (selectedLang === "hi") greeting = "नमस्ते";
//     else if (selectedLang === "bn") greeting = "হ্যালো";
//     return `${greeting}, ${username}`;
//   };

//   const filteredDealers = dealers.filter((d) =>
//     d.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="dealers-container">
//       {/* ================= MOBILE NAVBAR ================= */}
//       {isMobile && (
//         <div className="mobile-navbar">
//           <button 
//             className="mobile-menu-toggle"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             aria-label="Toggle menu"
//           >
//             {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
          
//           <div className="mobile-logo">
//             <h3>Dealers</h3>
//           </div>
          
//           <div className="mobile-profile">
//             <img
//               src={getImageUrl(`/api/images/${userId}/profile`)}
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
//       <div className={`dealers-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="dealers-user-section">
//             <img
//               src={getImageUrl(`/api/images/${userId}/profile`)}
//               alt="User"
//               className="dealers-user-img"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5 className="dealers-username">{username || "User"}</h5>
//           </div>

//           {isMobile && (
//             <button 
//               className="sidebar-close-btn"
//               onClick={() => setIsSidebarOpen(false)}
//               aria-label="Close menu"
//             >
//               <X size={20} />
//             </button>
//           )}
//         </div>

//         <ul className="dealers-nav-links">
//           <li className="dealers-nav-item">
//             <Link to="/profile" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//                <User size={18} />  {t("profile")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/dashboard" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//                <Home size={18} />  {t("dashboard")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/helpcenter" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//                <HelpCircle size={18} />  {t("helpCenter")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/dealers" className="dealers-nav-link active" onClick={() => setIsSidebarOpen(false)}>
//              <ShoppingBag size={18} />    {t("dealers")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/agents" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//             <Users size={18} />     {t("agents")}
//             </Link>
//           </li>
//         </ul>

//         {/* ================= LANGUAGE ================= */}
//         <div className="dealers-language-section">
//           <h6 className="dealers-language-label">{t("chooseLanguage")}</h6>
//           <select
//             value={i18n.language}
//             onChange={(e) => changeLanguage(e.target.value)}
//             className="dealers-language-select"
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

//       {/* ================= RIGHT CONTENT ================= */}
//       <div className={`dealers-main-content ${isMobile ? 'mobile-view' : ''}`}>
//         <h5 className="dealers-greeting">{getGreeting()}</h5>

//         <div className="dealers-count-section">
//           <h3 className="dealers-count">{t("dealersCount", { count: dealers.length })}</h3>
//           <button onClick={() => setShowForm(!showForm)} className="dealers-add-btn">
//             {t("addNewDealer")}
//           </button>
//         </div>

//         {showForm && (
//           <div className="dealers-form-container">
//             <div>
//               <h4 className="dealers-form-title">{t("addNewDealer")}</h4>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("dealerName")}:</label>
//                 <input 
//                   type="text" 
//                   value={dealerName} 
//                   onChange={(e) => setDealerName(e.target.value)} 
//                   className="dealers-form-input" 
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("contactNumber")}:</label>
//                 <input 
//                   type="text" 
//                   value={contact} 
//                   onChange={(e) => setContact(e.target.value)} 
//                   className="dealers-form-input" 
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("shopAddress")}:</label>
//                 <input 
//                   type="text" 
//                   value={shopAddress} 
//                   onChange={(e) => setShopAddress(e.target.value)} 
//                   className="dealers-form-input" 
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("gstNumber")}:</label>
//                 <input 
//                   type="text" 
//                   value={gstNumber} 
//                   onChange={(e) => setGstNumber(e.target.value)} 
//                   className="dealers-form-input" 
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("profileimage")}:</label>
//                 <input 
//                   type="file" 
//                   onChange={(e) => setImage(e.target.files[0])} 
//                   className="dealers-form-input" 
//                 />
//               </div>

//               <div className="dealers-form-buttons">
//                 <button onClick={() => setShowForm(false)} className="dealers-cancel-btn">
//                   {t("cancel")}
//                 </button>

//                 <button onClick={handleAddDealer} className="dealers-submit-btn">
//                   {t("addDealer")}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="dealers-search-container">
//           <input
//             type="text"
//             placeholder={t("searchDealer")}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="dealers-search-input"
//           />
//         </div>

//         <div className="dealers-list-container">
//           {filteredDealers.length > 0 ? (
//             filteredDealers.map((dealer) => (
//               <div 
//                 key={dealer._id} 
//                 className="dealers-card" 
//                 onClick={() => {
//                   localStorage.setItem("selectedDealerName", dealer.name);
//                   localStorage.setItem("selectedDealerAddress", dealer.shopAddress);
//                   navigate(`/dealer-shop/${dealer._id}`);
//                 }}
//               >
//                 {dealer.image && (
//                   // <img
//                   //   src={`http://localhost:2008/${dealer.image}`}
//                   //   alt={dealer.name}
//                   //   className="dealers-card-img"
//                   // />

// <img
//   src={getImageUrl(dealer.image)}
//   alt={dealer.name}
//   className="dealers-card-img"
//   onError={(e) => {
//     e.target.src = "/no-image.png";
//   }}
// />



//                 )}
//                 <div className="dealers-card-content">
//                   <h5 className="dealers-card-title">
//                     <span className="dealers-card-label">{t("dealerName")}:</span> {dealer.name}
//                   </h5>
//                   <p className="dealers-card-text">
//                     <span className="dealers-card-label">{t("contactNumber")}:</span> {dealer.contact}
//                   </p>
//                   <p className="dealers-card-text">
//                     <span className="dealers-card-label">{t("shopAddress")}:</span> {dealer.shopAddress}
//                   </p>
//                   <p className="dealers-card-text">
//                     <span className="dealers-card-label">{t("gstNumber")}:</span> {dealer.gstNumber}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="dealers-empty-state">{t("noDealersFound")}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DealersPage;








// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import api, { getImageUrl } from "../utils/api";
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader } from "lucide-react";
// import "./Dealers.css";

// function DealersPage() {
//   const { t, i18n } = useTranslation();
  
//   // Mobile state
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
  
//   // User state
//   const [username, setUsername] = useState("");
//   const [photo, setPhoto] = useState("/default-profile.png");
//   const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "en");
//   const userId = localStorage.getItem("userId");
  
//   // Dealers state
//   const [dealers, setDealers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [dealerName, setDealerName] = useState("");
//   const [contact, setContact] = useState("");
//   const [gstNumber, setGstNumber] = useState("");
//   const [image, setImage] = useState(null);
//   const [shopAddress, setShopAddress] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
  
//   // Loading states
//   const [loadingSave, setLoadingSave] = useState(false);
//   const [loadingLanguage, setLoadingLanguage] = useState(false);
//   const [loadingSidebar, setLoadingSidebar] = useState(false);
//   const [loadingCard, setLoadingCard] = useState({});
  
//   const navigate = useNavigate();

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
//           !event.target.closest('.dealers-sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = async (lang) => {
//     setLoadingLanguage(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
//       i18n.changeLanguage(lang);
//       localStorage.setItem("lang", lang);
//       setSelectedLang(lang);
//       setDealers((prev) => [...prev]);
//     } finally {
//       setLoadingLanguage(false);
//     }
//   };

//   // Fetch user data
//   useEffect(() => {
//     api
//       .get(`/api/user/${userId}`)
//       .then((res) => {
//         const data = res.data;
//         setUsername(data.name || localStorage.getItem("username") || "");
//         setPhoto(data.photo ? getImageUrl(data.photo) : "/default-profile.png");
//       })
//       .catch(() => {
//         setUsername(localStorage.getItem("username") || "");
//         setPhoto(localStorage.getItem("photo") || "/default-profile.png");
//       });
//   }, [userId]);

//   const fetchDealers = async () => {
//     try {
//       const res = await api.get(
//         `/api/dealers?userId=${userId}`
//       );
//       setDealers(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchDealers();
//   }, []);

//   const handleAddDealer = async () => {
//     if (!dealerName || !contact || !gstNumber || !image)
//       return alert(t("fillAllFields"));

//     setLoadingSave(true);
//     const formData = new FormData();
//     formData.append("name", dealerName);
//     formData.append("contact", contact);
//     formData.append("gstNumber", gstNumber);
//     formData.append("image", image);
//     formData.append("shopAddress", shopAddress);
//     formData.append("userId", userId);

//     try {
//       await api.post("/api/dealers", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setDealerName("");
//       setContact("");
//       setShopAddress("");
//       setGstNumber("");
//       setImage(null);

//       setShowForm(false);
//       fetchDealers();
//     } catch (err) {
//       console.log(err);
//       alert(t("errorAddingDealer"));
//     } finally {
//       setLoadingSave(false);
//     }
//   };

//   const handleCardClick = async (dealer) => {
//     setLoadingCard(prev => ({ ...prev, [dealer._id]: true }));
//     try {
//       await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading
//       localStorage.setItem("selectedDealerName", dealer.name);
//       localStorage.setItem("selectedDealerAddress", dealer.shopAddress);
//       navigate(`/dealer-shop/${dealer._id}`);
//     } finally {
//       setLoadingCard(prev => ({ ...prev, [dealer._id]: false }));
//     }
//   };

//   const getGreeting = () => {
//     let greeting = "Hello";
//     if (selectedLang === "hi") greeting = "नमस्ते";
//     else if (selectedLang === "bn") greeting = "হ্যালো";
//     return `${greeting}, ${username}`;
//   };

//   const filteredDealers = dealers.filter((d) =>
//     d.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="dealers-container">
//       {/* ================= MOBILE NAVBAR ================= */}
//       {isMobile && (
//         <div className="mobile-navbar">
//           <button 
//             className="mobile-menu-toggle"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             aria-label="Toggle menu"
//             disabled={loadingSidebar}
//           >
//             {loadingSidebar ? (
//               <Loader size={24} className="spinner" />
//             ) : isSidebarOpen ? (
//               <X size={24} />
//             ) : (
//               <Menu size={24} />
//             )}
//           </button>
          
//           <div className="mobile-logo">
//             <h3>Dealers</h3>
//           </div>
          
//           <div className="mobile-profile">
//             <img
//               src={getImageUrl(`/api/images/${userId}/profile`)}
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
//       <div className={`dealers-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="dealers-user-section">
//             <img
//               src={getImageUrl(`/api/images/${userId}/profile`)}
//               alt="User"
//               className="dealers-user-img"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5 className="dealers-username">{username || "User"}</h5>
//           </div>

//           {isMobile && (
//             <button 
//               className="sidebar-close-btn"
//               onClick={() => setIsSidebarOpen(false)}
//               aria-label="Close menu"
//               disabled={loadingSidebar}
//             >
//               {loadingSidebar ? <Loader size={20} className="spinner" /> : <X size={20} />}
//             </button>
//           )}
//         </div>

//         <ul className="dealers-nav-links">
//           <li className="dealers-nav-item">
//             <Link to="/profile" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//                <User size={18} />  {t("profile")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/dashboard" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//                <Home size={18} />  {t("dashboard")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/helpcenter" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//                <HelpCircle size={18} />  {t("helpCenter")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/dealers" className="dealers-nav-link active" onClick={() => setIsSidebarOpen(false)}>
//              <ShoppingBag size={18} />    {t("dealers")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/agents" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//             <Users size={18} />     {t("agents")}
//             </Link>
//           </li>
//         </ul>

//         {/* ================= LANGUAGE ================= */}
//         <div className="dealers-language-section">
//           <h6 className="dealers-language-label">{t("chooseLanguage")}</h6>
//           <div className="dealers-language-select-wrapper">
//             <select
//               value={i18n.language}
//               onChange={(e) => changeLanguage(e.target.value)}
//               className="dealers-language-select"
//               disabled={loadingLanguage}
//             >
//               <option value="en">English</option>
//               <option value="hi">हिन्दी</option>
//               <option value="bn">বাংলা</option>
//               <option value="as">অসমীয়া</option>
//               <option value="ta">தமிழ்</option>
//               <option value="kn">ಕನ್ನಡ</option>
//               <option value="mr">मराठी</option>
//             </select>
//             {loadingLanguage && (
//               <Loader size={16} className="language-spinner" />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ================= OVERLAY FOR MOBILE ================= */}
//       {isMobile && isSidebarOpen && (
//         <div 
//           className="sidebar-overlay"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}

//       {/* ================= RIGHT CONTENT ================= */}
//       <div className={`dealers-main-content ${isMobile ? 'mobile-view' : ''}`}>
//         <h5 className="dealers-greeting">{getGreeting()}</h5>

//         <div className="dealers-count-section">
//           <h3 className="dealers-count">{t("dealersCount", { count: dealers.length })}</h3>
//           <button 
//             onClick={() => setShowForm(!showForm)} 
//             className="dealers-add-btn"
//             disabled={loadingSave}
//           >
//             {loadingSave ? (
//               <>
//                 <Loader size={16} className="spinner" />
//                 {t("loading")}
//               </>
//             ) : (
//               t("addNewDealer")
//             )}
//           </button>
//         </div>

//         {showForm && (
//           <div className="dealers-form-container">
//             <div>
//               <h4 className="dealers-form-title">{t("addNewDealer")}</h4>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("dealerName")}:</label>
//                 <input 
//                   type="text" 
//                   value={dealerName} 
//                   onChange={(e) => setDealerName(e.target.value)} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("contactNumber")}:</label>
//                 <input 
//                   type="text" 
//                   value={contact} 
//                   onChange={(e) => setContact(e.target.value)} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("shopAddress")}:</label>
//                 <input 
//                   type="text" 
//                   value={shopAddress} 
//                   onChange={(e) => setShopAddress(e.target.value)} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("gstNumber")}:</label>
//                 <input 
//                   type="text" 
//                   value={gstNumber} 
//                   onChange={(e) => setGstNumber(e.target.value)} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("profileimage")}:</label>
//                 <input 
//                   type="file" 
//                   onChange={(e) => setImage(e.target.files[0])} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 />
//               </div>

//               <div className="dealers-form-buttons">
//                 <button 
//                   onClick={() => setShowForm(false)} 
//                   className="dealers-cancel-btn"
//                   disabled={loadingSave}
//                 >
//                   {t("cancel")}
//                 </button>

//                 <button 
//                   onClick={handleAddDealer} 
//                   className="dealers-submit-btn"
//                   disabled={loadingSave}
//                 >
//                   {loadingSave ? (
//                     <>
//                       <Loader size={16} className="spinner" />
//                       {t("saving")}
//                     </>
//                   ) : (
//                     t("addDealer")
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="dealers-search-container">
//           <input
//             type="text"
//             placeholder={t("searchDealer")}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="dealers-search-input"
//           />
//         </div>

//         <div className="dealers-list-container">
//           {filteredDealers.length > 0 ? (
//             filteredDealers.map((dealer) => (
//               <div 
//                 key={dealer._id} 
//                 className="dealers-card"
//                 onClick={() => handleCardClick(dealer)}
//               >
//                 {dealer.image && (
//                   <img
//                     src={getImageUrl(dealer.image)}
//                     alt={dealer.name}
//                     className="dealers-card-img"
//                     onError={(e) => {
//                       e.target.src = "/no-image.png";
//                     }}
//                   />
//                 )}
//                 <div className="dealers-card-content">
//                   <h5 className="dealers-card-title">
//                     <span className="dealers-card-label">{t("dealerName")}:</span> {dealer.name}
//                   </h5>
//                   <p className="dealers-card-text">
//                     <span className="dealers-card-label">{t("contactNumber")}:</span> {dealer.contact}
//                   </p>
//                   <p className="dealers-card-text">
//                     <span className="dealers-card-label">{t("shopAddress")}:</span> {dealer.shopAddress}
//                   </p>
//                   <p className="dealers-card-text">
//                     <span className="dealers-card-label">{t("gstNumber")}:</span> {dealer.gstNumber}
//                   </p>
//                   {loadingCard[dealer._id] && (
//                     <div className="card-loader-overlay">
//                       <Loader size={24} className="spinner" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="dealers-empty-state">{t("noDealersFound")}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DealersPage;











































 



// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import api, { getImageUrl } from "../utils/api";
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader, Search } from "lucide-react";
// import "./Dealers.css";

// function DealersPage() {
//   const { t, i18n } = useTranslation();
  
//   // Mobile state
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
  
//   // User state
//   const [username, setUsername] = useState("");
//   const [photo, setPhoto] = useState("/default-profile.png");
//   const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "en");
//   const userId = localStorage.getItem("userId");
  
//   // Dealers state
//   const [dealers, setDealers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [dealerName, setDealerName] = useState("");
//   const [contact, setContact] = useState("");
//   const [gstNumber, setGstNumber] = useState("");
//   const [image, setImage] = useState(null);
//   const [shopAddress, setShopAddress] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
  
//   // Loading states
//   const [loadingSave, setLoadingSave] = useState(false);
//   const [loadingLanguage, setLoadingLanguage] = useState(false);
//   const [loadingSidebar, setLoadingSidebar] = useState(false);
//   const [loadingCard, setLoadingCard] = useState({});
  
//   const navigate = useNavigate();

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
//           !event.target.closest('.dealers-sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = async (lang) => {
//     setLoadingLanguage(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 300));
//       i18n.changeLanguage(lang);
//       localStorage.setItem("lang", lang);
//       setSelectedLang(lang);
//       setDealers((prev) => [...prev]);
//     } finally {
//       setLoadingLanguage(false);
//     }
//   };

//   // Fetch user data
//   useEffect(() => {
//     api
//       .get(`/api/user/${userId}`)
//       .then((res) => {
//         const data = res.data;
//         setUsername(data.name || localStorage.getItem("username") || "");
//         setPhoto(data.photo ? getImageUrl(data.photo) : "/default-profile.png");
//       })
//       .catch(() => {
//         setUsername(localStorage.getItem("username") || "");
//         setPhoto(localStorage.getItem("photo") || "/default-profile.png");
//       });
//   }, [userId]);

//   const fetchDealers = async () => {
//     try {
//       const res = await api.get(
//         `/api/dealers?userId=${userId}`
//       );
//       setDealers(res.data);
//       setSearchResult(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchDealers();
//   }, []);

//   // const handleAddDealer = async () => {
//   //   if (!dealerName || !contact || !gstNumber || !shopAddress || !image)
//   //     return alert(t("fillAllFields"));

//   //   setLoadingSave(true);
//   //   const formData = new FormData();
//   //   formData.append("name", dealerName);
//   //   formData.append("contact", contact);
//   //   formData.append("gstNumber", gstNumber);
//   //   formData.append("image", image);
//   //   formData.append("shopAddress", shopAddress);
//   //   formData.append("userId", userId);

//   //   try {
//   //     // ✅ CHANGED HERE: No headers specified
//   //     await api.post("/api/dealers", formData);

//   //     setDealerName("");
//   //     setContact("");
//   //     setShopAddress("");
//   //     setGstNumber("");
//   //     setImage(null);

//   //     setShowForm(false);
//   //     fetchDealers();
//   //   } catch (err) {
//   //     console.log(err);
//   //     alert(t("errorAddingDealer"));
//   //   } finally {
//   //     setLoadingSave(false);
//   //   }
//   // };


//   const handleAddDealer = async () => {
//   if (!dealerName || !contact || !gstNumber || !shopAddress || !image) {
//     return alert(t("fillAllFields")); // "Please fill all fields"
//   }

//   setLoadingSave(true);
//   const formData = new FormData();
//   formData.append("name", dealerName);
//   formData.append("contact", contact);
//   formData.append("gstNumber", gstNumber);
//   formData.append("shopAddress", shopAddress);
//   formData.append("image", image);
//   formData.append("userId", userId);

//   try {
//     await api.post("/api/dealers", formData);

//     // Reset form
//     setDealerName("");
//     setContact("");
//     setGstNumber("");
//     setShopAddress("");
//     setImage(null);
//     setShowForm(false);
//     fetchDealers();
//   } catch (err) {
//     console.log(err);
//     alert(t("errorAddingDealer"));
//   } finally {
//     setLoadingSave(false);
//   }
// };


//   const handleCardClick = async (dealer) => {
//     setLoadingCard(prev => ({ ...prev, [dealer._id]: true }));
//     try {
//       await new Promise(resolve => setTimeout(resolve, 300));
//       localStorage.setItem("selectedDealerName", dealer.name);
//       localStorage.setItem("selectedDealerAddress", dealer.shopAddress);
//       navigate(`/dealer-shop/${dealer._id}`);
//     } finally {
//       setLoadingCard(prev => ({ ...prev, [dealer._id]: false }));
//     }
//   };

//   const getGreeting = () => {
//     let greeting = "Hello";
//     if (selectedLang === "hi") greeting = "नमस्ते";
//     else if (selectedLang === "bn") greeting = "হ্যালো";
//     return `${greeting}, ${username}`;
//   };

//   // ================= SEARCH LOGIC (FIXED) =================

//   // Handle search when button is clicked
//   const handleSearch = () => {
//     const normalizedQuery = searchQuery.trim().toLowerCase();

//     if (normalizedQuery === "") {
//       setSearchResult(dealers);
//       setIsSearching(false);
//       return;
//     }

//     const filtered = dealers.filter((d) =>
//       d.name?.toLowerCase().includes(normalizedQuery)
//     );

//     setSearchResult(filtered);
//     setIsSearching(true);
//   };

//   // Clear search
//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setSearchResult(dealers);
//     setIsSearching(false);
//   };

//   // Handle Enter key
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // Update search result when dealers or query changes
//   useEffect(() => {
//     const normalizedQuery = searchQuery.trim().toLowerCase();

//     if (isSearching && normalizedQuery !== "") {
//       const filtered = dealers.filter((d) =>
//         d.name?.toLowerCase().includes(normalizedQuery)
//       );
//       setSearchResult(filtered);
//     } else {
//       setSearchResult(dealers);
//     }
//   }, [dealers, searchQuery, isSearching]);

//   return (
//     <div className="dealers-container">
//       {/* ================= MOBILE NAVBAR ================= */}
//       {isMobile && (
//         <div className="mobile-navbar">
//           <button 
//             className="mobile-menu-toggle"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             aria-label="Toggle menu"
//             disabled={loadingSidebar}
//           >
//             {loadingSidebar ? (
//               <Loader size={24} className="spinner" />
//             ) : isSidebarOpen ? (
//               <X size={24} />
//             ) : (
//               <Menu size={24} />
//             )}
//           </button>
          
//           <div className="mobile-logo">
//             <h3>{t("dealers")}</h3>
//           </div>
          
//           <div className="mobile-profile">
//             <img
//               src={getImageUrl(`/api/images/${userId}/profile`)}
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
//       <div className={`dealers-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="dealers-user-section">
//             <img
//               src={getImageUrl(`/api/images/${userId}/profile`)}
//               alt="User"
//               className="dealers-user-img"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5 className="dealers-username">{username || "User"}</h5>
//           </div>

//           {isMobile && (
//             <button 
//               className="sidebar-close-btn"
//               onClick={() => setIsSidebarOpen(false)}
//               aria-label="Close menu"
//               disabled={loadingSidebar}
//             >
//               {loadingSidebar ? <Loader size={20} className="spinner" /> : <X size={20} />}
//             </button>
//           )}
//         </div>

//         <ul className="dealers-nav-links">
//           <li className="dealers-nav-item">
//             <Link to="/profile" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//                <User size={18} />  {t("profile")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/dashboard" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//                <Home size={18} />  {t("dashboard")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/helpcenter" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//                <HelpCircle size={18} />  {t("helpCenter")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/dealers" className="dealers-nav-link active" onClick={() => setIsSidebarOpen(false)}>
//              <ShoppingBag size={18} />    {t("dealers")}
//             </Link>
//           </li>
//           <li className="dealers-nav-item">
//             <Link to="/agents" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
//             <Users size={18} />     {t("agents")}
//             </Link>
//           </li>
//         </ul>

//         {/* ================= LANGUAGE ================= */}
//         <div className="dealers-language-section">
//           <h6 className="dealers-language-label">{t("chooseLanguage")}</h6>
//           <div className="dealers-language-select-wrapper">
//             <select
//               value={i18n.language}
//               onChange={(e) => changeLanguage(e.target.value)}
//               className="dealers-language-select"
//               disabled={loadingLanguage}
//             >
//               <option value="en">English</option>
//               <option value="hi">हिन्दी</option>
//               <option value="bn">বাংলা</option>
//               <option value="as">অসমীয়া</option>
//               <option value="ta">தமிழ்</option>
//               <option value="kn">ಕನ್ನಡ</option>
//               <option value="mr">मराठी</option>
//             </select>
//             {loadingLanguage && (
//               <Loader size={16} className="language-spinner" />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ================= OVERLAY FOR MOBILE ================= */}
//       {isMobile && isSidebarOpen && (
//         <div 
//           className="sidebar-overlay"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}

//       {/* ================= RIGHT CONTENT ================= */}
//       <div className={`dealers-main-content ${isMobile ? 'mobile-view' : ''}`}>
//         <h5 className="dealers-greeting">{getGreeting()}</h5>

//         <div className="dealers-count-section">
//           <h3 className="dealers-count">
//             {isSearching 
//               ? `${t("searchResults")}: ${searchResult.length}` 
//               : `${t("totalDealers")}: ${dealers.length}`
//             }
//           </h3>
//           <button 
//             onClick={() => setShowForm(!showForm)} 
//             className="dealers-add-btn"
//             disabled={loadingSave}
//           >
//             {loadingSave ? (
//               <>
//                 <Loader size={16} className="spinner" />
//                 {t("loading")}
//               </>
//             ) : (
//               t("addNewDealer")
//             )}
//           </button>
//         </div>

//         {showForm && (
//           <div className="dealers-form-container">
//             <div>
//               <h4 className="dealers-form-title">{t("addNewDealer")}</h4>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("dealerName")}:</label>
//                 {/* <input 
//                   type="text" 
//                   value={dealerName} 
//                   onChange={(e) => setDealerName(e.target.value)} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("contactNumber")}:</label>
//                 <input 
//                   type="text" 
//                   value={contact} 
//                   onChange={(e) => setContact(e.target.value)} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("shopAddress")}:</label>
//                 <input 
//                   type="text" 
//                   value={shopAddress} 
//                   onChange={(e) => setShopAddress(e.target.value)} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("gstNumber")}:</label>
//                 <input 
//                   type="text" 
//                   value={gstNumber} 
//                   onChange={(e) => setGstNumber(e.target.value)} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 />
//               </div>

//               <div className="dealers-form-group">
//                 <label className="dealers-form-label">{t("profileimage")}:</label>
//                 <input 
//                   type="file" 
//                   onChange={(e) => setImage(e.target.files[0])} 
//                   className="dealers-form-input" 
//                   disabled={loadingSave}
//                 /> */}


// <input 
//   type="text" 
//   value={dealerName} 
//   onChange={(e) => setDealerName(e.target.value)} 
//   className="dealers-form-input"
//   required
//   disabled={loadingSave}
// />

// <input 
//   type="text" 
//   value={contact} 
//   onChange={(e) => setContact(e.target.value)} 
//   className="dealers-form-input"
//   required
//   disabled={loadingSave}
// />

// <input 
//   type="text" 
//   value={shopAddress} 
//   onChange={(e) => setShopAddress(e.target.value)} 
//   className="dealers-form-input"
//   required
//   disabled={loadingSave}
// />

// <input 
//   type="text" 
//   value={gstNumber} 
//   onChange={(e) => setGstNumber(e.target.value)} 
//   className="dealers-form-input"
//   required
//   disabled={loadingSave}
// />

// <input 
//   type="file" 
//   onChange={(e) => setImage(e.target.files[0])} 
//   className="dealers-form-input"
//   required
//   disabled={loadingSave}
// />



//               </div>

//               <div className="dealers-form-buttons">
//                 <button 
//                   onClick={() => setShowForm(false)} 
//                   className="dealers-cancel-btn"
//                   disabled={loadingSave}
//                 >
//                   {t("cancel")}
//                 </button>

//                 <button 
//                   onClick={handleAddDealer} 
//                   className="dealers-submit-btn"
//                   disabled={loadingSave}
//                 >
//                   {loadingSave ? (
//                     <>
//                       <Loader size={16} className="spinner" />
//                       {t("saving")}
//                     </>
//                   ) : (
//                     t("addDealer")
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="dealers-search-container">
//           <div className="search-wrapper">
//             <input
//               type="text"
//               placeholder={t("searchDealer")}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="dealers-search-input"
//               onKeyPress={handleKeyPress}
//             />
//             <button 
//               onClick={handleSearch}
//               className="search-button"
//               aria-label={t("search")}
//             >
//               <Search size={20} />
//               <span className="search-button-text">{t("search")}</span>
//             </button>
//             {isSearching && (
//               <button 
//                 onClick={handleClearSearch}
//                 className="clear-search-button"
//                 aria-label={t("clearSearch")}
//               >
//                 {t("clearSearch")}
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="dealers-list-container">
//           {searchResult.length > 0 ? (
//             searchResult.map((dealer) => (
//               <div 
//                 key={dealer._id} 
//                 className="dealers-card"
//                 onClick={() => handleCardClick(dealer)}
//               >
//                 {dealer.image && (
//                   <img
//                     src={getImageUrl(dealer.image)}
//                     alt={dealer.name}
//                     className="dealers-card-img"
//                     onError={(e) => {
//                       e.target.src = "/no-image.png";
//                     }}
//                   />
//                 )}
//                 <div className="dealers-card-content">
//                   <h5 className="dealers-card-title">
//                     <span className="dealers-card-label">{t("dealerName")}:</span> {dealer.name}
//                   </h5>
//                   <p className="dealers-card-text">
//                     <span className="dealers-card-label">{t("contactNumber")}:</span> {dealer.contact}
//                   </p>
//                   <p className="dealers-card-text">
//                     <span className="dealers-card-label">{t("shopAddress")}:</span> {dealer.shopAddress}
//                   </p>
//                   <p className="dealers-card-text">
//                     <span className="dealers-card-label">{t("gstNumber")}:</span> {dealer.gstNumber}
//                   </p>
//                   {loadingCard[dealer._id] && (
//                     <div className="card-loader-overlay">
//                       <Loader size={24} className="spinner" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : isSearching ? (
//             <p className="dealers-empty-state">{t("noSearchResults")}</p>
//           ) : (
//             <p className="dealers-empty-state">{t("noDealersFound")}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DealersPage;






import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api, { getImageUrl } from "../utils/api";
import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Loader, Search } from "lucide-react";
import "./Dealers.css";

function DealersPage() {
  const { t, i18n } = useTranslation();
  
  // Mobile state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // User state
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("/default-profile.png");
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "en");
  const userId = localStorage.getItem("userId");
  
  // Dealers state
  const [dealers, setDealers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [dealerName, setDealerName] = useState("");
  const [contact, setContact] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [image, setImage] = useState(null);
  const [shopAddress, setShopAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    dealerName: "",
    contact: "",
    gstNumber: "",
    shopAddress: "",
    image: ""
  });
  
  // Loading states
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLanguage, setLoadingLanguage] = useState(false);
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [loadingCard, setLoadingCard] = useState({});
  
  const navigate = useNavigate();

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
          !event.target.closest('.dealers-sidebar') && 
          !event.target.closest('.mobile-menu-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [window.location.pathname]);

  const changeLanguage = async (lang) => {
    setLoadingLanguage(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      i18n.changeLanguage(lang);
      localStorage.setItem("lang", lang);
      setSelectedLang(lang);
      setDealers((prev) => [...prev]);
    } finally {
      setLoadingLanguage(false);
    }
  };

  // Fetch user data
  useEffect(() => {
    api
      .get(`/api/user/${userId}`)
      .then((res) => {
        const data = res.data;
        setUsername(data.name || localStorage.getItem("username") || "");
        setPhoto(data.photo ? getImageUrl(data.photo) : "/default-profile.png");
      })
      .catch(() => {
        setUsername(localStorage.getItem("username") || "");
        setPhoto(localStorage.getItem("photo") || "/default-profile.png");
      });
  }, [userId]);

  const fetchDealers = async () => {
    try {
      const res = await api.get(
        `/api/dealers?userId=${userId}`
      );
      setDealers(res.data);
      setSearchResult(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  // Validate form fields
  const validateForm = () => {
    const errors = {
      dealerName: "",
      contact: "",
      gstNumber: "",
      shopAddress: "",
      image: ""
    };
    let isValid = true;

    if (!dealerName.trim()) {
      errors.dealerName = t("dealerNameRequired");
      isValid = false;
    }

    if (!contact.trim()) {
      errors.contact = t("contactRequired");
      isValid = false;
    } else if (!/^\d{10}$/.test(contact.trim())) {
      errors.contact = t("validContact");
      isValid = false;
    }

    if (!gstNumber.trim()) {
      errors.gstNumber = t("gstNumberRequired");
      isValid = false;
    }

    if (!shopAddress.trim()) {
      errors.shopAddress = t("shopAddressRequired");
      isValid = false;
    }

    if (!image) {
      errors.image = t("imageRequired");
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddDealer = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }

    setLoadingSave(true);
    const formData = new FormData();
    formData.append("name", dealerName);
    formData.append("contact", contact);
    formData.append("gstNumber", gstNumber);
    formData.append("shopAddress", shopAddress);
    formData.append("image", image);
    formData.append("userId", userId);

    try {
      await api.post("/api/dealers", formData);

      // Reset form
      setDealerName("");
      setContact("");
      setGstNumber("");
      setShopAddress("");
      setImage(null);
      setFormErrors({
        dealerName: "",
        contact: "",
        gstNumber: "",
        shopAddress: "",
        image: ""
      });
      setShowForm(false);
      fetchDealers();
    } catch (err) {
      console.log(err);
      alert(t("errorAddingDealer"));
    } finally {
      setLoadingSave(false);
    }
  };

  // Handle input changes and clear errors
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'dealerName':
        setDealerName(value);
        if (value.trim()) setFormErrors({...formErrors, dealerName: ""});
        break;
      case 'contact':
        setContact(value);
        if (value.trim()) setFormErrors({...formErrors, contact: ""});
        break;
      case 'gstNumber':
        setGstNumber(value);
        if (value.trim()) setFormErrors({...formErrors, gstNumber: ""});
        break;
      case 'shopAddress':
        setShopAddress(value);
        if (value.trim()) setFormErrors({...formErrors, shopAddress: ""});
        break;
    }
  };

  const handleCardClick = async (dealer) => {
    setLoadingCard(prev => ({ ...prev, [dealer._id]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      localStorage.setItem("selectedDealerName", dealer.name);
      localStorage.setItem("selectedDealerAddress", dealer.shopAddress);
      navigate(`/dealer-shop/${dealer._id}`);
    } finally {
      setLoadingCard(prev => ({ ...prev, [dealer._id]: false }));
    }
  };

  const getGreeting = () => {
    let greeting = "Hello";
    if (selectedLang === "hi") greeting = "नमस्ते";
    else if (selectedLang === "bn") greeting = "হ্যালো";
    return `${greeting}, ${username}`;
  };

  // ================= SEARCH LOGIC (FIXED) =================

  // Handle search when button is clicked
  const handleSearch = () => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery === "") {
      setSearchResult(dealers);
      setIsSearching(false);
      return;
    }

    const filtered = dealers.filter((d) =>
      d.name?.toLowerCase().includes(normalizedQuery)
    );

    setSearchResult(filtered);
    setIsSearching(true);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResult(dealers);
    setIsSearching(false);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Update search result when dealers or query changes
  useEffect(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (isSearching && normalizedQuery !== "") {
      const filtered = dealers.filter((d) =>
        d.name?.toLowerCase().includes(normalizedQuery)
      );
      setSearchResult(filtered);
    } else {
      setSearchResult(dealers);
    }
  }, [dealers, searchQuery, isSearching]);

  return (
    <div className="dealers-container">
      {/* ================= MOBILE NAVBAR ================= */}
      {isMobile && (
        <div className="mobile-navbar">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
            disabled={loadingSidebar}
          >
            {loadingSidebar ? (
              <Loader size={24} className="spinner" />
            ) : isSidebarOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
          
          <div className="mobile-logo">
            <h3>{t("dealers")}</h3>
          </div>
          
          <div className="mobile-profile">
            <img
              src={getImageUrl(`/api/images/${userId}/profile`)}
              alt="User"
              className="mobile-profile-pic"
              onError={(e) => {
                e.target.src = "/profile.png";
              }}
            />
          </div>
        </div>
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`dealers-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
        <div className="sidebar-close-container">
          <div className="dealers-user-section">
            <img
              src={getImageUrl(`/api/images/${userId}/profile`)}
              alt="User"
              className="dealers-user-img"
              onError={(e) => {
                e.target.src = "/profile.png";
              }}
            />
            <h5 className="dealers-username">{username || "User"}</h5>
          </div>

          {/* {isMobile && (
            <button 
              className="sidebar-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
              disabled={loadingSidebar}
            >
              {loadingSidebar ? <Loader size={20} className="spinner" /> : <X size={20} />}
            </button>
          )} */}
        </div>

        <ul className="dealers-nav-links">
          <li className="dealers-nav-item">
            <Link to="/profile" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
               <User size={18} />  {t("profile")}
            </Link>
          </li>
          <li className="dealers-nav-item">
            <Link to="/dashboard" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
               <Home size={18} />  {t("dashboard")}
            </Link>
          </li>
          <li className="dealers-nav-item">
            <Link to="/helpcenter" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
               <HelpCircle size={18} />  {t("helpCenter")}
            </Link>
          </li>
          <li className="dealers-nav-item">
            <Link to="/dealers" className="dealers-nav-link active" onClick={() => setIsSidebarOpen(false)}>
             <ShoppingBag size={18} />    {t("dealers")}
            </Link>
          </li>
          <li className="dealers-nav-item">
            <Link to="/agents" className="dealers-nav-link" onClick={() => setIsSidebarOpen(false)}>
            <Users size={18} />     {t("agents")}
            </Link>
          </li>
        </ul>

        {/* ================= LANGUAGE ================= */}
        <div className="dealers-language-section">
          <h6 className="dealers-language-label">{t("chooseLanguage")}</h6>
          <div className="dealers-language-select-wrapper">
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="dealers-language-select"
              disabled={loadingLanguage}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
              <option value="as">অসমীয়া</option>
              <option value="ta">தமிழ்</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="mr">मराठी</option>
            </select>
            {loadingLanguage && (
              <Loader size={16} className="language-spinner" />
            )}
          </div>
        </div>
      </div>

      {/* ================= OVERLAY FOR MOBILE ================= */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ================= RIGHT CONTENT ================= */}
      <div className={`dealers-main-content ${isMobile ? 'mobile-view' : ''}`}>
        <h5 className="dealers-greeting">{getGreeting()}</h5>

        <div className="dealers-count-section">
          <h3 className="dealers-count">
            {isSearching 
              ? `${t("searchResults")}: ${searchResult.length}` 
              : `${t("totalDealers")}: ${dealers.length}`
            }
          </h3>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="dealers-add-btn"
            disabled={loadingSave}
          >
            {loadingSave ? (
              <>
                <Loader size={16} className="spinner" />
                {t("loading")}
              </>
            ) : (
              t("addNewDealer")
            )}
          </button>
        </div>

        {showForm && (
          <div className="dealers-form-container">
            <div>
              <h4 className="dealers-form-title">{t("addNewDealer")}</h4>

              <div className="dealers-form-group">
                <label className="dealers-form-label">{t("dealerName")}:</label>
                <input 
                  type="text" 
                  value={dealerName} 
                  onChange={(e) => handleInputChange('dealerName', e.target.value)} 
                  className={`dealers-form-input ${formErrors.dealerName ? 'error-input' : ''}`}
                  required
                  disabled={loadingSave}
                />
                {formErrors.dealerName && (
                  <div className="error-message">{formErrors.dealerName}</div>
                )}
              </div>

              <div className="dealers-form-group">
                <label className="dealers-form-label">{t("contactNumber")}:</label>
                <input 
                  type="text" 
                  value={contact} 
                  onChange={(e) => handleInputChange('contact', e.target.value)} 
                  className={`dealers-form-input ${formErrors.contact ? 'error-input' : ''}`}
                  required
                  disabled={loadingSave}
                />
                {formErrors.contact && (
                  <div className="error-message">{formErrors.contact}</div>
                )}
              </div>

              <div className="dealers-form-group">
                <label className="dealers-form-label">{t("shopAddress")}:</label>
                <input 
                  type="text" 
                  value={shopAddress} 
                  onChange={(e) => handleInputChange('shopAddress', e.target.value)} 
                  className={`dealers-form-input ${formErrors.shopAddress ? 'error-input' : ''}`}
                  required
                  disabled={loadingSave}
                />
                {formErrors.shopAddress && (
                  <div className="error-message">{formErrors.shopAddress}</div>
                )}
              </div>

              <div className="dealers-form-group">
                <label className="dealers-form-label">{t("gstNumber")}:</label>
                <input 
                  type="text" 
                  value={gstNumber} 
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)} 
                  className={`dealers-form-input ${formErrors.gstNumber ? 'error-input' : ''}`}
                  required
                  disabled={loadingSave}
                />
                {formErrors.gstNumber && (
                  <div className="error-message">{formErrors.gstNumber}</div>
                )}
              </div>

              <div className="dealers-form-group">
                <label className="dealers-form-label">{t("profileimage")}:</label>
                <input 
                  type="file" 
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    if (e.target.files[0]) setFormErrors({...formErrors, image: ""});
                  }} 
                  className={`dealers-form-input ${formErrors.image ? 'error-input' : ''}`}
                  required
                  disabled={loadingSave}
                />
                {formErrors.image && (
                  <div className="error-message">{formErrors.image}</div>
                )}
              </div>

              <div className="dealers-form-buttons">
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setFormErrors({
                      dealerName: "",
                      contact: "",
                      gstNumber: "",
                      shopAddress: "",
                      image: ""
                    });
                  }} 
                  className="dealers-cancel-btn"
                  disabled={loadingSave}
                >
                  {t("cancel")}
                </button>

                <button 
                  onClick={handleAddDealer} 
                  className="dealers-submit-btn"
                  disabled={loadingSave}
                >
                  {loadingSave ? (
                    <>
                      <Loader size={16} className="spinner" />
                      {t("saving")}
                    </>
                  ) : (
                    t("addDealer")
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="dealers-search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder={t("searchDealer")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dealers-search-input"
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={handleSearch}
              className="search-button"
              aria-label={t("search")}
            >
              <Search size={20} />
              <span className="search-button-text">{t("search")}</span>
            </button>
            {isSearching && (
              <button 
                onClick={handleClearSearch}
                className="clear-search-button"
                aria-label={t("clearSearch")}
              >
                {t("clearSearch")}
              </button>
            )}
          </div>
        </div>

        <div className="dealers-list-container">
          {searchResult.length > 0 ? (
            searchResult.map((dealer) => (
              <div 
                key={dealer._id} 
                className="dealers-card"
                onClick={() => handleCardClick(dealer)}
              >
                {dealer.image && (
                  <img
                    src={getImageUrl(dealer.image)}
                    alt={dealer.name}
                    className="dealers-card-img"
                    onError={(e) => {
                      e.target.src = "/no-image.png";
                    }}
                  />
                )}
                <div className="dealers-card-content">
                  <h5 className="dealers-card-title">
                    <span className="dealers-card-label">{t("dealerName")}:</span> {dealer.name}
                  </h5>
                  <p className="dealers-card-text">
                    <span className="dealers-card-label">{t("contactNumber")}:</span> {dealer.contact}
                  </p>
                  <p className="dealers-card-text">
                    <span className="dealers-card-label">{t("shopAddress")}:</span> {dealer.shopAddress}
                  </p>
                  <p className="dealers-card-text">
                    <span className="dealers-card-label">{t("gstNumber")}:</span> {dealer.gstNumber}
                  </p>
                  {loadingCard[dealer._id] && (
                    <div className="card-loader-overlay">
                      <Loader size={24} className="spinner" />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : isSearching ? (
            <p className="dealers-empty-state">{t("noSearchResults")}</p>
          ) : (
            <p className="dealers-empty-state">{t("noDealersFound")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DealersPage;