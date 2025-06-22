import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Grid,
  Divider,
  useTheme,
  alpha,
  styled,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { getStripe } from '../../lib/stripe';
import StripePaymentForm from './StripePaymentForm';
import { 
  useCreatePaymentIntentMutation, 
  useConfirmPaymentMutation,
  useAddLegacyDonationMutation 
} from './donationApi';
import type { PaymentIntent } from '@stripe/stripe-js';

// Styled components following the established patterns
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#1F2937', 0.8)
    : alpha('#FFFFFF', 0.95),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
}));

const PaymentMethodCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.05)
    : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.03),
  },
}));

const SecurityNote = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  borderRadius: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
  marginTop: theme.spacing(3),
}));

const SuccessContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  borderRadius: theme.spacing(2),
  border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
}));

interface DonationFormData {
  amount: number;
  donorName: string;
  email: string;
  message: string;
  isAnonymous: boolean;
  paymentMethod: 'stripe' | 'legacy';
}

type DonationStep = 'details' | 'payment' | 'success';

export default function DonationForm() {
  const theme = useTheme();
  const [createPaymentIntent, { isLoading: isCreatingPayment }] = useCreatePaymentIntentMutation();
  const [confirmPayment] = useConfirmPaymentMutation();
  const [addLegacyDonation, { isLoading: isProcessingLegacy }] = useAddLegacyDonationMutation();
  
  const [currentStep, setCurrentStep] = useState<DonationStep>('details');  const [clientSecret, setClientSecret] = useState<string>('');
  const [completedDonation, setCompletedDonation] = useState<{ donationId?: number; id?: number; paymentStatus?: string; createdAt?: string; donationDate?: string } | null>(null);
  
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 0,
    donorName: '',
    email: '',
    message: '',
    isAnonymous: false,
    paymentMethod: 'stripe',
  });

  const [errors, setErrors] = useState<Partial<DonationFormData>>({});

  const steps = ['Donation Details', 'Payment', 'Confirmation'];

  const handleInputChange = (field: keyof DonationFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'amount' 
      ? parseFloat(event.target.value) || 0
      : field === 'isAnonymous'
      ? event.target.checked
      : event.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DonationFormData> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 0;
    }

    if (!formData.isAnonymous) {
      if (!formData.donorName.trim()) {
        newErrors.donorName = '';
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = '';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }    if (formData.paymentMethod === 'stripe') {
      try {        console.log('Creating payment intent with data:', {
          amount: formData.amount,
          currency: 'usd',
          description: formData.message || 'Donation to PurrfectMatch',
          isAnonymous: formData.isAnonymous,
          userId: undefined, // Don't send email as userId - backend will handle user lookup if needed
          automaticPaymentMethods: true,
        });
        
        const response = await createPaymentIntent({
          amount: formData.amount,
          currency: 'usd',
          description: formData.message || 'Donation to PurrfectMatch',
          isAnonymous: formData.isAnonymous,
          userId: undefined, // Don't send email as userId - backend will handle user lookup if needed
          automaticPaymentMethods: true,
        }).unwrap();

        console.log('Payment intent response:', response);
        setClientSecret(response.clientSecret);
        setCurrentStep('payment');
      } catch (error) {
        console.error('Payment intent creation error:', error);
        toast.error(`There was an error setting up payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      // Handle legacy donation
      try {
        const result = await addLegacyDonation({
          amount: formData.amount,
          donorName: formData.isAnonymous ? 'Anonymous' : formData.donorName,
          isAnonymous: formData.isAnonymous,
          message: formData.message,
          donationDate: new Date().toISOString(),
        }).unwrap();

        setCompletedDonation(result);
        setCurrentStep('success');
        toast.success('Thank you for your generous donation!');
      } catch (error) {
        console.error('Legacy donation error:', error);
        toast.error('There was an error processing your donation. Please try again.');
      }
    }
  };  const handlePaymentSuccess = async (paymentIntent: PaymentIntent) => {
    // Prevent multiple calls by checking if we're already processing
    if (currentStep === 'success') {
      console.log('Payment success already processed, ignoring duplicate call');
      return;
    }

    try {
      console.log('Processing payment success for:', paymentIntent.id, 'Status:', paymentIntent.status);
      
      // Call confirm payment to create/update the donation record
      const result = await confirmPayment({
        paymentIntentId: paymentIntent.id,
      }).unwrap();

      setCompletedDonation(result);
      setCurrentStep('success');
      toast.success('Thank you for your generous donation!');
    } catch (error: unknown) {
      console.error('Payment confirmation error:', error);
      
      // If the error is about already confirmed payment, still treat as success
      const errorString = JSON.stringify(error);
      if (errorString.includes('already succeeded') || errorString.includes('already confirmed')) {
        // Payment was successful, just update UI
        setCompletedDonation({
          donationId: Math.floor(Math.random() * 1000), // Temporary ID
          paymentStatus: 'succeeded',
          createdAt: new Date().toISOString()
        });
        setCurrentStep('success');
        toast.success('Thank you for your generous donation!');
      } else {
        toast.error('Payment succeeded but there was an error confirming your donation.');
      }
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };
  const handleBackToDetails = () => {
    setCurrentStep('details');
    setClientSecret('');
  };
  const handleNewDonation = () => {
    setCurrentStep('details');
    setClientSecret('');
    setCompletedDonation(null);
    setFormData({
      amount: 0,
      donorName: '',
      email: '',
      message: '',
      isAnonymous: false,
      paymentMethod: 'stripe',
    });
    setErrors({});
  };

  const renderDetailsStep = () => (
    <form onSubmit={handleDetailsSubmit}>
      <Grid container spacing={3}>
        {/* Amount */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Donation Amount"
            type="number"
            value={formData.amount || ''}
            onChange={handleInputChange('amount')}
            required
            error={!!errors.amount}
            helperText={errors.amount !== undefined ? 'Please enter a valid amount' : ''}
            InputProps={{
              startAdornment: '$',
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        {/* Anonymous Donation Checkbox */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isAnonymous}
                onChange={handleInputChange('isAnonymous')}
                color="primary"
              />
            }
            label="Make this an anonymous donation"
          />
        </Grid>

        {/* Donor Information (only if not anonymous) */}
        {!formData.isAnonymous && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.donorName}
                onChange={handleInputChange('donorName')}
                required
                error={!!errors.donorName}
                helperText={errors.donorName !== undefined ? 'Name is required' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                error={!!errors.email}
                helperText={errors.email !== undefined ? 'Valid email is required' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </>
        )}

        {/* Message */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Message (Optional)"
            multiline
            rows={3}
            value={formData.message}
            onChange={handleInputChange('message')}
            placeholder="Leave a message with your donation..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Payment Method */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
              Payment Method
            </FormLabel>
            <RadioGroup
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                paymentMethod: e.target.value as 'stripe' | 'legacy' 
              }))}
              row
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <PaymentMethodCard 
                    selected={formData.paymentMethod === 'stripe'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'stripe' }))}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Radio value="stripe" sx={{ mr: 1 }} />
                      <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight={600}>
                        Credit Card (Stripe)
                      </Typography>
                    </Box>
                  </PaymentMethodCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PaymentMethodCard 
                    selected={formData.paymentMethod === 'legacy'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'legacy' }))}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Radio value="legacy" sx={{ mr: 1 }} />
                      <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight={600}>
                        Other Payment
                      </Typography>
                    </Box>
                  </PaymentMethodCard>
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Security Note */}
        <Grid item xs={12}>
          <SecurityNote>
            <SecurityIcon sx={{ mr: 2, color: 'success.main' }} />
            <Typography variant="body2" color="text.primary">
              Your payment information is encrypted and secure. We never store your
              credit card details.
            </Typography>
          </SecurityNote>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isCreatingPayment || isProcessingLegacy}
            sx={{
              borderRadius: 28,
              padding: theme.spacing(2, 6),
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: '200px',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            {(isCreatingPayment || isProcessingLegacy) ? 'Processing...' : 
             formData.paymentMethod === 'stripe' ? 'Continue to Payment' : 
             `Donate $${formData.amount || 0}`}
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  const renderPaymentStep = () => (
    <Box>
      <Elements stripe={getStripe()} options={{ clientSecret }}>
        <StripePaymentForm
          clientSecret={clientSecret}
          amount={formData.amount}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </Elements>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleBackToDetails}
          sx={{ borderRadius: 28 }}
        >
          Back to Details
        </Button>
      </Box>
    </Box>
  );

  const renderSuccessStep = () => (
    <SuccessContainer>
      <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom fontWeight="bold" color="success.main">
        Thank You!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your donation of ${formData.amount} has been received
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Your generosity helps us continue our mission to connect pets with loving homes.
      </Typography>
      
      {completedDonation && (
        <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body2">
            <strong>Donation ID:</strong> {completedDonation.donationId || completedDonation.id}
            <br />
            <strong>Status:</strong> {completedDonation.paymentStatus || 'Completed'}
            <br />
            <strong>Date:</strong> {new Date(completedDonation.createdAt || completedDonation.donationDate || new Date()).toLocaleDateString()}
          </Typography>
        </Alert>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleNewDonation}
        sx={{
          borderRadius: 28,
          padding: theme.spacing(2, 4),
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
        }}
      >
        Make Another Donation
      </Button>
    </SuccessContainer>
  );

  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          {currentStep === 'success' ? 'Donation Complete' : 'Complete Your Donation'}
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
        >
          {currentStep === 'details' && 'Fill in your details below to complete your donation. All transactions are secure and your information is protected.'}
          {currentStep === 'payment' && 'Complete your secure payment using Stripe.'}
          {currentStep === 'success' && 'Thank you for supporting our mission!'}
        </Typography>

        <FormContainer elevation={0} sx={{ maxWidth: '700px', mx: 'auto' }}>
          {currentStep !== 'success' && (
            <Stepper activeStep={currentStep === 'details' ? 0 : 1} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {currentStep === 'details' && renderDetailsStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'success' && renderSuccessStep()}
        </FormContainer>
      </motion.div>
    </Box>
  );
}
