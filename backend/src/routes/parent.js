import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get progress details of the linked student account
// @route   GET /api/parent/child-progress
// @access  Private (Parent)
router.get("/child-progress", protect, async (req, res) => {
  if (req.user.role !== "parent") {
    return res.status(403).json({ message: "Only parents can view this dashboard" });
  }

  const childEmail = req.user.linkedStudentEmail;

  if (!childEmail) {
    return res.status(400).json({
      message: "No child linked yet. Please enter your child's student email in settings/onboarding.",
    });
  }

  try {
    const child = await User.findOne({
      role: "student",
      email: childEmail.toLowerCase().trim(),
    }).select("name village class xp level streak completedQuests badges weeklyXP lastActive email avatar gameHighScores");

    if (!child) {
      return res.status(404).json({
        message: `No student account found with email "${childEmail}". Please make sure your child has registered first.`,
      });
    }

    res.json(child);
  } catch (error) {
    console.error("Parent child-progress fetch error:", error);
    res.status(500).json({ message: "Failed to fetch child's progress" });
  }
});

export default router;
