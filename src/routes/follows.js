import nc from "next-connect";
import followsController from "../controllers/follows";

export default nc({ attachParams: true })
	.post("/followUser/:receiver", followsController.followUser)
	.delete("/unfollowUser/:receiver", followsController.unfollowUser);
