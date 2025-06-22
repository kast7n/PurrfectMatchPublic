import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,  Alert,
  CircularProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Pet, UpdatePetDto } from '../../app/models/pet';
import { 
  useUpdatePetMutation, 
  useSoftDeletePetMutation, 
  useUploadPetImageMutation,
  useMarkPetAsAdoptedMutation
} from './petApi';
import {
  useFetchSpeciesQuery,
  useFetchBreedsQuery,
  useFetchCoatLengthsQuery,
  useFetchColorsQuery,
  useFetchActivityLevelsQuery,
  useFetchHealthStatusesQuery,
} from './filterOptionsApi';
import { 
  SpeciesDto, 
  BreedDto, 
  CoatLengthDto, 
  ColorDto, 
  ActivityLevelDto, 
  HealthStatusDto 
} from '../../app/models/PetAttributes';
import { toast } from 'react-toastify';

// Animations
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

const pulse = keyframes`
  0% { 
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
  }
  70% { 
    box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
  }
`;

// Styled components
const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95vw',
  maxWidth: '1200px',
  height: '95vh',
  maxHeight: '900px',
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
  [theme.breakpoints.down('md')]: {
    minHeight: '300px',
    flex: '0 0 40%',
  },
}));

const PetImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const PlaceholderEmoji = styled(Typography)(({ theme }) => ({
  fontSize: '120px',
  color: theme.palette.text.disabled,
  animation: `${slideInLeft} 0.5s ease-out`,
}));

const ImageNavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  zIndex: 2,
}));

const ImageDots = styled(Box)({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
  zIndex: 2,
});

const Dot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
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
  animation: `${slideInLeft} 0.5s ease-out 0.2s both`,
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

const ManagementActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  marginBottom: '24px',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const ActionButton = styled(Button)(() => ({
  borderRadius: '8px',
  padding: '12px 20px',
  textTransform: 'none',
  fontWeight: 600,
  minWidth: '120px',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const EditButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.info.main,
  color: theme.palette.info.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.info.dark,
  },
}));

const UploadButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const DeleteButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const AdoptButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  animation: `${pulse} 2s infinite`,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
}));

const UnadoptButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.warning.dark,
  },
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
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}));

const AttributeLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px',
}));

const AttributeValue = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const DescriptionSection = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  marginBottom: '24px',
}));

const DescriptionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '18px',
  color: theme.palette.text.primary,
  marginBottom: '12px',
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
}));

const HiddenInput = styled('input')({
  display: 'none',
});

const UploadArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: '12px',
  padding: '40px 20px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderColor: theme.palette.primary.dark,
  },
}));

// Helper function to apply alpha
function alpha(color: string, opacity: number): string {
  // Simple alpha implementation for demo
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}

interface PetManagementModalProps {
  pet: Pet | null;
  open: boolean;
  onClose: () => void;
  onPetUpdated?: () => void;
}

const PetManagementModal: React.FC<PetManagementModalProps> = ({
  pet,
  open,
  onClose,
  onPetUpdated,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editedPet, setEditedPet] = useState<UpdatePetDto>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);  // API mutations
  const [updatePet, { isLoading: isUpdating }] = useUpdatePetMutation();
  const [deletePet, { isLoading: isDeleting }] = useSoftDeletePetMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadPetImageMutation();
  const [markPetAsAdopted, { isLoading: isMarkingAdopted }] = useMarkPetAsAdoptedMutation();

  // API queries for dropdown options
  const { data: speciesData } = useFetchSpeciesQuery();
  const { data: breedsData } = useFetchBreedsQuery();
  const { data: coatLengthsData } = useFetchCoatLengthsQuery();
  const { data: colorsData } = useFetchColorsQuery();
  const { data: activityLevelsData } = useFetchActivityLevelsQuery();
  const { data: healthStatusesData } = useFetchHealthStatusesQuery();

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
    { label: 'Health', value: healthStatus },
  ].filter(attr => attr.value);

  const defaultDescription = `Meet ${name}! This wonderful ${gender?.toLowerCase()} ${speciesName?.toLowerCase()} is looking for a loving forever home. ${name} would make a perfect companion and bring joy to any family.`;  const handleEdit = () => {
    setEditedPet({
      name: pet.name,
      description: pet.description,
      age: pet.age,
      gender: pet.gender,
      size: pet.size,
      // Include attribute IDs for proper update
      speciesId: speciesData?.find((s: SpeciesDto) => s.name === pet.speciesName)?.speciesId,
      breedId: breedsData?.find((b: BreedDto) => b.name === pet.breedName)?.breedId,
      coatLengthId: coatLengthsData?.find((c: CoatLengthDto) => c.length === pet.coatLength)?.coatLengthId,
      colorId: colorsData?.find((c: ColorDto) => c.color1 === pet.color)?.colorId,
      activityLevelId: activityLevelsData?.find((a: ActivityLevelDto) => a.activity === pet.activityLevel)?.activityLevelId,
      healthStatusId: healthStatusesData?.find((h: HealthStatusDto) => h.status === pet.healthStatus)?.healthStatusId,
    });
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updatePet({
        id: pet.petId,
        updatedPet: editedPet,
      }).unwrap();
      
      toast.success('Pet updated successfully!');
      setEditMode(false);
      onPetUpdated?.();
    } catch (error) {
      toast.error('Failed to update pet');
      console.error('Error updating pet:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedPet({});
  };

  const handleDelete = async () => {
    try {
      await deletePet(pet.petId).unwrap();
      toast.success('Pet deleted successfully!');
      setDeleteConfirmOpen(false);
      onClose();
      onPetUpdated?.();
    } catch (error) {
      toast.error('Failed to delete pet');
      console.error('Error deleting pet:', error);
    }
  };
  const handleAdoptionToggle = async () => {
    try {
      await markPetAsAdopted({
        id: pet.petId,
        isAdopted: !pet.isAdopted,
      }).unwrap();
      
      toast.success(
        pet.isAdopted 
          ? `${name} is now available for adoption!` 
          : `${name} has been marked as adopted! 🎉`
      );
      onPetUpdated?.();
    } catch (error) {
      toast.error('Failed to update adoption status');
      console.error('Error updating adoption status:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadDialogOpen(true);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadImage({
        petId: pet.petId,
        file: selectedFile,
      }).unwrap();
      
      toast.success('Image uploaded successfully!');
      setUploadDialogOpen(false);
      setSelectedFile(null);
      onPetUpdated?.();
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Error uploading image:', error);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="pet-management-title"
        aria-describedby="pet-management-description"
      >
        <ModalContainer>
          <ModalHeader>
            <ModalTitle id="pet-management-title">
              {isAdopted && (
                <Chip 
                  label="Adopted" 
                  color="success" 
                  size="small" 
                  sx={{ mr: 1 }} 
                />
              )}
              Pet Management - {name}
            </ModalTitle>
            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
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

            <InfoSection>              {editMode ? (
                <Box>
                  {/* Basic Information */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Basic Information
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Pet Name"
                    value={editedPet.name || ''}
                    onChange={(e) => setEditedPet({ ...editedPet, name: e.target.value })}
                    margin="normal"
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label="Age"
                    value={editedPet.age || ''}
                    onChange={(e) => setEditedPet({ ...editedPet, age: e.target.value })}
                    margin="normal"
                    placeholder="e.g., 2 years, 6 months"
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={editedPet.gender || ''}
                      label="Gender"
                      onChange={(e) => setEditedPet({ ...editedPet, gender: e.target.value })}
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Size</InputLabel>
                    <Select
                      value={editedPet.size || ''}
                      label="Size"
                      onChange={(e) => setEditedPet({ ...editedPet, size: e.target.value })}
                    >
                      <MenuItem value="">Select Size</MenuItem>
                      <MenuItem value="Small">Small</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Large">Large</MenuItem>
                      <MenuItem value="Extra Large">Extra Large</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Species & Breed */}
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Species & Breed
                  </Typography>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Species</InputLabel>
                    <Select
                      value={editedPet.speciesId?.toString() || ''}
                      label="Species"
                      onChange={(e) => {
                        const speciesId = e.target.value ? parseInt(e.target.value) : undefined;
                        setEditedPet({ ...editedPet, speciesId, breedId: undefined }); // Reset breed when species changes
                      }}
                    >
                      <MenuItem value="">Select Species</MenuItem>
                      {speciesData?.map((species: SpeciesDto) => (
                        <MenuItem key={species.speciesId} value={species.speciesId.toString()}>
                          {species.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Breed</InputLabel>
                    <Select
                      value={editedPet.breedId?.toString() || ''}
                      label="Breed"
                      onChange={(e) => {
                        const breedId = e.target.value ? parseInt(e.target.value) : undefined;
                        setEditedPet({ ...editedPet, breedId });
                      }}
                      disabled={!editedPet.speciesId}
                    >
                      <MenuItem value="">Select Breed</MenuItem>
                      {breedsData
                        ?.filter((breed: BreedDto) => breed.speciesId === editedPet.speciesId)
                        .map((breed: BreedDto) => (
                          <MenuItem key={breed.breedId} value={breed.breedId.toString()}>
                            {breed.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  {/* Physical Attributes */}
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Physical Attributes
                  </Typography>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={editedPet.colorId?.toString() || ''}
                      label="Color"
                      onChange={(e) => {
                        const colorId = e.target.value ? parseInt(e.target.value) : undefined;
                        setEditedPet({ ...editedPet, colorId });
                      }}
                    >
                      <MenuItem value="">Select Color</MenuItem>
                      {colorsData?.map((color: ColorDto) => (
                        <MenuItem key={color.colorId} value={color.colorId.toString()}>
                          {color.color1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Coat Length</InputLabel>
                    <Select
                      value={editedPet.coatLengthId?.toString() || ''}
                      label="Coat Length"
                      onChange={(e) => {
                        const coatLengthId = e.target.value ? parseInt(e.target.value) : undefined;
                        setEditedPet({ ...editedPet, coatLengthId });
                      }}
                    >
                      <MenuItem value="">Select Coat Length</MenuItem>
                      {coatLengthsData?.map((coatLength: CoatLengthDto) => (
                        <MenuItem key={coatLength.coatLengthId} value={coatLength.coatLengthId.toString()}>
                          {coatLength.length}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Behavioral & Health */}
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Behavioral & Health
                  </Typography>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Activity Level</InputLabel>
                    <Select
                      value={editedPet.activityLevelId?.toString() || ''}
                      label="Activity Level"
                      onChange={(e) => {
                        const activityLevelId = e.target.value ? parseInt(e.target.value) : undefined;
                        setEditedPet({ ...editedPet, activityLevelId });
                      }}
                    >
                      <MenuItem value="">Select Activity Level</MenuItem>
                      {activityLevelsData?.map((activityLevel: ActivityLevelDto) => (
                        <MenuItem key={activityLevel.activityLevelId} value={activityLevel.activityLevelId.toString()}>
                          {activityLevel.activity}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Health Status</InputLabel>
                    <Select
                      value={editedPet.healthStatusId?.toString() || ''}
                      label="Health Status"
                      onChange={(e) => {
                        const healthStatusId = e.target.value ? parseInt(e.target.value) : undefined;
                        setEditedPet({ ...editedPet, healthStatusId });
                      }}
                    >
                      <MenuItem value="">Select Health Status</MenuItem>
                      {healthStatusesData?.map((healthStatus: HealthStatusDto) => (
                        <MenuItem key={healthStatus.healthStatusId} value={healthStatus.healthStatusId.toString()}>
                          {healthStatus.status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Description */}
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Description
                  </Typography>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={editedPet.description || ''}
                    onChange={(e) => setEditedPet({ ...editedPet, description: e.target.value })}
                    margin="normal"
                    placeholder="Tell us about this pet's personality, behavior, and any special needs..."
                  />
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={isUpdating ? <CircularProgress size={16} /> : <SaveIcon />}
                      onClick={handleSaveEdit}
                      disabled={isUpdating}
                      sx={{ minWidth: '120px' }}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <PetName>{name}</PetName>
                  <PetBasicInfo>
                    {getAgeText()} • {gender} • {speciesName}
                  </PetBasicInfo>

                  <ManagementActions>
                    <EditButton
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                    >
                      Edit
                    </EditButton>
                    
                    <UploadButton
                      startIcon={<PhotoCameraIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Picture
                    </UploadButton>                    {isAdopted ? (
                      <UnadoptButton
                        startIcon={isMarkingAdopted ? <CircularProgress size={16} /> : <UndoIcon />}
                        onClick={handleAdoptionToggle}
                        disabled={isMarkingAdopted}
                      >
                        {isMarkingAdopted ? 'Updating...' : 'Mark Available'}
                      </UnadoptButton>
                    ) : (
                      <AdoptButton
                        startIcon={isMarkingAdopted ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                        onClick={handleAdoptionToggle}
                        disabled={isMarkingAdopted}
                      >
                        {isMarkingAdopted ? 'Updating...' : 'Mark Adopted'}
                      </AdoptButton>
                    )}

                    <DeleteButton
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteConfirmOpen(true)}
                    >
                      Delete
                    </DeleteButton>
                  </ManagementActions>                  <AttributesGrid container spacing={2}>
                    {petAttributes.map((attr) => (
                      <Grid item xs={6} sm={4} key={attr.label}>
                        <AttributeCard elevation={0}>
                          <AttributeLabel>{attr.label}</AttributeLabel>
                          <AttributeValue>{attr.value}</AttributeValue>
                        </AttributeCard>
                      </Grid>
                    ))}
                  </AttributesGrid>

                  <DescriptionSection elevation={0}>
                    <DescriptionTitle>About {name}</DescriptionTitle>
                    <DescriptionText>
                      {description || defaultDescription}
                    </DescriptionText>
                  </DescriptionSection>
                </>
              )}
            </InfoSection>
          </ModalContent>
        </ModalContainer>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Pet</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete {name}? This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Pet Picture</DialogTitle>
        <DialogContent>
          {selectedFile ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Selected: {selectedFile.name}
              </Typography>
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
              />
            </Box>
          ) : (
            <UploadArea onClick={() => fileInputRef.current?.click()}>
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Click to select an image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported formats: JPG, PNG, GIF
              </Typography>
            </UploadArea>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleImageUpload} 
            variant="contained"
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden File Input */}
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </>
  );
};

export default PetManagementModal;
