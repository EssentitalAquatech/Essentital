


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

//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const weightOptions = [
//     { label: "1kg", kg: 1 },
//     { label: "10kg", kg: 10 },
//     { label: "20kg", kg: 20 }
//   ];

//   useEffect(() => {
//     localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
//   }, [cart, dealerId]);

//   const removeFromCart = (index) => {
//     const updatedCart = cart.filter((_, i) => i !== index);
//     setCart(updatedCart);
//   };

//   const updateWeight = (index, newWeight) => {
//     const updatedCart = [...cart];
//     const item = updatedCart[index];

//     const weightOption = weightOptions.find(w => w.label === newWeight);
//     const newPrice = item.basePrice * (weightOption?.kg || 1);

//     updatedCart[index] = {
//       ...item,
//       weight: newWeight,
//       weightKg: weightOption?.kg || 1,
//       price: newPrice
//     };

//     setCart(updatedCart);
//   };

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

//   const total = cart.reduce((sum, item) => {
//     return sum + item.price * item.quantity;
//   }, 0);

//   const placeOrder = async () => {
//     if (cart.length === 0) return alert("Cart empty");

//     try {
//       const orderItems = cart.map(item => ({
//         productId: item.id,
//         name: item.name,
//         price: item.price,
//         qty: item.quantity,
//         weight: item.weight || "1kg",
//         weightKg: item.weightKg || 1
//       }));

//       await api.post("/api/orders", {
//         dealerId,
//         items: orderItems,
//         totalAmount: Number(total.toFixed(2))
//       });

//       alert("Order placed successfully!");
//       setCart([]);
//       localStorage.removeItem(`dealerCart_${dealerId}`);
//     } catch (error) {
//       console.error("Order error:", error);
//       alert("Order placement failed");
//     }
//   };

//   const goToShop = () => {
//     navigate(`/dealer-shop/${dealerId}`);
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
//                         <p className="item-base-price">
//                           Base: ₹{item.basePrice}/kg
//                         </p>
//                       </div>
//                       <button
//                         className="remove-btn"
//                         onClick={() => removeFromCart(index)}
//                       >
//                         ✕ Remove
//                       </button>
//                     </div>

//                     <div className="cart-weight-selector">
//                       <label>Select Weight:</label>
//                       <div className="weight-buttons">
//                         {weightOptions.map(weightObj => (
//                           <button
//                             key={weightObj.label}
//                             className={`cart-weight-btn ${
//                               item.weight === weightObj.label ? "active" : ""
//                             }`}
//                             onClick={() =>
//                               updateWeight(index, weightObj.label)
//                             }
//                           >
//                             {weightObj.label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

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

//                     <div className="price-display">
//                       <div className="price-row">
//                         <span>Price per {item.weight}:</span>
//                         <span className="price-value">
//                           ₹ {item.price.toFixed(2)}
//                         </span>
//                       </div>
//                       <div className="price-row total-row">
//                         <span>Total for this item:</span>
//                         <span className="total-value">
//                           ₹ {(item.price * item.quantity).toFixed(2)}
//                         </span>
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
//                 >
//                   Clear All Items
//                 </button>
//               </div>
//             </>
//           )}
//         </div>

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
//                   <span>Total Amount:</span>
//                   <span className="grand-total-amount">
//                     ₹ {total.toFixed(2)}
//                   </span>
//                 </div>
//               </div>

//               <button className="place-order-btn" onClick={placeOrder}>
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

//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const [searchTerm, setSearchTerm] = useState("");

//   const weightOptions = [
//     { label: "1kg", kg: 1 },
//     { label: "10kg", kg: 10 },
//     { label: "20kg", kg: 20 }
//   ];

//   useEffect(() => {
//     localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
//   }, [cart, dealerId]);

//   const removeFromCart = (index) => {
//     const updatedCart = cart.filter((_, i) => i !== index);
//     setCart(updatedCart);
//   };

//   const updateWeight = (index, newWeight) => {
//     const updatedCart = [...cart];
//     const item = updatedCart[index];

//     const weightOption = weightOptions.find(w => w.label === newWeight);
//     const newPrice = item.basePrice * (weightOption?.kg || 1);

//     updatedCart[index] = {
//       ...item,
//       weight: newWeight,
//       weightKg: weightOption?.kg || 1,
//       price: newPrice
//     };

//     setCart(updatedCart);
//   };

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

//   const filteredCart = cart.filter(item =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const total = filteredCart.reduce((sum, item) => {
//     return sum + item.price * item.quantity;
//   }, 0);

//   const clearSearch = () => {
//     setSearchTerm("");
//   };

//   const placeOrder = async () => {
//     if (cart.length === 0) return alert("Cart empty");

//     try {
//       const orderItems = cart.map(item => ({
//         productId: item.id,
//         name: item.name,
//         price: item.price,
//         qty: item.quantity,
//         weight: item.weight || "1kg",
//         weightKg: item.weightKg || 1
//       }));

//       await api.post("/api/orders", {
//         dealerId,
//         items: orderItems,
//         totalAmount: Number(total.toFixed(2))
//       });

//       alert("Order placed successfully!");
//       setCart([]);
//       localStorage.removeItem(`dealerCart_${dealerId}`);
//     } catch (error) {
//       console.error("Order error:", error);
//       alert("Order placement failed");
//     }
//   };

//   const goToShop = () => {
//     navigate(`/dealer-shop/${dealerId}`);
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

//       {cart.length > 0 && (
//         <div className="search-container">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search items in cart..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//             {searchTerm && (
//               <button className="clear-search-btn" onClick={clearSearch}>
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="cart-page-content">
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
//                 {filteredCart.length === 0 ? (
//                   <div className="no-results">
//                     <p>No items found for "{searchTerm}"</p>
//                     <button className="clear-search-btn-large" onClick={clearSearch}>
//                       Clear Search
//                     </button>
//                   </div>
//                 ) : (
//                   filteredCart.map((item, index) => (
//                     <div key={`${item.id}-${index}`} className="cart-item-card">
//                       <div className="cart-item-header">
//                         <div className="item-info">
//                           <h4 className="item-name">{item.name}</h4>
//                           <p className="item-base-price">
//                             Base: ₹{item.basePrice}/kg
//                           </p>
//                         </div>
//                         <button
//                           className="remove-btn"
//                           onClick={() => removeFromCart(index)}
//                         >
//                           ✕ Remove
//                         </button>
//                       </div>

//                       <div className="cart-weight-selector">
//                         <label>Select Weight:</label>
//                         <div className="weight-buttons">
//                           {weightOptions.map(weightObj => (
//                             <button
//                               key={weightObj.label}
//                               className={`cart-weight-btn ${
//                                 item.weight === weightObj.label ? "active" : ""
//                               }`}
//                               onClick={() =>
//                                 updateWeight(index, weightObj.label)
//                               }
//                             >
//                               {weightObj.label}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="quantity-controls">
//                         <span className="qty-label">Quantity:</span>
//                         <div className="qty-buttons">
//                           <button
//                             className="qty-btn minus"
//                             onClick={() => updateQuantity(index, -1)}
//                           >
//                             −
//                           </button>
//                           <span className="qty-value">{item.quantity}</span>
//                           <button
//                             className="qty-btn plus"
//                             onClick={() => updateQuantity(index, 1)}
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>

//                       <div className="price-display">
//                         <div className="price-row">
//                           <span>Price per {item.weight}:</span>
//                           <span className="price-value">
//                             ₹ {item.price.toFixed(2)}
//                           </span>
//                         </div>
//                         <div className="price-row total-row">
//                           <span>Total for this item:</span>
//                           <span className="total-value">
//                             ₹ {(item.price * item.quantity).toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               <div className="cart-actions">
//                 <button
//                   className="clear-cart-btn"
//                   onClick={() => {
//                     setCart([]);
//                     localStorage.removeItem(`dealerCart_${dealerId}`);
//                   }}
//                 >
//                   Clear All Items
//                 </button>
//               </div>
//             </>
//           )}
//         </div>

//         {filteredCart.length > 0 && (
//           <div className="order-summary-section">
//             <div className="order-summary-card">
//               <h3>Order Summary</h3>

//               <div className="summary-items">
//                 {filteredCart.map((item, index) => (
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
//                   <span>Total Amount:</span>
//                   <span className="grand-total-amount">
//                     ₹ {total.toFixed(2)}
//                   </span>
//                 </div>
//               </div>

//               <button className="place-order-btn" onClick={placeOrder}>
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

//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const weightOptions = [
//     { label: "1kg", kg: 1 },
//     { label: "10kg", kg: 10 },
//     { label: "20kg", kg: 20 }
//   ];

//   useEffect(() => {
//     localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
//   }, [cart, dealerId]);

//   const removeFromCart = (index) => {
//     const updatedCart = cart.filter((_, i) => i !== index);
//     setCart(updatedCart);
//   };

//   const updateWeight = (index, newWeight) => {
//     const updatedCart = [...cart];
//     const item = updatedCart[index];

//     const weightOption = weightOptions.find(w => w.label === newWeight);
//     const newPrice = item.basePrice * (weightOption?.kg || 1);

//     updatedCart[index] = {
//       ...item,
//       weight: newWeight,
//       weightKg: weightOption?.kg || 1,
//       price: newPrice
//     };

//     setCart(updatedCart);
//   };

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

//   const total = cart.reduce((sum, item) => {
//     return sum + item.price * item.quantity;
//   }, 0);

//   const placeOrder = async () => {
//     if (cart.length === 0) return alert("Cart empty");

//     try {
//       const orderItems = cart.map(item => ({
//         productId: item.id,
//         name: item.name,
//         price: item.price,
//         qty: item.quantity,
//         weight: item.weight || "1kg",
//         weightKg: item.weightKg || 1
//       }));

//       await api.post("/api/orders", {
//         dealerId,
//         items: orderItems,
//         totalAmount: Number(total.toFixed(2))
//       });

//       alert("Order placed successfully!");
//       setCart([]);
//       localStorage.removeItem(`dealerCart_${dealerId}`);
//     } catch (error) {
//       console.error("Order error:", error);
//       alert("Order placement failed");
//     }
//   };

//   const goToShop = () => {
//     navigate(`/dealer-shop/${dealerId}`);
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
//                         <p className="item-base-price">
//                           Base: ₹{item.basePrice}/kg
//                         </p>
//                       </div>
//                       <button
//                         className="remove-btn"
//                         onClick={() => removeFromCart(index)}
//                       >
//                         ✕ Remove
//                       </button>
//                     </div>

//                     <div className="cart-weight-selector">
//                       <label>Select Weight:</label>
//                       <div className="weight-buttons">
//                         {weightOptions.map(weightObj => (
//                           <button
//                             key={weightObj.label}
//                             className={`cart-weight-btn ${
//                               item.weight === weightObj.label ? "active" : ""
//                             }`}
//                             onClick={() =>
//                               updateWeight(index, weightObj.label)
//                             }
//                           >
//                             {weightObj.label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

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

//                     <div className="price-display">
//                       <div className="price-row">
//                         <span>Price per {item.weight || "1kg"}:</span>
//                         <span className="price-value">
//                           ₹ {item.price.toFixed(2)}
//                         </span>
//                       </div>
//                       <div className="price-row total-row">
//                         <span>Total for this item:</span>
//                         <span className="total-value">
//                           ₹ {(item.price * item.quantity).toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="cart-actions">
//                 <button
//                   className="clear-cart-btn"
//                   onClick={() => {
//                     if (window.confirm("Are you sure you want to clear all items from cart?")) {
//                       setCart([]);
//                       localStorage.removeItem(`dealerCart_${dealerId}`);
//                     }
//                   }}
//                 >
//                   Clear All Items
//                 </button>
//               </div>
//             </>
//           )}
//         </div>

//         {cart.length > 0 && (
//           <div className="order-summary-section">
//             <div className="order-summary-card">
//               <h3>Order Summary</h3>

//               <div className="summary-items">
//                 {cart.map((item, index) => (
//                   <div key={`${item.id}-${index}`} className="summary-item">
//                     <div className="summary-item-name">
//                       {item.name} ({item.weight || "1kg"})
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
//                   <span>Total Amount:</span>
//                   <span className="grand-total-amount">
//                     ₹ {total.toFixed(2)}
//                   </span>
//                 </div>
//               </div>

//               <button className="place-order-btn" onClick={placeOrder}>
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

  const [searchTerm, setSearchTerm] = useState("");

  const weightOptions = [
    { label: "1kg", kg: 1 },
    { label: "10kg", kg: 10 },
    { label: "20kg", kg: 20 }
  ];

  useEffect(() => {
    localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
  }, [cart, dealerId]);

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
      weightKg: weightOption?.kg || 1,
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

  const filteredCart = cart.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = filteredCart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return alert("Cart empty");

    try {
      const orderItems = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        weight: item.weight || "1kg",
        weightKg: item.weightKg || 1
      }));

      await api.post("/api/orders", {
        dealerId,
        items: orderItems,
        totalAmount: Number(total.toFixed(2))
      });

      alert("Order placed successfully!");
      setCart([]);
      localStorage.removeItem(`dealerCart_${dealerId}`);
    } catch (error) {
      console.error("Order error:", error);
      alert("Order placement failed");
    }
  };

  const goToShop = () => {
    navigate(`/dealer-shop/${dealerId}`);
  };

  const goToHistory = () => {
    navigate(`/order-history/${dealerId}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="cart-page-container">
      {/* Top Navigation Bar */}
      <div className="cart-top-navigation">
        <div className="cart-nav-left">
          <button className="nav-history-btn" onClick={goToHistory}>
            📋 History
          </button>
          <div className="nav-search-box">
            <input
              type="text"
              placeholder="Search items in cart..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="nav-search-input"
            />
            <button className="nav-search-btn" onClick={() => setSearchTerm(searchTerm)}>
              🔍
            </button>
            {searchTerm && (
              <button className="nav-clear-search" onClick={clearSearch}>
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className="cart-nav-right">
          <button className="nav-view-cart-btn" onClick={() => navigate(`/cart/${dealerId}`)}>
            🛒 View Cart ({cart.length})
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="cart-page-header">
        <h1>🛒 Your Shopping Cart</h1>
        <div className="header-actions">
          <button className="back-to-shop-btn" onClick={goToShop}>
            ← Back to Shop
          </button>
          <span className="cart-count">{filteredCart.length} items{searchTerm ? ' found' : ''}</span>
        </div>
      </div>

      {/* View Item Text - Now Visible */}
      {filteredCart.length > 0 && (
        <div className="view-item-text-section">
          <h2 className="view-item-text">📋 View Items in Cart</h2>
          <p className="view-item-subtext">Manage your selected products below</p>
        </div>
      )}

      <div className="cart-page-content">
        <div className="cart-items-section">
          {filteredCart.length === 0 ? (
            <div className="empty-cart-message">
              <div className="empty-cart-icon">🛒</div>
              <h3>
                {searchTerm 
                  ? `No items found for "${searchTerm}"` 
                  : "Your cart is empty"}
              </h3>
              <p>
                {searchTerm 
                  ? "Try a different search term or browse all items" 
                  : "Add products from the shop to get started"}
              </p>
              <button className="shop-now-btn" onClick={goToShop}>
                Shop Now
              </button>
              {searchTerm && (
                <button className="clear-search-btn" onClick={clearSearch}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {filteredCart.map((item, index) => (
                  <div key={`${item.id}-${index}-${item.weight}`} className="cart-item-card">
                    <div className="cart-item-header">
                      <div className="item-info">
                        <h4 className="item-name">{item.name}</h4>
                        <p className="item-base-price">
                          Base: ₹{item.basePrice}/kg
                        </p>
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
                            key={`${item.id}-${weightObj.label}`}
                            className={`cart-weight-btn ${
                              item.weight === weightObj.label ? "active" : ""
                            }`}
                            onClick={() =>
                              updateWeight(index, weightObj.label)
                            }
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
                        <span>Price per {item.weight || "1kg"}:</span>
                        <span className="price-value">
                          ₹ {item.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="price-row total-row">
                        <span>Total for this item:</span>
                        <span className="total-value">
                          ₹ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-actions">
                <button
                  className="clear-cart-btn"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear all items from cart?")) {
                      setCart([]);
                      localStorage.removeItem(`dealerCart_${dealerId}`);
                    }
                  }}
                >
                  Clear All Items
                </button>
              </div>
            </>
          )}
        </div>

        {filteredCart.length > 0 && (
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h3>Order Summary</h3>

              <div className="summary-items">
                {filteredCart.map((item, index) => (
                  <div key={`${item.id}-summary-${index}`} className="summary-item">
                    <div className="summary-item-name">
                      {item.name} ({item.weight || "1kg"})
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
                  <span>Total Amount:</span>
                  <span className="grand-total-amount">
                    ₹ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="place-order-btn" onClick={placeOrder}>
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
    </div>
  );
};

export default Cart;