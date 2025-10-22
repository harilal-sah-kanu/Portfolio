import mongoose from "mongoose";

const codingProfileSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: [
        "leetcode",
        "codechef",
        "codeforces",
        "hackerrank",
        "github",
        "geeksforgeeks",
        "interviewbit",
      ],
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    profileUrl: {
      type: String,
      required: true,
    },
    stats: {
      // For LeetCode and problem-solving platforms
      totalSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      ranking: { type: Number, default: 0 },

      // For Codeforces
      rating: { type: Number, default: 0 },
      maxRating: { type: Number, default: 0 },

      // For GitHub
      totalRepos: { type: Number, default: 0 },
      totalStars: { type: Number, default: 0 },
      totalCommits: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },

      // Common
      contestParticipation: { type: Number, default: 0 },
      badges: [{ type: String }],
    },
    // Daily contribution tracking
    dailyContributions: [
      {
        date: { type: Date, required: true },
        solved: { type: Boolean, default: false },
        contributed: { type: Boolean, default: false },
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CodingProfile = mongoose.model("CodingProfile", codingProfileSchema);

export default CodingProfile;
