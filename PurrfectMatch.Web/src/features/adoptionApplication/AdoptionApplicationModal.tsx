import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardMedia,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import { Pet } from '../../app/models/pet';
import { useCreateAdoptionApplicationMutation } from './adoptionApplicationApi';
import { toast } from 'react-toastify';

interface AdoptionApplicationModalProps {
  open: boolean;
  onClose: () => void;
  pet: Pet;
  userId: string;
}

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    maxWidth: '600px',
    width: '100%',
    margin: '16px',
  },
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main} 0%, 
    ${theme.palette.secondary.main} 100%
  )`,
  color: 'white',
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '20px 20px 0 0',
}));

const PetInfoCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: '24px',
  borderRadius: '12px',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

const PetImage = styled(CardMedia)({
  width: 120,
  height: 120,
  objectFit: 'cover',
});

const PetInfoContent = styled(Box)({
  flex: 1,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const SubmitButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.error.main} 0%, 
    ${theme.palette.secondary.main} 100%
  )`,
  color: 'white',
  fontWeight: 600,
  padding: '12px 32px',
  borderRadius: '8px',
  textTransform: 'none',
  '&:hover': {
    background: `linear-gradient(135deg, 
      ${theme.palette.error.dark} 0%, 
      ${theme.palette.secondary.dark} 100%
    )`,
  },
}));

const AdoptionApplicationModal: React.FC<AdoptionApplicationModalProps> = ({
  open,
  onClose,
  pet,
  userId,
}) => {
  const [createAdoptionApplication, { isLoading }] = useCreateAdoptionApplicationMutation();
  const handleSubmit = async () => {
    if (!userId) {
      toast.error('You must be logged in to submit an adoption application');
      return;
    }

    console.log('User ID:', userId, 'Type:', typeof userId);
    console.log('Pet ID:', pet.petId, 'Type:', typeof pet.petId);
    try {
      const requestData = {
        userId: userId,
        petId: pet.petId,
      };

      console.log('Sending request data:', requestData);
      await createAdoptionApplication(requestData).unwrap();
      toast.success(`Adoption application submitted for ${pet.name}! 🎉`);
      onClose();
    } catch (error: unknown) {
      console.error('Failed to create adoption application:', error);
      
      // Better error handling
      let errorMessage = 'Failed to submit adoption application. Please try again.';
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = (error as { data?: { message?: string } }).data;
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }
      
      toast.error(errorMessage);
    }
  };
  const handleClose = () => {
    onClose();
  };

  const getAgeText = () => {
    if (!pet.age) return 'Age unknown';
    const ageNum = typeof pet.age === 'string' ? parseInt(pet.age, 10) : pet.age;
    if (isNaN(ageNum)) return pet.age;
    return `${ageNum} ${ageNum === 1 ? 'year' : 'years'} old`;
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FavoriteIcon />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Adopt {pet.name}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogHeader>

      <DialogContent sx={{ padding: '24px' }}>
        <PetInfoCard>
          {pet.photoUrls && pet.photoUrls.length > 0 ? (
            <PetImage image={pet.photoUrls[0]} title={pet.name} />
          ) : (
            <Box
              sx={{
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.100',
                fontSize: '48px',
              }}
            >
              🐾
            </Box>
          )}
          <PetInfoContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {pet.name}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              <Chip label={getAgeText()} size="small" color="primary" />
              {pet.gender && <Chip label={pet.gender} size="small" />}
              {pet.speciesName && <Chip label={pet.speciesName} size="small" />}
              {pet.breedName && <Chip label={pet.breedName} size="small" />}
            </Box>
            {pet.shelterName && (
              <Typography variant="body2" color="text.secondary">
                From: {pet.shelterName}
              </Typography>
            )}
          </PetInfoContent>
        </PetInfoCard>        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Ready to adopt {pet.name}?</strong> This application will be sent to the shelter for review. 
            They will contact you with next steps if your application is approved.
          </Typography>
        </Alert>

        <Typography variant="body2" color="text.secondary">
          By submitting this application, you agree to the shelter's adoption policies and procedures.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ padding: '24px', paddingTop: 0 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <SubmitButton
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <PetsIcon />}
        >
          {isLoading ? 'Submitting...' : `Submit Application for ${pet.name}`}
        </SubmitButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default AdoptionApplicationModal;
