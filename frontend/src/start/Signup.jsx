


// import api from "../utils/api";
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { googleLogin } from "../firebase";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Signup.css";

// function Signup() {
//   const navigate = useNavigate();

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

//   const handleInput = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFile = (e) => {
//     setFiles({ ...files, [e.target.name]: e.target.files[0] });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     if (formData.accountNumber !== formData.confirmAccountNumber) {
//       alert("Account numbers do not match");
//       return;
//     }

//     try {
//       const form = new FormData();
//       Object.entries(formData).forEach(([key, value]) =>
//         form.append(key, value)
//       );

//       Object.entries(files).forEach(([key, value]) =>
//         form.append(key, value)
//       );

//       const res = await api.post(
//         "/api/user/signup",
//         form,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       alert(res.data.message);
//       navigate("/login");
//     } catch (error) {
//       alert(error.response?.data?.message || "Signup failed");
//     }
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
//           <button className="signup-tab-button signup-tab-active">Sign Up</button>
//         </div>

//         <form onSubmit={handleSignup} className="signup-form-container" encType="multipart/form-data">
//           <label className="signup-form-label">Name <span className="signup-required-star">*</span></label>
//           <input
//             type="text"
//             className="signup-input-field"
//             name="name"
//             value={formData.name}
//             onChange={handleInput}
//             required
//           />

//           <label className="signup-form-label">Mobile No <span className="signup-required-star">*</span></label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="mobile"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Email</label>
//           <input
//             type="email"
//             className="signup-input-field"
//             name="email"
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

//           <label className="signup-form-label">Age <span className="signup-required-star">*</span></label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="age"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Address <span className="signup-required-star">*</span></label>
//           <textarea
//             className="signup-input-field"
//             name="address"
//             rows="3"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Aadhar Card (Front Side) <span className="signup-required-star">*</span></label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="aadharFront"
//             required
//             onChange={handleFile}
//           />

//           <label className="signup-form-label">Aadhar Card (Back Side) <span className="signup-required-star">*</span></label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="aadharBack"
//             required
//             onChange={handleFile}
//           />

//           <label className="signup-form-label">PAN Card <span className="signup-required-star">*</span></label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="pan"
//             required
//             onChange={handleFile}
//           />

//           <label className="signup-form-label">Saving Account Number <span className="signup-required-star">*</span></label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="accountNumber"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Confirm Account Number <span className="signup-required-star">*</span></label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="confirmAccountNumber"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">IFSC Code <span className="signup-required-star">*</span></label>
//           <input
//             type="text"
//             className="signup-input-field"
//             name="ifsc"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Saving Account Image <span className="signup-required-star">*</span></label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="savingImg"
//             required
//             onChange={handleFile}
//           />

//           <label className="signup-form-label">Create Password <span className="signup-required-star">*</span></label>
//           <input
//             type="password"
//             className="signup-input-field"
//             name="password"
//             required
//             onChange={handleInput}
//           />

//           <button type="submit" className="signup-submit-btn">
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Signup;












//niche vala sahi hai --

// import api from "../utils/api";
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Signup.css";

// function Signup() {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

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

//   const handleInput = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFile = (e) => {
//     setFiles({ ...files, [e.target.name]: e.target.files[0] });
//   };



//   const handleSignup = async (e) => {
//   e.preventDefault();

//   if (formData.accountNumber !== formData.confirmAccountNumber) {
//     alert("Account numbers do not match");
//     return;
//   }

//   setLoading(true);

//   try {
//     const form = new FormData();

//     Object.entries(formData).forEach(([key, value]) =>
//       form.append(key, value)
//     );

//     Object.entries(files).forEach(([key, value]) =>
//       form.append(key, value)
//     );

//     await api.post(
//       "/api/user/signup",
//       form,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     // ✅ NO alert here
//     navigate("/login"); // direct redirect
//   } catch (error) {
//     alert(error.response?.data?.message || "Signup failed");
//   } finally {
//     setLoading(false);
//   }
// };


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
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Mobile No *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="mobile"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Email</label>
//           <input
//             type="email"
//             className="signup-input-field"
//             name="email"
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

//           <label className="signup-form-label">Age *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="age"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Address *</label>
//           <textarea
//             className="signup-input-field"
//             name="address"
//             rows="3"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Aadhar Front *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="aadharFront"
//             required
//             onChange={handleFile}
//           />

//           <label className="signup-form-label">Aadhar Back *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="aadharBack"
//             required
//             onChange={handleFile}
//           />

//           <label className="signup-form-label">PAN Card *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="pan"
//             required
//             onChange={handleFile}
//           />

//           <label className="signup-form-label">Account Number *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="accountNumber"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Confirm Account Number *</label>
//           <input
//             type="number"
//             className="signup-input-field"
//             name="confirmAccountNumber"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">IFSC Code *</label>
//           <input
//             type="text"
//             className="signup-input-field"
//             name="ifsc"
//             required
//             onChange={handleInput}
//           />

//           <label className="signup-form-label">Saving Account Image *</label>
//           <input
//             type="file"
//             className="signup-input-field"
//             name="savingImg"
//             required
//             onChange={handleFile}
//           />

//           <label className="signup-form-label">Password *</label>
//           <input
//             type="password"
//             className="signup-input-field"
//             name="password"
//             required
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
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Signup;




















import api from "../utils/api";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSignup = async (e) => {
    e.preventDefault();

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
          <input
            type="email"
            className="signup-input-field"
            name="email"
            required
            value={formData.email}
            onChange={handleInput}
          />

          <label className="signup-form-label">Upload Profile Picture</label>
          <input
            type="file"
            className="signup-input-field"
            name="profile"
            accept="image/*"
            onChange={handleFile}
          />
          {files.profile && (
            <small className="text-success">
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
            <small className="text-success">
              ✓ Selected: {files.aadharFront.name}
            </small>
          )}
          {errors.aadharFront && (
            <small className="text-danger">{errors.aadharFront}</small>
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
            <small className="text-success">
              ✓ Selected: {files.aadharBack.name}
            </small>
          )}
          {errors.aadharBack && (
            <small className="text-danger">{errors.aadharBack}</small>
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
            <small className="text-success">
              ✓ Selected: {files.pan.name}
            </small>
          )}
          {errors.pan && (
            <small className="text-danger">{errors.pan}</small>
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
            <small className="text-danger">{errors.accountNumber}</small>
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
            <small className="text-success">
              ✓ Selected: {files.savingImg.name}
            </small>
          )}
          {errors.savingImg && (
            <small className="text-danger">{errors.savingImg}</small>
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
            disabled={loading}
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

















