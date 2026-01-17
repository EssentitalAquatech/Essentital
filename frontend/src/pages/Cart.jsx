import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "./Cart.css";

const Cart = () => {
  const { dealerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Location se cart data receive karein
  const [cart, setCart] = useState(location.state?.cart || []);
  const [ordersRefresh, setOrdersRefresh] = useState(0);
  
  const weightOptions = [
    { label: "1kg", kg: 1 },
    { label: "10kg", kg: 10 },
    { label: "20kg", kg: 20 }
  ];

  // Remove from cart
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Update weight in cart
  const updateWeight = (index, newWeight) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    
    // Calculate new price based on base price
    const weightOption = weightOptions.find(w => w.label === newWeight);
    const newPrice = item.basePrice * (weightOption?.kg || 1);
    
    updatedCart[index] = {
      ...item,
      weight: newWeight,
      price: newPrice
    };
    
    setCart(updatedCart);
  };

  // Update quantity in cart
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
        qty: item.quantity,
        weight: item.weight
      }));

      await api.post("/api/orders", {
        dealerId: dealerId,
        items: orderItems,
        totalAmount: Number(total.toFixed(2))
      });

      alert("Order placed successfully!");
      setCart([]);
      setOrdersRefresh(prev => prev + 1);

    } catch (error) {
      console.error("Order error:", error);
      alert("Order placement failed");
    }
  };

  // Go back to shop
  const goToShop = () => {
    navigate(`/dealer-shop/${dealerId}`);
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
        {/* Left side - Cart Items */}
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
                    
                    {/* Weight Selection */}
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
                    
                    {/* Quantity Controls */}
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
                    
                    {/* Price Display */}
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
                  onClick={() => setCart([])}
                  disabled={cart.length === 0}
                >
                  Clear All Items
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right side - Order Summary */}
        {cart.length > 0 && (
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cart.map((item, index) => (
                  <div key={index} className="summary-item">
                    <div className="summary-item-name">
                      {item.name} ({item.weight})
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
    </div>
  );
};

export default Cart;