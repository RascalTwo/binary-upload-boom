import Script from 'next/script'
import Layout from '../Layout'

export default function MyApp({ Component, pageProps }) {
  return <Layout>
		<Component {...pageProps} />
		<Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossOrigin="anonymous"></Script>
	</Layout>
}