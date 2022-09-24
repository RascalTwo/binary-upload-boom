const User = require('../models/User');
const Comment = require('../models/Comment');

async function getPostCommentsRecur(post) {
  async function recur(comment){
    comment.user = await User.findOne({ _id: comment.user });
    comment.comments = await Comment.find({ comment: comment._id })
    for(const reply of comment.comments) await recur(reply)
    return comment
  }
  return await Promise.all((await Comment.find({ post: post.id })).map(recur))
}
async function getPostCommentsIterative(post) {
  return getAllCommentsIterative(...await Comment.find({ post: post.id }));
}

async function getAllCommentsIterative(...initialComments) {
  const stack = [...initialComments];
  const comments = [...stack];
  while (stack.length) {
    const comment = stack.pop();
    comment.user = await User.findOne({ _id: comment.user });
    comment.comments = await Comment.find({ comment: comment._id });
    stack.push(...comment.comments);
  }
  return comments;
}

module.exports = {
	getPostCommentsRecur,
	getPostCommentsIterative,
  getAllCommentsIterative
}