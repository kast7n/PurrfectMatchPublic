import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
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
import PetCard from '../../pet/PetCard';

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

const ShelterPets: React.FC<ShelterPetsProps> = ({ 
  pets, 
  isLoading, 
  shelterId 
}) => {
  const navigate = useNavigate();

  // Debug logging
  console.log('ShelterPets - Debug info:', {
    pets,
    petsLength: pets?.length,
    isLoading,
    shelterId
  });

  const handleViewAllPets = () => {
    navigate(`/pets?shelterId=${shelterId}`);
  };

  // Only show available pets (not adopted) and limit to 4
  const availablePets = pets.filter(pet => !pet.isAdopted);
  const displayPets = availablePets.slice(0, 4);

  console.log('ShelterPets - Filtered pets:', {
    availablePetsLength: availablePets.length,
    displayPetsLength: displayPets.length,
    availablePets: availablePets.map(p => ({ id: p.petId, name: p.name, isAdopted: p.isAdopted }))
  });

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
            <Grid container spacing={3}>
              {displayPets.map((pet, index) => (
                <Grid item xs={12} sm={6} md={6} lg={3} key={pet.petId}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ height: '100%' }}
                  >
                    <PetCard pet={pet} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {availablePets.length > 4 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <ViewAllButton
                  onClick={handleViewAllPets}
                  endIcon={<ArrowForward />}
                >
                  All Our Pets
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
