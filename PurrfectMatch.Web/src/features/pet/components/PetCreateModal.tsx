import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPetSchema, CreatePetSchema } from '../../../lib/schemas/createPetSchema';
import { useAddPetMutation } from '../../pet/petApi';
import {
  useFetchSpeciesQuery,
  useFetchBreedsQuery,
  useFetchActivityLevelsQuery,
  useFetchHealthStatusesQuery,
  useFetchColorsQuery,
  useFetchCoatLengthsQuery,
} from '../../pet/filterOptionsApi';
import { toast } from 'react-toastify';

interface PetCreateModalProps {
  open: boolean;
  onClose: () => void;
  shelterId: number;
  onSuccess?: () => void;
}

const PetCreateModal: React.FC<PetCreateModalProps> = ({
  open,
  onClose,
  shelterId,
  onSuccess,
}) => {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);

  const { data: species = [] } = useFetchSpeciesQuery();
  const { data: breeds = [] } = useFetchBreedsQuery();
  const { data: activityLevels = [] } = useFetchActivityLevelsQuery();
  const { data: healthStatuses = [] } = useFetchHealthStatusesQuery();
  const { data: colors = [] } = useFetchColorsQuery();
  const { data: coatLengths = [] } = useFetchCoatLengthsQuery();

  const [addPet, { isLoading }] = useAddPetMutation();  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePetSchema>({
    resolver: zodResolver(createPetSchema),
    defaultValues: {
      shelterId,
      microchipped: false,
    },
  });

  // Filter breeds based on selected species
  const filteredBreeds = selectedSpeciesId
    ? breeds.filter(breed => breed.speciesId === selectedSpeciesId)
    : breeds;
  const handleClose = () => {
    reset();
    setSelectedSpeciesId(null);
    onClose();
  };
  const onSubmit = async (data: CreatePetSchema) => {
    try {
      // Process the form data to handle autocomplete values
      const processedData = {
        ...data,
        // Clear conflicting fields based on what the user selected/entered
        speciesId: data.speciesId || undefined,
        species: data.speciesId ? undefined : data.species,
        breedId: data.breedId || undefined,
        breed: data.breedId ? undefined : data.breed,
        activityLevelId: data.activityLevelId || undefined,
        activityLevel: data.activityLevelId ? undefined : data.activityLevel,
        healthStatusId: data.healthStatusId || undefined,
        healthStatus: data.healthStatusId ? undefined : data.healthStatus,
        colorId: data.colorId || undefined,
        color: data.colorId ? undefined : data.color,
        coatLengthId: data.coatLengthId || undefined,
        coatLength: data.coatLengthId ? undefined : data.coatLength,
      };

      await addPet(processedData).unwrap();
      toast.success('Pet created successfully!');
      handleClose();
      onSuccess?.();
    } catch (error) {      toast.error('Failed to create pet. Please try again.');
      console.error('Error creating pet:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="h2">
          Add New Pet
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pet Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Age"
                    fullWidth
                    placeholder="e.g., 2 years, 6 months"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender} required>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender">
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Unknown">Unknown</MenuItem>
                    </Select>
                    {errors.gender && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {errors.gender.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.size} required>
                    <InputLabel>Size</InputLabel>
                    <Select {...field} label="Size">
                      <MenuItem value="Small">Small</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Large">Large</MenuItem>
                      <MenuItem value="Extra Large">Extra Large</MenuItem>
                    </Select>
                    {errors.size && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {errors.size.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="microchipped"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value || false}
                      />
                    }
                    label="Microchipped"
                  />
                )}
              />
            </Grid>

            {/* Pet Attributes */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Pet Attributes
              </Typography>
            </Grid>            {/* Species */}
            <Grid item xs={12} md={6}>
              <Controller
                name="species"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={species}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.name
                    }
                    value={value || ''}
                    onChange={(_, newValue) => {
                      if (typeof newValue === 'string') {
                        // User typed a new species name
                        onChange(newValue);
                        setValue('speciesId', undefined);
                        setSelectedSpeciesId(null);
                      } else if (newValue) {
                        // User selected an existing species
                        setValue('speciesId', newValue.speciesId);
                        setValue('species', undefined);
                        onChange('');
                        setSelectedSpeciesId(newValue.speciesId);
                      } else {
                        // Cleared
                        onChange('');
                        setValue('speciesId', undefined);
                        setSelectedSpeciesId(null);
                      }
                      // Clear breed when species changes
                      setValue('breedId', undefined);
                      setValue('breed', undefined);
                    }}
                    onInputChange={(_, newInputValue) => {
                      if (newInputValue && !species.some(s => s.name === newInputValue)) {
                        onChange(newInputValue);
                        setValue('speciesId', undefined);
                        setSelectedSpeciesId(null);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Species"
                        error={!!errors.species}
                        helperText={errors.species?.message || "Select existing or type new species"}
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.speciesId}>
                        {option.name}
                      </li>
                    )}
                  />
                )}
              />
            </Grid>            {/* Breed */}
            <Grid item xs={12} md={6}>
              <Controller
                name="breed"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={filteredBreeds}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.name
                    }
                    value={value || ''}
                    onChange={(_, newValue) => {
                      if (typeof newValue === 'string') {
                        // User typed a new breed name
                        onChange(newValue);
                        setValue('breedId', undefined);
                      } else if (newValue) {
                        // User selected an existing breed
                        setValue('breedId', newValue.breedId);
                        setValue('breed', undefined);
                        onChange('');
                      } else {
                        // Cleared
                        onChange('');
                        setValue('breedId', undefined);
                      }
                    }}
                    onInputChange={(_, newInputValue) => {
                      if (newInputValue && !filteredBreeds.some(b => b.name === newInputValue)) {
                        onChange(newInputValue);
                        setValue('breedId', undefined);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Breed"
                        error={!!errors.breed}
                        helperText={errors.breed?.message || "Select existing or type new breed"}
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.breedId}>
                        {option.name}
                      </li>
                    )}
                    disabled={!selectedSpeciesId && !watch('species')}
                  />
                )}
              />
            </Grid>            {/* Activity Level */}
            <Grid item xs={12} md={6}>
              <Controller
                name="activityLevel"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={activityLevels}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.activity
                    }
                    value={value || ''}
                    onChange={(_, newValue) => {
                      if (typeof newValue === 'string') {
                        // User typed a new activity level
                        onChange(newValue);
                        setValue('activityLevelId', undefined);
                      } else if (newValue) {
                        // User selected an existing activity level
                        setValue('activityLevelId', newValue.activityLevelId);
                        setValue('activityLevel', undefined);
                        onChange('');
                      } else {
                        // Cleared
                        onChange('');
                        setValue('activityLevelId', undefined);
                      }
                    }}
                    onInputChange={(_, newInputValue) => {
                      if (newInputValue && !activityLevels.some(a => a.activity === newInputValue)) {
                        onChange(newInputValue);
                        setValue('activityLevelId', undefined);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Activity Level"
                        helperText="Select existing or type new activity level"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.activityLevelId}>
                        {option.activity}
                      </li>
                    )}
                  />
                )}
              />
            </Grid>            {/* Health Status */}
            <Grid item xs={12} md={6}>
              <Controller
                name="healthStatus"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={healthStatuses}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.status
                    }
                    value={value || ''}
                    onChange={(_, newValue) => {
                      if (typeof newValue === 'string') {
                        // User typed a new health status
                        onChange(newValue);
                        setValue('healthStatusId', undefined);
                      } else if (newValue) {
                        // User selected an existing health status
                        setValue('healthStatusId', newValue.healthStatusId);
                        setValue('healthStatus', undefined);
                        onChange('');
                      } else {
                        // Cleared
                        onChange('');
                        setValue('healthStatusId', undefined);
                      }
                    }}
                    onInputChange={(_, newInputValue) => {
                      if (newInputValue && !healthStatuses.some(h => h.status === newInputValue)) {
                        onChange(newInputValue);
                        setValue('healthStatusId', undefined);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Health Status"
                        helperText="Select existing or type new health status"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.healthStatusId}>
                        {option.status}
                      </li>
                    )}
                  />
                )}
              />
            </Grid>            {/* Color */}
            <Grid item xs={12} md={6}>
              <Controller
                name="color"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={colors}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.color1
                    }
                    value={value || ''}
                    onChange={(_, newValue) => {
                      if (typeof newValue === 'string') {
                        // User typed a new color
                        onChange(newValue);
                        setValue('colorId', undefined);
                      } else if (newValue) {
                        // User selected an existing color
                        setValue('colorId', newValue.colorId);
                        setValue('color', undefined);
                        onChange('');
                      } else {
                        // Cleared
                        onChange('');
                        setValue('colorId', undefined);
                      }
                    }}
                    onInputChange={(_, newInputValue) => {
                      if (newInputValue && !colors.some(c => c.color1 === newInputValue)) {
                        onChange(newInputValue);
                        setValue('colorId', undefined);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Color"
                        helperText="Select existing or type new color"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.colorId}>
                        {option.color1}
                      </li>
                    )}
                  />
                )}
              />
            </Grid>            {/* Coat Length */}
            <Grid item xs={12} md={6}>
              <Controller
                name="coatLength"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={coatLengths}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.length
                    }
                    value={value || ''}
                    onChange={(_, newValue) => {
                      if (typeof newValue === 'string') {
                        // User typed a new coat length
                        onChange(newValue);
                        setValue('coatLengthId', undefined);
                      } else if (newValue) {
                        // User selected an existing coat length
                        setValue('coatLengthId', newValue.coatLengthId);
                        setValue('coatLength', undefined);
                        onChange('');
                      } else {
                        // Cleared
                        onChange('');
                        setValue('coatLengthId', undefined);
                      }
                    }}
                    onInputChange={(_, newInputValue) => {
                      if (newInputValue && !coatLengths.some(c => c.length === newInputValue)) {
                        onChange(newInputValue);
                        setValue('coatLengthId', undefined);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Coat Length"
                        helperText="Select existing or type new coat length"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.coatLengthId}>
                        {option.length}
                      </li>
                    )}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Description
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pet Description"
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Describe the pet's personality, behavior, special needs, etc."
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    required
                  />                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? 'Creating...' : 'Create Pet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PetCreateModal;
