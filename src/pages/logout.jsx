import { useRouter } from "next/router";
import { useEffect } from "react";
import useGlobals from "../context";

export default function Logout() {
	const { setUser } = useGlobals();
	const router = useRouter();

	useEffect(() => {
		fetch("/api/logout")
			.then(() => {
				setUser(null);
				router.push("/");
			});
	}, [setUser, router]);

	return <main className="container">
		<div className="row justify-content-around mt-5">
			<p>Logging out...</p>
		</div>
	</main>
}