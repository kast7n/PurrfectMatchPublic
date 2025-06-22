import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Avatar,
  IconButton,
  styled,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  Cancel,
  Person,
  Home,
  Work,
  Pets,
  LocationOn,
  Phone,
  Info,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useGetCurrentUserProfileQuery,
  useCreateUserProfileMutation,
  useUpdateCurrentUserProfileMutation,
  useUploadUserPhotoMutation,
  UpdateUserProfileRequest,
  CreateUserProfileRequest
} from './userProfileApi';

// Validation schema - matching backend DTO structure
const profileSchema = z.object({
  PhoneNumber: z.string().optional().or(z.literal('')),
  Age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Must be under 100 years old').optional(),
  Job: z.string().optional().or(z.literal('')),
  CurrentPetsOwned: z.number().min(0, 'Cannot be negative').max(50, 'Maximum 50 pets'),
  GeneralInfo: z.string().min(10, 'Please provide at least 10 characters').max(500, 'Maximum 500 characters'),
  HousingType: z.string().min(1, 'Housing type is required'),
  HasYard: z.boolean(),
  Allergies: z.string().optional().or(z.literal('')),  ExperienceWithPets: z.string().min(1, 'Experience with pets is required'),
  // Address fields
  Street: z.string().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Styled components
const FormContainer = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(3),
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.mode === 'dark' ? '#FF6B6B' : '#D32F2F',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  fontSize: '1.1rem',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.mode === 'dark' ? '#FF6B6B' : '#D32F2F'}`,
  margin: theme.spacing(0, 'auto', 2),
}));

const EditProfileForm: React.FC = () => {
  const { data: currentProfile, isLoading: profileLoading } = useGetCurrentUserProfileQuery();
  const [createProfile] = useCreateUserProfileMutation();
  const [updateProfile] = useUpdateCurrentUserProfileMutation();
  const [uploadPhoto] = useUploadUserPhotoMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),    defaultValues: {
      PhoneNumber: '',
      Age: undefined,
      Job: '',
      CurrentPetsOwned: 0,
      GeneralInfo: '',
      HousingType: '',
      HasYard: false,
      Allergies: '',
      ExperienceWithPets: '',
      Street: '',
    },
  });

  // Populate form with existing profile data
  useEffect(() => {
    if (currentProfile) {
      reset({
        PhoneNumber: currentProfile.phoneNumber || '',
        Age: currentProfile.age,
        Job: currentProfile.job || '',
        CurrentPetsOwned: currentProfile.currentPetsOwned || 0,
        GeneralInfo: currentProfile.generalInfo || '',
        HousingType: currentProfile.housingType || '',
        HasYard: currentProfile.hasYard || false,
        Allergies: currentProfile.allergies || '',        ExperienceWithPets: currentProfile.experienceWithPets || '',
        Street: currentProfile.address?.street || '',
      });
      setPhotoPreview(currentProfile.photoUrl || null);
    }
  }, [currentProfile, reset]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let profileExists = !!currentProfile;
        // Create or update profile first
      if (currentProfile) {
        // Update existing profile
        const updateData: UpdateUserProfileRequest = {
          PhoneNumber: data.PhoneNumber || undefined,
          Age: data.Age,
          Job: data.Job || undefined,
          CurrentPetsOwned: data.CurrentPetsOwned,
          GeneralInfo: data.GeneralInfo,
          HousingType: data.HousingType,
          HasYard: data.HasYard,
          Allergies: data.Allergies || undefined,          ExperienceWithPets: data.ExperienceWithPets,
          Address: {
            street: data.Street || undefined,
          },
        };
        await updateProfile(updateData).unwrap();
      } else {
        // Create new profile - backend will set userId from authenticated user
        const createData: CreateUserProfileRequest = {
          PhoneNumber: data.PhoneNumber || undefined,
          Age: data.Age,
          Job: data.Job || undefined,
          CurrentPetsOwned: data.CurrentPetsOwned,
          GeneralInfo: data.GeneralInfo,
          HousingType: data.HousingType,
          HasYard: data.HasYard,
          Allergies: data.Allergies || undefined,          ExperienceWithPets: data.ExperienceWithPets,
          Address: {
            street: data.Street || undefined,
          },
        };
        await createProfile(createData).unwrap();
        profileExists = true; // Profile now exists
      }

      // Then upload photo if one is selected
      if (photoFile && profileExists) {
        await uploadPhoto(photoFile).unwrap();
        setPhotoFile(null);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting profile:', error);
    }
  };

  if (profileLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {isEditing ? (
        // Edit Form
        <FormContainer>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              {currentProfile ? 'Edit Profile' : 'Create Profile'}
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                
                {/* Photo Upload Section */}
                <Grid item xs={12} textAlign="center">
                  <SectionTitle>
                    <PhotoCamera />
                    Profile Photo
                  </SectionTitle>
                  
                  <StyledAvatar
                    src={photoPreview || currentProfile?.photoUrl || undefined}
                    sx={{ fontSize: '3rem' }}
                  >
                    {!photoPreview && !currentProfile?.photoUrl && <Person fontSize="large" />}
                  </StyledAvatar>
                  
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handlePhotoChange}
                  />
                  <label htmlFor="photo-upload">
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12}>
                  <SectionTitle>
                    <Person />
                    Personal Information
                  </SectionTitle>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="PhoneNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone Number"
                        error={!!errors.PhoneNumber}
                        helperText={errors.PhoneNumber?.message}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="Age"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Age"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        error={!!errors.Age}
                        helperText={errors.Age?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="Job"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Occupation"
                        error={!!errors.Job}
                        helperText={errors.Job?.message}
                        InputProps={{
                          startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Pet Information */}
                <Grid item xs={12}>
                  <SectionTitle>
                    <Pets />
                    Pet Information
                  </SectionTitle>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="CurrentPetsOwned"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Current Pets Owned"
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        error={!!errors.CurrentPetsOwned}
                        helperText={errors.CurrentPetsOwned?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="ExperienceWithPets"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.ExperienceWithPets}>
                        <InputLabel>Experience with Pets</InputLabel>
                        <Select {...field} label="Experience with Pets">
                          <MenuItem value="none">None</MenuItem>
                          <MenuItem value="some">Some</MenuItem>
                          <MenuItem value="experienced">Experienced</MenuItem>
                          <MenuItem value="very-experienced">Very Experienced</MenuItem>
                        </Select>
                        {errors.ExperienceWithPets && (
                          <Typography variant="caption" color="error">
                            {errors.ExperienceWithPets.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Housing Information */}
                <Grid item xs={12}>
                  <SectionTitle>
                    <Home />
                    Housing Information
                  </SectionTitle>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="HousingType"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.HousingType}>
                        <InputLabel>Housing Type</InputLabel>
                        <Select {...field} label="Housing Type">
                          <MenuItem value="apartment">Apartment</MenuItem>
                          <MenuItem value="house">House</MenuItem>
                          <MenuItem value="condo">Condo</MenuItem>
                          <MenuItem value="townhouse">Townhouse</MenuItem>
                          <MenuItem value="farm">Farm</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                        {errors.HousingType && (
                          <Typography variant="caption" color="error">
                            {errors.HousingType.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="HasYard"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        }
                        label="Has Yard"
                      />
                    )}
                  />
                </Grid>

                {/* Address Information */}
                <Grid item xs={12}>
                  <SectionTitle>
                    <LocationOn />
                    Address Information
                  </SectionTitle>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="Street"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Street Address"
                        error={!!errors.Street}
                        helperText={errors.Street?.message}
                      />
                    )}
                  />                </Grid>

                {/* Additional Information */}
                <Grid item xs={12}>
                  <SectionTitle>
                    <Info />
                    Additional Information
                  </SectionTitle>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="GeneralInfo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="General Information"
                        placeholder="Tell us about yourself and why you want to adopt a pet..."
                        error={!!errors.GeneralInfo}
                        helperText={errors.GeneralInfo?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="Allergies"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Allergies (Optional)"
                        placeholder="Any allergies we should know about?"
                        error={!!errors.Allergies}
                        helperText={errors.Allergies?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box display="flex" gap={2} justifyContent="center">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={<Save />}
                      sx={{
                        background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FF5252 30%, #FF7043 90%)',
                        },
                      }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Profile'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => setIsEditing(false)}
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </FormContainer>
      ) : (
        // Profile Display
        <FormContainer>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              User Profile
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} display="flex" justifyContent="center" mb={3}>
                <StyledAvatar
                  src={currentProfile?.photoUrl || undefined}
                  sx={{ fontSize: '3rem' }}
                >
                  {!currentProfile?.photoUrl && <Person fontSize="large" />}
                </StyledAvatar>
              </Grid>

              {/* Personal Information Display */}
              <Grid item xs={12}>
                <SectionTitle>
                  <Person />
                  Personal Information
                </SectionTitle>
              </Grid>

              {currentProfile?.phoneNumber && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                  <Typography variant="body1">{currentProfile.phoneNumber}</Typography>
                </Grid>
              )}

              {currentProfile?.age && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Age</Typography>
                  <Typography variant="body1">{currentProfile.age} years old</Typography>
                </Grid>
              )}

              {currentProfile?.job && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Occupation</Typography>
                  <Typography variant="body1">{currentProfile.job}</Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Current Pets Owned</Typography>
                <Typography variant="body1">{currentProfile?.currentPetsOwned || 0}</Typography>
              </Grid>

              {/* Housing Information Display */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <SectionTitle>
                  <Home />
                  Housing Information
                </SectionTitle>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Housing Type</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {currentProfile?.housingType || 'Not specified'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Has Yard</Typography>
                <Typography variant="body1">{currentProfile?.hasYard ? 'Yes' : 'No'}</Typography>
              </Grid>

              {/* Address Display */}
              {currentProfile?.address && (
                <>
                  <Grid item xs={12}>
                    <SectionTitle>
                      <LocationOn />
                      Address Information
                    </SectionTitle>
                  </Grid>

                  {currentProfile.address.street && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Street Address</Typography>
                      <Typography variant="body1">{currentProfile.address.street}</Typography>
                    </Grid>
                  )}                </>
              )}

              {/* Pet Experience Display */}
              <Grid item xs={12}>
                <SectionTitle>
                  <Info />
                  Pet Experience & Additional Information
                </SectionTitle>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Experience with Pets</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {currentProfile?.experienceWithPets?.replace('-', ' ') || 'Not specified'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">General Information</Typography>
                <Typography variant="body1">{currentProfile?.generalInfo || 'Not provided'}</Typography>
              </Grid>

              {currentProfile?.allergies && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Allergies</Typography>
                  <Typography variant="body1">{currentProfile.allergies}</Typography>
                </Grid>
              )}

              {/* Action Button */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" mt={3}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setIsEditing(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF5252 30%, #FF7043 90%)',
                      },
                    }}
                  >
                    {currentProfile ? 'Edit Profile' : 'Create Profile'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </FormContainer>
      )}
    </Box>
  );
};

export default EditProfileForm;
