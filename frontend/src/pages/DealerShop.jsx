



// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import products from "../data/products";
// import api from "../utils/api";
// import "./DealerShop.css";

// const DealerOrders = ({ dealerId, refreshTrigger }) => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!dealerId) return;
    
//     setLoading(true);
//     api.get(`/api/orders/dealer/${dealerId}`)
//       .then(res => {
//         setOrders(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.log("No orders found or error:", err);
//         setLoading(false);
//       });
//   }, [dealerId, refreshTrigger]);

//   if (loading) return <div className="loading">Loading orders...</div>;
//   if (orders.length === 0) return <div className="no-orders">No orders yet.</div>;

//   return (
//     <div className="orders-section">
//       <h4>📜 Previous Orders</h4>
//       <div className="orders-list">
//         {orders.map(o => (
//           <div key={o._id} className="order-card">
//             <p className="order-date"><b>Date:</b> {new Date(o.createdAt).toLocaleString()}</p>
//             <p className="order-amount"><b>Total:</b> ₹ {o.totalAmount}</p>
//             <ul className="order-items">
//               {o.items.map((i, idx) => (
//                 <li key={idx}>{i.name} × {i.qty} - ₹ {i.price * i.qty}</li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };



// const DealerShop = () => {
//   const { dealerId } = useParams();
//   const [cart, setCart] = useState([]);
//   const [showFullDesc, setShowFullDesc] = useState({});
//   const [ordersRefresh, setOrdersRefresh] = useState(0);
//   const [addingId, setAddingId] = useState(null);

 


// const addToCart = (p) => {
//   setAddingId(p.id); // 👈 start loader

//   setTimeout(() => {
//     const found = cart.find(i => i.id === p.id);

//     if (found) {
//       setCart(cart.map(i =>
//         i.id === p.id ? { ...i, qty: i.qty + 1 } : i
//       ));
//     } else {
//       setCart([...cart, { ...p, qty: 1 }]);
//     }

//     setAddingId(null); // 👈 stop loader
//   }, 300); // small delay for UX
// };




//   const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id));
  
//   const changeQty = (id, delta) => 
//     setCart(cart.map(i => i.id === id ? { ...i, qty: Math.max(i.qty + delta, 1) } : i));
  
//   const toggleDesc = (id) => setShowFullDesc(prev => ({ ...prev, [id]: !prev[id] }));
  
//   const total = cart.reduce((s, i) => {
//     let price = 0;
//     if (i.price.includes('-')) {
//       price = parseFloat(i.price.split('-')[0].trim());
//     } else {
//       price = parseFloat(i.price);
//     }
//     return s + price * i.qty;
//   }, 0);

//   const placeOrder = async () => {
//     if (cart.length === 0) return alert("Cart empty");
    
//     try {
//       const orderItems = cart.map(item => {
//         let price = 0;
//         if (item.price.includes('-')) {
//           price = parseFloat(item.price.split('-')[0].trim());
//         } else {
//           price = parseFloat(item.price);
//         }
        
//         return {
//           productId: item.id,
//           name: item.name,
//           price: price,
//           qty: item.qty
//         };
//       });

//       const response = await api.post("/api/orders", {
//         dealerId: dealerId,
//         items: orderItems,
//         totalAmount: total
//       });

//       alert("Order placed successfully!");
      
//       setCart([]);
//       setOrdersRefresh(prev => prev + 1);
      
//     } catch (error) {
//       console.error("Error placing order:", error);
//       alert("Order placement failed: " + (error.response?.data?.message || error.message));
//     }
//   };

//   return (
//     <div className="dealer-shop-container">
//       {/* Products Section */}
//       <div className="products-container">
//         <h2>🛒 Dealer Shopping</h2>
//         <div className="products-grid">
//           {products.map(p => (
//             <div key={p.id} className="product-card">
//               <img src={p.image} alt={p.name} className="product-image" />
//               <h6 className="product-name">{p.name}</h6>
//               <p className="product-price">₹ {p.price}</p>
//               <p className="product-unit">{p.unit}</p>
//               <p className="product-description">
//                 {showFullDesc[p.id] ? p.description : p.description.slice(0, 50) + (p.description.length > 50 ? "..." : "")}
//                 {p.description.length > 50 && (
//                   <button className="read-more-btn" onClick={() => toggleDesc(p.id)}>
//                     {showFullDesc[p.id] ? " Show less" : " Read more"}
//                   </button>
//                 )}
//               </p>
//               {/* <button className="add-to-cart-btn" onClick={() => addToCart(p)}>
//                 Add to Cart
//               </button> */}

// <button
//   className="add-to-cart-btn"
//   onClick={() => addToCart(p)}
//   disabled={addingId === p.id}
// >
//   {addingId === p.id ? "Adding..." : "Add to Cart"}
// </button>



//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Cart + Orders Sidebar */}
//       <div className="sidebar-container">
//         <div className="cart-section">
//           <h4>🧺 Cart</h4>
//           {cart.length === 0 ? (
//             <div className="empty-cart">Cart is empty</div>
//           ) : (
//             <>
//               <div className="cart-items">
//                 {cart.map(i => {
//                   let price = 0;
//                   if (i.price.includes('-')) {
//                     price = parseFloat(i.price.split('-')[0].trim());
//                   } else {
//                     price = parseFloat(i.price);
//                   }
                  
//                   return (
//                     <div key={i.id} className="cart-item">
//                       <div className="cart-item-info">
//                         <p className="cart-item-name">{i.name}</p>
//                         <p className="cart-item-price">
//                           ₹ {price} × {i.qty} = ₹ {price * i.qty}
//                         </p>
//                         <div className="quantity-controls">
//                           <button 
//                             className="qty-btn" 
//                             onClick={() => changeQty(i.id, -1)}
//                           >
//                             -
//                           </button>
//                           <span className="qty-display">{i.qty}</span>
//                           <button 
//                             className="qty-btn" 
//                             onClick={() => changeQty(i.id, 1)}
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>
//                       <button 
//                         className="remove-item-btn" 
//                         onClick={() => removeFromCart(i.id)}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//               <div className="cart-total">
//                 <h5 className="total-amount">Total: ₹ {total.toFixed(2)}</h5>
//                 <button 
//                   className="place-order-btn" 
//                   onClick={placeOrder}
//                   disabled={cart.length === 0}
//                 >
//                   Place Order
//                 </button>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Dealer Orders inside same page */}
//         <DealerOrders dealerId={dealerId} refreshTrigger={ordersRefresh} />
//       </div>
//     </div>
//   );
// };

// export default DealerShop;




















// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import products from "../data/products";
// import api from "../utils/api";
// import "./DealerShop.css";

// const DealerOrders = ({ dealerId, refreshTrigger }) => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!dealerId) return;
    
//     setLoading(true);
//     api.get(`/api/orders/dealer/${dealerId}`)
//       .then(res => {
//         setOrders(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.log("No orders found or error:", err);
//         setLoading(false);
//       });
//   }, [dealerId, refreshTrigger]);

//   if (loading) return <div className="loading">Loading orders...</div>;
//   if (orders.length === 0) return <div className="no-orders">No orders yet.</div>;

//   return (
//     <div className="orders-section">
//       <h4>📜 Previous Orders</h4>
//       <div className="orders-list">
//         {orders.map(o => (
//           <div key={o._id} className="order-card">
//             <p className="order-date"><b>Date:</b> {new Date(o.createdAt).toLocaleString()}</p>
//             <p className="order-amount"><b>Total:</b> ₹ {o.totalAmount}</p>
//             <ul className="order-items">
//               {o.items.map((i, idx) => (
//                 <li key={idx}>
//                   {i.name} × {i.qty} ({i.weight}) - ₹ {i.price * i.qty}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const DealerShop = () => {
//   const { dealerId } = useParams();
//   const [cart, setCart] = useState([]);
//   const [ordersRefresh, setOrdersRefresh] = useState(0);
//   const [showFullDesc, setShowFullDesc] = useState({});
//   const [addingId, setAddingId] = useState(null);
//   const [addedId, setAddedId] = useState(null);

//   // Weight options with multipliers
//   const weightOptions = [
//     { label: "1kg", kg: 1 },
//     { label: "10kg", kg: 10 },
//     { label: "20kg", kg: 20 }
//   ];

//   // Extract base price from price string (e.g., "195.50 - 2660.50")
//   const getBasePrice = (priceString) => {
//     if (!priceString) return 0;
//     return parseFloat(priceString.split('-')[0].trim());
//   };

//   const calculatePrice = (basePrice, weight) => {
//     const weightOption = weightOptions.find(w => w.label === weight);
//     if (!weightOption) return basePrice;
//     return basePrice * weightOption.kg;
//   };

//   // Add to cart
//   const addToCart = (product) => {
//     setAddingId(product.id);
    
//     setTimeout(() => {
//       const basePrice = getBasePrice(product.price);
//       const price = calculatePrice(basePrice, "1kg");
      
//       // Find existing item
//       const existingItem = cart.find(item => 
//         item.id === product.id && item.weight === "1kg"
//       );
      
//       if (existingItem) {
//         setCart(cart.map(item =>
//           item.id === product.id && item.weight === "1kg"
//             ? { 
//                 ...item, 
//                 quantity: item.quantity + 1
//               }
//             : item
//         ));
//       } else {
//         setCart([...cart, {
//           id: product.id,
//           name: product.name,
//           basePrice: basePrice, // Store base price
//           price: price, // Current price per unit
//           quantity: 1,
//           weight: "1kg"
//         }]);
//       }
      
//       setAddingId(null);
//       setAddedId(product.id);
      
//       setTimeout(() => {
//         setAddedId(null);
//       }, 2000);
      
//     }, 300);
//   };

//   // Remove from cart
//   const removeFromCart = (index) => {
//     setCart(cart.filter((_, i) => i !== index));
//   };

//   // Update weight in cart
//   const updateWeight = (index, newWeight) => {
//     const updatedCart = [...cart];
//     const item = updatedCart[index];
    
//     // Calculate new price based on base price
//     const newPrice = calculatePrice(item.basePrice, newWeight);
    
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

//   // Toggle description
//   const toggleDesc = (id) => setShowFullDesc(prev => ({ ...prev, [id]: !prev[id] }));

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
//         qty: item.quantity,      // ✅ BACKEND COMPATIBLE
//         weight: item.weight      // optional, backend ignore karega
//       }));

//       await api.post("/api/orders", {
//         dealerId: dealerId,
//         items: orderItems,
//         totalAmount: Number(total.toFixed(2)) // ✅ number
//       });

//       alert("Order placed successfully!");
//       setCart([]);
//       setOrdersRefresh(prev => prev + 1);

//     } catch (error) {
//       console.error("Order error:", error);
//       alert("Order placement failed");
//     }
//   };

//   return (
//     <div className="dealer-shop-container">
//       {/* Products Section */}
//       <div className="products-container">
//         <h2>🛒 Dealer Shopping</h2>
//         <div className="products-grid">
//           {products.map(product => {
//             const basePrice = getBasePrice(product.price);
//             const price1kg = calculatePrice(basePrice, "1kg");
//             const price10kg = calculatePrice(basePrice, "10kg");
//             const price20kg = calculatePrice(basePrice, "20kg");
            
//             return (
//               <div key={product.id} className="product-card">
//                 <img src={product.image} alt={product.name} className="product-image" />
//                 <h6 className="product-name">{product.name}</h6>
//                 <p className="product-price">₹ {product.price}</p>
                
//                 {/* Price breakdown */}
//                 <div className="price-breakdown">
//                   <div className="price-option">
//                     <span>1kg:</span>
//                     <span className="price-value">₹ {price1kg.toFixed(2)}</span>
//                   </div>
//                   <div className="price-option">
//                     <span>10kg:</span>
//                     <span className="price-value">₹ {price10kg.toFixed(2)}</span>
//                   </div>
//                   <div className="price-option">
//                     <span>20kg:</span>
//                     <span className="price-value">₹ {price20kg.toFixed(2)}</span>
//                   </div>
//                 </div>
                
//                 {/* Product Description */}
//                 <p className="product-description">
//                   {showFullDesc[product.id] 
//                     ? product.description 
//                     : product.description.slice(0, 80) + (product.description.length > 80 ? "..." : "")}
//                   {product.description.length > 80 && (
//                     <button className="read-more-btn" onClick={() => toggleDesc(product.id)}>
//                       {showFullDesc[product.id] ? " Show less" : " Read more"}
//                     </button>
//                   )}
//                 </p>
                
//                 <button
//                   className="add-to-cart-btn"
//                   onClick={() => addToCart(product)}
//                   disabled={addingId === product.id}
//                 >
//                   {addingId === product.id ? (
//                     <>
//                       <span className="loader"></span> Adding...
//                     </>
//                   ) : addedId === product.id ? (
//                     "✅ Added"
//                   ) : (
//                     "Add to Cart"
//                   )}
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Cart Section */}
//       <div className="sidebar-container">
//         <div className="cart-section">
//           <h4>🧺 Cart ({cart.length} items)</h4>
          
//           {cart.length === 0 ? (
//             <div className="empty-cart">
//               <p>Your cart is empty</p>
//               <p className="cart-empty-sub">Add products from the list</p>
//             </div>
//           ) : (
//             <>
//               <div className="cart-items">
//                 {cart.map((item, index) => (
//                   <div key={`${item.id}-${index}`} className="cart-item">
//                     <div className="cart-item-header">
//                       <span className="item-name">{item.name}</span>
//                       <button 
//                         className="remove-btn"
//                         onClick={() => removeFromCart(index)}
//                       >
//                         ✕
//                       </button>
//                     </div>
                    
//                     {/* Weight Selection in Cart */}
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
                    
//                     {/* Quantity Controls with +/- buttons */}
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
//                         <span>Total:</span>
//                         <span className="total-value">₹ {(item.price * item.quantity).toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="cart-summary">
//                 <div className="summary-row">
//                   <span>Total Amount:</span>
//                   <span className="total-amount">₹ {total.toFixed(2)}</span>
//                 </div>
                
//                 <button 
//                   className="place-order-btn" 
//                   onClick={placeOrder}
//                 >
//                   Place Order
//                 </button>
                
//                 <button 
//                   className="clear-cart-btn"
//                   onClick={() => setCart([])}
//                 >
//                   Clear Cart
//                 </button>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Orders History */}
//         <DealerOrders dealerId={dealerId} refreshTrigger={ordersRefresh} />
//       </div>
//     </div>
//   );
// };

// export default DealerShop;







import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../data/products";
import "./DealerShop.css";

const DealerShop = () => {
  const { dealerId } = useParams();
  const navigate = useNavigate();
  
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [showFullDesc, setShowFullDesc] = useState({});
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
  }, [cart, dealerId]);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm]);

  // Weight options with multipliers
  const weightOptions = [
    { label: "1kg", kg: 1 },
    { label: "10kg", kg: 10 },
    { label: "20kg", kg: 20 }
  ];

  // Extract base price from price string (e.g., "195.50 - 2660.50")
  const getBasePrice = (priceString) => {
    if (!priceString) return 0;
    return parseFloat(priceString.split('-')[0].trim());
  };

  const calculatePrice = (basePrice, weight) => {
    const weightOption = weightOptions.find(w => w.label === weight);
    if (!weightOption) return basePrice;
    return basePrice * weightOption.kg;
  };

  // Add to cart
  const addToCart = (product) => {
    setAddingId(product.id);
    
    setTimeout(() => {
      const basePrice = getBasePrice(product.price);
      const price = calculatePrice(basePrice, "1kg");
      
      // Find existing item
      const existingItem = cart.find(item => 
        item.id === product.id && item.weight === "1kg"
      );
      
      let updatedCart;
      if (existingItem) {
        updatedCart = cart.map(item =>
          item.id === product.id && item.weight === "1kg"
            ? { 
                ...item, 
                quantity: item.quantity + 1
              }
            : item
        );
      } else {
        updatedCart = [...cart, {
          id: product.id,
          name: product.name,
          basePrice: basePrice, // Store base price
          price: price, // Current price per unit
          quantity: 1,
          weight: "1kg"
        }];
      }
      
      setCart(updatedCart);
      setAddingId(null);
      setAddedId(product.id);
      
      setTimeout(() => {
        setAddedId(null);
      }, 2000);
      
    }, 300);
  };

  // Toggle description
  const toggleDesc = (id) => setShowFullDesc(prev => ({ ...prev, [id]: !prev[id] }));

  // View Cart button function - Navigate to cart page
  const viewCart = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add some products first!");
      return;
    }
    navigate(`/cart/${dealerId}`);
  };

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  // Handle Enter key press in search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="dealer-shop-container">
      {/* Fixed Header */}
      <div className="fixed-header">
        <h2>🛒 Dealer Shopping</h2>
        
        <div className="header-controls">
          {/* Search Box */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products by name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" onClick={handleSearch}>
              🔍 Search
            </button>
          </div>
          
          {/* View Cart Button */}
          <button 
            className="view-cart-btn"
            onClick={viewCart}
          >
            🛍️ View Cart ({cart.length} items)
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-container">
        <div className="products-content">
          {/* Search Results Info */}
          <div className="search-info">
            {searchTerm && (
              <p className="search-results">
                Showing {filteredProducts.length} results for "<strong>{searchTerm}</strong>"
                <button 
                  className="clear-search" 
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </button>
              </p>
            )}
          </div>
          
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const basePrice = getBasePrice(product.price);
                const price1kg = calculatePrice(basePrice, "1kg");
                const price10kg = calculatePrice(basePrice, "10kg");
                const price20kg = calculatePrice(basePrice, "20kg");
                
                return (
                  <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <h6 className="product-name">{product.name}</h6>
                    <p className="product-price">₹ {product.price}</p>
                    
                    {/* Price breakdown */}
                    <div className="price-breakdown">
                      <div className="price-option">
                        <span>1kg:</span>
                        <span className="price-value">₹ {price1kg.toFixed(2)}</span>
                      </div>
                      <div className="price-option">
                        <span>10kg:</span>
                        <span className="price-value">₹ {price10kg.toFixed(2)}</span>
                      </div>
                      <div className="price-option">
                        <span>20kg:</span>
                        <span className="price-value">₹ {price20kg.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Product Description */}
                    <p className="product-description">
                      {showFullDesc[product.id] 
                        ? product.description 
                        : product.description.slice(0, 80) + (product.description.length > 80 ? "..." : "")}
                      {product.description.length > 80 && (
                        <button className="read-more-btn" onClick={() => toggleDesc(product.id)}>
                          {showFullDesc[product.id] ? " Show less" : " Read more"}
                        </button>
                      )}
                    </p>
                    
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                      disabled={addingId === product.id}
                    >
                      {addingId === product.id ? (
                        <>
                          <span className="loader"></span> Adding...
                        </>
                      ) : addedId === product.id ? (
                        "✅ Added"
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="no-results">
                <h3>No products found for--{searchTerm}"</h3>
                <p>Try searching with different keywords</p>
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerShop;















