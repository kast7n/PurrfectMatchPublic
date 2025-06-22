import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  ToggleButtonGroup, 
  ToggleButton, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Button, 
  styled, 
  Paper,
  Chip,
  InputAdornment,
  Collapse,
  CircularProgress,
  alpha,
  useTheme,
  useMediaQuery,
  Badge,
  Autocomplete,
  Tabs,
  Tab,
  Box as MuiBox
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { motion } from 'framer-motion';
import { PetFilterDto } from '../../app/models/pet';
import { Shelter } from '../../app/models/shelter';
import { 
  useFetchSpeciesQuery, 
  useFetchBreedsQuery, 
  useFetchColorsQuery, 
  useFetchCoatLengthsQuery, 
  useFetchActivityLevelsQuery, 
  useFetchHealthStatusesQuery
} from '../pet/filterOptionsApi';
import { useFetchFilteredSheltersQuery } from '../shelter/shelterApi';
import { useNavigate } from 'react-router-dom';

// Styled components for the search filters section
const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0,0,0,0.15)'
    : '0 8px 32px rgba(255, 107, 107, 0.08)',
  background: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.8)
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    zIndex: 1,
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(3),
  fontWeight: 700,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main,
  },
}));

const PetToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0.5),
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.2s ease-in-out',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    border: `2px solid ${theme.palette.primary.main}`,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    transform: 'translateY(-2px)',
  },
  '&.Mui-selected:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const GenderToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0.5),
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.2s ease-in-out',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    border: `2px solid ${theme.palette.primary.main}`,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    transform: 'translateY(-2px)',
  },
  '&.Mui-selected:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 16,
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&.MuiChip-colorPrimary': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  '&:active': {
    transform: 'translateY(0)',
  }
}));

const RoundedTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }
  },
  '& .MuiInputLabel-root': {
    transition: 'all 0.2s ease-in-out',
  }
}));

const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 16px rgba(0,0,0,0.3)'
    : '0 8px 16px rgba(229,115,115,0.3)',
  background: 'linear-gradient(45deg, #e57373 30%, #f48fb1 90%)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #d32f2f 30%, #f06292 90%)',
    transform: 'translateY(-3px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 20px rgba(0,0,0,0.4)'
      : '0 12px 20px rgba(229,115,115,0.4)',
  },
  '&:active': {
    transform: 'translateY(-1px)',
  }
}));

// Common select menu props for better UX with dropdowns
const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: 300,
      width: 'auto',
      overflow: 'auto',
    },
  },
  // Enable keyboard navigation
  autoFocus: true,
  // Support typing to search (make sure it doesn't auto focus first item for better typing experience)
  disableAutoFocusItem: true,
  // Improves keyboard accessibility
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
  },
  // Prevent menu from closing immediately when selecting option
  keepMounted: true
};

// Main component implementation with API integration
export default function SearchFilters() {
  // Theme setup
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDarkMode = theme.palette.mode === 'dark';

  // States for filter data
  const [loading, setLoading] = useState({
    species: false,
    breeds: false,
    colors: false, 
    coatLengths: false,
    activityLevels: false,
    healthStatuses: false,
    shelters: false
  });
  
  // States for dropdown options
  const [speciesOptions, setSpeciesOptions] = useState<{id: number, name: string}[]>([]);
  const [breedOptions, setBreedOptions] = useState<{id: number, name: string}[]>([]);
  const [colorOptions, setColorOptions] = useState<{id: number, name: string}[]>([]);
  const [coatLengthOptions, setCoatLengthOptions] = useState<{id: number, name: string}[]>([]);
  const [activityLevelOptions, setActivityLevelOptions] = useState<{id: number, name: string}[]>([]);
  const [healthStatusOptions, setHealthStatusOptions] = useState<{id: number, name: string}[]>([]);
  const [shelterOptions, setShelterOptions] = useState<{id: number, name: string}[]>([]);
    // States for filter values
  const [petFilter, setPetFilter] = useState<PetFilterDto>({
    isAdopted: false, // Default to show only pets available for adoption
    pageNumber: 1,
    pageSize: 12
  });
    // UI control states
  const [showAdvanced, setShowAdvanced] = useState(false);  const [searchTermValue, setSearchTermValue] = useState('');
  const [selectedGoodWith, setSelectedGoodWith] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // API Query hooks
  const { data: speciesData, isLoading: isSpeciesLoading } = useFetchSpeciesQuery();
  const { data: breedsData, isLoading: isBreedsLoading } = useFetchBreedsQuery(
    petFilter.speciesId
      ? { breedId: 0, speciesId: petFilter.speciesId, name: "" }
      : undefined
  );
  const { data: colorsData, isLoading: isColorsLoading } = useFetchColorsQuery();
  const { data: coatLengthsData, isLoading: isCoatLengthsLoading } = useFetchCoatLengthsQuery();
  const { data: activityLevelsData, isLoading: isActivityLevelsLoading } = useFetchActivityLevelsQuery();
  const { data: healthStatusesData, isLoading: isHealthStatusesLoading } = useFetchHealthStatusesQuery();
  const { data: sheltersData, isLoading: isSheltersLoading } = useFetchFilteredSheltersQuery(undefined);
  // Update options when data is loaded from API
  useEffect(() => {
    // Use predefined species regardless of API data to ensure consistent IDs
    setSpeciesOptions([
      { id: 1, name: 'Dog' },
      { id: 2, name: 'Cat' },
      { id: 3, name: 'Bird' },
      { id: 4, name: 'Rabbit' },
      { id: 5, name: 'Fish' }
    ]);
    
    if (breedsData && !isBreedsLoading) {
      setBreedOptions(breedsData.filter(breed => breed.breedId && breed.name).map(breed => ({ id: breed.breedId, name: breed.name })));
    }
    
    if (colorsData && !isColorsLoading) {
      setColorOptions(colorsData.map(color => ({ id: color.colorId, name: color.color1 })));
    }
    
    if (coatLengthsData && !isCoatLengthsLoading) {
      setCoatLengthOptions(coatLengthsData.map(length => ({ id: length.coatLengthId, name: length.length })));
    }
    
    if (activityLevelsData && !isActivityLevelsLoading) {
      setActivityLevelOptions(activityLevelsData.map(level => ({ id: level.activityLevelId, name: level.activity })));
    }
    
    if (healthStatusesData && !isHealthStatusesLoading) {
      setHealthStatusOptions(healthStatusesData.map(status => ({ id: status.healthStatusId, name: status.status })));
    }    if (sheltersData?.items && !isSheltersLoading) {
      setShelterOptions(sheltersData.items.map((shelter: Shelter) => ({ id: shelter.shelterId, name: shelter.name })));
    }
    
    // Update loading states
    setLoading({
      species: isSpeciesLoading,
      breeds: isBreedsLoading,
      colors: isColorsLoading,
      coatLengths: isCoatLengthsLoading,
      activityLevels: isActivityLevelsLoading,
      healthStatuses: isHealthStatusesLoading,
      shelters: isSheltersLoading
    });
  }, [
    speciesData, isSpeciesLoading,
    breedsData, isBreedsLoading,
    colorsData, isColorsLoading,
    coatLengthsData, isCoatLengthsLoading,
    activityLevelsData, isActivityLevelsLoading,
    healthStatusesData, isHealthStatusesLoading,
    sheltersData, isSheltersLoading
  ]);
  // Filter change handlers
  const handleFilterChange = (key: keyof PetFilterDto, value: unknown) => {
    setPetFilter({
      ...petFilter,
      [key]: value
    });
  };  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTermValue(value);
    // Don't filter automatically, wait for Enter key
  };
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      handleFilterChange('name', searchTermValue || undefined);
    }
  };

  const handleSearchButtonClick = () => {
    handleFilterChange('name', searchTermValue || undefined);
  };
  
  const handleGenderChange = (_event: React.MouseEvent<HTMLElement>, gender: string | null) => {
    if (gender !== null) {
      handleFilterChange('gender', gender);
    }  };
  
  const handleGoodWithToggle = (value: string) => {
    const newGoodWith = selectedGoodWith.includes(value)
      ? selectedGoodWith.filter(item => item !== value)
      : [...selectedGoodWith, value];
    
    setSelectedGoodWith(newGoodWith);
    handleFilterChange('goodWith', newGoodWith.length > 0 ? newGoodWith : undefined);
  };
  
  const handleMicrochippedToggle = () => {
    handleFilterChange('microchipped', !petFilter.microchipped);
  };
  
  const handleResetFilters = () => {
    setPetFilter({
      isAdopted: false,
      pageNumber: 1,
      pageSize: 12
    });    setSearchTermValue('');
    setSelectedGoodWith([]);
  };
  
  // Navigation hook
  const navigate = useNavigate();
  
  const handleSubmitSearch = () => {
    // Log for debugging
    console.log('Filter submitted:', petFilter);
    
    // Navigate to pets page with the filter
    navigate('/pets', { state: { filter: petFilter } });
  };

  // Render the advanced filter UI with tabs
  const renderAdvancedFilters = () => (
    <Collapse in={showAdvanced}>
      <Box 
        sx={{ 
          mb: 3, 
          p: isMobile ? 1.5 : 3, 
          bgcolor: isDarkMode 
            ? alpha(theme.palette.background.paper, 0.4) 
            : 'rgba(250,240,245,0.5)', 
          borderRadius: 3,
          border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
          width: '100%',
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile
          sx={{
            mb: isMobile ? 2 : 3,
            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            minHeight: isMobile ? 36 : 48,
            '.MuiTab-root': {
              fontWeight: 600,
              borderRadius: 2,
              minWidth: isMobile ? 90 : 120,
              fontSize: isMobile ? '0.95rem' : '1rem',
              color: isDarkMode ? theme.palette.grey[300] : theme.palette.primary.dark,
              px: isMobile ? 1.5 : 2.5,
              py: isMobile ? 0.5 : 1,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                background: isDarkMode ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.08),
              },
            },
            '.MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 4,
              borderRadius: 2,
            },
          }}
        >
          <Tab label="General" />
          <Tab label="Health & Needs" />
          <Tab label="Activity & Temperament" />
          <Tab label="Appearance" />
        </Tabs>
        {/* Tab Panels - add mobile-friendly spacing */}
        <MuiBox hidden={activeTab !== 0} sx={{ pt: 1, px: isMobile ? 0 : 1 }}>
          {/* General Tab: Breed, Gender, Size, Shelter */}
          {/* Breed Selection - Only visible when a species is selected */}
          {petFilter.speciesId && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 600,
                color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
              }}>
                <Badge 
                  variant="dot" 
                  color="secondary" 
                  invisible={!petFilter.breedId}
                  sx={{ mr: 1 }}
                >
                  Breed:
                </Badge>
              </Typography>
              <Autocomplete
                fullWidth
                size="small"
                options={breedOptions}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                value={petFilter.breedId ? breedOptions.find(breed => breed.id === petFilter.breedId) || null : null}
                onChange={(_, newValue) => {
                  handleFilterChange('breedId', newValue ? newValue.id : undefined);
                }}
                loading={loading.breeds}
                loadingText="Loading breeds..."
                noOptionsText="No breeds found"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Breed"
                    variant="outlined"
                    sx={{ 
                      borderRadius: 16,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 16,
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading.breeds ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                sx={{ mb: 2 }}
              />
            </Box>
          )}
          {/* Gender Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              <Badge 
                variant="dot" 
                color="secondary" 
                invisible={!petFilter.gender}
                sx={{ mr: 1 }}
              >
                Gender:
              </Badge>
            </Typography>
            <ToggleButtonGroup
              value={petFilter.gender || null}
              exclusive
              onChange={handleGenderChange}
              aria-label="pet gender"
              sx={{ display: 'flex', flexWrap: 'wrap' }}
            >
              <GenderToggleButton value="Male" aria-label="male">
                <MaleIcon sx={{ mr: 1 }} /> Male
              </GenderToggleButton>
              <GenderToggleButton value="Female" aria-label="female">
                <FemaleIcon sx={{ mr: 1 }} /> Female
              </GenderToggleButton>
            </ToggleButtonGroup>
          </Box>
          {/* Size Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              <Badge 
                variant="dot" 
                color="secondary" 
                invisible={!petFilter.size}
                sx={{ mr: 1 }}
              >
                Size:
              </Badge>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['Small', 'Medium', 'Large'].map((size) => (
                <FilterChip 
                  key={size}
                  label={size} 
                  onClick={() => handleFilterChange('size', petFilter.size === size ? undefined : size)}
                  variant={petFilter.size === size ? 'filled' : 'outlined'}
                  color={petFilter.size === size ? 'primary' : 'default'}
                  deleteIcon={petFilter.size === size ? <ClearIcon /> : undefined}
                  onDelete={petFilter.size === size ? () => handleFilterChange('size', undefined) : undefined}
                />
              ))}
            </Box>
          </Box>
          {/* Shelter Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              <Badge 
                variant="dot" 
                color="secondary" 
                invisible={!petFilter.shelterId}
                sx={{ mr: 1 }}
              >
                Shelter:
              </Badge>
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={shelterOptions}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={petFilter.shelterId ? shelterOptions.find(shelter => shelter.id === petFilter.shelterId) || null : null}
              onChange={(_, newValue) => {
                handleFilterChange('shelterId', newValue ? newValue.id : undefined);
              }}
              loading={loading.shelters}
              loadingText="Loading shelters..."
              noOptionsText="No shelters found"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Shelter"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 16,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 16,
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading.shelters ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ mb: 2 }}
            />
          </Box>
        </MuiBox>
        <MuiBox hidden={activeTab !== 1} sx={{ pt: 1, px: isMobile ? 0 : 1 }}>
          {/* Health & Needs Tab: Health Status, Microchipped, Special Needs (placeholder) */}
          {/* Health Status */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              <Badge 
                variant="dot" 
                color="secondary" 
                invisible={!petFilter.healthStatusId}
                sx={{ mr: 1 }}
              >
                Health Status:
              </Badge>
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={healthStatusOptions}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={petFilter.healthStatusId ? healthStatusOptions.find(status => status.id === petFilter.healthStatusId) || null : null}
              onChange={(_, newValue) => {
                handleFilterChange('healthStatusId', newValue ? newValue.id : undefined);
              }}
              loading={loading.healthStatuses}
              loadingText="Loading health statuses..."
              noOptionsText="No health statuses found"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Health Status"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 16,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 16,
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading.healthStatuses ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ mb: 2 }}
            />
          </Box>
          {/* Microchipped Toggle */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              Additional:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <FilterChip 
                label="Microchipped" 
                onClick={handleMicrochippedToggle}
                variant={petFilter.microchipped ? 'filled' : 'outlined'}
                color={petFilter.microchipped ? 'primary' : 'default'}
                deleteIcon={petFilter.microchipped ? <ClearIcon /> : undefined}
                onDelete={petFilter.microchipped ? handleMicrochippedToggle : undefined}
              />
              {/* Placeholder for Special Needs */}
              <FilterChip 
                label="Special Needs" 
                disabled
                variant="outlined"
                color="default"
                sx={{ opacity: 0.5 }}
              />
            </Box>
          </Box>
        </MuiBox>
        <MuiBox hidden={activeTab !== 2} sx={{ pt: 1, px: isMobile ? 0 : 1 }}>
          {/* Activity & Temperament Tab: Activity Level, Good With */}
          {/* Activity Level */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              <Badge 
                variant="dot" 
                color="secondary" 
                invisible={!petFilter.activityLevelId}
                sx={{ mr: 1 }}
              >
                Activity Level:
              </Badge>
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={activityLevelOptions}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={petFilter.activityLevelId ? activityLevelOptions.find(level => level.id === petFilter.activityLevelId) || null : null}
              onChange={(_, newValue) => {
                handleFilterChange('activityLevelId', newValue ? newValue.id : undefined);
              }}
              loading={loading.activityLevels}
              loadingText="Loading activity levels..."
              noOptionsText="No activity levels found"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Activity Level"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 16,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 16,
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading.activityLevels ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ mb: 2 }}
            />
          </Box>
          {/* Good With Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              <Badge 
                variant="dot" 
                color="secondary" 
                invisible={selectedGoodWith.length === 0}
                sx={{ mr: 1 }}
              >
                Good with:
              </Badge>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['Kids', 'Dogs', 'Cats', 'Elderly'].map((companion) => (
                <FilterChip 
                  key={companion}
                  label={companion} 
                  onClick={() => handleGoodWithToggle(companion)}
                  variant={selectedGoodWith.includes(companion) ? 'filled' : 'outlined'}
                  color={selectedGoodWith.includes(companion) ? 'primary' : 'default'}
                  deleteIcon={selectedGoodWith.includes(companion) ? <ClearIcon /> : undefined}
                  onDelete={selectedGoodWith.includes(companion) ? () => handleGoodWithToggle(companion) : undefined}
                />
              ))}
            </Box>
          </Box>
        </MuiBox>
        <MuiBox hidden={activeTab !== 3} sx={{ pt: 1, px: isMobile ? 0 : 1 }}>
          {/* Appearance Tab: Coat Length, Color */}
          {/* Coat Length */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              <Badge 
                variant="dot" 
                color="secondary" 
                invisible={!petFilter.coatLengthId}
                sx={{ mr: 1 }}
              >
                Coat Length:
              </Badge>
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={coatLengthOptions}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={petFilter.coatLengthId ? coatLengthOptions.find(length => length.id === petFilter.coatLengthId) || null : null}
              onChange={(_, newValue) => {
                handleFilterChange('coatLengthId', newValue ? newValue.id : undefined);
              }}
              loading={loading.coatLengths}
              loadingText="Loading coat lengths..."
              noOptionsText="No coat lengths found"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Coat Length"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 16,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 16,
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading.coatLengths ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ mb: 2 }}
            />
          </Box>
          {/* Color */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              <Badge 
                variant="dot" 
                color="secondary" 
                invisible={!petFilter.colorId}
                sx={{ mr: 1 }}
              >
                Color:
              </Badge>
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={colorOptions}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={petFilter.colorId ? colorOptions.find(color => color.id === petFilter.colorId) || null : null}
              onChange={(_, newValue) => {
                handleFilterChange('colorId', newValue ? newValue.id : undefined);
              }}
              loading={loading.colors}
              loadingText="Loading colors..."
              noOptionsText="No colors found"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Color"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 16,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 16,
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading.colors ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ mb: 2 }}
            />
          </Box>
        </MuiBox>
      </Box>
    </Collapse>
  );

  // Main component render
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <FilterContainer>
        {/* Animated pet paw print decorations */}
        <Box sx={{ 
          position: 'absolute', 
          top: 20, 
          right: 30, 
          opacity: 0.1,
          transform: 'rotate(15deg)',
          fontSize: 32
        }}>
          🐾
        </Box>
        <Box sx={{ 
          position: 'absolute', 
          bottom: 30, 
          left: 20, 
          opacity: 0.1,
          transform: 'rotate(-15deg)',
          fontSize: 32
        }}>
          🐾
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <SectionTitle variant="h4" as="h2" sx={{ mb: 0 }}>
            Find Your Perfect Companion
          </SectionTitle>
          {/* Wrap the button in a Box for margin-left spacing */}
          <Box sx={{ ml: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleResetFilters}
              sx={{ 
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'none',
                py: 0.7,
                px: 2.5,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 16px rgba(0,0,0,0.25)'
                  : '0 4px 16px rgba(229,115,115,0.18)',
                transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
                '&:hover': {
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 24px rgba(0,0,0,0.35)'
                    : '0 8px 24px rgba(229,115,115,0.28)',
                  transform: 'translateY(-2px) scale(1.04)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                minWidth: 120,
                letterSpacing: 0.5,
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ 
          mb: 4, 
          fontWeight: 500, 
          color: 'text.secondary',
          maxWidth: '700px',
          fontStyle: 'italic'
        }}>
          Looking for a playful friend or a cuddle buddy? Our furry companions are waiting for their forever home with you.
        </Typography>
        
        {/* Main Search Bar */}        <Box sx={{ mb: 4, position: 'relative' }}>
          <RoundedTextField
            fullWidth
            label="Search"
            placeholder="Search by pet name, breed, or keywords (Press Enter to search)"
            variant="outlined"
            value={searchTermValue}            onChange={handleSearchTermChange}
            onKeyDown={handleSearchKeyPress}            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSearchButtonClick}
                    sx={{ mr: -1 }}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          
   
        </Box>
        
        {/* Species Selection */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600
          }}>
            <PetsIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> 
            <Badge 
              variant="dot" 
              color="secondary" 
              invisible={!petFilter.speciesId}
              sx={{ mr: 1 }}
            >
              I'm looking for a:
            </Badge>
          </Typography>
          
          <ToggleButtonGroup
            value={petFilter.speciesId ?? 'all'}
            exclusive
            onChange={(_event, speciesId) => {
              if (speciesId !== null) {
                setPetFilter((prevFilter) => ({
                  ...prevFilter,
                  speciesId: speciesId === 'all' ? undefined : speciesId,
                  breedId: undefined, // Reset breed when species changes
                }));
              }
            }}
            aria-label="pet species"
            sx={{ display: 'flex', flexWrap: 'wrap' }}
          >
            {loading.species ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                <PetToggleButton value="all" aria-label="all pets">
                  <PetsIcon sx={{ mr: 1 }} /> All Pets
                </PetToggleButton>
                <PetToggleButton value={1} aria-label="dog">
                  <span role="img" aria-label="dog" style={{ fontSize: '1.2rem', marginRight: '8px' }}>🐶</span> Dog
                </PetToggleButton>
                <PetToggleButton value={2} aria-label="cat">
                  <span role="img" aria-label="cat" style={{ fontSize: '1.2rem', marginRight: '8px' }}>🐱</span> Cat
                </PetToggleButton>
                <PetToggleButton value={3} aria-label="bird">
                  <span role="img" aria-label="bird" style={{ fontSize: '1.2rem', marginRight: '8px' }}>🦜</span> Bird
                </PetToggleButton>
                <PetToggleButton value={4} aria-label="rabbit">
                  <span role="img" aria-label="rabbit" style={{ fontSize: '1.2rem', marginRight: '8px' }}>🐰</span> Rabbit
                </PetToggleButton>
                <PetToggleButton value={5} aria-label="fish">
                  <span role="img" aria-label="fish" style={{ fontSize: '1.2rem', marginRight: '8px' }}>🐠</span> Fish
                </PetToggleButton>
              </Box>
            )}
          </ToggleButtonGroup>        </Box>
        
        {/* Location Search */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="subtitle1" sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600,
            minWidth: isMobile ? '100%' : 'auto'
          }}>
            <LocationOnIcon color="primary" sx={{ mr: 1 }} />
            <Badge 
              variant="dot" 
              color="secondary" 
              invisible={!petFilter.city && !petFilter.radiusKm}
              sx={{ mr: 1 }}
            >
              Location:
            </Badge>
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
            gap: 2,
            flexWrap: isMobile ? 'wrap' : 'nowrap'
          }}>
            <RoundedTextField
              label="City, State, or Zip"
              placeholder="Enter location"
              variant="outlined"
              size="small"
              value={petFilter.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
              sx={{ flexGrow: 1, minWidth: isMobile ? '100%' : '60%' }}
            />
            <FormControl 
              variant="outlined" 
              size="small" 
              sx={{ 
                width: isMobile ? '100%' : '40%',
                minWidth: isMobile ? '100%' : '150px'
              }}
            >
              <InputLabel>Distance</InputLabel>
              <Select
                label="Distance"
                value={petFilter.radiusKm || 0}
                onChange={(e) => handleFilterChange('radiusKm', e.target.value || undefined)}
                sx={{ borderRadius: 16 }}
                MenuProps={MENU_PROPS}
              >
                <MenuItem value={0}>Any distance</MenuItem>
                <MenuItem value={10}>10 miles</MenuItem>
                <MenuItem value={25}>25 miles</MenuItem>
                <MenuItem value={50}>50 miles</MenuItem>
                <MenuItem value={100}>100 miles</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        {/* Advanced Filters Toggle */}
        <Box sx={{
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}>
          {/* Quick filter indicators */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', mb: 1 }}>
            {petFilter.speciesId && (
              <Chip 
                size="small" 
                color="primary" 
                variant="outlined"
                label={speciesOptions.find(s => s.id === petFilter.speciesId)?.name || 'Species'}
                sx={{ m: 0.5 }}
              />
            )}
            {petFilter.breedId && (
              <Chip 
                size="small" 
                color="primary" 
                variant="outlined"
                label={breedOptions.find(b => b.id === petFilter.breedId)?.name || 'Breed'}
                sx={{ m: 0.5 }}
              />            )}
            {petFilter.city && (
              <Chip 
                size="small" 
                color="primary" 
                variant="outlined"
                label={petFilter.city}
                sx={{ m: 0.5 }}
              />
            )}
          </Box>
          {/* Centered More Filters Button with Filters label inside */}
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            startIcon={
              <motion.span
                animate={{ rotate: showAdvanced ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                {showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </motion.span>
            }
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              borderRadius: 999,
              fontWeight: 700,
              fontSize: isMobile ? '0.95rem' : '1rem',
              px: isMobile ? 2 : 3,
              py: isMobile ? 1 : 1.2,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 16px rgba(0,0,0,0.25)'
                : '0 4px 16px rgba(229,115,115,0.18)',
              textTransform: 'none',
              transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
              '&:hover': {
                background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(0,0,0,0.35)'
                  : '0 8px 24px rgba(229,115,115,0.28)',
                transform: 'translateY(-2px) scale(1.04)',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
              minWidth: isMobile ? 140 : 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mt: 1,
            }}
          >
            <FilterAltIcon sx={{ mr: 1, verticalAlign: 'middle', color: theme.palette.getContrastText(theme.palette.primary.main) }} />
            {showAdvanced ? 'Less Filters' : 'Filters'}
          </Button>
        </Box>
        
        {/* Advanced Filters Section */}
        {renderAdvancedFilters()}
        
        {/* Search Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4,
          position: 'relative',
          zIndex: 1
        }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <SearchButton
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={handleSubmitSearch}
            >
              Find My Perfect Match
            </SearchButton>
          </motion.div>
        </Box>
      </FilterContainer>
    </motion.div>
  );
}