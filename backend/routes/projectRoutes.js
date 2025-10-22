import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "../controllers/projectController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get("/", getProjects);

// @route   POST /api/projects/reorder
// @desc    Reorder projects (drag & drop)
// @access  Private/Admin
router.post("/reorder", protect, admin, reorderProjects);

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get("/:id", getProjectById);

// @route   POST /api/projects
// @desc    Create a project
// @access  Private/Admin
router.post("/", protect, admin, createProject);

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private/Admin
router.put("/:id", protect, admin, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteProject);

export default router;
