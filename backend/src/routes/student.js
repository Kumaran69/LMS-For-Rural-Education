import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Helper to check if two dates are in the same calendar week (Mon-Sun)
const isSameWeek = (d1, d2) => {
  const getWeekNumber = (d) => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  };
  return d1.getFullYear() === d2.getFullYear() && getWeekNumber(d1) === getWeekNumber(d2);
};

// @desc    Complete a quest/lesson/quiz and earn XP
// @route   POST /api/student/complete-quest
// @access  Private (Student)
router.post("/complete-quest", protect, async (req, res) => {
  const { questId, xpEarned } = req.body;

  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Only students can complete quests" });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Add XP
    const earnedXP = parseInt(xpEarned, 10) || 0;
    user.xp += earnedXP;

    // 2. Add to completed quests list (if not already completed)
    const isNewQuest = !user.completedQuests.includes(questId);
    if (isNewQuest) {
      user.completedQuests.push(questId);
    }

    // 3. Level up logic: every 200 XP is a level
    // level = 1 + Math.floor(xp / 200)
    const newLevel = 1 + Math.floor(user.xp / 200);
    user.level = newLevel;

    // 4. Streak & Active Date calculation
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let oldStreak = user.streak;
    let streakUpdated = false;

    if (user.lastActive) {
      const lastActiveDate = new Date(user.lastActive);
      const lastActiveDay = new Date(
        lastActiveDate.getFullYear(),
        lastActiveDate.getMonth(),
        lastActiveDate.getDate()
      );

      const diffTime = today.getTime() - lastActiveDay.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        // Active on consecutive day
        user.streak += 1;
        streakUpdated = true;
      } else if (diffDays > 1) {
        // Streak broken
        user.streak = 1;
        streakUpdated = true;
      }
      // If diffDays === 0, they already logged in today, streak remains same.
    } else {
      // First activity
      user.streak = 1;
      streakUpdated = true;
    }

    // 5. Weekly XP update
    // Check if new week has started, if so clear weekly XP array
    if (user.lastActive && !isSameWeek(new Date(user.lastActive), now)) {
      user.weeklyXP = [0, 0, 0, 0, 0, 0, 0];
    }

    // Map JS Sunday=0, Monday=1... to Monday=0, Tuesday=1 ... Sunday=6
    const jsDay = now.getDay();
    const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
    user.weeklyXP[dayIndex] = (user.weeklyXP[dayIndex] || 0) + earnedXP;

    // Mark last active
    user.lastActive = now;

    // 6. Badges Unlocking Checks
    const newBadges = [];
    
    // b1: "First Step" - Complete first quest
    if (user.completedQuests.length >= 1 && !user.badges.includes("b1")) {
      user.badges.push("b1");
      newBadges.push("First Step 👣");
    }

    // b2: "Math Warrior" - Finish 3 math quests (ids starting with 'm')
    const mathCount = user.completedQuests.filter((id) => id.startsWith("m")).length;
    if (mathCount >= 3 && !user.badges.includes("b2")) {
      user.badges.push("b2");
      newBadges.push("Math Warrior ⚔️");
    }

    // b3: "Streak Keeper" - 7-day learning streak
    if (user.streak >= 7 && !user.badges.includes("b3")) {
      user.badges.push("b3");
      newBadges.push("Streak Keeper 🔥");
    }

    // b4: "Quiz Champion" - Finish any quest (e.g. earned full xp)
    if (earnedXP >= 100 && !user.badges.includes("b4")) {
      user.badges.push("b4");
      newBadges.push("Quiz Champion 🏆");
    }

    // b5: "Odia Scholar" - Complete all 5 Odia quests (o1 to o5)
    const odiaQuests = ["o1", "o2", "o3", "o4", "o5"];
    const hasAllOdia = odiaQuests.every((q) => user.completedQuests.includes(q));
    if (hasAllOdia && !user.badges.includes("b5")) {
      user.badges.push("b5");
      newBadges.push("Odia Scholar 📜");
    }

    // b7: "Science Star" - Complete all 5 Science quests (sc1 to sc5)
    const scienceQuests = ["sc1", "sc2", "sc3", "sc4", "sc5"];
    const hasAllScience = scienceQuests.every((q) => user.completedQuests.includes(q));
    if (hasAllScience && !user.badges.includes("b7")) {
      user.badges.push("b7");
      newBadges.push("Science Star 🔬");
    }

    // b8: "Grand Master" - Complete all 25 quests
    if (user.completedQuests.length >= 25 && !user.badges.includes("b8")) {
      user.badges.push("b8");
      newBadges.push("Grand Master 👑");
    }

    await user.save();

    res.json({
      success: true,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      completedQuests: user.completedQuests,
      badges: user.badges,
      weeklyXP: user.weeklyXP,
      newBadgesEarned: newBadges,
    });
  } catch (error) {
    console.error("Complete quest error:", error);
    res.status(500).json({ message: "Failed to update progress" });
  }
});

// @desc    Get Odisha State and Local Village Leaderboards
// @route   GET /api/student/leaderboard
// @access  Private
router.get("/leaderboard", protect, async (req, res) => {
  try {
    const limit = 10;
    
    // Fetch top students globally (in the state of Odisha)
    const stateLeaderboard = await User.find({ role: "student" })
      .sort({ xp: -1 })
      .limit(limit)
      .select("name village xp streak avatar");

    // Fetch top students in the user's specific village
    let villageLeaderboard = [];
    if (req.user.village) {
      villageLeaderboard = await User.find({
        role: "student",
        village: req.user.village,
      })
        .sort({ xp: -1 })
        .limit(limit)
        .select("name village xp streak avatar");
    }

    // Determine current user's ranks
    const allStudentsSorted = await User.find({ role: "student" }).sort({ xp: -1 });
    const stateRank = allStudentsSorted.findIndex((s) => s._id.equals(req.user._id)) + 1;

    let villageRank = 0;
    if (req.user.village) {
      const villageStudentsSorted = allStudentsSorted.filter(
        (s) => s.village === req.user.village
      );
      villageRank =
        villageStudentsSorted.findIndex((s) => s._id.equals(req.user._id)) + 1;
    }

    res.json({
      stateLeaderboard,
      villageLeaderboard,
      myRanks: {
        stateRank: stateRank > 0 ? stateRank : null,
        villageRank: villageRank > 0 ? villageRank : null,
      },
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

// @desc    Save highscore and award bonus XP
// @route   POST /api/student/save-highscore
// @access  Private (Student)
router.post("/save-highscore", protect, async (req, res) => {
  const { gameKey, score } = req.body;

  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Only students can record highscores" });
  }

  const validGames = ["speedMath", "conceptMatcher", "wordBuilder"];
  if (!validGames.includes(gameKey)) {
    return res.status(400).json({ message: "Invalid game key" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.gameHighScores) {
      user.gameHighScores = { speedMath: 0, conceptMatcher: 0, wordBuilder: 0 };
    }

    const currentHighScore = user.gameHighScores[gameKey] || 0;
    const newScore = parseInt(score, 10) || 0;
    let isNewHighScore = false;
    let bonusXP = 0;

    if (newScore > currentHighScore) {
      user.gameHighScores[gameKey] = newScore;
      isNewHighScore = true;
      bonusXP = 20; // 20 XP bonus for breaking high score!
      user.xp += bonusXP;
      user.level = 1 + Math.floor(user.xp / 200); // Re-calculate level
    }

    await user.save();

    res.json({
      success: true,
      highScores: user.gameHighScores,
      isNewHighScore,
      bonusXP,
      xp: user.xp,
      level: user.level
    });
  } catch (error) {
    console.error("Save highscore error:", error);
    res.status(500).json({ message: "Failed to save highscore" });
  }
});

export default router;
