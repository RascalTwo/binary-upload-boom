import nc from "next-connect";
import upload from "../middlewares/multer";
import postsController from "../controllers/posts";

export default nc({ attachParams: true })
	.post("/createPost", upload.single("file"), postsController.createPost)
	.patch("/editPost/:id", upload.single("file"), postsController.editPost)
	.put("/likePost/:id", postsController.likePost)
	.delete("/deletePost/:id", postsController.deletePost);