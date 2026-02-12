
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










// ye bilkul sahi hai bina otp vala


















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
  
  // ✅ STEP 1 — State Add Karo
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

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

  // ✅ STEP 2 — API Functions Add Karo
  // Send OTP - 🔁 UPDATED ENDPOINT
  const handleSendOtp = async () => {
    try {
      await api.post("/api/user/forgot-password", { email });
      alert("OTP sent to your email");
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  // Verify OTP - 🔁 FIXED: OTP sent as string
  const handleVerifyOtp = async () => {
    try {
      await api.post("/api/user/verify-forgot-password-otp", { email, otp: otp.toString() });
      alert("OTP verified");
      setStep(3);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    try {
      const res = await api.post("/api/user/reset-password", {
        email,
        newPassword,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("username", res.data.user.name);

      alert("Password reset successful");
      navigate("/maindashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Error resetting password");
    }
  };

  // ✅ Back to Login handler
  const handleBackToLogin = () => {
    setIsForgotMode(false);
    setStep(1);
    setOtp("");
    setNewPassword("");
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

        {/* ✅ STEP 4 — Form Replace Logic */}
        <form className="login-form-container" onSubmit={handleLogin}>

          {/* Login Form */}
          {!isForgotMode && (
            <>
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

              {/* ✅ STEP 3 — Forgot Password Button */}
              <div style={{ textAlign: "right", marginBottom: "10px" }}>
                <span
                  style={{ cursor: "pointer", color: "#007bff" }}
                  onClick={() => {
                    setIsForgotMode(true);
                    setStep(1);
                  }}
                >
                  Forgot Password?
                </span>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
            </>
          )}

          {/* Forgot Password - Step 1: Email */}
          {isForgotMode && step === 1 && (
            <>
              <label className="login-form-label">Enter Email</label>
              <div className="login-input-wrapper">
                <input
                  type="email"
                  className="login-form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="button" onClick={handleSendOtp}>
                Send OTP
              </button>

              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <span
                  style={{ cursor: "pointer", color: "#6c757d", fontSize: "14px" }}
                  onClick={handleBackToLogin}
                >
                  ← Back to Login
                </span>
              </div>
            </>
          )}

          {/* Forgot Password - Step 2: OTP */}
          {isForgotMode && step === 2 && (
            <>
              <label className="login-form-label">Enter OTP</label>
              <div className="login-input-wrapper">
                <input
                  type="text"
                  className="login-form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </div>

              <button type="button" onClick={handleVerifyOtp}>
                Verify OTP
              </button>

              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <span
                  style={{ cursor: "pointer", color: "#6c757d", fontSize: "14px" }}
                  onClick={() => setStep(1)}
                >
                  ← Back
                </span>
              </div>
            </>
          )}

          {/* Forgot Password - Step 3: New Password */}
          {isForgotMode && step === 3 && (
            <>
              <label className="login-form-label">Enter New Password</label>
              <div className="login-input-wrapper">
                <input
                  type="password"
                  className="login-form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <button type="button" onClick={handleResetPassword}>
                Reset Password
              </button>

              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <span
                  style={{ cursor: "pointer", color: "#6c757d", fontSize: "14px" }}
                  onClick={() => setStep(2)}
                >
                  ← Back
                </span>
              </div>
            </>
          )}

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