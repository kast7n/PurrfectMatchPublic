import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';
import AttributeManagementPage, { BaseAttribute } from '../components/AttributeManagementPage';
import {
  useFetchAllBreedsQuery,
  useFetchAllSpeciesQuery,
  useCreateBreedMutation,
  useUpdateBreedMutation,
  useDeleteBreedMutation,
} from '../api/petAttributesApi';
import { BreedDto, SpeciesDto } from '../../../app/models/PetAttributes';

// Extend the base attribute interface for Breeds
interface BreedAttribute extends BaseAttribute {
  id: number;
  name: string;
  speciesId: number;
  speciesName?: string;
}

const BreedsManagementPage: React.FC = () => {
  const {
    data: breedsData,
    isLoading,
    error,
    refetch,
  } = useFetchAllBreedsQuery({});

  const { data: speciesData } = useFetchAllSpeciesQuery();

  const [createBreed, { isLoading: createLoading }] = useCreateBreedMutation();
  const [updateBreed, { isLoading: updateLoading }] = useUpdateBreedMutation();
  const [deleteBreed, { isLoading: deleteLoading }] = useDeleteBreedMutation();

  // Transform API data to match our interface
  const transformedData: BreedAttribute[] | undefined = breedsData?.map((breed: BreedDto) => {
    const species = speciesData?.find((s: SpeciesDto) => s.speciesId === breed.speciesId);
    return {
      id: breed.breedId,
      name: breed.name,
      speciesId: breed.speciesId,
      speciesName: species?.name || 'Unknown',
    };
  });  const handleCreate = async (data: { name: string }) => {
    try {
      // Get speciesId from the extended form data
      const extendedData = data as unknown as Record<string, unknown>;
      const speciesId = Number(extendedData.speciesId);
      if (!speciesId) {
        toast.error('Please select a species');
        return;
      }
      await createBreed({ name: data.name, speciesId }).unwrap();
      toast.success('Breed created successfully');
    } catch (error) {
      toast.error('Failed to create breed');
      console.error('Error creating breed:', error);
    }
  };

  const handleUpdate = async (id: number, data: { name: string }) => {
    try {
      // Get speciesId from the extended form data
      const extendedData = data as unknown as Record<string, unknown>;
      const speciesId = Number(extendedData.speciesId);
      if (!speciesId) {
        toast.error('Please select a species');
        return;
      }
      await updateBreed({ breedId: id, name: data.name, speciesId }).unwrap();
      toast.success('Breed updated successfully');
    } catch (error) {
      toast.error('Failed to update breed');
      console.error('Error updating breed:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBreed(id).unwrap();
      toast.success('Breed deleted successfully');
    } catch (error) {
      toast.error('Failed to delete breed');
      console.error('Error deleting breed:', error);
    }
  };
  const validateForm = (data: { name: string }) => {
    const extendedData = data as unknown as Record<string, unknown>;
    
    if (!data.name.trim()) {
      return 'Breed name is required';
    }
    if (data.name.length < 2) {
      return 'Breed name must be at least 2 characters long';
    }
    if (data.name.length > 50) {
      return 'Breed name must be less than 50 characters';
    }
    if (!extendedData.speciesId) {
      return 'Species selection is required';
    }
    return null;
  };

  const getDisplayValue = (item: BreedAttribute) => {
    return `${item.name} (${item.speciesName})`;
  };
  const extraFormFields = (
    formData: Record<string, unknown>,
    onChange: (field: string, value: unknown) => void
  ) => (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Species</InputLabel>
        <Select
          value={formData.speciesId || ''}
          label="Species"
          onChange={(e) => onChange('speciesId', Number(e.target.value))}
        >
          <MenuItem value="">Select a species</MenuItem>
          {speciesData?.map((species: SpeciesDto) => (
            <MenuItem key={species.speciesId} value={species.speciesId}>
              {species.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <AttributeManagementPage<BreedAttribute>
      title="Breeds Management"
      subtitle="Manage pet breeds in the system"
      data={transformedData}
      isLoading={isLoading}
      error={error}
      onRefresh={refetch}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      createLoading={createLoading}
      updateLoading={updateLoading}
      deleteLoading={deleteLoading}
      validateForm={validateForm}
      getDisplayValue={getDisplayValue}
      extraFormFields={extraFormFields}
    />
  );
};

export default BreedsManagementPage;
