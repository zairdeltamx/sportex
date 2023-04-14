import React, { useContext } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { getApiUrl } from "./config";
import { MetamaskProvider } from "./useContext/MetamaskContext";
import Index from "./routes/index";
import "./styles/styles.scss";
import { LoadingProvider } from "./useContext/LoaderContext";

export default function App() {
  const tokenElement = document.querySelector('[name=csrf-token]');

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: getApiUrl("graphql"),
    headers: {
      'X-CSRF-Token': tokenElement ? tokenElement.content : '',
    }
  });

  return (
    <MetamaskProvider>
      <LoadingProvider>
        <ApolloProvider client={client}>
          <Index style={{ backgroundColor: "#001b4b" }} />
        </ApolloProvider>
      </LoadingProvider >
    </MetamaskProvider>
  );
}
