import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  Button,
  Chip,
  IconButton,
  Grid,
  Toolbar,
  Tooltip,
  useTheme,
  styled,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Settings as ManageIcon,
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFetchFilteredSheltersQuery } from '../../shelter/shelterApi';
import ShelterManagementModal from '../../shelter/ShelterManagementModal';
import type { Shelter, ShelterFilterDto } from '../../../app/models/shelter';

// Types
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  name: string;
  city: string;
  state: string;
  email: string;
}

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark'
    ? theme.palette.grey[900]
    : theme.palette.grey[50],
  minHeight: '100vh',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.3)'
    : '0 8px 32px rgba(0,0,0,0.1)',
}));

const FilterToolbar = styled(Toolbar)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  minHeight: 'auto !important',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.04),
  },
  transition: 'background-color 0.2s ease',
}));

const ManageButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  transition: 'all 0.2s ease',
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.25),
  fontSize: '0.75rem',
  height: 24,
}));

const AllSheltersPage: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState<FilterConfig>({
    name: '',
    city: '',
    state: '',
    email: '',
  });
  
  // Modal state
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Prepare API filter
  const apiFilter: ShelterFilterDto = {
    pageNumber: page + 1, // API uses 1-based pagination
    pageSize: rowsPerPage,
    sortBy: sortConfig.key,
    sortDescending: sortConfig.direction === 'desc',
    name: filters.name || undefined,
    city: filters.city || undefined,
    state: filters.state || undefined,
    email: filters.email || undefined,
  };

  // API queries
  const { 
    data: sheltersResponse, 
    isLoading, 
    error,
    refetch 
  } = useFetchFilteredSheltersQuery(apiFilter);

  const shelters = sheltersResponse?.items || [];
  const totalCount = sheltersResponse?.totalCount || 0;

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(0); // Reset to first page when sorting changes
  };

  const handleFilterChange = (key: keyof FilterConfig, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      city: '',
      state: '',
      email: '',
    });
    setPage(0);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleManageShelter = (shelterId: number) => {
    const shelter = shelters.find(s => s.shelterId === shelterId);
    if (shelter) {
      setSelectedShelter(shelter);
      setModalOpen(true);
    }
  };

  const formatAddress = (shelter: Shelter) => {
    if (!shelter.address) return 'No address';
    const { street, city, state, postalCode } = shelter.address;
    const parts = [street, city, state, postalCode].filter(Boolean);
    return parts.join(', ') || 'Incomplete address';
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
            All Shelters Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage all shelters in the system with advanced filtering and sorting options
          </Typography>
        </Box>

        <StyledPaper>
          <FilterToolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by shelter name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="City"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="State"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Clear Filters">
                    <IconButton onClick={clearFilters} size="small">
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh Data">
                    <IconButton onClick={handleRefresh} size="small" disabled={isLoading}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </FilterToolbar>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'shelterId'}
                      direction={sortConfig.key === 'shelterId' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('shelterId')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'name'}
                      direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Shelter Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'city'}
                      direction={sortConfig.key === 'city' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('city')}
                    >
                      Location
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Contact Information</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Loading shelters...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Alert severity="error">
                        Error loading shelters. Please try again.
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : shelters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="body2" color="text.secondary">
                        No shelters found matching your criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  shelters.map((shelter) => (
                    <StyledTableRow key={shelter.shelterId}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          #{shelter.shelterId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {shelter.name}
                          </Typography>
                          {shelter.website && (
                            <InfoChip
                              icon={<WebsiteIcon />}
                              label="Website"
                              size="small"
                              variant="outlined"
                              clickable
                              onClick={() => window.open(shelter.website, '_blank')}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatAddress(shelter)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          {shelter.phoneNumber && (
                            <InfoChip
                              icon={<PhoneIcon />}
                              label={shelter.phoneNumber}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {shelter.email && (
                            <InfoChip
                              icon={<EmailIcon />}
                              label={shelter.email}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {shelter.description || 'No description available'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <ManageButton
                          startIcon={<ManageIcon />}
                          onClick={() => handleManageShelter(shelter.shelterId)}
                          size="small"
                        >
                          Manage
                        </ManageButton>
                      </TableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage="Rows per page:"
            sx={{
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              px: 3,
            }}
          />
        </StyledPaper>
      </motion.div>

      {/* Shelter Management Modal */}
      <ShelterManagementModal
        shelter={selectedShelter}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedShelter(null);
        }}
        onShelterUpdated={() => {
          refetch();
        }}
      />
    </PageContainer>
  );
};

export default AllSheltersPage;
