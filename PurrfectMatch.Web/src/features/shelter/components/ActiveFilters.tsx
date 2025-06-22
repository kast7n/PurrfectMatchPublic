import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import type { ShelterFilterDto } from '../../../app/models/shelter';

interface ActiveFiltersProps {
  filters: ShelterFilterDto;
  onFilterChange: (filterKey: keyof ShelterFilterDto, value: string | number | boolean | undefined) => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const getActiveFilterChips = () => {
    const chips = [];

    if (filters.name) {
      chips.push({
        label: `Name: ${filters.name}`,
        onDelete: () => onFilterChange('name', undefined),
      });
    }

    if (filters.city) {
      chips.push({
        label: `City: ${filters.city}`,
        onDelete: () => onFilterChange('city', undefined),
      });
    }

    if (filters.state) {
      chips.push({
        label: `State: ${filters.state}`,
        onDelete: () => onFilterChange('state', undefined),
      });
    }

    if (filters.email) {
      chips.push({
        label: `Email: ${filters.email}`,
        onDelete: () => onFilterChange('email', undefined),
      });
    }

    return chips;
  };

  const activeFilterChips = getActiveFilterChips();

  if (activeFilterChips.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Active Filters:
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {activeFilterChips.map((chip, index) => (
          <Chip
            key={index}
            label={chip.label}
            onDelete={chip.onDelete}
            color="primary"
            variant="outlined"
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default ActiveFilters;
