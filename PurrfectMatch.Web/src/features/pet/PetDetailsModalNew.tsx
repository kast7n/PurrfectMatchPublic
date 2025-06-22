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
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Pet } from '../../app/models/pet';

// Clean, simple styled components focused on adoption conversion
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
  [theme.breakpoints.down('md')]: {
    minHeight: '300px',
    flex: '0 0 40%',
  },
}));

const PetImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const PlaceholderEmoji = styled(Typography)({
  fontSize: '120px',
  opacity: 0.6,
});

const ImageNavButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 2,
}));

const ImageDots = styled(Box)({
  position: 'absolute',
  bottom: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
  zIndex: 2,
});

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
  [theme.breakpoints.down('md')]: {
    flex: '1 1 60%',
    padding: '16px',
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

const AdoptionCallout = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '12px',
  backgroundColor: '#fef7f0',
  border: '1px solid #ffcc99',
  marginBottom: '24px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const HeartText = styled(Typography)({
  color: '#d97706',
  fontWeight: 600,
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
});

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
  '&:hover': {
    backgroundColor: '#b91c1c',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
  },
  transition: 'all 0.2s ease',
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
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}33`,
  },
  transition: 'all 0.2s ease',
}));

const SpecialNeedsChip = styled(Chip)({
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  fontWeight: 600,
  border: '1px solid #fecaca',
  marginBottom: '16px',
});

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
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

            {!isAdopted && (
              <AdoptionCallout elevation={0}>
                <HeartText>
                  <FavoriteIcon sx={{ color: '#dc2626' }} />
                  I'm looking for my forever home!
                </HeartText>
              </AdoptionCallout>
            )}

            <AttributesGrid container spacing={2}>
              {petAttributes.map((attr) => (
                <Grid item xs={6} sm={4} key={attr.label}>
                  <AttributeCard elevation={0}>
                    <AttributeLabel>{attr.label}</AttributeLabel>
                    <AttributeValue>{attr.value}</AttributeValue>
                  </AttributeCard>
                </Grid>
              ))}
            </AttributesGrid>

            <DescriptionSection>
              <DescriptionTitle>About {name}</DescriptionTitle>
              <DescriptionText id="pet-details-description">
                {description || defaultDescription}
              </DescriptionText>
            </DescriptionSection>

            <ActionButtons>
              {!isAdopted ? (
                <>
                  <AdoptButton
                    variant="contained"
                    startIcon={<FavoriteIcon />}
                    onClick={() => console.log(`Adopt pet ${pet.petId}`)}
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
          </InfoSection>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default PetDetailsModal;
