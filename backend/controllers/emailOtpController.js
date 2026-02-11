


// import axios from "axios";
// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";

// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES }
//   );
// };

// // 🔹 SEND OTP
// export const sendEmailOtp = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const response = await axios.post(
//       "https://control.msg91.com/api/v5/otp",
//       {
//         template_id: process.env.MSG91_EMAIL_TEMPLATE_ID,
//         email: email,
//       },
//       {
//         headers: {
//           authkey: process.env.MSG91_AUTH_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // 🔥 DEBUG LOG
//     console.log("MSG91 Send OTP Response:", response.data);

//     // ✅ Check actual success
//     if (response.data.type !== "success") {
//       return res.status(400).json({
//         message: response.data.message || "OTP Send Failed",
//       });
//     }

//     res.json({ success: true, message: "OTP Sent Successfully" });

//   } catch (error) {
//     console.log("MSG91 Send OTP Error:", error.response?.data || error.message);

//     res.status(500).json({
//       message:
//         error.response?.data?.message ||
//         error.message ||
//         "OTP Send Failed",
//     });
//   }
// };


// // 🔹 VERIFY OTP + AUTO LOGIN
// export const verifyEmailOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const response = await axios.post(
//       "https://control.msg91.com/api/v5/otp/verify",
//       {
//         email: email,
//         otp: otp,
//       },
//       {
//         headers: {
//           authkey: process.env.MSG91_AUTH_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // 🔥 DEBUG LOG
//     console.log("MSG91 Verify OTP Response:", response.data);

//     if (response.data.type !== "success") {
//       return res.status(400).json({
//         message: response.data.message || "Invalid OTP",
//       });
//     }

//     // 🔎 Check user exist?
//     let user = await User.findOne({ email });

//     // 🆕 Agar nahi hai to create kar do
//     if (!user) {
//       user = await User.create({
//         email,
//         role: "agent",
//       });
//     }

//     // 🔐 Generate JWT
//     const token = generateToken(user);

//     res.json({
//       success: true,
//       message: "Login Successful",
//       token,
//       user,
//     });

//   } catch (error) {
//     console.log("MSG91 Verify OTP Error:", error.response?.data || error.message);

//     res.status(400).json({
//       message:
//         error.response?.data?.message ||
//         error.message ||
//         "OTP Verification Failed",
//     });
//   }
// };












import axios from "axios";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

// 🔹 SEND OTP
export const sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        template_id: process.env.MSG91_EMAIL_TEMPLATE_ID,
        identifier: email   // ✅ FIXED (Email OTP ke liye)
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("MSG91 Send OTP Response:", response.data);

    if (response.data.type !== "success") {
      return res.status(400).json({
        message: response.data.message || "OTP Send Failed",
      });
    }

    res.json({ success: true, message: "OTP Sent Successfully" });

  } catch (error) {
    console.log("MSG91 Send OTP Error:", error.response?.data || error.message);

    res.status(500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "OTP Send Failed",
    });
  }
};


// 🔹 VERIFY OTP + AUTO LOGIN
export const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp/verify",
      {
        identifier: email,   // ✅ FIXED
        otp: otp,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("MSG91 Verify OTP Response:", response.data);

    if (response.data.type !== "success") {
      return res.status(400).json({
        message: response.data.message || "Invalid OTP",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        role: "agent",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {
    console.log("MSG91 Verify OTP Error:", error.response?.data || error.message);

    res.status(400).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "OTP Verification Failed",
    });
  }
};
