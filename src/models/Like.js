import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

export default mongoose.models.Like || mongoose.model("Like", LikeSchema);
