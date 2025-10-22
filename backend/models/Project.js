import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    techStack: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      enum: ["web", "mobile", "fullstack", "ai/ml", "other"],
      default: "web",
    },
    links: {
      github: {
        type: String,
        default: "",
      },
      live: {
        type: String,
        default: "",
      },
      demo: {
        type: String,
        default: "",
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "planned"],
      default: "completed",
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
