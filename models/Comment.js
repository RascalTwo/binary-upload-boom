const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  deleted: { type: Boolean }
}, {
  toObject: { virtuals: true }
});
CommentSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'comment',
  autopopulate: true
});

CommentSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model("Comment", CommentSchema);
