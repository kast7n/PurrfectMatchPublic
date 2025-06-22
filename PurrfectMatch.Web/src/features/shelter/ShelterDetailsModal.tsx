import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WebIcon from '@mui/icons-material/Web';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { Shelter } from '../../app/models/shelter';

// Subtle animations for enhanced UX
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-30px);
  }
  to { 
    opacity: 1; 
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(30px);
  }
  to { 
    opacity: 1; 
    transform: translateX(0);
  }
`;

const gentlePulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
  }
`;

// Clean, simple styled components focused on shelter information
const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95vw',
  maxWidth: '1000px',
  height: '95vh',
  maxHeight: '800px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: `${fadeIn} 0.3s ease-out`,
  [theme.breakpoints.down('md')]: {
    width: '95vw',
    height: '95vh',
    maxHeight: '90vh',
  },
  [theme.breakpoints.down('sm')]: {
    width: '98vw',
    height: '98vh',
    borderRadius: '12px',
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 24px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '28px',
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const ImageSection = styled(Box)(({ theme }) => ({
  flex: '1 1 50%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[50],
  minHeight: '400px',
  animation: `${slideInLeft} 0.5s ease-out 0.1s both`,
  [theme.breakpoints.down('md')]: {
    minHeight: '300px',
    flex: '0 0 40%',
  },
}));

const PlaceholderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: '32px',
}));

const PlaceholderEmoji = styled(Typography)({
  fontSize: '120px',
  opacity: 0.6,
});

const InfoSection = styled(Box)(({ theme }) => ({
  flex: '1 1 50%',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  animation: `${slideInRight} 0.5s ease-out 0.2s both`,
  [theme.breakpoints.down('md')]: {
    flex: '1 1 60%',
    padding: '16px',
  },
}));

const ShelterName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '32px',
  color: theme.palette.text.primary,
  marginBottom: '8px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '24px',
  },
}));

const ShelterBasicInfo = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  color: theme.palette.text.secondary,
  marginBottom: '20px',
}));

const AttributesGrid = styled(Grid)(() => ({
  marginBottom: '24px',
}));

const AttributeCard = styled(Paper)(({ theme }) => ({
  padding: '12px 16px',
  textAlign: 'center',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderColor: theme.palette.primary.main,
  },
}));

const AttributeLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  marginBottom: '4px',
}));

const AttributeValue = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const DescriptionSection = styled(Box)({
  flexGrow: 1,
  marginBottom: '24px',
});

const DescriptionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '18px',
  color: theme.palette.text.primary,
  marginBottom: '12px',
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
}));

const ContactSection = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '12px',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: '24px',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  transition: 'box-shadow 0.2s ease',
}));

const ContactHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
});

const ContactTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '18px',
  color: theme.palette.text.primary,
}));

const ContactInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const ContactDetail = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  padding: '4px 0',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  paddingTop: '20px',
  borderTop: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const SupportButton = styled(Button)(() => ({
  backgroundColor: '#2563eb',
  color: 'white',
  fontWeight: 600,
  fontSize: '16px',
  padding: '12px 32px',
  borderRadius: '8px',
  textTransform: 'none',
  flex: 1,
  animation: `${gentlePulse} 2s ease-in-out infinite`,
  '&:hover': {
    backgroundColor: '#1d4ed8',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
    animation: 'none',
  },
  transition: 'all 0.3s ease',
}));

const ContactButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '16px',
  padding: '12px 32px',
  borderRadius: '8px',
  textTransform: 'none',
  flex: 1,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 20px ${theme.palette.primary.main}33`,
  },
}));

interface ShelterDetailsModalProps {
  shelter: Shelter | null;
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const ShelterDetailsModal: React.FC<ShelterDetailsModalProps> = ({ 
  shelter, 
  open, 
  onClose, 
  isAdmin 
}) => {
  if (!shelter) return null;

  const {
    name,
    address,
    phoneNumber,
    email,
    website,
    donationUrl,
    description,
  } = shelter;  const formatAddress = () => {
    if (!address) return null;
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postalCode) parts.push(address.postalCode);
    return parts.join(', ');
  };

  const getLocationText = () => {
    if (!address) return 'Location not available';
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    return parts.join(', ') || 'Location not available';
  };

  const handlePhoneClick = () => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    }
  };

  const handleEmailClick = () => {
    if (email) {
      window.open(`mailto:${email}`);
    }
  };

  const handleWebsiteClick = () => {
    if (website) {
      window.open(website, '_blank');
    }
  };

  const handleDonateClick = () => {
    if (donationUrl) {
      window.open(donationUrl, '_blank');
    }
  };

  const shelterAttributes = [
    { label: 'Location', value: getLocationText() },
    { label: 'Contact', value: email ? 'Available' : 'Not Available' },
    { label: 'Phone', value: phoneNumber ? 'Available' : 'Not Available' },
    { label: 'Website', value: website ? 'Available' : 'Not Available' },
  ].filter(attr => attr.value !== 'Not Available');

  const defaultDescription = `${name} is dedicated to providing loving care for animals in need. Our mission is to rescue, rehabilitate, and rehome pets while working to create a more compassionate community. We believe every animal deserves a chance at happiness and work tirelessly to connect pets with their perfect families.`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="shelter-details-title"
      aria-describedby="shelter-details-description"
    >
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id="shelter-details-title">
            <HomeIcon sx={{ color: 'primary.main' }} />
            Shelter Details
          </ModalTitle>
          <Box>
            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => console.log(`Edit shelter ${shelter.shelterId}`)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
            )}
            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </ModalHeader>

        <ModalContent>
          <ImageSection>
            <PlaceholderContent>
              <PlaceholderEmoji>🏠</PlaceholderEmoji>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Animal Shelter & Rescue
              </Typography>
            </PlaceholderContent>
          </ImageSection>

          <InfoSection>
            <ShelterName>{name}</ShelterName>            <ShelterBasicInfo>
              {getLocationText()} • Animal Shelter
            </ShelterBasicInfo>

            <AttributesGrid container spacing={2}>
              {shelterAttributes.map((attr, index) => (
                <Grid item xs={6} sm={3} key={attr.label}>
                  <AttributeCard 
                    elevation={0}
                    sx={{
                      animation: `${fadeIn} 0.5s ease-out ${0.3 + index * 0.1}s both`,
                    }}
                  >
                    <AttributeLabel>{attr.label}</AttributeLabel>
                    <AttributeValue>{attr.value}</AttributeValue>
                  </AttributeCard>
                </Grid>
              ))}
            </AttributesGrid>

            <DescriptionSection>
              <DescriptionTitle>About {name}</DescriptionTitle>
              <DescriptionText id="shelter-details-description">
                {description || defaultDescription}
              </DescriptionText>
            </DescriptionSection>

            <ContactSection elevation={0}>
              <ContactHeader>
                <PhoneIcon sx={{ color: 'primary.main' }} />
                <ContactTitle>Contact Information</ContactTitle>
              </ContactHeader>
              <ContactInfo>
                {address && (
                  <ContactDetail>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">
                      {formatAddress()}
                    </Typography>
                  </ContactDetail>
                )}
                {phoneNumber && (
                  <ContactDetail onClick={handlePhoneClick}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">
                      {phoneNumber}
                    </Typography>
                  </ContactDetail>
                )}
                {email && (
                  <ContactDetail onClick={handleEmailClick}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">
                      {email}
                    </Typography>
                  </ContactDetail>
                )}
                {website && (
                  <ContactDetail onClick={handleWebsiteClick}>
                    <WebIcon fontSize="small" />
                    <Typography variant="body2">
                      Visit Website
                    </Typography>
                  </ContactDetail>
                )}
              </ContactInfo>
            </ContactSection>

            <ActionButtons>
              {donationUrl ? (
                <SupportButton
                  variant="contained"
                  startIcon={<VolunteerActivismIcon />}
                  onClick={handleDonateClick}
                >
                  Support {name}
                </SupportButton>
              ) : (
                <ContactButton
                  variant="outlined"
                  startIcon={<PhoneIcon />}
                  onClick={handlePhoneClick}
                  disabled={!phoneNumber}
                >
                  Contact Shelter
                </ContactButton>
              )}
              <ContactButton
                variant="outlined"
                startIcon={<FavoriteIcon />}
                onClick={() => console.log(`View pets from ${shelter.shelterId}`)}
              >
                View Pets
              </ContactButton>
            </ActionButtons>
          </InfoSection>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default ShelterDetailsModal;
