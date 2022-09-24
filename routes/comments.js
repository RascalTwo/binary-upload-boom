const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/createComment/:postId/:commentId?", commentsController.createComment);
router.delete("/deleteComment/:postId/:commentId", commentsController.deleteComment);
router.patch("/editComment/:postId/:commentId", commentsController.editComment);

module.exports = router;
