import React from 'react';
import { toast } from 'react-toastify';
import AttributeManagementPage, { BaseAttribute } from '../components/AttributeManagementPage';
import {
  useFetchAllCoatLengthsQuery,
  useCreateCoatLengthMutation,
  useUpdateCoatLengthMutation,
  useDeleteCoatLengthMutation,
} from '../api/petAttributesApi';
import { CoatLengthDto } from '../../../app/models/PetAttributes';

// Extend the base attribute interface for Coat Lengths
interface CoatLengthAttribute extends BaseAttribute {
  id: number;
  name: string;
}

const CoatLengthsManagementPage: React.FC = () => {
  const {
    data: coatLengthsData,
    isLoading,
    error,
    refetch,
  } = useFetchAllCoatLengthsQuery();

  const [createCoatLength, { isLoading: createLoading }] = useCreateCoatLengthMutation();
  const [updateCoatLength, { isLoading: updateLoading }] = useUpdateCoatLengthMutation();
  const [deleteCoatLength, { isLoading: deleteLoading }] = useDeleteCoatLengthMutation();

  // Transform API data to match our interface
  const transformedData: CoatLengthAttribute[] | undefined = coatLengthsData?.map((coatLength: CoatLengthDto) => ({
    id: coatLength.coatLengthId,
    name: coatLength.length,
  }));

  const handleCreate = async (data: { name: string }) => {
    try {
      await createCoatLength({ length: data.name }).unwrap();
      toast.success('Coat length created successfully');
    } catch (error) {
      toast.error('Failed to create coat length');
      console.error('Error creating coat length:', error);
    }
  };

  const handleUpdate = async (id: number, data: { name: string }) => {
    try {
      await updateCoatLength({ coatLengthId: id, length: data.name }).unwrap();
      toast.success('Coat length updated successfully');
    } catch (error) {
      toast.error('Failed to update coat length');
      console.error('Error updating coat length:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCoatLength(id).unwrap();
      toast.success('Coat length deleted successfully');
    } catch (error) {
      toast.error('Failed to delete coat length');
      console.error('Error deleting coat length:', error);
    }
  };

  const validateForm = (data: { name: string }) => {
    if (!data.name.trim()) {
      return 'Coat length is required';
    }
    if (data.name.length < 2) {
      return 'Coat length must be at least 2 characters long';
    }
    if (data.name.length > 20) {
      return 'Coat length must be less than 20 characters';
    }
    return null;
  };

  return (
    <AttributeManagementPage<CoatLengthAttribute>
      title="Coat Lengths Management"
      subtitle="Manage pet coat lengths in the system"
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

export default CoatLengthsManagementPage;
