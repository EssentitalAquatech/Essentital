
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











// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/api";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Login.css";

// function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState(1); // 1 = email, 2 = otp
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) navigate("/maindashboard");
//   }, [navigate]);

//   // ✅ SEND OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await api.post("/api/user/send-otp", { email });
//       alert("OTP sent to your email");
//       setStep(2);
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ VERIFY OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post("/api/user/verify-otp", {
//         email,
//         otp,
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("userId", res.data.user._id);

//       navigate("/maindashboard");

//     } catch (error) {
//       alert(error.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page-body">
//       <div className="login-container-wrapper">

//         <h2>Email OTP Login</h2>

//         {step === 1 && (
//           <form onSubmit={handleSendOtp}>
//             <label>Email Address</label>
//             <input
//               type="email"
//               className="login-form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <button type="submit" disabled={loading}>
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </form>
//         )}

//         {step === 2 && (
//           <form onSubmit={handleVerifyOtp}>
//             <label>Enter OTP</label>
//             <input
//               type="text"
//               className="login-form-control"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />

//             <button type="submit" disabled={loading}>
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </form>
//         )}

//       </div>
//     </div>
//   );
// }

// export default Login;



















import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = email, 2 = otp
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // ✅ Auto Login Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/maindashboard");
  }, [navigate]);

  // ✅ OTP Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/user/send-otp", { email });
      setStep(2);
      setTimer(60);
      alert("OTP sent successfully to your email");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/user/verify-otp", { email, otp });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("username", res.data.user.name || "");

      navigate("/maindashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
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
          <button className="login-tab-button login-tab-active">
            OTP Login
          </button>
          <Link to="/signup">
            <button className="login-tab-button">Sign Up</button>
          </Link>
        </div>

        {/* STEP INDICATOR */}
        <p style={{ marginBottom: "20px", fontWeight: "600" }}>
          {step === 1 ? "Step 1: Enter Email" : "Step 2: Verify OTP"}
        </p>

        {/* ================= EMAIL STEP ================= */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="login-form-container">

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

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>

          </form>
        )}

        {/* ================= OTP STEP ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="login-form-container">

            <label className="login-form-label">Enter OTP</label>
            <div className="login-input-wrapper">
              <input
                type="text"
                className="login-form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            {/* RESEND + CHANGE EMAIL */}
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              {timer > 0 ? (
                <p style={{ fontSize: "14px", color: "#718096" }}>
                  Resend OTP in {timer}s
                </p>
              ) : (
                <button
                  type="button"
                  className="login-bottom-link"
                  style={{ background: "none", border: "none" }}
                  onClick={handleSendOtp}
                >
                  Resend OTP
                </button>
              )}

              <br />

              <button
                type="button"
                className="login-bottom-link"
                style={{ background: "none", border: "none", marginTop: "8px" }}
                onClick={() => {
                  setStep(1);
                  setOtp("");
                }}
              >
                Change Email
              </button>
            </div>

          </form>
        )}

        {/* ================= ADMIN LOGIN ================= */}
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
