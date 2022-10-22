import { Link } from "react-router-dom";

const PostPreview = ({ _id, media, caption, title }) => <li className="col-6 justify-content-between mt-5">
	<Link to={`/post/${_id}`}>
		{media.endsWith('.mp4') ? <video src={media} alt={caption} ></video> : media.endsWith('.mp3') ? <p>{title}</p> : <img src={media} className="img-fluid" alt={caption}  />}
	</Link>
</li>

export default PostPreview;