import {
  LockResetOutlined,
  Visibility,
  VisibilityOff,
  SaveOutlined,
  ArrowBack,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
  alpha,
  styled,
  IconButton,
  InputAdornment,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordSchema } from "../../lib/schemas/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "./accountApi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Styled components following the app's design patterns
const ResetPasswordContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
  background: theme.palette.mode === 'dark'
    ? 'radial-gradient(ellipse at center, rgba(31, 41, 55, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)'
    : 'radial-gradient(ellipse at center, rgba(249, 250, 251, 0.98) 0%, rgba(243, 244, 246, 0.95) 100%)',
}));

const ResetPasswordCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  maxWidth: 520,
  width: '100%',
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha('#1F2937', 0.95)} 0%, ${alpha('#111827', 0.90)} 100%)`
    : `linear-gradient(135deg, ${alpha('#FFFFFF', 0.95)} 0%, ${alpha('#F9FAFB', 0.90)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    : '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 107, 107, 0.1)',
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  marginBottom: theme.spacing(3),
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha('#374151', 0.3)
      : alpha('#F9FAFB', 0.8),
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.2),
      borderWidth: 1,
    },
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.5),
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
  padding: theme.spacing(1.5, 3),
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

const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1, 2),
  fontWeight: 600,
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

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

export default function ResetPasswordForm() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const theme = useTheme();
  
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    mode: "onTouched",
    resolver: zodResolver(resetPasswordSchema),
  });

  // Set email and token from URL parameters
  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    
    if (email) setValue('email', email);
    if (token) setValue('token', token);
  }, [searchParams, setValue]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    await resetPassword(data);
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Check if we have the required parameters
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    return (
      <ResetPasswordContainer maxWidth={false}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <ResetPasswordCard>
            <Box display="flex" flexDirection="column" alignItems="center">
              <IconContainer>
                <LockResetOutlined 
                  sx={{ 
                    fontSize: 40, 
                    color: theme.palette.error.main,
                  }} 
                />
              </IconContainer>

              <Typography variant="h5" align="center" color="error" sx={{ mb: 2, fontWeight: 600 }}>
                Invalid Reset Link
              </Typography>

              <Typography 
                variant="body1" 
                color="text.secondary" 
                align="center"
                sx={{ mb: 4 }}
              >
                This password reset link is invalid or has expired. 
                Please request a new password reset link.
              </Typography>

              <Link to="/forgot-password" style={{ textDecoration: 'none', marginRight: 16 }}>
                <Button
                  variant="contained"
                  startIcon={<LockResetOutlined />}
                >
                  Request New Link
                </Button>
              </Link>

              <Link to="/login" style={{ textDecoration: 'none' }}>
                <BackButton
                  startIcon={<ArrowBack />}
                >
                  Back to Login
                </BackButton>
              </Link>
            </Box>
          </ResetPasswordCard>
        </motion.div>
      </ResetPasswordContainer>
    );
  }

  return (
    <ResetPasswordContainer maxWidth={false}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <ResetPasswordCard>
          <Box display="flex" flexDirection="column" alignItems="center">
            {/* Icon and Logo */}
            <motion.div variants={itemVariants}>
              <IconContainer>
                <LockResetOutlined 
                  sx={{ 
                    fontSize: 40, 
                    color: theme.palette.primary.main,
                  }} 
                />
              </IconContainer>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants}>
              <TitleText variant="h4" align="center">
                Reset Password
              </TitleText>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                align="center"
                sx={{ mb: 4, fontWeight: 500 }}
              >
                Enter your new password below
              </Typography>
            </motion.div>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              width="100%"
              sx={{ maxWidth: 400 }}
            >
              <Grid container spacing={3}>
                {/* New Password */}
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Controller
                      name="newPassword"
                      control={control}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          label="New Password"
                          type={showPasswords.new ? 'text' : 'password'}
                          autoComplete="new-password"
                          error={!!errors.newPassword}
                          helperText={errors.newPassword?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => togglePasswordVisibility('new')}
                                  edge="end"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </motion.div>
                </Grid>

                {/* Confirm Password */}
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          label="Confirm New Password"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          autoComplete="new-password"
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => togglePasswordVisibility('confirm')}
                                  edge="end"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </motion.div>
                </Grid>

                {/* Hidden fields for email and token */}
                <input type="hidden" {...control.register('email')} />
                <input type="hidden" {...control.register('token')} />

                {/* Submit Button */}
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <SubmitButton
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveOutlined />
                        )
                      }
                      sx={{ mb: 3 }}
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </SubmitButton>
                  </motion.div>
                </Grid>

                {/* Back to Login */}
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Box display="flex" justifyContent="center">
                      <Link to="/login" style={{ textDecoration: 'none' }}>
                        <BackButton
                          startIcon={<ArrowBack />}
                        >
                          Back to Login
                        </BackButton>
                      </Link>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </ResetPasswordCard>
      </motion.div>
    </ResetPasswordContainer>
  );
}
