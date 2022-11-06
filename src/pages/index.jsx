import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Binary Upload Boom - Homepage</title>
      </Head>
      <main className="container">
        <div className="row justify-content-around mt-5">
          <Link href="/login" className="col-3 btn btn-primary">Login</Link>
          <Link href="/signup" className="col-3 btn btn-primary">Signup</Link>
        </div>
      </main>
    </div>
  )
}
