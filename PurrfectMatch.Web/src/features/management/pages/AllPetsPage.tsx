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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFetchFilteredPetsQuery } from '../../pet/petApi';
import { useFetchFilteredSheltersQuery } from '../../shelter/shelterApi';
import PetManagementModal from '../../pet/PetManagementModal';
import type { Pet, PetFilterDto } from '../../../app/models/pet';

// Types
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  petName: string;
  shelterId: string;
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

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: 'available' | 'adopted' | 'deleted' }>(({ theme, status }) => ({
  fontWeight: 600,
  ...(status === 'deleted' && {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
  }),
  ...(status === 'adopted' && {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
  }),
  ...(status === 'available' && {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  }),
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

const AllPetsPage: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });  const [filters, setFilters] = useState<FilterConfig>({
    petName: '',
    shelterId: '',
    isDeleted: null,
    isAdopted: null,
  });
  
  // Modal state
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);// Prepare API filter
  const apiFilter: PetFilterDto = {
    pageNumber: page + 1, // API uses 1-based pagination
    pageSize: rowsPerPage,
    sortBy: sortConfig.key === 'createdAt' ? 'createdAt' : 'name',
    sortDescending: sortConfig.direction === 'desc',
    name: filters.petName || undefined,
    shelterId: filters.shelterId ? parseInt(filters.shelterId) : undefined,
    isAdopted: filters.isAdopted === null ? undefined : filters.isAdopted,
    isDeleted: filters.isDeleted === null ? undefined : filters.isDeleted,
  };

  // API queries
  const { 
    data: petsResponse, 
    isLoading, 
    error,
    refetch 
  } = useFetchFilteredPetsQuery(apiFilter);
  const { 
    data: sheltersResponse
  } = useFetchFilteredSheltersQuery({
    pageNumber: 1,
    pageSize: 100 // Get all shelters for filter dropdown
  });
  const pets = petsResponse?.items || [];
  const totalCount = petsResponse?.totalCount || 0;
  const shelters = sheltersResponse?.items || [];
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(0); // Reset to first page when sorting changes
  };
  const handleFilterChange = (key: keyof FilterConfig, value: string | boolean | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };
  const clearFilters = () => {
    setFilters({
      petName: '',
      shelterId: '',
      isDeleted: null,
      isAdopted: null,
    });
    setPage(0);
  };

  const handleRefresh = () => {
    refetch();
  };  const handleManagePet = (petId: number) => {
    const pet = pets.find(p => p.petId === petId);
    if (pet) {
      setSelectedPet(pet);
      setModalOpen(true);
    }
  };

  const getStatusChip = (pet: Pet) => {
    if (pet.isDeleted) {
      return <StatusChip label="Deleted" size="small" status="deleted" />;
    }
    if (pet.isAdopted) {
      return <StatusChip label="Adopted" size="small" status="adopted" />;
    }
    return <StatusChip label="Available" size="small" status="available" />;
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
            All Pets Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage all pets in the system with advanced filtering and sorting options
          </Typography>
        </Box>

        <StyledPaper>
          <FilterToolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by pet name..."
                  value={filters.petName}
                  onChange={(e) => handleFilterChange('petName', e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Shelter</InputLabel>
                  <Select
                    value={filters.shelterId}
                    label="Shelter"
                    onChange={(e) => handleFilterChange('shelterId', e.target.value)}
                  >
                    <MenuItem value="">All Shelters</MenuItem>
                    {shelters.map((shelter) => (
                      <MenuItem key={shelter.shelterId} value={shelter.shelterId.toString()}>
                        {shelter.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Deleted</InputLabel>
                  <Select
                    value={filters.isDeleted === null ? '' : filters.isDeleted.toString()}
                    label="Deleted"                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange('isDeleted', value === '' ? null : value === 'true');
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="false">Not Deleted</MenuItem>
                    <MenuItem value="true">Deleted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Adopted</InputLabel>
                  <Select
                    value={filters.isAdopted === null ? '' : filters.isAdopted.toString()}
                    label="Adopted"                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange('isAdopted', value === '' ? null : value === 'true');
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="false">Available</MenuItem>
                    <MenuItem value="true">Adopted</MenuItem>
                  </Select>
                </FormControl>
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
                      active={sortConfig.key === 'petId'}
                      direction={sortConfig.key === 'petId' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('petId')}
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
                      Pet Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'shelterId'}
                      direction={sortConfig.key === 'shelterId' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('shelterId')}
                    >
                      Shelter
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'createdAt'}
                      direction={sortConfig.key === 'createdAt' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >
                      Date Added
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Loading pets...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Alert severity="error">
                        Error loading pets. Please try again.
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : pets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="body2" color="text.secondary">
                        No pets found matching your criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pets.map((pet) => (
                    <StyledTableRow
                      key={pet.petId}
                      isDeleted={pet.isDeleted}
                      isAdopted={pet.isAdopted}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          #{pet.petId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {pet.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pet.breedName} • {pet.age} years • {pet.gender}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {pet.shelterName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {pet.shelterId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(pet)}
                      </TableCell>
                      <TableCell align="center">
                        <ManageButton
                          startIcon={<ManageIcon />}
                          onClick={() => handleManagePet(pet.petId)}
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
            }}          />
        </StyledPaper>
      </motion.div>

      {/* Pet Management Modal */}
      <PetManagementModal
        pet={selectedPet}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPet(null);
        }}
        onPetUpdated={() => {
          refetch();
        }}
      />
    </PageContainer>
  );
};

export default AllPetsPage;
