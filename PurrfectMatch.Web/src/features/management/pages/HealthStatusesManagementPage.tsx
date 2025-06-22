import React from 'react';
import { toast } from 'react-toastify';
import AttributeManagementPage, { BaseAttribute } from '../components/AttributeManagementPage';
import {
  useFetchAllHealthStatusesQuery,
  useCreateHealthStatusMutation,
  useUpdateHealthStatusMutation,
  useDeleteHealthStatusMutation,
} from '../api/petAttributesApi';
import { HealthStatusDto } from '../../../app/models/PetAttributes';

// Extend the base attribute interface for Health Statuses
interface HealthStatusAttribute extends BaseAttribute {
  id: number;
  name: string;
}

const HealthStatusesManagementPage: React.FC = () => {
  const {
    data: healthStatusesData,
    isLoading,
    error,
    refetch,
  } = useFetchAllHealthStatusesQuery();

  const [createHealthStatus, { isLoading: createLoading }] = useCreateHealthStatusMutation();
  const [updateHealthStatus, { isLoading: updateLoading }] = useUpdateHealthStatusMutation();
  const [deleteHealthStatus, { isLoading: deleteLoading }] = useDeleteHealthStatusMutation();

  // Transform API data to match our interface
  const transformedData: HealthStatusAttribute[] | undefined = healthStatusesData?.map((healthStatus: HealthStatusDto) => ({
    id: healthStatus.healthStatusId,
    name: healthStatus.status,
  }));

  const handleCreate = async (data: { name: string }) => {
    try {
      await createHealthStatus({ status: data.name }).unwrap();
      toast.success('Health status created successfully');
    } catch (error) {
      toast.error('Failed to create health status');
      console.error('Error creating health status:', error);
    }
  };

  const handleUpdate = async (id: number, data: { name: string }) => {
    try {
      await updateHealthStatus({ healthStatusId: id, status: data.name }).unwrap();
      toast.success('Health status updated successfully');
    } catch (error) {
      toast.error('Failed to update health status');
      console.error('Error updating health status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteHealthStatus(id).unwrap();
      toast.success('Health status deleted successfully');
    } catch (error) {
      toast.error('Failed to delete health status');
      console.error('Error deleting health status:', error);
    }
  };

  const validateForm = (data: { name: string }) => {
    if (!data.name.trim()) {
      return 'Health status is required';
    }
    if (data.name.length < 2) {
      return 'Health status must be at least 2 characters long';
    }
    if (data.name.length > 50) {
      return 'Health status must be less than 50 characters';
    }
    return null;
  };

  return (
    <AttributeManagementPage<HealthStatusAttribute>
      title="Health Statuses Management"
      subtitle="Manage pet health statuses in the system"
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

export default HealthStatusesManagementPage;
