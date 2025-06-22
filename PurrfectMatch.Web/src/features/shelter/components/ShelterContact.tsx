import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  styled,
  alpha,
  Divider,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Language,
  Schedule,
  ContactMail,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Shelter } from '../../../app/models/shelter';

interface ShelterContactProps {
  shelter: Shelter;
}

const ContactContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 12px 40px rgba(0,0,0,0.3)'
    : '0 12px 40px rgba(0,0,0,0.08)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
  '& .MuiSvgIcon-root': {
    color: theme.palette.success.main,
    fontSize: '1.5rem',
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.3)
    : alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginBottom: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
    transform: 'translateY(-2px)',
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    fontSize: '1.3rem',
  },
}));

const ContactButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  marginTop: theme.spacing(2),
  fontWeight: 600,
  textTransform: 'none',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const HoursContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.info.main, 0.1)
    : alpha(theme.palette.info.main, 0.05),
  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
  marginTop: theme.spacing(2),
}));

const ShelterContact: React.FC<ShelterContactProps> = ({ shelter }) => {
  const handlePhoneClick = () => {
    if (shelter.phoneNumber) {
      window.open(`tel:${shelter.phoneNumber}`);
    }
  };

  const handleEmailClick = () => {
    if (shelter.email) {
      window.open(`mailto:${shelter.email}`);
    }
  };

  const handleWebsiteClick = () => {
    if (shelter.website) {
      window.open(shelter.website, '_blank');
    }
  };

  const handleDirectionsClick = () => {
    if (shelter.address) {
      const address = [
        shelter.address.street,
        shelter.address.city,
        shelter.address.state,
        shelter.address.postalCode
      ].filter(Boolean).join(', ');
      
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const formatAddress = () => {
    if (!shelter.address) return null;
    const parts = [];
    if (shelter.address.street) parts.push(shelter.address.street);
    if (shelter.address.city) parts.push(shelter.address.city);
    if (shelter.address.state) parts.push(shelter.address.state);
    if (shelter.address.postalCode) parts.push(shelter.address.postalCode);
    return parts.join(', ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <ContactContainer elevation={0}>
        <SectionTitle variant="h6">
          <ContactMail />
          Contact Information
        </SectionTitle>

        {shelter.phoneNumber && (
          <ContactItem onClick={handlePhoneClick}>
            <Phone />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Phone
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shelter.phoneNumber}
              </Typography>
            </Box>
          </ContactItem>
        )}

        {shelter.email && (
          <ContactItem onClick={handleEmailClick}>
            <Email />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Email
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ wordBreak: 'break-word' }}
              >
                {shelter.email}
              </Typography>
            </Box>
          </ContactItem>
        )}

        {formatAddress() && (
          <ContactItem onClick={handleDirectionsClick}>
            <LocationOn />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatAddress()}
              </Typography>
            </Box>
          </ContactItem>
        )}

        {shelter.website && (
          <ContactItem onClick={handleWebsiteClick}>
            <Language />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Website
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  wordBreak: 'break-word',
                  textDecoration: 'underline',
                }}
              >
                Visit Website
              </Typography>
            </Box>
          </ContactItem>
        )}

        <Divider sx={{ my: 2 }} />

        <HoursContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Schedule sx={{ color: 'info.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Operating Hours
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Monday - Friday</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                9:00 AM - 6:00 PM
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Saturday</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                10:00 AM - 4:00 PM
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Sunday</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                12:00 PM - 4:00 PM
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            * Hours may vary during holidays
          </Typography>
        </HoursContainer>

        <ContactButton
          variant="contained"
          color="primary"
          onClick={handleEmailClick}
          disabled={!shelter.email}
          startIcon={<Email />}
        >
          Send Email
        </ContactButton>

        <ContactButton
          variant="outlined"
          color="primary"
          onClick={handlePhoneClick}
          disabled={!shelter.phoneNumber}
          startIcon={<Phone />}
        >
          Call Now
        </ContactButton>
      </ContactContainer>
    </motion.div>
  );
};

export default ShelterContact;
