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
    await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        template_id: process.env.MSG91_EMAIL_TEMPLATE_ID,
        email: email,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "OTP Sent Successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP Send Failed" });
  }
};

// 🔹 VERIFY OTP + AUTO LOGIN
export const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp/verify",
      {
        email: email,
        otp: otp,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.type !== "success") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 🔎 Check user exist?
    let user = await User.findOne({ email });

    // 🆕 Agar nahi hai to create kar do
    if (!user) {
      user = await User.create({
        email,
        role: "agent",
      });
    }

    // 🔐 Generate JWT
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {
    res.status(400).json({ message: "OTP Verification Failed" });
  }
};
