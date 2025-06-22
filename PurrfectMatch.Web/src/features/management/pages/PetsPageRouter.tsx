import React from 'react';
import { useUserInfoQuery } from '../../account/accountApi';
import AllPetsPage from './AllPetsPage';
import ShelterPetManagementPage from './ShelterPetManagementPage';
import { CircularProgress, Box } from '@mui/material';

/**
 * Smart component that renders the appropriate pets page based on user role:
 * - Admin users see AllPetsPage (all pets across all shelters)
 * - Shelter Manager users see ShelterPetManagementPage (only their shelter's pets)
 */
const PetsPageRouter: React.FC = () => {
  const { data: user, isLoading } = useUserInfoQuery();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Determine user role - priority: Admin > ShelterManager
  const getUserRole = (): 'Admin' | 'ShelterManager' => {
    if (!user?.roles) return 'Admin';
    
    if (user.roles.includes('Admin')) return 'Admin';
    if (user.roles.includes('ShelterManager')) return 'ShelterManager';
    
    return 'Admin'; // Fallback
  };

  const userRole = getUserRole();

  // Render appropriate component based on role
  if (userRole === 'ShelterManager') {
    return <ShelterPetManagementPage />;
  }

  // Default to admin view (all pets)
  return <AllPetsPage />;
};

export default PetsPageRouter;
