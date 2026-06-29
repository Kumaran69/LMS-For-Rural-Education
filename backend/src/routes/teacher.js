import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get progress of all students in the teacher's village
// @route   GET /api/teacher/students
// @access  Private (Teacher)
router.get("/students", protect, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Only teachers can view this dashboard" });
  }

  try {
    const village = req.user.village;

    if (!village) {
      return res.status(400).json({ message: "Teacher must belong to a village to view students" });
    }

    // Find all students in the same village
    const students = await User.find({ role: "student", village })
      .select("name xp streak completedQuests lastActive email avatar gameHighScores")
      .sort({ xp: -1 });

    const now = new Date();

    // Map students with status calculations
    const formattedStudents = students.map((s) => {
      let status = "inactive";
      let lastSeenText = "Never";

      if (s.lastActive) {
        const lastActiveDate = new Date(s.lastActive);
        const diffTime = now.getTime() - lastActiveDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays <= 1) {
          lastSeenText = "Today";
          status = "active";
        } else if (diffDays <= 2) {
          lastSeenText = "Yesterday";
          status = "active";
        } else if (diffDays <= 7) {
          lastSeenText = `${Math.floor(diffDays)} days ago`;
          status = "at-risk";
        } else {
          lastSeenText = `${Math.floor(diffDays)} days ago`;
          status = "inactive";
        }
      }

      return {
        _id: s._id,
        name: s.name,
        email: s.email,
        xp: s.xp,
        streak: s.streak,
        quests: s.completedQuests.length,
        lastSeen: lastSeenText,
        status,
        avatar: s.avatar,
        highScores: s.gameHighScores,
      };
    });

    res.json({
      village,
      students: formattedStudents,
    });
  } catch (error) {
    console.error("Teacher students fetch error:", error);
    res.status(500).json({ message: "Failed to fetch student progress" });
  }
});

export default router;
