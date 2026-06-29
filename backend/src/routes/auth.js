import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Auth with Google (or mock fallback for offline/development)
// @route   POST /api/auth/google
// @access  Public
router.post("/google", async (req, res) => {
  const { credential, isMock, email: mockEmail, name: mockName, picture: mockPicture } = req.body;

  try {
    let email, name, avatar, googleId;

    const clientId = process.env.VITE_GOOGLE_CLIENT_ID;
    const isClientDefaultPlaceholder = !clientId || clientId.includes("630323490461-deca1qckbk7k7eesrmemdh05nkkjs5gu.apps.googleusercontent.com");

    if (isMock || isClientDefaultPlaceholder) {
      // Mock / Dev Fallback Flow: Uses email/name passed by the frontend
      // This is extremely useful for offline testing or when Client ID is not configured.
      email = mockEmail || "testuser@gmail.com";
      name = mockName || "Demo User";
      avatar = mockPicture || "DU";
      googleId = `mock_${email}`;
      console.log(`[AUTH] Performing dev fallback/mock login for: ${email}`);
    } else {
      // Real-time Google ID Token Verification
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      avatar = payload.picture;
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        avatar,
        // Set some starting default gamified data for students
        xp: 0,
        level: 1,
        streak: 0,
        weeklyXP: [0, 0, 0, 0, 0, 0, 0],
      });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      village: user.village,
      class: user.class,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      completedQuests: user.completedQuests,
      badges: user.badges,
      linkedStudentEmail: user.linkedStudentEmail,
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: "Google token verification failed" });
  }
});

// @desc    Save onboarding metadata
// @route   POST /api/auth/onboard
// @access  Private (Protected by JWT)
router.post("/onboard", protect, async (req, res) => {
  const { role, village, class: studentClass, linkedStudentEmail } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.role = role;
      user.village = village || "";
      if (role === "student") {
        user.class = studentClass || "";
      } else if (role === "parent") {
        user.linkedStudentEmail = linkedStudentEmail ? linkedStudentEmail.toLowerCase().trim() : "";
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        village: updatedUser.village,
        class: updatedUser.class,
        xp: updatedUser.xp,
        level: updatedUser.level,
        streak: updatedUser.streak,
        completedQuests: updatedUser.completedQuests,
        badges: updatedUser.badges,
        linkedStudentEmail: updatedUser.linkedStudentEmail,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Onboarding failed" });
  }
});

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
