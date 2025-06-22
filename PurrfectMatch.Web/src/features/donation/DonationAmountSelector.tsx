import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  useTheme,
  alpha,
  styled,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';

// Styled components following the established patterns
const SelectorContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 0),
}));

const AmountCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.08)
    : theme.palette.mode === 'dark'
    ? alpha('#1F2937', 0.7)
    : alpha('#FFFFFF', 0.9),
  backdropFilter: 'blur(8px)',
  borderRadius: theme.spacing(2),
  boxShadow: selected
    ? theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(255, 107, 107, 0.25)'
      : '0 8px 32px rgba(255, 107, 107, 0.15)'
    : theme.palette.mode === 'dark'
    ? '0 4px 16px rgba(0, 0, 0, 0.3)'
    : '0 4px 16px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 32px rgba(255, 107, 107, 0.2)'
      : '0 12px 32px rgba(255, 107, 107, 0.15)',
    borderColor: theme.palette.primary.main,
  },
}));

const CustomAmountContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#1F2937', 0.5)
    : alpha('#F8F9FA', 0.8),
  backdropFilter: 'blur(8px)',
}));

interface AmountOption {
  value: number;
  label: string;
  description: string;
  impact: string;
}

const predefinedAmounts: AmountOption[] = [
  {
    value: 25,
    label: '$25',
    description: 'Food & Care',
    impact: 'Feeds a pet for a week',
  },
  {
    value: 50,
    label: '$50',
    description: 'Medical Checkup',
    impact: 'Basic veterinary care',
  },
  {
    value: 100,
    label: '$100',
    description: 'Vaccination Set',
    impact: 'Complete vaccination series',
  },
  {
    value: 250,
    label: '$250',
    description: 'Emergency Care',
    impact: 'Emergency medical treatment',
  },
  {
    value: 500,
    label: '$500',
    description: 'Surgery Fund',
    impact: 'Life-saving surgery',
  },
  {
    value: 1000,
    label: '$1,000',
    description: 'Shelter Support',
    impact: 'Support shelter operations',
  },
];

export default function DonationAmountSelector() {
  const theme = useTheme();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setShowCustom(false);
  };

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseFloat(value));
    } else {
      setSelectedAmount(null);
    }
  };

  const handleCustomAmountToggle = () => {
    setShowCustom(!showCustom);
    if (!showCustom) {
      setSelectedAmount(null);
      setCustomAmount('');
    }
  };

  return (
    <SelectorContainer>
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
          Choose Your Impact
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
        >
          Select an amount that feels right for you. Every donation, no matter the size,
          helps us make a difference in the lives of pets waiting for their forever homes.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {predefinedAmounts.map((amount, index) => (
            <Grid item xs={12} sm={6} md={4} key={amount.value}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <AmountCard
                  selected={selectedAmount === amount.value && !showCustom}
                  onClick={() => handleAmountSelect(amount.value)}
                  elevation={0}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                  >
                    {amount.label}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    gutterBottom
                    sx={{ color: 'text.primary' }}
                  >
                    {amount.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                  >
                    {amount.impact}
                  </Typography>
                </AmountCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            variant={showCustom ? 'contained' : 'outlined'}
            color="primary"
            onClick={handleCustomAmountToggle}
            sx={{
              borderRadius: 28,
              padding: theme.spacing(1.5, 4),
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              mb: showCustom ? 3 : 0,
            }}
          >
            Enter Custom Amount
          </Button>

          {showCustom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <CustomAmountContainer>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Custom Donation Amount
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  type="number"
                  inputProps={{
                    min: 1,
                    step: 0.01,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme.palette.mode === 'dark'
                        ? alpha('#FFFFFF', 0.05)
                        : alpha('#FFFFFF', 0.8),
                    },
                  }}
                />
                {customAmount && parseFloat(customAmount) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ mt: 2, fontWeight: 600 }}
                    >
                      Thank you for your generous ${customAmount} donation!
                    </Typography>
                  </motion.div>
                )}
              </CustomAmountContainer>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </SelectorContainer>
  );
}
