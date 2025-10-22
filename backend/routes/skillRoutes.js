import express from "express";
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from "../controllers/skillController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
router.get("/", getSkills);

// @route   POST /api/skills/reorder
// @desc    Reorder skills
// @access  Private/Admin
router.post("/reorder", protect, admin, reorderSkills);

// @route   GET /api/skills/:id
// @desc    Get single skill
// @access  Public
router.get("/:id", getSkillById);

// @route   POST /api/skills
// @desc    Create a skill
// @access  Private/Admin
router.post("/", protect, admin, createSkill);

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private/Admin
router.put("/:id", protect, admin, updateSkill);

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteSkill);

export default router;
