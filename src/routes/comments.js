import nc from "next-connect";
import commentsController from "../controllers/comments";
import bodyParser from "body-parser";

export default nc({ attachParams: true })
	.post("/createComment/:postId/:commentId?", bodyParser.urlencoded({ extended: true }), commentsController.createComment)
	.delete("/deleteComment/:postId/:commentId", commentsController.deleteComment)
	.patch("/editComment/:postId/:commentId", bodyParser.urlencoded({ extended: true }), commentsController.editComment)