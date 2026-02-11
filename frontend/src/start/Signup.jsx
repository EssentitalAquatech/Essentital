


// import api from "../utils/api";
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Signup.css";

// function Signup() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [formData, setFormData] = useState({
//     name: "",
//     mobile: "",
//     email: "",
//     age: "",
//     address: "",
//     accountNumber: "",
//     confirmAccountNumber: "",
//     ifsc: "",
//     password: "",
//   });

//   const [files, setFiles] = useState({
//     profile: null,
//     aadharFront: null,
//     aadharBack: null,
//     pan: null,
//     savingImg: null,
//   });

//   // ✅ File validation
//   const validateFiles = () => {
//     const newErrors = {};
//     const requiredFiles = ["aadharFront", "aadharBack", "pan", "savingImg"];
    
//     requiredFiles.forEach(fileName => {
//       if (!files[fileName]) {
//         newErrors[fileName] = `Please upload ${fileName.replace(/([A-Z])/g, ' $1')}`;
//       } else {
//         // Check file size (5MB limit)
//         if (files[fileName].size > 5 * 1024 * 1024) {
//           newErrors[fileName] = "File size must be less than 5MB";
//         }
        
//         // Check file type
//         if (!files[fileName].type.startsWith('image/')) {
//           newErrors[fileName] = "Only image files are allowed";
//         }
//       }
//     });
    
//     return newErrors;
//   };

//   const handleInput = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     // Clear error when user types
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const handleFile = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     if (selectedFiles && selectedFiles[0]) {
//       setFiles({ ...files, [name]: selectedFiles[0] });
      
//       // Clear file error
//       if (errors[name]) {
//         setErrors({ ...errors, [name]: "" });
//       }
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     // ✅ Clear previous errors
//     setErrors({});

//     // ✅ Validate account numbers
//     if (formData.accountNumber !== formData.confirmAccountNumber) {
//       setErrors({ accountNumber: "Account numbers do not match" });
//       alert("Account numbers do not match");
//       return;
//     }

//     // ✅ Validate required files
//     const fileErrors = validateFiles();
//     if (Object.keys(fileErrors).length > 0) {
//       setErrors(fileErrors);
      
//       // Show first error
//       const firstError = Object.values(fileErrors)[0];
//       alert(firstError);
//       return;
//     }

//     // ✅ Validate required fields
//     const requiredFields = ["name", "mobile", "email", "age", "address", "accountNumber", "ifsc", "password"];
//     const missingFields = requiredFields.filter(field => !formData[field]);
    
//     if (missingFields.length > 0) {
//       alert(`Please fill all required fields: ${missingFields.join(", ")}`);
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log("📤 Starting signup...");
      
//       const form = new FormData();

//       // Add form data
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== "") {
//           form.append(key, value);
//         }
//       });

//       // Add files
//       Object.entries(files).forEach(([key, value]) => {
//         if (value) {
//           console.log(`📄 Adding file ${key}: ${value.name}`);
//           form.append(key, value);
//         }
//       });

//       console.log("📨 Sending signup request...");

//       const response = await api.post(
//         "/api/user/signup",
//         form,
//         { 
//           headers: { 
//             "Content-Type": "multipart/form-data",
//           } 
//         }
//       );

//       console.log("✅ Signup successful:", response.data);

//       // ✅ Show success message
//       alert("🎉 Signup successful! Your account has been created. Please login with your credentials.");
      
//       // ✅ Clear form
//       setFormData({
//         name: "",
//         mobile: "",
//         email: "",
//         age: "",
//         address: "",
//         accountNumber: "",
//         confirmAccountNumber: "",
//         ifsc: "",
//         password: "",
//       });
      
//       setFiles({
//         profile: null,
//         aadharFront: null,
//         aadharBack: null,
//         pan: null,
//         savingImg: null,
//       });

//       // ✅ Redirect to login
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);

//     } catch (error) {
//       console.error("❌ Signup Error:", error);
      
//       let errorMessage = "Signup failed. Please try again.";
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       alert(errorMessage);
      
//       // Set specific errors if available
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ File preview function (optional)
//   const getFilePreview = (file) => {
//     if (!file) return null;
//     return URL.createObjectURL(file);
//   };

//   return (
//     <div className="signup-page-body">
//       <div className="signup-main-wrapper">
//         <div className="signup-logo-circle">
//           <img src="/CompanyLogo.png" alt="logo" />
//         </div>

//         <h2 className="signup-company-title">
//           Essential Aquatech <span className="signup-tm-symbol">™</span>
//         </h2>

//         <div className="signup-tabs-container">
//           <Link to="/login">
//             <button className="signup-tab-button">Login</button>
//           </Link>
//           <button className="signup-tab-button signup-tab-active">
//             Sign Up
//           </button>
//         </div>

//         <form
//           onSubmit={handleSignup}
//           className="signup-form-container"
//           encType="multipart/form-data"
//         >
//           <label className="signup-form-label">Name *</label>
//           <input
//             type="text"
//             className="signup-input-field"
//             name="name"
//             required
//             value={formData.name}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Mobile No *</label>
//           <input
//             type="tel"
//             className="signup-input-field"
//             name="mobile"
//             required
//             value={formData.mobile}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Email *</label>
//           <input
//             type="email"
//             className="signup-input-field"
//             name="email"
//             required
//             value={formData.email}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Upload Profile Picture</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="profile"
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.profile && (
//             <small className="text-success">
//               ✓ Selected: {files.profile.name}
//             </small>
//           )}

//           <label className="signup-form-label">Age *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="age"
//             required
//             min="18"
//             value={formData.age}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Address *</label>
//           <textarea
//             className="signup-input-field"
//             name="address"
//             rows="3"
//             required
//             value={formData.address}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Aadhar Front *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="aadharFront"
//             required
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.aadharFront && (
//             <small className="text-success">
//               ✓ Selected: {files.aadharFront.name}
//             </small>
//           )}
//           {errors.aadharFront && (
//             <small className="text-danger">{errors.aadharFront}</small>
//           )}

//           <label className="signup-form-label">Aadhar Back *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="aadharBack"
//             required
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.aadharBack && (
//             <small className="text-success">
//               ✓ Selected: {files.aadharBack.name}
//             </small>
//           )}
//           {errors.aadharBack && (
//             <small className="text-danger">{errors.aadharBack}</small>
//           )}

//           <label className="signup-form-label">PAN Card *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="pan"
//             required
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.pan && (
//             <small className="text-success">
//               ✓ Selected: {files.pan.name}
//             </small>
//           )}
//           {errors.pan && (
//             <small className="text-danger">{errors.pan}</small>
//           )}

//           <label className="signup-form-label">Account Number *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="accountNumber"
//             required
//             value={formData.accountNumber}
//             onChange={handleInput}
//           />
//           {errors.accountNumber && (
//             <small className="text-danger">{errors.accountNumber}</small>
//           )}

//           <label className="signup-form-label">Confirm Account Number *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="confirmAccountNumber"
//             required
//             value={formData.confirmAccountNumber}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">IFSC Code *</label>
//           <input
//             type="text"
//             className="signup-input-field"
//             name="ifsc"
//             required
//             value={formData.ifsc}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Saving Account Image *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="savingImg"
//             required
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.savingImg && (
//             <small className="text-success">
//               ✓ Selected: {files.savingImg.name}
//             </small>
//           )}
//           {errors.savingImg && (
//             <small className="text-danger">{errors.savingImg}</small>
//           )}

//           <label className="signup-form-label">Password *</label>
//           <input
//             type="password"
//             className="signup-input-field"
//             name="password"
//             required
//             minLength="6"
//             value={formData.password}
//             onChange={handleInput}
//           />

//           <button
//             type="submit"
//             className="signup-submit-btn"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                 ></span>
//                 Creating Account...
//               </>
//             ) : (
//               "Sign Up"
//             )}
//           </button>

//           <div className="text-center mt-3">
//             <p>
//               Already have an account?{" "}
//               <Link to="/login" className="text-primary">
//                 Login here
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Signup;






//uper vala sahi hai bina otp ke signup ke liye 



















// import api from "../utils/api";
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Signup.css";

// function Signup() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [emailVerified, setEmailVerified] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [errors, setErrors] = useState({});

//   const [formData, setFormData] = useState({
//     name: "",
//     mobile: "",
//     email: "",
//     age: "",
//     address: "",
//     accountNumber: "",
//     confirmAccountNumber: "",
//     ifsc: "",
//     password: "",
//   });

//   const [files, setFiles] = useState({
//     profile: null,
//     aadharFront: null,
//     aadharBack: null,
//     pan: null,
//     savingImg: null,
//   });

//   // ✅ File validation
//   const validateFiles = () => {
//     const newErrors = {};
//     const requiredFiles = ["aadharFront", "aadharBack", "pan", "savingImg"];
    
//     requiredFiles.forEach(fileName => {
//       if (!files[fileName]) {
//         newErrors[fileName] = `Please upload ${fileName.replace(/([A-Z])/g, ' $1')}`;
//       } else {
//         // Check file size (5MB limit)
//         if (files[fileName].size > 5 * 1024 * 1024) {
//           newErrors[fileName] = "File size must be less than 5MB";
//         }
        
//         // Check file type
//         if (!files[fileName].type.startsWith('image/')) {
//           newErrors[fileName] = "Only image files are allowed";
//         }
//       }
//     });
    
//     return newErrors;
//   };

//   const handleInput = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     // Clear error when user types
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }

//     // Reset verification when email changes
//     if (name === "email") {
//       setEmailVerified(false);
//       setOtpSent(false);
//       setOtp("");
//     }
//   };

//   const handleFile = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     if (selectedFiles && selectedFiles[0]) {
//       setFiles({ ...files, [name]: selectedFiles[0] });
      
//       // Clear file error
//       if (errors[name]) {
//         setErrors({ ...errors, [name]: "" });
//       }
//     }
//   };

//   // ✅ SEND OTP
//   const handleSendOtp = async () => {
//     if (!formData.email) {
//       alert("Please enter email first");
//       return;
//     }

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       alert("Please enter a valid email address");
//       return;
//     }

//     try {
//       setOtpLoading(true);
//       await api.post("/api/user/send-otp", { email: formData.email });
//       setOtpSent(true);
//       alert("✅ OTP sent to your email. Please check your inbox.");
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // ✅ VERIFY OTP
//   const handleVerifyOtp = async () => {
//     if (!otp) {
//       alert("Please enter OTP first");
//       return;
//     }

//     if (otp.length !== 6) {
//       alert("OTP must be 6 digits");
//       return;
//     }

//     try {
//       setOtpLoading(true);
//       await api.post("/api/user/verify-otp", {
//         email: formData.email,
//         otp,
//       });

//       setEmailVerified(true);
//       alert("✅ Email verified successfully!");
//     } catch (error) {
//       alert(error.response?.data?.message || "Invalid OTP. Please try again.");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     // ✅ Check email verification
//     if (!emailVerified) {
//       alert("Please verify your email first");
//       return;
//     }

//     // ✅ Clear previous errors
//     setErrors({});

//     // ✅ Validate account numbers
//     if (formData.accountNumber !== formData.confirmAccountNumber) {
//       setErrors({ accountNumber: "Account numbers do not match" });
//       alert("Account numbers do not match");
//       return;
//     }

//     // ✅ Validate required files
//     const fileErrors = validateFiles();
//     if (Object.keys(fileErrors).length > 0) {
//       setErrors(fileErrors);
      
//       // Show first error
//       const firstError = Object.values(fileErrors)[0];
//       alert(firstError);
//       return;
//     }

//     // ✅ Validate required fields
//     const requiredFields = ["name", "mobile", "email", "age", "address", "accountNumber", "ifsc", "password"];
//     const missingFields = requiredFields.filter(field => !formData[field]);
    
//     if (missingFields.length > 0) {
//       alert(`Please fill all required fields: ${missingFields.join(", ")}`);
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log("📤 Starting signup...");
      
//       const form = new FormData();

//       // Add form data
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== "") {
//           form.append(key, value);
//         }
//       });

//       // Add files
//       Object.entries(files).forEach(([key, value]) => {
//         if (value) {
//           console.log(`📄 Adding file ${key}: ${value.name}`);
//           form.append(key, value);
//         }
//       });

//       console.log("📨 Sending signup request...");

//       const response = await api.post(
//         "/api/user/signup",
//         form,
//         { 
//           headers: { 
//             "Content-Type": "multipart/form-data",
//           } 
//         }
//       );

//       console.log("✅ Signup successful:", response.data);

//       // ✅ Show success message
//       alert("🎉 Signup successful! Your account has been created. Please login with your credentials.");
      
//       // ✅ Clear form
//       setFormData({
//         name: "",
//         mobile: "",
//         email: "",
//         age: "",
//         address: "",
//         accountNumber: "",
//         confirmAccountNumber: "",
//         ifsc: "",
//         password: "",
//       });
      
//       setFiles({
//         profile: null,
//         aadharFront: null,
//         aadharBack: null,
//         pan: null,
//         savingImg: null,
//       });

//       setOtpSent(false);
//       setEmailVerified(false);
//       setOtp("");

//       // ✅ Redirect to login
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);

//     } catch (error) {
//       console.error("❌ Signup Error:", error);
      
//       let errorMessage = "Signup failed. Please try again.";
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       alert(errorMessage);
      
//       // Set specific errors if available
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ File preview function (optional)
//   const getFilePreview = (file) => {
//     if (!file) return null;
//     return URL.createObjectURL(file);
//   };

//   return (
//     <div className="signup-page-body">
//       <div className="signup-main-wrapper">
//         <div className="signup-logo-circle">
//           <img src="/CompanyLogo.png" alt="logo" />
//         </div>

//         <h2 className="signup-company-title">
//           Essential Aquatech <span className="signup-tm-symbol">™</span>
//         </h2>

//         <div className="signup-tabs-container">
//           <Link to="/login">
//             <button className="signup-tab-button">Login</button>
//           </Link>
//           <button className="signup-tab-button signup-tab-active">
//             Sign Up
//           </button>
//         </div>

//         <form
//           onSubmit={handleSignup}
//           className="signup-form-container"
//           encType="multipart/form-data"
//         >
//           <label className="signup-form-label">Name *</label>
//           <input
//             type="text"
//             className="signup-input-field"
//             name="name"
//             required
//             value={formData.name}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Mobile No *</label>
//           <input
//             type="tel"
//             className="signup-input-field"
//             name="mobile"
//             required
//             value={formData.mobile}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Email *</label>
//           <div className="signup-email-verification-container">
//             <input
//               type="email"
//               className="signup-input-field"
//               name="email"
//               required
//               value={formData.email}
//               onChange={handleInput}
//               disabled={emailVerified}
//             />
            
//             {!otpSent && !emailVerified && (
//               <button
//                 type="button"
//                 onClick={handleSendOtp}
//                 disabled={otpLoading || !formData.email}
//                 className="signup-otp-btn"
//               >
//                 {otpLoading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                     Sending...
//                   </>
//                 ) : (
//                   "Send OTP"
//                 )}
//               </button>
//             )}

//             {otpSent && !emailVerified && (
//               <div className="signup-otp-verification-group">
//                 <div className="signup-otp-input-group">
//                   <input
//                     type="text"
//                     className="signup-input-field signup-otp-input"
//                     placeholder="Enter 6-digit OTP"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
//                     maxLength="6"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleVerifyOtp}
//                     disabled={otpLoading || otp.length !== 6}
//                     className="signup-verify-btn"
//                   >
//                     {otpLoading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                         Verifying...
//                       </>
//                     ) : (
//                       "Verify"
//                     )}
//                   </button>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={handleSendOtp}
//                   disabled={otpLoading}
//                   className="signup-resend-otp-btn"
//                 >
//                   Resend OTP
//                 </button>
//               </div>
//             )}

//             {emailVerified && (
//               <div className="signup-verified-badge">
//                 <span className="signup-verified-icon">✓</span> Email Verified
//               </div>
//             )}
//           </div>

//           <label className="signup-form-label">Upload Profile Picture</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="profile"
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.profile && (
//             <small className="signup-file-success">
//               ✓ Selected: {files.profile.name}
//             </small>
//           )}

//           <label className="signup-form-label">Age *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="age"
//             required
//             min="18"
//             max="120"
//             value={formData.age}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Address *</label>
//           <textarea
//             className="signup-input-field"
//             name="address"
//             rows="3"
//             required
//             value={formData.address}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Aadhar Front *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="aadharFront"
//             required
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.aadharFront && (
//             <small className="signup-file-success">
//               ✓ Selected: {files.aadharFront.name}
//             </small>
//           )}
//           {errors.aadharFront && (
//             <small className="signup-error-text">{errors.aadharFront}</small>
//           )}

//           <label className="signup-form-label">Aadhar Back *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="aadharBack"
//             required
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.aadharBack && (
//             <small className="signup-file-success">
//               ✓ Selected: {files.aadharBack.name}
//             </small>
//           )}
//           {errors.aadharBack && (
//             <small className="signup-error-text">{errors.aadharBack}</small>
//           )}

//           <label className="signup-form-label">PAN Card *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="pan"
//             required
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.pan && (
//             <small className="signup-file-success">
//               ✓ Selected: {files.pan.name}
//             </small>
//           )}
//           {errors.pan && (
//             <small className="signup-error-text">{errors.pan}</small>
//           )}

//           <label className="signup-form-label">Account Number *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="accountNumber"
//             required
//             value={formData.accountNumber}
//             onChange={handleInput}
//           />
//           {errors.accountNumber && (
//             <small className="signup-error-text">{errors.accountNumber}</small>
//           )}

//           <label className="signup-form-label">Confirm Account Number *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="confirmAccountNumber"
//             required
//             value={formData.confirmAccountNumber}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">IFSC Code *</label>
//           <input
//             type="text"
//             className="signup-input-field"
//             name="ifsc"
//             required
//             value={formData.ifsc}
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Saving Account Image *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="savingImg"
//             required
//             accept="image/*"
//             onChange={handleFile}
//           />
//           {files.savingImg && (
//             <small className="signup-file-success">
//               ✓ Selected: {files.savingImg.name}
//             </small>
//           )}
//           {errors.savingImg && (
//             <small className="signup-error-text">{errors.savingImg}</small>
//           )}

//           <label className="signup-form-label">Password *</label>
//           <input
//             type="password"
//             className="signup-input-field"
//             name="password"
//             required
//             minLength="6"
//             value={formData.password}
//             onChange={handleInput}
//           />

//           <button
//             type="submit"
//             className="signup-submit-btn"
//             disabled={loading || !emailVerified}
//           >
//             {loading ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                 ></span>
//                 Creating Account...
//               </>
//             ) : (
//               "Sign Up"
//             )}
//           </button>

//           <div className="text-center mt-3">
//             <p>
//               Already have an account?{" "}
//               <Link to="/login" className="text-primary">
//                 Login here
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Signup;







//ye uper vala sahi hai signup ke liye




import api from "../utils/api";
import React, { useState, useEffect } from "react"; // ✅ Updated import
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  
  // ✅ 1️⃣ State add kiya - Timer
  const [timer, setTimer] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    age: "",
    address: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: "",
    password: "",
  });

  const [files, setFiles] = useState({
    profile: null,
    aadharFront: null,
    aadharBack: null,
    pan: null,
    savingImg: null,
  });

  // ✅ 3️⃣ Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ File validation
  const validateFiles = () => {
    const newErrors = {};
    const requiredFiles = ["aadharFront", "aadharBack", "pan", "savingImg"];
    
    requiredFiles.forEach(fileName => {
      if (!files[fileName]) {
        newErrors[fileName] = `Please upload ${fileName.replace(/([A-Z])/g, ' $1')}`;
      } else {
        // Check file size (5MB limit)
        if (files[fileName].size > 5 * 1024 * 1024) {
          newErrors[fileName] = "File size must be less than 5MB";
        }
        
        // Check file type
        if (!files[fileName].type.startsWith('image/')) {
          newErrors[fileName] = "Only image files are allowed";
        }
      }
    });
    
    return newErrors;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Reset verification when email changes
    if (name === "email") {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp("");
      setTimer(0); // ✅ Reset timer when email changes
    }
  };

  const handleFile = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles({ ...files, [name]: selectedFiles[0] });
      
      // Clear file error
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  // ✅ SEND OTP
  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter email first");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      setOtpLoading(true);
      await api.post("/api/user/send-otp", { email: formData.email });
      setOtpSent(true);
      // ✅ 2️⃣ Send OTP ke baad timer start
      setTimer(60);
      alert("✅ OTP sent to your email. Please check your inbox.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP first");
      return;
    }

    if (otp.length !== 6) {
      alert("OTP must be 6 digits");
      return;
    }

    try {
      setOtpLoading(true);
      await api.post("/api/user/verify-otp", {
        email: formData.email,
        otp,
      });

      setEmailVerified(true);
      setTimer(0); // ✅ Stop timer after verification
      alert("✅ Email verified successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Check email verification
    if (!emailVerified) {
      alert("Please verify your email first");
      return;
    }

    // ✅ Clear previous errors
    setErrors({});

    // ✅ Validate account numbers
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setErrors({ accountNumber: "Account numbers do not match" });
      alert("Account numbers do not match");
      return;
    }

    // ✅ Validate required files
    const fileErrors = validateFiles();
    if (Object.keys(fileErrors).length > 0) {
      setErrors(fileErrors);
      
      // Show first error
      const firstError = Object.values(fileErrors)[0];
      alert(firstError);
      return;
    }

    // ✅ Validate required fields
    const requiredFields = ["name", "mobile", "email", "age", "address", "accountNumber", "ifsc", "password"];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      console.log("📤 Starting signup...");
      
      const form = new FormData();

      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") {
          form.append(key, value);
        }
      });

      // Add files
      Object.entries(files).forEach(([key, value]) => {
        if (value) {
          console.log(`📄 Adding file ${key}: ${value.name}`);
          form.append(key, value);
        }
      });

      console.log("📨 Sending signup request...");

      const response = await api.post(
        "/api/user/signup",
        form,
        { 
          headers: { 
            "Content-Type": "multipart/form-data",
          } 
        }
      );

      console.log("✅ Signup successful:", response.data);

      // ✅ Show success message
      alert("🎉 Signup successful! Your account has been created. Please login with your credentials.");
      
      // ✅ Clear form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        age: "",
        address: "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifsc: "",
        password: "",
      });
      
      setFiles({
        profile: null,
        aadharFront: null,
        aadharBack: null,
        pan: null,
        savingImg: null,
      });

      setOtpSent(false);
      setEmailVerified(false);
      setOtp("");
      setTimer(0); // ✅ Reset timer

      // ✅ Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error("❌ Signup Error:", error);
      
      let errorMessage = "Signup failed. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      
      // Set specific errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ File preview function (optional)
  const getFilePreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
  };

  return (
    <div className="signup-page-body">
      <div className="signup-main-wrapper">
        <div className="signup-logo-circle">
          <img src="/CompanyLogo.png" alt="logo" />
        </div>

        <h2 className="signup-company-title">
          Essential Aquatech <span className="signup-tm-symbol">™</span>
        </h2>

        <div className="signup-tabs-container">
          <Link to="/login">
            <button className="signup-tab-button">Login</button>
          </Link>
          <button className="signup-tab-button signup-tab-active">
            Sign Up
          </button>
        </div>

        <form
          onSubmit={handleSignup}
          className="signup-form-container"
          encType="multipart/form-data"
        >
          <label className="signup-form-label">Name *</label>
          <input
            type="text"
            className="signup-input-field"
            name="name"
            required
            value={formData.name}
            onChange={handleInput}
          />

          <label className="signup-form-label">Mobile No *</label>
          <input
            type="tel"
            className="signup-input-field"
            name="mobile"
            required
            value={formData.mobile}
            onChange={handleInput}
          />

          <label className="signup-form-label">Email *</label>
          <div className="signup-email-verification-container">
            <input
              type="email"
              className="signup-input-field"
              name="email"
              required
              value={formData.email}
              onChange={handleInput}
              disabled={emailVerified}
            />
            
            {!otpSent && !emailVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || !formData.email}
                className="signup-otp-btn"
              >
                {otpLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            )}

            {otpSent && !emailVerified && (
              <div className="signup-otp-verification-group">
                <div className="signup-otp-input-group">
                  <input
                    type="text"
                    className="signup-input-field signup-otp-input"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    maxLength="6"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otp.length !== 6}
                    className="signup-verify-btn"
                  >
                    {otpLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
                
                {/* ✅ 4️⃣ Resend Button with Timer */}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || timer > 0}
                  className="signup-resend-otp-btn"
                >
                  {timer > 0 ? (
                    <>
                      <span className="signup-timer-icon">⏱️</span> Resend OTP ({timer}s)
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>
            )}

            {emailVerified && (
              <div className="signup-verified-badge">
                <span className="signup-verified-icon">✓</span> Email Verified
              </div>
            )}
          </div>

          <label className="signup-form-label">Upload Profile Picture</label>
          <input
            type="file"
            className="signup-input-field"
            name="profile"
            accept="image/*"
            onChange={handleFile}
          />
          {files.profile && (
            <small className="signup-file-success">
              ✓ Selected: {files.profile.name}
            </small>
          )}

          <label className="signup-form-label">Age *</label>
          <input
            type="number"
            className="signup-input-field"
            name="age"
            required
            min="18"
            max="120"
            value={formData.age}
            onChange={handleInput}
          />

          <label className="signup-form-label">Address *</label>
          <textarea
            className="signup-input-field"
            name="address"
            rows="3"
            required
            value={formData.address}
            onChange={handleInput}
          />

          <label className="signup-form-label">Aadhar Front *</label>
          <input
            type="file"
            className="signup-input-field"
            name="aadharFront"
            required
            accept="image/*"
            onChange={handleFile}
          />
          {files.aadharFront && (
            <small className="signup-file-success">
              ✓ Selected: {files.aadharFront.name}
            </small>
          )}
          {errors.aadharFront && (
            <small className="signup-error-text">{errors.aadharFront}</small>
          )}

          <label className="signup-form-label">Aadhar Back *</label>
          <input
            type="file"
            className="signup-input-field"
            name="aadharBack"
            required
            accept="image/*"
            onChange={handleFile}
          />
          {files.aadharBack && (
            <small className="signup-file-success">
              ✓ Selected: {files.aadharBack.name}
            </small>
          )}
          {errors.aadharBack && (
            <small className="signup-error-text">{errors.aadharBack}</small>
          )}

          <label className="signup-form-label">PAN Card *</label>
          <input
            type="file"
            className="signup-input-field"
            name="pan"
            required
            accept="image/*"
            onChange={handleFile}
          />
          {files.pan && (
            <small className="signup-file-success">
              ✓ Selected: {files.pan.name}
            </small>
          )}
          {errors.pan && (
            <small className="signup-error-text">{errors.pan}</small>
          )}

          <label className="signup-form-label">Account Number *</label>
          <input
            type="number"
            className="signup-input-field"
            name="accountNumber"
            required
            value={formData.accountNumber}
            onChange={handleInput}
          />
          {errors.accountNumber && (
            <small className="signup-error-text">{errors.accountNumber}</small>
          )}

          <label className="signup-form-label">Confirm Account Number *</label>
          <input
            type="number"
            className="signup-input-field"
            name="confirmAccountNumber"
            required
            value={formData.confirmAccountNumber}
            onChange={handleInput}
          />

          <label className="signup-form-label">IFSC Code *</label>
          <input
            type="text"
            className="signup-input-field"
            name="ifsc"
            required
            value={formData.ifsc}
            onChange={handleInput}
          />

          <label className="signup-form-label">Saving Account Image *</label>
          <input
            type="file"
            className="signup-input-field"
            name="savingImg"
            required
            accept="image/*"
            onChange={handleFile}
          />
          {files.savingImg && (
            <small className="signup-file-success">
              ✓ Selected: {files.savingImg.name}
            </small>
          )}
          {errors.savingImg && (
            <small className="signup-error-text">{errors.savingImg}</small>
          )}

          <label className="signup-form-label">Password *</label>
          <input
            type="password"
            className="signup-input-field"
            name="password"
            required
            minLength="6"
            value={formData.password}
            onChange={handleInput}
          />

          <button
            type="submit"
            className="signup-submit-btn"
            disabled={loading || !emailVerified}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="text-center mt-3">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;