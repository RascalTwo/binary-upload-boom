import nc from "next-connect";
import * as authController from "../controllers/auth";
import postsController from "../controllers/posts";
import bodyParser from "body-parser";

export default nc({ attachParams: true })
	.get('/user', authController.getUser)
	.get("/profile/:userIdOrName", postsController.getProfile)
	.get("/feed/:type", postsController.getFeed)
	.post("/login", bodyParser.urlencoded({ extended: true }), authController.postLogin)
	.get("/logout", authController.logout)
	.post("/signup", bodyParser.urlencoded({ extended: true }), authController.postSignup)
