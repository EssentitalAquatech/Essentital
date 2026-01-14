


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



import api from "../utils/api";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };



  const handleSignup = async (e) => {
  e.preventDefault();

  if (formData.accountNumber !== formData.confirmAccountNumber) {
    alert("Account numbers do not match");
    return;
  }

  setLoading(true);

  try {
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) =>
      form.append(key, value)
    );

    Object.entries(files).forEach(([key, value]) =>
      form.append(key, value)
    );

    await api.post(
      "/api/user/signup",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // ✅ NO alert here
    navigate("/login"); // direct redirect
  } catch (error) {
    alert(error.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
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
            onChange={handleInput}
          />

          <label className="signup-form-label">Mobile No *</label>
          <input
            type="number"
            className="signup-input-field"
            name="mobile"
            required
            onChange={handleInput}
          />

          <label className="signup-form-label">Email</label>
          <input
            type="email"
            className="signup-input-field"
            name="email"
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

          <label className="signup-form-label">Age *</label>
          <input
            type="number"
            className="signup-input-field"
            name="age"
            required
            onChange={handleInput}
          />

          <label className="signup-form-label">Address *</label>
          <textarea
            className="signup-input-field"
            name="address"
            rows="3"
            required
            onChange={handleInput}
          />

          <label className="signup-form-label">Aadhar Front *</label>
          <input
            type="file"
            className="signup-input-field"
            name="aadharFront"
            required
            onChange={handleFile}
          />

          <label className="signup-form-label">Aadhar Back *</label>
          <input
            type="file"
            className="signup-input-field"
            name="aadharBack"
            required
            onChange={handleFile}
          />

          <label className="signup-form-label">PAN Card *</label>
          <input
            type="file"
            className="signup-input-field"
            name="pan"
            required
            onChange={handleFile}
          />

          <label className="signup-form-label">Account Number *</label>
          <input
            type="number"
            className="signup-input-field"
            name="accountNumber"
            required
            onChange={handleInput}
          />

          <label className="signup-form-label">Confirm Account Number *</label>
          <input
            type="number"
            className="signup-input-field"
            name="confirmAccountNumber"
            required
            onChange={handleInput}
          />

          <label className="signup-form-label">IFSC Code *</label>
          <input
            type="text"
            className="signup-input-field"
            name="ifsc"
            required
            onChange={handleInput}
          />

          <label className="signup-form-label">Saving Account Image *</label>
          <input
            type="file"
            className="signup-input-field"
            name="savingImg"
            required
            onChange={handleFile}
          />

          <label className="signup-form-label">Password *</label>
          <input
            type="password"
            className="signup-input-field"
            name="password"
            required
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
        </form>
      </div>
    </div>
  );
}

export default Signup;
