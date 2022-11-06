import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Comment from '../../components/Comment'
import useGlobals from "../../context";

export default function Post() {
	const { user } = useGlobals();
	const router = useRouter();
	const postId = router.query.id

	const [post, setPost] = useState();
	const [comments, setComments] = useState([]);

	useEffect(() => {
		fetch(`/api/post/${postId}`)
			.then((res) => res.json())
			.then(({ post, comments }) => {
				setPost(post);
				setComments(comments);
			});
	}, [setPost, postId]);

	if (!user) return null;

	if (post === undefined) return null;
	else if (post === null) return <h2>Post not found</h2>;

	const handleLike = async (event) => {
		event.preventDefault();
		const button = event.currentTarget;
		const response = await fetch(button.getAttribute('action'), {
			method: button.getAttribute('method'),
			credentials: "include"
		});
		const change = await response.json();
		setPost({ ...post, likes: post.likes + change });
	};

	const handleDelete = async (event) => {
		event.preventDefault();
		const button = event.currentTarget;
		await fetch(button.getAttribute('action'), {
			method: button.getAttribute('method'),
			credentials: "include"
		});
		router.back();
	};

	const handleUpdate = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const response = await fetch(form.getAttribute('action'), {
			method: form.method,
			body: new FormData(form),
			credentials: "include"
		});
		const json = await response.json();
		if (json.post) {
			setPost(json.post);
			form.reset();
			form.querySelector('[data-bs-dismiss]').click();
		}
	};

	const handleAddComment = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const response = await fetch(form.getAttribute('action'), {
			method: form.method,
			body: new URLSearchParams(new FormData(form)),
			credentials: "include"
		});
		const comment = await response.json();
		setComments([...comments, comment]);
		form.reset();
	};

	const deleteComment = async (id, event) => {
		const newComments = JSON.parse(JSON.stringify(comments));
		const commentArrays = new Map();
		for (const comment of newComments) commentArrays.set(comment._id, newComments);

		const queue = [...newComments];
		while (queue.length) {
			const comment = queue.shift();
			if (comment._id === id) {

				event.preventDefault();
				const form = event.currentTarget;
				const response = await fetch(form.getAttribute('action'), {
					method: form.method,
					body: new URLSearchParams(new FormData(form)),
					credentials: "include"
				});
				const deletedComment = await response.json();
				if (deletedComment) {
					Object.assign(comment, deletedComment);
				} else {
					const array = commentArrays.get(comment.id);
					array.splice(array.indexOf(comment), 1);
				}
				break;
			}
			for (const subComment of comment.comments) {
				queue.push(subComment);
				commentArrays.set(subComment.id, comment.comments);
			}
		}

		setComments(newComments);
	}

	const updateComment = async (id, event) => {
		const newComments = JSON.parse(JSON.stringify(comments));

		const queue = [...newComments];
		while (queue.length) {
			const comment = queue.shift();
			if (comment._id === id) {
				event.preventDefault();
				const form = event.currentTarget;
				const response = await fetch(form.getAttribute('action'), {
					method: form.method,
					body: new URLSearchParams(new FormData(form)),
					credentials: "include"
				});
				Object.assign(comment, await response.json());
				form.querySelector('[data-bs-dismiss]').click();
				break;
			}
			for (const subComment of comment.comments) {
				queue.push(subComment);
			}
		}

		setComments(newComments);
	}


	const addComment = async (id, event) => {
		const newComments = JSON.parse(JSON.stringify(comments));

		const queue = [...newComments];
		while (queue.length) {
			const comment = queue.shift();
			if (comment._id === id) {
				event.preventDefault();
				const form = event.currentTarget;
				const response = await fetch(form.getAttribute('action'), {
					method: form.method,
					body: new URLSearchParams(new FormData(form)),
					credentials: "include"
				});
				const newComment = await response.json()
				comment.comments.push(newComment);
				form.closest('.accordion').querySelector('button').click();
				form.reset();
				break;
			}
			for (const subComment of comment.comments) {
				queue.push(subComment);
			}
		}

		setComments(newComments);
	}

	return (
		<div className="container">
			<div className="row justify-content-center mt-5">
				<div className="col-6">
					<h2>
						{post.title}
						{post.edited ? <span className="fa fa-asterisk" style={{ color: 'red' }}></span> : null}
					</h2>
					{post.media.endsWith('.mp4') ? <video src={post.media} controls alt={post.caption} ></video> : post.media.endsWith('.mp3') ? <audio src={post.media} controls alt={post.caption} /> : <img src={post.media} className="img-fluid" alt={post.caption}  />}
					<div className="row justify-content-between">
						<h3 className="col-3">Likes: {post.likes}</h3>
						{post.user === user._id && (
							<>
								<div className="btn-group col-4" role="group" aria-label="Post Actions">
									<button action={`/api/post/likePost/${post._id}?_method=PUT`} method="POST" className="btn btn-primary fa fa-heart" type="submit" onClick={handleLike}></button>
									<button type="button" className="btn btn-warning fa fa-edit" data-bs-toggle="modal" data-bs-target="#editPost"></button>
									<button action={`/api/post/deletePost/${post._id}?_method=DELETE`} method="POST" className="btn btn-danger fa fa-trash" type="submit" onClick={handleDelete}></button>
								</div>
								<div className="modal fade" id="editPost" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
									<div className="modal-dialog">
										<form className="modal-content" encType="multipart/form-data" action={`/api/post/editPost/${post.id}?_method=PATCH`} method="POST" onSubmit={handleUpdate}>
											<div className="modal-header">
												<h5 className="modal-title" id="exampleModalLabel">Edit Comment</h5>
												<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
											</div>
											<div className="modal-body">
												<div className="mb-3">
													<label htmlFor="title" className="form-label">Title</label>
													<input type="text" className="form-control" id="title" name="title" defaultValue={post.title} />
												</div>
												<div className="mb-3">
													<label htmlFor="caption" className="form-label">Caption</label>
													<textarea className="form-control" id="caption" name="caption" defaultValue={post.caption}></textarea>
												</div>
												<div className="mb-3">
													<label htmlFor="imgUpload" className="form-label">New Media</label>
													<input type="file" className="form-control" id="imageUpload" name="file" />
												</div>
											</div>
											<div className="modal-footer">
												<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
												<button className="btn btn-primary">Update Post</button>
											</div>
										</form>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
				<div className="col-3 mt-5">
					<p>{post.caption}</p>
				</div>
				<div className="mt-5">
					<h2>Add a comment</h2>
					<form action={'/api/comment/createComment/' + post._id} method="POST" onSubmit={handleAddComment}>
						<div className="mb-3">
							<label htmlFor="text" className="form-label">Comment</label>
							<textarea className="form-control" id="text" name="text"></textarea>
						</div>
						<button type="submit" className="btn btn-primary" value="Upload">Submit</button>
					</form>
				</div>
				<ul>
					{comments.map((comment) => (
						<Comment
							key={comment._id}
							comment={comment}
							depth={0}

							postId={post._id}
							userId={user._id}
							deleteComment={deleteComment}
							updateComment={updateComment}
							addComment={addComment}
						/>
					))}
				</ul>
				<div className="col-6 mt-5">
					<Link className="btn btn-primary" href={`/profile/` + user.userName}>Return to Profile</Link>
					<Link className="btn btn-primary" href="/feed">Return to Feed</Link>
				</div>
			</div>
		</div>
	)
}