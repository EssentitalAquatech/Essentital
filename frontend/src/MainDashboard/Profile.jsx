





// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import api, { getImageUrl } from "../utils/api";
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Eye, EyeOff } from "lucide-react";
// import "./Profile.css";

// function Profile() {
//   const { t, i18n } = useTranslation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [photo, setPhoto] = useState("/default-profile.png");
//   const [newPhoto, setNewPhoto] = useState(null);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [isManualLogin, setIsManualLogin] = useState(true);

//   // Loading states
//   const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
//   const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
//   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

//   const userId = localStorage.getItem("userId");


//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
// const [showNewPassword, setShowNewPassword] = useState(false);


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
//           !event.target.closest('.profile-sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Fetch user data
//   useEffect(() => {
//     if (!userId) return;

//     api
//       .get(`/api/user/${userId}`)
//       .then((res) => {
//         const data = res.data;
//         setUsername(data.name || localStorage.getItem("username") || "");
//         setEmail(data.email || localStorage.getItem("email") || "");
//         setPhoto(data.photo ? getImageUrl(data.photo) : "/default-profile.png");
//         setIsManualLogin(data.password ? true : false);
//       })
//       .catch((err) => {
//         console.log("Backend fetch failed, fallback to localStorage", err);
//         setUsername(localStorage.getItem("username") || "");
//         setEmail(localStorage.getItem("email") || "");
//         setPhoto(localStorage.getItem("photo") || "/default-profile.png");
//       });
//   }, [userId]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   // const handlePhotoChange = async () => {
//   //   if (!newPhoto) return alert(t("fillAllFields"));

//   //   setIsUpdatingPhoto(true);
//   //   const formData = new FormData();
//   //   formData.append("photo", newPhoto);

//   //   try {
//   //     const res = await api.put(
//   //       `/api/user/photo/${userId}`,
//   //       formData,
//   //       {
//   //         headers: { "Content-Type": "multipart/form-data" },
//   //       }
//   //     );
//   //     setPhoto(getImageUrl(res.data.photo));
//   //     localStorage.setItem("photo", res.data.photo);
//   //     alert(t("changePhoto") + " " + t("success"));
//   //     setNewPhoto(null);
//   //   } catch (err) {
//   //     console.log(err);
//   //     alert(t("error"));
//   //   } finally {
//   //     setIsUpdatingPhoto(false);
//   //   }
//   // };



// const handlePhotoChange = async () => {
//   if (!newPhoto) return;

//   setIsUpdatingPhoto(true);
//   const formData = new FormData();
//   formData.append("photo", newPhoto);

//   try {
//     const res = await api.put(
//       `/api/user/photo/${userId}`,
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     setPhoto(getImageUrl(res.data.photo));
//     localStorage.setItem("photo", res.data.photo);
//     setNewPhoto(null);
//   } catch (err) {
//     console.log("Photo update failed", err);
//   } finally {
//     setIsUpdatingPhoto(false);
//   }
// };



 


// const handleProfileUpdate = async () => {
//   if (!username.trim()) return;

//   setIsUpdatingUsername(true);
//   try {
//     const res = await api.put(
//       `/api/user/${userId}`,
//       { name: username }
//     );

//     setUsername(res.data.name);
//     localStorage.setItem("username", res.data.name);
//   } catch (err) {
//     console.log("Username update failed", err);
//   } finally {
//     setIsUpdatingUsername(false);
//   }
// };




 

// const handlePasswordChange = async () => {
//   if (!currentPassword || !newPassword) return;

//   setIsUpdatingPassword(true);
//   try {
//     await api.put(
//       `/api/user/password/${userId}`,
//       { currentPassword, newPassword }
//     );

//     setCurrentPassword("");
//     setNewPassword("");
//   } catch (err) {
//     console.log("Password update failed", err);
//   } finally {
//     setIsUpdatingPassword(false);
//   }
// };




//   return (
//     <div className="profile-page-container">
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
//             <h3>Profile</h3>
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
//       <div className={`profile-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="profile-sidebar-section">
//             <img
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//               alt="User"
//               className="profile-sidebar-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5>{username || "User"}</h5>
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

//         <ul className="profile-menu">
//           <li>
//             <Link to="/profile" className="profile-menu-btn active" onClick={() => setIsSidebarOpen(false)}>
//               <User size={18} />  {t("profile")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dashboard" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//              <Home size={18} />   {t("dashboard")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/helpcenter" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//            <HelpCircle size={18} />     {t("helpCenter")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dealers" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//              <ShoppingBag size={18} />   {t("dealers")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/agents" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//            <Users size={18} />     {t("agents")}
//             </Link>
//           </li>
//         </ul>

//         {/* ================= LANGUAGE ================= */}
//         <div className="profile-language-section">
//           <h6>{t("chooseLanguage")}</h6>
//           <select
//             className="profile-language-select"
//             value={i18n.language}
//             onChange={(e) => changeLanguage(e.target.value)}
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
//       <div className={`profile-content-area ${isMobile ? 'mobile-view' : ''}`}>
        
//         {/* Profile Header */}
//         <div className="profile-header">
//           <h3>{t("myProfile")}</h3>
//         </div>

//         {/* Profile Content in Cards Layout */}
//         <div className="profile-cards-container">
          
//           {/* Photo Card */}
//           <div className="profile-form-group">
//             <h4>{t("profileImage")}</h4>
//             <div className="profile-image-section">
//               <img
//                 src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//                 alt="User"
//                 onError={(e) => {
//                   e.target.src = "/profile.png";
//                 }}
//               />
//               <input 
//                 type="file" 
//                 className="profile-form-input"
//                 onChange={(e) => setNewPhoto(e.target.files[0])} 
//                 disabled={isUpdatingPhoto}
//               />
//               <button 
//                 className="profile-btn-primary" 
//                 onClick={handlePhotoChange}
//                 disabled={isUpdatingPhoto || !newPhoto}
//               >
//                 {isUpdatingPhoto ? (
//                   <>
//                     <span className="loader"></span>
//                     {t("updating")}
//                   </>
//                 ) : (
//                   t("changePhoto")
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Username Card */}
//           <div className="profile-form-group">
//             <h4>{t("username")}</h4>
//             <label className="profile-form-label">{t("username")}:</label>
//             <input
//               type="text"
//               className="profile-form-input"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your username"
//               disabled={isUpdatingUsername}
//             />
//             <button 
//               className="profile-btn-success" 
//               onClick={handleProfileUpdate}
//               disabled={isUpdatingUsername || !username.trim()}
//             >
//               {isUpdatingUsername ? (
//                 <>
//                   <span className="loader"></span>
//                   {t("updating")}
//                 </>
//               ) : (
//                 t("updateUsername")
//               )}
//             </button>
//           </div>

//           {/* Email Card */}
//           <div className="profile-form-group">
//             <h4>{t("email")}</h4>
//             <label className="profile-form-label">{t("email")}:</label>
//             <input 
//               type="email" 
//               className="profile-form-input" 
//               value={email} 
//               disabled 
//               placeholder="Your email address"
//             />
//           </div>

//           {/* Password Card */}
//           {/* {isManualLogin && (
//             <div className="profile-form-group">
//               <h4>{t("changePassword")}</h4>
          


// <div className="password-input-wrapper">
//   <input
//     type={showCurrentPassword ? "text" : "password"}
//     className="profile-form-input"
//     value={currentPassword}
//     onChange={(e) => setCurrentPassword(e.target.value)}
//   />

//   <span
//     className="password-eye"
//     onClick={() => setShowCurrentPassword(prev => !prev)}
//   >
//     {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//   </span>
// </div>





          

// <div className="password-input-wrapper">
//   <input
//     type={showNewPassword ? "text" : "password"}
//     className="profile-form-input"
//     value={newPassword}
//     onChange={(e) => setNewPassword(e.target.value)}
//   />

//   <span
//     className="password-eye"
//     onClick={() => setShowNewPassword(prev => !prev)}
//   >
//     {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//   </span>
// </div>




              
//               <button 
//                 className="profile-btn-warning" 
//                 onClick={handlePasswordChange}
//                 disabled={isUpdatingPassword || !currentPassword || !newPassword}
//               >
//                 {isUpdatingPassword ? (
//                   <>
//                     <span className="loader"></span>
//                     {t("updating")}
//                   </>
//                 ) : (
//                   t("updatePassword")
//                 )}
//               </button>
//             </div>
//           )} */}


// {/* Password Card */}
// {isManualLogin && (
//   <div className="profile-form-group">
//     <h4>{t("changePassword")}</h4>
    
//     <label className="profile-form-label">{t("currentPassword")}:</label>
//     <div className="password-input-wrapper">
//       <input
//         type={showCurrentPassword ? "text" : "password"}
//         className="profile-form-input"
//         placeholder={t("currentPassword")}
//         value={currentPassword}
//         onChange={(e) => setCurrentPassword(e.target.value)}
//         disabled={isUpdatingPassword}
//       />
//       <button
//         type="button"
//         className="password-eye"
//         onClick={() => setShowCurrentPassword(prev => !prev)}
//       >
//         {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//       </button>
//     </div>

//     <label className="profile-form-label">{t("newPassword")}:</label>
//     <div className="password-input-wrapper">
//       <input
//         type={showNewPassword ? "text" : "password"}
//         className="profile-form-input"
//         placeholder={t("newPassword")}
//         value={newPassword}
//         onChange={(e) => setNewPassword(e.target.value)}
//         disabled={isUpdatingPassword}
//       />
//       <button
//         type="button"
//         className="password-eye"
//         onClick={() => setShowNewPassword(prev => !prev)}
//       >
//         {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//       </button>
//     </div>
    
//     <button 
//       className="profile-btn-warning" 
//       onClick={handlePasswordChange}
//       disabled={isUpdatingPassword || !currentPassword || !newPassword}
//     >
//       {isUpdatingPassword ? (
//         <>
//           <span className="loader"></span>
//           {t("updating")}
//         </>
//       ) : (
//         t("updatePassword")
//       )}
//     </button>
//   </div>
// )}

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;










// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import api, { getImageUrl } from "../utils/api";
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Eye, EyeOff } from "lucide-react";
// import "./Profile.css";

// function Profile() {
//   const { t, i18n } = useTranslation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [photo, setPhoto] = useState("/default-profile.png");
//   const [newPhoto, setNewPhoto] = useState(null);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [isManualLogin, setIsManualLogin] = useState(true);

//   // Loading states
//   const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
//   const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
//   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

//   const userId = localStorage.getItem("userId");

//   // Eye button states - CHANGE THE DEFAULT TO true IF YOU WANT PASSWORD HIDDEN INITIALLY
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false); // false = password hidden
//   const [showNewPassword, setShowNewPassword] = useState(false); // false = password hidden

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
//           !event.target.closest('.profile-sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Fetch user data
//   useEffect(() => {
//     if (!userId) return;

//     api
//       .get(`/api/user/${userId}`)
//       .then((res) => {
//         const data = res.data;
//         setUsername(data.name || localStorage.getItem("username") || "");
//         setEmail(data.email || localStorage.getItem("email") || "");
//         setPhoto(data.photo ? getImageUrl(data.photo) : "/default-profile.png");
//         setIsManualLogin(data.password ? true : false);
//       })
//       .catch((err) => {
//         console.log("Backend fetch failed, fallback to localStorage", err);
//         setUsername(localStorage.getItem("username") || "");
//         setEmail(localStorage.getItem("email") || "");
//         setPhoto(localStorage.getItem("photo") || "/default-profile.png");
//       });
//   }, [userId]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   const handlePhotoChange = async () => {
//     if (!newPhoto) return;

//     setIsUpdatingPhoto(true);
//     const formData = new FormData();
//     formData.append("photo", newPhoto);

//     try {
//       const res = await api.put(
//         `/api/user/photo/${userId}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setPhoto(getImageUrl(res.data.photo));
//       localStorage.setItem("photo", res.data.photo);
//       setNewPhoto(null);
//     } catch (err) {
//       console.log("Photo update failed", err);
//     } finally {
//       setIsUpdatingPhoto(false);
//     }
//   };

//   const handleProfileUpdate = async () => {
//     if (!username.trim()) return;

//     setIsUpdatingUsername(true);
//     try {
//       const res = await api.put(
//         `/api/user/${userId}`,
//         { name: username }
//       );

//       setUsername(res.data.name);
//       localStorage.setItem("username", res.data.name);
//     } catch (err) {
//       console.log("Username update failed", err);
//     } finally {
//       setIsUpdatingUsername(false);
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (!currentPassword || !newPassword) return;

//     setIsUpdatingPassword(true);
//     try {
//       await api.put(
//         `/api/user/password/${userId}`,
//         { currentPassword, newPassword }
//       );

//       setCurrentPassword("");
//       setNewPassword("");
//     } catch (err) {
//       console.log("Password update failed", err);
//     } finally {
//       setIsUpdatingPassword(false);
//     }
//   };

//   return (
//     <div className="profile-page-container">
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
//             <h3>Profile</h3>
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
//       <div className={`profile-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="profile-sidebar-section">
//             <img
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//               alt="User"
//               className="profile-sidebar-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5>{username || "User"}</h5>
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

//         <ul className="profile-menu">
//           <li>
//             <Link to="/profile" className="profile-menu-btn active" onClick={() => setIsSidebarOpen(false)}>
//               <User size={18} />  {t("profile")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dashboard" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//              <Home size={18} />   {t("dashboard")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/helpcenter" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//            <HelpCircle size={18} />     {t("helpCenter")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dealers" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//              <ShoppingBag size={18} />   {t("dealers")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/agents" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//            <Users size={18} />     {t("agents")}
//             </Link>
//           </li>
//         </ul>

//         {/* ================= LANGUAGE ================= */}
//         <div className="profile-language-section">
//           <h6>{t("chooseLanguage")}</h6>
//           <select
//             className="profile-language-select"
//             value={i18n.language}
//             onChange={(e) => changeLanguage(e.target.value)}
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
//       <div className={`profile-content-area ${isMobile ? 'mobile-view' : ''}`}>
        
//         {/* Profile Header */}
//         <div className="profile-header">
//           <h3>{t("myProfile")}</h3>
//         </div>

//         {/* Profile Content in Cards Layout */}
//         <div className="profile-cards-container">
          
//           {/* Photo Card */}
//           <div className="profile-form-group">
//             <h4>{t("profileImage")}</h4>
//             <div className="profile-image-section">
//               <img
//                 src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//                 alt="User"
//                 onError={(e) => {
//                   e.target.src = "/profile.png";
//                 }}
//               />
//               <input 
//                 type="file" 
//                 className="profile-form-input"
//                 onChange={(e) => setNewPhoto(e.target.files[0])} 
//                 disabled={isUpdatingPhoto}
//               />
//               <button 
//                 className="profile-btn-primary" 
//                 onClick={handlePhotoChange}
//                 disabled={isUpdatingPhoto || !newPhoto}
//               >
//                 {isUpdatingPhoto ? (
//                   <>
//                     <span className="loader"></span>
//                     {t("updating")}
//                   </>
//                 ) : (
//                   t("changePhoto")
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Username Card */}
//           <div className="profile-form-group">
//             <h4>{t("username")}</h4>
//             <label className="profile-form-label">{t("username")}:</label>
//             <input
//               type="text"
//               className="profile-form-input"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your username"
//               disabled={isUpdatingUsername}
//             />
//             <button 
//               className="profile-btn-success" 
//               onClick={handleProfileUpdate}
//               disabled={isUpdatingUsername || !username.trim()}
//             >
//               {isUpdatingUsername ? (
//                 <>
//                   <span className="loader"></span>
//                   {t("updating")}
//                 </>
//               ) : (
//                 t("updateUsername")
//               )}
//             </button>
//           </div>

//           {/* Email Card */}
//           <div className="profile-form-group">
//             <h4>{t("email")}</h4>
//             <label className="profile-form-label">{t("email")}:</label>
//             <input 
//               type="email" 
//               className="profile-form-input" 
//               value={email} 
//               disabled 
//               placeholder="Your email address"
//             />
//           </div>

//           {/* Password Card */}
//           {isManualLogin && (
//             <div className="profile-form-group">
//               <h4>{t("changePassword")}</h4>
              
//               {/* Current Password with Eye Button */}
//               <label className="profile-form-label">{t("currentPassword")}:</label>
//               <div className="password-input-container">
//                 <input
//                   type={showCurrentPassword ? "text" : "password"}
//                   className="profile-form-input password-input"
//                   placeholder={t("currentPassword")}
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   disabled={isUpdatingPassword}
//                 />
//                 <button 
//                   type="button"
//                   className="password-toggle-btn"
//                   onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                   disabled={isUpdatingPassword}
//                   aria-label={showCurrentPassword ? "Hide password" : "Show password"}
//                 >
//                   {/* INVERT THE ICON LOGIC */}
//                   {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//                 </button>
//               </div>

//               {/* New Password with Eye Button */}
//               <label className="profile-form-label">{t("newPassword")}:</label>
//               <div className="password-input-container">
//                 <input
//                   type={showNewPassword ? "text" : "password"}
//                   className="profile-form-input password-input"
//                   placeholder={t("newPassword")}
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   disabled={isUpdatingPassword}
//                 />
//                 <button 
//                   type="button"
//                   className="password-toggle-btn"
//                   onClick={() => setShowNewPassword(!showNewPassword)}
//                   disabled={isUpdatingPassword}
//                   aria-label={showNewPassword ? "Hide password" : "Show password"}
//                 >
//                   {/* INVERT THE ICON LOGIC */}
//                   {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//                 </button>
//               </div>
              
//               <button 
//                 className="profile-btn-warning" 
//                 onClick={handlePasswordChange}
//                 disabled={isUpdatingPassword || !currentPassword || !newPassword}
//               >
//                 {isUpdatingPassword ? (
//                   <>
//                     <span className="loader"></span>
//                     {t("updating")}
//                   </>
//                 ) : (
//                   t("updatePassword")
//                 )}
//               </button>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;

















// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import api, { getImageUrl } from "../utils/api";
// import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Eye, EyeOff, LogOut } from "lucide-react";
// import "./Profile.css";

// function Profile() {
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [photo, setPhoto] = useState("/default-profile.png");
//   const [newPhoto, setNewPhoto] = useState(null);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [isManualLogin, setIsManualLogin] = useState(true);

//   // Loading states
//   const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
//   const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
//   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

//   const userId = localStorage.getItem("userId");

//   // Eye button states
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);

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
//           !event.target.closest('.profile-sidebar') && 
//           !event.target.closest('.mobile-menu-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   // Fetch user data
//   useEffect(() => {
//     if (!userId) return;

//     api
//       .get(`/api/user/${userId}`)
//       .then((res) => {
//         const data = res.data;
//         setUsername(data.name || localStorage.getItem("username") || "");
//         setEmail(data.email || localStorage.getItem("email") || "");
//         setPhoto(data.photo ? getImageUrl(data.photo) : "/default-profile.png");
//         setIsManualLogin(data.password ? true : false);
//       })
//       .catch((err) => {
//         console.log("Backend fetch failed, fallback to localStorage", err);
//         setUsername(localStorage.getItem("username") || "");
//         setEmail(localStorage.getItem("email") || "");
//         setPhoto(localStorage.getItem("photo") || "/default-profile.png");
//       });
//   }, [userId]);

//   // Close sidebar when route changes
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const handlePhotoChange = async () => {
//     if (!newPhoto) return;

//     setIsUpdatingPhoto(true);
//     const formData = new FormData();
//     formData.append("photo", newPhoto);

//     try {
//       const res = await api.put(
//         `/api/user/photo/${userId}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setPhoto(getImageUrl(res.data.photo));
//       localStorage.setItem("photo", res.data.photo);
//       setNewPhoto(null);
//     } catch (err) {
//       console.log("Photo update failed", err);
//     } finally {
//       setIsUpdatingPhoto(false);
//     }
//   };

//   const handleProfileUpdate = async () => {
//     if (!username.trim()) return;

//     setIsUpdatingUsername(true);
//     try {
//       const res = await api.put(
//         `/api/user/${userId}`,
//         { name: username }
//       );

//       setUsername(res.data.name);
//       localStorage.setItem("username", res.data.name);
//     } catch (err) {
//       console.log("Username update failed", err);
//     } finally {
//       setIsUpdatingUsername(false);
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (!currentPassword || !newPassword) return;

//     setIsUpdatingPassword(true);
//     try {
//       await api.put(
//         `/api/user/password/${userId}`,
//         { currentPassword, newPassword }
//       );

//       setCurrentPassword("");
//       setNewPassword("");
//     } catch (err) {
//       console.log("Password update failed", err);
//     } finally {
//       setIsUpdatingPassword(false);
//     }
//   };

//   return (
//     <div className="profile-page-container">
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
//             <h3>Profile</h3>
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
//       <div className={`profile-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="profile-sidebar-section">
//             <img
//               src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//               alt="User"
//               className="profile-sidebar-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5>{username || "User"}</h5>
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

//         <ul className="profile-menu">
//           <li>
//             <Link to="/profile" className="profile-menu-btn active" onClick={() => setIsSidebarOpen(false)}>
//               <User size={18} />  {t("profile")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dashboard" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//              <Home size={18} />   {t("dashboard")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/helpcenter" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//            <HelpCircle size={18} />     {t("helpCenter")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/dealers" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//              <ShoppingBag size={18} />   {t("dealers")}
//             </Link>
//           </li>
//           <li>
//             <Link to="/agents" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
//            <Users size={18} />     {t("agents")}
//             </Link>
//           </li>
          
//           {/* Logout Button in Sidebar */}
//           {/* <li>
//             <button 
//               className="profile-menu-btn logout-btn"
//               onClick={handleLogout}
//             >
//               <LogOut size={18} /> {t("logout") || "Logout"}
//             </button>
//           </li> */}
//         </ul>

//         {/* ================= LANGUAGE ================= */}
//         <div className="profile-language-section">
//           <h6>{t("chooseLanguage")}</h6>
//           <select
//             className="profile-language-select"
//             value={i18n.language}
//             onChange={(e) => changeLanguage(e.target.value)}
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
//       <div className={`profile-content-area ${isMobile ? 'mobile-view' : ''}`}>
        
//         {/* Profile Header with Logout Button */}
//         <div className="profile-header">
//           <h3>{t("myProfile")}</h3>
//           <button 
//             className="logout-btn-header"
//             onClick={handleLogout}
//           >
//             <LogOut size={20} /> {t("logout") || "Logout"}
//           </button>
//         </div>

//         {/* Profile Content in Cards Layout */}
//         <div className="profile-cards-container">
          
//           {/* Photo Card */}
//           <div className="profile-form-group">
//             <h4>{t("profileImage")}</h4>
//             <div className="profile-image-section">
//               <img
//                 src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
//                 alt="User"
//                 onError={(e) => {
//                   e.target.src = "/profile.png";
//                 }}
//               />
//               <input 
//                 type="file" 
//                 className="profile-form-input"
//                 onChange={(e) => setNewPhoto(e.target.files[0])} 
//                 disabled={isUpdatingPhoto}
//               />
//               <button 
//                 className="profile-btn-primary" 
//                 onClick={handlePhotoChange}
//                 disabled={isUpdatingPhoto || !newPhoto}
//               >
//                 {isUpdatingPhoto ? (
//                   <>
//                     <span className="loader"></span>
//                     {t("updating")}
//                   </>
//                 ) : (
//                   t("changePhoto")
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Username Card */}
//           <div className="profile-form-group">
//             <h4>{t("username")}</h4>
//             <label className="profile-form-label">{t("username")}:</label>
//             <input
//               type="text"
//               className="profile-form-input"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your username"
//               disabled={isUpdatingUsername}
//             />
//             <button 
//               className="profile-btn-success" 
//               onClick={handleProfileUpdate}
//               disabled={isUpdatingUsername || !username.trim()}
//             >
//               {isUpdatingUsername ? (
//                 <>
//                   <span className="loader"></span>
//                   {t("updating")}
//                 </>
//               ) : (
//                 t("updateUsername")
//               )}
//             </button>
//           </div>

//           {/* Email Card */}
//           <div className="profile-form-group">
//             <h4>{t("email")}</h4>
//             <label className="profile-form-label">{t("email")}:</label>
//             <input 
//               type="email" 
//               className="profile-form-input" 
//               value={email} 
//               disabled 
//               placeholder="Your email address"
//             />
//           </div>

//           {/* Password Card */}
//           {isManualLogin && (
//             <div className="profile-form-group">
//               <h4>{t("changePassword")}</h4>
              
//               {/* Current Password with Eye Button */}
//               <label className="profile-form-label">{t("currentPassword")}:</label>
//               <div className="password-input-container">
//                 <input
//                   type={showCurrentPassword ? "text" : "password"}
//                   className="profile-form-input password-input"
//                   placeholder={t("currentPassword")}
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   disabled={isUpdatingPassword}
//                 />
//                 <button 
//                   type="button"
//                   className="password-toggle-btn"
//                   onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                   disabled={isUpdatingPassword}
//                   aria-label={showCurrentPassword ? "Hide password" : "Show password"}
//                 >
//                   {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//                 </button>
//               </div>

//               {/* New Password with Eye Button */}
//               <label className="profile-form-label">{t("newPassword")}:</label>
//               <div className="password-input-container">
//                 <input
//                   type={showNewPassword ? "text" : "password"}
//                   className="profile-form-input password-input"
//                   placeholder={t("newPassword")}
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   disabled={isUpdatingPassword}
//                 />
//                 <button 
//                   type="button"
//                   className="password-toggle-btn"
//                   onClick={() => setShowNewPassword(!showNewPassword)}
//                   disabled={isUpdatingPassword}
//                   aria-label={showNewPassword ? "Hide password" : "Show password"}
//                 >
//                   {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//                 </button>
//               </div>
              
//               <button 
//                 className="profile-btn-warning" 
//                 onClick={handlePasswordChange}
//                 disabled={isUpdatingPassword || !currentPassword || !newPassword}
//               >
//                 {isUpdatingPassword ? (
//                   <>
//                     <span className="loader"></span>
//                     {t("updating")}
//                   </>
//                 ) : (
//                   t("updatePassword")
//                 )}
//               </button>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;














import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api, { getImageUrl } from "../utils/api";
import { Menu, X, Home, User, HelpCircle, ShoppingBag, Users, Eye, EyeOff, LogOut } from "lucide-react";
import "./Profile.css";

function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("/default-profile.png");
  const [newPhoto, setNewPhoto] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isManualLogin, setIsManualLogin] = useState(true);

  // Loading states
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const userId = localStorage.getItem("userId");

  // Eye button states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
          !event.target.closest('.profile-sidebar') && 
          !event.target.closest('.mobile-menu-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  // Fetch user data
  useEffect(() => {
    if (!userId) return;

    api
      .get(`/api/user/${userId}`)
      .then((res) => {
        const data = res.data;
        setUsername(data.name || localStorage.getItem("username") || "");
        setEmail(data.email || localStorage.getItem("email") || "");
        setPhoto(data.photo ? getImageUrl(data.photo) : "/default-profile.png");
        setIsManualLogin(data.password ? true : false);
      })
      .catch((err) => {
        console.log("Backend fetch failed, fallback to localStorage", err);
        setUsername(localStorage.getItem("username") || "");
        setEmail(localStorage.getItem("email") || "");
        setPhoto(localStorage.getItem("photo") || "/default-profile.png");
      });
  }, [userId]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [window.location.pathname]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handlePhotoChange = async () => {
    if (!newPhoto) return;

    setIsUpdatingPhoto(true);
    const formData = new FormData();
    formData.append("photo", newPhoto);

    try {
      const res = await api.put(
        `/api/user/photo/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPhoto(getImageUrl(res.data.photo));
      localStorage.setItem("photo", res.data.photo);
      setNewPhoto(null);
    } catch (err) {
      console.log("Photo update failed", err);
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!username.trim()) return;

    setIsUpdatingUsername(true);
    try {
      const res = await api.put(
        `/api/user/${userId}`,
        { name: username }
      );

      setUsername(res.data.name);
      localStorage.setItem("username", res.data.name);
    } catch (err) {
      console.log("Username update failed", err);
    } finally {
      setIsUpdatingUsername(false);
    }
  };











  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) return;

    setIsUpdatingPassword(true);
    try {
      await api.put(
        `/api/user/password/${userId}`,
        { currentPassword, newPassword }
      );

      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.log("Password update failed", err);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="profile-page-container">
      {/* ================= MOBILE NAVBAR ================= */}
      {isMobile && (
        <div className="mobile-navbar">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="mobile-logo">
            <h3>Profile</h3>
          </div>
          
          <div className="mobile-profile">
            <img
              src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
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
      <div className={`profile-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
        <div className="sidebar-close-container">
          <div className="profile-sidebar-section">
            <img
              src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
              alt="User"
              className="profile-sidebar-pic"
              onError={(e) => {
                e.target.src = "/profile.png";
              }}
            />
            <h5>{username || "User"}</h5>
          </div>

          {/* {isMobile && (
            <button 
              className="sidebar-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )} */}
        </div>

        <ul className="profile-menu">
          <li>
            <Link to="/profile" className="profile-menu-btn active" onClick={() => setIsSidebarOpen(false)}>
              <User size={18} />  {t("profile")}
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
             <Home size={18} />   {t("dashboard")}
            </Link>
          </li>
          <li>
            <Link to="/helpcenter" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
           <HelpCircle size={18} />     {t("helpCenter")}
            </Link>
          </li>
          <li>
            <Link to="/dealers" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
             <ShoppingBag size={18} />   {t("dealers")}
            </Link>
          </li>
          <li>
            <Link to="/agents" className="profile-menu-btn" onClick={() => setIsSidebarOpen(false)}>
           <Users size={18} />     {t("agents")}
            </Link>
          </li>
          
          {/* Logout Button in Sidebar */}
          {/* <li>
            <button 
              className="profile-menu-btn logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={18} /> {t("logout") || "Logout"}
            </button>
          </li> */}
        </ul>

        {/* ================= LANGUAGE ================= */}
        <div className="profile-language-section">
          <h6>{t("chooseLanguage")}</h6>
          <select
            className="profile-language-select"
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
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

      {/* ================= RIGHT CONTENT ================= */}
      <div className={`profile-content-area ${isMobile ? 'mobile-view' : ''}`}>
        
        {/* Profile Header WITHOUT Logout Button in Mobile */}
        <div className="profile-header">
          <h3>{t("myProfile")}</h3>
          {/* Show logout button in header only on desktop */}
          {!isMobile && (
            <button 
              className="logout-btn-header"
              onClick={handleLogout}
            >
              <LogOut size={20} /> {t("logout") || "Logout"}
            </button>
          )}
        </div>

        {/* Profile Content in Cards Layout */}
        <div className="profile-cards-container">
          
          {/* Photo Card */}
          <div className="profile-form-group">
            <h4>{t("profileImage")}</h4>
            <div className="profile-image-section">
              <img
                src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
                alt="User"
                onError={(e) => {
                  e.target.src = "/profile.png";
                }}
              />
              <input 
                type="file" 
                className="profile-form-input"
                onChange={(e) => setNewPhoto(e.target.files[0])} 
                disabled={isUpdatingPhoto}
              />
              <button 
                className="profile-btn-primary" 
                onClick={handlePhotoChange}
                disabled={isUpdatingPhoto || !newPhoto}
              >
                {isUpdatingPhoto ? (
                  <>
                    <span className="loader"></span>
                    {t("updating")}
                  </>
                ) : (
                  t("changePhoto")
                )}
              </button>
            </div>
          </div>

          {/* Username Card */}
          <div className="profile-form-group">
            <h4>{t("username")}</h4>
            <label className="profile-form-label">{t("username")}:</label>
            <input
              type="text"
              className="profile-form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isUpdatingUsername}
            />
            <button 
              className="profile-btn-success" 
              onClick={handleProfileUpdate}
              disabled={isUpdatingUsername || !username.trim()}
            >
              {isUpdatingUsername ? (
                <>
                  <span className="loader"></span>
                  {t("updating")}
                </>
              ) : (
                t("updateUsername")
              )}
            </button>
          </div>

          {/* Email Card */}
          <div className="profile-form-group">
            <h4>{t("email")}</h4>
            <label className="profile-form-label">{t("email")}:</label>
            <input 
              type="email" 
              className="profile-form-input" 
              value={email} 
              disabled 
              placeholder="Your email address"
            />
          </div>

          {/* Password Card */}
          {isManualLogin && (
            <div className="profile-form-group">
              <h4>{t("changePassword")}</h4>
              
              {/* Current Password with Eye Button */}
              <label className="profile-form-label">{t("currentPassword")}:</label>
              <div className="password-input-container">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="profile-form-input password-input"
                  placeholder={t("currentPassword")}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isUpdatingPassword}
                />
                <button 
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isUpdatingPassword}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* New Password with Eye Button */}
              <label className="profile-form-label">{t("newPassword")}:</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="profile-form-input password-input"
                  placeholder={t("newPassword")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isUpdatingPassword}
                />
                <button 
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isUpdatingPassword}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              
              <button 
                className="profile-btn-warning" 
                onClick={handlePasswordChange}
                disabled={isUpdatingPassword || !currentPassword || !newPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <span className="loader"></span>
                    {t("updating")}
                  </>
                ) : (
                  t("updatePassword")
                )}
              </button>
            </div>
          )}

          {/* ================= MOBILE LOGOUT BUTTON AT BOTTOM ================= */}
          {isMobile && (
            <div className="profile-form-group mobile-logout-container">
              {/* <h4>{t("session") || "Session"}</h4> */}
              {/* <p className="mobile-logout-text">
                {t("logoutDescription") || "End your current session and logout from the application"}
              </p> */}
              <button 
                className="profile-btn-logout-mobile"
                onClick={handleLogout}
              >
                <LogOut size={20} /> {t("logout") || "Logout"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;