import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "work",
        "education",
        "project",
        "achievement",
        "certification",
        "other",
      ],
      default: "work",
    },
    organization: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    achievements: [
      {
        type: String,
        trim: true,
      },
    ],
    icon: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Sort by start date (most recent first)
experienceSchema.index({ startDate: -1 });

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
