import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  styled,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Pets,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Pet } from '../../../app/models/pet';

interface ShelterPetsProps {
  pets: Pet[];
  isLoading: boolean;
  shelterId: number;
}

const PetsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
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
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
  },
}));

const ViewAllButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1.5, 4),
  marginTop: theme.spacing(3),
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.primary.contrastText,
  boxShadow: 'none',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px rgba(25, 118, 210, 0.4)'
      : '0 8px 25px rgba(25, 118, 210, 0.3)',
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6, 3),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.3)
    : alpha(theme.palette.background.default, 0.5),
  borderRadius: 16,
  border: `2px dashed ${alpha(theme.palette.divider, 0.3)}`,
  '& .MuiSvgIcon-root': {
    fontSize: '4rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
}));

const PetItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.4)
    : alpha(theme.palette.background.default, 0.6),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
    borderColor: alpha(theme.palette.primary.main, 0.2),
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px rgba(25, 118, 210, 0.2)'
      : '0 8px 25px rgba(25, 118, 210, 0.15)',
  },
}));

const PetAvatar = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  overflow: 'hidden',
  marginRight: theme.spacing(2),
  position: 'relative',
  flexShrink: 0,
  border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const PetInfo = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
}));

const PetName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const PetDetails = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .breed': {
    fontWeight: 500,
  },
  '& .separator': {
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: theme.palette.text.secondary,
  },
}));

const ShelterPets: React.FC<ShelterPetsProps> = ({ 
  pets, 
  isLoading, 
  shelterId 
}) => {
  const navigate = useNavigate();

  const handleViewAllPets = () => {
    navigate(`/pets?shelterId=${shelterId}`);
  };

  const handlePetClick = (petId: number) => {
    navigate(`/pets/${petId}`);
  };

  // Only show available pets (not adopted) and limit to 4
  const availablePets = pets.filter(pet => !pet.isAdopted);
  const displayPets = availablePets.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <PetsContainer elevation={0}>
        <SectionTitle variant="h5">
          <Pets />
          Some of Our Pets
        </SectionTitle>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={50} />
          </Box>
        ) : displayPets.length === 0 ? (
          <EmptyState>
            <Pets />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              No pets available for adoption
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This shelter currently doesn't have pets available for adoption. Check back later for new arrivals!
            </Typography>
          </EmptyState>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {displayPets.map((pet, index) => (
                <motion.div
                  key={pet.petId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >                  <PetItem onClick={() => handlePetClick(pet.petId)}>
                    <PetAvatar>
                      <img 
                        src={pet.photoUrls && pet.photoUrls.length > 0 
                          ? pet.photoUrls[0] 
                          : '/images/default-pet.jpg'
                        } 
                        alt={pet.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/default-pet.jpg';
                        }}
                      />
                    </PetAvatar>
                    <PetInfo>
                      <PetName>{pet.name}</PetName>
                      <PetDetails>
                        <span className="breed">{pet.breedName || 'Mixed Breed'}</span>
                        <div className="separator" />
                        <span>{pet.age || 'Unknown age'}</span>
                        {pet.gender && (
                          <>
                            <div className="separator" />
                            <span>{pet.gender}</span>
                          </>
                        )}
                      </PetDetails>
                    </PetInfo>
                  </PetItem>
                </motion.div>
              ))}
            </Box>

            {availablePets.length > 4 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <ViewAllButton
                  onClick={handleViewAllPets}
                  endIcon={<ArrowForward />}
                >
                  All Our Pets ({availablePets.length})
                </ViewAllButton>
              </Box>
            )}
          </>
        )}
      </PetsContainer>
    </motion.div>
  );
};

export default ShelterPets;
