


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { googleLogin } from "../firebase";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 


const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await api.post("/api/user/login", {
      email,
      password,
    });

    alert(res.data.message);

    localStorage.setItem("userId", res.data.user._id);
    localStorage.setItem("username", res.data.user.name);
    localStorage.setItem("photo", res.data.user.photo || "/profile.png");
    localStorage.setItem("isFirstLogin", String(res.data.isFirstLogin));

    navigate("/maindashboard");
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};



  const handleGoogleLogin = async () => {
    try {
      const token = await googleLogin();
      const res = await api.post("/api/user/google-login", {
        token: token,
      });

      const user = res.data.user;
      localStorage.setItem("userId", user._id);
      localStorage.setItem("username", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("photo", user.photo || "/profile.png");

      console.log("Google Login Success:", user);
      navigate("/maindashboard");

    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google login failed");
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
            <i className="bi bi-envelope-fill login-input-icon-left"></i>
            <input
              type="email"
              className="login-form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-label-row">
            <label className="login-form-label">Password</label>
            {/* <Link to="/reset" className="login-forgot-link">Forgot password?</Link> */}
          </div>

          <div className="login-input-wrapper">
            <i className="bi bi-lock-fill login-input-icon-left"></i>
            <input
              type={showPassword ? "text" : "password"}
              className="login-form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              className="login-eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}
            </button>
          </div>

          <button
  type="submit"
  className="login-submit-btn"
  disabled={loading}
>
  {loading ? (
    <>
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      ></span>
      Login In...
    </>
  ) : (
    "Log In"
  )}
</button>

        </form>

        <div className="login-or-divider">
          <span>OR</span>
        </div>

        <button
          className="login-admin-btn"
          onClick={() => navigate("/admin/login")}
        >
          Login as Admin
        </button>

        

        <p className="login-bottom-text">
          Don't have an account yet? <Link to="/signup" className="login-bottom-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
