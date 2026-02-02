



// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import api, { getImageUrl } from "../utils/api";
// import { Menu, X, User, Home, Users, HelpCircle, ShoppingBag } from "lucide-react";
// import "./Agent.css";

// function Agent() {
//   const { t, i18n } = useTranslation();

//   const [users, setUsers] = useState([]);
//   const [username, setUsername] = useState("Guest");
//   const [photo, setPhoto] = useState("/default-profile.png");

//   const [notifications, setNotifications] = useState([]);
//   const [unseenCount, setUnseenCount] = useState(0);
//   const [openNotifications, setOpenNotifications] = useState(false);

//   const [sharedFarmers, setSharedFarmers] = useState([]);

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const [selectedAgent, setSelectedAgent] = useState(null);
//   const [selectedAgentName, setSelectedAgentName] = useState("");
//   const [farmers, setFarmers] = useState([]);
//   const [hasAnyAccess, setHasAnyAccess] = useState(false);

//   const [farmerAccess, setFarmerAccess] = useState({});

//   const userId = localStorage.getItem("userId");
//   const agentId = localStorage.getItem("agentId") || userId;

//   const pollRef = useRef(null);
//   const displayedRef = useRef(new Set());

//   // ================= MOBILE CHECK =================
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 991);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // ================= CLOSE SIDEBAR ON OUTSIDE CLICK =================
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         isMobile &&
//         isSidebarOpen &&
//         !e.target.closest(".agent-left-sidebar") &&
//         !e.target.closest(".mobile-menu-toggle")
//       ) {
//         setIsSidebarOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   useEffect(() => {
//     localStorage.removeItem("accessApproved");
//   }, []);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   // ================= USER FETCH =================
//   useEffect(() => {
//     if (!userId) return;

//     api
//       .get(`/api/user/${userId}`)
//       .then((res) => {
//         setUsername(res.data.name || "Guest");
//         setPhoto(res.data.photo ? getImageUrl(res.data.photo) : "/default-profile.png");
//       })
//       .catch(() => {
//         setUsername(localStorage.getItem("username") || "Guest");
//         setPhoto(localStorage.getItem("photo") || "/default-profile.png");
//       });
//   }, [userId]);

//   // ================= ALL USERS =================
//   useEffect(() => {
//     api
//       .get("/api/user")
//       .then((res) => {
//         const filtered = res.data
//           .filter((u) => u._id !== userId)
//           .map((u) => ({
//             ...u,
//             photo: u.photo ? getImageUrl(u.photo) : "/default-profile.png",
//           }));
//         setUsers(filtered);
//       })
//       .catch(() => {});
//   }, [userId]);

//   // ================= APPROVED FARMERS =================
//   useEffect(() => {
//     if (!agentId) return;

//     api
//       .get(`/api/access/approved-farmers/${agentId}`)
//       .then((res) => setSharedFarmers(res.data || []))
//       .catch(() => setSharedFarmers([]));
//   }, [agentId]);

//   // ================= OPEN AGENT =================
//   const openAgent = async (agentId, agentName) => {
//     setSelectedAgent(agentId);
//     setSelectedAgentName(agentName);
//     setFarmerAccess({});

//     try {
//       const res = await api.get(
//         `/api/farmers/by-agent?agentId=${agentId}&viewerId=${userId}`
//       );
//       setFarmers(res.data.farmers || []);
//       setHasAnyAccess(res.data.approved);
//     } catch {
//       setFarmers([]);
//       setHasAnyAccess(false);
//     }
//   };

//   // ================= REQUEST FARMER ACCESS =================
//   const requestFarmerAccess = async (farmerId) => {
//     try {
//       const res = await api.post("/api/access/request-farmer", {
//         requesterId: userId,
//         farmerId,
//       });
//       alert(res.data.message);
//       setFarmerAccess((p) => ({
//         ...p,
//         [farmerId]: { approved: false, pending: true },
//       }));
//     } catch (err) {
//       alert(err.response?.data?.message || "Request failed");
//     }
//   };

//   // ================= CHECK FARMER ACCESS =================
//   const checkFarmerAccess = async (farmerId) => {
//     try {
//       const res = await api.get(
//         `/api/access/check-farmer?requesterId=${userId}&farmerId=${farmerId}`
//       );

//       setFarmerAccess((p) => ({
//         ...p,
//         [farmerId]: { approved: res.data.approved, pending: false },
//       }));

//       if (res.data.approved) {
//         const farmerRes = await api.get(`/api/farmers/${farmerId}`);
//         setSharedFarmers((prev) =>
//           prev.some((f) => f._id === farmerId)
//             ? prev
//             : [...prev, farmerRes.data]
//         );
//       }
//     } catch {}
//   };

//   // ================= NOTIFICATIONS (FIXED axios ISSUE HERE) =================
//   const loadNotifications = () => {
//     if (!agentId) return;

//     api
//       .get(`/api/notification/${agentId}`)
//       .then((res) => {
//         const list = res.data || [];
//         setNotifications(list);
//         setUnseenCount(list.filter((n) => !n.seen).length);
//       })
//       .catch(() => {});
//   };

//   useEffect(() => {
//     if ("Notification" in window && Notification.permission !== "granted") {
//       Notification.requestPermission();
//     }

//     loadNotifications();
//     pollRef.current = setInterval(loadNotifications, 10000);

//     return () => clearInterval(pollRef.current);
//   }, [agentId]);

//   const markSeen = async (id) => {
//     await api.post("/api/notification/seen", { notiId: id });
//     setNotifications((p) => p.map((n) => (n._id === id ? { ...n, seen: true } : n)));
//     setUnseenCount((c) => Math.max(0, c - 1));
//   };

//   // ================= JSX =================
//   return (
//     <div className="agent-page-container">
//       {/* PAGE UI SAME AS YOUR CODE – NO LOGIC CHANGED */}
//       {/* Sidebar, Header, Users, Farmers sections untouched */}

//   {/* ================= MOBILE NAVBAR ================= */}
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
//             <h3>Agents</h3>
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

//       {/* ================= LEFT SIDEBAR ================= */}
//       <div className={`agent-left-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="agent-left-profile-section">
//             <img
//               src={getImageUrl(`/api/images/${userId}/profile`)}
//               alt="User"
//               className="agent-left-profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5 className="agent-left-username">{username}</h5>
//             {/* <p className="agent-left-role">Agent</p> */}
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

//         {/* Stats Section */}
//         <div className="agent-left-stats">
//           <div className="agent-stat-item">
//             {/* <div className="stat-icon">
//               <Users size={20} />
//             </div> */}
//             {/* <div className="stat-content">
//               <h4>{users.length}</h4>
//               <p>Other Agents</p>
//             </div> */}
//           </div>
          
//           {/* <div className="agent-stat-item">
//             <div className="stat-icon">
//               <Users size={20} />
//             </div>
//             <div className="stat-content">
//               <h4>{sharedFarmers.length}</h4>
//               <p>Approved Farmers</p>
//             </div>
//           </div> */}
//         </div>

//         <ul className="agent-left-menu">
//           <li>
//             <Link 
//               to="/profile" 
//               className="agent-left-menu-btn" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <User size={18} /> {t("profile")}
//             </Link>
//           </li>
//           <li>
//             <Link 
//               to="/dashboard" 
//               className="agent-left-menu-btn" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <Home size={18} /> {t("dashboard")}
//             </Link>
//           </li>
//           <li>
//             <Link 
//               to="/dealers" 
//               className="agent-left-menu-btn" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <ShoppingBag size={18} /> {t("dealers")}
//             </Link>
//           </li>
//           <li>
//             <Link 
//               to="/agents" 
//               className="agent-left-menu-btn active" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <Users size={18} /> {t("agents")}
//             </Link>
//           </li>
//           <li>
//             <Link 
//               to="/helpcenter" 
//               className="agent-left-menu-btn" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <HelpCircle size={18} /> {t("helpCenter")}
//             </Link>
//           </li>
//         </ul>

//         {/* Language Section */}
//         <div className="agent-left-language-section">
//           <h6 className="agent-left-language-title">{t("chooseLanguage")}</h6>
//           <select
//             className="agent-left-language-select"
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

//       {/* ================= RIGHT CONTENT AREA ================= */}
//       <div className={`agent-content-area ${isMobile ? 'mobile-view' : ''}`}>
        
//         {/* Header */}
//         <div className="agent-header">
//           <div className="agent-header-left">
//             <h1 className="agent-greeting">{t("helloUser", { name: username })}</h1>
//             <p className="agent-subtitle">{t("allUsers")}</p>
//           </div>
          
//           <div className="agent-header-right">
//             {/* <div className="notification-icon-container">
//               <button 
//                 className="notification-icon"
//                 onClick={() => setOpenNotifications(!openNotifications)}
//               >
//                 <Bell size={20} />
//                 {unseenCount > 0 && (
//                   <span className="notification-count">{unseenCount}</span>
//                 )}
//               </button>
//             </div> */}
            
//             {openNotifications && (
//               <div className="notifications-dropdown">
//                 <div className="notifications-header">
//                   <h5>Notifications</h5>
//                   <button onClick={() => setOpenNotifications(false)} className="close-notifications">
//                     <X size={18} />
//                   </button>
//                 </div>
//                 <div className="notifications-list">
//                   {notifications.length === 0 ? (
//                     <p className="no-notifications">No notifications</p>
//                   ) : (
//                     notifications.slice(0, 5).map((n) => (
//                       <div 
//                         key={n._id} 
//                         className={`notification-item ${n.seen ? '' : 'unseen'}`}
//                         onClick={() => markSeen(n._id)}
//                       >
//                         <p>{n.message}</p>
//                         <span className="notification-time">
//                           {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                         </span>
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="notifications-footer">
//                   <Link to="/notifications">View All</Link>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stats Section - Moved to Right */}
//         <div className="agent-stats-section">
//           <h3 className="agent-stats-title">Agent Dashboard</h3>
//           <div className="agent-stats-grid">
//             {/* <div className="agent-stat-card">
//               <div className="stat-icon">
//                 <Users size={24} />
//               </div>
//               <div className="stat-content">
//                 <h4>{users.length}</h4>
//                 <p>Other Agents</p>
//               </div>
//             </div> */}
            
//             {/* <div className="agent-stat-card">
//               <div className="stat-icon">
//                 <Users size={24} />
//               </div>
//               <div className="stat-content">
//                 <h4>{sharedFarmers.length}</h4>
//                 <p>Approved Farmers</p>
//               </div>
//             </div> */}
//           </div>
//         </div>

//         {/* Users Section */}
//         <div className="agent-user-section">
//           <div className="agent-user-header">
//             <h4 className="agent-user-title">All Registered Users</h4>
//             <span className="agent-user-count">{users.length} Users</span>
//           </div>
          
//           {/* USER LIST (CLICKABLE) */}
//           <div className="agent-list-grid">
//             {users.map((u) => (
//               <div
//                 key={u._id}
//                 className={`agent-user-card ${selectedAgent === u._id ? 'selected' : ''}`}
//                 onClick={() => openAgent(u._id, u.name)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <img
//                   src={getImageUrl(`/api/images/${u._id}/profile`)}
//                   alt={u.name}
//                   className="agent-user-img"
//                   onError={(e) => {
//                     e.target.src = "/profile.png";
//                   }}
//                 />
//                 <div className="agent-user-info">
//                   <h6 className="agent-user-name">{u.name}</h6>
//                   <p className="agent-user-email">{u.email || "-"}</p>
//                   <p className="agent-user-role">{u.role || "User"}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ✅ SELECTED AGENT'S FARMERS SECTION - UPDATED */}
//         {selectedAgent && (
//           <div className="agent-farmer-section">
//             <div className="agent-farmer-header">
//               <h4 className="agent-farmer-title">
//                 {selectedAgentName}'s Farmers
//                 <span className="agent-farmer-count">{farmers.length} Farmers</span>
//               </h4>
//               <div className="access-controls">
//                 <div className="access-status-badge">
//                   <span className={`status-dot ${hasAnyAccess ? 'approved' : 'pending'}`}></span>
//                   <span className="status-text">
//                     {hasAnyAccess ? 'Some Access Granted' : 'No Access Granted'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {farmers.length === 0 ? (
//               <div className="agent-empty-state">
//                 <div className="agent-empty-icon">👨‍🌾</div>
//                 <p className="agent-empty-text">
//                   {selectedAgentName} has no farmers registered
//                 </p>
//               </div>
//             ) : (
//               <div className="agent-farmer-list">
//                 {farmers.map((f) => {
//                   const farmerAccessInfo = farmerAccess[f._id] || { approved: false, pending: false };
//                   const hasAccess = farmerAccessInfo.approved;
//                   const isPending = farmerAccessInfo.pending;
                  
//                   return (
//                     <div className="agent-farmer-card" key={f._id}>
//                       <div className="farmer-card-header">
//                         <div className="farmer-basic-info">
//                           <h5>{f.name}</h5>
//                           <p><b>Mobile:</b> {f.contact || "N/A"}</p>
//                           {f.village && <p><b>Village:</b> {f.village}</p>}
//                         </div>
                        
//                         <div className="farmer-access-status">
//                           {hasAccess ? (
//                             <span className="access-badge approved">
//                               ✓ Access Granted
//                             </span>
//                           ) : isPending ? (
//                             <span className="access-badge pending">
//                               ⏱️ Pending Approval
//                             </span>
//                           ) : (
//                             <span className="access-badge no-access">
//                               🔒 No Access
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* BASIC INFO - Always visible */}
//                       <div className="farmer-details">
//                         {f.area && <p><b>Total Area:</b> {f.area}</p>}
//                         {f.species && <p><b>Species:</b> {f.species}</p>}
//                       </div>

//                       {/* NO ACCESS - Show request button */}
//                       {!hasAccess && !isPending && (
//                         <div className="farmer-access-request">
//                           <button
//                             className="farmer-request-btn"
//                             onClick={() => requestFarmerAccess(f._id)}
//                           >
//                             🔑 Request Access to Pond Details
//                           </button>
//                           <p className="access-note">
//                             Request access to view detailed pond information for this farmer only
//                           </p>
//                         </div>
//                       )}

//                       {/* PENDING APPROVAL */}
//                       {isPending && (
//                         <div className="farmer-pending-request">
//                           <span>⏳</span>
//                           <p>Your request is pending admin approval</p>
                          
//                         </div>
//                       )}

//                       {/* ACCESS GRANTED - Show pond details */}
//                       {hasAccess && f.ponds && f.ponds.length > 0 && (
//                         <div className="farmer-pond-info">
//                           <div className="ponds-header">
//                             <b>Pond Details ({f.ponds.length} ponds)</b>
//                             <button 
//                               className="refresh-btn"
//                               onClick={() => checkFarmerAccess(f._id)}
//                               title="Refresh access status"
//                             >
//                               ⟳
//                             </button>
//                           </div>
//                           <div className="ponds-list">
//                             {f.ponds.map((p) => (
//                               <div key={p.pondId} className="pond-item">
//                                 <p><b>Pond No:</b> {p.pondNo || p.pondNumber || "N/A"}</p>
//                                 <p><b>ID:</b> {p.pondId}</p>
//                                 {p.pondArea && <p><b>Area:</b> {p.pondArea}</p>}
//                                 {p.pondDepth && <p><b>Depth:</b> {p.pondDepth}</p>}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {hasAccess && (!f.ponds || f.ponds.length === 0) && (
//                         <div className="no-ponds-info">
//                           <span>💧</span>
//                           <p>No pond information available for this farmer</p>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ✅ SHARED FARMERS SECTION (Only approved farmers) */}
//         {sharedFarmers.length > 0 && (
//           <div className="agent-farmer-section">
//             <div className="agent-farmer-header">
//               <h4 className="agent-farmer-title">
//                 Your Approved Farmers
//                 <span className="agent-farmer-count">{sharedFarmers.length} Farmers</span>
//               </h4>
//             </div>
            
//             <div className="agent-farmer-list">
//               {sharedFarmers.map((farmer) => (
//                 <div key={farmer._id} className="agent-farmer-card shared-farmer-card">
//                   <h4>{farmer.name}</h4>
//                   <p><b>Village:</b> {farmer.village || "N/A"}</p>
//                   <p><b>Contact:</b> {farmer.contact || "N/A"}</p>
                  
//                   {farmer.ponds && farmer.ponds.length > 0 && (
//                     <div className="farmer-pond-info">
//                       <h5>Ponds ({farmer.ponds.length}):</h5>
//                       <div className="ponds-list">
//                         {farmer.ponds.map((pond) => (
//                           <div key={pond.pondId} className="pond-item">
//                             <p><b>Pond No:</b> {pond.pondNo || pond.pondNumber || "N/A"}</p>
//                             <p><b>ID:</b> {pond.pondId}</p>
//                             {pond.pondArea && <p><b>Area:</b> {pond.pondArea}</p>}
//                             {pond.pondDepth && <p><b>Depth:</b> {pond.pondDepth}</p>}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   {farmer.area && <p><b>Total Area:</b> {farmer.area}</p>}
//                   {farmer.species && <p><b>Species:</b> {farmer.species}</p>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }

// export default Agent;


















// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import api, { getImageUrl } from "../utils/api";
// import { Menu, X, User, Home, Users, HelpCircle, ShoppingBag, Bell } from "lucide-react";
// import { getProfileImage } from "../utils/profileImage";
// import "./Agent.css";

// function Agent() {
//   const { t, i18n } = useTranslation();

//   const [users, setUsers] = useState([]);
//   const [username, setUsername] = useState(t("guest") || "Guest");
//   const [photo, setPhoto] = useState("/default-profile.png");

//   const [notifications, setNotifications] = useState([]);
//   const [unseenCount, setUnseenCount] = useState(0);
//   const [openNotifications, setOpenNotifications] = useState(false);

//   const [sharedFarmers, setSharedFarmers] = useState([]);

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const [selectedAgent, setSelectedAgent] = useState(null);
//   const [selectedAgentName, setSelectedAgentName] = useState("");
//   const [farmers, setFarmers] = useState([]);
//   const [hasAnyAccess, setHasAnyAccess] = useState(false);

//   const [farmerAccess, setFarmerAccess] = useState({});
//   const [loadingAccess, setLoadingAccess] = useState({});

//   const userId = localStorage.getItem("userId");
//   const agentId = localStorage.getItem("agentId") || userId;

//   const pollRef = useRef(null);
//   const displayedRef = useRef(new Set());

//   // ================= MOBILE CHECK =================
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 991);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // ================= CLOSE SIDEBAR ON OUTSIDE CLICK =================
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         isMobile &&
//         isSidebarOpen &&
//         !e.target.closest(".agent-left-sidebar") &&
//         !e.target.closest(".mobile-menu-toggle")
//       ) {
//         setIsSidebarOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isMobile, isSidebarOpen]);

//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [window.location.pathname]);

//   useEffect(() => {
//     localStorage.removeItem("accessApproved");
//   }, []);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("lang", lang);
//   };

//   // ================= USER FETCH =================
//   useEffect(() => {
//     if (!userId) return;

//     api
//       .get(`/api/user/${userId}`)
//       .then((res) => {
//         setUsername(res.data.name || t("guest"));
//         setPhoto(res.data.photo ? getImageUrl(res.data.photo) : "/default-profile.png");
//       })
//       .catch(() => {
//         setUsername(localStorage.getItem("username") || t("guest"));
//         setPhoto(localStorage.getItem("photo") || "/default-profile.png");
//       });
//   }, [userId, t]);

//   // ================= ALL USERS =================
//   useEffect(() => {
//     api
//       .get("/api/user")
//       .then((res) => {
//         const filtered = res.data
//           .filter((u) => u._id !== userId)
//           .map((u) => ({
//             ...u,
//             photo: u.photo ? getImageUrl(u.photo) : "/default-profile.png",
//           }));
//         setUsers(filtered);
//       })
//       .catch(() => {});
//   }, [userId]);

//   // ================= APPROVED FARMERS =================
//   useEffect(() => {
//     if (!agentId) return;

//     api
//       .get(`/api/access/approved-farmers/${agentId}`)
//       .then((res) => setSharedFarmers(res.data || []))
//       .catch(() => setSharedFarmers([]));
//   }, [agentId]);

//   // ================= OPEN AGENT =================
//   const openAgent = async (agentId, agentName) => {
//     setSelectedAgent(agentId);
//     setSelectedAgentName(agentName);
//     setFarmerAccess({});

//     try {
//       const res = await api.get(
//         `/api/farmers/by-agent?agentId=${agentId}&viewerId=${userId}`
//       );
//       setFarmers(res.data.farmers || []);
//       setHasAnyAccess(res.data.approved);
//     } catch {
//       setFarmers([]);
//       setHasAnyAccess(false);
//     }
//   };

//   // ================= REQUEST FARMER ACCESS =================
//   const requestFarmerAccess = async (farmerId) => {
//     setLoadingAccess(prev => ({ ...prev, [farmerId]: true }));
//     try {
//       const res = await api.post("/api/access/request-farmer", {
//         requesterId: userId,
//         farmerId,
//       });
//       alert(res.data.message || t("requestSent"));
//       setFarmerAccess((p) => ({
//         ...p,
//         [farmerId]: { approved: false, pending: true },
//       }));
//     } catch (err) {
//       alert(err.response?.data?.message || t("requestFailed"));
//     } finally {
//       setLoadingAccess(prev => ({ ...prev, [farmerId]: false }));
//     }
//   };

//   // ================= CHECK FARMER ACCESS =================
//   const checkFarmerAccess = async (farmerId) => {
//     setLoadingAccess(prev => ({ ...prev, [farmerId]: true }));
//     try {
//       const res = await api.get(
//         `/api/access/check-farmer?requesterId=${userId}&farmerId=${farmerId}`
//       );

//       setFarmerAccess((p) => ({
//         ...p,
//         [farmerId]: { approved: res.data.approved, pending: false },
//       }));

//       if (res.data.approved) {
//         const farmerRes = await api.get(`/api/farmers/${farmerId}`);
//         setSharedFarmers((prev) =>
//           prev.some((f) => f._id === farmerId)
//             ? prev
//             : [...prev, farmerRes.data]
//         );
//       }
//     } catch {
//       alert(t("errorCheckingAccess"));
//     } finally {
//       setLoadingAccess(prev => ({ ...prev, [farmerId]: false }));
//     }
//   };

//   // ================= NOTIFICATIONS =================
//   const loadNotifications = () => {
//     if (!agentId) return;

//     api
//       .get(`/api/notification/${agentId}`)
//       .then((res) => {
//         const list = res.data || [];
//         setNotifications(list);
//         setUnseenCount(list.filter((n) => !n.seen).length);
//       })
//       .catch(() => {});
//   };

//   useEffect(() => {
//     if ("Notification" in window && Notification.permission !== "granted") {
//       Notification.requestPermission();
//     }

//     loadNotifications();
//     pollRef.current = setInterval(loadNotifications, 10000);

//     return () => clearInterval(pollRef.current);
//   }, [agentId]);

//   const markSeen = async (id) => {
//     await api.post("/api/notification/seen", { notiId: id });
//     setNotifications((p) => p.map((n) => (n._id === id ? { ...n, seen: true } : n)));
//     setUnseenCount((c) => Math.max(0, c - 1));
//   };

//   return (
//     <div className="agent-page-container">
//       {/* ================= MOBILE NAVBAR ================= */}
//       {isMobile && (
//         <div className="mobile-navbar">
//           <button 
//             className="mobile-menu-toggle"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             aria-label={t("toggleMenu")}
//           >
//             {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
          
//           <div className="mobile-logo">
//             <h3>{t("agents")}</h3>
//           </div>
          
//           <div className="mobile-profile">
//             <img
//               // src={getImageUrl(`/api/images/${userId}/profile`)}
//               src={getImageUrl(userId, "profile")}
//               alt={username}
//               className="mobile-profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* ================= LEFT SIDEBAR ================= */}
//       <div className={`agent-left-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
//         <div className="sidebar-close-container">
//           <div className="agent-left-profile-section">
//             <img
//               // src={getImageUrl(`/api/images/${userId}/profile`)}
//               // src={getImageUrl(userId, "profile")}
//                src={getProfileImage(userId)}
//               alt={username}
//               className="agent-left-profile-pic"
//               onError={(e) => {
//                 e.target.src = "/profile.png";
//               }}
//             />
//             <h5 className="agent-left-username">{username}</h5>
//           </div>


//         </div>

//         {/* Stats Section */}
//         <div className="agent-left-stats">
//           <div className="agent-stat-item">
//             {/* You can add stats here if needed */}
//           </div>
//         </div>

//         <ul className="agent-left-menu">
//           <li>
//             <Link 
//               to="/profile" 
//               className="agent-left-menu-btn" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <User size={18} /> {t("profile")}
//             </Link>
//           </li>
//           <li>
//             <Link 
//               to="/dashboard" 
//               className="agent-left-menu-btn" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <Home size={18} /> {t("dashboard")}
//             </Link>
//           </li>


//   <li>
//             <Link 
//               to="/helpcenter" 
//               className="agent-left-menu-btn" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <HelpCircle size={18} /> {t("helpCenter")}
//             </Link>
//           </li>


//           <li>
//             <Link 
//               to="/dealers" 
//               className="agent-left-menu-btn" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <ShoppingBag size={18} /> {t("dealers")}
//             </Link>
//           </li>
//           <li>
//             <Link 
//               to="/agents" 
//               className="agent-left-menu-btn active" 
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <Users size={18} /> {t("agents")}
//             </Link>
//           </li>
        
//         </ul>

//         {/* Language Section */}
//         <div className="agent-left-language-section">
//           <h6 className="agent-left-language-title">{t("chooseLanguage")}</h6>
//           <select
//             className="agent-left-language-select"
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

//       {/* ================= RIGHT CONTENT AREA ================= */}
//       <div className={`agent-content-area ${isMobile ? 'mobile-view' : ''}`}>
        
//         {/* Header */}
//         <div className="agent-header">
//           <div className="agent-header-left">
//             <h1 className="agent-greeting">{t("helloUser", { name: username })}</h1>
//             <p className="agent-subtitle">{t("allUsers")}</p>
//           </div>
          
//           <div className="agent-header-right">
            
//             {openNotifications && (
//               <div className="notifications-dropdown">
//                 <div className="notifications-header">
//                   <h5>{t("notifications")}</h5>
//                   <button onClick={() => setOpenNotifications(false)} className="close-notifications">
//                     <X size={18} />
//                   </button>
//                 </div>
//                 <div className="notifications-list">
//                   {notifications.length === 0 ? (
//                     <p className="no-notifications">{t("noNotifications")}</p>
//                   ) : (
//                     notifications.slice(0, 5).map((n) => (
//                       <div 
//                         key={n._id} 
//                         className={`notification-item ${n.seen ? '' : 'unseen'}`}
//                         onClick={() => markSeen(n._id)}
//                       >
//                         <p>{n.message}</p>
//                         <span className="notification-time">
//                           {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                         </span>
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="notifications-footer">
//                   <Link to="/notifications">{t("viewAll")}</Link>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="agent-stats-section">
//           <h3 className="agent-stats-title">{t("agentDashboard")}</h3>
//           <div className="agent-stats-grid">
//             {/* Stats can be added here */}
//           </div>
//         </div>

//         {/* Users Section */}
//         <div className="agent-user-section">
//           <div className="agent-user-header">
//             <h4 className="agent-user-title">{t("allRegisteredUsers")}</h4>
//             <span className="agent-user-count">{users.length} {t("users")}</span>
//           </div>
          
//           {/* USER LIST */}
//           <div className="agent-list-grid">
//             {users.map((u) => (
//               <div
//                 key={u._id}
//                 className={`agent-user-card ${selectedAgent === u._id ? 'selected' : ''}`}
//                 onClick={() => openAgent(u._id, u.name)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <img
//                   // src={getImageUrl(`/api/images/${u._id}/profile`)}
//                   //  src={getImageUrl(userId, "profile")}
//                    src={getProfileImage(u._id)}
//                   alt={u.name}
//                   className="agent-user-img"
//                   onError={(e) => {
//                     e.target.src = "/profile.png";
//                   }}
//                 />
//                 <div className="agent-user-info">
//                   <h6 className="agent-user-name">{u.name}</h6>
//                   <p className="agent-user-email">{u.email || "-"}</p>
//                   <p className="agent-user-role">{u.role || t("user")}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* SELECTED AGENT'S FARMERS SECTION */}
//         {selectedAgent && (
//           <div className="agent-farmer-section">
//             <div className="agent-farmer-header">
//               <h4 className="agent-farmer-title">
//                 {selectedAgentName}'s {t("farmers")}
//                 <span className="agent-farmer-count">{farmers.length} {t("farmers")}</span>
//               </h4>
//               <div className="access-controls">
//                 <div className="access-status-badge">
//                   <span className={`status-dot ${hasAnyAccess ? 'approved' : 'pending'}`}></span>
//                   <span className="status-text">
//                     {hasAnyAccess ? t("someAccessGranted") : t("noAccessGranted")}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {farmers.length === 0 ? (
//               <div className="agent-empty-state">
//                 <div className="agent-empty-icon">👨‍🌾</div>
//                 <p className="agent-empty-text">
//                   {selectedAgentName} {t("noFarmersRegistered")}
//                 </p>
//               </div>
//             ) : (
//               <div className="agent-farmer-list">
//                 {farmers.map((f) => {
//                   const farmerAccessInfo = farmerAccess[f._id] || { approved: false, pending: false };
//                   const hasAccess = farmerAccessInfo.approved;
//                   const isPending = farmerAccessInfo.pending;
                  
//                   return (
//                     <div className="agent-farmer-card" key={f._id}>
//                       <div className="farmer-card-header">
//                         <div className="farmer-basic-info">
//                           <h5>{f.name}</h5>
//                           <p><b>{t("contactNumber")}:</b> {f.contact || t("na")}</p>
//                           {f.village && <p><b>{t("village")}:</b> {f.village}</p>}
//                         </div>
                        
//                         <div className="farmer-access-status">
//                           {hasAccess ? (
//                             <span className="access-badge approved">
//                               ✓ {t("accessGranted")}
//                             </span>
//                           ) : isPending ? (
//                             <span className="access-badge pending">
//                               ⏱️ {t("pendingApproval")}
//                             </span>
//                           ) : (
//                             <span className="access-badge no-access">
//                               🔒 {t("noAccess")}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* BASIC INFO */}
//                       <div className="farmer-details">
//                         {f.area && <p><b>{t("totalArea")}:</b> {f.area}</p>}
//                         {f.species && <p><b>{t("species")}:</b> {f.species}</p>}
//                       </div>

//                       {/* NO ACCESS */}
//                       {!hasAccess && !isPending && (
//                         <div className="farmer-access-request">
//                           <button
//                             className="farmer-request-btn"
//                             onClick={() => requestFarmerAccess(f._id)}
//                             disabled={loadingAccess[f._id]}
//                           >
//                             {loadingAccess[f._id] ? (
//                               <span className="loading-spinner-small"></span>
//                             ) : (
//                               "🔑"
//                             )}
//                             {t("requestAccessToPondDetails")}
//                           </button>
//                           <p className="access-note">
//                             {t("accessNote")}
//                           </p>
//                         </div>
//                       )}

//                       {/* PENDING APPROVAL */}
//                       {isPending && (
//                         <div className="farmer-pending-request">
//                           <span>⏳</span>
//                           <p>{t("requestPendingApproval")}</p>
//                         </div>
//                       )}

//                       {/* ACCESS GRANTED */}
//                       {hasAccess && f.ponds && f.ponds.length > 0 && (
//                         <div className="farmer-pond-info">
//                           <div className="ponds-header">
//                             <b>{t("pondDetails")} ({f.ponds.length} {t("ponds")})</b>
//                             <button 
//                               className="refresh-btn"
//                               onClick={() => checkFarmerAccess(f._id)}
//                               title={t("refreshAccessStatus")}
//                               disabled={loadingAccess[f._id]}
//                             >
//                               {loadingAccess[f._id] ? (
//                                 <span className="loading-spinner-small"></span>
//                               ) : (
//                                 "⟳"
//                               )}
//                             </button>
//                           </div>
//                           <div className="ponds-list">
//                             {f.ponds.map((p) => (
//                               <div key={p.pondId} className="pond-item">
//                                 <p><b>{t("pondNumber")}:</b> {p.pondNo || p.pondNumber || t("na")}</p>
//                                 <p><b>{t("id")}:</b> {p.pondId}</p>
//                                 {p.pondArea && <p><b>{t("area")}:</b> {p.pondArea}</p>}
//                                 {p.pondDepth && <p><b>{t("depth")}:</b> {p.pondDepth}</p>}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {hasAccess && (!f.ponds || f.ponds.length === 0) && (
//                         <div className="no-ponds-info">
//                           <span>💧</span>
//                           <p>{t("noPondInformation")}</p>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* SHARED FARMERS SECTION */}
//         {sharedFarmers.length > 0 && (
//           <div className="agent-farmer-section">
//             <div className="agent-farmer-header">
//               <h4 className="agent-farmer-title">
//                 {t("yourApprovedFarmers")}
//                 <span className="agent-farmer-count">{sharedFarmers.length} {t("farmers")}</span>
//               </h4>
//             </div>
            
//             <div className="agent-farmer-list">
//               {sharedFarmers.map((farmer) => (
//                 <div key={farmer._id} className="agent-farmer-card shared-farmer-card">
//                   <h4>{farmer.name}</h4>
//                   <p><b>{t("village")}:</b> {farmer.village || t("na")}</p>
//                   <p><b>{t("contactNumber")}:</b> {farmer.contact || t("na")}</p>
                  
//                   {farmer.ponds && farmer.ponds.length > 0 && (
//                     <div className="farmer-pond-info">
//                       <h5>{t("ponds")} ({farmer.ponds.length}):</h5>
//                       <div className="ponds-list">
//                         {farmer.ponds.map((pond) => (
//                           <div key={pond.pondId} className="pond-item">
//                             <p><b>{t("pondNumber")}:</b> {pond.pondNo || pond.pondNumber || t("na")}</p>
//                             <p><b>{t("id")}:</b> {pond.pondId}</p>
//                             {pond.pondArea && <p><b>{t("area")}:</b> {pond.pondArea}</p>}
//                             {pond.pondDepth && <p><b>{t("depth")}:</b> {pond.pondDepth}</p>}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   {farmer.area && <p><b>{t("totalArea")}:</b> {farmer.area}</p>}
//                   {farmer.species && <p><b>{t("species")}:</b> {farmer.species}</p>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Agent;















//uper vala sahi hai

















import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api, { getImageUrl } from "../utils/api";
import { Menu, X, User, Home, Users, HelpCircle, ShoppingBag, Bell } from "lucide-react";
import { getProfileImage } from "../utils/profileImage";
import "./Agent.css";

function Agent() {
  const { t, i18n } = useTranslation();

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState(t("guest") || "Guest");
  const [photo, setPhoto] = useState("/default-profile.png");

  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);

  const [sharedFarmers, setSharedFarmers] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedAgentName, setSelectedAgentName] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [hasAnyAccess, setHasAnyAccess] = useState(false);

  const [farmerAccess, setFarmerAccess] = useState({});
  const [loadingAccess, setLoadingAccess] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const agentId = localStorage.getItem("agentId") || userId;

  const pollRef = useRef(null);
  const farmerIdsRef = useRef(new Set());

  // ================= MOBILE CHECK =================
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 991);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ================= CLOSE SIDEBAR ON OUTSIDE CLICK =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMobile &&
        isSidebarOpen &&
        !e.target.closest(".agent-left-sidebar") &&
        !e.target.closest(".mobile-menu-toggle")
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [window.location.pathname]);

  useEffect(() => {
    localStorage.removeItem("accessApproved");
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  // ================= OPTIMIZED: Load all data =================
  const loadAllData = useCallback(async () => {
    if (!userId || !initialLoad) return;
    
    try {
      setLoading(true);
      
      // Parallel API calls for initial data
      const [userRes, usersRes, farmersRes, notificationsRes] = await Promise.all([
        api.get(`/api/user/${userId}`).catch(() => ({ data: null })),
        api.get("/api/user").catch(() => ({ data: [] })),
        api.get(`/api/access/approved-farmers/${agentId}`).catch(() => ({ data: [] })),
        api.get(`/api/notification/${agentId}?limit=5`).catch(() => ({ data: [] }))
      ]);
      
      // Process user data
      if (userRes.data) {
        setUsername(userRes.data.name || t("guest"));
        setPhoto(userRes.data.photo ? getImageUrl(userRes.data.photo) : "/default-profile.png");
        localStorage.setItem("username", userRes.data.name);
        if (userRes.data.photo) localStorage.setItem("photo", userRes.data.photo);
      } else {
        setUsername(localStorage.getItem("username") || t("guest"));
        setPhoto(localStorage.getItem("photo") || "/default-profile.png");
      }
      
      // Process users list
      if (usersRes.data) {
        const filtered = usersRes.data
          .filter((u) => u._id !== userId)
          .map((u) => ({
            ...u,
            photo: u.photo ? getImageUrl(u.photo) : "/default-profile.png",
          }));
        setUsers(filtered);
      }
      
      // Process shared farmers
      setSharedFarmers(farmersRes.data || []);
      
      // Process notifications
      setNotifications(notificationsRes.data || []);
      setUnseenCount(notificationsRes.data?.filter((n) => !n.seen).length || 0);
      
      setInitialLoad(false);
      setLoading(false);
      
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  }, [userId, agentId, t, initialLoad]);

  // ================= INITIAL DATA LOAD =================
  useEffect(() => {
    loadAllData();
    
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadAllData]);

  // ================= OPTIMIZED: Open Agent =================
  const openAgent = useCallback(async (agentId, agentName) => {
    if (!agentId) return;
    
    setSelectedAgent(agentId);
    setSelectedAgentName(agentName);
    setFarmerAccess({});
    
    try {
      // Single API call for agent's farmers
      const { data } = await api.get(`/api/farmers/by-agent?agentId=${agentId}&viewerId=${userId}`);
      setFarmers(data.farmers || []);
      setHasAnyAccess(data.approved || false);
      
      // Check access for all farmers at once
      const farmerIds = data.farmers?.map(f => f._id) || [];
      if (farmerIds.length > 0) {
        checkMultipleFarmersAccess(farmerIds);
      }
      
    } catch (error) {
      console.error("Error opening agent:", error);
      setFarmers([]);
      setHasAnyAccess(false);
    }
  }, [userId]);

  // ================= OPTIMIZED: Check multiple farmers access =================
  const checkMultipleFarmersAccess = useCallback(async (farmerIds) => {
    if (!farmerIds || farmerIds.length === 0) return;
    
    try {
      const { data } = await api.post("/api/access/check-multiple-farmers", {
        requesterId: userId,
        farmerIds
      });
      
      const updates = {};
      farmerIds.forEach(farmerId => {
        if (data.access && data.access[farmerId]) {
          updates[farmerId] = { approved: true, pending: false };
        }
      });
      
      if (Object.keys(updates).length > 0) {
        setFarmerAccess(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error("Error checking multiple access:", error);
    }
  }, [userId]);

  // ================= REQUEST FARMER ACCESS =================
  const requestFarmerAccess = async (farmerId) => {
    if (loadingAccess[farmerId]) return;
    
    setLoadingAccess(prev => ({ ...prev, [farmerId]: true }));
    try {
      const { data } = await api.post("/api/access/request-farmer", {
        requesterId: userId,
        farmerId,
      });
      
      alert(data.message || t("requestSent"));
      setFarmerAccess(prev => ({
        ...prev,
        [farmerId]: { approved: false, pending: true },
      }));
      
    } catch (err) {
      alert(err.response?.data?.message || t("requestFailed"));
    } finally {
      setLoadingAccess(prev => ({ ...prev, [farmerId]: false }));
    }
  };

  // ================= NOTIFICATIONS =================
  const loadNotifications = useCallback(() => {
    if (!agentId) return;
    
    api.get(`/api/notification/${agentId}?limit=5`)
      .then((res) => {
        if (res.data) {
          setNotifications(res.data);
          setUnseenCount(res.data.filter((n) => !n.seen).length);
        }
      })
      .catch(() => {});
  }, [agentId]);

  useEffect(() => {
    if (!initialLoad) {
      pollRef.current = setInterval(loadNotifications, 30000); // 30 seconds
    }
    
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [initialLoad, loadNotifications]);

  const markSeen = async (id) => {
    try {
      await api.post("/api/notification/seen", { notiId: id });
      setNotifications(prev => prev.map((n) => 
        n._id === id ? { ...n, seen: true } : n
      ));
      setUnseenCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  // ================= OPTIMIZED: Render Farmer Card =================
  const renderFarmerCard = useCallback((farmer) => {
    const accessInfo = farmerAccess[farmer._id] || { approved: false, pending: false };
    const hasAccess = accessInfo.approved;
    const isPending = accessInfo.pending;
    const isLoading = loadingAccess[farmer._id];
    
    return (
      <div className="agent-farmer-card" key={farmer._id}>
        <div className="farmer-card-header">
          <div className="farmer-basic-info">
            <h5>{farmer.name}</h5>
            <p><b>{t("contactNumber")}:</b> {farmer.contact || t("na")}</p>
            {farmer.village && <p><b>{t("village")}:</b> {farmer.village}</p>}
          </div>
          
          <div className="farmer-access-status">
            {hasAccess ? (
              <span className="access-badge approved">✓ {t("accessGranted")}</span>
            ) : isPending ? (
              <span className="access-badge pending">⏱️ {t("pendingApproval")}</span>
            ) : (
              <span className="access-badge no-access">🔒 {t("noAccess")}</span>
            )}
          </div>
        </div>

        <div className="farmer-details">
          {farmer.area && <p><b>{t("totalArea")}:</b> {farmer.area}</p>}
          {farmer.species && <p><b>{t("species")}:</b> {farmer.species}</p>}
        </div>

        {!hasAccess && !isPending && (
          <div className="farmer-access-request">
            <button
              className="farmer-request-btn"
              onClick={() => requestFarmerAccess(farmer._id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner-small"></span>
              ) : "🔑"}
              {t("requestAccessToPondDetails")}
            </button>
            <p className="access-note">{t("accessNote")}</p>
          </div>
        )}

        {isPending && (
          <div className="farmer-pending-request">
            <span>⏳</span>
            <p>{t("requestPendingApproval")}</p>
          </div>
        )}

        {hasAccess && farmer.ponds && farmer.ponds.length > 0 && (
          <div className="farmer-pond-info">
            <div className="ponds-header">
              <b>{t("pondDetails")} ({farmer.ponds.length} {t("ponds")})</b>
            </div>
            <div className="ponds-list">
              {farmer.ponds.slice(0, 3).map((p) => (
                <div key={p.pondId} className="pond-item">
                  <p><b>{t("pondNumber")}:</b> {p.pondNo || p.pondNumber || t("na")}</p>
                  <p><b>{t("id")}:</b> {p.pondId}</p>
                  {p.pondArea && <p><b>{t("area")}:</b> {p.pondArea}</p>}
                </div>
              ))}
              {farmer.ponds.length > 3 && (
                <p className="more-ponds">+ {farmer.ponds.length - 3} more ponds</p>
              )}
            </div>
          </div>
        )}

        {hasAccess && (!farmer.ponds || farmer.ponds.length === 0) && (
          <div className="no-ponds-info">
            <span>💧</span>
            <p>{t("noPondInformation")}</p>
          </div>
        )}
      </div>
    );
  }, [farmerAccess, loadingAccess, t, requestFarmerAccess]);

  // ================= OPTIMIZED: Memoized User Cards =================
  const userCards = useMemo(() => 
    users.map((u) => (
      <div
        key={u._id}
        className={`agent-user-card ${selectedAgent === u._id ? 'selected' : ''}`}
        onClick={() => openAgent(u._id, u.name)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={getProfileImage(u._id)}
          alt={u.name}
          className="agent-user-img"
          onError={(e) => { e.target.src = "/profile.png"; }}
          loading="lazy"
        />
        <div className="agent-user-info">
          <h6 className="agent-user-name">{u.name}</h6>
          <p className="agent-user-email">{u.email || "-"}</p>
          <p className="agent-user-role">{u.role || t("user")}</p>
        </div>
      </div>
    )),
  [users, selectedAgent, openAgent, t]);

  // ================= OPTIMIZED: Memoized Shared Farmer Cards =================
  const sharedFarmerCards = useMemo(() => 
    sharedFarmers.slice(0, 10).map((farmer) => (
      <div key={farmer._id} className="agent-farmer-card shared-farmer-card">
        <h4>{farmer.name}</h4>
        <p><b>{t("village")}:</b> {farmer.village || t("na")}</p>
        <p><b>{t("contactNumber")}:</b> {farmer.contact || t("na")}</p>
        
        {farmer.ponds && farmer.ponds.length > 0 && (
          <div className="farmer-pond-info">
            <h5>{t("ponds")} ({farmer.ponds.length}):</h5>
            <div className="ponds-list">
              {farmer.ponds.slice(0, 2).map((pond) => (
                <div key={pond.pondId} className="pond-item">
                  <p><b>{t("pondNumber")}:</b> {pond.pondNo || pond.pondNumber || t("na")}</p>
                  <p><b>{t("id")}:</b> {pond.pondId}</p>
                  {pond.pondArea && <p><b>{t("area")}:</b> {pond.pondArea}</p>}
                </div>
              ))}
              {farmer.ponds.length > 2 && (
                <p className="more-ponds">+ {farmer.ponds.length - 2} more ponds</p>
              )}
            </div>
          </div>
        )}
        
        {farmer.area && <p><b>{t("totalArea")}:</b> {farmer.area}</p>}
        {farmer.species && <p><b>{t("species")}:</b> {farmer.species}</p>}
      </div>
    )),
  [sharedFarmers, t]);

  if (loading) {
    return (
      <div className="agent-page-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>{t("loading")}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-page-container">
      {isMobile && (
        <div className="mobile-navbar">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={t("toggleMenu")}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="mobile-logo">
            <h3>{t("agents")}</h3>
          </div>
          
          <div className="mobile-profile">
            <img
              src={getProfileImage(userId)}
              alt={username}
              className="mobile-profile-pic"
              onError={(e) => { e.target.src = "/profile.png"; }}
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className={`agent-left-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
        <div className="sidebar-close-container">
          <div className="agent-left-profile-section">
            <img
              src={getProfileImage(userId)}
              alt={username}
              className="agent-left-profile-pic"
              onError={(e) => { e.target.src = "/profile.png"; }}
              loading="lazy"
            />
            <h5 className="agent-left-username">{username}</h5>
          </div>
        </div>

        <div className="agent-left-stats">
          <div className="agent-stat-item">
            {/* Stats can be added here */}
          </div>
        </div>

        <ul className="agent-left-menu">
          <li>
            <Link to="/profile" className="agent-left-menu-btn" onClick={() => setIsSidebarOpen(false)}>
              <User size={18} /> {t("profile")}
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="agent-left-menu-btn" onClick={() => setIsSidebarOpen(false)}>
              <Home size={18} /> {t("dashboard")}
            </Link>
          </li>
          <li>
            <Link to="/helpcenter" className="agent-left-menu-btn" onClick={() => setIsSidebarOpen(false)}>
              <HelpCircle size={18} /> {t("helpCenter")}
            </Link>
          </li>
          <li>
            <Link to="/dealers" className="agent-left-menu-btn" onClick={() => setIsSidebarOpen(false)}>
              <ShoppingBag size={18} /> {t("dealers")}
            </Link>
          </li>
          <li>
            <Link to="/agents" className="agent-left-menu-btn active" onClick={() => setIsSidebarOpen(false)}>
              <Users size={18} /> {t("agents")}
            </Link>
          </li>
        </ul>

        <div className="agent-left-language-section">
          <h6 className="agent-left-language-title">{t("chooseLanguage")}</h6>
          <select
            className="agent-left-language-select"
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

      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <div className={`agent-content-area ${isMobile ? 'mobile-view' : ''}`}>
        <div className="agent-header">
          <div className="agent-header-left">
            <h1 className="agent-greeting">{t("helloUser", { name: username })}</h1>
            <p className="agent-subtitle">{t("allUsers")}</p>
          </div>
          
          <div className="agent-header-right">
            <button className="notification-btn" onClick={() => setOpenNotifications(!openNotifications)}>
              <Bell size={20} />
              {unseenCount > 0 && <span className="notification-count">{unseenCount}</span>}
            </button>
            
            {openNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h5>{t("notifications")}</h5>
                  <button onClick={() => setOpenNotifications(false)} className="close-notifications">
                    <X size={18} />
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <p className="no-notifications">{t("noNotifications")}</p>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div 
                        key={n._id} 
                        className={`notification-item ${n.seen ? '' : 'unseen'}`}
                        onClick={() => markSeen(n._id)}
                      >
                        <p>{n.message}</p>
                        <span className="notification-time">
                          {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="notifications-footer">
                  <Link to="/notifications">{t("viewAll")}</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="agent-stats-section">
          <h3 className="agent-stats-title">{t("agentDashboard")}</h3>
          <div className="agent-stats-grid">
            {/* Stats placeholder */}
          </div>
        </div>

        <div className="agent-user-section">
          <div className="agent-user-header">
            <h4 className="agent-user-title">{t("allRegisteredUsers")}</h4>
            <span className="agent-user-count">{users.length} {t("users")}</span>
          </div>
          
          <div className="agent-list-grid">
            {userCards}
          </div>
        </div>

        {selectedAgent && (
          <div className="agent-farmer-section">
            <div className="agent-farmer-header">
              <h4 className="agent-farmer-title">
                {selectedAgentName}'s {t("farmers")}
                <span className="agent-farmer-count">{farmers.length} {t("farmers")}</span>
              </h4>
              <div className="access-controls">
                <div className="access-status-badge">
                  <span className={`status-dot ${hasAnyAccess ? 'approved' : 'pending'}`}></span>
                  <span className="status-text">
                    {hasAnyAccess ? t("someAccessGranted") : t("noAccessGranted")}
                  </span>
                </div>
              </div>
            </div>

            {farmers.length === 0 ? (
              <div className="agent-empty-state">
                <div className="agent-empty-icon">👨‍🌾</div>
                <p className="agent-empty-text">
                  {selectedAgentName} {t("noFarmersRegistered")}
                </p>
              </div>
            ) : (
              <div className="agent-farmer-list">
                {farmers.map(farmer => renderFarmerCard(farmer))}
              </div>
            )}
          </div>
        )}

        {sharedFarmers.length > 0 && (
          <div className="agent-farmer-section">
            <div className="agent-farmer-header">
              <h4 className="agent-farmer-title">
                {t("yourApprovedFarmers")}
                <span className="agent-farmer-count">{sharedFarmers.length} {t("farmers")}</span>
              </h4>
            </div>
            
            <div className="agent-farmer-list">
              {sharedFarmerCards}
              {sharedFarmers.length > 10 && (
                <div className="more-farmers-note">
                  <p>... and {sharedFarmers.length - 10} more farmers</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Agent;