import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { PaymentIntent } from '@stripe/stripe-js';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  styled,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';

const PaymentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#1F2937', 0.8)
    : alpha('#FFFFFF', 0.95),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.3)'
    : '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const SecurePaymentHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  borderRadius: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
}));

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

export default function StripePaymentForm({
  clientSecret,
  amount,
  onSuccess,
  onError,
  loading = false,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    // Check if payment was already successful but don't auto-trigger success
    // This prevents multiple confirm-payment calls
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case 'succeeded':
            // Payment already succeeded, but let user explicitly confirm
            console.log('Payment already succeeded:', paymentIntent.id);
            break;
          case 'processing':
            // Handle processing state
            console.log('Payment is processing:', paymentIntent.id);
            break;
          case 'requires_payment_method':
            // Handle requires payment method
            console.log('Payment requires payment method:', paymentIntent.id);
            break;
          default:
            console.log('Payment status:', paymentIntent.status);
            break;
        }
      }
    });
  }, [stripe, clientSecret]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent) {
        // Payment successful, call the success handler
        onSuccess(paymentIntent);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentElementChange = (event: { complete: boolean; error?: { message: string } }) => {
    setIsComplete(event.complete);
    if (event.error) {
      setErrorMessage(event.error.message);
    } else {
      setErrorMessage(null);
    }
  };
  if (!stripe || !elements) {
    return (
      <PaymentContainer>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading Stripe... (Stripe: {stripe ? 'Loaded' : 'Not Loaded'}, Elements: {elements ? 'Loaded' : 'Not Loaded'})
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Client Secret: {clientSecret ? 'Present' : 'Missing'}
          </Typography>
        </Box>
      </PaymentContainer>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <PaymentContainer>
        <SecurePaymentHeader>
          <LockIcon sx={{ mr: 1, color: 'success.main', fontSize: '1.2rem' }} />
          <Typography variant="body2" color="success.main" fontWeight={600}>
            Secure Payment - SSL Encrypted
          </Typography>
        </SecurePaymentHeader>

        <Typography variant="h6" gutterBottom align="center" fontWeight={600}>
          Complete Your ${amount.toFixed(2)} Donation
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <PaymentElement
              onChange={handlePaymentElementChange}
              options={{
                layout: 'tabs',
                paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
              }}
            />
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={!stripe || !elements || isLoading || loading || !isComplete}
            sx={{
              borderRadius: 28,
              padding: theme.spacing(2),
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                backgroundColor: theme.palette.action.disabledBackground,
              },
            }}
          >
            {isLoading || loading ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Processing...
              </Box>
            ) : (
              `Donate $${amount.toFixed(2)}`
            )}
          </Button>
        </form>

        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ mt: 2, display: 'block' }}
        >
          Your payment information is secure and encrypted. We never store your card details.
        </Typography>
      </PaymentContainer>
    </motion.div>
  );
}
