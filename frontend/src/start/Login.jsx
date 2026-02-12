
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ⭐ AUTO LOGIN CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/maindashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/user/login", { email, password });

      // ⭐ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // ⭐ SAVE USER INFO
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("username", res.data.user.name);

      navigate("/maindashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-body">
      <div className="login-container-wrapper">

        <div className="login-logo-container">
          <img src="/CompanyLogo.png" alt="logo" />
        </div>

        <h2 className="login-company-name">
          Essential Aquatech <span className="login-tm-symbol">™</span>
        </h2>

        <div className="login-tabs-container">
          <button className="login-tab-button login-tab-active">Login</button>
          <Link to="/signup">
            <button className="login-tab-button">Sign Up</button>
          </Link>
        </div>

        <form onSubmit={handleLogin} className="login-form-container">

          <label className="login-form-label">Email Address</label>
          <div className="login-input-wrapper">
            <input
              type="email"
              className="login-form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className="login-form-label">Password</label>
          <div className="login-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="login-form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

        </form>

        {/* ================= ADMIN LOGIN BUTTON ================= */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="login-admin-btn"
            onClick={() => navigate("/admin/login")}
          >
            Login as Admin
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;



















// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../utils/api";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Login.css";

// function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // ================= FORGOT PASSWORD STATE =================
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);

//   // ⭐ AUTO LOGIN CHECK
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/maindashboard");
//     }
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post("/api/user/login", { email, password });

//       // ⭐ SAVE TOKEN
//       localStorage.setItem("token", res.data.token);

//       // ⭐ SAVE USER INFO
//       localStorage.setItem("userId", res.data.user._id);
//       localStorage.setItem("username", res.data.user.name);

//       navigate("/maindashboard");

//     } catch (error) {
//       alert(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= SEND OTP =================
//   const handleSendOtp = async () => {
//     if (!forgotEmail) return alert("Enter email");

//     setOtpLoading(true);
//     try {
//       await api.post("/api/user/forgot-password/send-otp", { email: forgotEmail });
//       alert("OTP sent to your email");
//       setOtpSent(true);
//     } catch (err) {
//       alert(err.response?.data?.message || "Error sending OTP");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // ================= VERIFY OTP =================
//   const handleVerifyOtp = async () => {
//     if (!otp) return alert("Enter OTP");

//     setOtpLoading(true);
//     try {
//       await api.post("/api/user/forgot-password/verify-otp", { email: forgotEmail, otp });
//       alert("OTP verified! You can login now.");
//       setOtpVerified(true);
//     } catch (err) {
//       alert(err.response?.data?.message || "OTP verification failed");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   return (
//     <div className="login-page-body">
//       <div className="login-container-wrapper">

//         <div className="login-logo-container">
//           <img src="/CompanyLogo.png" alt="logo" />
//         </div>

//         <h2 className="login-company-name">
//           Essential Aquatech <span className="login-tm-symbol">™</span>
//         </h2>

//         <div className="login-tabs-container">
//           <button className="login-tab-button login-tab-active">Login</button>
//           <Link to="/signup">
//             <button className="login-tab-button">Sign Up</button>
//           </Link>
//         </div>

//         <form onSubmit={handleLogin} className="login-form-container">

//           <label className="login-form-label">Email Address</label>
//           <div className="login-input-wrapper">
//             <input
//               type="email"
//               className="login-form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <label className="login-form-label">Password</label>
//           <div className="login-input-wrapper">
//             <input
//               type={showPassword ? "text" : "password"}
//               className="login-form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               👁
//             </button>
//           </div>

//           <button type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Log In"}
//           </button>

//         </form>

//         {/* ================= FORGOT PASSWORD ================= */}
//         <div className="forgot-password-container" style={{ marginTop: "25px", maxWidth: "380px", marginLeft: "auto", marginRight: "auto" }}>
//           <label className="login-form-label" style={{ marginTop: "0" }}>Forgot Password?</label>
//           {!otpSent ? (
//             <>
//               <div className="login-input-wrapper">
//                 <input
//                   type="email"
//                   className="login-form-control"
//                   placeholder="Enter your email"
//                   value={forgotEmail}
//                   onChange={(e) => setForgotEmail(e.target.value)}
//                 />
//               </div>
//               <button 
//                 onClick={handleSendOtp} 
//                 disabled={otpLoading}
//                 style={{
//                   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                   color: "white",
//                   border: "none",
//                   padding: "14px",
//                   borderRadius: "12px",
//                   fontWeight: "600",
//                   fontSize: "1rem",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                   width: "100%",
//                   boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
//                   marginBottom: "10px"
//                 }}
//               >
//                 {otpLoading ? "Sending..." : "Send OTP"}
//               </button>
//             </>
//           ) : !otpVerified ? (
//             <>
//               <div className="login-input-wrapper">
//                 <input
//                   type="text"
//                   className="login-form-control"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                 />
//               </div>
//               <button 
//                 onClick={handleVerifyOtp} 
//                 disabled={otpLoading}
//                 style={{
//                   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                   color: "white",
//                   border: "none",
//                   padding: "14px",
//                   borderRadius: "12px",
//                   fontWeight: "600",
//                   fontSize: "1rem",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                   width: "100%",
//                   boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
//                   marginBottom: "10px"
//                 }}
//               >
//                 {otpLoading ? "Verifying..." : "Verify OTP"}
//               </button>
//               <button 
//                 onClick={handleSendOtp} 
//                 disabled={otpLoading}
//                 style={{
//                   background: "transparent",
//                   color: "#667eea",
//                   border: "2px solid #667eea",
//                   padding: "12px",
//                   borderRadius: "12px",
//                   fontWeight: "600",
//                   fontSize: "0.95rem",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                   width: "100%",
//                   marginTop: "5px"
//                 }}
//               >
//                 Resend OTP
//               </button>
//             </>
//           ) : (
//             <p style={{ 
//               color: "green", 
//               textAlign: "center", 
//               padding: "12px",
//               background: "#e6ffe6",
//               borderRadius: "12px",
//               fontWeight: "500"
//             }}>
//               ✓ OTP verified. You can now login!
//             </p>
//           )}
//         </div>

//         {/* ================= ADMIN LOGIN BUTTON ================= */}
//         <div style={{ textAlign: "center", marginTop: "20px" }}>
//           <button
//             className="login-admin-btn"
//             onClick={() => navigate("/admin/login")}
//           >
//             Login as Admin
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;









//login bina otp ke 


































// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../utils/api";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Login.css";

// function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // ================= FORGOT PASSWORD STATE =================
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [showForgotOtp, setShowForgotOtp] = useState(false);

//   // ⭐ AUTO LOGIN CHECK
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/maindashboard");
//     }
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post("/api/user/login", { email, password });

//       // ⭐ SAVE TOKEN
//       localStorage.setItem("token", res.data.token);

//       // ⭐ SAVE USER INFO
//       localStorage.setItem("userId", res.data.user._id);
//       localStorage.setItem("username", res.data.user.name);

//       navigate("/maindashboard");

//     } catch (error) {
//       alert(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= SEND OTP =================
//   const handleSendOtp = async () => {
//     if (!email) return alert("Enter email first");
//     if (!showForgotOtp) setShowForgotOtp(true);

//     setOtpLoading(true);
//     try {
//       await api.post("/api/user/forgot-password/send-otp", { email: email });
//       alert("OTP sent to your email");
//       setForgotEmail(email);
//       setOtpSent(true);
//     } catch (err) {
//       alert(err.response?.data?.message || "Error sending OTP");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // ================= VERIFY OTP (UPDATED) =================
//   const handleVerifyOtp = async () => {
//     if (!otp) return alert("Enter OTP");

//     setOtpLoading(true);
//     try {
//       const res = await api.post("/api/user/forgot-password/verify-otp", { email, otp });

//       // 🔥 SAVE TOKEN
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("userId", res.data.user._id);
//       localStorage.setItem("username", res.data.user.name);

//       alert("OTP verified!");

//       navigate("/maindashboard");

//     } catch (err) {
//       alert(err.response?.data?.message || "OTP verification failed");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   return (
//     <div className="login-page-body">
//       <div className="login-container-wrapper">

//         <div className="login-logo-container">
//           <img src="/CompanyLogo.png" alt="logo" />
//         </div>

//         <h2 className="login-company-name">
//           Essential Aquatech <span className="login-tm-symbol">™</span>
//         </h2>

//         <div className="login-tabs-container">
//           <button className="login-tab-button login-tab-active">Login</button>
//           <Link to="/signup">
//             <button className="login-tab-button">Sign Up</button>
//           </Link>
//         </div>

//         <form onSubmit={handleLogin} className="login-form-container">

//           <label className="login-form-label">Email Address</label>
//           <div className="login-input-wrapper">
//             <input
//               type="email"
//               className="login-form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <label className="login-form-label">Password</label>
//           <div className="login-input-wrapper" style={{ position: "relative" }}>
//             <input
//               type={showPassword ? "text" : "password"}
//               className="login-form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)" }}
//             >
//               👁
//             </button>
//             <span 
//               onClick={handleSendOtp}
//               style={{
//                 position: "absolute",
//                 bottom: "-22px",
//                 right: "0",
//                 fontSize: "12px",
//                 color: "#667eea",
//                 cursor: "pointer",
//                 fontWeight: "500",
//                 zIndex: "2"
//               }}
//             >
//               Forgot Password?
//             </span>
//           </div>

//           <button type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Log In"}
//           </button>

//         </form>

//         {/* ================= FORGOT PASSWORD OTP SECTION ================= */}
//         {showForgotOtp && (
//           <div className="forgot-password-container" style={{ marginTop: "35px", maxWidth: "380px", marginLeft: "auto", marginRight: "auto" }}>
//             {!otpVerified ? (
//               <>
//                 <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                   <div style={{ flex: 1 }}>
//                     <div className="login-input-wrapper" style={{ marginBottom: "0" }}>
//                       <input
//                         type="text"
//                         className="login-form-control"
//                         placeholder="Enter OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         style={{ padding: "12px 15px" }}
//                       />
//                     </div>
//                   </div>
//                   <button 
//                     onClick={handleVerifyOtp} 
//                     disabled={otpLoading}
//                     style={{
//                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                       color: "white",
//                       border: "none",
//                       padding: "12px 20px",
//                       borderRadius: "12px",
//                       fontWeight: "600",
//                       fontSize: "0.9rem",
//                       cursor: "pointer",
//                       transition: "all 0.3s ease",
//                       boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
//                       whiteSpace: "nowrap"
//                     }}
//                   >
//                     {otpLoading ? "..." : "Verify"}
//                   </button>
//                 </div>
//                 <button 
//                   onClick={handleSendOtp} 
//                   disabled={otpLoading}
//                   style={{
//                     background: "transparent",
//                     color: "#667eea",
//                     border: "none",
//                     padding: "8px",
//                     borderRadius: "8px",
//                     fontWeight: "500",
//                     fontSize: "0.85rem",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease",
//                     width: "100%",
//                     marginTop: "10px",
//                     textDecoration: "underline"
//                   }}
//                 >
//                   Resend OTP
//                 </button>
//               </>
//             ) : (
//               <p style={{ 
//                 color: "green", 
//                 textAlign: "center", 
//                 padding: "10px",
//                 background: "#e6ffe6",
//                 borderRadius: "12px",
//                 fontWeight: "500",
//                 fontSize: "0.9rem",
//                 marginTop: "10px"
//               }}>
//                 ✓ OTP verified. You can now login!
//               </p>
//             )}
//           </div>
//         )}

//         {/* ================= ADMIN LOGIN BUTTON ================= */}
//         <div style={{ textAlign: "center", marginTop: "25px" }}>
//           <button
//             className="login-admin-btn"
//             onClick={() => navigate("/admin/login")}
//           >
//             Login as Admin
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;