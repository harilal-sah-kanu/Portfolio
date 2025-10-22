import express from "express";
import multer from "multer";
import {
  uploadToImageKit,
  deleteFromImageKit,
  getImageKitAuthParams,
} from "../utils/imagekit.js";
import { protect, admin } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only images and PDFs are allowed."));
  },
});

// @desc    Get ImageKit authentication parameters
// @route   GET /api/upload/auth
// @access  Private/Admin
router.get("/auth", protect, admin, (req, res) => {
  try {
    const authParams = getImageKitAuthParams();
    res.json(authParams);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get auth params", error: error.message });
  }
});

// @desc    Upload image to ImageKit
// @route   POST /api/upload/image
// @access  Private/Admin
router.post(
  "/image",
  protect,
  admin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await uploadToImageKit(
        req.file.buffer,
        req.file.originalname,
        "portfolio/images"
      );

      res.json({
        url: result.url,
        fileId: result.fileId,
        filename: result.name,
        thumbnailUrl: result.thumbnailUrl,
      });
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  }
);

// @desc    Upload resume to ImageKit
// @route   POST /api/upload/resume
// @access  Private/Admin
router.post(
  "/resume",
  protect,
  admin,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete old resume if exists
      if (user.resume && user.resume.fileId) {
        await deleteFromImageKit(user.resume.fileId);
      }

      // Upload new resume to ImageKit
      const result = await uploadToImageKit(
        req.file.buffer,
        req.file.originalname,
        "portfolio/resumes"
      );

      console.log("ImageKit upload result:", result);
      console.log("File URL:", result.url);
      console.log("File ID:", result.fileId);

      // Update user's resume
      user.resume = {
        url: result.url,
        fileId: result.fileId, // ImageKit uses fileId instead of publicId
        filename: result.name,
        format: result.fileType || "pdf",
        thumbnailUrl: result.thumbnailUrl,
      };

      await user.save();

      console.log("Resume saved to user:", user.resume);

      res.json({
        url: result.url,
        fileId: result.fileId,
        filename: result.name,
        format: result.fileType || "pdf",
        thumbnailUrl: result.thumbnailUrl,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  }
);

// @desc    Upload profile image to ImageKit
// @route   POST /api/upload/profile-image
// @access  Private/Admin
router.post(
  "/profile-image",
  protect,
  admin,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete old profile image if exists
      if (user.profileImage && user.profileImage.fileId) {
        await deleteFromImageKit(user.profileImage.fileId);
      }

      // Upload new profile image to ImageKit
      const result = await uploadToImageKit(
        req.file.buffer,
        req.file.originalname,
        "portfolio/profile"
      );

      // Update user's profile image
      user.profileImage = {
        url: result.url,
        fileId: result.fileId,
        filename: result.name,
      };

      await user.save();

      res.json({
        url: result.url,
        fileId: result.fileId,
        filename: result.name,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  }
);

// @desc    Delete profile image from ImageKit
// @route   DELETE /api/upload/profile-image
// @access  Private/Admin
router.delete("/profile-image", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete from ImageKit if exists
    if (user.profileImage && user.profileImage.fileId) {
      await deleteFromImageKit(user.profileImage.fileId);
    }

    // Remove from user document
    user.profileImage = {
      url: "",
      fileId: "",
      filename: "",
    };

    await user.save();

    res.json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

// @desc    Delete file from ImageKit
// @route   DELETE /api/upload/:fileId
// @access  Private/Admin
router.delete("/:fileId", protect, admin, async (req, res) => {
  try {
    await deleteFromImageKit(req.params.fileId);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

export default router;
