import React from 'react';
import { toast } from 'react-toastify';
import AttributeManagementPage, { BaseAttribute } from '../components/AttributeManagementPage';
import {
  useFetchAllActivityLevelsQuery,
  useCreateActivityLevelMutation,
  useUpdateActivityLevelMutation,
  useDeleteActivityLevelMutation,
} from '../api/petAttributesApi';
import { ActivityLevelDto } from '../../../app/models/PetAttributes';

// Extend the base attribute interface for Activity Levels
interface ActivityLevelAttribute extends BaseAttribute {
  id: number;
  name: string;
}

const ActivityLevelsManagementPage: React.FC = () => {
  const {
    data: activityLevelsData,
    isLoading,
    error,
    refetch,
  } = useFetchAllActivityLevelsQuery();

  const [createActivityLevel, { isLoading: createLoading }] = useCreateActivityLevelMutation();
  const [updateActivityLevel, { isLoading: updateLoading }] = useUpdateActivityLevelMutation();
  const [deleteActivityLevel, { isLoading: deleteLoading }] = useDeleteActivityLevelMutation();

  // Transform API data to match our interface
  const transformedData: ActivityLevelAttribute[] | undefined = activityLevelsData?.map((activityLevel: ActivityLevelDto) => ({
    id: activityLevel.activityLevelId,
    name: activityLevel.activity,
  }));

  const handleCreate = async (data: { name: string }) => {
    try {
      await createActivityLevel({ activity: data.name }).unwrap();
      toast.success('Activity level created successfully');
    } catch (error) {
      toast.error('Failed to create activity level');
      console.error('Error creating activity level:', error);
    }
  };

  const handleUpdate = async (id: number, data: { name: string }) => {
    try {
      await updateActivityLevel({ activityLevelId: id, activity: data.name }).unwrap();
      toast.success('Activity level updated successfully');
    } catch (error) {
      toast.error('Failed to update activity level');
      console.error('Error updating activity level:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteActivityLevel(id).unwrap();
      toast.success('Activity level deleted successfully');
    } catch (error) {
      toast.error('Failed to delete activity level');
      console.error('Error deleting activity level:', error);
    }
  };

  const validateForm = (data: { name: string }) => {
    if (!data.name.trim()) {
      return 'Activity level is required';
    }
    if (data.name.length < 2) {
      return 'Activity level must be at least 2 characters long';
    }
    if (data.name.length > 30) {
      return 'Activity level must be less than 30 characters';
    }
    return null;
  };

  return (
    <AttributeManagementPage<ActivityLevelAttribute>
      title="Activity Levels Management"
      subtitle="Manage pet activity levels in the system"
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

export default ActivityLevelsManagementPage;
