import React, { useContext, useEffect, useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { getApiUrl } from './config';
import { MetamaskProvider } from './useContext/MetamaskContext';
import Index from './routes/index';
import './app.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { LoadingProvider } from './useContext/LoaderContext';
import { GraphqlProvider } from './useContext/GraphqlContext';
import { ChakraProvider } from '@chakra-ui/react';

import { extendTheme } from '@chakra-ui/react';

export default function App() {
  const tokenElement = document.querySelector('[name=csrf-token]');

  const httpLink = createHttpLink({
    uri: getApiUrl('graphql'),
    headers: {
      'X-CSRF-Token': tokenElement ? tokenElement.content : '',
    },
  });
  const customTheme = extendTheme({
    styles: {
      global: (props) => ({
        body: {
          color: 'default',
          bg: '#001b4b',
        },
      }),
    },
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
  const stripePromise = loadStripe(
    'pk_test_51K5OxHGZO8xuwpnS5uaAf3KxIIVfmQhOuNsZ5G31pywWKwFIKJJk9g43Cv5fZqcAPO1HGe2VaZMwjIRdfqUeNoaN00WVhSTR2J'
  );

  return (
    <ChakraProvider theme={customTheme}>
      <Elements stripe={stripePromise}>
        <MetamaskProvider>
          <LoadingProvider>
            <GraphqlProvider>
              <ApolloProvider client={client}>
                <Index />
              </ApolloProvider>
            </GraphqlProvider>
          </LoadingProvider>
        </MetamaskProvider>
      </Elements>
    </ChakraProvider>
  );
}
