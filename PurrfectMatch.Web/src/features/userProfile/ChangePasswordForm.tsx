import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  styled,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordSchema } from '../../lib/schemas/changePasswordSchema';
import { useChangePasswordMutation } from '../account/accountApi';

// Styled components
const ChangePasswordContainer = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.7) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: 600,
  margin: '0 auto',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

const PasswordStrengthBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  marginTop: theme.spacing(1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
  },
}));

const RequirementItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  fontSize: '0.875rem',
}));

const ChangePasswordForm: React.FC = () => {
  const [changePassword, { isLoading: isChangingPassword, error }] = useChangePasswordMutation();
  
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const newPassword = watch('newPassword');

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach(check => {
      if (check) score += 20;
    });

    return { score, checks };
  };
  const { score: passwordStrength, checks: passwordChecks } = calculatePasswordStrength(newPassword || '');

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 40) return 'error';
    if (strength < 80) return 'warning';
    return 'success';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 40) return 'Weak';
    if (strength < 80) return 'Medium';
    return 'Strong';
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: ChangePasswordSchema) => {
    try {
      await changePassword(data).unwrap();
      reset();
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };
  return (
    <ChangePasswordContainer>
      <CardContent sx={{ p: 4 }}>
        <SectionTitle variant="h5">
          <SecurityIcon />
          Change Password
        </SectionTitle>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Ensure your account is using a long, random password to stay secure.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error && 'data' in error && typeof error.data === 'string' 
              ? error.data 
              : 'Password change failed. Please try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Current Password */}
            <Grid item xs={12}>
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPasswords.current ? 'text' : 'password'}
                    label="Current Password"
                    required
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => togglePasswordVisibility('current')}
                            edge="end"
                          >
                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* New Password */}
            <Grid item xs={12}>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPasswords.new ? 'text' : 'password'}
                    label="New Password"
                    required
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => togglePasswordVisibility('new')}
                            edge="end"
                          >
                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Password Strength
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={`${getPasswordStrengthColor(passwordStrength)}.main`}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {getPasswordStrengthText(passwordStrength)}
                    </Typography>
                  </Box>
                  <PasswordStrengthBar
                    variant="determinate"
                    value={passwordStrength}
                    color={getPasswordStrengthColor(passwordStrength)}
                  />
                </Box>
              )}

              {/* Password Requirements */}
              {newPassword && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                    Password Requirements:
                  </Typography>
                  <RequirementItem>
                    {passwordChecks.length ? (
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                    ) : (
                      <CancelIcon color="error" sx={{ fontSize: 16 }} />
                    )}
                    <Typography variant="caption" color={passwordChecks.length ? 'success.main' : 'text.secondary'}>
                      At least 8 characters
                    </Typography>
                  </RequirementItem>
                  <RequirementItem>
                    {passwordChecks.lowercase ? (
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                    ) : (
                      <CancelIcon color="error" sx={{ fontSize: 16 }} />
                    )}
                    <Typography variant="caption" color={passwordChecks.lowercase ? 'success.main' : 'text.secondary'}>
                      One lowercase letter
                    </Typography>
                  </RequirementItem>
                  <RequirementItem>
                    {passwordChecks.uppercase ? (
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                    ) : (
                      <CancelIcon color="error" sx={{ fontSize: 16 }} />
                    )}
                    <Typography variant="caption" color={passwordChecks.uppercase ? 'success.main' : 'text.secondary'}>
                      One uppercase letter
                    </Typography>
                  </RequirementItem>
                  <RequirementItem>
                    {passwordChecks.numbers ? (
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                    ) : (
                      <CancelIcon color="error" sx={{ fontSize: 16 }} />
                    )}
                    <Typography variant="caption" color={passwordChecks.numbers ? 'success.main' : 'text.secondary'}>
                      One number
                    </Typography>
                  </RequirementItem>
                  <RequirementItem>
                    {passwordChecks.symbols ? (
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                    ) : (
                      <CancelIcon color="error" sx={{ fontSize: 16 }} />
                    )}
                    <Typography variant="caption" color={passwordChecks.symbols ? 'success.main' : 'text.secondary'}>
                      One special character
                    </Typography>
                  </RequirementItem>
                </Box>
              )}
            </Grid>

            {/* Confirm New Password */}
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPasswords.confirm ? 'text' : 'password'}
                    label="Confirm New Password"
                    required
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => togglePasswordVisibility('confirm')}
                            edge="end"
                          >
                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => reset()}
              disabled={isChangingPassword}
              sx={{ borderRadius: 2, minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || isChangingPassword}
              sx={{ 
                borderRadius: 2, 
                minWidth: 120,
                background: isValid && !isChangingPassword
                  ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                  : undefined,
              }}
            >
              {isChangingPassword ? 'Saving...' : 'Save Password'}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
            Make sure to store your new password in a secure location.
          </Typography>
        </form>
      </CardContent>
    </ChangePasswordContainer>
  );
};

export default ChangePasswordForm;
