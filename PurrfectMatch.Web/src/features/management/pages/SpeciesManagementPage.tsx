import React from 'react';
import { toast } from 'react-toastify';
import AttributeManagementPage, { BaseAttribute } from '../components/AttributeManagementPage';
import {
  useFetchAllSpeciesQuery,
  useCreateSpeciesMutation,
  useUpdateSpeciesMutation,
  useDeleteSpeciesMutation,
} from '../api/petAttributesApi';
import { SpeciesDto } from '../../../app/models/PetAttributes';

// Extend the base attribute interface for Species
interface SpeciesAttribute extends BaseAttribute {
  id: number;
  name: string;
}

const SpeciesManagementPage: React.FC = () => {
  const {
    data: speciesData,
    isLoading,
    error,
    refetch,
  } = useFetchAllSpeciesQuery();

  const [createSpecies, { isLoading: createLoading }] = useCreateSpeciesMutation();
  const [updateSpecies, { isLoading: updateLoading }] = useUpdateSpeciesMutation();
  const [deleteSpecies, { isLoading: deleteLoading }] = useDeleteSpeciesMutation();

  // Transform API data to match our interface
  const transformedData: SpeciesAttribute[] | undefined = speciesData?.map((species: SpeciesDto) => ({
    id: species.speciesId,
    name: species.name,
  }));

  const handleCreate = async (data: { name: string }) => {
    try {
      await createSpecies(data).unwrap();
      toast.success('Species created successfully');
    } catch (error) {
      toast.error('Failed to create species');
      console.error('Error creating species:', error);
    }
  };

  const handleUpdate = async (id: number, data: { name: string }) => {
    try {
      await updateSpecies({ speciesId: id, ...data }).unwrap();
      toast.success('Species updated successfully');
    } catch (error) {
      toast.error('Failed to update species');
      console.error('Error updating species:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSpecies(id).unwrap();
      toast.success('Species deleted successfully');
    } catch (error) {
      toast.error('Failed to delete species');
      console.error('Error deleting species:', error);
    }
  };

  const validateForm = (data: { name: string }) => {
    if (!data.name.trim()) {
      return 'Species name is required';
    }
    if (data.name.length < 2) {
      return 'Species name must be at least 2 characters long';
    }
    if (data.name.length > 50) {
      return 'Species name must be less than 50 characters';
    }
    return null;
  };

  return (
    <AttributeManagementPage<SpeciesAttribute>
      title="Species Management"
      subtitle="Manage pet species in the system"
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
    />
  );
};

export default SpeciesManagementPage;
