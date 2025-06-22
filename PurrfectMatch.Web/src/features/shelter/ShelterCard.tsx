import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Chip,
  styled,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Favorite as DonateIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Shelter } from '../../app/models/shelter';

interface ShelterCardProps {
  shelter: Shelter;
}

const ShelterCardContainer = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  minHeight: '500px', // Ensure consistent minimum height
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: '20px',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0,0,0,0.3)' 
    : '0 8px 32px rgba(0,0,0,0.08)',
  background: theme.palette.background.paper,
  border: '2px solid transparent',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(63, 81, 181, 0.2), rgba(33, 150, 243, 0.2))' 
      : 'linear-gradient(135deg, rgba(63, 81, 181, 0.13), rgba(33, 150, 243, 0.13))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 1,
    pointerEvents: 'none',
  },
  '&:hover::before': {
    opacity: 1,
  },
  '&:hover': {
    transform: 'translateY(-12px) rotate(1deg)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 60px rgba(0,0,0,0.4)' 
      : '0 20px 60px rgba(0,0,0,0.15)',
    borderColor: theme.palette.mode === 'dark' ? '#64b5f6' : '#2196f3',
  },
}));

const ShelterHeader = styled(Box)(({ theme }) => ({
  height: 120,
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #424242, #616161)' 
    : 'linear-gradient(135deg, #64b5f6, #81c784, #ffb74d)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Cpath d="M20 20L0 0h40v40L20 20z"/%3E%3C/g%3E%3C/svg%3E")',
    animation: 'float 3s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
}));

const ShelterIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1976d2, #1565c0)'
    : 'linear-gradient(135deg, #ffffff, #f5f5f5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.4)'
    : '0 8px 32px rgba(0,0,0,0.1)',
  border: `3px solid ${theme.palette.background.paper}`,
  zIndex: 2,
  fontSize: '2rem',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2',
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(25, 118, 210, 0.4)'
      : '0 4px 20px rgba(25, 118, 210, 0.3)',
  },
}));

const ShelterCard: React.FC<ShelterCardProps> = ({ shelter }) => {
  const navigate = useNavigate();
  
  const formatAddress = (address: { city?: string; state?: string } | undefined) => {
    if (!address) return null;
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    return parts.join(', ');
  };

  const handleWebsiteClick = () => {
    if (shelter.website) {
      window.open(shelter.website, '_blank');
    }
  };

  const handleDonateClick = () => {
    if (shelter.donationUrl) {
      window.open(shelter.donationUrl, '_blank');
    }
  };

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
  const handleViewDetails = () => {
    navigate(`/shelters/${shelter.shelterId}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      <ShelterCardContainer>
        <ShelterHeader>
          <ShelterIcon>
            🏠
          </ShelterIcon>
        </ShelterHeader>        <CardContent 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            position: 'relative', 
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 400, // Fixed minimum height
          }}
        >
          {/* Shelter Name - Fixed height */}
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              fontSize: '1.5rem',
              lineHeight: 1.2,
              mb: 2,
              height: '2.4rem', // Fixed height for 2 lines max
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {shelter.name}
          </Typography>

          {/* Description - Fixed height */}
          <Box sx={{ mb: 2, height: '4.5rem' }}>
            {shelter.description && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {shelter.description}
              </Typography>
            )}
          </Box>

          {/* Contact Info - Fixed height */}
          <Box sx={{ mb: 2, height: '5.4rem', overflow: 'hidden' }}>
            {formatAddress(shelter.address) && (
              <InfoItem>
                <LocationIcon />
                <Typography variant="body2">
                  {formatAddress(shelter.address)}
                </Typography>
              </InfoItem>
            )}

            {shelter.phoneNumber && (
              <InfoItem 
                sx={{ cursor: 'pointer' }}
                onClick={handlePhoneClick}
              >
                <PhoneIcon />
                <Typography variant="body2">
                  {shelter.phoneNumber}
                </Typography>
              </InfoItem>
            )}

            {shelter.email && (
              <InfoItem 
                sx={{ cursor: 'pointer' }}
                onClick={handleEmailClick}
              >
                <EmailIcon />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {shelter.email}
                </Typography>
              </InfoItem>
            )}
          </Box>

          {/* Action Chips - Fixed height */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, height: '2rem', alignItems: 'flex-start' }}>
            {shelter.website && (
              <Chip
                icon={<WebsiteIcon />}
                label="Website"
                size="small"
                color="primary"
                clickable
                onClick={handleWebsiteClick}
                sx={{ borderRadius: '8px' }}
              />
            )}
            {shelter.donationUrl && (
              <Chip
                icon={<DonateIcon />}
                label="Donate"
                size="small"
                color="secondary"
                clickable
                onClick={handleDonateClick}
                sx={{ borderRadius: '8px' }}
              />
            )}
          </Box>

          {/* Button Section - Always at bottom */}
          <Box sx={{ mt: 'auto', pt: 1 }}>
            <ActionButton
              variant="contained"
              fullWidth
              startIcon={<InfoIcon />}
              onClick={handleViewDetails}
            >
              View Details
            </ActionButton>
          </Box>
        </CardContent>
      </ShelterCardContainer>
    </motion.div>
  );
};

export default ShelterCard;
