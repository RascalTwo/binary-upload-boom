import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const CommentSchema = new mongoose.Schema({
  text: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    autopopulate: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  deletedAt: { type: Date },
  edited: { type: Boolean }
}, {
  toObject: { virtuals: true }
});
CommentSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'comment',
  autopopulate: true
});

CommentSchema.plugin(mongooseAutoPopulate);

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
