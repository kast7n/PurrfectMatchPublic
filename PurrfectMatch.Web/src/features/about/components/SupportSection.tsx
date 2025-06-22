import { Typography, Box, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ContactSupport as ContactIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';

export default function SupportSection() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleContactSupport = () => {
    // Navigate to contact page and scroll to form
    navigate('/contact');
    // Small delay to ensure page loads before scrolling
    setTimeout(() => {
      const formElement = document.querySelector('[data-contact-form]');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <Box sx={{ 
        textAlign: 'center', 
        p: 6, 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 16px 40px rgba(0,0,0,0.3)' 
          : '0 16px 40px rgba(0,0,0,0.12)',
      }}>
        <ContactIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
          Support
        </Typography>
        <Typography variant="body1" mb={4} color="text.secondary" maxWidth={600} mx="auto">
          If you need any assistance or have any questions about PurrfectMatch, feel free to reach out to our support team. We're here to help!
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>          <Button 
            variant="contained" 
            size="large" 
            startIcon={<ContactIcon />}
            onClick={handleContactSupport}
            sx={{ borderRadius: 2 }}
          >
            Contact Support
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            startIcon={<GitHubIcon />}
            sx={{ borderRadius: 2 }}
          >
            View on GitHub
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}
