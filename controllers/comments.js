const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        text: req.body.text,
				post: req.params.commentId ? undefined : req.params.postId,
        comment: req.params.commentId
      });
      console.log("Comment has been added!");
      res.redirect("/post/" + req.params.postId);
    } catch (err) {
      console.log(err);
    }
  },
};