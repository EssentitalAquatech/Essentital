import User from "../models/userModel.js";
import axios from "axios";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); // ✅ load .env variables

// ✅ Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ================= SEND OTP =================
export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Save OTP in user document (separate from signup OTP)
    user.forgotPasswordOtp = otp;
    user.forgotPasswordOtpExpiry = expiry;
    await user.save();

    // Send OTP via MSG91 using Forgot Password env variables
    const msgResponse = await axios.post(
      `https://api.msg91.com/api/v5/email/send?template_id=${process.env.MSG91_FORGOT_TEMPLATE_ID}&mobile=&email=${email}&otp=${otp}`,
      {},
      {
        headers: {
          "authkey": process.env.MSG91_FORGOT_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "OTP sent to email", otp }); // otp in response only for dev
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

// ================= VERIFY OTP =================
export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email & OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.forgotPasswordOtp || !user.forgotPasswordOtpExpiry) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (user.forgotPasswordOtp !== otp) {
      return res.status(400).json({ message: "OTP mismatch" });
    }

    if (new Date() > user.forgotPasswordOtpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ OTP verified
    // Clear OTP fields
    user.forgotPasswordOtp = null;
    user.forgotPasswordOtpExpiry = null;
    await user.save();

    // Optional: Auto-login by sending token or just send success
    res.status(200).json({ message: "OTP verified. You can now login." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};
