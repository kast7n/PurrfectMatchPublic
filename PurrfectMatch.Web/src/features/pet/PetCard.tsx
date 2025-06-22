import { Card, CardContent, CardMedia, Button, Chip, Typography, Box, styled } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';
import { Pet } from '../../app/models/pet'; // Added PetImageDto
import { useState } from 'react';
import PetDetailsModal from './PetDetailsModal'; // Import the modal
import { useAddFavoriteMutation, useRemoveFavoriteMutation, useGetUserFavoritesQuery } from '../favorites/favoritesApi';
import { useUserInfoQuery } from '../account/accountApi';
import { toast } from 'react-toastify';

const PetCardContainer = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: '20px',
  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.08)',
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
      ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(238, 90, 36, 0.2))' 
      : 'linear-gradient(135deg, rgba(255, 107, 107, 0.13), rgba(238, 90, 36, 0.13))',
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
    boxShadow: theme.palette.mode === 'dark' ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.15)',
    borderColor: theme.palette.mode === 'dark' ? '#ff8a80' : '#ff6b6b',
  },
}));

const PetCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 220,
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #424242, #616161)' 
    : 'linear-gradient(135deg, #ff9a9e, #fecfef, #a8edea, #fed6e3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '70px',
  position: 'relative',
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)'
      : 'linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent)',
    transform: 'rotate(45deg)',
    animation: 'shimmer 4s infinite',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%) rotate(45deg)' },
    '100%': { transform: 'translateX(100%) rotate(45deg)' },
  },
}));

// Add FloatingFavoriteButton component
const FloatingFavoriteButton = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 2,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '50%',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  '&:hover': {
    background: theme.palette.mode === 'dark' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 107, 107, 0.1)',
    transform: 'scale(1.1)',
  },
  '&.active': {
    background: theme.palette.mode === 'dark' ? 'rgba(255, 107, 107, 0.25)' : 'rgba(255, 107, 107, 0.15)',
  },
  '& .heart-icon': {
    fontSize: '18px',
    transition: 'all 0.3s ease',
    color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : '#dee2e6',
  },
  '&:hover .heart-icon': {
    color: theme.palette.mode === 'dark' ? '#ff8a80' : '#ff6b6b',
  },
  '&.active .heart-icon': {
    color: theme.palette.mode === 'dark' ? '#ff8a80' : '#ff6b6b',
    transform: 'scale(1.2)',
  },
}));

// Remove unused styled components
const AdoptedChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#b71c1c' : '#e74c3c', // Darker red for dark mode
  color: 'white',
  fontWeight: 600,
  fontSize: '12px',
  marginLeft: '8px',
  height: '24px',
  border: `1px solid ${theme.palette.mode === 'dark' ? '#b71c1c' : '#e74c3c'}`,
}));

const PetCardContent = styled(CardContent)(() => ({
  padding: '20px',
  position: 'relative',
  zIndex: 2,
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const PetName = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 700,
  color: theme.palette.text.primary,
  flex: 1,
  marginBottom: '12px',
}));

const PetAttributes = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginBottom: '16px',
  minHeight: '80px', // Ensure consistent minimum height for attributes area
  maxHeight: '120px', // Prevent excessive height from too many attributes
  overflow: 'hidden',
  alignContent: 'flex-start',
}));

const AttributeChip = styled(Chip)(({ theme }) => ({
  padding: '6px 12px',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: 600,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #424242, #616161)' 
    : 'linear-gradient(135deg, #e9ecef, #f8f9fa)',
  color: theme.palette.text.secondary,
}));

const AdoptButton = styled(Button)(({ theme }) => ({
  width: '100%',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1b5e20, #2e7d32)' // Darker green for dark mode
    : 'linear-gradient(135deg, #28a745, #20c997)',
  color: 'white',
  border: 'none',
  padding: '14px',
  borderRadius: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '16px',
  textTransform: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 25px rgba(27, 94, 32, 0.6)' 
      : '0 8px 25px rgba(40, 167, 69, 0.4)',
  },
}));

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // State for modal
  
  // Authentication and favorites
  const { data: userInfo } = useUserInfoQuery();
  const { data: favorites } = useGetUserFavoritesQuery(userInfo?.id || '', {
    skip: !userInfo?.id
  });
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  
  // Check if this pet is in favorites
  const isFavorite = favorites?.some(fav => fav.petId === pet.petId) || false;

  const {
    petId, // Changed from id to petId to match new API
    name,
    age,
    gender,
    speciesName, // Changed from species
    breedName, // Changed from breed
    description,
    photoUrls = [], // Changed from images
    isAdopted,
    coatLength, // Changed from coatLength
    color, // Changed from color
    activityLevel, // Changed from activityLevel
    healthStatus, // Changed from healthStatus
    size // Added size directly from Pet DTO
  } = pet;  const handleToggleFavorite = async () => {
    if (!userInfo?.id) {
      toast.info('Please log in to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite({ userId: userInfo.id, petId: pet.petId }).unwrap();
        toast.success('Removed from favorites');
      } else {
        await addFavorite({ userId: userInfo.id, petId: pet.petId }).unwrap();
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleOpenDetailsModal = () => {
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
  };

  // Truncate description if too long
  const truncatedDescription = description && description.length > 100
    ? `${description.substring(0, 100)}...`
    : description;

  // Get pet emoji based on species
  const getPetEmoji = () => {
    const lowerSpeciesName = speciesName?.toLowerCase() || ''; // Use speciesName
    if (lowerSpeciesName.includes('dog')) return '🐕';
    if (lowerSpeciesName.includes('cat')) return '🐱';
    if (lowerSpeciesName.includes('rabbit') || lowerSpeciesName.includes('bunny')) return '🐰';
    if (lowerSpeciesName.includes('bird')) return '🦜';
    return '🐾'; // Default
  };

  // Get special styling for different attributes
  const getGenderChipStyle = () => {
    if (gender?.toLowerCase() === 'male') {
      return {
        background: 'linear-gradient(135deg, #2979ff, #4dabf5)', // Adjusted for potentially better dark mode visibility
        color: 'white',
        borderColor: '#2979ff',
      };
    } else if (gender?.toLowerCase() === 'female') {
      return {
        background: 'linear-gradient(135deg, #d500f9, #e040fb)', // Adjusted for potentially better dark mode visibility
        color: 'white',
        borderColor: '#d500f9',
      };
    }
    return {};
  };

  // const getSizeChipStyle = () => { // Commented out or remove if size is not directly on Pet DTO
  //   if (size?.toLowerCase() === 'small') {
  //     return {
  //       background: 'linear-gradient(135deg, #27ae60, #58d68d)',
  //       color: 'white',
  //       borderColor: '#27ae60',
  //     };
  //   } else if (size?.toLowerCase() === 'medium') {
  //     return {
  //       background: 'linear-gradient(135deg, #f39c12, #f7dc6f)',
  //       color: 'white',
  //       borderColor: '#f39c12',
  //     };
  //   } else if (size?.toLowerCase() === 'large') {
  //     return {
  //       background: 'linear-gradient(135deg, #8e44ad, #bb8fce)',
  //       color: 'white',
  //       borderColor: '#8e44ad',
  //     };
  //   }
  //   return {};
  // };

  const getAgeChipStyle = () => {
    const ageNum = typeof age === 'string' ? parseInt(age, 10) : age; // age is string, convert to number for comparison
    if (ageNum && ageNum <= 2) {
      return {
        background: 'linear-gradient(135deg, #00bfa5, #64ffda)', // Adjusted for potentially better dark mode visibility
        color: 'white',
        borderColor: '#00bfa5',
      };
    }
    return {};
  };

  const primaryImage = photoUrls.length > 0 ? photoUrls[0] : undefined; // Use photoUrls
  return (
    <>
      <PetCardContainer data-pet-id={petId}>
        <Box sx={{ position: 'relative' }}>
          {primaryImage ? (
            <PetCardMedia image={primaryImage} title={name} />
          ) : (
            <Box
              sx={(theme) => ({ // Added theme here
                height: 220,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, #424242, #616161)' 
                  : 'linear-gradient(135deg, #ff9a9e, #fecfef, #a8edea, #fed6e3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '70px',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)'
                    : 'linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent)',
                  transform: 'rotate(45deg)',
                  animation: 'shimmer 4s infinite',
                },
                '@keyframes shimmer': {
                  '0%': { transform: 'translateX(-100%) rotate(45deg)' },
                  '100%': { transform: 'translateX(100%) rotate(45deg)' },
                },
              })}
            >
              {getPetEmoji()}
            </Box>
          )}
          
          <FloatingFavoriteButton
            className={isFavorite ? 'active' : ''}
            onClick={handleToggleFavorite}
            sx={{ cursor: 'pointer' }}
          >
            {isFavorite ? (
              <FavoriteIcon className="heart-icon" />
            ) : (
              <FavoriteBorderIcon className="heart-icon" />
            )}
          </FloatingFavoriteButton>
        </Box>
        
        <PetCardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <PetName variant="h5">
              {name}
            </PetName>
            {/* Updated chip to reflect actual health status if available, or a generic "Special Needs" */}
            {isAdopted ? (
              <AdoptedChip label="Adopted" size="small" />
            ) : healthStatus === "Special Needs" ? ( // Use healthStatusName
              <AdoptedChip label="Special Needs" size="small" />
            ) : null}
          </Box>
            <PetAttributes>
            {/* Priority attributes first */}
            {gender && (
              <AttributeChip 
                label={gender} 
                size="small" 
                sx={getGenderChipStyle()}
              />
            )}
            {age !== undefined && ( 
              <AttributeChip 
                label={`${age} ${parseInt(age as string, 10) === 1 ? 'year' : 'years'}`} // age is string
                size="small"
                sx={getAgeChipStyle()}
              />
            )}
            {size && ( 
              <AttributeChip 
                label={size} 
                size="small"
              />
            )}
            {speciesName && ( // Use speciesName
              <AttributeChip 
                label={speciesName} 
                size="small"
              />
            )}
            {breedName && ( // Use breedName
              <AttributeChip 
                label={breedName} 
                size="small"
              />
            )}
            {/* Secondary attributes - may be hidden if space runs out */}
            {coatLength && ( // Use coatLengthName
              <AttributeChip 
                label={`${coatLength} Coat`} 
                size="small"
              />
            )}
            {color && ( // Use colorName
              <AttributeChip 
                label={color} 
                size="small"
              />
            )}
            {activityLevel && ( // Use activityLevelName
              <AttributeChip 
                label={`${activityLevel} Activity`} 
                size="small"
              />
            )}
          </PetAttributes>
            <Typography
            variant="body2"
            sx={{
              color: (theme) => theme.palette.text.secondary, // Use theme color
              fontSize: '14px',
              lineHeight: 1.5,
              marginBottom: '20px',
              height: '60px', // Fixed height for description area
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3, // Limit to 3 lines
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
            }}
          >
            {truncatedDescription || `${gender === 'Male' ? 'He' : gender === 'Female' ? 'She' : 'This pet'} is looking for a loving home!`}
          </Typography>
          
          <AdoptButton
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<PetsIcon />}
            onClick={handleOpenDetailsModal} // Open modal on click
          >
            Learn More
          </AdoptButton>
        </PetCardContent>
      </PetCardContainer>
      <PetDetailsModal
          pet={pet}
          open={detailsModalOpen}
          onClose={handleCloseDetailsModal}
          // Example: Pass isShelterManager prop if available from user context/auth
          // isShelterManager={currentUser?.isShelterManager && currentUser?.shelterId === pet.shelterId} 
        />
    </>
  );
}