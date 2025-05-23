import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    company: {
      type: String,
      required: [true, "Company is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    startDate: {
      type: String,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: String,
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    technologies: {
      type: [String],
      required: [true, "At least one technology is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Experience =
  mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
