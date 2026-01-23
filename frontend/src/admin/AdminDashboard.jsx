

// // AdminDashboard.js
// import React, { useEffect, useState } from "react";
// import api, { getImageUrl } from "../utils/api";
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

//   const [accessRequests, setAccessRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ NEW STATES FOR POND DETAILS
//   const [selectedFarmer, setSelectedFarmer] = useState(null);
//   const [showPondDetails, setShowPondDetails] = useState(false);
//   const [selectedPond, setSelectedPond] = useState(null);
//   const [pondDetailsModalOpen, setPondDetailsModalOpen] = useState(false);

//   const navigate = useNavigate();

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
//     setSelectedFarmer(null); // Reset selected farmer
//     setShowPondDetails(false); // Reset pond details view
//     api
//       .get(`/api/admin/agents/${agentId}/details`)
//       .then((res) => {
//         setFarmers(res.data.farmers || []);
//         setDealers(res.data.dealers || []);
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

//   // ✅ Open Pond Details Modal
//   const openPondDetails = (pond) => {
//     setSelectedPond(pond);
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



// // Use API_URL or getImageUrl helper for building absolute links when needed



//   // ✅ UPDATED: Download farmer data with ALL ponds
//   const downloadFarmerExcelWithAllPonds = (farmersData) => {
//     if (!farmersData.length) return;
    
//     try {
//       // Create an array to hold all rows
//       const allRows = [];
      
//       // Define farmer headers (basic info)
//       const farmerHeaders = [
//         "Farmer ID", "Name", "Contact", "Age", "Gender", "Village", 
//         "Aadhar", "Family Members", "Family Occupation", "Photo", 
//         "Pond Count", "Created At", "Updated At", "Agent ID", "Agent Name"
//       ];
      
//       // Define pond headers (detailed info for each pond)
//       const pondHeaders = [
//         "Pond ID", "Pond Number", "Pond Area", "Area Unit", "Pond Depth",
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
      
//       // Combine all headers
//       const allHeaders = [...farmerHeaders, ...pondHeaders.map(h => `Pond_${h}`)];
      
//       // Add header row
//       allRows.push(allHeaders);
      
//       // Process each farmer
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
//           // farmer.photo || "",

// farmer.photo
//   ? `${BASE_URL}/${farmer.photo}`
//   : "",


//           farmer.pondCount || 0,
//           farmer.createdAt ? new Date(farmer.createdAt).toLocaleString() : "",
//           farmer.updatedAt ? new Date(farmer.updatedAt).toLocaleString() : "",
//           selectedAgent?._id || "",
//           selectedAgent?.name || ""
//         ];
        
//         // If farmer has ponds
//         if (farmer.ponds && farmer.ponds.length > 0) {
//           farmer.ponds.forEach(pond => {
//             // ✅ UPDATED: Create clickable links for Pond Image
//             const pondImageLink = pond.pondImage
//               ? getImageUrl(`/uploads/${pond.pondImage}`)
//               : "";
            
//             const pondData = [
//               pond.pondId || "",
//               pond.pondNumber || "",
//               pond.pondArea || "",
//               pond.pondAreaUnit || "",
//               pond.pondDepth || "",
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
//               // ✅ UPDATED: Clickable link instead of just filename
//               pondImageLink, // This will show as clickable link in Excel
//               Array.isArray(pond.pondFiles) ? pond.pondFiles.join("; ") : "",
//               Array.isArray(pond.fishFiles) ? pond.fishFiles.join("; ") : "",
//               pond.createdAt ? new Date(pond.createdAt).toLocaleString() : "",
//               pond.updatedAt ? new Date(pond.updatedAt).toLocaleString() : ""
//             ];
            
//             // Combine farmer data with pond data
//             const combinedRow = [...farmerBasicData, ...pondData];
//             allRows.push(combinedRow);
//           });
//         } else {
//           // If no ponds, add farmer with empty pond data
//           const emptyPondData = new Array(pondHeaders.length).fill("");
//           const combinedRow = [...farmerBasicData, ...emptyPondData];
//           allRows.push(combinedRow);
//         }
//       });
      
//       // Convert to CSV
//       const csvContent = allRows.map(row => 
//         row.map(cell => {
//           // Escape quotes and wrap in quotes if contains comma, newline or quotes
//           const cellStr = String(cell);
//           if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
//             return `"${cellStr.replace(/"/g, '""')}"`;
//           }
//           return cellStr;
//         }).join(",")
//       ).join("\n");
      
//       // Create and download file
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
        
//         // Transform data for frontend
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

//   // Pond fields for details modal - ✅ UPDATED for Pond Image Link
//   const pondDetailFields = [
//     // Pond Info
//     { label: "Pond ID", key: "pondId" },
//     { label: "Pond Number", key: "pondNumber" },
//     { label: "Pond Area", key: "pondArea" },
//     { label: "Area Unit", key: "pondAreaUnit" },
//     { label: "Pond Depth", key: "pondDepth" },
    
//     // Pond Environment
//     { label: "Overflow", key: "overflow" },
//     { label: "Sunlight", key: "receivesSunlight" },
//     { label: "Trees on Banks", key: "treesOnBanks" },
//     { label: "Neighbourhood", key: "neighbourhood" },
//     { label: "Wastewater Enters", key: "wastewaterEnters" },
    
//     // Species & Stocking
//     { label: "Species", key: "species" },
//     { label: "Date of Stocking", key: "dateOfStocking" },
//     { label: "Initial Seed Qty", key: "qtySeedInitially" },
//     { label: "Current Fish Qty", key: "currentQty" },
//     { label: "Average Size", key: "avgSize" },
    
//     // Feed Details
//     { label: "Feed Type", key: "feedType" },
//     { label: "Feed Other", key: "feedOther" },
//     { label: "Feed Frequency", key: "feedFreq" },
//     { label: "Feed Qty/Day", key: "feedQtyPerDay" },
//     { label: "Feed Time", key: "feedTime" },
//     { label: "Recent Changes", key: "recentFeedChanges" },
//     { label: "Reduced Appetite", key: "reducedAppetite" },
    
//     // Water Quality
//     { label: "Water Temperature", key: "waterTemperature" },
//     { label: "pH", key: "pH" },
//     { label: "DO", key: "DO" },
//     { label: "Ammonia Level", key: "ammoniaLevel" },
//     { label: "Phytoplankton", key: "phytoplanktonLevel" },
//     { label: "Water Hardness", key: "waterHardness" },
//     { label: "Algae Bloom", key: "algaeBloom" },
//     { label: "Water Color", key: "pondWaterColor" },
//     { label: "Water Source", key: "sourceOfWater" },
    
//     // Disease & Symptoms
//     { label: "Disease Symptoms", key: "diseaseSymptoms" },
//     { label: "Symptoms Observed", key: "symptomsObserved" },
//     { label: "Fish Deaths", key: "fishDeaths" },
//     { label: "Symptoms Affect", key: "symptomsAffect" },
    
//     // Observation
//     { label: "Farm Observed Date", key: "farmObservedDate" },
//     { label: "Farm Observed Time", key: "farmObservedTime" },
//     { label: "Last Species", key: "lastSpecies" },
//     { label: "Last Harvest Complete", key: "lastHarvestComplete" },
//     { label: "Recent Rain/Flood", key: "recentRainFlood" },
//     { label: "Pesticide Runoff", key: "pesticideRunoff" },
//     { label: "Construction Near", key: "constructionNear" },
//     { label: "Sudden Temp Change", key: "suddenTempChange" },
//     { label: "Notes", key: "notes" },
    
//     // ✅ UPDATED: Pond Image as Clickable Link
//     { label: "Pond Image", key: "pondImage", isClickableLink: true },
    
//     // Pond Files (Multiple)
//     { label: "Pond Files", key: "pondFiles", isFileArray: true },
//     { label: "Fish Files", key: "fishFiles", isFileArray: true },
    
//     // Dates
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

//   // Render Farmer Card with Ponds
//   const renderFarmerCardWithPonds = (data) => (
//     <div className="vertical-cards">
//       {data.map((farmer) => (
//         <div className="farmer-card" key={farmer._id}>
//           <div className="farmer-card-header">
//             <h4>{farmer.name} ({farmer.farmerId})</h4>
//             <div className="farmer-actions">
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
//                         <h6>Pond {pond.pondNumber || index + 1}: {pond.pondId}</h6>
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
//                         <div><strong>Last Updated:</strong> {
//                           pond.updatedAt ? new Date(pond.updatedAt).toLocaleDateString('en-IN') : "N/A"
//                         }</div>
//                       </div>
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
//         <div className="card" key={item._id}>
//           {dealerFields.map(({ label, key, isImage }) => (
//             <div className="card-row" key={key}>
//               <strong>{label}:</strong>
//               {isImage && item[key] ? (
//                 // <img
//                 //   src={`http://localhost:2008/api/images/${item._id}/${key}`}
//                 //   alt={label}
//                 //   onClick={() =>
//                 //     openModal(`http://localhost:2008/api/images/${item._id}/${key}`)
//                 //   }
//                 // />


// <img
//   src={getImageUrl(item[key])}
//   alt={label}
//   onClick={() =>
//     openModal(getImageUrl(item[key]))
//   }
//   onError={(e) => {
//     e.target.src = "/no-image.png";
//   }}
// />



//               ) : (
//                 <span>{item[key]}</span>
//               )}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );

//   if (loading && agents.length === 0) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="admin-dashboard">
//       <h2>All Agents</h2>

//       <button
//         onClick={() => navigate("/weather-dashboard")}
//         className="weather-dashboard-btn"
//       >
//         🌦️ Go to Weather Dashboard
//       </button>

//       <button
//         onClick={() => {
//           const agentToUse = selectedAgent || agents[0];
//           if (!agentToUse) {
//             alert("No agents available!");
//             return;
//           }
//           navigate(`/orders-dashboard/${agentToUse._id}`);
//         }}
//         style={{
//           marginBottom: '25px',
//           marginLeft:"15px",
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
//         📦 Go to Orders Dashboard
//       </button>





// <button
//   onClick={() => navigate("/astronomical-dashboard")}
//   style={{
//     marginLeft: "15px",
//     marginBottom: '25px',
//     padding: '14px 28px',
//     background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '12px',
//     cursor: 'pointer',
//     fontSize: '16px',
//     fontWeight: '600',
//     display: 'inline-flex',
//     alignItems: 'center',
//     gap: '10px',
//     boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
//   }}
// >
//   🌌 Astronomical Dashboard
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
//                 <strong>{r.requesterId.name}</strong> wants to view{" "}
//                 <strong>{r.targetAgentId.name}</strong>
//               </div>
//               <div>
//                 <button onClick={() => handleAllow(r._id)}>Allow</button>
//                 <button onClick={() => handleReject(r._id)}>Reject</button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Agents Table - Desktop View */}
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
//                     src={getImageUrl(`/api/images/${a._id}/profile`)}
//                     alt="Profile"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/profile`))
//                     }
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
//                     src={getImageUrl(`/api/images/${a._id}/aadharFront`)}
//                     alt="Aadhar Front"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/aadharFront`))
//                     }
//                   />
//                 )}
//               </td>
//               <td>
//                 {a.aadharBack && (
//                   <img
//                     src={getImageUrl(`/api/images/${a._id}/aadharBack`)}
//                     alt="Aadhar Back"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/aadharBack`))
//                     }
//                   />
//                 )}
//               </td>
//               <td>
//                 {a.panCard && (
//                   <img
//                     src={getImageUrl(`/api/images/${a._id}/pan`)}
//                     alt="PAN"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/pan`))
//                     }
//                   />
//                 )}
//               </td>
//               <td>{a.accountNumber}</td>
//               <td>{a.ifsc}</td>
//               <td>
//                 {a.savingAccountImage && (
//                   <img
//                     src={getImageUrl(`/api/images/${a._id}/savingImg`)}
//                     alt="Passbook"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/savingImg`))
//                     }
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
//                   src={getImageUrl(`/api/images/${a._id}/profile`)}
//                   alt="Profile"
//                   className="agent-avatar"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/profile`))
//                   }
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
//                   src={getImageUrl(`/api/images/${a._id}/aadharFront`)}
//                   alt="Aadhar Front"
//                   className="doc-image"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/aadharFront`))
//                   }
//                 />
//               )}
//               {a.aadharBack && (
//                 <img
//                   src={getImageUrl(`/api/images/${a._id}/aadharBack`)}
//                   alt="Aadhar Back"
//                   className="doc-image"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/aadharBack`))
//                   }
//                 />
//               )}
//               {a.panCard && (
//                 <img
//                   src={getImageUrl(`/api/images/${a._id}/pan`)}
//                   alt="PAN"
//                   className="doc-image"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/pan`))
//                   }
//                 />
//               )}
//               {a.savingAccountImage && (
//                 <img
//                   src={getImageUrl(`/api/images/${a._id}/savingImg`)}
//                   alt="Passbook"
//                   className="doc-image"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/savingImg`))
//                   }
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
//             {/* ✅ UPDATED DOWNLOAD BUTTON - Now includes all ponds */}
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
//           <img src={modalImage} alt="preview" />
//         </div>
//       )}

//       {/* Pond Details Modal - ✅ UPDATED for Pond Image Link */}
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
                  
//                   // Check if this is a clickable link field (Pond Image)
//                   if (isClickableLink && key === "pondImage" && value) {
//                     const imageUrl = getImageUrl(`/uploads/${value}`);
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
//                           />
//                         </div>
//                       </div>
//                     );
//                   }
                  
//                   // Check if this is a file array
//                   if (isFileArray && value && value.length > 0) {
//                     return (
//                       <div className="detail-row" key={key}>
//                         <strong>{label}:</strong>
//                         <div className="file-list">
//                           {value.map((file, idx) => {
//                             const fileUrl = getImageUrl(`/uploads/${file}`);
//                             return (
//                               <div key={idx} className="file-item">
//                                 <a 
//                                   href={fileUrl} 
//                                   target="_blank" 
//                                   rel="noopener noreferrer"
//                                   className="file-link"
//                                 >
//                                   📎 File {idx + 1}
//                                 </a>
//                                 <img
//                                   src={fileUrl}
//                                   alt={`${key} ${idx + 1}`}
//                                   onClick={() => openModal(fileUrl)}
//                                   className="clickable-thumbnail"
//                                 />
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     );
//                   }
                  
//                   // Regular field
//                   return (
//                     <div className="detail-row" key={key}>
//                       <strong>{label}:</strong>
//                       <span>{value || "N/A"}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 onClick={() => {
//                   // Create CSV content with clickable links
//                   const headers = ["Field", "Value"];
//                   const rows = [];
                  
//                   // Add all pond details
//                   pondDetailFields.forEach(({ label, key }) => {
//                     const value = selectedPond[key];
//                     let displayValue = value || "N/A";
                    
//                     // Handle arrays
//                     if (Array.isArray(value)) {
//                       displayValue = value.join("; ");
//                     }
                    
//                     // Handle Pond Image as clickable link
//                     if (key === "pondImage" && value) {
//                       displayValue = getImageUrl(`/uploads/${value}`);
//                     }
                    
//                     // Handle other file fields
//                     if ((key === "pondFiles" || key === "fishFiles") && value) {
//                       displayValue = Array.isArray(value) 
//                         ? value.map(file => getImageUrl(`/uploads/${file}`)).join("; ")
//                         : getImageUrl(`/uploads/${value}`);
//                     }
                    
//                     rows.push([label, displayValue]);
//                   });
                  
//                   // Add farmer info
//                   if (selectedFarmer) {
//                     rows.push(["", ""]);
//                     rows.push(["FARMER INFORMATION", ""]);
//                     farmerBasicFields.forEach(({ label, key }) => {
//                       rows.push([label, selectedFarmer[key] || "N/A"]);
//                     });
//                   }
                  
//                   // Add agent info
//                   if (selectedAgent) {
//                     rows.push(["", ""]);
//                     rows.push(["AGENT INFORMATION", ""]);
//                     rows.push(["Agent Name", selectedAgent.name]);
//                     rows.push(["Agent Mobile", selectedAgent.mobile]);
//                     rows.push(["Agent Email", selectedAgent.email]);
//                   }
                  
//                   // Create CSV
//                   const csvContent = [
//                     headers.join(","),
//                     ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
//                   ].join("\n");
                  
//                   // Create and download file
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























// // AdminDashboard.js
// import React, { useEffect, useState } from "react";
// import api, { getImageUrl } from "../utils/api";
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

//   const [accessRequests, setAccessRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ NEW STATES FOR POND DETAILS
//   const [selectedFarmer, setSelectedFarmer] = useState(null);
//   const [showPondDetails, setShowPondDetails] = useState(false);
//   const [selectedPond, setSelectedPond] = useState(null);
//   const [pondDetailsModalOpen, setPondDetailsModalOpen] = useState(false);

//   const navigate = useNavigate();

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
//     setSelectedFarmer(null); // Reset selected farmer
//     setShowPondDetails(false); // Reset pond details view
//     api
//       .get(`/api/admin/agents/${agentId}/details`)
//       .then((res) => {
//         setFarmers(res.data.farmers || []);
//         setDealers(res.data.dealers || []);
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

//   // ✅ Open Pond Details Modal
//   const openPondDetails = (pond) => {
//     setSelectedPond(pond);
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




// // ✅ FIXED: Download farmer data with ALL ponds
// const downloadFarmerExcelWithAllPonds = (farmersData) => {
//   if (!farmersData.length) return;
  
//   try {
//     // Create an array to hold all rows
//     const allRows = [];
    
//     // Define farmer headers
//     const farmerHeaders = [
//       "Farmer ID", "Name", "Contact", "Age", "Gender", "Village", 
//       "Aadhar", "Family Members", "Family Occupation", "Photo", 
//       "Pond Count", "Created At", "Updated At", "Agent ID", "Agent Name"
//     ];
    
//     // Define pond headers
//     const pondHeaders = [
//       "Pond ID", "Pond Number", "Pond Area", "Area Unit", "Pond Depth",
//       "Overflow", "Receives Sunlight", "Trees on Banks", "Neighbourhood", "Wastewater Enters",
//       "Species", "Date of Stocking", "Initial Seed Qty", "Current Fish Qty", "Average Size",
//       "Feed Type", "Feed Other", "Feed Frequency", "Feed Qty/Day", "Feed Time",
//       "Recent Feed Changes", "Reduced Appetite", "Water Temperature", "pH", "DO",
//       "Ammonia Level", "Phytoplankton Level", "Water Hardness", "Algae Bloom", "Pond Water Color",
//       "Source of Water", "Disease Symptoms", "Symptoms Observed", "Fish Deaths", "Symptoms Affect",
//       "Farm Observed Date", "Farm Observed Time", "Last Species", "Last Harvest Complete",
//       "Recent Rain/Flood", "Pesticide Runoff", "Construction Near", "Sudden Temp Change",
//       "Notes", "Pond Image Link", "Pond Files", "Fish Files", "Created At", "Updated At"
//     ];
    
//     // Combine all headers
//     const allHeaders = [...farmerHeaders, ...pondHeaders.map(h => `Pond_${h}`)];
    
//     // Add header row
//     allRows.push(allHeaders);
    
//     // Process each farmer
//     farmersData.forEach(farmer => {
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
//         // ✅ FIXED: Use getImageUrl instead of BASE_URL
//         farmer.photo ? getImageUrl(farmer.photo) : "",
//         farmer.pondCount || 0,
//         farmer.createdAt ? new Date(farmer.createdAt).toLocaleString() : "",
//         farmer.updatedAt ? new Date(farmer.updatedAt).toLocaleString() : "",
//         selectedAgent?._id || "",
//         selectedAgent?.name || ""
//       ];
      
//       // If farmer has ponds
//       if (farmer.ponds && farmer.ponds.length > 0) {
//         farmer.ponds.forEach(pond => {
//           // ✅ FIXED: Use getImageUrl function
//           const pondImageLink = pond.pondImage
//             ? getImageUrl(pond.pondImage)
//             : "";
          
//           const pondData = [
//             pond.pondId || "",
//             pond.pondNumber || "",
//             pond.pondArea || "",
//             pond.pondAreaUnit || "",
//             pond.pondDepth || "",
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
//             // ✅ FIXED: Clickable link
//             pondImageLink,
//             Array.isArray(pond.pondFiles) ? 
//               pond.pondFiles.map(file => getImageUrl(file)).join("; ") : "",
//             Array.isArray(pond.fishFiles) ? 
//               pond.fishFiles.map(file => getImageUrl(file)).join("; ") : "",
//             pond.createdAt ? new Date(pond.createdAt).toLocaleString() : "",
//             pond.updatedAt ? new Date(pond.updatedAt).toLocaleString() : ""
//           ];
          
//           // Combine farmer data with pond data
//           const combinedRow = [...farmerBasicData, ...pondData];
//           allRows.push(combinedRow);
//         });
//       } else {
//         // If no ponds, add farmer with empty pond data
//         const emptyPondData = new Array(pondHeaders.length).fill("");
//         const combinedRow = [...farmerBasicData, ...emptyPondData];
//         allRows.push(combinedRow);
//       }
//     });
    
//     // Convert to CSV
//     const csvContent = allRows.map(row => 
//       row.map(cell => {
//         const cellStr = String(cell);
//         if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
//           return `"${cellStr.replace(/"/g, '""')}"`;
//         }
//         return cellStr;
//       }).join(",")
//     ).join("\n");
    
//     // Create and download file
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `Farmers_With_Ponds_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//   } catch (error) {
//     console.error("Error generating Excel:", error);
//     alert("Error generating Excel file. Check console for details.");
//   }
// };



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
        
//         // Transform data for frontend
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

//   // Pond fields for details modal - ✅ UPDATED for Pond Image Link
//   const pondDetailFields = [
//     // Pond Info
//     { label: "Pond ID", key: "pondId" },
//     { label: "Pond Number", key: "pondNumber" },
//     { label: "Pond Area", key: "pondArea" },
//     { label: "Area Unit", key: "pondAreaUnit" },
//     { label: "Pond Depth", key: "pondDepth" },
    
//     // Pond Environment
//     { label: "Overflow", key: "overflow" },
//     { label: "Sunlight", key: "receivesSunlight" },
//     { label: "Trees on Banks", key: "treesOnBanks" },
//     { label: "Neighbourhood", key: "neighbourhood" },
//     { label: "Wastewater Enters", key: "wastewaterEnters" },
    
//     // Species & Stocking
//     { label: "Species", key: "species" },
//     { label: "Date of Stocking", key: "dateOfStocking" },
//     { label: "Initial Seed Qty", key: "qtySeedInitially" },
//     { label: "Current Fish Qty", key: "currentQty" },
//     { label: "Average Size", key: "avgSize" },
    
//     // Feed Details
//     { label: "Feed Type", key: "feedType" },
//     { label: "Feed Other", key: "feedOther" },
//     { label: "Feed Frequency", key: "feedFreq" },
//     { label: "Feed Qty/Day", key: "feedQtyPerDay" },
//     { label: "Feed Time", key: "feedTime" },
//     { label: "Recent Changes", key: "recentFeedChanges" },
//     { label: "Reduced Appetite", key: "reducedAppetite" },
    
//     // Water Quality
//     { label: "Water Temperature", key: "waterTemperature" },
//     { label: "pH", key: "pH" },
//     { label: "DO", key: "DO" },
//     { label: "Ammonia Level", key: "ammoniaLevel" },
//     { label: "Phytoplankton", key: "phytoplanktonLevel" },
//     { label: "Water Hardness", key: "waterHardness" },
//     { label: "Algae Bloom", key: "algaeBloom" },
//     { label: "Water Color", key: "pondWaterColor" },
//     { label: "Water Source", key: "sourceOfWater" },
    
//     // Disease & Symptoms
//     { label: "Disease Symptoms", key: "diseaseSymptoms" },
//     { label: "Symptoms Observed", key: "symptomsObserved" },
//     { label: "Fish Deaths", key: "fishDeaths" },
//     { label: "Symptoms Affect", key: "symptomsAffect" },
    
//     // Observation
//     { label: "Farm Observed Date", key: "farmObservedDate" },
//     { label: "Farm Observed Time", key: "farmObservedTime" },
//     { label: "Last Species", key: "lastSpecies" },
//     { label: "Last Harvest Complete", key: "lastHarvestComplete" },
//     { label: "Recent Rain/Flood", key: "recentRainFlood" },
//     { label: "Pesticide Runoff", key: "pesticideRunoff" },
//     { label: "Construction Near", key: "constructionNear" },
//     { label: "Sudden Temp Change", key: "suddenTempChange" },
//     { label: "Notes", key: "notes" },
    
//     // ✅ UPDATED: Pond Image as Clickable Link
//     { label: "Pond Image", key: "pondImage", isClickableLink: true },
    
//     // Pond Files (Multiple)
//     { label: "Pond Files", key: "pondFiles", isFileArray: true },
//     { label: "Fish Files", key: "fishFiles", isFileArray: true },
    
//     // Dates
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

//   // Render Farmer Card with Ponds
//   const renderFarmerCardWithPonds = (data) => (
//     <div className="vertical-cards">
//       {data.map((farmer) => (
//         <div className="farmer-card" key={farmer._id}>
//           <div className="farmer-card-header">
//             <h4>{farmer.name} ({farmer.farmerId})</h4>
//             <div className="farmer-actions">
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
//                         <h6>Pond {pond.pondNumber || index + 1}: {pond.pondId}</h6>
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
//                         <div><strong>Last Updated:</strong> {
//                           pond.updatedAt ? new Date(pond.updatedAt).toLocaleDateString('en-IN') : "N/A"
//                         }</div>
//                       </div>
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
//         <div className="card" key={item._id}>
//           {dealerFields.map(({ label, key, isImage }) => (
//             <div className="card-row" key={key}>
//               <strong>{label}:</strong>
//               {isImage && item[key] ? (
//                 // <img
//                 //   src={`http://localhost:2008/api/images/${item._id}/${key}`}
//                 //   alt={label}
//                 //   onClick={() =>
//                 //     openModal(`http://localhost:2008/api/images/${item._id}/${key}`)
//                 //   }
//                 // />


// <img
//   src={getImageUrl(item[key])}
//   alt={label}
//   onClick={() =>
//     openModal(getImageUrl(item[key]))
//   }
//   onError={(e) => {
//     e.target.src = "/no-image.png";
//   }}
// />



//               ) : (
//                 <span>{item[key]}</span>
//               )}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );

//   if (loading && agents.length === 0) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="admin-dashboard">
//       <h2>All Agents</h2>

//       <button
//         onClick={() => navigate("/weather-dashboard")}
//         className="weather-dashboard-btn"
//       >
//         🌦️ Go to Weather Dashboard
//       </button>

//       <button
//         onClick={() => {
//           const agentToUse = selectedAgent || agents[0];
//           if (!agentToUse) {
//             alert("No agents available!");
//             return;
//           }
//           navigate(`/orders-dashboard/${agentToUse._id}`);
//         }}
//         style={{
//           marginBottom: '25px',
//           marginLeft:"15px",
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
//         📦 Go to Orders Dashboard
//       </button>





// <button
//   onClick={() => navigate("/astronomical-dashboard")}
//   style={{
//     marginLeft: "15px",
//     marginBottom: '25px',
//     padding: '14px 28px',
//     background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '12px',
//     cursor: 'pointer',
//     fontSize: '16px',
//     fontWeight: '600',
//     display: 'inline-flex',
//     alignItems: 'center',
//     gap: '10px',
//     boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
//   }}
// >
//   🌌 Astronomical Dashboard
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
//                 <strong>{r.requesterId.name}</strong> wants to view{" "}
//                 <strong>{r.targetAgentId.name}</strong>
//               </div>
//               <div>
//                 <button onClick={() => handleAllow(r._id)}>Allow</button>
//                 <button onClick={() => handleReject(r._id)}>Reject</button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Agents Table - Desktop View */}
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
//                     src={getImageUrl(`/api/images/${a._id}/profile`)}
//                     alt="Profile"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/profile`))
//                     }
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
//                     src={getImageUrl(`/api/images/${a._id}/aadharFront`)}
//                     alt="Aadhar Front"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/aadharFront`))
//                     }
//                   />
//                 )}
//               </td>
//               <td>
//                 {a.aadharBack && (
//                   <img
//                     src={getImageUrl(`/api/images/${a._id}/aadharBack`)}
//                     alt="Aadhar Back"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/aadharBack`))
//                     }
//                   />
//                 )}
//               </td>
//               <td>
//                 {a.panCard && (
//                   <img
//                     src={getImageUrl(`/api/images/${a._id}/pan`)}
//                     alt="PAN"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/pan`))
//                     }
//                   />
//                 )}
//               </td>
//               <td>{a.accountNumber}</td>
//               <td>{a.ifsc}</td>
//               <td>
//                 {a.savingAccountImage && (
//                   <img
//                     src={getImageUrl(`/api/images/${a._id}/savingImg`)}
//                     alt="Passbook"
//                     onClick={() =>
//                       openModal(getImageUrl(`/api/images/${a._id}/savingImg`))
//                     }
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
//                   src={getImageUrl(`/api/images/${a._id}/profile`)}
//                   alt="Profile"
//                   className="agent-avatar"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/profile`))
//                   }
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
//                   src={getImageUrl(`/api/images/${a._id}/aadharFront`)}
//                   alt="Aadhar Front"
//                   className="doc-image"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/aadharFront`))
//                   }
//                 />
//               )}
//               {a.aadharBack && (
//                 <img
//                   src={getImageUrl(`/api/images/${a._id}/aadharBack`)}
//                   alt="Aadhar Back"
//                   className="doc-image"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/aadharBack`))
//                   }
//                 />
//               )}
//               {a.panCard && (
//                 <img
//                   src={getImageUrl(`/api/images/${a._id}/pan`)}
//                   alt="PAN"
//                   className="doc-image"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/pan`))
//                   }
//                 />
//               )}
//               {a.savingAccountImage && (
//                 <img
//                   src={getImageUrl(`/api/images/${a._id}/savingImg`)}
//                   alt="Passbook"
//                   className="doc-image"
//                   onClick={() =>
//                     openModal(getImageUrl(`/api/images/${a._id}/savingImg`))
//                   }
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
//             {/* ✅ UPDATED DOWNLOAD BUTTON - Now includes all ponds */}
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
//           <img src={modalImage} alt="preview" />
//         </div>
//       )}

//       {/* Pond Details Modal - ✅ UPDATED for Pond Image Link */}
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
                  
//                   // Check if this is a clickable link field (Pond Image)
//                   if (isClickableLink && key === "pondImage" && value) {
//                     const imageUrl = getImageUrl(`/uploads/${value}`);
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
//                           />
//                         </div>
//                       </div>
//                     );
//                   }
                  
//                   // Check if this is a file array
//                   if (isFileArray && value && value.length > 0) {
//                     return (
//                       <div className="detail-row" key={key}>
//                         <strong>{label}:</strong>
//                         <div className="file-list">
//                           {value.map((file, idx) => {
//                             const fileUrl = getImageUrl(`/uploads/${file}`);
//                             return (
//                               <div key={idx} className="file-item">
//                                 <a 
//                                   href={fileUrl} 
//                                   target="_blank" 
//                                   rel="noopener noreferrer"
//                                   className="file-link"
//                                 >
//                                   📎 File {idx + 1}
//                                 </a>
//                                 <img
//                                   src={fileUrl}
//                                   alt={`${key} ${idx + 1}`}
//                                   onClick={() => openModal(fileUrl)}
//                                   className="clickable-thumbnail"
//                                 />
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     );
//                   }
                  
//                   // Regular field
//                   return (
//                     <div className="detail-row" key={key}>
//                       <strong>{label}:</strong>
//                       <span>{value || "N/A"}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 onClick={() => {
//                   // Create CSV content with clickable links
//                   const headers = ["Field", "Value"];
//                   const rows = [];
                  
//                   // Add all pond details
//                   pondDetailFields.forEach(({ label, key }) => {
//                     const value = selectedPond[key];
//                     let displayValue = value || "N/A";
                    
//                     // Handle arrays
//                     if (Array.isArray(value)) {
//                       displayValue = value.join("; ");
//                     }
                    
//                     // Handle Pond Image as clickable link
//                     if (key === "pondImage" && value) {
//                       displayValue = getImageUrl(`/uploads/${value}`);
//                     }
                    
//                     // Handle other file fields
//                     if ((key === "pondFiles" || key === "fishFiles") && value) {
//                       displayValue = Array.isArray(value) 
//                         ? value.map(file => getImageUrl(`/uploads/${file}`)).join("; ")
//                         : getImageUrl(`/uploads/${value}`);
//                     }
                    
//                     rows.push([label, displayValue]);
//                   });
                  
//                   // Add farmer info
//                   if (selectedFarmer) {
//                     rows.push(["", ""]);
//                     rows.push(["FARMER INFORMATION", ""]);
//                     farmerBasicFields.forEach(({ label, key }) => {
//                       rows.push([label, selectedFarmer[key] || "N/A"]);
//                     });
//                   }
                  
//                   // Add agent info
//                   if (selectedAgent) {
//                     rows.push(["", ""]);
//                     rows.push(["AGENT INFORMATION", ""]);
//                     rows.push(["Agent Name", selectedAgent.name]);
//                     rows.push(["Agent Mobile", selectedAgent.mobile]);
//                     rows.push(["Agent Email", selectedAgent.email]);
//                   }
                  
//                   // Create CSV
//                   const csvContent = [
//                     headers.join(","),
//                     ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
//                   ].join("\n");
                  
//                   // Create and download file
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








// AdminDashboard.js
import React, { useEffect, useState } from "react";
import api, { getImageUrl } from "../utils/api";
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

  // ✅ NEW STATES FOR POND DETAILS
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showPondDetails, setShowPondDetails] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [pondDetailsModalOpen, setPondDetailsModalOpen] = useState(false);

  const navigate = useNavigate();

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
    setSelectedFarmer(null); // Reset selected farmer
    setShowPondDetails(false); // Reset pond details view
    api
      .get(`/api/admin/agents/${agentId}/details`)
      .then((res) => {
        setFarmers(res.data.farmers || []);
        setDealers(res.data.dealers || []);
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

  // ✅ Open Farmer Details with Ponds
  const openFarmerDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowPondDetails(true);
  };

  // ✅ Open Pond Details Modal
  const openPondDetails = (pond) => {
    setSelectedPond(pond);
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

  // ✅ FIXED: Download farmer data with ALL ponds
  const downloadFarmerExcelWithAllPonds = (farmersData) => {
    if (!farmersData.length) return;
    
    try {
      // Create an array to hold all rows
      const allRows = [];
      
      // Define farmer headers
      const farmerHeaders = [
        "Farmer ID", "Name", "Contact", "Age", "Gender", "Village", 
        "Aadhar", "Family Members", "Family Occupation", "Photo", 
        "Pond Count", "Created At", "Updated At", "Agent ID", "Agent Name"
      ];
      
      // Define pond headers
      const pondHeaders = [
        "Pond ID", "Pond Number", "Pond Area", "Area Unit", "Pond Depth",
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
      
      // Combine all headers
      const allHeaders = [...farmerHeaders, ...pondHeaders.map(h => `Pond_${h}`)];
      
      // Add header row
      allRows.push(allHeaders);
      
      // Process each farmer
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
          // ✅ FIXED: Use getImageUrl instead of BASE_URL
          farmer.photo ? getImageUrl(farmer.photo) : "",
          farmer.pondCount || 0,
          farmer.createdAt ? new Date(farmer.createdAt).toLocaleString() : "",
          farmer.updatedAt ? new Date(farmer.updatedAt).toLocaleString() : "",
          selectedAgent?._id || "",
          selectedAgent?.name || ""
        ];
        
        // If farmer has ponds
        if (farmer.ponds && farmer.ponds.length > 0) {
          farmer.ponds.forEach(pond => {
            // ✅ FIXED: Use getImageUrl function
            const pondImageLink = pond.pondImage
              ? getImageUrl(pond.pondImage)
              : "";
            
            const pondData = [
              pond.pondId || "",
              pond.pondNumber || "",
              pond.pondArea || "",
              pond.pondAreaUnit || "",
              pond.pondDepth || "",
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
              // ✅ FIXED: Clickable link
              pondImageLink,
              Array.isArray(pond.pondFiles) ? 
                pond.pondFiles.map(file => getImageUrl(file)).join("; ") : "",
              Array.isArray(pond.fishFiles) ? 
                pond.fishFiles.map(file => getImageUrl(file)).join("; ") : "",
              pond.createdAt ? new Date(pond.createdAt).toLocaleString() : "",
              pond.updatedAt ? new Date(pond.updatedAt).toLocaleString() : ""
            ];
            
            // Combine farmer data with pond data
            const combinedRow = [...farmerBasicData, ...pondData];
            allRows.push(combinedRow);
          });
        } else {
          // If no ponds, add farmer with empty pond data
          const emptyPondData = new Array(pondHeaders.length).fill("");
          const combinedRow = [...farmerBasicData, ...emptyPondData];
          allRows.push(combinedRow);
        }
      });
      
      // Convert to CSV
      const csvContent = allRows.map(row => 
        row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(",")
      ).join("\n");
      
      // Create and download file
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

  // ✅ NEW FUNCTION: Download single farmer data with all ponds
  const downloadSingleFarmerData = (farmer) => {
    try {
      // Create an array to hold all rows
      const allRows = [];
      
      // Define farmer headers
      const farmerHeaders = [
        "Farmer ID", "Name", "Contact", "Age", "Gender", "Village", 
        "Aadhar", "Family Members", "Family Occupation", "Photo", 
        "Pond Count", "Created At", "Updated At", "Agent ID", "Agent Name"
      ];
      
      // Define pond headers
      const pondHeaders = [
        "Pond ID", "Pond Number", "Pond Area", "Area Unit", "Pond Depth",
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
      
      // Combine all headers
      const allHeaders = [...farmerHeaders, ...pondHeaders.map(h => `Pond_${h}`)];
      
      // Add header row
      allRows.push(allHeaders);
      
      // Farmer basic data
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
        farmer.photo ? getImageUrl(farmer.photo) : "",
        farmer.pondCount || 0,
        farmer.createdAt ? new Date(farmer.createdAt).toLocaleString() : "",
        farmer.updatedAt ? new Date(farmer.updatedAt).toLocaleString() : "",
        selectedAgent?._id || "",
        selectedAgent?.name || ""
      ];
      
      // If farmer has ponds
      if (farmer.ponds && farmer.ponds.length > 0) {
        farmer.ponds.forEach(pond => {
          const pondImageLink = pond.pondImage
            ? getImageUrl(pond.pondImage)
            : "";
          
          const pondData = [
            pond.pondId || "",
            pond.pondNumber || "",
            pond.pondArea || "",
            pond.pondAreaUnit || "",
            pond.pondDepth || "",
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
            Array.isArray(pond.pondFiles) ? 
              pond.pondFiles.map(file => getImageUrl(file)).join("; ") : "",
            Array.isArray(pond.fishFiles) ? 
              pond.fishFiles.map(file => getImageUrl(file)).join("; ") : "",
            pond.createdAt ? new Date(pond.createdAt).toLocaleString() : "",
            pond.updatedAt ? new Date(pond.updatedAt).toLocaleString() : ""
          ];
          
          // Combine farmer data with pond data
          const combinedRow = [...farmerBasicData, ...pondData];
          allRows.push(combinedRow);
        });
      } else {
        // If no ponds, add farmer with empty pond data
        const emptyPondData = new Array(pondHeaders.length).fill("");
        const combinedRow = [...farmerBasicData, ...emptyPondData];
        allRows.push(combinedRow);
      }
      
      // Convert to CSV
      const csvContent = allRows.map(row => 
        row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(",")
      ).join("\n");
      
      // Create and download file with farmer ID as filename
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

  // ✅ Download simple Excel (legacy function - for dealers)
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

  // Open History modal function
  const openHistoryModal = (itemId, type, name) => {
    setHistoryTitle(name);
    console.log(`🔍 Opening history for: ${type} - ${itemId} - ${name}`);
    
    api
      .get(`/api/history/${type}/${itemId}`)
      .then((res) => {
        console.log("📊 History API Response:", res.data);
        
        // Transform data for frontend
        const transformedData = (res.data || []).map(item => {
          return {
            ...item,
            timestamp: item.createdAt || new Date(),
            actionType: item.actionType || "updated"
          };
        });
        
        console.log("📊 Transformed Data:", transformedData);
        setHistoryData(transformedData);
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

  // Farmer basic fields (for card view)
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

  // Pond fields for details modal - ✅ UPDATED for Pond Image Link
  const pondDetailFields = [
    // Pond Info
    { label: "Pond ID", key: "pondId" },
    { label: "Pond Number", key: "pondNumber" },
    { label: "Pond Area", key: "pondArea" },
    { label: "Area Unit", key: "pondAreaUnit" },
    { label: "Pond Depth", key: "pondDepth" },
    
    // Pond Environment
    { label: "Overflow", key: "overflow" },
    { label: "Sunlight", key: "receivesSunlight" },
    { label: "Trees on Banks", key: "treesOnBanks" },
    { label: "Neighbourhood", key: "neighbourhood" },
    { label: "Wastewater Enters", key: "wastewaterEnters" },
    
    // Species & Stocking
    { label: "Species", key: "species" },
    { label: "Date of Stocking", key: "dateOfStocking" },
    { label: "Initial Seed Qty", key: "qtySeedInitially" },
    { label: "Current Fish Qty", key: "currentQty" },
    { label: "Average Size", key: "avgSize" },
    
    // Feed Details
    { label: "Feed Type", key: "feedType" },
    { label: "Feed Other", key: "feedOther" },
    { label: "Feed Frequency", key: "feedFreq" },
    { label: "Feed Qty/Day", key: "feedQtyPerDay" },
    { label: "Feed Time", key: "feedTime" },
    { label: "Recent Changes", key: "recentFeedChanges" },
    { label: "Reduced Appetite", key: "reducedAppetite" },
    
    // Water Quality
    { label: "Water Temperature", key: "waterTemperature" },
    { label: "pH", key: "pH" },
    { label: "DO", key: "DO" },
    { label: "Ammonia Level", key: "ammoniaLevel" },
    { label: "Phytoplankton", key: "phytoplanktonLevel" },
    { label: "Water Hardness", key: "waterHardness" },
    { label: "Algae Bloom", key: "algaeBloom" },
    { label: "Water Color", key: "pondWaterColor" },
    { label: "Water Source", key: "sourceOfWater" },
    
    // Disease & Symptoms
    { label: "Disease Symptoms", key: "diseaseSymptoms" },
    { label: "Symptoms Observed", key: "symptomsObserved" },
    { label: "Fish Deaths", key: "fishDeaths" },
    { label: "Symptoms Affect", key: "symptomsAffect" },
    
    // Observation
    { label: "Farm Observed Date", key: "farmObservedDate" },
    { label: "Farm Observed Time", key: "farmObservedTime" },
    { label: "Last Species", key: "lastSpecies" },
    { label: "Last Harvest Complete", key: "lastHarvestComplete" },
    { label: "Recent Rain/Flood", key: "recentRainFlood" },
    { label: "Pesticide Runoff", key: "pesticideRunoff" },
    { label: "Construction Near", key: "constructionNear" },
    { label: "Sudden Temp Change", key: "suddenTempChange" },
    { label: "Notes", key: "notes" },
    
    // ✅ UPDATED: Pond Image as Clickable Link
    { label: "Pond Image", key: "pondImage", isClickableLink: true },
    
    // Pond Files (Multiple)
    { label: "Pond Files", key: "pondFiles", isFileArray: true },
    { label: "Fish Files", key: "fishFiles", isFileArray: true },
    
    // Dates
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

  // Render Farmer Card with Ponds
  const renderFarmerCardWithPonds = (data) => (
    <div className="vertical-cards">
      {data.map((farmer) => (
        <div className="farmer-card" key={farmer._id}>
          <div className="farmer-card-header">
            <h4>{farmer.name} ({farmer.farmerId})</h4>
            <div className="farmer-actions">
              {/* ✅ NEW DOWNLOAD BUTTON ADDED HERE */}
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
                        <h6>Pond {pond.pondNumber || index + 1}: {pond.pondId}</h6>
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
                        <div><strong>Last Updated:</strong> {
                          pond.updatedAt ? new Date(pond.updatedAt).toLocaleDateString('en-IN') : "N/A"
                        }</div>
                      </div>
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
        <div className="card" key={item._id}>
          {dealerFields.map(({ label, key, isImage }) => (
            <div className="card-row" key={key}>
              <strong>{label}:</strong>
              {isImage && item[key] ? (
                <img
                  src={getImageUrl(item[key])}
                  alt={label}
                  onClick={() =>
                    openModal(getImageUrl(item[key]))
                  }
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />
              ) : (
                <span>{item[key]}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  if (loading && agents.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>All Agents</h2>

      <button
        onClick={() => navigate("/weather-dashboard")}
        className="weather-dashboard-btn"
      >
        🌦️ Go to Weather Dashboard
      </button>

      <button
        onClick={() => {
          const agentToUse = selectedAgent || agents[0];
          if (!agentToUse) {
            alert("No agents available!");
            return;
          }
          navigate(`/orders-dashboard/${agentToUse._id}`);
        }}
        style={{
          marginBottom: '25px',
          marginLeft:"15px",
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
        📦 Go to Orders Dashboard
      </button>

      <button
        onClick={() => navigate("/astronomical-dashboard")}
        style={{
          marginLeft: "15px",
          marginBottom: '25px',
          padding: '14px 28px',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
        }}
      >
        🌌 Astronomical Dashboard
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
                <strong>{r.requesterId.name}</strong> wants to view{" "}
                <strong>{r.targetAgentId.name}</strong>
              </div>
              <div>
                <button onClick={() => handleAllow(r._id)}>Allow</button>
                <button onClick={() => handleReject(r._id)}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Agents Table - Desktop View */}
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
                    src={getImageUrl(`/api/images/${a._id}/profile`)}
                    alt="Profile"
                    onClick={() =>
                      openModal(getImageUrl(`/api/images/${a._id}/profile`))
                    }
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
                    src={getImageUrl(`/api/images/${a._id}/aadharFront`)}
                    alt="Aadhar Front"
                    onClick={() =>
                      openModal(getImageUrl(`/api/images/${a._id}/aadharFront`))
                    }
                  />
                )}
              </td>
              <td>
                {a.aadharBack && (
                  <img
                    src={getImageUrl(`/api/images/${a._id}/aadharBack`)}
                    alt="Aadhar Back"
                    onClick={() =>
                      openModal(getImageUrl(`/api/images/${a._id}/aadharBack`))
                    }
                  />
                )}
              </td>
              <td>
                {a.panCard && (
                  <img
                    src={getImageUrl(`/api/images/${a._id}/pan`)}
                    alt="PAN"
                    onClick={() =>
                      openModal(getImageUrl(`/api/images/${a._id}/pan`))
                    }
                  />
                )}
              </td>
              <td>{a.accountNumber}</td>
              <td>{a.ifsc}</td>
              <td>
                {a.savingAccountImage && (
                  <img
                    src={getImageUrl(`/api/images/${a._id}/savingImg`)}
                    alt="Passbook"
                    onClick={() =>
                      openModal(getImageUrl(`/api/images/${a._id}/savingImg`))
                    }
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

      {/* ADDED: Mobile Agents List - Mobile View */}
      <div className="mobile-agents-list">
        {agents.map((a) => (
          <div className="agent-card" key={a._id}>
            <div className="agent-card-header">
              {a.profilePic && (
                <img
                  src={getImageUrl(`/api/images/${a._id}/profile`)}
                  alt="Profile"
                  className="agent-avatar"
                  onClick={() =>
                    openModal(getImageUrl(`/api/images/${a._id}/profile`))
                  }
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
                  src={getImageUrl(`/api/images/${a._id}/aadharFront`)}
                  alt="Aadhar Front"
                  className="doc-image"
                  onClick={() =>
                    openModal(getImageUrl(`/api/images/${a._id}/aadharFront`))
                  }
                />
              )}
              {a.aadharBack && (
                <img
                  src={getImageUrl(`/api/images/${a._id}/aadharBack`)}
                  alt="Aadhar Back"
                  className="doc-image"
                  onClick={() =>
                    openModal(getImageUrl(`/api/images/${a._id}/aadharBack`))
                  }
                />
              )}
              {a.panCard && (
                <img
                  src={getImageUrl(`/api/images/${a._id}/pan`)}
                  alt="PAN"
                  className="doc-image"
                  onClick={() =>
                    openModal(getImageUrl(`/api/images/${a._id}/pan`))
                  }
                />
              )}
              {a.savingAccountImage && (
                <img
                  src={getImageUrl(`/api/images/${a._id}/savingImg`)}
                  alt="Passbook"
                  className="doc-image"
                  onClick={() =>
                    openModal(getImageUrl(`/api/images/${a._id}/savingImg`))
                  }
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
            {/* ✅ UPDATED DOWNLOAD BUTTON - Now includes all ponds */}
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
          <img src={modalImage} alt="preview" />
        </div>
      )}

      {/* Pond Details Modal - ✅ UPDATED for Pond Image Link */}
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
                {pondDetailFields.map(({ label, key, isClickableLink, isFileArray }) => {
                  const value = selectedPond[key];
                  
                  // Check if this is a clickable link field (Pond Image)
                  if (isClickableLink && key === "pondImage" && value) {
                    const imageUrl = getImageUrl(`/uploads/${value}`);
                    return (
                      <div className="detail-row" key={key}>
                        <strong>{label}:</strong>
                        <div className="clickable-link-container">
                          <a 
                            href={imageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="clickable-link"
                          >
                            🔗 View Pond Image
                          </a>
                          <br />
                          <img 
                            src={imageUrl}
                            alt="Pond"
                            onClick={() => openModal(imageUrl)}
                            className="clickable-image"
                          />
                        </div>
                      </div>
                    );
                  }
                  
                  // Check if this is a file array
                  if (isFileArray && value && value.length > 0) {
                    return (
                      <div className="detail-row" key={key}>
                        <strong>{label}:</strong>
                        <div className="file-list">
                          {value.map((file, idx) => {
                            const fileUrl = getImageUrl(`/uploads/${file}`);
                            return (
                              <div key={idx} className="file-item">
                                <a 
                                  href={fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="file-link"
                                >
                                  📎 File {idx + 1}
                                </a>
                                <img
                                  src={fileUrl}
                                  alt={`${key} ${idx + 1}`}
                                  onClick={() => openModal(fileUrl)}
                                  className="clickable-thumbnail"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  
                  // Regular field
                  return (
                    <div className="detail-row" key={key}>
                      <strong>{label}:</strong>
                      <span>{value || "N/A"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => {
                  // Create CSV content with clickable links
                  const headers = ["Field", "Value"];
                  const rows = [];
                  
                  // Add all pond details
                  pondDetailFields.forEach(({ label, key }) => {
                    const value = selectedPond[key];
                    let displayValue = value || "N/A";
                    
                    // Handle arrays
                    if (Array.isArray(value)) {
                      displayValue = value.join("; ");
                    }
                    
                    // Handle Pond Image as clickable link
                    if (key === "pondImage" && value) {
                      displayValue = getImageUrl(`/uploads/${value}`);
                    }
                    
                    // Handle other file fields
                    if ((key === "pondFiles" || key === "fishFiles") && value) {
                      displayValue = Array.isArray(value) 
                        ? value.map(file => getImageUrl(`/uploads/${file}`)).join("; ")
                        : getImageUrl(`/uploads/${value}`);
                    }
                    
                    rows.push([label, displayValue]);
                  });
                  
                  // Add farmer info
                  if (selectedFarmer) {
                    rows.push(["", ""]);
                    rows.push(["FARMER INFORMATION", ""]);
                    farmerBasicFields.forEach(({ label, key }) => {
                      rows.push([label, selectedFarmer[key] || "N/A"]);
                    });
                  }
                  
                  // Add agent info
                  if (selectedAgent) {
                    rows.push(["", ""]);
                    rows.push(["AGENT INFORMATION", ""]);
                    rows.push(["Agent Name", selectedAgent.name]);
                    rows.push(["Agent Mobile", selectedAgent.mobile]);
                    rows.push(["Agent Email", selectedAgent.email]);
                  }
                  
                  // Create CSV
                  const csvContent = [
                    headers.join(","),
                    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
                  ].join("\n");
                  
                  // Create and download file
                  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `${selectedPond.pondId}_full_details.csv`);
                  link.style.visibility = "hidden";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="download-all-btn"
              >
                ⬇️ Download All Data (CSV)
              </button>
              
              <button 
                onClick={() => openHistoryModal(selectedPond.pondId, "pond", selectedPond.pondId)}
                className="history-btn"
              >
                📜 View History
              </button>
              
              <button onClick={closePondDetailsModal} className="close-modal-btn">
                ✕ Close
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
              <>
                <div className="history-stats">
                  <div className="stat-card">
                    <h4>Total Changes</h4>
                    <p>{historyData.length}</p>
                  </div>
                  <div className="stat-card">
                    <h4>Last Updated</h4>
                    <p>
                      {new Date(
                        Math.max(...historyData.map(h => new Date(h.createdAt || h.timestamp)))
                      ).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="stat-card">
                    <h4>Changes Today</h4>
                    <p>
                      {
                        historyData.filter(h => 
                          new Date(h.createdAt || h.timestamp).toDateString() === new Date().toDateString()
                        ).length
                      }
                    </p>
                  </div>
                </div>
                
                <div className="history-table-container">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Field</th>
                        <th>Changes</th>
                        <th>Changed By</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData
                        .sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp))
                        .map((h, idx) => (
                          <tr key={idx}>
                            <td>
                              <span className={`change-badge ${h.actionType || 'updated'}`}>
                                {h.actionType ? h.actionType.toUpperCase() : 'UPDATED'}
                              </span>
                            </td>
                            <td>
                              {Array.isArray(h.changes) ? (
                                h.changes.map((c, i) => (
                                  <div key={i}>{c.field}</div>
                                ))
                              ) : (
                                Object.keys(h.changes || {}).length > 0 ? (
                                  Object.keys(h.changes || {}).map((k, i) => <div key={i}>{k}</div>)
                                ) : (
                                  <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                                    No field changes detected
                                  </div>
                                )
                              )}
                            </td>
                            <td>
                              {Array.isArray(h.changes) ? (
                                h.changes.map((c, i) => (
                                  <div key={i}>
                                    <span className="old-value">{JSON.stringify(c.old || 'N/A')}</span> → 
                                    <span className="new-value">{JSON.stringify(c.new || 'N/A')}</span>
                                  </div>
                                ))
                              ) : Object.keys(h.changes || {}).length > 0 ? (
                                Object.entries(h.changes || {}).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="old-value">{JSON.stringify(value.old || 'N/A')}</span> → 
                                    <span className="new-value">{JSON.stringify(value.new || 'N/A')}</span>
                                  </div>
                                ))
                              ) : (
                                <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                                  Only metadata updated
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="user-info">
                                <div className="user-avatar">
                                  {h.updatedBy?.name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '600' }}>
                                    {h.updatedBy?.name || 'Admin'}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {h.updatedBy?.role || 'System'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="timestamp">
                                {new Date(h.createdAt || h.timestamp).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;





