import '../styles/globals.css'
import Layout from "../components/Layout";
import { SWRConfig } from "swr";
import { LocalDatabaseProvider } from '../components/LocalDatabase';

export default function App({ Component, pageProps }) {
  return (
    <LocalDatabaseProvider>
      <SWRConfig
        value={{fetcher: (url) => fetch(url).then((response) => response.json()),}}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </LocalDatabaseProvider>
  );
}
