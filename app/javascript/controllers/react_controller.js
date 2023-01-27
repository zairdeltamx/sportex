import { Controller } from "@hotwired/stimulus";
import { createRoot } from "react-dom/client";
import React from "react";
import Index from "../react/src/routes/index";
import { Provider } from "react-redux";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { store } from "../react/src/redux/store";
import { getApiUrl } from "../react/src/config";
// Connects to data-controller="react"
export default class extends Controller {
  connect() {
    const res = document.getElementById("test");
    console.log(res, "RESSSSSS");
    const root = createRoot(document.getElementById("app"));
    const client = new ApolloClient({
      cache: new InMemoryCache(),

      uri: getApiUrl("graphql"),
      // uri: 'http://localhost:3000/graphql',
    });
    console.log("NUEVOSSSSSSSSSSS");
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <Index></Index>
          </ApolloProvider>
        </Provider>
      </React.StrictMode>
    );
  }
}
