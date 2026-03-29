import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    tourId: {
      type: mongoose.Types.ObjectId,
      ref: "Tour",
    },
    action: {
      type: String,
      enum: ["view", "click", "book", "like", "search"],
      required: true,
    },
    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Interaction", interactionSchema);
