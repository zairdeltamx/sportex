import React from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
const stripePromise = loadStripe(
  'pk_test_51K5OxHGZO8xuwpnS5uaAf3KxIIVfmQhOuNsZ5G31pywWKwFIKJJk9g43Cv5fZqcAPO1HGe2VaZMwjIRdfqUeNoaN00WVhSTR2J'
);

export const Checkout = ({ nft }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm nft={nft}></CheckoutForm>
    </Elements>
  );
};
