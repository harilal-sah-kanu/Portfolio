import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementViews,
} from "../controllers/blogController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs
// @access  Public
router.get("/", getBlogs);

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug
// @access  Public
router.get("/:slug", getBlogBySlug);

// @route   POST /api/blogs/:id/views
// @desc    Increment blog views
// @access  Public
router.post("/:id/views", incrementViews);

// @route   POST /api/blogs
// @desc    Create a blog
// @access  Private/Admin
router.post("/", protect, admin, createBlog);

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private/Admin
router.put("/:id", protect, admin, updateBlog);

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteBlog);

export default router;
