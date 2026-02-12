












import User from "../models/userModel.js";
import axios from "axios";
import jwt from "jsonwebtoken";

// ✅ Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


// ================= SEND FORGOT PASSWORD OTP =================
export const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    user.forgotPasswordOtp = otp;
    user.forgotPasswordOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // 🔥 SEND EMAIL USING MSG91 (SAME FORMAT AS SIGNUP)
    await axios.post(
      "https://control.msg91.com/api/v5/email/send",
      {
        recipients: [
          {
            to: [{ email: user.email }],
            variables: {
              otp: otp   // must match {{otp}} in template
            }
          }
        ],
        from: {
          email: "security@otp.ea-vle.in"
        },
        template_id: "template_11_02_2026_18_02_2"
      },
      {
        headers: {
          authkey: "478792AFpUGwdMg698c7320P1",
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );

    res.json({ success: true, message: "Forgot password OTP sent successfully" });

  } catch (error) {
    console.log("FORGOT OTP ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to send forgot password OTP" });
  }
};



// ================= VERIFY FORGOT PASSWORD OTP =================
export const verifyForgotPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.forgotPasswordOtp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (user.forgotPasswordOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.forgotPasswordOtpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP after success
    user.forgotPasswordOtp = undefined;
    user.forgotPasswordOtpExpiry = undefined;
    await user.save();

    // 🔥 CREATE TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
      user
    });

  } catch (error) {
    console.log("VERIFY FORGOT OTP ERROR:", error.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};