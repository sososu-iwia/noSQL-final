import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import userModel from "../models/user.model.js";

// маленький хелпер, чтобы не копировать cookie options
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
};

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateOtp6 = () => String(Math.floor(100000 + Math.random() * 900000));

export const register = async (req, res) => {
  const { username, email, password, firstName, lastName, phoneNumber } =
    req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role: "user",
    });

    const token = signToken(user);
    setAuthCookie(res, token);

    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Vizier Airways!",
        text:
          `Hello ${firstName},\n\n` +
          `Thank you for registering with Vizier Airways. We're excited to have you on board!\n\n` +
          `Best regards,\nVizier Airways Team`,
      });
    } catch (mailErr) {
      console.log("welcome email error:", mailErr?.message || mailErr);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await userModel.findOne(username ? { username } : { email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    clearAuthCookie(res);
    return res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user?.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    const otp = generateOtp6();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Your Verification OTP",
      text:
        `Hello ${user.firstName},\n\n` +
        `Your OTP for account verification is: ${otp}\n` +
        `It will expire in 10 minutes.\n\n` +
        `Best regards,\nVizier Airways Team`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log("sendVerifyOtp error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user?.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > user.verifyOtpExpireAt) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const isAuthenticated = (req, res) => {
  // если authMiddleware пропустил — значит ок
  return res.json({ success: true });
};

export const sendResetOtp = async (req, res) => {
  // Joi должен валидировать email
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      // можно вернуть 200 чтобы не палить наличие пользователя, но оставлю 404 как у тебя по смыслу
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = generateOtp6();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text:
        `Hello ${user.firstName},\n\n` +
        `Your OTP for resetting password is: ${otp}\n` +
        `It will expire in 10 minutes.\n\n` +
        `Best regards,\nVizier Airways Team`,
    });

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  // Joi должен валидировать email/otp/newPassword
  const { email, otp, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({
      success: true,
      message: "Password has been changed successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
