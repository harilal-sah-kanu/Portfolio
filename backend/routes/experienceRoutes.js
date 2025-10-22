import express from "express";
import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getExperiences).post(protect, admin, createExperience);

router
  .route("/:id")
  .get(getExperience)
  .put(protect, admin, updateExperience)
  .delete(protect, admin, deleteExperience);

export default router;
