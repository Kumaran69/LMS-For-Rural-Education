import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ["student", "teacher", "parent", null], default: null },
    village: { type: String, default: "" },
    class: { type: String, default: "" }, // E.g., "Class 6"
    
    // Student gamification fields
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: null },
    completedQuests: { type: [String], default: [] }, // e.g. ["m1", "m2", "sc1"]
    badges: { type: [String], default: [] }, // e.g. ["b1", "b2", "b3"]
    weeklyXP: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] }, // XP earned Mon-Sun
    
    // Parent field
    linkedStudentEmail: { type: String, default: "" }, // Links parent to a student's email

    // Game high scores
    gameHighScores: {
      speedMath: { type: Number, default: 0 },
      conceptMatcher: { type: Number, default: 0 },
      wordBuilder: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
