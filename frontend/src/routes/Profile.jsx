import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import PostList from "../components/PostList";
import { API_BASE } from "../constants";

export function Profile() {
	const { user: loggedInUser, setUser: setLoggedInUser, setMessages } = useOutletContext();
	const userIdOrName = useParams().userIdOrName;

	const [user, setUser] = useState();
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetch(API_BASE + "/api/profile/" + userIdOrName, { credentials: "include" })
			.then((res) => res.json())
			.then(({ user, posts }) => {
				setUser(user)
				setPosts(posts);
			});
	}, [userIdOrName]);

	if (user === undefined) return null;
	else if (!user) return <div>User not found</div>;

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const response = await fetch(API_BASE + form.getAttribute('action'), {
			method: form.method,
			body: new FormData(form),
			credentials: "include"
		});
		const json = await response.json();
		if (json.messages) setMessages(json.messages);
		if (json.post) {
			setPosts([...posts, json.post]);
			form.reset();
		}
	};

	const isFollowing = loggedInUser.following.find(follow => follow.receiver._id === user._id)

	const handleFollowUnfollow = async (event) => {
		event.preventDefault();
		const response = await fetch(API_BASE + `/api/follow/${isFollowing ? 'un' : ''}followUser/${user._id}`, {
			method: isFollowing ? 'DELETE' : "POST",
			credentials: "include"
		});
		const follow = await response.json()
		if (isFollowing) {
			setUser({ ...user, followers: user.followers.filter(f => f._id !== follow._id) });
			setLoggedInUser({ ...loggedInUser, following: loggedInUser.following.filter(f => f._id !== follow._id) });
		} else {
			setUser({ ...user, followers: [...user.followers, follow] });
			setLoggedInUser({ ...loggedInUser, following: [...loggedInUser.following, follow] });
		}
	}

	return (
		<div className="container">
			<div className="row mt-5">
				<div className="col-6">
					<div>
						<p><strong>User Name</strong>: {user.userName}</p>
						<p><strong>Email</strong>: {user.email}</p>
						{loggedInUser?._id === user._id
							? <Link to="/logout" className="col-3 btn btn-primary">Logout</Link>
							: null}
						{loggedInUser
							? <>
								{loggedInUser._id !== user._id
									? <button className="btn btn-primary" onClick={handleFollowUnfollow}>
										{isFollowing ? 'Unfollow' : 'Follow'}
									</button>
									: null}
							</>
							: null}
					</div>
					<div className="mt-5">
						<h2>Add a post</h2>
						<form action="/api/post/createPost" encType="multipart/form-data" method="POST" onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="title" className="form-label">Title</label>
								<input type="text" className="form-control" id="title" name="title" />
							</div>
							<div className="mb-3">
								<label htmlFor="caption" className="form-label">Caption</label>
								<textarea className="form-control" id="caption" name="caption"></textarea>
							</div>
							<div className="mb-3">
								<label htmlFor="imgUpload" className="form-label">Media</label>
								<input type="file" className="form-control" id="imageUpload" name="file" />
							</div>
							<button type="submit" className="btn btn-primary" value="Upload">Submit</button>
						</form>
					</div>
				</div>
				<div className="col-6">
					<PostList posts={posts} />
					<div className="row justify-content-center mt-5">
						<Link className="btn btn-primary" to="/feed">Return to Feed</Link>
					</div>
				</div>
					<div className="col-3">
						<h2>Followers</h2>
						<ul>
							{user.followers.map(follow => <li key={follow._id}>
								<Link to={`/profile/${follow.sender.userName}`}>{follow.sender.userName}</Link>
							</li>)}
						</ul>
					</div>
					<div className="col-3">
						<h2>Following</h2>
						<ul>
							{user.following.map(follow => <li key={follow._id}>
								<Link to={`/profile/${follow.receiver.userName}`}>{follow.receiver.userName}</Link>
							</li>)}
						</ul>
					</div>
			</div>
		</div>
	)
}