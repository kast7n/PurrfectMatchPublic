import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { ShelterFilterDto } from '../../../app/models/shelter';

interface ShelterFilterPanelProps {
  filters: ShelterFilterDto;
  onFilterChange: (filterKey: keyof ShelterFilterDto, value: string | number | boolean | undefined) => void;
  onClearFilters: () => void;
}

const ShelterFilterPanel: React.FC<ShelterFilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Debounced input state for search fields
  const [searchInputs, setSearchInputs] = useState({
    name: filters.name || '',
    city: filters.city || '',
    state: filters.state || '',
    email: filters.email || '',
  });
  // Sync search inputs with filters when filters change from external sources (like URL)
  useEffect(() => {
    setSearchInputs({
      name: filters.name || '',
      city: filters.city || '',
      state: filters.state || '',
      email: filters.email || '',
    });
  }, [filters.name, filters.city, filters.state, filters.email]);

  // Handle input changes (just update local state, don't filter yet)
  const handleSearchInputChange = useCallback((field: keyof typeof searchInputs, value: string) => {
    setSearchInputs(prev => ({ ...prev, [field]: value }));
  }, []);
  // Handle Enter key press to trigger filtering
  const handleKeyPress = useCallback((field: keyof typeof searchInputs, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      const value = searchInputs[field];
      onFilterChange(field as keyof ShelterFilterDto, value || undefined);
    }
  }, [searchInputs, onFilterChange]);

  // Apply all current search inputs to filters
  const applyAllFilters = useCallback(() => {
    onFilterChange('name', searchInputs.name || undefined);
    onFilterChange('city', searchInputs.city || undefined);
    onFilterChange('state', searchInputs.state || undefined);
    onFilterChange('email', searchInputs.email || undefined);
  }, [searchInputs, onFilterChange]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.name) count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.email) count++;
    return count;
  };
  const clearFilters = () => {
    setSearchInputs({
      name: '',
      city: '',
      state: '',
      email: '',
    });
    
    onClearFilters();
  };

  const FilterContent = () => (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {/* Filter Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Filters
          {getActiveFilterCount() > 0 && (
            <Chip 
              label={getActiveFilterCount()} 
              size="small" 
              color="primary" 
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        {getActiveFilterCount() > 0 && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            color="secondary"
          >
            Clear All
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {/* Search Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Search
          </Typography>
        </Grid>
          {/* Name Filter */}
        <Grid item xs={12}>          <TextField
            fullWidth
            size="small"
            label="Shelter Name (Press Enter to search)"
            value={searchInputs.name}
            onChange={(e) => handleSearchInputChange('name', e.target.value)}
            onKeyDown={(e) => handleKeyPress('name', e)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Grid>

        {/* Location Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1, mt: 2 }}>
            Location
          </Typography>
        </Grid>
          {/* City Filter */}
        <Grid item xs={12}>          <TextField
            fullWidth
            size="small"
            label="City (Press Enter to search)"
            value={searchInputs.city}
            onChange={(e) => handleSearchInputChange('city', e.target.value)}
            onKeyDown={(e) => handleKeyPress('city', e)}
          />
        </Grid>
        
        {/* State Filter */}
        <Grid item xs={12}>          <TextField
            fullWidth
            size="small"
            label="State (Press Enter to search)"            value={searchInputs.state}
            onChange={(e) => handleSearchInputChange('state', e.target.value)}
            onKeyDown={(e) => handleKeyPress('state', e)}
          />
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1, mt: 2 }}>
            Contact
          </Typography>
        </Grid>
          {/* Email Filter */}
        <Grid item xs={12}>          <TextField
            fullWidth
            size="small"
            label="Email (Press Enter to search)"
            value={searchInputs.email}
            onChange={(e) => handleSearchInputChange('email', e.target.value)}
            onKeyDown={(e) => handleKeyPress('email', e)}
          />
        </Grid>

        {/* Search Button */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={applyAllFilters}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Grid>

        {/* Sorting Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1, mt: 2 }}>
            Sort By
          </Typography>
        </Grid>

        {/* Sort By Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy || 'name'}
              label="Sort By"
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="city">City</MenuItem>
              <MenuItem value="state">State</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort Direction Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort Order</InputLabel>
            <Select
              value={filters.sortDescending ? 'desc' : 'asc'}
              label="Sort Order"
              onChange={(e) => onFilterChange('sortDescending', e.target.value === 'desc')}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  // For mobile, return just the content without the Card wrapper
  if (isMobile) {
    return <FilterContent />;
  }

  // For desktop, wrap in a Card with sticky positioning
  return (
    <Card sx={{ position: 'sticky', top: 20 }}>
      <CardContent sx={{ p: 0 }}>
        <FilterContent />
      </CardContent>
    </Card>
  );
};

export default ShelterFilterPanel;
