import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50
    },
    position: {
      type: String,
      required: [true, "position is required"],
      maxlength: 150
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending"
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
