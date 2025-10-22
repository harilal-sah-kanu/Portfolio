import express from "express";
import {
  getContacts,
  getContactById,
  createContact,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import { protect, admin } from "../middleware/auth.js";
import { body } from "express-validator";

const router = express.Router();

// @route   GET /api/contacts
// @desc    Get all contacts
// @access  Private/Admin
router.get("/", protect, admin, getContacts);

// @route   GET /api/contacts/:id
// @desc    Get single contact
// @access  Private/Admin
router.get("/:id", protect, admin, getContactById);

// @route   POST /api/contacts
// @desc    Create a contact message
// @access  Public
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  createContact
);

// @route   PUT /api/contacts/:id/status
// @desc    Update contact status
// @access  Private/Admin
router.put("/:id/status", protect, admin, updateContactStatus);

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteContact);

export default router;
