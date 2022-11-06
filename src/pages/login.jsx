import { useRouter } from "next/router";
import useGlobals from "../context";

export default function Login() {
	const { setUser, setMessages } = useGlobals();
	const router = useRouter();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const response = await fetch(form.getAttribute('action'), {
			method: form.method,
			body: new URLSearchParams(new FormData(form)),
			credentials: "include"
		});
		const json = await response.json();
		if (json.messages) setMessages(json.messages);
		if (json.user) {
			setUser(json.user);
			router.push("/profile/" + json.user.userName);
		}
	};

	return (
		<main className="container">
			<div className="row justify-content-center">
				<section className="col-6 mt-5">
					<form action="/api/login" method="POST" onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
							<input
								type="email"
								className="form-control"
								id="exampleInputEmail1"
								aria-describedby="emailHelp"
								name="email"
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="exampleInputPassword1" className="form-label">Password</label>
							<input
								type="password"
								className="form-control"
								id="exampleInputPassword1"
								name="password"
							/>
						</div>
						<button type="submit" className="btn btn-primary">Submit</button>
					</form>
				</section>
			</div>
		</main>
	);
}
