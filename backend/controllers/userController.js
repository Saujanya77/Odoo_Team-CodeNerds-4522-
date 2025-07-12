import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();  
};

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (
      !name ||
      !email || 
      !password
    ) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
      maxAge: 28 * 24 * 60 * 60 * 1000, 
    });

    res.json({ success: true, user: { name: user.name }, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Send email OTP
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your Login OTP',
        text: `Your OTP code is ${otpCode}`,
        html: `<p>Your OTP code is <strong>${otpCode}</strong></p>`,
      });

      // Update user with OTP details
      user.otp = {
        code: otpCode,
        expiresAt,
        sentTo: ['email']
      };
      await user.save();

      res.json({
        success: true,
        message: "OTP sent successfully",
        otpSentTo: ['email'],
        // Only include OTP in development for testing
        ...(process.env.NODE_ENV === 'development' && { otp: otpCode })
      });

    } catch (emailError) {
      console.error('Error sending email OTP:', emailError);
      res.status(500).json({ success: false, message: 'Failed to send OTP email' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if OTP exists, matches, and isn't expired
    if (!user.otp || 
        user.otp.code !== otp || 
        new Date() > user.otp.expiresAt) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      });
    }

    // Clear the OTP after successful verification
    user.otp = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '28d'
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 28 * 24 * 60 * 60 * 1000, // 28 days
    });

    res.json({
      success: true,
      token,
      user: {
        name: user.name || user.email,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

export const completeProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const {
      name,
      location,
      skillsOffered,
      skillswanted,
      availability,
      profileStatus,
      profilePicture,
    } = req.body;

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (
      !name ||
      !location ||
      !skillsOffered ||
      !skillswanted ||
      !availability ||
      !profileStatus
    ) {
      return res
        .status(400)
        .json({ message: "All profile fields are required" });
    } 

    user.name = name;
    user.location = location; 
    user.skillsOffered = skillsOffered;
    user.skillsWanted = skillswanted; 
    user.availability = availability;
    user.isPublic = profileStatus; 
    user.profilePhotoUrl = profilePicture;
    await user.save();
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      success: true,
      data: {
        name: user.name || user.email,
        email: user.email,
        location: user.location,
        skillsOffered: user.skillsOffered,
        skillswanted: user.skillswanted,
        availability: user.availability,  
        profileStatus: user.profileStatus,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error in getUser:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const userData = users.map(user => ({
      id: user._id,
      name: user.name || user.email,
      email: user.email,
      location: user.location,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      availability: user.availability,
      profileStatus: user.profileStatus,
      profilePicture: user.profilePicture,
    }));

    res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: {
        name: user.name || user.email,
        email: user.email,
        location: user.location,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        availability: user.availability,  
        profileStatus: user.profileStatus,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};