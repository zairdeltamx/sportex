// En el archivo App.jsx
import React, { useState } from "react";
import Index from "./routes/index";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { getApiUrl } from "./config";
import "./styles/styles.scss";
export default function App() {
  const [number, setNumber] = useState(1);

  console.log(number);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: getApiUrl("graphql"),
  });

  return (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <Index style={{ backgroundColor: "#001b4b" }}></Index>
      </ApolloProvider>
    </React.StrictMode>
  );
}
