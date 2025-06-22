import { Typography, Grid, Box, Paper, styled, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import {
  PersonAdd as SignUpIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  ContactSupport as ContactIcon
} from '@mui/icons-material';

const StepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  textAlign: 'center',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.6)' 
    : 'rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 12px 24px rgba(0,0,0,0.3)' 
      : '0 12px 24px rgba(0,0,0,0.1)',
  },
}));

interface Step {
  icon: React.ReactElement;
  title: string;
  description: string;
}

export default function GettingStartedSection() {
  const theme = useTheme();

  const steps: Step[] = [
    {
      icon: <SignUpIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Sign Up',
      description: 'Create an account on PurrfectMatch to unlock all the features and personalize your adoption experience.'
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Search for Pets',
      description: 'Browse through the available pets on our platform and use the filters to narrow down your options.'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Save Favorites',
      description: 'Save your favorite pets to your profile to keep track of them and compare later.'
    },
    {
      icon: <ContactIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Contact Shelters',
      description: 'Reach out to the shelters and rescues hosting the pets you\'re interested in to learn more and start the adoption process.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Typography variant="h3" component="h2" gutterBottom textAlign="center" fontWeight="bold" mb={6}>
        Getting Started
      </Typography>
      <Typography variant="body1" textAlign="center" mb={6} color="text.secondary">
        To get started with PurrfectMatch, simply follow these steps:
      </Typography>
      <Grid container spacing={4}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StepCard>
              <Box sx={{ mb: 2 }}>
                {step.icon}
              </Box>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </StepCard>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}
