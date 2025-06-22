import React, { useState, useMemo } from 'react';
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
  TablePagination,  TableSortLabel,
  TextField,
  Button,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Toolbar,  Tooltip,
  styled,
  alpha,  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Settings as ManageIcon,
  Clear as ClearIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFetchFilteredPetsQuery } from '../../pet/petApi';
import { useUserInfoQuery } from '../../account/accountApi';
import PetManagementModal from '../../pet/PetManagementModal';
import PetCreateModal from '../../pet/components/PetCreateModal';
import type { Pet, PetFilterDto } from '../../../app/models/pet';

// Types
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  petName: string;
  isDeleted: boolean | null;
  isAdopted: boolean | null;
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

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isDeleted' && prop !== 'isAdopted',
})<{ isDeleted?: boolean; isAdopted?: boolean }>(({ theme, isDeleted, isAdopted }) => ({
  backgroundColor: isDeleted
    ? alpha(theme.palette.error.main, 0.1)
    : isAdopted
    ? alpha(theme.palette.success.main, 0.1)
    : 'transparent',
  '&:hover': {
    backgroundColor: isDeleted
      ? alpha(theme.palette.error.main, 0.15)
      : isAdopted
      ? alpha(theme.palette.success.main, 0.15)
      : alpha(theme.palette.action.hover, 0.04),
  },
  transition: 'background-color 0.2s ease',
}));

const ShelterPetManagementPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });
  
  const [filters, setFilters] = useState<FilterConfig>({
    petName: '',
    isDeleted: null,
    isAdopted: null,
  });
  
  // Modal state
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Get current user to determine shelter ID
  const { data: user } = useUserInfoQuery();

  // Determine user's shelter ID based on their role
  const userShelterId = useMemo(() => {
    // For this implementation, we'll need to get the shelter ID from the backend
    // For now, we'll assume it's available in user data or fetch it separately
    // This would typically come from the ShelterManager relationship
    return user?.shelterId; // This would need to be added to the user info response
  }, [user]);

  // Prepare API filter - always filter by the user's shelter
  const apiFilter: PetFilterDto = {
    pageNumber: page + 1, // API uses 1-based pagination
    pageSize: rowsPerPage,
    sortBy: sortConfig.key === 'createdAt' ? 'createdAt' : 'name',
    sortDescending: sortConfig.direction === 'desc',
    name: filters.petName || undefined,
    shelterId: userShelterId, // Always filter by user's shelter
    isAdopted: filters.isAdopted === null ? undefined : filters.isAdopted,
    isDeleted: filters.isDeleted === null ? undefined : filters.isDeleted,
  };

  // API queries
  const { 
    data: petsResponse, 
    isLoading, 
    error,
    refetch 
  } = useFetchFilteredPetsQuery(apiFilter, {
    skip: !userShelterId, // Skip if we don't have a shelter ID
  });
  const pets = petsResponse?.items || [];
  const totalCount = petsResponse?.totalCount || 0;

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };  const handleFilterChange = (key: keyof FilterConfig, value: string | number | boolean | null | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPet(null);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handlePetCreated = () => {
    setCreateModalOpen(false);
    refetch(); // Refresh the pets list
  };

  const clearFilters = () => {
    setFilters({
      petName: '',
      isDeleted: null,
      isAdopted: null,
    });
    setPage(0);
  };

  const getStatusChip = (pet: Pet) => {
    if (pet.isDeleted) {
      return <Chip label="Deleted" color="error" size="small" />;
    }
    if (pet.isAdopted) {
      return <Chip label="Adopted" color="success" size="small" />;
    }
    return <Chip label="Available" color="primary" size="small" />;
  };

  // Show loading state if we don't have user info yet
  if (!user) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // Show error if user is not a shelter manager
  if (!user.roles?.includes('ShelterManager')) {
    return (
      <PageContainer>
        <Alert severity="error">
          You don't have permission to access this page. Only Shelter Managers can manage pets.
        </Alert>
      </PageContainer>
    );
  }

  // Show message if we don't have a shelter ID
  if (!userShelterId) {
    return (
      <PageContainer>
        <Alert severity="warning">
          You are not currently associated with a shelter. Please contact an administrator.
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Shelter's Pets
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage pets in your shelter, add new pets, and track their adoption status.
          </Typography>
        </Box>

        <StyledPaper>
          <FilterToolbar>
            <Grid container spacing={2} alignItems="center" flex={1}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search pets..."
                  value={filters.petName}
                  onChange={(e) => handleFilterChange('petName', e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Adoption Status</InputLabel>
                  <Select
                    value={filters.isAdopted === null ? '' : filters.isAdopted.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange('isAdopted', 
                        value === '' ? null : value === 'true'
                      );
                    }}
                    label="Adoption Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="false">Available</MenuItem>
                    <MenuItem value="true">Adopted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.isDeleted === null ? '' : filters.isDeleted.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange('isDeleted', 
                        value === '' ? null : value === 'true'
                      );
                    }}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="false">Active</MenuItem>
                    <MenuItem value="true">Deleted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>                  <Tooltip title="Clear filters">
                    <IconButton onClick={clearFilters}>
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <IconButton onClick={() => refetch()}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateModalOpen(true)}
                    sx={{ ml: 1 }}
                  >
                    Add Pet
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </FilterToolbar>

          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              Error loading pets. Please try again.
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'name'}
                      direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Species</TableCell>
                  <TableCell>Breed</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'createdAt'}
                      direction={sortConfig.key === 'createdAt' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >
                      Added
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : pets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No pets found. Click the + button to add your first pet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pets.map((pet) => (
                    <StyledTableRow
                      key={pet.petId}
                      isDeleted={pet.isDeleted}
                      isAdopted={pet.isAdopted}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handlePetClick(pet)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {pet.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{pet.speciesName}</TableCell>
                      <TableCell>{pet.breedName || 'Mixed'}</TableCell>
                      <TableCell>{pet.age || 'Unknown'}</TableCell>
                      <TableCell>{pet.gender || 'Unknown'}</TableCell>
                      <TableCell>{pet.size || 'Unknown'}</TableCell>
                      <TableCell>{getStatusChip(pet)}</TableCell>
                      <TableCell>
                        {pet.createdAt 
                          ? new Date(pet.createdAt).toLocaleDateString()
                          : 'Unknown'
                        }
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Manage pet">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePetClick(pet);
                            }}
                          >
                            <ManageIcon />
                          </IconButton>
                        </Tooltip>
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
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </StyledPaper>      </motion.div>

      {/* Pet Management Modal */}
      {selectedPet && (
        <PetManagementModal
          pet={selectedPet}
          open={modalOpen}
          onClose={handleCloseModal}
        />
      )}      {/* Pet Create Modal */}
      <PetCreateModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handlePetCreated}
        shelterId={userShelterId}
      />
    </PageContainer>
  );
};

export default ShelterPetManagementPage;
