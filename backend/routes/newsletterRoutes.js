import express from "express";
import Newsletter from "../models/Newsletter.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({ message: "Email is already subscribed" });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        return res.status(200).json({
          message: "Successfully resubscribed to newsletter!",
          subscriber: existingSubscriber,
        });
      }
    }

    // Create new subscriber
    const subscriber = await Newsletter.create({ email });
    res.status(201).json({
      message: "Successfully subscribed to newsletter!",
      subscriber,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// @route   GET /api/newsletter
// @desc    Get all newsletter subscribers
// @access  Private/Admin
router.get("/", protect, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/newsletter/:id
// @desc    Delete subscriber
// @access  Private/Admin
router.delete("/:id", protect, async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    await subscriber.deleteOne();
    res.json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
