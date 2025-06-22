import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Collapse,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  Stack,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  useFetchFilteredPetsQuery
} from './petApi';
import {
  useFetchSpeciesQuery,
  useFetchBreedsQuery,
  useFetchCoatLengthsQuery,
  useFetchColorsQuery,
  useFetchActivityLevelsQuery,
  useFetchHealthStatusesQuery,
} from './filterOptionsApi';
import {useFetchFilteredSheltersQuery} from '../shelter/shelterApi';
import PetCard from './PetCard';
import type { PetFilterDto, Pet } from '../../app/models/pet';
import type { Shelter } from '../../app/models/shelter';
import type { SpeciesDto, BreedDto, CoatLengthDto, ColorDto, ActivityLevelDto, HealthStatusDto } from '../../app/models/PetAttributes';

const PETS_PER_PAGE = 12;

const PetBrowsePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();  // Filter state
  const [filters, setFilters] = useState<PetFilterDto>({
    isAdopted: false, // Default to show only pets available for adoption
    pageNumber: 1,
    pageSize: PETS_PER_PAGE,
    sortBy: 'name',
    sortDescending: false,
  });
  // UI state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [mobileFiltersExpanded, setMobileFiltersExpanded] = useState(false);

  // API queries
  const { 
    data: petsResponse, 
    isLoading: petsLoading, 
    error: petsError 
  } = useFetchFilteredPetsQuery(filters);
    const { 
    data: speciesData, 
    isLoading: speciesLoading 
  } = useFetchSpeciesQuery();
  
  const { 
    data: breedsData, 
    isLoading: breedsLoading 
  } = useFetchBreedsQuery();

  const { 
    data: coatLengthsData, 
    isLoading: coatLengthsLoading 
  } = useFetchCoatLengthsQuery();

  const { 
    data: colorsData, 
    isLoading: colorsLoading 
  } = useFetchColorsQuery();

  const { 
    data: activityLevelsData, 
    isLoading: activityLevelsLoading 
  } = useFetchActivityLevelsQuery();

  const { 
    data: healthStatusesData, 
    isLoading: healthStatusesLoading 
  } = useFetchHealthStatusesQuery();
  const { 
    data: sheltersData, 
    isLoading: sheltersLoading 
  } = useFetchFilteredSheltersQuery(undefined);  // Initialize filters from URL params and navigation state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters: Partial<PetFilterDto> = {
      pageNumber: 1,
      pageSize: PETS_PER_PAGE,
    };

    // Check if filters were passed via navigation state (from SearchFilters component)
    const stateFilter = location.state?.filter as PetFilterDto;
    if (stateFilter) {
      // Use filters from navigation state
      setFilters(prev => ({
        ...prev,
        ...stateFilter,
        pageNumber: 1,
        pageSize: PETS_PER_PAGE,
      }));
      // Clear the state to prevent reuse on refresh
      window.history.replaceState(null, '');
      return;
    }    // Parse URL parameters if no state filter
    if (searchParams.get('name')) urlFilters.name = searchParams.get('name')!;
    if (searchParams.get('species')) urlFilters.speciesId = parseInt(searchParams.get('species')!);
    if (searchParams.get('breed')) urlFilters.breedId = parseInt(searchParams.get('breed')!);
    if (searchParams.get('size')) urlFilters.size = searchParams.get('size')!;
    if (searchParams.get('gender')) urlFilters.gender = searchParams.get('gender')!;
    if (searchParams.get('coatLength')) urlFilters.coatLengthId = parseInt(searchParams.get('coatLength')!);
    if (searchParams.get('color')) urlFilters.colorId = parseInt(searchParams.get('color')!);
    if (searchParams.get('activityLevel')) urlFilters.activityLevelId = parseInt(searchParams.get('activityLevel')!);
    if (searchParams.get('healthStatus')) urlFilters.healthStatusId = parseInt(searchParams.get('healthStatus')!);
    if (searchParams.get('shelter')) urlFilters.shelterId = parseInt(searchParams.get('shelter')!);
    if (searchParams.get('city')) urlFilters.city = searchParams.get('city')!;
    if (searchParams.get('microchipped')) urlFilters.microchipped = searchParams.get('microchipped') === 'true';
    if (searchParams.get('goodWith')) {
      const goodWithString = searchParams.get('goodWith')!;
      urlFilters.goodWith = goodWithString.split(',').filter(item => item.trim() !== '');
    }
    if (searchParams.get('sortBy')) urlFilters.sortBy = searchParams.get('sortBy')!;
    if (searchParams.get('sortDescending')) urlFilters.sortDescending = searchParams.get('sortDescending') === 'true';

    setFilters(prev => ({ ...prev, ...urlFilters }));
  }, [location.search, location.state]);  // Update URL when filters change
  useEffect(() => {
    const searchParams = new URLSearchParams();    if (filters.name) searchParams.set('name', filters.name);
    if (filters.speciesId) searchParams.set('species', filters.speciesId.toString());
    if (filters.breedId) searchParams.set('breed', filters.breedId.toString());
    if (filters.size) searchParams.set('size', filters.size);
    if (filters.gender) searchParams.set('gender', filters.gender);
    if (filters.coatLengthId) searchParams.set('coatLength', filters.coatLengthId.toString());
    if (filters.colorId) searchParams.set('color', filters.colorId.toString());
    if (filters.activityLevelId) searchParams.set('activityLevel', filters.activityLevelId.toString());
    if (filters.healthStatusId) searchParams.set('healthStatus', filters.healthStatusId.toString());
    if (filters.shelterId) searchParams.set('shelter', filters.shelterId.toString());
    if (filters.city) searchParams.set('city', filters.city);
    if (filters.microchipped !== undefined) searchParams.set('microchipped', filters.microchipped.toString());
    if (filters.goodWith && filters.goodWith.length > 0) searchParams.set('goodWith', filters.goodWith.join(','));
    if (filters.sortBy && filters.sortBy !== 'name') searchParams.set('sortBy', filters.sortBy);
    if (filters.sortDescending) searchParams.set('sortDescending', filters.sortDescending.toString());

    const newSearch = searchParams.toString();
    const currentSearch = location.search.replace('?', '');
    
    if (newSearch !== currentSearch) {
      navigate(`/pets${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [filters, navigate, location.search]);  const handleFilterChange = (filterKey: keyof PetFilterDto, value: string | number | boolean | string[] | undefined) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value,
      pageNumber: 1, // Reset to first page when filters change
    }));
  };
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };  const clearFilters = () => {
    setFilters({
      isAdopted: false, // Default to show only pets available for adoption
      pageNumber: 1,
      pageSize: PETS_PER_PAGE,
      sortBy: 'name',
      sortDescending: false,
    });
  };  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.name) count++;
    if (filters.speciesId) count++;
    if (filters.breedId) count++;
    if (filters.size) count++;
    if (filters.gender) count++;
    if (filters.coatLengthId) count++;
    if (filters.colorId) count++;
    if (filters.activityLevelId) count++;
    if (filters.healthStatusId) count++;
    if (filters.shelterId) count++;
    if (filters.city) count++;
    if (filters.microchipped !== undefined) count++;
    if (filters.goodWith && filters.goodWith.length > 0) count++;
    return count;
  };const getActiveFilterChips = () => {
    const chips = [];

    if (filters.name) {
      chips.push({
        label: `Name: ${filters.name}`,
        onDelete: () => handleFilterChange('name', undefined),
      });
    }

    if (filters.speciesId && speciesData) {
      const species = speciesData.find((s: SpeciesDto) => s.speciesId === filters.speciesId);
      if (species) {
        chips.push({
          label: `Species: ${species.name}`,
          onDelete: () => handleFilterChange('speciesId', undefined),
        });
      }
    }
    
    if (filters.breedId && breedsData) {
      const breed = breedsData.find((b: BreedDto) => b.breedId === filters.breedId);
      if (breed) {
        chips.push({
          label: `Breed: ${breed.name}`,
          onDelete: () => handleFilterChange('breedId', undefined),
        });
      }
    }
    
    if (filters.size) {
      chips.push({
        label: `Size: ${filters.size}`,
        onDelete: () => handleFilterChange('size', undefined),
      });
    }
    
    if (filters.gender) {
      chips.push({
        label: `Gender: ${filters.gender}`,
        onDelete: () => handleFilterChange('gender', undefined),
      });    }
    
    if (filters.coatLengthId && coatLengthsData) {
      const coatLength = coatLengthsData.find((c: CoatLengthDto) => c.coatLengthId === filters.coatLengthId);
      if (coatLength) {
        chips.push({
          label: `Coat: ${coatLength.length}`,
          onDelete: () => handleFilterChange('coatLengthId', undefined),
        });
      }
    }

    if (filters.colorId && colorsData) {
      const color = colorsData.find((c: ColorDto) => c.colorId === filters.colorId);
      if (color) {
        chips.push({
          label: `Color: ${color.color1}`,
          onDelete: () => handleFilterChange('colorId', undefined),
        });
      }
    }

    if (filters.activityLevelId && activityLevelsData) {
      const activityLevel = activityLevelsData.find((a: ActivityLevelDto) => a.activityLevelId === filters.activityLevelId);
      if (activityLevel) {
        chips.push({
          label: `Activity: ${activityLevel.activity}`,
          onDelete: () => handleFilterChange('activityLevelId', undefined),
        });
      }
    }

    if (filters.healthStatusId && healthStatusesData) {
      const healthStatus = healthStatusesData.find((h: HealthStatusDto) => h.healthStatusId === filters.healthStatusId);
      if (healthStatus) {
        chips.push({
          label: `Health: ${healthStatus.status}`,
          onDelete: () => handleFilterChange('healthStatusId', undefined),
        });
      }
    }    if (filters.shelterId && sheltersData?.items) {
      const shelter = sheltersData.items.find((s: Shelter) => s.shelterId === filters.shelterId);
      if (shelter) {
        chips.push({
          label: `Shelter: ${shelter.name}`,
          onDelete: () => handleFilterChange('shelterId', undefined),
        });
      }    }

    if (filters.city) {
      chips.push({
        label: `City: ${filters.city}`,
        onDelete: () => handleFilterChange('city', undefined),
      });
    }

    if (filters.microchipped !== undefined) {
      chips.push({
        label: `Microchipped: ${filters.microchipped ? 'Yes' : 'No'}`,
        onDelete: () => handleFilterChange('microchipped', undefined),
      });
    }

    if (filters.goodWith && filters.goodWith.length > 0) {
      chips.push({
        label: `Good with: ${filters.goodWith.join(', ')}`,
        onDelete: () => handleFilterChange('goodWith', undefined),
      });
    }
    
    return chips;
  };

  const FilterContent = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
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
      </Box>      <Grid container spacing={2}>
        {/* Basic Filters Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Basic Information
          </Typography>
        </Grid>

        {/* Species Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Species</InputLabel>
            <Select
              value={filters.speciesId?.toString() || ''}
              label="Species"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('speciesId', value ? parseInt(value as string) : undefined);
                handleFilterChange('breedId', undefined); // Reset breed when species changes
              }}
            >
              <MenuItem value="">All Species</MenuItem>
              {speciesData?.map((species: SpeciesDto) => (
                <MenuItem key={species.speciesId} value={species.speciesId.toString()}>
                  {species.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Breed Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small" disabled={!filters.speciesId}>
            <InputLabel>Breed</InputLabel>
            <Select
              value={filters.breedId?.toString() || ''}
              label="Breed"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('breedId', value ? parseInt(value as string) : undefined);
              }}
            >
              <MenuItem value="">All Breeds</MenuItem>
              {breedsData
                ?.filter((breed: BreedDto) => !filters.speciesId || breed.speciesId === filters.speciesId)
                ?.map((breed: BreedDto) => (
                  <MenuItem key={breed.breedId} value={breed.breedId.toString()}>
                    {breed.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Size Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Size</InputLabel>
            <Select
              value={filters.size || ''}
              label="Size"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('size', value || undefined);
              }}
            >
              <MenuItem value="">All Sizes</MenuItem>
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
              <MenuItem value="Extra Large">Extra Large</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Gender Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Gender</InputLabel>
            <Select
              value={filters.gender || ''}
              label="Gender"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('gender', value || undefined);
              }}
            >
              <MenuItem value="">All Genders</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Physical Attributes Section */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Physical Attributes
          </Typography>
        </Grid>

        {/* Coat Length Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Coat Length</InputLabel>
            <Select
              value={filters.coatLengthId?.toString() || ''}
              label="Coat Length"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('coatLengthId', value ? parseInt(value as string) : undefined);
              }}            >
              <MenuItem value="">All Coat Lengths</MenuItem>
              {coatLengthsData?.map((coatLength: CoatLengthDto) => (
                <MenuItem key={coatLength.coatLengthId} value={coatLength.coatLengthId.toString()}>
                  {coatLength.length}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Color Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Color</InputLabel>
            <Select
              value={filters.colorId?.toString() || ''}
              label="Color"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('colorId', value ? parseInt(value as string) : undefined);
              }}            >
              <MenuItem value="">All Colors</MenuItem>
              {colorsData?.map((color: ColorDto) => (
                <MenuItem key={color.colorId} value={color.colorId.toString()}>
                  {color.color1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Behavioral & Health Section */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Behavioral & Health
          </Typography>
        </Grid>

        {/* Activity Level Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Activity Level</InputLabel>
            <Select
              value={filters.activityLevelId?.toString() || ''}
              label="Activity Level"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('activityLevelId', value ? parseInt(value as string) : undefined);
              }}            >
              <MenuItem value="">All Activity Levels</MenuItem>
              {activityLevelsData?.map((activityLevel: ActivityLevelDto) => (
                <MenuItem key={activityLevel.activityLevelId} value={activityLevel.activityLevelId.toString()}>
                  {activityLevel.activity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Health Status Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Health Status</InputLabel>
            <Select
              value={filters.healthStatusId?.toString() || ''}
              label="Health Status"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('healthStatusId', value ? parseInt(value as string) : undefined);
              }}            >
              <MenuItem value="">All Health Statuses</MenuItem>
              {healthStatusesData?.map((healthStatus: HealthStatusDto) => (
                <MenuItem key={healthStatus.healthStatusId} value={healthStatus.healthStatusId.toString()}>
                  {healthStatus.status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Microchipped Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Microchipped</InputLabel>
            <Select
              value={filters.microchipped === undefined ? '' : filters.microchipped.toString()}
              label="Microchipped"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('microchipped', value === '' ? undefined : value === 'true');
              }}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Location Section */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Location
          </Typography>
        </Grid>

        {/* Good With Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Good With</InputLabel>
            <Select
              multiple
              value={filters.goodWith || []}
              label="Good With"
              onChange={(e) => {
                const value = e.target.value as string[];
                handleFilterChange('goodWith', value.length > 0 ? value : undefined);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="Kids">👶 Kids</MenuItem>
              <MenuItem value="Dogs">🐕 Dogs</MenuItem>
              <MenuItem value="Cats">🐈 Cats</MenuItem>
              <MenuItem value="Other Animals">🐾 Other Animals</MenuItem>
              <MenuItem value="Senior People">👵 Senior People</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Shelter Filter */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Shelter</InputLabel>
            <Select
              value={filters.shelterId?.toString() || ''}
              label="Shelter"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('shelterId', value ? parseInt(value as string) : undefined);
              }}            >
              <MenuItem value="">All Shelters</MenuItem>
              {sheltersData?.items?.map((shelter: Shelter) => (
                <MenuItem key={shelter.shelterId} value={shelter.shelterId}>
                  {shelter.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );  if (speciesLoading || breedsLoading || coatLengthsLoading || colorsLoading || activityLevelsLoading || healthStatusesLoading || sheltersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Find Your Perfect Pet
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Browse through our amazing pets waiting for their forever homes
        </Typography>
      </Box>

      {/* Mobile Filter Toggle */}
      {isMobile && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ py: 2 }}>
            <Button
              fullWidth
              startIcon={<FilterListIcon />}
              endIcon={mobileFiltersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setMobileFiltersExpanded(!mobileFiltersExpanded)}
              variant="outlined"
            >
              Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </Button>
            <Collapse in={mobileFiltersExpanded}>
              <FilterContent />
            </Collapse>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Grid item md={3}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <FilterContent />
            </Card>
          </Grid>
        )}

        {/* Main Content */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          {/* Sort and Results Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h6">
                {petsResponse?.totalCount || 0} pets found
              </Typography>
              {getActiveFilterCount() > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                  {getActiveFilterChips().map((chip, index) => (
                    <Chip
                      key={index}
                      label={chip.label}
                      onDelete={chip.onDelete}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              )}
            </Box>            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={`${filters.sortBy}-${filters.sortDescending ? 'desc' : 'asc'}`}
                label="Sort by"
                onChange={(e) => {
                  const [sortBy, sortDirection] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortDescending', sortDirection === 'desc');
                }}
              >                <MenuItem value="name-asc">Name A-Z</MenuItem>
                <MenuItem value="name-desc">Name Z-A</MenuItem>
                <MenuItem value="age-asc">Age (Youngest First)</MenuItem>
                <MenuItem value="age-desc">Age (Oldest First)</MenuItem>
                <MenuItem value="species-asc">Species A-Z</MenuItem>
                <MenuItem value="createdAt-desc">Recently Added</MenuItem>
                <MenuItem value="createdAt-asc">Oldest Listings</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Pet Grid */}
          {petsLoading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={60} />
            </Box>
          ) : petsError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to load pets. Please try again later.
            </Alert>          ) : !petsResponse?.items?.length ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" gutterBottom>
                No pets found
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Try adjusting your filters to see more results
              </Typography>
              <Button onClick={clearFilters} variant="outlined" sx={{ mt: 2 }}>
                Clear Filters
              </Button>
            </Box>
          ) : (
            <>              <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
                <AnimatePresence>
                  {petsResponse.items.map((pet: Pet, index: number) => (
                    <Grid item xs={12} sm={6} lg={4} key={pet.petId} sx={{ display: 'flex' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        style={{ width: '100%', display: 'flex' }}
                      >
                        <PetCard pet={pet} />
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>

              {/* Pagination */}
              {petsResponse.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={petsResponse.totalPages}
                    page={filters.pageNumber}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '80vh',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FilterContent />
        </Drawer>
      )}
    </Container>
  );
};

export default PetBrowsePage;
