


// // OrdersDashboard.jsx - ALL ORDERS VERSION
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api, { getImageUrl } from "../utils/api";
// import "./OrdersDashboard.css";

// const OrdersDashboard = () => {
//   const navigate = useNavigate();

//   const [allOrders, setAllOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [deletingOrder, setDeletingOrder] = useState(null);
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [dealersList, setDealersList] = useState([]);
//   const [viewMode, setViewMode] = useState("all"); // "all" or "dealer"

//   useEffect(() => {
//     fetchAllOrders();
//     fetchAllDealers();
//   }, [navigate]);

//   const fetchAllOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/api/orders");
      
//       if (res.data) {
//         // Sort orders by createdAt descending (newest first)
//         const sortedOrders = res.data.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setAllOrders(sortedOrders);
//       } else {
//         setAllOrders([]);
//       }
      
//     } catch (err) {
//       console.error("Error fetching all orders:", err);
//       setAllOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllDealers = async () => {
//     try {
//       const res = await api.get("/api/dealers");
//       setDealersList(res.data || []);
//     } catch (err) {
//       console.error("Error fetching dealers:", err);
//     }
//   };

//   const fetchDealerOrders = async (dealerId) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/api/orders/dealer/${dealerId}`);
      
//       if (res.data) {
//         const sortedOrders = res.data.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setAllOrders(sortedOrders);
//       } else {
//         setAllOrders([]);
//       }
      
//     } catch (err) {
//       console.error("Error fetching dealer orders:", err);
//       setAllOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDealerSelect = (dealer) => {
//     if (!dealer) {
//       setViewMode("all");
//       setSelectedDealer(null);
//       fetchAllOrders();
//       return;
//     }
    
//     setSelectedDealer(dealer);
//     setViewMode("dealer");
//     fetchDealerOrders(dealer._id);
//   };

//   // Handle order deletion
//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
//       return;
//     }

//     setDeletingOrder(orderId);
//     try {
//       await api.delete(`/api/orders/${orderId}`);
      
//       // Remove the order from state
//       setAllOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      
//       // Close expanded view if deleting expanded order
//       if (expandedOrder === orderId) {
//         setExpandedOrder(null);
//       }
      
//       alert("✅ Order deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting order:", err);
      
//       if (err.response) {
//         alert(`❌ Failed to delete order: ${err.response.data.message || 'Server error'}`);
//       } else if (err.request) {
//         alert("❌ Network error. Please check your connection.");
//       } else {
//         alert("❌ Failed to delete order. Please try again.");
//       }
//     } finally {
//       setDeletingOrder(null);
//     }
//   };

//   // Filter orders based on search
//   const filteredOrders = allOrders
//     .map(order => ({
//       ...order,
//       items: order.items.filter(item => 
//         item.name.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     }))
//     .filter(order => order.items.length > 0);

//   // Calculate statistics
//   const totalOrders = allOrders.length;
//   const totalItems = allOrders.reduce((sum, order) => sum + order.items.length, 0);
//   const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

//   // Toggle order details
//   const toggleOrderDetails = (orderId) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   if (loading) {
//     return (
//       <div className="order-loading-container">
//         <div className="order-loading-spinner"></div>
//         <h3>Loading Orders...</h3>
//         <p>Please wait while we fetch all orders</p>
//       </div>
//     );
//   }

//   return (
//     <div className="order-orders-dashboard">
//       {/* Header Section */}
//       <header className="order-dashboard-header">
//         <div className="order-header-content">
//           <div className="order-header-left">
//             <h1 className="order-dashboard-title">
//               <i className="order-icon-orders"></i> Orders Dashboard
//             </h1>
//             <p className="order-dashboard-subtitle">
//               {viewMode === "all" ? "All Dealers Orders" : `Orders for: ${selectedDealer?.name}`}
//             </p>
//           </div>
//           <div className="order-header-actions">
//             <button 
//               className="order-btn-refresh"
//               onClick={viewMode === "all" ? fetchAllOrders : () => fetchDealerOrders(selectedDealer?._id)}
//               disabled={loading}
//             >
//               <i className="order-icon-refresh"></i> Refresh
//             </button>
//             <button 
//               className="order-btn-back"
//               onClick={() => navigate("/admindashboard")}
//             >
//               <i className="order-icon-back"></i> Back to Dashboard
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="order-dashboard-container">
//         {/* Sidebar */}
//         <aside className="order-dashboard-sidebar">
//           {/* Dealer Selector */}
//           <div className="order-sidebar-card">
//             <h3 className="order-sidebar-title">
//               <i className="order-icon-filter"></i> Filter Orders
//             </h3>
//             <div className="order-dealer-selector">
//               <button 
//                 className={`order-dealer-filter-btn ${viewMode === "all" ? "active" : ""}`}
//                 onClick={() => handleDealerSelect(null)}
//               >
//                 <i className="order-icon-all"></i> All Orders
//               </button>
              
//               <div className="order-dealer-list">
//                 <h4 className="order-dealer-list-title">Select Dealer:</h4>
//                 {dealersList.map(dealer => (
//                   <button
//                     key={dealer._id}
//                     className={`order-dealer-item ${selectedDealer?._id === dealer._id ? "active" : ""}`}
//                     onClick={() => handleDealerSelect(dealer)}
//                   >
//                     <i className="order-icon-dealer-small"></i>
//                     <span className="order-dealer-item-name">{dealer.name}</span>
//                     <span className="order-dealer-item-address">{dealer.shopAddress}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Stats Card */}
//           <div className="order-stats-card">
//             <h3 className="order-sidebar-title">
//               <i className="order-icon-stats"></i> Order Statistics
//             </h3>
//             <div className="order-stats-grid">
//               <div className="order-stat-item">
//                 <div className="order-stat-value">{totalOrders}</div>
//                 <div className="order-stat-label">Total Orders</div>
//               </div>
//               <div className="order-stat-item">
//                 <div className="order-stat-value">{totalItems}</div>
//                 <div className="order-stat-label">Items Sold</div>
//               </div>
//               <div className="order-stat-item">
//                 <div className="order-stat-value">₹{totalRevenue.toFixed(2)}</div>
//                 <div className="order-stat-label">Revenue</div>
//               </div>
//             </div>
//             {selectedDealer && (
//               <div className="order-current-dealer">
//                 <h4>Current Dealer:</h4>
//                 <p className="order-current-dealer-name">{selectedDealer.name}</p>
//                 <p className="order-current-dealer-address">{selectedDealer.shopAddress}</p>
//                 <p className="order-current-dealer-contact">{selectedDealer.contact}</p>
//               </div>
//             )}
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="order-dashboard-main">
//           {/* Search and Filters */}
//           <div className="order-search-section">
//             <div className="order-search-box">
//               <i className="order-icon-search"></i>
//               <input
//                 type="text"
//                 placeholder="Search products by name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="order-search-input"
//               />
//               {searchQuery && (
//                 <button 
//                   className="order-clear-search"
//                   onClick={() => setSearchQuery("")}
//                 >
//                   <i className="order-icon-close"></i>
//                 </button>
//               )}
//             </div>
            
//             <div className="order-search-stats">
//               <span className="order-stat-badge">
//                 <i className="order-icon-filter"></i>
//                 Showing {filteredOrders.length} of {totalOrders} orders
//                 {selectedDealer && ` (${selectedDealer.name})`}
//               </span>
//               {searchQuery && (
//                 <span className="order-search-term">
//                   Search: "{searchQuery}"
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Orders List */}
//           <div className="order-orders-section">
//             {filteredOrders.length === 0 ? (
//               <div className="order-empty-state">
//                 <div className="order-empty-icon">
//                   <i className="order-icon-empty"></i>
//                 </div>
//                 <h3>No Orders Found</h3>
//                 <p>
//                   {searchQuery 
//                     ? `No items matching "${searchQuery}"`
//                     : viewMode === "all" 
//                       ? "No orders placed yet." 
//                       : `No orders found for ${selectedDealer?.name}`
//                   }
//                 </p>
//                 {searchQuery && (
//                   <button 
//                     className="order-btn-clear-search"
//                     onClick={() => setSearchQuery("")}
//                   >
//                     Clear Search
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="order-orders-grid">
//                 {filteredOrders.map((order) => (
//                   <div 
//                     key={order._id} 
//                     className={`order-order-card ${expandedOrder === order._id ? 'expanded' : ''}`}
//                   >
//                     <div 
//                       className="order-order-header"
//                       onClick={() => toggleOrderDetails(order._id)}
//                     >
//                       <div className="order-order-info">
//                         <div className="order-order-id">
//                           <i className="order-icon-order"></i>
//                           <span>Order #{order._id?.substring(0, 8)}...</span>
//                           {viewMode === "all" && order.dealerId && (
//                             <span className="order-dealer-badge-mini">
//                               <i className="order-icon-dealer-small"></i>
//                               {order.dealerId.name || "Dealer"}
//                             </span>
//                           )}
//                         </div>
//                         <div className="order-order-date">
//                           <i className="order-icon-calendar"></i>
//                           {new Date(order.createdAt).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                           })}
//                         </div>
//                       </div>
//                       <div className="order-order-summary">
//                         <div className="order-summary-item">
//                           <span className="order-summary-label">Items</span>
//                           <span className="order-summary-value">{order.items.length}</span>
//                         </div>
//                         <div className="order-summary-item">
//                           <span className="order-summary-label">Total</span>
//                           <span className="order-summary-value order-amount">
//                             ₹{order.totalAmount?.toFixed(2) || "0.00"}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="order-order-toggle">
//                         <i className={`order-icon-chevron ${expandedOrder === order._id ? 'up' : 'down'}`}></i>
//                       </div>
//                     </div>

//                     {/* Expanded Order Details */}
//                     {expandedOrder === order._id && (
//                       <div className="order-order-details">
//                         <div className="order-details-header">
//                           <h4>Order Details</h4>
//                           <div className="order-order-time">
//                             <i className="order-icon-time"></i>
//                             Placed: {new Date(order.createdAt).toLocaleTimeString()}
//                             {viewMode === "all" && order.dealerId && (
//                               <span className="order-dealer-info-mini">
//                                 | Dealer: {order.dealerId.name}
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Items Table */}
//                         <div className="order-items-table-container">
//                           <table className="order-items-table">
//                             <thead>
//                               <tr>
//                                 <th>Product</th>
//                                 <th className="order-text-center">Quantity</th>
//                                 <th className="order-text-right">Unit Price</th>
//                                 <th className="order-text-right">Total</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {order.items.map((item, index) => (
//                                 <tr key={index}>
//                                   <td>
//                                     <div className="order-product-cell">
//                                       <span className="order-product-name">{item.name}</span>
//                                     </div>
//                                   </td>
//                                   <td className="order-text-center">
//                                     <span className="order-quantity-badge">{item.qty}</span>
//                                   </td>
//                                   <td className="order-text-right">
//                                     ₹{item.price.toFixed(2)}
//                                   </td>
//                                   <td className="order-text-right order-amount">
//                                     ₹{(item.qty * item.price).toFixed(2)}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                             <tfoot>
//                               <tr>
//                                 <td colSpan="3" className="order-text-right order-total-label">
//                                   Grand Total
//                                 </td>
//                                 <td className="order-text-right order-total-amount">
//                                   ₹{order.items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)}
//                                 </td>
//                               </tr>
//                             </tfoot>
//                           </table>
//                         </div>

//                         {/* Order Footer with Actions */}
//                         <div className="order-order-footer">
//                           <div className="order-footer-actions">
//                             {/* <button className="order-btn-action">
//                               <i className="order-icon-print"></i> Print Invoice
//                             </button> */}
//                             {/* <button className="order-btn-action">
//                               <i className="order-icon-download"></i> Download
//                             </button> */}
//                             {/* <button className="order-btn-action">
//                               <i className="order-icon-share"></i> Share
//                             </button> */}
//                             <button 
//                               className="order-btn-delete"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteOrder(order._id);
//                               }}
//                               disabled={deletingOrder === order._id}
//                             >
//                               {deletingOrder === order._id ? (
//                                 <>
//                                   <i className="order-icon-spinner"></i> Deleting...
//                                 </>
//                               ) : (
//                                 <>
//                                   <i className="order-icon-delete"></i> Delete Order
//                                 </>
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default OrdersDashboard;














// // OrdersDashboard.jsx - PHONE VIEW FIXED
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/api";
// import "./OrdersDashboard.css";

// const OrdersDashboard = () => {
//   const navigate = useNavigate();

//   const [allOrders, setAllOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [deletingOrder, setDeletingOrder] = useState(null);
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [dealersList, setDealersList] = useState([]);
//   const [viewMode, setViewMode] = useState("all");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     fetchAllOrders();
//     fetchAllDealers();
//   }, [navigate]);

//   const fetchAllOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/api/orders");
      
//       if (res.data) {
//         const sortedOrders = res.data.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setAllOrders(sortedOrders);
//       } else {
//         setAllOrders([]);
//       }
      
//     } catch (err) {
//       console.error("Error fetching all orders:", err);
//       setAllOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllDealers = async () => {
//     try {
//       const res = await api.get("/api/dealers");
//       setDealersList(res.data || []);
//     } catch (err) {
//       console.error("Error fetching dealers:", err);
//     }
//   };

//   const fetchDealerOrders = async (dealerId) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/api/orders/dealer/${dealerId}`);
      
//       if (res.data) {
//         const sortedOrders = res.data.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setAllOrders(sortedOrders);
//       } else {
//         setAllOrders([]);
//       }
      
//     } catch (err) {
//       console.error("Error fetching dealer orders:", err);
//       setAllOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDealerSelect = (dealer) => {
//     if (!dealer) {
//       setViewMode("all");
//       setSelectedDealer(null);
//       fetchAllOrders();
//       return;
//     }
    
//     setSelectedDealer(dealer);
//     setViewMode("dealer");
//     fetchDealerOrders(dealer._id);
//   };

//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
//       return;
//     }

//     setDeletingOrder(orderId);
//     try {
//       await api.delete(`/api/orders/${orderId}`);
      
//       setAllOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      
//       if (expandedOrder === orderId) {
//         setExpandedOrder(null);
//       }
      
//       alert("✅ Order deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting order:", err);
      
//       if (err.response) {
//         alert(`❌ Failed to delete order: ${err.response.data.message || 'Server error'}`);
//       } else if (err.request) {
//         alert("❌ Network error. Please check your connection.");
//       } else {
//         alert("❌ Failed to delete order. Please try again.");
//       }
//     } finally {
//       setDeletingOrder(null);
//     }
//   };

//   const filteredOrders = allOrders
//     .map(order => ({
//       ...order,
//       items: order.items.filter(item => 
//         item.name.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     }))
//     .filter(order => order.items.length > 0);

//   const totalOrders = allOrders.length;
//   const totalItems = allOrders.reduce((sum, order) => sum + order.items.length, 0);
//   const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

//   const toggleOrderDetails = (orderId) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   if (loading) {
//     return (
//       <div className="ords-loading-container">
//         <div className="ords-loading-spinner"></div>
//         <h3>Loading Orders...</h3>
//         <p>Please wait while we fetch all orders</p>
//       </div>
//     );
//   }

//   return (
//     <div className="ords-main-container">
//       {/* Header Section */}
//       <header className="ords-header">
//         <div className="ords-header-content">
//           <div className="ords-header-left">
//             <h1 className="ords-title">
//               <i className="ords-icon-orders"></i> Orders Dashboard
//             </h1>
//             <p className="ords-subtitle">
//               {viewMode === "all" ? "All Dealers Orders" : `Orders for: ${selectedDealer?.name}`}
//             </p>
//           </div>
//           <div className="ords-header-actions">
//             <button 
//               className="ords-btn-refresh"
//               onClick={viewMode === "all" ? fetchAllOrders : () => fetchDealerOrders(selectedDealer?._id)}
//               disabled={loading}
//             >
//               <i className="ords-icon-refresh"></i> {!isMobile && "Refresh"}
//             </button>
//             <button 
//               className="ords-btn-back"
//               onClick={() => navigate("/admindashboard")}
//             >
//               <i className="ords-icon-back"></i> {!isMobile && "Back"}
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="ords-dashboard-wrapper">
//         {/* Sidebar - Always visible on mobile as part of main flow */}
//         {!isMobile ? (
//           <aside className="ords-sidebar">
//             {/* Dealer Selector */}
//             <div className="ords-sidebar-card">
//               <h3 className="ords-sidebar-title">
//                 <i className="ords-icon-filter"></i> Filter Orders
//               </h3>
//               <div className="ords-dealer-selector">
//                 <button 
//                   className={`ords-dealer-filter-btn ${viewMode === "all" ? "active" : ""}`}
//                   onClick={() => handleDealerSelect(null)}
//                 >
//                   <i className="ords-icon-all"></i> All Orders
//                 </button>
                
//                 <div className="ords-dealer-list">
//                   <h4 className="ords-dealer-list-title">Select Dealer:</h4>
//                   {dealersList.map(dealer => (
//                     <button
//                       key={dealer._id}
//                       className={`ords-dealer-item ${selectedDealer?._id === dealer._id ? "active" : ""}`}
//                       onClick={() => handleDealerSelect(dealer)}
//                     >
//                       <i className="ords-icon-dealer-small"></i>
//                       <span className="ords-dealer-item-name">{dealer.name}</span>
//                       <span className="ords-dealer-item-address">{dealer.shopAddress}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Stats Card */}
//             <div className="ords-stats-card">
//               <h3 className="ords-sidebar-title">
//                 <i className="ords-icon-stats"></i> Order Statistics
//               </h3>
//               <div className="ords-stats-grid">
//                 <div className="ords-stat-item">
//                   <div className="ords-stat-value">{totalOrders}</div>
//                   <div className="ords-stat-label">Total Orders</div>
//                 </div>
//                 <div className="ords-stat-item">
//                   <div className="ords-stat-value">{totalItems}</div>
//                   <div className="ords-stat-label">Items Sold</div>
//                 </div>
//                 <div className="ords-stat-item">
//                   <div className="ords-stat-value">₹{totalRevenue.toFixed(2)}</div>
//                   <div className="ords-stat-label">Revenue</div>
//                 </div>
//               </div>
//               {selectedDealer && (
//                 <div className="ords-current-dealer">
//                   <h4>Current Dealer:</h4>
//                   <p className="ords-current-dealer-name">{selectedDealer.name}</p>
//                   <p className="ords-current-dealer-address">{selectedDealer.shopAddress}</p>
//                   <p className="ords-current-dealer-contact">{selectedDealer.contact}</p>
//                 </div>
//               )}
//             </div>
//           </aside>
//         ) : (
//           /* Mobile Filters Section - Always visible */
//           <div className="ords-mobile-filters">
//             <div className="ords-mobile-filters-header">
//               <h3 className="ords-mobile-filters-title">
//                 <i className="ords-icon-filter"></i> Filter & Stats
//               </h3>
//             </div>
            
//             {/* Mobile Stats */}
//             <div className="ords-mobile-stats">
//               <div className="ords-mobile-stat">
//                 <div className="ords-mobile-stat-value">{totalOrders}</div>
//                 <div className="ords-mobile-stat-label">Orders</div>
//               </div>
//               <div className="ords-mobile-stat">
//                 <div className="ords-mobile-stat-value">{totalItems}</div>
//                 <div className="ords-mobile-stat-label">Items</div>
//               </div>
//               <div className="ords-mobile-stat">
//                 <div className="ords-mobile-stat-value">₹{totalRevenue.toFixed(2)}</div>
//                 <div className="ords-mobile-stat-label">Revenue</div>
//               </div>
//             </div>
            
//             {/* Mobile Filter Buttons */}
//             <div className="ords-mobile-filter-buttons">
//               <button 
//                 className={`ords-mobile-filter-btn ${viewMode === "all" ? "active" : ""}`}
//                 onClick={() => handleDealerSelect(null)}
//               >
//                 <i className="ords-icon-all"></i> All Orders
//               </button>
              
//               <div className="ords-mobile-dealers-scroll">
//                 {dealersList.map(dealer => (
//                   <button
//                     key={dealer._id}
//                     className={`ords-mobile-dealer-btn ${selectedDealer?._id === dealer._id ? "active" : ""}`}
//                     onClick={() => handleDealerSelect(dealer)}
//                   >
//                     <i className="ords-icon-dealer-small"></i>
//                     <span className="ords-mobile-dealer-name">{dealer.name}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             {selectedDealer && (
//               <div className="ords-mobile-selected-dealer">
//                 <div className="ords-mobile-dealer-info">
//                   <h4>Selected Dealer:</h4>
//                   <p className="ords-mobile-dealer-name">{selectedDealer.name}</p>
//                   <p className="ords-mobile-dealer-address">{selectedDealer.shopAddress}</p>
//                 </div>
//                 <button 
//                   className="ords-mobile-clear-filter"
//                   onClick={() => handleDealerSelect(null)}
//                 >
//                   Clear Filter
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Main Content */}
//         <main className="ords-main-content">
//           {/* Search Section */}
//           <div className="ords-search-section">
//             <div className="ords-search-box">
//               <i className="ords-icon-search"></i>
//               <input
//                 type="text"
//                 placeholder="Search products by name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="ords-search-input"
//               />
//               {searchQuery && (
//                 <button 
//                   className="ords-clear-search"
//                   onClick={() => setSearchQuery("")}
//                 >
//                   <i className="ords-icon-close"></i>
//                 </button>
//               )}
//             </div>
            
//             <div className="ords-search-stats">
//               <span className="ords-stat-badge">
//                 <i className="ords-icon-filter"></i>
//                 Showing {filteredOrders.length} of {totalOrders} orders
//                 {selectedDealer && ` (${selectedDealer.name})`}
//               </span>
//               {searchQuery && (
//                 <span className="ords-search-term">
//                   Search: "{searchQuery}"
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Orders List */}
//           <div className="ords-orders-section">
//             {filteredOrders.length === 0 ? (
//               <div className="ords-empty-state">
//                 <div className="ords-empty-icon">
//                   <i className="ords-icon-empty"></i>
//                 </div>
//                 <h3>No Orders Found</h3>
//                 <p>
//                   {searchQuery 
//                     ? `No items matching "${searchQuery}"`
//                     : viewMode === "all" 
//                       ? "No orders placed yet." 
//                       : `No orders found for ${selectedDealer?.name}`
//                   }
//                 </p>
//                 {searchQuery && (
//                   <button 
//                     className="ords-btn-clear-search"
//                     onClick={() => setSearchQuery("")}
//                   >
//                     Clear Search
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="ords-orders-grid">
//                 {filteredOrders.map((order) => (
//                   <div 
//                     key={order._id} 
//                     className={`ords-order-card ${expandedOrder === order._id ? 'expanded' : ''}`}
//                   >
//                     <div 
//                       className="ords-order-header"
//                       onClick={() => toggleOrderDetails(order._id)}
//                     >
//                       <div className="ords-order-info">
//                         <div className="ords-order-id">
//                           <i className="ords-icon-order"></i>
//                           <span className="ords-order-id-text">Order #{order._id?.substring(0, isMobile ? 6 : 8)}...</span>
//                           {viewMode === "all" && order.dealerId && (
//                             <span className="ords-dealer-badge-mini">
//                               <i className="ords-icon-dealer-small"></i>
//                               {isMobile ? "Dealer" : order.dealerId.name || "Dealer"}
//                             </span>
//                           )}
//                         </div>
//                         <div className="ords-order-date">
//                           <i className="ords-icon-calendar"></i>
//                           {new Date(order.createdAt).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                           })}
//                         </div>
//                       </div>
//                       <div className="ords-order-summary">
//                         <div className="ords-summary-item">
//                           <span className="ords-summary-label">Items</span>
//                           <span className="ords-summary-value">{order.items.length}</span>
//                         </div>
//                         <div className="ords-summary-item">
//                           <span className="ords-summary-label">Total</span>
//                           <span className="ords-summary-value ords-amount">
//                             ₹{order.totalAmount?.toFixed(2) || "0.00"}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="ords-order-toggle">
//                         <i className={`ords-icon-chevron ${expandedOrder === order._id ? 'up' : 'down'}`}></i>
//                       </div>
//                     </div>

//                     {/* Expanded Order Details */}
//                     {expandedOrder === order._id && (
//                       <div className="ords-order-details">
//                         <div className="ords-details-header">
//                           <h4>Order Details</h4>
//                           <div className="ords-order-time">
//                             <i className="ords-icon-time"></i>
//                             Placed: {new Date(order.createdAt).toLocaleTimeString()}
//                             {viewMode === "all" && order.dealerId && (
//                               <span className="ords-dealer-info-mini">
//                                 | Dealer: {order.dealerId.name}
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Items Table */}
//                         <div className="ords-items-table-container">
//                           <table className="ords-items-table">
//                             <thead>
//                               <tr>
//                                 <th>Product</th>
//                                 <th className="ords-text-center">Qty</th>
//                                 <th className="ords-text-right">Price</th>
//                                 <th className="ords-text-right">Total</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {order.items.map((item, index) => (
//                                 <tr key={index}>
//                                   <td>
//                                     <div className="ords-product-cell">
//                                       <span className="ords-product-name">{item.name}</span>
//                                     </div>
//                                   </td>
//                                   <td className="ords-text-center">
//                                     <span className="ords-quantity-badge">{item.qty}</span>
//                                   </td>
//                                   <td className="ords-text-right">
//                                     ₹{item.price.toFixed(2)}
//                                   </td>
//                                   <td className="ords-text-right ords-amount">
//                                     ₹{(item.qty * item.price).toFixed(2)}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                             <tfoot>
//                               <tr>
//                                 <td colSpan="3" className="ords-text-right ords-total-label">
//                                   Grand Total
//                                 </td>
//                                 <td className="ords-text-right ords-total-amount">
//                                   ₹{order.items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)}
//                                 </td>
//                               </tr>
//                             </tfoot>
//                           </table>
//                         </div>

//                         {/* Order Footer with Actions */}
//                         <div className="ords-order-footer">
//                           <div className="ords-footer-actions">
//                             <button 
//                               className="ords-btn-delete"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteOrder(order._id);
//                               }}
//                               disabled={deletingOrder === order._id}
//                             >
//                               {deletingOrder === order._id ? (
//                                 <>
//                                   <i className="ords-icon-spinner"></i> Deleting...
//                                 </>
//                               ) : (
//                                 <>
//                                   <i className="ords-icon-delete"></i> Delete Order
//                                 </>
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default OrdersDashboard;




















// // OrdersDashboard.jsx - FINAL VERSION (NO SEARCH BOX)
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/api";
// import "./OrdersDashboard.css";

// const OrdersDashboard = () => {
//   const navigate = useNavigate();

//   const [allOrders, setAllOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [deletingOrder, setDeletingOrder] = useState(null);
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [dealersList, setDealersList] = useState([]);
//   const [viewMode, setViewMode] = useState("all");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     fetchAllOrders();
//     fetchAllDealers();
//   }, [navigate]);

//   const fetchAllOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/api/orders");
      
//       if (res.data) {
//         const sortedOrders = res.data.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setAllOrders(sortedOrders);
//       } else {
//         setAllOrders([]);
//       }
      
//     } catch (err) {
//       console.error("Error fetching all orders:", err);
//       setAllOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllDealers = async () => {
//     try {
//       const res = await api.get("/api/dealers");
//       setDealersList(res.data || []);
//     } catch (err) {
//       console.error("Error fetching dealers:", err);
//     }
//   };

//   const fetchDealerOrders = async (dealerId) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/api/orders/dealer/${dealerId}`);
      
//       if (res.data) {
//         const sortedOrders = res.data.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setAllOrders(sortedOrders);
//       } else {
//         setAllOrders([]);
//       }
      
//     } catch (err) {
//       console.error("Error fetching dealer orders:", err);
//       setAllOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDealerSelect = (dealer) => {
//     if (!dealer) {
//       setViewMode("all");
//       setSelectedDealer(null);
//       fetchAllOrders();
//       return;
//     }
    
//     setSelectedDealer(dealer);
//     setViewMode("dealer");
//     fetchDealerOrders(dealer._id);
//   };

//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
//       return;
//     }

//     setDeletingOrder(orderId);
//     try {
//       await api.delete(`/api/orders/${orderId}`);
      
//       setAllOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      
//       if (expandedOrder === orderId) {
//         setExpandedOrder(null);
//       }
      
//       alert("✅ Order deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting order:", err);
      
//       if (err.response) {
//         alert(`❌ Failed to delete order: ${err.response.data.message || 'Server error'}`);
//       } else if (err.request) {
//         alert("❌ Network error. Please check your connection.");
//       } else {
//         alert("❌ Failed to delete order. Please try again.");
//       }
//     } finally {
//       setDeletingOrder(null);
//     }
//   };

//   const filteredOrders = allOrders;

//   const totalOrders = allOrders.length;
//   const totalItems = allOrders.reduce((sum, order) => sum + order.items.length, 0);
//   const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

//   const toggleOrderDetails = (orderId) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   if (loading) {
//     return (
//       <div className="ords-loading-container">
//         <div className="ords-loading-spinner"></div>
//         <h3>Loading Orders...</h3>
//         <p>Please wait while we fetch all orders</p>
//       </div>
//     );
//   }

//   return (
//     <div className="ords-main-container">
//       {/* Header Section */}
//       <header className="ords-header">
//         <div className="ords-header-content">
//           <div className="ords-header-left">
//             <h1 className="ords-title">
//               <i className="ords-icon-orders"></i> Orders Dashboard
//             </h1>
//             <p className="ords-subtitle">
//               {viewMode === "all" ? "All Dealers Orders" : `Orders for: ${selectedDealer?.name}`}
//             </p>
//           </div>
//           <div className="ords-header-actions">
//             <button 
//               className="ords-btn-refresh"
//               onClick={viewMode === "all" ? fetchAllOrders : () => fetchDealerOrders(selectedDealer?._id)}
//               disabled={loading}
//             >
//               <i className="ords-icon-refresh"></i> {!isMobile && "Refresh"}
//             </button>
//             <button 
//               className="ords-btn-back"
//               onClick={() => navigate("/admindashboard")}
//             >
//               <i className="ords-icon-back"></i> {!isMobile && "Back"}
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="ords-dashboard-wrapper">
//         {/* Sidebar - Always visible on desktop/tablet */}
//         {!isMobile ? (
//           <aside className="ords-sidebar">
//             {/* Dealer Selector */}
//             <div className="ords-sidebar-card">
//               <h3 className="ords-sidebar-title">
//                 <i className="ords-icon-filter"></i> Filter Orders
//               </h3>
//               <div className="ords-dealer-selector">
//                 <button 
//                   className={`ords-dealer-filter-btn ${viewMode === "all" ? "active" : ""}`}
//                   onClick={() => handleDealerSelect(null)}
//                 >
//                   <i className="ords-icon-all"></i> All Orders
//                 </button>
                
//                 <div className="ords-dealer-list">
//                   <h4 className="ords-dealer-list-title">Select Dealer:</h4>
//                   {dealersList.map(dealer => (
//                     <button
//                       key={dealer._id}
//                       className={`ords-dealer-item ${selectedDealer?._id === dealer._id ? "active" : ""}`}
//                       onClick={() => handleDealerSelect(dealer)}
//                     >
//                       <i className="ords-icon-dealer-small"></i>
//                       <span className="ords-dealer-item-name">{dealer.name}</span>
//                       <span className="ords-dealer-item-address">{dealer.shopAddress}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Stats Card */}
//             <div className="ords-sidebar-card">
//               <h3 className="ords-sidebar-title">
//                 <i className="ords-icon-stats"></i> Order Statistics
//               </h3>
//               <div className="ords-stats-grid">
//                 <div className="ords-stat-item">
//                   <div className="ords-stat-value">{totalOrders}</div>
//                   <div className="ords-stat-label">Total Orders</div>
//                 </div>
//                 <div className="ords-stat-item">
//                   <div className="ords-stat-value">{totalItems}</div>
//                   <div className="ords-stat-label">Items Sold</div>
//                 </div>
//                 <div className="ords-stat-item">
//                   <div className="ords-stat-value">₹{totalRevenue.toFixed(2)}</div>
//                   <div className="ords-stat-label">Revenue</div>
//                 </div>
//               </div>
//               {selectedDealer && (
//                 <div className="ords-current-dealer">
//                   <h4>Current Dealer:</h4>
//                   <p className="ords-current-dealer-name">{selectedDealer.name}</p>
//                   <p className="ords-current-dealer-address">{selectedDealer.shopAddress}</p>
//                   <p className="ords-current-dealer-contact">{selectedDealer.contact}</p>
//                 </div>
//               )}
//             </div>
//           </aside>
//         ) : (
//           /* Mobile Filters Section - Always visible on mobile */
//           <div className="ords-mobile-filters">
//             <div className="ords-mobile-filters-header">
//               <h3 className="ords-mobile-filters-title">
//                 <i className="ords-icon-filter"></i> Filter & Stats
//               </h3>
//             </div>
            
//             {/* Mobile Stats */}
//             <div className="ords-mobile-stats">
//               <div className="ords-mobile-stat">
//                 <div className="ords-mobile-stat-value">{totalOrders}</div>
//                 <div className="ords-mobile-stat-label">Orders</div>
//               </div>
//               <div className="ords-mobile-stat">
//                 <div className="ords-mobile-stat-value">{totalItems}</div>
//                 <div className="ords-mobile-stat-label">Items</div>
//               </div>
//               <div className="ords-mobile-stat">
//                 <div className="ords-mobile-stat-value">₹{totalRevenue.toFixed(2)}</div>
//                 <div className="ords-mobile-stat-label">Revenue</div>
//               </div>
//             </div>
            
//             {/* Mobile Filter Buttons */}
//             <div className="ords-mobile-filter-buttons">
//               <button 
//                 className={`ords-mobile-filter-btn ${viewMode === "all" ? "active" : ""}`}
//                 onClick={() => handleDealerSelect(null)}
//               >
//                 <i className="ords-icon-all"></i> All Orders
//               </button>
              
//               <div className="ords-mobile-dealers-scroll">
//                 {dealersList.map(dealer => (
//                   <button
//                     key={dealer._id}
//                     className={`ords-mobile-dealer-btn ${selectedDealer?._id === dealer._id ? "active" : ""}`}
//                     onClick={() => handleDealerSelect(dealer)}
//                   >
//                     <i className="ords-icon-dealer-small"></i>
//                     <span className="ords-mobile-dealer-name">{dealer.name}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             {selectedDealer && (
//               <div className="ords-mobile-selected-dealer">
//                 <div className="ords-mobile-dealer-info">
//                   <h4>Selected Dealer:</h4>
//                   <p className="ords-mobile-dealer-name">{selectedDealer.name}</p>
//                   <p className="ords-mobile-dealer-address">{selectedDealer.shopAddress}</p>
//                 </div>
//                 <button 
//                   className="ords-mobile-clear-filter"
//                   onClick={() => handleDealerSelect(null)}
//                 >
//                   Clear Filter
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Main Content */}
//         <main className="ords-main-content">
//           {/* Info Stats Bar (Replaces Search Box) */}
//           <div className="ords-info-stats">
//             <i className="ords-icon-filter"></i>
//             Showing {filteredOrders.length} of {totalOrders} orders
//             {selectedDealer && ` (${selectedDealer.name})`}
//           </div>

//           {/* Orders List */}
//           <div className="ords-orders-section">
//             {filteredOrders.length === 0 ? (
//               <div className="ords-empty-state">
//                 <div className="ords-empty-icon">
//                   <i className="ords-icon-empty"></i>
//                 </div>
//                 <h3>No Orders Found</h3>
//                 <p>
//                   {viewMode === "all" 
//                     ? "No orders placed yet." 
//                     : `No orders found for ${selectedDealer?.name}`
//                   }
//                 </p>
//               </div>
//             ) : (
//               <div className="ords-orders-grid">
//                 {filteredOrders.map((order) => (
//                   <div 
//                     key={order._id} 
//                     className={`ords-order-card ${expandedOrder === order._id ? 'expanded' : ''}`}
//                   >
//                     <div 
//                       className="ords-order-header"
//                       onClick={() => toggleOrderDetails(order._id)}
//                     >
//                       <div className="ords-order-info">
//                         <div className="ords-order-id">
//                           <i className="ords-icon-order"></i>
//                           <span className="ords-order-id-text">Order #{order._id?.substring(0, isMobile ? 6 : 8)}...</span>
//                           {viewMode === "all" && order.dealerId && (
//                             <span className="ords-dealer-badge-mini">
//                               <i className="ords-icon-dealer-small"></i>
//                               {isMobile ? "Dealer" : order.dealerId.name || "Dealer"}
//                             </span>
//                           )}
//                         </div>
//                         <div className="ords-order-date">
//                           <i className="ords-icon-calendar"></i>
//                           {new Date(order.createdAt).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                           })}
//                         </div>
//                       </div>
//                       <div className="ords-order-summary">
//                         <div className="ords-summary-item">
//                           <span className="ords-summary-label">Items</span>
//                           <span className="ords-summary-value">{order.items.length}</span>
//                         </div>
//                         <div className="ords-summary-item">
//                           <span className="ords-summary-label">Total</span>
//                           <span className="ords-summary-value ords-amount">
//                             ₹{order.totalAmount?.toFixed(2) || "0.00"}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="ords-order-toggle">
//                         <i className={`ords-icon-chevron ${expandedOrder === order._id ? 'up' : 'down'}`}></i>
//                       </div>
//                     </div>

//                     {/* Expanded Order Details */}
//                     {expandedOrder === order._id && (
//                       <div className="ords-order-details">
//                         <div className="ords-details-header">
//                           <h4>Order Details</h4>
//                           <div className="ords-order-time">
//                             <i className="ords-icon-time"></i>
//                             Placed: {new Date(order.createdAt).toLocaleTimeString()}
//                             {viewMode === "all" && order.dealerId && (
//                               <span className="ords-dealer-info-mini">
//                                 | Dealer: {order.dealerId.name}
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Items Table */}
//                         <div className="ords-items-table-container">
//                           <table className="ords-items-table">
//                             <thead>
//                               <tr>
//                                 <th>Product</th>
//                                 <th className="ords-text-center">Qty</th>
//                                 <th className="ords-text-right">Price</th>
//                                 <th className="ords-text-right">Total</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {order.items.map((item, index) => (
//                                 <tr key={index}>
//                                   <td>
//                                     <div className="ords-product-cell">
//                                       <span className="ords-product-name">{item.name}</span>
//                                     </div>
//                                   </td>
//                                   <td className="ords-text-center">
//                                     <span className="ords-quantity-badge">{item.qty}</span>
//                                   </td>
//                                   <td className="ords-text-right">
//                                     ₹{item.price.toFixed(2)}
//                                   </td>
//                                   <td className="ords-text-right ords-amount">
//                                     ₹{(item.qty * item.price).toFixed(2)}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                             <tfoot>
//                               <tr>
//                                 <td colSpan="3" className="ords-text-right ords-total-label">
//                                   Grand Total
//                                 </td>
//                                 <td className="ords-text-right ords-total-amount">
//                                   ₹{order.items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)}
//                                 </td>
//                               </tr>
//                             </tfoot>
//                           </table>
//                         </div>

//                         {/* Order Footer with Actions */}
//                         <div className="ords-order-footer">
//                           <div className="ords-footer-actions">
//                             <button 
//                               className="ords-btn-delete"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteOrder(order._id);
//                               }}
//                               disabled={deletingOrder === order._id}
//                             >
//                               {deletingOrder === order._id ? (
//                                 <>
//                                   <i className="ords-icon-spinner"></i> Deleting...
//                                 </>
//                               ) : (
//                                 <>
//                                   <i className="ords-icon-delete"></i> Delete Order
//                                 </>
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default OrdersDashboard;





















// OrdersDashboard.jsx - FIXED VERSION (Weight Added, Revenue Width Reduced)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./OrdersDashboard.css";

const OrdersDashboard = () => {
  const navigate = useNavigate();

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealersList, setDealersList] = useState([]);
  const [viewMode, setViewMode] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchAllOrders();
    fetchAllDealers();
  }, [navigate]);

// useEffect(() => {
//   fetchAllOrders();
// }, []);



  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/orders");
      
      if (res.data) {
        const sortedOrders = res.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllOrders(sortedOrders);
      } else {
        setAllOrders([]);
      }
      
    } catch (err) {
      console.error("Error fetching all orders:", err);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDealers = async () => {
    try {
      const res = await api.get("/api/dealers");
      setDealersList(res.data || []);
    } catch (err) {
      console.error("Error fetching dealers:", err);
    }
  };



  
  const fetchDealerOrders = async (dealerId) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/orders/dealer/${dealerId}`);
      
      if (res.data) {
        const sortedOrders = res.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllOrders(sortedOrders);
      } else {
        setAllOrders([]);
      }
      
    } catch (err) {
      console.error("Error fetching dealer orders:", err);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDealerSelect = (dealer) => {
    if (!dealer) {
      setViewMode("all");
      setSelectedDealer(null);
      fetchAllOrders();
      return;
    }
    
    setSelectedDealer(dealer);
    setViewMode("dealer");
    fetchDealerOrders(dealer._id);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

    setDeletingOrder(orderId);
    try {
      await api.delete(`/api/orders/${orderId}`);
      
      setAllOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      
      if (expandedOrder === orderId) {
        setExpandedOrder(null);
      }
      
      alert("✅ Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order:", err);
      
      if (err.response) {
        alert(`❌ Failed to delete order: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        alert("❌ Network error. Please check your connection.");
      } else {
        alert("❌ Failed to delete order. Please try again.");
      }
    } finally {
      setDeletingOrder(null);
    }
  };

  const filteredOrders = allOrders;

  const totalOrders = allOrders.length;
  const totalItems = allOrders.reduce((sum, order) => sum + (order.items?.length || 0), 0);
  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Safe function to get weight from item
  const getItemWeight = (item) => {
    return item.weight || item.itemWeight || "1kg";
  };

  if (loading) {
    return (
      <div className="ords-loading-container">
        <div className="ords-loading-spinner"></div>
        <h3>Loading Orders...</h3>
        <p>Please wait while we fetch all orders</p>
      </div>
    );
  }

  return (
    <div className="ords-main-container">
      {/* Header Section */}
      <header className="ords-header">
        <div className="ords-header-content">
          <div className="ords-header-left">
            <h1 className="ords-title">
              <i className="ords-icon-orders"></i> Orders Dashboard
            </h1>
            <p className="ords-subtitle">
              {viewMode === "all" ? "All Dealers Orders" : `Orders for: ${selectedDealer?.name}`}
            </p>
          </div>
          <div className="ords-header-actions">
            <button 
              className="ords-btn-refresh"
              onClick={viewMode === "all" ? fetchAllOrders : () => fetchDealerOrders(selectedDealer?._id)}
              disabled={loading}
            >
              <i className="ords-icon-refresh"></i> {!isMobile && "Refresh"}
            </button>
            <button 
              className="ords-btn-back"
              onClick={() => navigate("/adminDashboard")}
            >
              <i className="ords-icon-back"></i> {!isMobile && "Back"}
            </button>
          </div>
        </div>
      </header>

      <div className="ords-dashboard-wrapper">
        {/* Sidebar - Always visible on desktop/tablet */}
        {!isMobile ? (
          <aside className="ords-sidebar">
            {/* Dealer Selector */}
            <div className="ords-sidebar-card">
              <h3 className="ords-sidebar-title">
                <i className="ords-icon-filter"></i> Filter Orders
              </h3>
              <div className="ords-dealer-selector">
                <button 
                  className={`ords-dealer-filter-btn ${viewMode === "all" ? "active" : ""}`}
                  onClick={() => handleDealerSelect(null)}
                >
                  <i className="ords-icon-all"></i> All Orders
                </button>
                
                <div className="ords-dealer-list">
                  <h4 className="ords-dealer-list-title">Select Dealer:</h4>
                  {dealersList.map(dealer => (
                    <button
                      key={dealer._id}
                      className={`ords-dealer-item ${selectedDealer?._id === dealer._id ? "active" : ""}`}
                      onClick={() => handleDealerSelect(dealer)}
                    >
                      <i className="ords-icon-dealer-small"></i>
                      <span className="ords-dealer-item-name">{dealer.name}</span>
                      <span className="ords-dealer-item-address">{dealer.shopAddress}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="ords-sidebar-card">
              <h3 className="ords-sidebar-title">
                <i className="ords-icon-stats"></i> Order Statistics
              </h3>
              <div className="ords-stats-grid">
                <div className="ords-stat-item">
                  <div className="ords-stat-value">{totalOrders}</div>
                  <div className="ords-stat-label">Total Orders</div>
                </div>
                <div className="ords-stat-item">
                  <div className="ords-stat-value">{totalItems}</div>
                  <div className="ords-stat-label">Items Sold</div>
                </div>
                <div className="ords-stat-item revenue-stat">
                  <div className="ords-stat-value revenue-value">₹{totalRevenue.toFixed(2)}</div>
                  <div className="ords-stat-label">Revenue</div>
                </div>
              </div>
              {selectedDealer && (
                <div className="ords-current-dealer">
                  <h4>Current Dealer:</h4>
                  <p className="ords-current-dealer-name">{selectedDealer.name}</p>
                  <p className="ords-current-dealer-address">{selectedDealer.shopAddress}</p>
                  <p className="ords-current-dealer-contact">{dealer.contact}</p>
                </div>
              )}
            </div>
          </aside>
        ) : (
          /* Mobile Filters Section - Always visible on mobile */
          <div className="ords-mobile-filters">
            <div className="ords-mobile-filters-header">
              <h3 className="ords-mobile-filters-title">
                <i className="ords-icon-filter"></i> Filter & Stats
              </h3>
            </div>
            
            {/* Mobile Stats */}
            <div className="ords-mobile-stats">
              <div className="ords-mobile-stat">
                <div className="ords-mobile-stat-value">{totalOrders}</div>
                <div className="ords-mobile-stat-label">Orders</div>
              </div>
              <div className="ords-mobile-stat">
                <div className="ords-mobile-stat-value">{totalItems}</div>
                <div className="ords-mobile-stat-label">Items</div>
              </div>
              <div className="ords-mobile-stat revenue-stat-mobile">
                <div className="ords-mobile-stat-value revenue-value-mobile">₹{totalRevenue.toFixed(2)}</div>
                <div className="ords-mobile-stat-label">Revenue</div>
              </div>
            </div>
            
            {/* Mobile Filter Buttons */}
            <div className="ords-mobile-filter-buttons">
              <button 
                className={`ords-mobile-filter-btn ${viewMode === "all" ? "active" : ""}`}
                onClick={() => handleDealerSelect(null)}
              >
                <i className="ords-icon-all"></i> All Orders
              </button>
              
              <div className="ords-mobile-dealers-scroll">
                {dealersList.map(dealer => (
                  <button
                    key={dealer._id}
                    className={`ords-mobile-dealer-btn ${selectedDealer?._id === dealer._id ? "active" : ""}`}
                    onClick={() => handleDealerSelect(dealer)}
                  >
                    <i className="ords-icon-dealer-small"></i>
                    <span className="ords-mobile-dealer-name">{dealer.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {selectedDealer && (
              <div className="ords-mobile-selected-dealer">
                <div className="ords-mobile-dealer-info">
                  <h4>Selected Dealer:</h4>
                  <p className="ords-mobile-dealer-name">{selectedDealer.name}</p>
                  <p className="ords-mobile-dealer-address">{selectedDealer.shopAddress}</p>
                </div>
                <button 
                  className="ords-mobile-clear-filter"
                  onClick={() => handleDealerSelect(null)}
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <main className="ords-main-content">
          {/* Info Stats Bar (Replaces Search Box) */}
          <div className="ords-info-stats">
            <i className="ords-icon-filter"></i>
            Showing {filteredOrders.length} of {totalOrders} orders
            {selectedDealer && ` (${selectedDealer.name})`}
          </div>

          {/* Orders List */}
          <div className="ords-orders-section">
            {filteredOrders.length === 0 ? (
              <div className="ords-empty-state">
                <div className="ords-empty-icon">
                  <i className="ords-icon-empty"></i>
                </div>
                <h3>No Orders Found</h3>
                <p>
                  {viewMode === "all" 
                    ? "No orders placed yet." 
                    : `No orders found for ${selectedDealer?.name}`
                  }
                </p>
              </div>
            ) : (
              <div className="ords-orders-grid">
                {filteredOrders.map((order) => (
                  <div 
                    key={order._id} 
                    className={`ords-order-card ${expandedOrder === order._id ? 'expanded' : ''}`}
                  >
                    <div 
                      className="ords-order-header"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <div className="ords-order-info">
                        <div className="ords-order-id">
                          <i className="ords-icon-order"></i>
                          <span className="ords-order-id-text">Order #{order._id?.substring(0, isMobile ? 6 : 8)}...</span>
                          {viewMode === "all" && order.dealerId && (
                            <span className="ords-dealer-badge-mini">
                              <i className="ords-icon-dealer-small"></i>
                              {isMobile ? "Dealer" : order.dealerId.name || "Dealer"}
                            </span>
                          )}
                        </div>
                        <div className="ords-order-date">
                          <i className="ords-icon-calendar"></i>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="ords-order-summary">
                        <div className="ords-summary-item">
                          <span className="ords-summary-label">Items</span>
                          <span className="ords-summary-value">{order.items?.length || 0}</span>
                        </div>
                        <div className="ords-summary-item revenue-summary">
                          <span className="ords-summary-label">Total</span>
                          <span className="ords-summary-value ords-amount">
                            ₹{(order.totalAmount || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="ords-order-toggle">
                        <i className={`ords-icon-chevron ${expandedOrder === order._id ? 'up' : 'down'}`}></i>
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    {expandedOrder === order._id && (
                      <div className="ords-order-details">
                        <div className="ords-details-header">
                          <h4>Order Details</h4>
                          <div className="ords-order-time">
                            <i className="ords-icon-time"></i>
                            Placed: {new Date(order.createdAt).toLocaleTimeString()}
                            {viewMode === "all" && order.dealerId && (
                              <span className="ords-dealer-info-mini">
                                | Dealer: {order.dealerId.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Items Table with Weight Column */}
                        <div className="ords-items-table-container">
                          <table className="ords-items-table">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th className="ords-text-center">Weight</th>
                                <th className="ords-text-center">Qty</th>
                                <th className="ords-text-right">Price</th>
                                <th className="ords-text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items?.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                    <div className="ords-product-cell">
                                      <span className="ords-product-name">{item.name}</span>
                                    </div>
                                  </td>
                                  <td className="ords-text-center">
                                    <span className="ords-weight-badge">{getItemWeight(item)}</span>
                                  </td>
                                  <td className="ords-text-center">
                                    <span className="ords-quantity-badge">{item.qty}</span>
                                  </td>
                                  <td className="ords-text-right">
                                    ₹{(item.price || 0).toFixed(2)}
                                  </td>
                                  <td className="ords-text-right ords-amount">
                                    ₹{((item.qty || 0) * (item.price || 0)).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="4" className="ords-text-right ords-total-label">
                                  Grand Total
                                </td>
                                <td className="ords-text-right ords-total-amount">
                                  ₹{(order.items?.reduce((sum, item) => sum + (item.qty || 0) * (item.price || 0), 0) || 0).toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        {/* Order Footer with Actions */}
                        <div className="ords-order-footer">
                          <div className="ords-footer-actions">
                            <button 
                              className="ords-btn-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order._id);
                              }}
                              disabled={deletingOrder === order._id}
                            >
                              {deletingOrder === order._id ? (
                                <>
                                  <i className="ords-icon-spinner"></i> Deleting...
                                </>
                              ) : (
                                <>
                                  <i className="ords-icon-delete"></i> Delete Order
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersDashboard;













