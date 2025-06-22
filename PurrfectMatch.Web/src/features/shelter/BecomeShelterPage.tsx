import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,  Grid,
  alpha,
  styled,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Business,
  LocationOn,
  Description,  Send,
  ArrowBack,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { shelterApplicationSchema, ShelterApplicationSchema } from '../../lib/schemas/shelterApplicationSchema';
import { useCreateShelterApplicationMutation } from '../shelter/shelterApi';
import { useUserInfoQuery } from '../account/accountApi';

// Styled components following the app's design patterns
const PageContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? `radial-gradient(circle at 20% 80%, rgba(79, 172, 254, 0.1) 0%, transparent 50%), 
       radial-gradient(circle at 80% 20%, rgba(79, 172, 254, 0.08) 0%, transparent 50%),
       linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`
    : `radial-gradient(circle at 20% 80%, rgba(79, 172, 254, 0.15) 0%, transparent 50%), 
       radial-gradient(circle at 80% 20%, rgba(79, 172, 254, 0.1) 0%, transparent 50%),
       linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)`,
  padding: theme.spacing(3),
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  width: '100%',
  background: theme.palette.mode === 'dark'
    ? alpha('#1F2937', 0.95)
    : alpha('#FFFFFF', 0.95),
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
    : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.4),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 28,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(79, 172, 254, 0.4)'
    : '0 8px 32px rgba(79, 172, 254, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(79, 172, 254, 0.5)'
      : '0 12px 40px rgba(79, 172, 254, 0.4)',
  },
  '&:disabled': {
    transform: 'none',
    boxShadow: 'none',
  },
  transition: 'all 0.3s ease',
}));

const steps = ['Shelter Information', 'Location Details', 'Additional Information'];

export default function BecomeShelterPage() {
  const navigate = useNavigate();
  const { data: user } = useUserInfoQuery();
  const [createShelterApplication, { isLoading }] = useCreateShelterApplicationMutation();
  const [activeStep, setActiveStep] = React.useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<ShelterApplicationSchema>({
    resolver: zodResolver(shelterApplicationSchema),
    mode: 'onTouched',
    defaultValues: {
      shelterName: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      remarks: '',
    },
  });

  // Redirect if user is already a shelter manager
  React.useEffect(() => {
    if (user?.roles?.includes('ShelterManager')) {
      toast.info('You are already a shelter manager!');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data: ShelterApplicationSchema) => {
    try {
      const applicationData = {
        shelterName: data.shelterName,
        address: data.address,
        remarks: data.remarks || undefined,
      };

      await createShelterApplication(applicationData).unwrap();
        toast.success('Shelter application submitted successfully! We will review your application and get back to you soon.');
      navigate('/');
    } catch (error: unknown) {
      console.error('Error submitting shelter application:', error);
      const errorMessage = error && typeof error === 'object' && 'data' in error && 
        error.data && typeof error.data === 'object' && 'message' in error.data && 
        typeof error.data.message === 'string' 
          ? error.data.message 
          : 'Failed to submit shelter application. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getFieldsForStep = (step: number): (keyof ShelterApplicationSchema)[] => {
    switch (step) {
      case 0:
        return ['shelterName'];
      case 1:
        return ['address'];
      case 2:
        return ['remarks'];
      default:
        return [];
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Business sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Tell us about your shelter
              </Typography>
              <Typography variant="body2" color="text.secondary">
                What would you like to name your shelter?
              </Typography>
            </Box>

            <Controller
              name="shelterName"
              control={control}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  fullWidth
                  label="Shelter Name"
                  placeholder="e.g., Happy Tails Animal Shelter"
                  error={!!errors.shelterName}
                  helperText={errors.shelterName?.message}
                  sx={{ mb: 3 }}
                />
              )}
            />
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <LocationOn sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Where is your shelter located?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Provide the address details for your shelter
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="address.street"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      label="Street Address"
                      placeholder="123 Main Street"
                      error={!!errors.address?.street}
                      helperText={errors.address?.street?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="address.city"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      label="City"
                      placeholder="Your City"
                      error={!!errors.address?.city}
                      helperText={errors.address?.city?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="address.state"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      label="State/Province"
                      placeholder="Your State"
                      error={!!errors.address?.state}
                      helperText={errors.address?.state?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="address.postalCode"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      label="Postal Code"
                      placeholder="12345"
                      error={!!errors.address?.postalCode}
                      helperText={errors.address?.postalCode?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="address.country"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      label="Country"
                      placeholder="Your Country"
                      error={!!errors.address?.country}
                      helperText={errors.address?.country?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Description sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Additional Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tell us more about your shelter and why you want to join our platform
              </Typography>
            </Box>

            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Remarks (Optional)"
                  placeholder="Tell us about your shelter's mission, experience with animals, facilities, or any other relevant information..."
                  error={!!errors.remarks}
                  helperText={errors.remarks?.message}
                />
              )}
            />

            <Alert severity="info" sx={{ mt: 3, borderRadius: 3 }}>
              <Typography variant="body2">
                <strong>What happens next?</strong><br />
                Our team will review your application within 3-5 business days. You'll receive an email notification once your application has been processed.
              </Typography>
            </Alert>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <PageContainer>
        <Alert severity="warning">
          Please log in to submit a shelter application.
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 600 }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3, borderRadius: 20 }}
        >
          Back to Home
        </Button>

        <FormPaper elevation={0}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              Become a Shelter Partner
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join our platform to help more animals find loving homes
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                {renderStepContent(activeStep)}
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ borderRadius: 20 }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <SubmitButton
                  type="submit"
                  variant="contained"
                  disabled={!isValid || isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </SubmitButton>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ borderRadius: 20 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </FormPaper>
      </motion.div>
    </PageContainer>
  );
}
