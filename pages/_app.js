import Head from "next/head";

import "normalize.css";
import "sakura.css";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Netcup Ostereisuche 2024</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
