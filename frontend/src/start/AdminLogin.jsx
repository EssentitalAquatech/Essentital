

import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faUserShield,
  faExclamationCircle,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import "./AdminLogin.css" ;
function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await api.post(
        "/api/admin/login",
        { email, password }
      );

      setSuccess(res.data.message);
      
      // Store admin data
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("isAdmin", "true");
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberAdmin", "true");
        localStorage.setItem("adminEmail", email);
      } else {
        localStorage.removeItem("rememberAdmin");
        localStorage.removeItem("adminEmail");
      }
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate("/admin/adminDashboard");
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        <div className="admin-login-header">
          <FontAwesomeIcon icon={faUserShield} size="2x" color="#667eea" />
          <h2>Admin Login</h2>
          <p>Access the administration dashboard</p>
        </div>

        {error && (
          <div className="error-message">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>{success}</span>
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label htmlFor="adminEmail">Admin Email</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                id="adminEmail"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faLock} />
              <input
                id="adminPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberAdmin"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="rememberAdmin">Remember me</label>
            </div>
            
            <a href="/admin/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div> */}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Authenticating...
              </>
            ) : (
              "Login as Admin"
            )}
          </button>
        </form>

        {/* <div className="login-footer">
          <p>Ensure you're accessing from a secure device</p>
          <p>
            Need help? <a href="/admin/support">Contact Support</a>
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default AdminLogin;
