import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    imageUrl: {
      type: String,
    },
    projectUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    technologies: {
      type: [String],
      required: [true, "At least one technology is required"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Portfolio =
  mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);
