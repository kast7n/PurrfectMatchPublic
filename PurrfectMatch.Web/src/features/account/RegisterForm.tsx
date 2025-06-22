import { useForm } from "react-hook-form";
import { useRegisterMutation } from "./accountApi"
import { registerSchema, RegisterSchema } from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  PersonAddOutlined, 
  Visibility, 
  VisibilityOff, 
  EmailOutlined, 
  PetsOutlined,
  CheckCircleOutlined 
} from "@mui/icons-material";
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  TextField, 
  Button,
  useTheme,
  alpha,
  styled,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

// Styled components following the app's design patterns
const RegisterContainer = styled(Container)(({ theme }) => ({
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

const RegisterCard = styled(Paper)(({ theme }) => ({
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
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: theme.spacing(1),
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
    : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  border: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: '50%',
    background: `conic-gradient(${theme.palette.secondary.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },
  '&:hover::before': {
    opacity: 0.3,
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

const RegisterButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  color: '#FFFFFF', // Explicit white text color for visibility
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
    : `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 24px ${alpha(theme.palette.secondary.main, 0.4)}`,
    color: '#FFFFFF', // Maintain white text on hover
  },
  '&:disabled': {
    background: alpha(theme.palette.secondary.main, 0.3),
    color: alpha('#FFFFFF', 0.7), // Slightly transparent white for disabled state
    transform: 'none',
    boxShadow: 'none',
  },
}));

const AnimatedLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 600,
  marginLeft: theme.spacing(1),
  position: 'relative',
  transition: 'color 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: 0,
    height: 2,
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    color: theme.palette.primary.dark,
    '&::after': {
      width: '100%',
    },
  },
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`
    : `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.secondary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

const PasswordRequirements = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#374151', 0.3)
    : alpha('#F3F4F6', 0.8),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginTop: theme.spacing(1),
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
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

export default function RegisterForm() {
  const [registerUser] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  
  const {register, handleSubmit, setError, watch, formState: {errors, isValid, isSubmitting}} = useForm<RegisterSchema>({
    mode: 'onTouched',
    resolver: zodResolver(registerSchema)
  });

  const watchedPassword = watch('password', '');

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerUser(data).unwrap();
      navigate("/login");
    } catch (error) {
      const apiError = error as {message: string};
      if (apiError.message && typeof apiError.message === 'string') {
        const errorArray = apiError.message.split(',');

        errorArray.forEach(e => {
          if (e.includes('Password')) {
            setError('password', {message: e})
          } else if (e.includes('Email')) {
            setError('email', {message: e})
          }
        })
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password requirements validation
  const getPasswordRequirements = () => {
    const requirements = [
      { text: '6-10 characters', met: watchedPassword.length >= 6 && watchedPassword.length <= 10 },
      { text: 'One uppercase letter', met: /[A-Z]/.test(watchedPassword) },
      { text: 'One lowercase letter', met: /[a-z]/.test(watchedPassword) },
      { text: 'One number', met: /\d/.test(watchedPassword) },
      { text: 'One special character', met: /[!@#$%^&*()_+}{":;'?/>.<,]/.test(watchedPassword) },
    ];
    return requirements;
  };

  return (
    <RegisterContainer maxWidth={false}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <RegisterCard>
          <Box display="flex" flexDirection="column" alignItems="center">
            {/* Icon and Logo */}
            <motion.div variants={itemVariants}>
              <IconContainer>
                <PersonAddOutlined 
                  sx={{ 
                    fontSize: 40, 
                    color: theme.palette.secondary.main,
                  }} 
                />
              </IconContainer>
            </motion.div>

            {/* Welcome Text */}
            <motion.div variants={itemVariants}>
              <WelcomeText variant="h4" align="center">
                Join PurrfectMatch!
              </WelcomeText>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                align="center"
                sx={{ mb: 4, fontWeight: 500 }}
              >
                Create your account to start your pet adoption journey
              </Typography>
            </motion.div>

            {/* Registration Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              width="100%"
              sx={{ maxWidth: 450 }}
            >
              <motion.div variants={itemVariants}>
                <StyledTextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <StyledTextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password Requirements */}
                {watchedPassword && (
                  <PasswordRequirements>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Password Requirements:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {getPasswordRequirements().map((req, index) => (
                        <Chip
                          key={index}
                          label={req.text}
                          size="small"
                          icon={req.met ? <CheckCircleOutlined /> : undefined}
                          color={req.met ? "success" : "default"}
                          variant={req.met ? "filled" : "outlined"}
                          sx={{
                            fontSize: '0.7rem',
                            height: 24,
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                    </Box>
                  </PasswordRequirements>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <RegisterButton
                  type="submit"
                  fullWidth
                  disabled={isSubmitting || !isValid}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <PersonAddOutlined />
                    )
                  }
                  sx={{ mt: 3, mb: 3 }}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </RegisterButton>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Divider sx={{ mb: 3, opacity: 0.6 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                    Already have an account?
                  </Typography>
                </Divider>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <PetsOutlined 
                    sx={{ 
                      mr: 1, 
                      color: theme.palette.primary.main,
                      fontSize: 20 
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    Ready to sign in?
                    <AnimatedLink to="/login">
                      Sign In Here
                    </AnimatedLink>
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </RegisterCard>
      </motion.div>
    </RegisterContainer>
  );
}