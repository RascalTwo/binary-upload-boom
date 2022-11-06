import { useRouter } from "next/router";
import { useEffect } from "react";
import { signOut } from "next-auth/react"

export default function Logout() {
	const router = useRouter();

	useEffect(() => {
		signOut({ redirect: false });
		router.push("/");
	}, [router]);

	return <main className="container">
		<div className="row justify-content-around mt-5">
			<p>Logging out...</p>
		</div>
	</main>
}