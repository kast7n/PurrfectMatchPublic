import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  alpha,
  styled,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Send, Pets, CheckCircle } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

// Styled components
const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha('#1F2937', 0.95)} 0%, ${alpha('#111827', 0.90)} 100%)`
    : `linear-gradient(135deg, ${alpha('#FFFFFF', 0.95)} 0%, ${alpha('#F9FAFB', 0.90)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    : '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 107, 107, 0.1)',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha('#374151', 0.5)
      : alpha('#F9FAFB', 0.8),
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha('#374151', 0.7)
        : alpha('#FFFFFF', 0.9),
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha('#374151', 0.8)
        : '#FFFFFF',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  color: '#FFFFFF',
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
    color: '#FFFFFF',
  },
  '&:disabled': {
    background: alpha(theme.palette.primary.main, 0.3),
    color: alpha('#FFFFFF', 0.7),
    transform: 'none',
    boxShadow: 'none',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
    : `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const categories = [
  'General Inquiry',
  'Adoption Questions',
  'Pet Care Support',
  'Volunteer Opportunities',
  'Technical Support',
  'Donation Information',
  'Partnership Inquiry',
  'Other',
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Contact form submitted:', data);
    setIsSubmitting(false);
    setShowSuccess(true);
    reset();
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      data-contact-form
    >
      <FormContainer>
        <motion.div variants={itemVariants}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Pets sx={{ color: 'primary.main', fontSize: '1.8rem' }} />
            <SectionTitle variant="h4">
              Send Us a Message
            </SectionTitle>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}
          >
            We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
          </Typography>
        </motion.div>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <motion.div variants={itemVariants}>
            <StyledTextField
              fullWidth
              label="Your Name *"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 3 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StyledTextField
              fullWidth
              label="Email Address *"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 3 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StyledTextField
              fullWidth
              select
              label="Category *"
              {...register('category', { required: 'Please select a category' })}
              error={!!errors.category}
              helperText={errors.category?.message}
              sx={{ mb: 3 }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </StyledTextField>
          </motion.div>

          <motion.div variants={itemVariants}>
            <StyledTextField
              fullWidth
              label="Subject *"
              {...register('subject', { required: 'Subject is required' })}
              error={!!errors.subject}
              helperText={errors.subject?.message}
              sx={{ mb: 3 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StyledTextField
              fullWidth
              label="Your Message *"
              multiline
              rows={5}
              {...register('message', {
                required: 'Message is required',
                minLength: {
                  value: 10,
                  message: 'Message must be at least 10 characters long',
                },
              })}
              error={!!errors.message}
              helperText={errors.message?.message}
              sx={{ mb: 4 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SubmitButton
              type="submit"
              fullWidth
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Send />
                )
              }
            >
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </SubmitButton>
          </motion.div>
        </Box>

        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            variant="filled"
            icon={<CheckCircle />}
            sx={{
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            Thank you for your message! We'll get back to you within 2 hours.
          </Alert>
        </Snackbar>
      </FormContainer>
    </motion.div>
  );
}
