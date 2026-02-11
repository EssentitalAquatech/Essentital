

import axios from "axios";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= SEND OTP =================
export const sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    user.emailOtp = otp;
    user.emailOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // 🔥 SEND EMAIL USING MSG91 TEMPLATE
    await axios.post(
      "https://control.msg91.com/api/v5/email/send",
      {
        recipients: [
          {
            to: [{ email: user.email }],
            variables: {
              company_name: "Essential Aquatech",
              otp: otp
            }
          }
        ],
        from: {
        //   email: "support24x7@ea-vle.in"
          email: "security@otp.ea-vle.in"
        },
        // template_id: "email_login_otp_2" // 👈 Your Template ID
        template_id: "email_login_otp4" 
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.log("MSG91 ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ================= VERIFY OTP =================
export const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.emailOtp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.emailOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.log("VERIFY OTP ERROR:", error.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};



















// import axios from "axios";
// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";

// // 🔐 Generate JWT Token
// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };

// // ================= SEND OTP =================
// export const sendEmailOtp = async (req, res) => {
//   const { email } = req.body;

//   try {
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     // Generate 6 digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = new Date(Date.now() + 60 * 1000); // ✅ 60 seconds

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({ email });
//     }

//     user.emailOtp = otp;
//     user.emailOtpExpiry = otpExpiry;
//     await user.save();

//     // 📧 Send mail using Nodemailer
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}. It is valid for 60 seconds.`,
//     });

//     res.json({ success: true, message: "OTP sent successfully" });

//   } catch (error) {
//     console.log("SEND OTP ERROR:", error.message);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// };

// // ================= VERIFY OTP =================
// export const verifyEmailOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user || !user.emailOtp) {
//       return res.status(400).json({ message: "No OTP found" });
//     }

//     // ✅ Check Expiry
//     if (new Date() > user.emailOtpExpiry) {
//       return res.status(400).json({ message: "OTP expired. Please resend." });
//     }

//     // ✅ Check Match
//     if (user.emailOtp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // ✅ Clear OTP after success
//     user.emailOtp = null;
//     user.emailOtpExpiry = null;
//     await user.save();

//     const token = generateToken(user);

//     res.json({
//       success: true,
//       message: "Email verified successfully",
//       token,
//       user,
//     });

//   } catch (error) {
//     console.log("VERIFY OTP ERROR:", error.message);
//     res.status(500).json({ message: "OTP verification failed" });
//   }
// };