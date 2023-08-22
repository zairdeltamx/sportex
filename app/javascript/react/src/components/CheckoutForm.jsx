import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  StepContent,
  FormControlLabel,
  Checkbox,
  Box,
  FormControl,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useMetamask } from '../useContext/MetamaskContext';
import { notification } from './alerts/notifications';
import { checkout, paymentMetamask } from '../services/payment';
import { useLoadingContext } from '../useContext/LoaderContext';

const CheckoutForm = ({ nft }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [activeStep, setActiveStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [error, setError] = useState(null);

  const { addressMetamask } = useMetamask();
  const { transactionIsLoading, setTransactionIsLoading } = useLoadingContext();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleTermsCheckboxChange = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  const handlePaymentCard = async (ev) => {
    try {
      setError(null);
      setIsProcessing(true);
      ev.preventDefault();

      if (!elements || !stripe) {
        return;
      }

      const amount = parseFloat(nft.price) * 100;
      const ele = elements.getElement(CardElement);
      const { token, error } = await stripe.createToken(ele);

      if (error) {
        setError(
          error.message ||
            'Error generating payment token, please try again later'
        );
        setIsProcessing(false);
        return;
      }

      const checkoutResponse = await checkout({
        token,
        amount,
        addressMetamask,
        nft,
      });

      if (!checkoutResponse.success) {
        setError(checkoutResponse.message);
        return;
      }
      setPaymentCompleted(true);
      handleNext();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMetamaskPurchase = async () => {
    try {
      setIsProcessing(true);
      setTransactionIsLoading(true);

      const response = await paymentMetamask({ nft, addressMetamask });

      console.log(response, 'RESPONSE');
      if (!response.success) {
        setError(response.message);
        return;
      }

      setPaymentCompleted(true);
      handleNext();
    } finally {
      setIsProcessing(false);
      setTransactionIsLoading(false);
    }
  };

  return (
    <div>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>Accept Terms and Conditions</StepLabel>
          <StepContent>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={handleTermsCheckboxChange}
                />
              }
              label="I accept the terms and conditions"
            />
            <Box mt={2}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!acceptedTerms}
              >
                Next
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Select Payment Method</StepLabel>
          <StepContent>
            <Box display="flex" flexDirection="column">
              <Box m={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setPaymentMethod('card');
                    handleNext(); // Avanzar al siguiente paso
                  }}
                >
                  Pay with Card
                </Button>
              </Box>
              <Box m={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setPaymentMethod('metamask');
                    handleNext(); // Avanzar al siguiente paso
                  }}
                >
                  Pay with Metamask
                </Button>
              </Box>
            </Box>
            <Box mt={2}>
              <Button onClick={handleBack}>Back</Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Provide Payment Information</StepLabel>
          <StepContent>
            <Box>
              {paymentMethod === 'card' && (
                <form onSubmit={handlePaymentCard}>
                  <CardElement />
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="success"
                      type="submit"
                      disabled={isProcessing || paymentCompleted}
                    >
                      {isProcessing
                        ? 'Processing'
                        : paymentCompleted
                        ? 'Payment Completed'
                        : 'PAY IT'}
                    </Button>
                  </Box>
                </form>
              )}
            </Box>
            <Box m={2}>
              {paymentMethod === 'metamask' && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleMetamaskPurchase}
                    disabled={isProcessing || paymentCompleted}
                  >
                    {isProcessing
                      ? 'Processing'
                      : paymentCompleted
                      ? 'Payment Completed'
                      : 'CONFIRM PAY WITH METAMASK'}
                  </Button>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </>
              )}
            </Box>
            <Box mt={2}>
              <Button onClick={handleBack}>Back</Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Confirmation</StepLabel>
          <StepContent>
            <p>Your payment has been completed successfully.</p>
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
};

export default CheckoutForm;
