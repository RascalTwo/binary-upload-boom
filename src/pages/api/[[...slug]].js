import nc from "next-connect";
import mainRouter from "../../routes/main";
import followsRouter from "../../routes/follows";
import postsRouter from "../../routes/posts";
import commentsRouter from "../../routes/comments";
import authAll from "../../middlewares/authAll";

export default nc({ attachParams: true })
	.use(authAll())
	.use('/api', mainRouter)
	.use('/api/follow', followsRouter)
	.use('/api/post', postsRouter)
	.use('/api/comment', commentsRouter);

export const config = {
	api: {
		bodyParser: false
	}
}