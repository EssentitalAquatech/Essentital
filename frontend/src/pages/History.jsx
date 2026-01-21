// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../utils/api";
// import "./History.css"; // We'll create this CSS file

// const History = () => {
//   const { dealerId } = useParams();
//   const navigate = useNavigate();
  
//   const [previousOrders, setPreviousOrders] = useState([]);
//   const [loadingOrders, setLoadingOrders] = useState(true);
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [refreshCounter, setRefreshCounter] = useState(0);

//   useEffect(() => {
//     const fetchPreviousOrders = async () => {
//       try {
//         setLoadingOrders(true);
//         const response = await api.get(`/api/orders/dealer/${dealerId}`);
        
//         const sortedOrders = response.data.sort((a, b) => 
//           new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate)
//         );
        
//         setPreviousOrders(sortedOrders);
//       } catch (error) {
//         console.error("Error fetching previous orders:", error);
//       } finally {
//         setLoadingOrders(false);
//       }
//     };

//     fetchPreviousOrders();
//   }, [dealerId, refreshCounter]);

//   const goToShop = () => {
//     navigate(`/dealer-shop/${dealerId}`);
//   };

//   const goToCart = () => {
//     navigate(`/cart/${dealerId}`);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const toggleOrderExpansion = (orderId) => {
//     if (expandedOrder === orderId) {
//       setExpandedOrder(null);
//     } else {
//       setExpandedOrder(orderId);
//     }
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowOrderModal(true);
//   };

//   const closeOrderModal = () => {
//     setShowOrderModal(false);
//     setSelectedOrder(null);
//   };

//   const getOrderItems = (order) => {
//     if (order.items && Array.isArray(order.items)) {
//       return order.items;
//     }
    
//     if (order.orderItems && Array.isArray(order.orderItems)) {
//       return order.orderItems;
//     }
    
//     return [];
//   };

//   const getOrderId = (order) => {
//     return order.orderNumber || 
//            order.orderId || 
//            order._id?.slice(-8) || 
//            `ORDER_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
//   };

//   return (
//     <div className="history-page-container">
//       <div className="history-page-header">
//         <h1>📋 Order History</h1>
//         <div className="header-actions">
//           <button className="back-to-shop-btn" onClick={goToShop}>
//             ← Back to Shop
//           </button>
//           <button className="view-cart-btn" onClick={goToCart}>
//             🛒 View Cart
//           </button>
//         </div>
//       </div>

//       <div className="history-content">
//         <div className="history-orders-section">
//           <h3 className="history-orders-title">Your Previous Orders</h3>
          
//           {loadingOrders ? (
//             <div className="loading-orders">
//               <div className="loading-spinner"></div>
//               <p>Loading your orders...</p>
//             </div>
//           ) : previousOrders.length > 0 ? (
//             <div className="history-orders-list">
//               {previousOrders.map((order, orderIndex) => {
//                 const orderId = order._id || order.orderId || orderIndex;
//                 const isExpanded = expandedOrder === orderId;
//                 const allItems = getOrderItems(order);
                
//                 return (
//                   <div key={orderId} className="history-order-card">
//                     <div className="history-order-header">
//                       <div className="history-order-info">
//                         <span className="history-order-id">Order #{getOrderId(order)}</span>
//                         <span className="history-order-date">{formatDate(order.createdAt || order.orderDate)}</span>
//                       </div>
//                       <button 
//                         className="history-view-order-btn"
//                         onClick={() => viewOrderDetails(order)}
//                       >
//                         View Details
//                       </button>
//                     </div>
                    
//                     <div className="history-order-items-preview">
//                       {(isExpanded ? allItems : allItems.slice(0, 3)).map((item, itemIndex) => {
//                         const itemName = item.name || item.productName || `Product ${itemIndex + 1}`;
//                         const itemWeight = item.weight || item.itemWeight || "1kg";
//                         const itemQty = item.qty || item.quantity || item.orderQty || 1;
//                         const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
//                         const itemTotal = itemPrice * itemQty;
                        
//                         return (
//                           <div key={itemIndex} className="history-order-item-preview">
//                             <span className="history-preview-name">{itemName}</span>
//                             <span className="history-preview-details">
//                               <span className="history-preview-weight">Weight: {itemWeight}</span>
//                               <span className="history-preview-qty">Qty: {itemQty}</span>
//                             </span>
//                             <span className="history-preview-price">₹{itemTotal.toFixed(2)}</span>
//                           </div>
//                         );
//                       })}
                      
//                       {allItems.length > 3 && (
//                         <div className="history-more-items-toggle">
//                           <button 
//                             className="history-toggle-items-btn"
//                             onClick={() => toggleOrderExpansion(orderId)}
//                           >
//                             {isExpanded ? 'Show Less' : `+${allItems.length - 3} more items`}
//                           </button>
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="history-order-footer">
//                       <div className="history-order-total">
//                         Total: <span className="history-total-amount">₹{(order.totalAmount || 0).toFixed(2)}</span>
//                       </div>
//                       <div className="history-order-status">
//                         Status: <span className="status-badge">Completed</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="no-history-orders-message">
//               <div className="no-history-orders-icon">📭</div>
//               <h4>No order history found</h4>
//               <p>Your order history will appear here after placing orders</p>
//               <button className="shop-now-btn" onClick={goToShop}>
//                 Start Shopping
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {showOrderModal && selectedOrder && (
//         <div className="history-order-modal-overlay">
//           <div className="history-order-modal">
//             <div className="history-modal-header">
//               <h3>Order Details</h3>
//               <button className="history-modal-close-btn" onClick={closeOrderModal}>
//                 ✕
//               </button>
//             </div>
            
//             <div className="history-modal-content">
//               <div className="history-order-info-section">
//                 <div className="history-info-row">
//                   <span className="history-info-label">Order ID:</span>
//                   <span className="history-info-value">
//                     {getOrderId(selectedOrder)}
//                   </span>
//                 </div>
//                 <div className="history-info-row">
//                   <span className="history-info-label">Order Date:</span>
//                   <span className="history-info-value">
//                     {formatDateTime(selectedOrder.createdAt || selectedOrder.orderDate)}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="history-order-items-section">
//                 <h4>Order Items</h4>
//                 <div className="history-order-items-table">
//                   <div className="history-table-header">
//                     <div className="history-table-col name">Product Name</div>
//                     <div className="history-table-col weight">Weight</div>
//                     <div className="history-table-col qty">Quantity</div>
//                     <div className="history-table-col price">Unit Price</div>
//                     <div className="history-table-col total">Total</div>
//                   </div>
                  
//                   {getOrderItems(selectedOrder).map((item, index) => {
//                     const itemName = item.name || item.productName || `Product ${index + 1}`;
//                     const itemWeight = item.weight || item.itemWeight || "1kg";
//                     const itemQty = item.qty || item.quantity || item.orderQty || 1;
//                     const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
//                     const itemTotal = itemPrice * itemQty;
                    
//                     return (
//                       <div key={index} className="history-table-row">
//                         <div className="history-table-col name">{itemName}</div>
//                         <div className="history-table-col weight">{itemWeight}</div>
//                         <div className="history-table-col qty">{itemQty}</div>
//                         <div className="history-table-col price">₹{itemPrice.toFixed(2)}</div>
//                         <div className="history-table-col total">
//                           ₹{itemTotal.toFixed(2)}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
              
//               <div className="history-order-summary-section">
//                 <div className="history-summary-row">
//                   <span>Subtotal:</span>
//                   <span>₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className="history-summary-row">
//                   <span>Shipping:</span>
//                   <span>₹0.00</span>
//                 </div>
//                 <div className="history-summary-row grand-total">
//                   <span>Total Amount:</span>
//                   <span className="history-grand-total">₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="history-modal-footer">
//               <button className="history-modal-close-button" onClick={closeOrderModal}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default History;








// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../utils/api";
// import "./History.css"; // We'll create this CSS file

// const History = () => {
//   const { dealerId } = useParams();
//   const navigate = useNavigate();
  
//   const [previousOrders, setPreviousOrders] = useState([]);
//   const [loadingOrders, setLoadingOrders] = useState(true);
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [refreshCounter, setRefreshCounter] = useState(0);

//   useEffect(() => {
//     const fetchPreviousOrders = async () => {
//       try {
//         setLoadingOrders(true);
//         const response = await api.get(`/api/orders/dealer/${dealerId}`);
        
//         const sortedOrders = response.data.sort((a, b) => 
//           new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate)
//         );
        
//         setPreviousOrders(sortedOrders);
//       } catch (error) {
//         console.error("Error fetching previous orders:", error);
//       } finally {
//         setLoadingOrders(false);
//       }
//     };

//     fetchPreviousOrders();
//   }, [dealerId, refreshCounter]);

//   const goToShop = () => {
//     navigate(`/dealer-shop/${dealerId}`);
//   };

//   const goToCart = () => {
//     navigate(`/cart/${dealerId}`);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const toggleOrderExpansion = (orderId) => {
//     if (expandedOrder === orderId) {
//       setExpandedOrder(null);
//     } else {
//       setExpandedOrder(orderId);
//     }
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowOrderModal(true);
//   };

//   const closeOrderModal = () => {
//     setShowOrderModal(false);
//     setSelectedOrder(null);
//   };

//   const getOrderItems = (order) => {
//     if (order.items && Array.isArray(order.items)) {
//       return order.items;
//     }
    
//     if (order.orderItems && Array.isArray(order.orderItems)) {
//       return order.orderItems;
//     }
    
//     return [];
//   };

//   const getOrderId = (order) => {
//     return order.orderNumber || 
//            order.orderId || 
//            order._id?.slice(-8) || 
//            `ORDER_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
//   };

//   return (
//     <div className="history-page-container">
//       <div className="history-page-header">
//         <h1>📋 Order History</h1>
//         <div className="header-actions">
//           <button className="back-to-shop-btn" onClick={goToShop}>
//             ← Back to Shop
//           </button>
//           <button className="view-cart-btn" onClick={goToCart}>
//             🛒 View Cart
//           </button>
//         </div>
//       </div>

//       <div className="history-content">
//         <div className="history-orders-section">
//           <h3 className="history-orders-title">Your Previous Orders</h3>
          
//           {loadingOrders ? (
//             <div className="loading-orders">
//               <div className="loading-spinner"></div>
//               <p>Loading your orders...</p>
//             </div>
//           ) : previousOrders.length > 0 ? (
//             <div className="history-orders-list">
//               {previousOrders.map((order, orderIndex) => {
//                 const orderId = order._id || order.orderId || orderIndex;
//                 const isExpanded = expandedOrder === orderId;
//                 const allItems = getOrderItems(order);
                
//                 return (
//                   <div key={orderId} className="history-order-card">
//                     <div className="history-order-header">
//                       <div className="history-order-info">
//                         <span className="history-order-id">Order #{getOrderId(order)}</span>
//                         <span className="history-order-date">{formatDate(order.createdAt || order.orderDate)}</span>
//                       </div>
//                       <button 
//                         className="history-view-order-btn"
//                         onClick={() => viewOrderDetails(order)}
//                       >
//                         View Details
//                       </button>
//                     </div>
                    
//                     <div className="history-order-items-preview">
//                       {(isExpanded ? allItems : allItems.slice(0, 3)).map((item, itemIndex) => {
//                         const itemName = item.name || item.productName || `Product ${itemIndex + 1}`;
//                         const itemWeight = item.weight || item.itemWeight || "1kg";
//                         const itemQty = item.qty || item.quantity || item.orderQty || 1;
//                         const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
//                         const itemTotal = itemPrice * itemQty;
                        
//                         return (
//                           <div key={itemIndex} className="history-order-item-preview">
//                             <span className="history-preview-name">{itemName}</span>
//                             <span className="history-preview-details">
//                               <span className="history-preview-weight">Weight: {itemWeight}</span>
//                               <span className="history-preview-qty">Qty: {itemQty}</span>
//                             </span>
//                             <span className="history-preview-price">₹{itemTotal.toFixed(2)}</span>
//                           </div>
//                         );
//                       })}
                      
//                       {allItems.length > 3 && (
//                         <div className="history-more-items-toggle">
//                           <button 
//                             className="history-toggle-items-btn"
//                             onClick={() => toggleOrderExpansion(orderId)}
//                           >
//                             {isExpanded ? 'Show Less' : `+${allItems.length - 3} more items`}
//                           </button>
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="history-order-footer">
//                       <div className="history-order-total">
//                         Total: <span className="history-total-amount">₹{(order.totalAmount || 0).toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="no-history-orders-message">
//               <div className="no-history-orders-icon">📭</div>
//               <h4>No order history found</h4>
//               <p>Your order history will appear here after placing orders</p>
//               <button className="shop-now-btn" onClick={goToShop}>
//                 Start Shopping
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {showOrderModal && selectedOrder && (
//         <div className="history-order-modal-overlay">
//           <div className="history-order-modal">
//             <div className="history-modal-header">
//               <h3>Order Details</h3>
//               <button className="history-modal-close-btn" onClick={closeOrderModal}>
//                 ✕
//               </button>
//             </div>
            
//             <div className="history-modal-content">
//               <div className="history-order-info-section">
//                 <div className="history-info-row">
//                   <span className="history-info-label">Order ID:</span>
//                   <span className="history-info-value">
//                     {getOrderId(selectedOrder)}
//                   </span>
//                 </div>
//                 <div className="history-info-row">
//                   <span className="history-info-label">Order Date:</span>
//                   <span className="history-info-value">
//                     {formatDateTime(selectedOrder.createdAt || selectedOrder.orderDate)}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="history-order-items-section">
//                 <h4>Order Items</h4>
//                 <div className="history-order-items-table">
//                   <div className="history-table-header">
//                     <div className="history-table-col name">Product Name</div>
//                     <div className="history-table-col weight">Weight</div>
//                     <div className="history-table-col qty">Quantity</div>
//                     <div className="history-table-col price">Unit Price</div>
//                     <div className="history-table-col total">Total</div>
//                   </div>
                  
//                   {getOrderItems(selectedOrder).map((item, index) => {
//                     const itemName = item.name || item.productName || `Product ${index + 1}`;
//                     const itemWeight = item.weight || item.itemWeight || "1kg";
//                     const itemQty = item.qty || item.quantity || item.orderQty || 1;
//                     const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
//                     const itemTotal = itemPrice * itemQty;
                    
//                     return (
//                       <div key={index} className="history-table-row">
//                         <div className="history-table-col name">{itemName}</div>
//                         <div className="history-table-col weight">{itemWeight}</div>
//                         <div className="history-table-col qty">{itemQty}</div>
//                         <div className="history-table-col price">₹{itemPrice.toFixed(2)}</div>
//                         <div className="history-table-col total">
//                           ₹{itemTotal.toFixed(2)}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
              
//               <div className="history-order-summary-section">
//                 <div className="history-summary-row">
//                   <span>Subtotal:</span>
//                   <span>₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className="history-summary-row">
//                   <span>Shipping:</span>
//                   <span>₹0.00</span>
//                 </div>
//                 <div className="history-summary-row grand-total">
//                   <span>Total Amount:</span>
//                   <span className="history-grand-total">₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="history-modal-footer">
//               <button className="history-modal-close-button" onClick={closeOrderModal}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default History;












import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "./History.css"; // We'll create this CSS file

// ✅ STEP 1: Helper function ADD करो (सबसे ऊपर)
const getUnitTypeLabel = (value = "1kg") => {
  if (value.toLowerCase().includes("kg") || value.toLowerCase().includes("gm")) {
    return "Weight";
  }
  if (value.toLowerCase().includes("l") || value.toLowerCase().includes("ml")) {
    return "Volume";
  }
  return "Quantity";
};

const History = () => {
  const { dealerId } = useParams();
  const navigate = useNavigate();
  
  const [previousOrders, setPreviousOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const fetchPreviousOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await api.get(`/api/orders/dealer/${dealerId}`);
        
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate)
        );
        
        setPreviousOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching previous orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchPreviousOrders();
  }, [dealerId, refreshCounter]);

  const goToShop = () => {
    navigate(`/dealer-shop/${dealerId}`);
  };

  const goToCart = () => {
    navigate(`/cart/${dealerId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const toggleOrderExpansion = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const getOrderItems = (order) => {
    if (order.items && Array.isArray(order.items)) {
      return order.items;
    }
    
    if (order.orderItems && Array.isArray(order.orderItems)) {
      return order.orderItems;
    }
    
    return [];
  };

  const getOrderId = (order) => {
    return order.orderNumber || 
           order.orderId || 
           order._id?.slice(-8) || 
           `ORDER_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  return (
    <div className="history-page-container">
      <div className="history-page-header">
        <h1>📋 Order History</h1>
        <div className="header-actions">
          <button className="back-to-shop-btn" onClick={goToShop}>
            ← Back to Shop
          </button>
          <button className="view-cart-btn" onClick={goToCart}>
            🛒 View Cart
          </button>
        </div>
      </div>

      <div className="history-content">
        <div className="history-orders-section">
          <h3 className="history-orders-title">Your Previous Orders</h3>
          
          {loadingOrders ? (
            <div className="loading-orders">
              <div className="loading-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : previousOrders.length > 0 ? (
            <div className="history-orders-list">
              {previousOrders.map((order, orderIndex) => {
                const orderId = order._id || order.orderId || orderIndex;
                const isExpanded = expandedOrder === orderId;
                const allItems = getOrderItems(order);
                
                return (
                  <div key={orderId} className="history-order-card">
                    <div className="history-order-header">
                      <div className="history-order-info">
                        <span className="history-order-id">Order #{getOrderId(order)}</span>
                        <span className="history-order-date">{formatDate(order.createdAt || order.orderDate)}</span>
                      </div>
                      <button 
                        className="history-view-order-btn"
                        onClick={() => viewOrderDetails(order)}
                      >
                        View Details
                      </button>
                    </div>
                    
                    <div className="history-order-items-preview">
                      {(isExpanded ? allItems : allItems.slice(0, 3)).map((item, itemIndex) => {
                        const itemName = item.name || item.productName || `Product ${itemIndex + 1}`;
                        // ✅ STEP 2: Order preview card (LIST VIEW) me change
                        const itemValue = item.weight || item.itemWeight || "1kg";
                        const itemQty = item.qty || item.quantity || item.orderQty || 1;
                        const unitLabel = getUnitTypeLabel(itemValue);
                        const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
                        const itemTotal = itemPrice * itemQty;
                        
                        return (
                          <div key={itemIndex} className="history-order-item-preview">
                            <span className="history-preview-name">{itemName}</span>
                            <span className="history-preview-details">
                              {/* ✅ NEW UI (🔥 EXACT AS YOU WANT) */}
                              <span className="history-preview-weight">
                                {unitLabel}: {itemValue}
                              </span>
                              <span className="history-preview-qty">
                                Qty: {itemQty}
                              </span>
                            </span>
                            <span className="history-preview-price">₹{itemTotal.toFixed(2)}</span>
                          </div>
                        );
                      })}
                      
                      {allItems.length > 3 && (
                        <div className="history-more-items-toggle">
                          <button 
                            className="history-toggle-items-btn"
                            onClick={() => toggleOrderExpansion(orderId)}
                          >
                            {isExpanded ? 'Show Less' : `+${allItems.length - 3} more items`}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="history-order-footer">
                      <div className="history-order-total">
                        Total: <span className="history-total-amount">₹{(order.totalAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-history-orders-message">
              <div className="no-history-orders-icon">📭</div>
              <h4>No order history found</h4>
              <p>Your order history will appear here after placing orders</p>
              <button className="shop-now-btn" onClick={goToShop}>
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {showOrderModal && selectedOrder && (
        <div className="history-order-modal-overlay">
          <div className="history-order-modal">
            <div className="history-modal-header">
              <h3>Order Details</h3>
              <button className="history-modal-close-btn" onClick={closeOrderModal}>
                ✕
              </button>
            </div>
            
            <div className="history-modal-content">
              <div className="history-order-info-section">
                <div className="history-info-row">
                  <span className="history-info-label">Order ID:</span>
                  <span className="history-info-value">
                    {getOrderId(selectedOrder)}
                  </span>
                </div>
                <div className="history-info-row">
                  <span className="history-info-label">Order Date:</span>
                  <span className="history-info-value">
                    {formatDateTime(selectedOrder.createdAt || selectedOrder.orderDate)}
                  </span>
                </div>
              </div>
              
              <div className="history-order-items-section">
                <h4>Order Items</h4>
                <div className="history-order-items-table">
                  <div className="history-table-header">
                    <div className="history-table-col name">Product Name</div>
                    {/* ✅ STEP 4: Table Header (recommended) */}
                    <div className="history-table-col weight">Weight / Volume</div>
                    <div className="history-table-col qty">Quantity</div>
                    <div className="history-table-col price">Unit Price</div>
                    <div className="history-table-col total">Total</div>
                  </div>
                  
                  {getOrderItems(selectedOrder).map((item, index) => {
                    const itemName = item.name || item.productName || `Product ${index + 1}`;
                    // ✅ STEP 3: Modal (DETAIL VIEW) table change
                    const itemValue = item.weight || item.itemWeight || "1kg";
                    const itemQty = item.qty || item.quantity || item.orderQty || 1;
                    const unitLabel = getUnitTypeLabel(itemValue);
                    const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
                    const itemTotal = itemPrice * itemQty;
                    
                    return (
                      <div key={index} className="history-table-row">
                        <div className="history-table-col name">{itemName}</div>
                        {/* ✅ NEW COLUMN */}
                        <div className="history-table-col weight">
                          {unitLabel}: {itemValue}
                        </div>
                        <div className="history-table-col qty">{itemQty}</div>
                        <div className="history-table-col price">₹{itemPrice.toFixed(2)}</div>
                        <div className="history-table-col total">
                          ₹{itemTotal.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="history-order-summary-section">
                <div className="history-summary-row">
                  <span>Subtotal:</span>
                  <span>₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="history-summary-row">
                  <span>Shipping:</span>
                  <span>₹0.00</span>
                </div>
                <div className="history-summary-row grand-total">
                  <span>Total Amount:</span>
                  <span className="history-grand-total">₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="history-modal-footer">
              <button className="history-modal-close-button" onClick={closeOrderModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;