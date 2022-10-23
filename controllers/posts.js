const mongoose = require('mongoose')
const cloudinary = require("../middleware/cloudinary");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const { userIdOrName } = req.params;
      const isObjectId = mongoose.Types.ObjectId.isValid(userIdOrName);
      const user = await User.findOne(isObjectId ? { _id: userIdOrName } : { userName: userIdOrName}).populate({
        path: "following",
        populate: { path: 'receiver' }
      }).populate({
        path: "followers",
        populate: { path: 'sender' }
      });
      if (!user) return res.json({ user: null, posts: [] })

      const posts = await Post.find({ user: user.id, deletedAt: { $exists: false } }).populate('likes').lean();
      res.json({ user: user.toObject(), posts });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    const { type } = req.params;
    try {
      const filter = { deletedAt: { $exists: false } }
      if (type === 'following') {
        filter.user = { $in: req.user.following.map(follow => follow.receiver._id) }
      }
      const posts = await Post.find(filter).sort({ createdAt: "desc" }).populate('likes').lean();
      res.json(posts);
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('likes').populate({
        path: 'comments',
        match: { deletedAt: { $exists: false } },
        populate: { path: 'user' }
      })
      if (post.deletedAt) return res.status(404).end();

      const comments = post.toObject().comments
      res.json({ post: post.toObject() || null, comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      });

      const post = await Post.create({
        title: req.body.title,
        media: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.json({ post });
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      const obj = { user: req.user.id, post: req.params.id };
      if ((await Like.deleteOne(obj)).deletedCount) {
        console.log("Likes -1");
        return res.json(-1)
      }
      await Like.create(obj);
      console.log("Likes +1");
      res.json(1)
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id }).populate('likes').populate({
        path: 'comments',
        match: { deletedAt: { $exists: false } }
      });

      if (process.env.SOFT_DELETES === 'true') {
        post.deletedAt = Date.now();
        await post.save();
        console.log("Post has been soft deleted!");
        return res.json({ post });
      }

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      const commentIDs = [];
      const comments = post.comments;
      while (comments.length) {
        const comment = comments.pop();
        comments.push(...comment.comments);
        commentIDs.push(comment.id);
      }
      await Comment.deleteMany({ _id: { $in: commentIDs}});
      await Like.deleteMany({ post: req.params.id });
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  editPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('likes').populate({
        path: 'comments',
        match: { deletedAt: { $exists: false } },
        populate: { path: 'user' }
      });
      if (post.deletedAt) return res.status(404).end();
      for (const key of ['title', 'caption']){
        if (req.body[key] === post[key]) continue;
        post[key] = req.body[key];
        post.edited = true;
      }

      if (req.file) {
        post.edited = true;
        await cloudinary.uploader.destroy(post.cloudinaryId);
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "auto",
        });
        post.media = result.secure_url;
        post.cloudinaryId = result.public_id;
      }

      const updatedPost = await post.save();
      console.log("Post has been updated!");
      res.json({ post: updatedPost.toObject() });
    } catch (err) {
      res.redirect("/profile");
    }
  }
};
