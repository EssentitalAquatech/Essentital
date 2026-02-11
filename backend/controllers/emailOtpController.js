


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
    user.emailOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // 🔥 SEND EMAIL USING MSG91
  // 🔥 SEND EMAIL USING MSG91 TEMPLATE
await axios.post(
  "https://control.msg91.com/api/v5/email/send",
  {
    template_id: process.env.MSG91_EMAIL_TEMPLATE_ID, // ✅ add this

    recipients: [
      {
        to: [{ email }],
        variables: {
          company_name: "Essential Aquatech",
          otp: otp,
        },
      },
    ],

    from: {
      email: "noreply@mg.essentital.com",  // 👈 PUT YOUR VERIFIED EMAIL
    },

    domain: "mg.essentital.com", // 👈 PUT YOUR VERIFIED DOMAIN
  },
  {
    headers: {
      authkey: process.env.MSG91_AUTH_KEY,
      "Content-Type": "application/json",
    },
  }
);


    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.log(error.response?.data || error.message);
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

    // ✅ Clear OTP
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
    res.status(500).json({ message: "OTP verification failed" });
  }
};
