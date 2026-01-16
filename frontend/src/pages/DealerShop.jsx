



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





import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import products from "../data/products";
import api from "../utils/api";
import "./DealerShop.css";

const DealerOrders = ({ dealerId, refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dealerId) return;
    
    setLoading(true);
    api.get(`/api/orders/dealer/${dealerId}`)
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log("No orders found or error:", err);
        setLoading(false);
      });
  }, [dealerId, refreshTrigger]);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (orders.length === 0) return <div className="no-orders">No orders yet.</div>;

  return (
    <div className="orders-section">
      <h4>📜 Previous Orders</h4>
      <div className="orders-list">
        {orders.map(o => (
          <div key={o._id} className="order-card">
            <p className="order-date"><b>Date:</b> {new Date(o.createdAt).toLocaleString()}</p>
            <p className="order-amount"><b>Total:</b> ₹ {o.totalAmount}</p>
            <ul className="order-items">
              {o.items.map((i, idx) => (
                <li key={idx}>{i.name} × {i.quantity} ({i.weight || 'N/A'}) - ₹ {i.price}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const DealerShop = () => {
  const { dealerId } = useParams();
  const [cart, setCart] = useState([]);
  const [showFullDesc, setShowFullDesc] = useState({});
  const [ordersRefresh, setOrdersRefresh] = useState(0);
  const [addingId, setAddingId] = useState(null);

  // Weight options for selection
  const weightOptions = ["1kg", "5kg", "10kg", "20kg", "25kg", "50kg"];

  // Get price based on weight selection
  const getPriceForWeight = (product, selectedWeight) => {
    if (!product.price.includes('-')) return parseFloat(product.price);
    
    const priceRange = product.price.split('-');
    const basePrice = parseFloat(priceRange[0].trim());
    
    // Calculate price based on weight
    const weightValue = parseFloat(selectedWeight.replace('kg', ''));
    
    // Simple multiplier logic - you can adjust this as needed
    if (selectedWeight === "1kg") return basePrice;
    if (selectedWeight === "5kg") return basePrice * 4.8; // Slight discount for bulk
    if (selectedWeight === "10kg") return basePrice * 9.5;
    if (selectedWeight === "20kg") return basePrice * 18;
    if (selectedWeight === "25kg") return basePrice * 22;
    if (selectedWeight === "50kg") return basePrice * 40;
    
    return basePrice;
  };

  // Add to cart with weight selection
  const addToCart = (product) => {
    // Show weight selection modal
    const selectedWeight = prompt(
      `Select weight for ${product.name}:\n1kg, 5kg, 10kg, 20kg, 25kg, 50kg\n\nEnter weight (e.g., 10kg):`,
      "1kg"
    );
    
    if (!selectedWeight || !weightOptions.includes(selectedWeight.toLowerCase())) {
      alert("Please select a valid weight: 1kg, 5kg, 10kg, 20kg, 25kg, or 50kg");
      return;
    }

    setAddingId(product.id);
    
    setTimeout(() => {
      const price = getPriceForWeight(product, selectedWeight);
      
      const found = cart.find(item => 
        item.id === product.id && item.weight === selectedWeight
      );

      if (found) {
        setCart(cart.map(item =>
          item.id === product.id && item.weight === selectedWeight
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, { 
          ...product, 
          quantity: 1,
          weight: selectedWeight,
          price: price
        }]);
      }

      setAddingId(null);
    }, 300);
  };

  // Remove from cart
  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  // Change quantity
  const changeQuantity = (id, weight, delta) => 
    setCart(cart.map(item => 
      item.id === id && item.weight === weight 
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) } 
        : item
    ));

  // Toggle description
  const toggleDesc = (id) => setShowFullDesc(prev => ({ ...prev, [id]: !prev[id] }));

  // Calculate total
  const total = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) return alert("Cart empty");
    
    try {
      const orderItems = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight,
        unitPrice: getPriceForWeight(item, item.weight) / item.quantity
      }));

      const response = await api.post("/api/orders", {
        dealerId: dealerId,
        items: orderItems,
        totalAmount: total.toFixed(2)
      });

      alert("Order placed successfully!");
      setCart([]);
      setOrdersRefresh(prev => prev + 1);
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Order placement failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="dealer-shop-container">
      {/* Products Section */}
      <div className="products-container">
        <h2>🛒 Dealer Shopping</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h6 className="product-name">{product.name}</h6>
              <p className="product-price">₹ {product.price}</p>
              <p className="product-unit">Starting from 1kg</p>
              <p className="product-description">
                {showFullDesc[product.id] 
                  ? product.description 
                  : product.description.slice(0, 50) + (product.description.length > 50 ? "..." : "")}
                {product.description.length > 50 && (
                  <button className="read-more-btn" onClick={() => toggleDesc(product.id)}>
                    {showFullDesc[product.id] ? " Show less" : " Read more"}
                  </button>
                )}
              </p>
              
              {/* Available Weight Options */}
              <div className="weight-options">
                <small>Available: </small>
                {weightOptions.map(weight => (
                  <span key={weight} className="weight-tag">{weight}</span>
                ))}
              </div>
              
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
                disabled={addingId === product.id}
              >
                {addingId === product.id ? "Adding..." : "📦 Select Weight & Add"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart + Orders Sidebar */}
      <div className="sidebar-container">
        <div className="cart-section">
          <h4>🧺 Cart ({cart.length} items)</h4>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p className="cart-empty-sub">Select products and choose weight (1kg, 10kg, etc.)</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={`${item.id}-${item.weight}`} className="cart-item">
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      <div className="cart-item-details">
                        <span className="weight-badge">{item.weight}</span>
                        <span className="item-price">₹ {item.price.toFixed(2)}</span>
                      </div>
                      <p className="item-total">
                        ₹ {item.price} × {item.quantity} = ₹ {(item.price * item.quantity).toFixed(2)}
                      </p>
                      
                      {/* Quantity Controls - Removed +/- buttons */}
                      <div className="quantity-section">
                        <label>Quantity: </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1;
                            setCart(cart.map(i =>
                              i.id === item.id && i.weight === item.weight
                                ? { ...i, quantity: Math.max(newQty, 1) }
                                : i
                            ));
                          }}
                          className="quantity-input"
                        />
                        <div className="quick-actions">
                          <button 
                            className="action-btn remove"
                            onClick={() => removeFromCart(item.id)}
                            title="Remove item"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹ {total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Items:</span>
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                
                <button 
                  className="place-order-btn" 
                  onClick={placeOrder}
                >
                  ✅ Place Order (₹ {total.toFixed(2)})
                </button>
                
                <button 
                  className="clear-cart-btn"
                  onClick={() => setCart([])}
                >
                  🗑️ Clear Cart
                </button>
              </div>
            </>
          )}
        </div>

        {/* Dealer Orders */}
        <DealerOrders dealerId={dealerId} refreshTrigger={ordersRefresh} />
      </div>
    </div>
  );
};

export default DealerShop;