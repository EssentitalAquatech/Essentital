






// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import products from "../data/products";
// import "./DealerShop.css";

// const DealerShop = () => {
//   const { dealerId } = useParams();
//   const navigate = useNavigate();
  
//   // Initialize cart from localStorage
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });
  
//   const [showFullDesc, setShowFullDesc] = useState({});
//   const [addingId, setAddingId] = useState(null);
//   const [addedId, setAddedId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState(products);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
//   }, [cart, dealerId]);

//   // Filter products based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter(product =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredProducts(filtered);
//     }
//   }, [searchTerm]);

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
      
//       let updatedCart;
//       if (existingItem) {
//         updatedCart = cart.map(item =>
//           item.id === product.id && item.weight === "1kg"
//             ? { 
//                 ...item, 
//                 quantity: item.quantity + 1
//               }
//             : item
//         );
//       } else {
//         updatedCart = [...cart, {
//           id: product.id,
//           name: product.name,
//           basePrice: basePrice, // Store base price
//           price: price, // Current price per unit
//           quantity: 1,
//           weight: "1kg"
//         }];
//       }
      
//       setCart(updatedCart);
//       setAddingId(null);
//       setAddedId(product.id);
      
//       setTimeout(() => {
//         setAddedId(null);
//       }, 2000);
      
//     }, 300);
//   };

//   // Toggle description
//   const toggleDesc = (id) => setShowFullDesc(prev => ({ ...prev, [id]: !prev[id] }));



//   const viewCart = () => {
//   navigate(`/cart/${dealerId}`);
// };


//   // Handle search
//   const handleSearch = () => {
//     if (searchTerm.trim() === "") {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter(product =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredProducts(filtered);
//     }
//   };

//   // Handle Enter key press in search
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   return (
//     <div className="dealer-shop-container">
//       {/* Fixed Header */}
//       <div className="fixed-header">
//         <h2>🛒 Dealer Shopping</h2>
        
//         <div className="header-controls">
//           {/* Search Box */}
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search products by name..."
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyPress={handleKeyPress}
//             />
//             <button className="search-btn" onClick={handleSearch}>
//               🔍 Search
//             </button>
//           </div>
          
//           {/* View Cart Button */}
//           <button 
//             className="view-cart-btn"
//             onClick={viewCart}
//           >
//             🛍️ View Cart ({cart.length} items)
//           </button>
//         </div>
//       </div>

//       {/* Products Section */}
//       <div className="products-container">
//         <div className="products-content">
//           {/* Search Results Info */}
//           <div className="search-info">
//             {searchTerm && (
//               <p className="search-results">
//                 Showing {filteredProducts.length} results for "<strong>{searchTerm}</strong>"
//                 <button 
//                   className="clear-search" 
//                   onClick={() => setSearchTerm("")}
//                 >
//                   Clear search
//                 </button>
//               </p>
//             )}
//           </div>
          
//           <div className="products-grid">
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map(product => {
//                 const basePrice = getBasePrice(product.price);
//                 const price1kg = calculatePrice(basePrice, "1kg");
//                 const price10kg = calculatePrice(basePrice, "10kg");
//                 const price20kg = calculatePrice(basePrice, "20kg");
                
//                 return (
//                   <div key={product.id} className="product-card">
//                     <img src={product.image} alt={product.name} className="product-image" />
//                     <h6 className="product-name">{product.name}</h6>
//                     <p className="product-price">₹ {product.price}</p>
                    
//                     {/* Price breakdown */}
//                     <div className="price-breakdown">
//                       <div className="price-option">
//                         <span>1kg:</span>
//                         <span className="price-value">₹ {price1kg.toFixed(2)}</span>
//                       </div>
//                       <div className="price-option">
//                         <span>10kg:</span>
//                         <span className="price-value">₹ {price10kg.toFixed(2)}</span>
//                       </div>
//                       <div className="price-option">
//                         <span>20kg:</span>
//                         <span className="price-value">₹ {price20kg.toFixed(2)}</span>
//                       </div>
//                     </div>
                    
//                     {/* Product Description */}
//                     <p className="product-description">
//                       {showFullDesc[product.id] 
//                         ? product.description 
//                         : product.description.slice(0, 80) + (product.description.length > 80 ? "..." : "")}
//                       {product.description.length > 80 && (
//                         <button className="read-more-btn" onClick={() => toggleDesc(product.id)}>
//                           {showFullDesc[product.id] ? " Show less" : " Read more"}
//                         </button>
//                       )}
//                     </p>
                    
//                     <button
//                       className="add-to-cart-btn"
//                       onClick={() => addToCart(product)}
//                       disabled={addingId === product.id}
//                     >
//                       {addingId === product.id ? (
//                         <>
//                           <span className="loader"></span> Adding...
//                         </>
//                       ) : addedId === product.id ? (
//                         "✅ Added"
//                       ) : (
//                         "Add to Cart"
//                       )}
//                     </button>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="no-results">
//                 <h3>No products found for--{searchTerm}</h3>
//                 <p>Try searching with different keywords</p>
//                 <button 
//                   className="clear-search-btn"
//                   onClick={() => setSearchTerm("")}
//                 >
//                   Clear Search
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DealerShop;
























// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import products from "../data/products";
// import "./DealerShop.css";

// const DealerShop = () => {
//   const { dealerId } = useParams();
//   const navigate = useNavigate();

//   // Cart state
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const [showFullDesc, setShowFullDesc] = useState({});
//   const [addingId, setAddingId] = useState(null);
//   const [addedId, setAddedId] = useState(null);

//   // 🔍 Search states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState(products);

//   // Save cart
//   useEffect(() => {
//     localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
//   }, [cart, dealerId]);

//   // Weight options
//   const weightOptions = [
//     { label: "1kg", kg: 1 },
//     { label: "10kg", kg: 10 },
//     { label: "20kg", kg: 20 },
//   ];

//   const getBasePrice = (priceString) => {
//     if (!priceString) return 0;
//     return parseFloat(priceString.split("-")[0].trim());
//   };

//   const calculatePrice = (basePrice, weight) => {
//     const option = weightOptions.find((w) => w.label === weight);
//     return option ? basePrice * option.kg : basePrice;
//   };

//   // 🛒 Add to cart
//   const addToCart = (product) => {
//     setAddingId(product.id);

//     setTimeout(() => {
//       const basePrice = getBasePrice(product.price);
//       const price = calculatePrice(basePrice, "1kg");

//       const existingItem = cart.find(
//         (item) => item.id === product.id && item.weight === "1kg"
//       );

//       let updatedCart;
//       if (existingItem) {
//         updatedCart = cart.map((item) =>
//           item.id === product.id && item.weight === "1kg"
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         updatedCart = [
//           ...cart,
//           {
//             id: product.id,
//             name: product.name,
//             basePrice,
//             price,
//             quantity: 1,
//             weight: "1kg",
//           },
//         ];
//       }

//       setCart(updatedCart);
//       setAddingId(null);
//       setAddedId(product.id);

//       setTimeout(() => setAddedId(null), 2000);
//     }, 300);
//   };

//   const toggleDesc = (id) =>
//     setShowFullDesc((prev) => ({ ...prev, [id]: !prev[id] }));

//   const viewCart = () => navigate(`/cart/${dealerId}`);
//   const viewHistory = () => navigate(`/history/${dealerId}`);

//   // 🔍 SEARCH LOGIC (MAIN FIX)
//   const handleSearch = () => {
//     const trimmedSearch = searchTerm.trim().toLowerCase();

//     if (trimmedSearch === "") {
//       setFilteredProducts(products);
//       return;
//     }

//     const filtered = products.filter((product) =>
//       product.name.toLowerCase().includes(trimmedSearch)
//     );

//     setFilteredProducts(filtered);
//   };

//   // ⌨️ Enter key support
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // NEW FUNCTION (clear search)
//   const clearSearch = () => {
//     setSearchTerm("");
//     setFilteredProducts(products);
//   };

//   return (
//     <div className="dealer-shop-container">
//       <div className="fixed-header">
//         <h2>🛒 Dealer Shopping</h2>

//         <div className="header-controls">
//           {/* REPLACED SEARCH JSX */}
//           <div className="search-container">
//             <div className="search-input-wrapper">
//               <input
//                 type="text"
//                 placeholder="Search products by name..."
//                 className="search-input"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={handleKeyPress}
//               />

//               {/* ❌ Clear button inside input */}
//               {searchTerm.trim() !== "" && (
//                 <span className="clear-search" onClick={clearSearch}>
//                   ❌
//                 </span>
//               )}
//             </div>

//             <button className="shop-search-btn" onClick={handleSearch}>
//               🔍 Search
//             </button>
//           </div>

//           <div className="header-buttons">
//             <button className="shop-history-btn" onClick={viewHistory}>
//               📋 History
//             </button>

//             <button className=" abc-view-cart-btn" onClick={viewCart}>
//               🛍️ View Cart ({cart.length} items)
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="products-container">
//         <div className="products-grid">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => {
//               const basePrice = getBasePrice(product.price);

//               return (
//                 <div key={product.id} className="product-card">
//                   <img src={product.image} alt={product.name} />
//                   <h6>{product.name}</h6>
//                   <p>₹ {product.price}</p>

//                   <button
//                     onClick={() => addToCart(product)}
//                     disabled={addingId === product.id}
//                   >
//                     {addingId === product.id
//                       ? "Adding..."
//                       : addedId === product.id
//                       ? "✅ Added"
//                       : "Add to Cart"}
//                   </button>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="no-results">
//               <h3>No products found</h3>
//               <button onClick={clearSearch}>
//                 Clear Search
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DealerShop;















// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import products from "../data/products";
// import "./DealerShop.css";

// const DealerShop = () => {
//   const { dealerId } = useParams();
//   const navigate = useNavigate();

//   // Cart state
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const [showFullDesc, setShowFullDesc] = useState({});
//   const [addingId, setAddingId] = useState(null);
//   const [addedId, setAddedId] = useState(null);

//   // 🔍 Search states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState(products);

//   // Save cart
//   useEffect(() => {
//     localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
//   }, [cart, dealerId]);

//   // NEW: Function to get formatted price string
//   const getFormattedPrice = (product) => {
//     const price1kg = product.prices?.["1kg"] || 0;
//     const price10kg = product.prices?.["10kg"] || 0;
//     const price20kg = product.prices?.["20kg"] || 0;
    
//     if (price1kg && price10kg && price20kg) {
//       return `₹${price1kg} - ₹${price10kg} - ₹${price20kg}`;
//     } else if (price1kg) {
//       return `₹${price1kg}`;
//     }
//     return "Price not available";
//   };

//   // 🛒 Add to cart with new price logic
//   const addToCart = (product) => {
//     setAddingId(product.id);

//     setTimeout(() => {
//       const weight = "1kg";
//       const price = product.prices[weight];

//       const existingItem = cart.find(
//         (item) => item.id === product.id && item.weight === weight
//       );

//       let updatedCart;

//       if (existingItem) {
//         updatedCart = cart.map((item) =>
//           item.id === product.id && item.weight === weight
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         updatedCart = [
//           ...cart,
//           {
//             id: product.id,
//             name: product.name,
//             prices: product.prices,   // ✅ MOST IMPORTANT LINE
//             weight: weight,
//             price: price,
//             quantity: 1,
//           },
//         ];
//       }

//       setCart(updatedCart);
//       setAddingId(null);
//       setAddedId(product.id);

//       setTimeout(() => setAddedId(null), 2000);
//     }, 300);
//   };

//   const toggleDesc = (id) =>
//     setShowFullDesc((prev) => ({ ...prev, [id]: !prev[id] }));

//   const viewCart = () => navigate(`/cart/${dealerId}`);
//   const viewHistory = () => navigate(`/history/${dealerId}`);

//   // 🔍 SEARCH LOGIC
//   const handleSearch = () => {
//     const trimmedSearch = searchTerm.trim().toLowerCase();

//     if (trimmedSearch === "") {
//       setFilteredProducts(products);
//       return;
//     }

//     const filtered = products.filter((product) =>
//       product.name.toLowerCase().includes(trimmedSearch)
//     );

//     setFilteredProducts(filtered);
//   };

//   // ⌨️ Enter key support
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm("");
//     setFilteredProducts(products);
//   };

//   return (
//     <div className="dealer-shop-container">
//       <div className="fixed-header">
//         <h2>🛒 Dealer Shopping</h2>

//         <div className="header-controls">
//           <div className="search-container">
//             <div className="search-input-wrapper">
//               <input
//                 type="text"
//                 placeholder="Search products by name..."
//                 className="search-input"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={handleKeyPress}
//               />

//               {searchTerm.trim() !== "" && (
//                 <span className="clear-search" onClick={clearSearch}>
//                   ❌
//                 </span>
//               )}
//             </div>

//             <button className="shop-search-btn" onClick={handleSearch}>
//               🔍 Search
//             </button>
//           </div>

//           <div className="header-buttons">
//             <button className="shop-history-btn" onClick={viewHistory}>
//               📋 History
//             </button>

//             <button className="abc-view-cart-btn" onClick={viewCart}>
//               🛍️ View Cart ({cart.length} items)
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="products-container">
//         <div className="products-grid">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => {
//               return (
//                 <div key={product.id} className="product-card">
//                   <img src={product.image} alt={product.name} />
//                   <h6>{product.name}</h6>
//                   <p>{getFormattedPrice(product)}</p>

//                   <button
//                     onClick={() => addToCart(product)}
//                     disabled={addingId === product.id}
//                   >
//                     {addingId === product.id
//                       ? "Adding..."
//                       : addedId === product.id
//                       ? "✅ Added"
//                       : "Add to Cart"}
//                   </button>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="no-results">
//               <h3>No products found</h3>
//               <button onClick={clearSearch}>
//                 Clear Search
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DealerShop;












// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import products from "../data/products";
// import "./DealerShop.css";

// const DealerShop = () => {
//   const { dealerId } = useParams();
//   const navigate = useNavigate();

//   // Cart state
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const [showFullDesc, setShowFullDesc] = useState({});
//   const [addingId, setAddingId] = useState(null);
//   const [addedId, setAddedId] = useState(null);

//   // 🔍 Search states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState(products);

//   // Save cart
//   useEffect(() => {
//     localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
//   }, [cart, dealerId]);

//   // ✅ CHANGE 1: Updated getFormattedPrice function (variants based)
//   const getFormattedPrice = (product) => {
//     if (!product.variants || product.variants.length === 0) {
//       return "Price not available";
//     }

//     return product.variants
//       .map(v => `₹${v.price} (${v.label})`)
//       .join(" | ");
//   };

//   // ✅ CHANGE 2: Updated addToCart function (variants logic)
//   const addToCart = (product) => {
//     setAddingId(product.id);

//     setTimeout(() => {
//       const defaultVariant = product.variants[0]; // 👈 first variant

//       const existingItem = cart.find(
//         (item) =>
//           item.id === product.id &&
//           item.variantLabel === defaultVariant.label
//       );

//       let updatedCart;

//       if (existingItem) {
//         updatedCart = cart.map((item) =>
//           item.id === product.id &&
//           item.variantLabel === defaultVariant.label
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         updatedCart = [
//           ...cart,
//           {
//             id: product.id,
//             name: product.name,
//             variants: product.variants,   // ✅ SAVE ALL VARIANTS
//             variantLabel: defaultVariant.label,
//             price: defaultVariant.price,
//             quantity: 1,
//           },
//         ];
//       }

//       setCart(updatedCart);
//       setAddingId(null);
//       setAddedId(product.id);
//       setTimeout(() => setAddedId(null), 2000);
//     }, 300);
//   };

//   const toggleDesc = (id) =>
//     setShowFullDesc((prev) => ({ ...prev, [id]: !prev[id] }));

//   const viewCart = () => navigate(`/cart/${dealerId}`);
//   const viewHistory = () => navigate(`/history/${dealerId}`);

//   // 🔍 SEARCH LOGIC
//   const handleSearch = () => {
//     const trimmedSearch = searchTerm.trim().toLowerCase();

//     if (trimmedSearch === "") {
//       setFilteredProducts(products);
//       return;
//     }

//     const filtered = products.filter((product) =>
//       product.name.toLowerCase().includes(trimmedSearch)
//     );

//     setFilteredProducts(filtered);
//   };

//   // ⌨️ Enter key support
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm("");
//     setFilteredProducts(products);
//   };

//   return (
//     <div className="dealer-shop-container">
//       <div className="fixed-header">
//         <h2>🛒 Dealer Shopping</h2>

//         <div className="header-controls">
//           <div className="search-container">
//             <div className="search-input-wrapper">
//               <input
//                 type="text"
//                 placeholder="Search products by name..."
//                 className="search-input"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={handleKeyPress}
//               />

//               {searchTerm.trim() !== "" && (
//                 <span className="clear-search" onClick={clearSearch}>
//                   ❌
//                 </span>
//               )}
//             </div>

//             <button className="shop-search-btn" onClick={handleSearch}>
//               🔍 Search
//             </button>
//           </div>

//           <div className="header-buttons">
//             <button className="shop-history-btn" onClick={viewHistory}>
//               📋 History
//             </button>

//             <button className="abc-view-cart-btn" onClick={viewCart}>
//               🛍️ View Cart ({cart.length} items)
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="products-container">
//         <div className="products-grid">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => {
//               return (
//                 <div key={product.id} className="product-card">
//                   <img src={product.image} alt={product.name} />
//                   <h6>{product.name}</h6>
//                   <p>{getFormattedPrice(product)}</p>

//                   <button
//                     onClick={() => addToCart(product)}
//                     disabled={addingId === product.id}
//                   >
//                     {addingId === product.id
//                       ? "Adding..."
//                       : addedId === product.id
//                       ? "✅ Added"
//                       : "Add to Cart"}
//                   </button>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="no-results">
//               <h3>No products found</h3>
//               <button onClick={clearSearch}>
//                 Clear Search
//               </button>
//             </div>
//           )}
//         </div>
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

  // Cart state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(`dealerCart_${dealerId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showFullDesc, setShowFullDesc] = useState({});
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  // 🔍 Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Save cart
  useEffect(() => {
    localStorage.setItem(`dealerCart_${dealerId}`, JSON.stringify(cart));
  }, [cart, dealerId]);

  // ✅ CHANGE 1: Updated getFormattedPrice function (variants based)
  const getFormattedPrice = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return "Price not available";
    }

    return product.variants
      .map(v => `₹${v.price} (${v.label})`)
      .join(" | ");
  };

  // ✅ CHANGE 2: Updated addToCart function with weightValue
  const addToCart = (product) => {
    setAddingId(product.id);

    setTimeout(() => {
      const defaultVariant = product.variants[0]; // 👈 first variant

      const existingItem = cart.find(
        (item) =>
          item.id === product.id &&
          item.variantLabel === defaultVariant.label
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === product.id &&
          item.variantLabel === defaultVariant.label
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            id: product.id,
            name: product.name,
            variants: product.variants,   // ✅ SAVE ALL VARIANTS
            variantLabel: defaultVariant.label,
            price: defaultVariant.price,
            quantity: 1,
            weightValue: defaultVariant.label,   // ✅ ADDED: SAVE "10kg" / "20kg"
          },
        ];
      }

      setCart(updatedCart);
      setAddingId(null);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
    }, 300);
  };

  const toggleDesc = (id) =>
    setShowFullDesc((prev) => ({ ...prev, [id]: !prev[id] }));

  const viewCart = () => navigate(`/cart/${dealerId}`);
  const viewHistory = () => navigate(`/history/${dealerId}`);

  // 🔍 SEARCH LOGIC
  const handleSearch = () => {
    const trimmedSearch = searchTerm.trim().toLowerCase();

    if (trimmedSearch === "") {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(trimmedSearch)
    );

    setFilteredProducts(filtered);
  };

  // ⌨️ Enter key support
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredProducts(products);
  };

  return (
    <div className="dealer-shop-container">
      <div className="fixed-header">
        <h2>🛒 Dealer Shopping</h2>

        <div className="header-controls">
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search products by name..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              {searchTerm.trim() !== "" && (
                <span className="clear-search" onClick={clearSearch}>
                  ❌
                </span>
              )}
            </div>

            <button className="shop-search-btn" onClick={handleSearch}>
              🔍 Search
            </button>
          </div>

          <div className="header-buttons">
            <button className="shop-history-btn" onClick={viewHistory}>
              📋 History
            </button>

            <button className="abc-view-cart-btn" onClick={viewCart}>
              🛍️ View Cart ({cart.length} items)
            </button>
          </div>
        </div>
      </div>

      <div className="products-container">
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              return (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <h6>{product.name}</h6>
                  <p>{getFormattedPrice(product)}</p>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={addingId === product.id}
                  >
                    {addingId === product.id
                      ? "Adding..."
                      : addedId === product.id
                      ? "✅ Added"
                      : "Add to Cart"}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
              <button onClick={clearSearch}>
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerShop;