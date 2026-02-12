// controllers/forgotPasswordController.js
import User from "../models/userModel.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // load .env variables

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

    // Save OTP in user document
    user.forgotPasswordOtp = otp;
    user.forgotPasswordOtpExpiry = expiry;
    await user.save();

    // ✅ Send OTP via MSG91 (using verified testing email)
    const payload = {
      template_id: process.env.MSG91_FORGOT_TEMPLATE_ID,
      from: {
        email: process.env.MSG91_FROM_EMAIL, // security@otp.ea-vle.in
        name: "Essential Aquatech"
      },
      to: [{ email }],
      domain: process.env.MSG91_FROM_DOMAIN, // ea-vle.in
      variables_values: { otp }
    };

    const headers = {
      authkey: process.env.MSG91_FORGOT_AUTH_KEY,
      "Content-Type": "application/json"
    };

    await axios.post(
      "https://api.msg91.com/api/v5/email/send",
      payload,
      { headers }
    );

    res.status(200).json({ message: "OTP sent to email successfully" });

  } catch (error) {
    console.error("MSG91 Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error sending OTP",
      error: error.response?.data || error.message
    });
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
    user.forgotPasswordOtp = null;
    user.forgotPasswordOtpExpiry = null;
    await user.save();

    res.status(200).json({ message: "OTP verified. You can now login." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};
