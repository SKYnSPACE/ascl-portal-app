import '../styles/globals.css'
import Layout from "../components/Layout";

import { LocalDatabaseProvider } from '../components/LocalDatabase';

export default function App({ Component, pageProps }) {
  return (
    <LocalDatabaseProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LocalDatabaseProvider>
  );
}
