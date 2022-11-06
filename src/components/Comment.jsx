export default function Comment({ postId, userId, comment, depth, deleteComment, updateComment, addComment }) {
	return (
		<div className="accordion" id={"viewCommentAccordian-" + comment._id}>
			<div className="accordion-item">
				<h2 className="accordion-header" id={"viewCommentHeading-" + comment._id}>
					<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#viewCommentCollapse-" + comment._id} aria-expanded="false" aria-controls={"viewCommentCollapse-" + comment._id}>
						{comment.deletedAt ? 'Deleted' : <>
							{comment.user.userName}
							{comment.edited ? <span className="fa fa-asterisk" style={{ color: 'red' }}></span> : null}
						</>}
					</button>
				</h2>
				<div id={"viewCommentCollapse-" + comment._id} className="accordion-collapse collapse show" aria-labelledby={"viewCommentHeading-" + comment._id} data-bs-parent={"#viewCommentAccordian-" + comment._id}>
					<div className="accordion-body">
						<div className="justify-content-between">
							{!comment.deletedAt && comment.user._id === userId ? <>
								<form
									action={`/api/comment/deleteComment/${postId}/${comment._id}?_method=DELETE`}
									method="POST"
									style={{ float: 'right' }}
									onSubmit={deleteComment.bind(null, comment._id)}
								>
									<div className="btn-group" role="group" aria-label="Comment Actions">
										<button className="btn btn-danger fa fa-trash" type="submit"></button>
										<button type="button" className="btn btn-warning fa fa-edit" data-bs-toggle="modal" data-bs-target={"#editComment-" + comment._id}></button>
									</div>
								</form>
							</> : null}

							{comment.deletedAt ? null : comment.text}
							{!comment.deletedAt && comment.user._id === userId ? <>
								<div className="modal fade" id={"editComment-" + comment._id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
									<div className="modal-dialog">
										<form className="modal-content" action={`/api/comment/editComment/${postId}/${comment._id}?_method=PATCH`} method="POST" onSubmit={updateComment.bind(null, comment._id)}>
											<div className="modal-header">
												<h5 className="modal-title" id="exampleModalLabel">Edit Comment</h5>
												<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
											</div>
											<div className="modal-body">
												<div className="mb-3">
													<label htmlFor="text" className="form-label">Edited Comment</label>
													<textarea className="form-control" id="text" name="text" defaultValue={comment.text}></textarea>
												</div>
											</div>
											<div className="modal-footer">
												<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
												<button className="btn btn-primary">Update Comment</button>
											</div>
										</form>
									</div>
								</div>
							</> : null}
						</div>
						<div className="accordion" id={"addCommentAccordian-" + comment._id}>
							<div className="accordion-item">
								<h2 className="accordion-header" id={"addCommentHeading-" + comment._id}>
									<button className="accordion-button collapsed" style={{ backgroundColor: 'hsl(190, 100%, 85%)' }} type="button" data-bs-toggle="collapse" data-bs-target={"#addCommentCollapse-" + comment._id} aria-expanded="false" aria-controls={"addCommentCollapse-" + comment._id}>
										Add Comment
									</button>
								</h2>
								<div id={"addCommentCollapse-" + comment._id} className="accordion-collapse collapse" aria-labelledby={"addCommentHeading-" + comment._id} data-bs-parent={"#addCommentAccordian-" + comment._id}>
									<div className="accordion-body">
										<form action={`/api/comment/createComment/${postId}/` + comment._id} method="POST" onSubmit={addComment.bind(null, comment._id)}>
											<div className="mb-3">
												<label htmlFor="text" className="form-label">Text</label>
												<textarea className="form-control" id="text" name="text"></textarea>
											</div>
											<button type="submit" className="btn btn-primary">Submit</button>
										</form>
									</div>
								</div>
							</div>
						</div>
						{(comment.comments || []).map(subComment =>
							<Comment key={subComment._id} postId={postId} userId={userId} comment={subComment} depth={depth + 1} deleteComment={deleteComment} updateComment={updateComment} addComment={addComment} />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}