import React from 'react';
import {
  Box,
  Typography,
  Drawer,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import ShelterFilterPanel from './ShelterFilterPanel';
import type { ShelterFilterDto } from '../../../app/models/shelter';

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: ShelterFilterDto;
  onFilterChange: (filterKey: keyof ShelterFilterDto, value: string | number | boolean | undefined) => void;
  onClearFilters: () => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Fixed Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        flexShrink: 0
      }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Scrollable Content */}
      <Box sx={{ 
        overflow: 'auto', 
        flexGrow: 1,
        pb: 2
      }}>
        <ShelterFilterPanel
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
        />
      </Box>
    </Drawer>
  );
};

export default MobileFilterDrawer;
