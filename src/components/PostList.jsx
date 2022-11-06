import PostPreview from './PostPreview';

const PostList = ({ posts }) => <ul className="row list-unstyled">
	{posts.map(post => <PostPreview key={post._id} {...post} />)}
</ul>

export default PostList;