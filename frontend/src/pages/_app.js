import "../styles/tailwind.css";
import { withApollo } from "../lib/apollo";
import { AuthProvider } from "../state";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default withApollo(MyApp);
