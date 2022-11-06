const Message = ({ type, children }) => <div className={'alert alert-dismissible fade show alert-' + type}>
	{children}
	<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>;

const Messages = ({ messages }) => <>
	{messages.errors && messages.errors.map((el, i) =>
		<Message key={el.msg} type="danger">{el.msg}</Message>
	)}
	{messages.success && messages.success.map((el, i) =>
		<Message key={el.msg} type="success">{el.msg}</Message>
	)}
	{messages.info
		? messages.info.map((el, i) =>
			<Message key={el.msg} type="info">{el.msg}</Message>
		)
		: null
	}
</>

export default Messages;