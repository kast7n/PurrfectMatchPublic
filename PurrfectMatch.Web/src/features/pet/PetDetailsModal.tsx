import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Pet } from '../../app/models/pet';
import AdoptionApplicationModal from '../adoptionApplication/AdoptionApplicationModal';
import { useUserInfoQuery } from '../account/accountApi';
import { useFetchShelterByIdQuery } from '../shelter/shelterApi';

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
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
  }
`;

// Clean, simple styled components focused on adoption conversion with subtle effects
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
    overflow: 'auto',
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
  [theme.breakpoints.down('sm')]: {
    minHeight: '250px',
    flex: 'none',
    height: 'auto',
    position: 'static',
  },
}));

const PetImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  [theme.breakpoints.down('sm')]: {
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'contain',
  },
}));

const PlaceholderEmoji = styled(Typography)({
  fontSize: '120px',
  opacity: 0.6,
});

const ImageNavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'translateY(-50%) scale(1.1)',
  },
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      transform: 'translateY(-50%) scale(1.1)',
    },
  },
}));

const ImageDots = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    position: 'static',
    justifyContent: 'center',
    marginTop: '12px',
    transform: 'none',
  },
}));

const Dot = styled(Box)<{ active?: boolean }>(({ active, theme }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

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
    overflow: 'visible',
  },
  [theme.breakpoints.down('sm')]: {
    flex: 'none',
    overflow: 'visible',
  },
}));

const PetName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '32px',
  color: theme.palette.text.primary,
  marginBottom: '8px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '24px',
  },
}));

const PetBasicInfo = styled(Typography)(({ theme }) => ({
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

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  paddingTop: '20px',
  borderTop: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const AdoptButton = styled(Button)(() => ({
  backgroundColor: '#dc2626',
  color: 'white',
  fontWeight: 600,
  fontSize: '16px',
  padding: '12px 32px',
  borderRadius: '8px',
  textTransform: 'none',
  flex: 1,
  animation: `${gentlePulse} 2s ease-in-out infinite`,
  '&:hover': {
    backgroundColor: '#b91c1c',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
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

const SpecialNeedsChip = styled(Chip)({
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  fontWeight: 600,
  border: '1px solid #fecaca',
  marginBottom: '16px',
});

const ShelterSection = styled(Paper)(({ theme }) => ({
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

const ShelterHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
});

const ShelterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '18px',
  color: theme.palette.text.primary,
}));

const ShelterInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const ShelterDetail = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  color: theme.palette.text.secondary,
}));

interface PetDetailsModalProps {
  pet: Pet | null;
  open: boolean;
  onClose: () => void;
  isShelterManager?: boolean;
}

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({ 
  pet, 
  open, 
  onClose, 
  isShelterManager 
}) => {  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [adoptionModalOpen, setAdoptionModalOpen] = useState(false);
  
  // Get current user info
  const { data: userInfo } = useUserInfoQuery();
  
  // Get shelter information dynamically
  const { data: shelter, isLoading: shelterLoading, error: shelterError } = useFetchShelterByIdQuery(pet?.shelterId || 0, {
    skip: !pet?.shelterId,
  });

  if (!pet) return null;
  const {
    name,
    age,
    gender,
    speciesName,
    breedName,
    description,
    photoUrls = [],
    isAdopted,
    color,
    activityLevel,
    healthStatus,
    size,
  } = pet;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % photoUrls.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + photoUrls.length) % photoUrls.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const getPetEmoji = () => {
    const lowerSpeciesName = speciesName?.toLowerCase() || '';
    if (lowerSpeciesName.includes('dog')) return '🐕';
    if (lowerSpeciesName.includes('cat')) return '🐱';
    if (lowerSpeciesName.includes('rabbit') || lowerSpeciesName.includes('bunny')) return '🐰';
    if (lowerSpeciesName.includes('bird')) return '🦜';
    return '🐾';
  };

  const getAgeText = () => {
    const ageNum = parseInt(age as string, 10);
    return `${ageNum} ${ageNum === 1 ? 'year' : 'years'} old`;
  };

  const petAttributes = [
    { label: 'Age', value: getAgeText() },
    { label: 'Gender', value: gender },
    { label: 'Breed', value: breedName },
    { label: 'Size', value: size },
    { label: 'Color', value: color },
    { label: 'Activity', value: activityLevel },
  ].filter(attr => attr.value);

  const defaultDescription = `Meet ${name}! This wonderful ${gender?.toLowerCase()} ${speciesName?.toLowerCase()} is looking for a loving forever home. ${name} would make a perfect companion and bring joy to any family. Could you be the one to give ${name} the love and care they deserve?`;
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="pet-details-title"
        aria-describedby="pet-details-description"
    >
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id="pet-details-title">
            {isAdopted && (
              <Chip 
                label="Adopted" 
                color="success" 
                size="small" 
                sx={{ mr: 1 }} 
              />
            )}
            Pet Details
          </ModalTitle>
          <Box>
            {isShelterManager && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => console.log(`Edit pet ${pet.petId}`)}
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
            {photoUrls && photoUrls.length > 0 ? (
              <>
                <PetImage 
                  src={photoUrls[currentImageIndex]} 
                  alt={`${name} - photo ${currentImageIndex + 1}`} 
                />
                {photoUrls.length > 1 && (
                  <>
                    <ImageNavButton 
                      onClick={handlePrevImage}
                      sx={{ left: 12 }}
                    >
                      <ArrowBackIosNewIcon />
                    </ImageNavButton>
                    <ImageNavButton 
                      onClick={handleNextImage}
                      sx={{ right: 12 }}
                    >
                      <ArrowForwardIosIcon />
                    </ImageNavButton>
                    <ImageDots>
                      {photoUrls.map((_, index) => (
                        <Dot
                          key={index}
                          active={index === currentImageIndex}
                          onClick={() => handleDotClick(index)}
                        />
                      ))}
                    </ImageDots>
                  </>
                )}
              </>
            ) : (
              <PlaceholderEmoji>{getPetEmoji()}</PlaceholderEmoji>
            )}
          </ImageSection>

          <InfoSection>
            <PetName>{name}</PetName>
            <PetBasicInfo>
              {getAgeText()} • {gender} • {speciesName}
            </PetBasicInfo>

            {healthStatus === "Special Needs" && (
              <SpecialNeedsChip
                icon={<FavoriteIcon />}
                label="Special Needs Pet - Extra Love Required"
                variant="outlined"
              />
            )}
           <AttributesGrid container spacing={2}>
              {petAttributes.map((attr, index) => (
                <Grid item xs={6} sm={4} key={attr.label}>
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
            </AttributesGrid><DescriptionSection>
              <DescriptionTitle>About {name}</DescriptionTitle>
              <DescriptionText id="pet-details-description">
                {description || defaultDescription}
              </DescriptionText>
            </DescriptionSection>            <ShelterSection elevation={0}>
              <ShelterHeader>
                <HomeIcon sx={{ color: 'primary.main' }} />
                <ShelterTitle>Shelter Information</ShelterTitle>
              </ShelterHeader>
              <ShelterInfo>
                {shelterLoading ? (
                  <Typography variant="body2" color="text.secondary">
                    Loading shelter information...
                  </Typography>
                ) : shelterError ? (
                  <Typography variant="body2" color="error">
                    Unable to load shelter information
                  </Typography>                ) : shelter ? (
                  <>
                    <ShelterDetail>
                      <HomeIcon fontSize="small" />
                      <Typography variant="body2">
                        {shelter.name}
                      </Typography>
                    </ShelterDetail>
                    {shelter.address && (
                      <ShelterDetail>
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2">
                          {[
                            shelter.address.street,
                            shelter.address.city,
                            shelter.address.state,
                            shelter.address.postalCode
                          ].filter(Boolean).join(', ')}
                        </Typography>
                      </ShelterDetail>
                    )}
                    {shelter.phoneNumber && (
                      <ShelterDetail>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">
                          {shelter.phoneNumber}
                        </Typography>
                      </ShelterDetail>
                    )}
                    {shelter.email && (
                      <ShelterDetail>
                        <EmailIcon fontSize="small" />
                        <Typography variant="body2">
                          {shelter.email}
                        </Typography>
                      </ShelterDetail>
                    )}
                  </>
                ) : pet.shelterName ? (
                  <ShelterDetail>
                    <HomeIcon fontSize="small" />
                    <Typography variant="body2">
                      {pet.shelterName}
                    </Typography>
                  </ShelterDetail>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No shelter information available
                  </Typography>
                )}
              </ShelterInfo>
            </ShelterSection>

            <ActionButtons>
              {!isAdopted ? (
                <>                  <AdoptButton
                    variant="contained"
                    startIcon={<FavoriteIcon />}
                    onClick={() => {
                      if (!userInfo?.id) {
                        // Handle case where user is not logged in
                        alert('Please log in to apply for adoption');
                        return;
                      }
                      setAdoptionModalOpen(true);
                    }}
                  >
                    Adopt {name}
                  </AdoptButton>
                  <ContactButton
                    variant="outlined"
                    startIcon={<LocationOnIcon />}
                    onClick={() => console.log(`Contact about pet ${pet.petId}`)}
                  >
                    Ask Questions
                  </ContactButton>
                </>
              ) : (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    textAlign: 'center', 
                    color: 'success.main',
                    fontWeight: 600,
                    width: '100%',
                    py: 2
                  }}
                >
                  🎉 {name} has found their forever home!
                </Typography>
              )}
            </ActionButtons>
          </InfoSection>        </ModalContent>
      </ModalContainer>
      </Modal>
      
      {/* Adoption Application Modal */}
      {userInfo?.id && (
        <AdoptionApplicationModal
          open={adoptionModalOpen}
          onClose={() => setAdoptionModalOpen(false)}
          pet={pet}
          userId={userInfo.id}
        />
      )}
    </>
  );
};

export default PetDetailsModal;
