












// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../utils/api";
// import "./Cart.css";

// const Cart = () => {
//   const { dealerId } = useParams();
//   const navigate = useNavigate();
  
//   // Initialize cart from localStorage
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });
  
//   const [previousOrders, setPreviousOrders] = useState([]);
//   const [loadingOrders, setLoadingOrders] = useState(true);
//   const [ordersRefresh, setOrdersRefresh] = useState(0);
  
//   const weightOptions = [
//     { label: "1kg", kg: 1 },
//     { label: "10kg", kg: 10 },
//     { label: "20kg", kg: 20 }
//   ];

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
//   }, [cart, dealerId]);

//   // Fetch previous orders
//   useEffect(() => {
//     const fetchPreviousOrders = async () => {
//       try {
//         setLoadingOrders(true);
//         const response = await api.get(`/api/orders/dealer/${dealerId}`);
//         setPreviousOrders(response.data);
//       } catch (error) {
//         console.error("Error fetching previous orders:", error);
//       } finally {
//         setLoadingOrders(false);
//       }
//     };

//     fetchPreviousOrders();
//   }, [dealerId, ordersRefresh]);

//   // Remove from cart
//   const removeFromCart = (index) => {
//     const updatedCart = cart.filter((_, i) => i !== index);
//     setCart(updatedCart);
//   };

//   // Update weight in cart
//   const updateWeight = (index, newWeight) => {
//     const updatedCart = [...cart];
//     const item = updatedCart[index];
    
//     // Calculate new price based on base price
//     const weightOption = weightOptions.find(w => w.label === newWeight);
//     const newPrice = item.basePrice * (weightOption?.kg || 1);
    
//     updatedCart[index] = {
//       ...item,
//       weight: newWeight,
//       price: newPrice
//     };
    
//     setCart(updatedCart);
//   };

//   // Update quantity in cart
//   const updateQuantity = (index, delta) => {
//     const updatedCart = [...cart];
//     const item = updatedCart[index];
    
//     const newQuantity = Math.max(1, item.quantity + delta);
    
//     updatedCart[index] = {
//       ...item,
//       quantity: newQuantity
//     };
    
//     setCart(updatedCart);
//   };

//   // Calculate total
//   const total = cart.reduce((sum, item) => {
//     return sum + (item.price * item.quantity);
//   }, 0);

//   // Place order
//   const placeOrder = async () => {
//     if (cart.length === 0) return alert("Cart empty");

//     try {
//       const orderItems = cart.map(item => ({
//         productId: item.id,
//         name: item.name,
//         price: item.price,
//         qty: item.quantity,
//         weight: item.weight
//       }));

//       await api.post("/api/orders", {
//         dealerId: dealerId,
//         items: orderItems,
//         totalAmount: Number(total.toFixed(2))
//       });

//       alert("Order placed successfully!");
      
//       // Clear cart after successful order
//       setCart([]);
//       localStorage.removeItem(`dealerCart_${dealerId}`);
      
//       setOrdersRefresh(prev => prev + 1);

//     } catch (error) {
//       console.error("Order error:", error);
//       alert("Order placement failed");
//     }
//   };

//   // Go back to shop
//   const goToShop = () => {
//     navigate(`/dealer-shop/${dealerId}`);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   return (
//     <div className="cart-page-container">
//       <div className="cart-page-header">
//         <h1>🛒 Your Shopping Cart</h1>
//         <div className="header-actions">
//           <button className="back-to-shop-btn" onClick={goToShop}>
//             ← Back to Shop
//           </button>
//           <span className="cart-count">{cart.length} items</span>
//         </div>
//       </div>

//       <div className="cart-page-content">
//         {/* Left side - Cart Items and Previous Orders */}
//         <div className="cart-items-section">
//           {cart.length === 0 ? (
//             <div className="empty-cart-message">
//               <div className="empty-cart-icon">🛒</div>
//               <h3>Your cart is empty</h3>
//               <p>Add products from the shop to get started</p>
//               <button className="shop-now-btn" onClick={goToShop}>
//                 Shop Now
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="cart-items-list">
//                 {cart.map((item, index) => (
//                   <div key={`${item.id}-${index}`} className="cart-item-card">
//                     <div className="cart-item-header">
//                       <div className="item-info">
//                         <h4 className="item-name">{item.name}</h4>
//                         <p className="item-base-price">Base: ₹{item.basePrice}/kg</p>
//                       </div>
//                       <button 
//                         className="remove-btn"
//                         onClick={() => removeFromCart(index)}
//                       >
//                         ✕ Remove
//                       </button>
//                     </div>
                    
//                     {/* Weight Selection */}
//                     <div className="cart-weight-selector">
//                       <label>Select Weight:</label>
//                       <div className="weight-buttons">
//                         {weightOptions.map(weightObj => (
//                           <button
//                             key={weightObj.label}
//                             className={`cart-weight-btn ${
//                               item.weight === weightObj.label ? 'active' : ''
//                             }`}
//                             onClick={() => updateWeight(index, weightObj.label)}
//                           >
//                             {weightObj.label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
                    
//                     {/* Quantity Controls */}
//                     <div className="quantity-controls">
//                       <span className="qty-label">Quantity:</span>
//                       <div className="qty-buttons">
//                         <button 
//                           className="qty-btn minus"
//                           onClick={() => updateQuantity(index, -1)}
//                         >
//                           −
//                         </button>
//                         <span className="qty-value">{item.quantity}</span>
//                         <button 
//                           className="qty-btn plus"
//                           onClick={() => updateQuantity(index, 1)}
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
                    
//                     {/* Price Display */}
//                     <div className="price-display">
//                       <div className="price-row">
//                         <span>Price per {item.weight}:</span>
//                         <span className="price-value">₹ {item.price.toFixed(2)}</span>
//                       </div>
//                       <div className="price-row total-row">
//                         <span>Total for this item:</span>
//                         <span className="total-value">₹ {(item.price * item.quantity).toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="cart-actions">
//                 <button 
//                   className="clear-cart-btn"
//                   onClick={() => {
//                     setCart([]);
//                     localStorage.removeItem(`dealerCart_${dealerId}`);
//                   }}
//                   disabled={cart.length === 0}
//                 >
//                   Clear All Items
//                 </button>
//               </div>
//             </>
//           )}
          
//           {/* Previous Orders Section */}
//           <div className="previous-orders-section">
//             <h3 className="previous-orders-title">📦 Previous Orders</h3>
            
//             {loadingOrders ? (
//               <div className="loading-orders">
//                 <div className="loading-spinner"></div>
//                 <p>Loading your orders...</p>
//               </div>
//             ) : previousOrders.length > 0 ? (
//               <div className="previous-orders-list">
//                 {previousOrders.map(order => (
//                   <div key={order._id || order.orderId} className="order-card">
//                     <div className="order-header">
//                       <div className="order-info">
//                         <span className="order-id">Order #{order.orderNumber || order._id?.slice(-6)}</span>
//                         <span className="order-date">{formatDate(order.createdAt || order.orderDate)}</span>
//                       </div>
//                     </div>
                    
//                     <div className="order-items-preview">
//                       {order.items?.slice(0, 2).map((item, index) => (
//                         <div key={index} className="order-item-preview">
//                           <span className="preview-name">{item.name}</span>
//                           <span className="preview-qty">{item.qty} × {item.weight}</span>
//                           <span className="preview-price">₹{(item.price * item.qty).toFixed(2)}</span>
//                         </div>
//                       ))}
//                       {order.items?.length > 2 && (
//                         <div className="more-items">
//                           +{order.items.length - 2} more items
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="order-footer">
//                       <div className="order-total">
//                         Total: <span className="total-amount">₹{order.totalAmount?.toFixed(2)}</span>
//                       </div>
//                       {/* <button 
//                         className="view-order-btn"
//                         onClick={() => navigate(`/order-details/${order._id || order.orderId}`)}
//                       >
//                         View Details
//                       </button> */}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="no-orders-message">
//                 <div className="no-orders-icon">📭</div>
//                 <h4>No previous orders found</h4>
//                 <p>Your order history will appear here</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right side - Order Summary */}
//         {cart.length > 0 && (
//           <div className="order-summary-section">
//             <div className="order-summary-card">
//               <h3>Order Summary</h3>
              
//               <div className="summary-items">
//                 {cart.map((item, index) => (
//                   <div key={index} className="summary-item">
//                     <div className="summary-item-name">
//                       {item.name} ({item.weight})
//                     </div>
//                     <div className="summary-item-qty">× {item.quantity}</div>
//                     <div className="summary-item-price">
//                       ₹ {(item.price * item.quantity).toFixed(2)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="summary-total">
//                 <div className="total-row">
//                   <span>Subtotal:</span>
//                   <span>₹ {total.toFixed(2)}</span>
//                 </div>
//                 <div className="total-row">
//                   <span>Shipping:</span>
//                   <span>₹ 0.00</span>
//                 </div>
//                 <div className="total-row grand-total">
//                   <span>Total Amount:</span>
//                   <span className="grand-total-amount">₹ {total.toFixed(2)}</span>
//                 </div>
//               </div>
              
//               <button 
//                 className="place-order-btn" 
//                 onClick={placeOrder}
//               >
//                 Place Order
//               </button>
              
//               <button 
//                 className="continue-shopping-btn"
//                 onClick={goToShop}
//               >
//                 Continue Shopping
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;



















// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../utils/api";
// import "./Cart.css";

// const Cart = () => {
//   const { dealerId } = useParams();
//   const navigate = useNavigate();
  
//   // Initialize cart from localStorage
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });
  
//   const [previousOrders, setPreviousOrders] = useState([]);
//   const [loadingOrders, setLoadingOrders] = useState(true);
//   const [ordersRefresh, setOrdersRefresh] = useState(0);
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
  
//   const weightOptions = [
//     { label: "1kg", kg: 1 },
//     { label: "10kg", kg: 10 },
//     { label: "20kg", kg: 20 }
//   ];

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
//   }, [cart, dealerId]);

//   // Fetch previous orders
//   useEffect(() => {
//     const fetchPreviousOrders = async () => {
//       try {
//         setLoadingOrders(true);
//         const response = await api.get(`/api/orders/dealer/${dealerId}`);
//         console.log("Previous Orders Response:", response.data); // Debugging
        
//         // Ensure orders are sorted by date (newest first)
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
//   }, [dealerId, ordersRefresh]);

//   // Remove from cart
//   const removeFromCart = (index) => {
//     const updatedCart = cart.filter((_, i) => i !== index);
//     setCart(updatedCart);
//   };

//   // Update weight in cart
//   const updateWeight = (index, newWeight) => {
//     const updatedCart = [...cart];
//     const item = updatedCart[index];
    
//     const weightOption = weightOptions.find(w => w.label === newWeight);
//     const newPrice = item.basePrice * (weightOption?.kg || 1);
    
//     updatedCart[index] = {
//       ...item,
//       weight: newWeight,
//       price: newPrice
//     };
    
//     setCart(updatedCart);
//   };

//   // Update quantity in cart
//   const updateQuantity = (index, delta) => {
//     const updatedCart = [...cart];
//     const item = updatedCart[index];
    
//     const newQuantity = Math.max(1, item.quantity + delta);
    
//     updatedCart[index] = {
//       ...item,
//       quantity: newQuantity
//     };
    
//     setCart(updatedCart);
//   };

//   // Calculate total
//   const total = cart.reduce((sum, item) => {
//     return sum + (item.price * item.quantity);
//   }, 0);

//   // Place order
//   const placeOrder = async () => {
//     if (cart.length === 0) return alert("Cart empty");

//     try {
//       const orderItems = cart.map(item => ({
//         productId: item.id,
//         name: item.name,
//         price: item.price,
//         qty: item.quantity,
//         weight: item.weight || "1kg"
//       }));

//       await api.post("/api/orders", {
//         dealerId: dealerId,
//         items: orderItems,
//         totalAmount: Number(total.toFixed(2))
//       });

//       alert("Order placed successfully!");
      
//       // Clear cart after successful order
//       setCart([]);
//       localStorage.removeItem(`dealerCart_${dealerId}`);
      
//       setOrdersRefresh(prev => prev + 1);

//     } catch (error) {
//       console.error("Order error:", error);
//       alert("Order placement failed");
//     }
//   };

//   // Go back to shop
//   const goToShop = () => {
//     navigate(`/dealer-shop/${dealerId}`);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Format date with time
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

//   // Toggle order expansion
//   const toggleOrderExpansion = (orderId) => {
//     if (expandedOrder === orderId) {
//       setExpandedOrder(null);
//     } else {
//       setExpandedOrder(orderId);
//     }
//   };

//   // View full order details
//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowOrderModal(true);
//   };

//   // Close order modal
//   const closeOrderModal = () => {
//     setShowOrderModal(false);
//     setSelectedOrder(null);
//   };

//   // Function to safely get order items
//   const getOrderItems = (order) => {
//     if (order.items && Array.isArray(order.items)) {
//       return order.items;
//     }
    
//     // If items is not in expected format, check for other possible formats
//     if (order.orderItems && Array.isArray(order.orderItems)) {
//       return order.orderItems;
//     }
    
//     // If no items found, return empty array
//     return [];
//   };

//   // Get order ID for display
//   const getOrderId = (order) => {
//     return order.orderNumber || 
//            order.orderId || 
//            order._id?.slice(-8) || 
//            `ORDER_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
//   };

//   return (
//     <div className="cart-page-container">
//       <div className="cart-page-header">
//         <h1>🛒 Your Shopping Cart</h1>
//         <div className="header-actions">
//           <button className="back-to-shop-btn" onClick={goToShop}>
//             ← Back to Shop
//           </button>
//           <span className="cart-count">{cart.length} items</span>
//         </div>
//       </div>

//       <div className="cart-page-content">
//         {/* Left side - Cart Items and Previous Orders */}
//         <div className="cart-items-section">
//           {cart.length === 0 ? (
//             <div className="empty-cart-message">
//               <div className="empty-cart-icon">🛒</div>
//               <h3>Your cart is empty</h3>
//               <p>Add products from the shop to get started</p>
//               <button className="shop-now-btn" onClick={goToShop}>
//                 Shop Now
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="cart-items-list">
//                 {cart.map((item, index) => (
//                   <div key={`${item.id}-${index}`} className="cart-item-card">
//                     <div className="cart-item-header">
//                       <div className="item-info">
//                         <h4 className="item-name">{item.name}</h4>
//                         <p className="item-base-price">Base: ₹{item.basePrice}/kg</p>
//                       </div>
//                       <button 
//                         className="remove-btn"
//                         onClick={() => removeFromCart(index)}
//                       >
//                         ✕ Remove
//                       </button>
//                     </div>
                    
//                     {/* Weight Selection */}
//                     <div className="cart-weight-selector">
//                       <label>Select Weight:</label>
//                       <div className="weight-buttons">
//                         {weightOptions.map(weightObj => (
//                           <button
//                             key={weightObj.label}
//                             className={`cart-weight-btn ${
//                               item.weight === weightObj.label ? 'active' : ''
//                             }`}
//                             onClick={() => updateWeight(index, weightObj.label)}
//                           >
//                             {weightObj.label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
                    
//                     {/* Quantity Controls */}
//                     <div className="quantity-controls">
//                       <span className="qty-label">Quantity:</span>
//                       <div className="qty-buttons">
//                         <button 
//                           className="qty-btn minus"
//                           onClick={() => updateQuantity(index, -1)}
//                         >
//                           −
//                         </button>
//                         <span className="qty-value">{item.quantity}</span>
//                         <button 
//                           className="qty-btn plus"
//                           onClick={() => updateQuantity(index, 1)}
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
                    
//                     {/* Price Display */}
//                     <div className="price-display">
//                       <div className="price-row">
//                         <span>Price per {item.weight}:</span>
//                         <span className="price-value">₹ {item.price.toFixed(2)}</span>
//                       </div>
//                       <div className="price-row total-row">
//                         <span>Total for this item:</span>
//                         <span className="total-value">₹ {(item.price * item.quantity).toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="cart-actions">
//                 <button 
//                   className="clear-cart-btn"
//                   onClick={() => {
//                     setCart([]);
//                     localStorage.removeItem(`dealerCart_${dealerId}`);
//                   }}
//                   disabled={cart.length === 0}
//                 >
//                   Clear All Items
//                 </button>
//               </div>
//             </>
//           )}
          
//           {/* Previous Orders Section - FIXED */}
//           <div className="previous-orders-section">
//             <h3 className="previous-orders-title">📦 Previous Orders</h3>
            
//             {loadingOrders ? (
//               <div className="loading-orders">
//                 <div className="loading-spinner"></div>
//                 <p>Loading your orders...</p>
//               </div>
//             ) : previousOrders.length > 0 ? (
//               <div className="previous-orders-list">
//                 {previousOrders.map((order, orderIndex) => {
//                   const orderId = order._id || order.orderId || orderIndex;
//                   const isExpanded = expandedOrder === orderId;
//                   const allItems = getOrderItems(order);
                  
//                   return (
//                     <div key={orderId} className="order-card">
//                       <div className="order-header">
//                         <div className="order-info">
//                           <span className="order-id">Order #{getOrderId(order)}</span>
//                           <span className="order-date">{formatDate(order.createdAt || order.orderDate)}</span>
//                         </div>
//                         <button 
//                           className="view-order-btn"
//                           onClick={() => viewOrderDetails(order)}
//                         >
//                           View Details
//                         </button>
//                       </div>
                      
//                       <div className="order-items-preview">
//                         {/* Show all items if expanded, otherwise show first 3 */}
//                         {(isExpanded ? allItems : allItems.slice(0, 3)).map((item, itemIndex) => {
//                           // Safely get item properties
//                           const itemName = item.name || item.productName || `Product ${itemIndex + 1}`;
//                           const itemWeight = item.weight || item.itemWeight || "1kg";
//                           const itemQty = item.qty || item.quantity || item.orderQty || 1;
//                           const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
//                           const itemTotal = itemPrice * itemQty;
                          
//                           return (
//                             <div key={itemIndex} className="order-item-preview">
//                               <span className="preview-name">{itemName}</span>
//                               <span className="preview-details">
//                                 <span className="preview-weight">Weight: {itemWeight}</span>
//                                 <span className="preview-qty">Qty: {itemQty}</span>
//                               </span>
//                               <span className="preview-price">₹{itemTotal.toFixed(2)}</span>
//                             </div>
//                           );
//                         })}
                        
//                         {/* Show toggle button if there are more than 3 items */}
//                         {allItems.length > 3 && (
//                           <div className="more-items-toggle">
//                             <button 
//                               className="toggle-items-btn"
//                               onClick={() => toggleOrderExpansion(orderId)}
//                             >
//                               {isExpanded ? 'Show Less' : `+${allItems.length - 3} more items`}
//                             </button>
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="order-footer">
//                         <div className="order-total">
//                           Total: <span className="total-amount">₹{(order.totalAmount || 0).toFixed(2)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="no-orders-message">
//                 <div className="no-orders-icon">📭</div>
//                 <h4>No previous orders found</h4>
//                 <p>Your order history will appear here</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right side - Order Summary */}
//         {cart.length > 0 && (
//           <div className="order-summary-section">
//             <div className="order-summary-card">
//               <h3>Order Summary</h3>
              
//               <div className="summary-items">
//                 {cart.map((item, index) => (
//                   <div key={index} className="summary-item">
//                     <div className="summary-item-name">
//                       {item.name} ({item.weight})
//                     </div>
//                     <div className="summary-item-qty">× {item.quantity}</div>
//                     <div className="summary-item-price">
//                       ₹ {(item.price * item.quantity).toFixed(2)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="summary-total">
//                 <div className="total-row">
//                   <span>Subtotal:</span>
//                   <span>₹ {total.toFixed(2)}</span>
//                 </div>
//                 <div className="total-row">
//                   <span>Shipping:</span>
//                   <span>₹ 0.00</span>
//                 </div>
//                 <div className="total-row grand-total">
//                   <span>Total Amount:</span>
//                   <span className="grand-total-amount">₹ {total.toFixed(2)}</span>
//                 </div>
//               </div>
              
//               <button 
//                 className="place-order-btn" 
//                 onClick={placeOrder}
//               >
//                 Place Order
//               </button>
              
//               <button 
//                 className="continue-shopping-btn"
//                 onClick={goToShop}
//               >
//                 Continue Shopping
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Order Details Modal - FIXED */}
//       {showOrderModal && selectedOrder && (
//         <div className="order-modal-overlay">
//           <div className="order-modal">
//             <div className="modal-header">
//               <h3>Order Details</h3>
//               <button className="modal-close-btn" onClick={closeOrderModal}>
//                 ✕
//               </button>
//             </div>
            
//             <div className="modal-content">
//               <div className="order-info-section">
//                 <div className="info-row">
//                   <span className="info-label">Order ID:</span>
//                   <span className="info-value">
//                     {getOrderId(selectedOrder)}
//                   </span>
//                 </div>
//                 <div className="info-row">
//                   <span className="info-label">Order Date:</span>
//                   <span className="info-value">
//                     {formatDateTime(selectedOrder.createdAt || selectedOrder.orderDate)}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="order-items-section">
//                 <h4>Order Items</h4>
//                 <div className="order-items-table">
//                   <div className="table-header">
//                     <div className="table-col name">Product Name</div>
//                     <div className="table-col weight">Weight</div>
//                     <div className="table-col qty">Quantity</div>
//                     <div className="table-col price">Unit Price</div>
//                     <div className="table-col total">Total</div>
//                   </div>
                  
//                   {getOrderItems(selectedOrder).map((item, index) => {
//                     // Safely get item properties
//                     const itemName = item.name || item.productName || `Product ${index + 1}`;
//                     const itemWeight = item.weight || item.itemWeight || "1kg";
//                     const itemQty = item.qty || item.quantity || item.orderQty || 1;
//                     const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
//                     const itemTotal = itemPrice * itemQty;
                    
//                     return (
//                       <div key={index} className="table-row">
//                         <div className="table-col name">{itemName}</div>
//                         <div className="table-col weight">{itemWeight}</div>
//                         <div className="table-col qty">{itemQty}</div>
//                         <div className="table-col price">₹{itemPrice.toFixed(2)}</div>
//                         <div className="table-col total">
//                           ₹{itemTotal.toFixed(2)}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
              
//               <div className="order-summary-section">
//                 <div className="summary-row">
//                   <span>Subtotal:</span>
//                   <span>₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className="summary-row">
//                   <span>Shipping:</span>
//                   <span>₹0.00</span>
//                 </div>
//                 <div className="summary-row grand-total">
//                   <span>Total Amount:</span>
//                   <span className="grand-total">₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="modal-footer">
//               <button className="modal-close-button" onClick={closeOrderModal}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

















import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "./Cart.css";

const Cart = () => {
  const { dealerId } = useParams();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [previousOrders, setPreviousOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersRefresh, setOrdersRefresh] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  const weightOptions = [
    { label: "1kg", kg: 1 },
    { label: "10kg", kg: 10 },
    { label: "20kg", kg: 20 }
  ];

  useEffect(() => {
    localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
  }, [cart, dealerId]);

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
  }, [dealerId, ordersRefresh]);

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const updateWeight = (index, newWeight) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    
    const weightOption = weightOptions.find(w => w.label === newWeight);
    const newPrice = item.basePrice * (weightOption?.kg || 1);
    
    updatedCart[index] = {
      ...item,
      weight: newWeight,
      weightKg: weightOption?.kg || 1, // ✅ Store weight in kg also
      price: newPrice
    };
    
    setCart(updatedCart);
  };

  const updateQuantity = (index, delta) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    
    const newQuantity = Math.max(1, item.quantity + delta);
    
    updatedCart[index] = {
      ...item,
      quantity: newQuantity
    };
    
    setCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // ✅ FIXED: Include weight in order placement
  const placeOrder = async () => {
    if (cart.length === 0) return alert("Cart empty");

    try {
      const orderItems = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        weight: item.weight || "1kg", // ✅ Send weight
        weightKg: item.weightKg || 1 // ✅ Send weight in kg
      }));

      await api.post("/api/orders", {
        dealerId: dealerId,
        items: orderItems,
        totalAmount: Number(total.toFixed(2))
      });

      alert("Order placed successfully!");
      
      setCart([]);
      localStorage.removeItem(`dealerCart_${dealerId}`);
      setOrdersRefresh(prev => prev + 1);

    } catch (error) {
      console.error("Order error:", error);
      alert("Order placement failed");
    }
  };

  const goToShop = () => {
    navigate(`/dealer-shop/${dealerId}`);
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
    <div className="cart-page-container">
      <div className="cart-page-header">
        <h1>🛒 Your Shopping Cart</h1>
        <div className="header-actions">
          <button className="back-to-shop-btn" onClick={goToShop}>
            ← Back to Shop
          </button>
          <span className="cart-count">{cart.length} items</span>
        </div>
      </div>

      <div className="cart-page-content">
        <div className="cart-items-section">
          {cart.length === 0 ? (
            <div className="empty-cart-message">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add products from the shop to get started</p>
              <button className="shop-now-btn" onClick={goToShop}>
                Shop Now
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="cart-item-card">
                    <div className="cart-item-header">
                      <div className="item-info">
                        <h4 className="item-name">{item.name}</h4>
                        <p className="item-base-price">Base: ₹{item.basePrice}/kg</p>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(index)}
                      >
                        ✕ Remove
                      </button>
                    </div>
                    
                    <div className="cart-weight-selector">
                      <label>Select Weight:</label>
                      <div className="weight-buttons">
                        {weightOptions.map(weightObj => (
                          <button
                            key={weightObj.label}
                            className={`cart-weight-btn ${
                              item.weight === weightObj.label ? 'active' : ''
                            }`}
                            onClick={() => updateWeight(index, weightObj.label)}
                          >
                            {weightObj.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="quantity-controls">
                      <span className="qty-label">Quantity:</span>
                      <div className="qty-buttons">
                        <button 
                          className="qty-btn minus"
                          onClick={() => updateQuantity(index, -1)}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                          className="qty-btn plus"
                          onClick={() => updateQuantity(index, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="price-display">
                      <div className="price-row">
                        <span>Price per {item.weight}:</span>
                        <span className="price-value">₹ {item.price.toFixed(2)}</span>
                      </div>
                      <div className="price-row total-row">
                        <span>Total for this item:</span>
                        <span className="total-value">₹ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-actions">
                <button 
                  className="clear-cart-btn"
                  onClick={() => {
                    setCart([]);
                    localStorage.removeItem(`dealerCart_${dealerId}`);
                  }}
                  disabled={cart.length === 0}
                >
                  Clear All Items
                </button>
              </div>
            </>
          )}
          
          <div className="previous-orders-section">
            <h3 className="previous-orders-title">📦 Previous Orders</h3>
            
            {loadingOrders ? (
              <div className="loading-orders">
                <div className="loading-spinner"></div>
                <p>Loading your orders...</p>
              </div>
            ) : previousOrders.length > 0 ? (
              <div className="previous-orders-list">
                {previousOrders.map((order, orderIndex) => {
                  const orderId = order._id || order.orderId || orderIndex;
                  const isExpanded = expandedOrder === orderId;
                  const allItems = getOrderItems(order);
                  
                  return (
                    <div key={orderId} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <span className="order-id">Order #{getOrderId(order)}</span>
                          <span className="order-date">{formatDate(order.createdAt || order.orderDate)}</span>
                        </div>
                        <button 
                          className="view-order-btn"
                          onClick={() => viewOrderDetails(order)}
                        >
                          View Details
                        </button>
                      </div>
                      
                      <div className="order-items-preview">
                        {(isExpanded ? allItems : allItems.slice(0, 3)).map((item, itemIndex) => {
                          const itemName = item.name || item.productName || `Product ${itemIndex + 1}`;
                          const itemWeight = item.weight || item.itemWeight || "1kg"; // ✅ Now shows actual weight
                          const itemQty = item.qty || item.quantity || item.orderQty || 1;
                          const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
                          const itemTotal = itemPrice * itemQty;
                          
                          return (
                            <div key={itemIndex} className="order-item-preview">
                              <span className="preview-name">{itemName}</span>
                              <span className="preview-details">
                                <span className="preview-weight">Weight: {itemWeight}</span>
                                <span className="preview-qty">Qty: {itemQty}</span>
                              </span>
                              <span className="preview-price">₹{itemTotal.toFixed(2)}</span>
                            </div>
                          );
                        })}
                        
                        {allItems.length > 3 && (
                          <div className="more-items-toggle">
                            <button 
                              className="toggle-items-btn"
                              onClick={() => toggleOrderExpansion(orderId)}
                            >
                              {isExpanded ? 'Show Less' : `+${allItems.length - 3} more items`}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="order-footer">
                        <div className="order-total">
                          Total: <span className="total-amount">₹{(order.totalAmount || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-orders-message">
                <div className="no-orders-icon">📭</div>
                <h4>No previous orders found</h4>
                <p>Your order history will appear here</p>
              </div>
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cart.map((item, index) => (
                  <div key={index} className="summary-item">
                    <div className="summary-item-name">
                      {item.name} ({item.weight}) {/* ✅ Shows selected weight */}
                    </div>
                    <div className="summary-item-qty">× {item.quantity}</div>
                    <div className="summary-item-price">
                      ₹ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="summary-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹ {total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>₹ 0.00</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total Amount:</span>
                  <span className="grand-total-amount">₹ {total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                className="place-order-btn" 
                onClick={placeOrder}
              >
                Place Order
              </button>
              
              <button 
                className="continue-shopping-btn"
                onClick={goToShop}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      {showOrderModal && selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <div className="modal-header">
              <h3>Order Details</h3>
              <button className="modal-close-btn" onClick={closeOrderModal}>
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="order-info-section">
                <div className="info-row">
                  <span className="info-label">Order ID:</span>
                  <span className="info-value">
                    {getOrderId(selectedOrder)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Order Date:</span>
                  <span className="info-value">
                    {formatDateTime(selectedOrder.createdAt || selectedOrder.orderDate)}
                  </span>
                </div>
              </div>
              
              <div className="order-items-section">
                <h4>Order Items</h4>
                <div className="order-items-table">
                  <div className="table-header">
                    <div className="table-col name">Product Name</div>
                    <div className="table-col weight">Weight</div> {/* ✅ Shows weight column */}
                    <div className="table-col qty">Quantity</div>
                    <div className="table-col price">Unit Price</div>
                    <div className="table-col total">Total</div>
                  </div>
                  
                  {getOrderItems(selectedOrder).map((item, index) => {
                    const itemName = item.name || item.productName || `Product ${index + 1}`;
                    const itemWeight = item.weight || item.itemWeight || "1kg"; // ✅ Shows actual weight
                    const itemQty = item.qty || item.quantity || item.orderQty || 1;
                    const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
                    const itemTotal = itemPrice * itemQty;
                    
                    return (
                      <div key={index} className="table-row">
                        <div className="table-col name">{itemName}</div>
                        <div className="table-col weight">{itemWeight}</div> {/* ✅ Weight displayed here */}
                        <div className="table-col qty">{itemQty}</div>
                        <div className="table-col price">₹{itemPrice.toFixed(2)}</div>
                        <div className="table-col total">
                          ₹{itemTotal.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="order-summary-section">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>₹0.00</span>
                </div>
                <div className="summary-row grand-total">
                  <span>Total Amount:</span>
                  <span className="grand-total">₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-close-button" onClick={closeOrderModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;