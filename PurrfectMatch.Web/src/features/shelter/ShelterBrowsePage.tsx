import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Alert,
  Chip,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchFilteredSheltersQuery } from './shelterApi';
import {
  ShelterFilterPanel,
  ShelterResults,
  ActiveFilters,
  MobileFilterDrawer,
} from './components';
import type { ShelterFilterDto } from '../../app/models/shelter';

const SHELTERS_PER_PAGE = 12;

const ShelterBrowsePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  // Filter state
  const [filters, setFilters] = useState<ShelterFilterDto>({
    pageNumber: 1,
    pageSize: SHELTERS_PER_PAGE,
    sortBy: 'name',
    sortDescending: false,
  });
  
  // UI state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // API queries
  const { 
    data: sheltersResponse, 
    isLoading: sheltersLoading, 
    error: sheltersError 
  } = useFetchFilteredSheltersQuery(filters);  // Initialize filters from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters: Partial<ShelterFilterDto> = {
      pageNumber: 1,
      pageSize: SHELTERS_PER_PAGE,
    };

    // Parse URL parameters
    if (searchParams.get('name')) urlFilters.name = searchParams.get('name')!;
    if (searchParams.get('city')) urlFilters.city = searchParams.get('city')!;
    if (searchParams.get('state')) urlFilters.state = searchParams.get('state')!;
    if (searchParams.get('email')) urlFilters.email = searchParams.get('email')!;
    if (searchParams.get('sortBy')) urlFilters.sortBy = searchParams.get('sortBy')!;
    if (searchParams.get('sortDescending')) urlFilters.sortDescending = searchParams.get('sortDescending') === 'true';

    setFilters(prev => ({ ...prev, ...urlFilters }));
  }, [location.search]);
  // Update URL when filters change
  useEffect(() => {
    const searchParams = new URLSearchParams();
    
    if (filters.name) searchParams.set('name', filters.name);
    if (filters.city) searchParams.set('city', filters.city);
    if (filters.state) searchParams.set('state', filters.state);
    if (filters.email) searchParams.set('email', filters.email);
    if (filters.sortBy && filters.sortBy !== 'name') searchParams.set('sortBy', filters.sortBy);
    if (filters.sortDescending) searchParams.set('sortDescending', filters.sortDescending.toString());

    const newSearch = searchParams.toString();
    const currentSearch = location.search.replace('?', '');
    
    if (newSearch !== currentSearch) {
      navigate(`/shelters${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [filters, navigate, location.search]);

  const handleFilterChange = (filterKey: keyof ShelterFilterDto, value: string | number | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value,
      pageNumber: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: SHELTERS_PER_PAGE,
      sortBy: 'name',
      sortDescending: false,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.name) count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.email) count++;
    return count;
  };
  if (sheltersError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading shelters. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Find Animal Shelters
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Discover local animal shelters and rescue organizations making a difference in your community
        </Typography>
      </Box>

      {/* Active Filters */}
      <ActiveFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      {/* Mobile Filter Button */}
      {isMobile && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDrawerOpen(true)}
            sx={{ borderRadius: '12px' }}
          >
            Filters
            {getActiveFilterCount() > 0 && (
              <Chip 
                label={getActiveFilterCount()} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }}
              />
            )}
          </Button>
          
          {sheltersResponse && (
            <Typography variant="body2" color="text.secondary">
              {sheltersResponse.totalCount} shelters found
            </Typography>
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Desktop Filters */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <ShelterFilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </Grid>
        )}

        {/* Results Section */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>          <ShelterResults
            shelters={sheltersResponse?.items || []}
            totalCount={sheltersResponse?.totalCount || 0}
            totalPages={sheltersResponse?.totalPages || 0}
            currentPage={filters.pageNumber || 1}
            isLoading={sheltersLoading}
            isMobile={isMobile}
            onPageChange={handlePageChange}
            onClearFilters={clearFilters}
          />
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <MobileFilterDrawer
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      )}
    </Container>
  );
};

export default ShelterBrowsePage;
