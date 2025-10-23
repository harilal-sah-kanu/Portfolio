import express from "express";
import {
  getCodingProfiles,
  getCodingProfile,
  createOrUpdateCodingProfile,
  updateCodingProfile,
  deleteCodingProfile,
  fetchPlatformStats,
  updateDailyContribution,
  syncAllPlatformData,
} from "../controllers/codingProfileController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getCodingProfiles)
  .post(protect, admin, createOrUpdateCodingProfile);

router.post("/fetch-stats", protect, admin, fetchPlatformStats);

router.post("/:id/daily-contribution", protect, admin, updateDailyContribution);

router.post("/:id/sync-all", protect, admin, syncAllPlatformData);

router
  .route("/:id")
  .get(getCodingProfile)
  .put(protect, admin, updateCodingProfile)
  .delete(protect, admin, deleteCodingProfile);

export default router;
