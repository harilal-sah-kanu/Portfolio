import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, getUserProfile);

// @route   GET /api/auth/portfolio-owner
// @desc    Get portfolio owner's public profile
// @access  Public
router.get("/portfolio-owner", async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    // Get the first admin user (portfolio owner)
    const owner = await User.findOne({ role: "admin" }).select("-password");

    if (owner) {
      res.json({
        name: owner.name,
        title: owner.title,
        bio: owner.bio,
        email: owner.email,
        github: owner.github,
        linkedin: owner.linkedin,
        twitter: owner.twitter,
        resume: owner.resume,
        profileImage: owner.profileImage,
        codingProfiles: owner.codingProfiles,
      });
    } else {
      res.json({
        name: "Your Name",
        title: "Full Stack Developer",
        bio: "Passionate about building beautiful, scalable web applications.",
        email: "your@email.com",
        github: "yourusername",
        linkedin: "yourusername",
        twitter: "",
        resume: null,
        profileImage: null,
        codingProfiles: {},
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, updateUserProfile);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", protect, changePassword);

export default router;
