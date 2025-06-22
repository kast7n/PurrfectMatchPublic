import React from 'react';
import { toast } from 'react-toastify';
import AttributeManagementPage, { BaseAttribute } from '../components/AttributeManagementPage';
import {
  useFetchAllColorsQuery,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} from '../api/petAttributesApi';
import { ColorDto } from '../../../app/models/PetAttributes';

// Extend the base attribute interface for Colors
interface ColorAttribute extends BaseAttribute {
  id: number;
  name: string;
}

const ColorsManagementPage: React.FC = () => {
  const {
    data: colorsData,
    isLoading,
    error,
    refetch,
  } = useFetchAllColorsQuery();

  const [createColor, { isLoading: createLoading }] = useCreateColorMutation();
  const [updateColor, { isLoading: updateLoading }] = useUpdateColorMutation();
  const [deleteColor, { isLoading: deleteLoading }] = useDeleteColorMutation();

  // Transform API data to match our interface
  const transformedData: ColorAttribute[] | undefined = colorsData?.map((color: ColorDto) => ({
    id: color.colorId,
    name: color.color1,
  }));

  const handleCreate = async (data: { name: string }) => {
    try {
      await createColor({ color1: data.name }).unwrap();
      toast.success('Color created successfully');
    } catch (error) {
      toast.error('Failed to create color');
      console.error('Error creating color:', error);
    }
  };

  const handleUpdate = async (id: number, data: { name: string }) => {
    try {
      await updateColor({ colorId: id, color1: data.name }).unwrap();
      toast.success('Color updated successfully');
    } catch (error) {
      toast.error('Failed to update color');
      console.error('Error updating color:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteColor(id).unwrap();
      toast.success('Color deleted successfully');
    } catch (error) {
      toast.error('Failed to delete color');
      console.error('Error deleting color:', error);
    }
  };

  const validateForm = (data: { name: string }) => {
    if (!data.name.trim()) {
      return 'Color name is required';
    }
    if (data.name.length < 2) {
      return 'Color name must be at least 2 characters long';
    }
    if (data.name.length > 30) {
      return 'Color name must be less than 30 characters';
    }
    return null;
  };

  return (
    <AttributeManagementPage<ColorAttribute>
      title="Colors Management"
      subtitle="Manage pet colors in the system"
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

export default ColorsManagementPage;
