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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Visibility as ViewIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Pets as PetIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PetDetailsModal from '../../pet/PetDetailsModal';
import { useFetchPetByIdQuery } from '../../pet/petApi';
import { 
  useFetchFilteredAdoptionApplicationsQuery,
  useUpdateAdoptionApplicationStatusMutation,
} from '../../adoptionApplication/adoptionApplicationApi';
import { 
  AdoptionApplicationDto, 
  ApplicationStatusDto,
} from '../../../app/models/AdoptionApplication';
import { useUserInfoQuery } from '../../account/accountApi';

// Extended interface for applications with additional API fields
interface ExtendedAdoptionApplicationDto extends AdoptionApplicationDto {
  email?: string;
  // Add other fields that might come from the API but aren't in the base DTO
}

// Types
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  applicantId: string;
  petId: string;
  status: string;
}

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark'
    ? theme.palette.grey[900]
    : theme.palette.grey[50],
  minHeight: '100vh',
  // Mobile responsive padding
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
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
  // Mobile responsive padding
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 1),
    gap: theme.spacing(1),
  },
}));

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'applicationStatus',
})<{ applicationStatus?: string }>(({ theme, applicationStatus }) => ({
  backgroundColor: applicationStatus === 'Rejected'
    ? alpha(theme.palette.error.main, 0.05)
    : applicationStatus === 'Approved'
    ? alpha(theme.palette.success.main, 0.05)
    : 'transparent',
  '&:hover': {
    backgroundColor: applicationStatus === 'Rejected'
      ? alpha(theme.palette.error.main, 0.1)
      : applicationStatus === 'Approved'
      ? alpha(theme.palette.success.main, 0.1)
      : alpha(theme.palette.action.hover, 0.04),
  },
  transition: 'background-color 0.2s ease',
}));

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn' }>(({ theme, status }) => ({
  fontWeight: 600,
  textTransform: 'capitalize',
  ...(status === 'Rejected' && {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
  }),
  ...(status === 'Approved' && {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
  }),
  ...(status === 'Pending' && {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.main,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
  }),
  ...(status === 'Withdrawn' && {
    backgroundColor: alpha(theme.palette.grey[500], 0.1),
    color: theme.palette.grey[700],
    border: `1px solid ${alpha(theme.palette.grey[500], 0.3)}`,
  }),
}));

const AdoptionApplicationsPage: React.FC = () => {
  const theme = useTheme();
  const { data: user } = useUserInfoQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'applicationDate', direction: 'desc' });
  
  const [filters, setFilters] = useState<FilterConfig>({
    applicantId: '',
    petId: '',
    status: 'all',
  });

  // Modal states
  const [selectedApplication, setSelectedApplication] = useState<AdoptionApplicationDto | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  // API queries and mutations
  const { 
    data: paginatedResponse, 
    isLoading, 
    error,
    refetch   } = useFetchFilteredAdoptionApplicationsQuery({
    page: page + 1, // API is 1-based, MUI is 0-based
    pageSize: rowsPerPage,
    status: filters.status === 'all' ? undefined : filters.status,
    shelterId: user?.shelterId, // Filter by current user's shelter
  });

  const { data: selectedPet } = useFetchPetByIdQuery(selectedPetId!, {
    skip: !selectedPetId,
  });

  const [updateApplicationStatus] = useUpdateAdoptionApplicationStatusMutation();  // Extract applications and pagination info
  // Try both possible response structures
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseAny = paginatedResponse as any;
  const applications = paginatedResponse?.data || responseAny?.items || [];
  const totalCount = paginatedResponse?.pagination?.totalCount || responseAny?.totalCount || 0;

  // Debug: Log the API response structure
  console.log('API Response:', paginatedResponse);
  console.log('Applications:', applications);
  console.log('Total Count:', totalCount);// Apply local filtering for fields not handled by API
  const filteredApplications = applications.filter((app: AdoptionApplicationDto) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appAny = app as any; // Temporary cast to access userId from API
    const matchesApplicant = filters.applicantId === '' || 
      (appAny.userId || '').toLowerCase().includes(filters.applicantId.toLowerCase());
    const matchesPet = filters.petId === '' || 
      app.petId.toString().includes(filters.petId);
    console.log('Filtering app:', app.id, 'userId:', appAny.userId, 'applicantId filter:', filters.applicantId, 'petId filter:', filters.petId);
    console.log('matchesApplicant:', matchesApplicant, 'matchesPet:', matchesPet);
    return matchesApplicant && matchesPet;
  });

  // Debug: Log filtering results
  console.log('Filtered applications count:', filteredApplications.length);
  console.log('Original applications count:', applications.length);// Sort applications (but don't paginate again since API handles pagination)
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aAny = a as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bAny = b as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aValue: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bValue: any;
      // Handle property name mapping between API response and expected interface
    if (sortConfig.key === 'applicantId') {
      aValue = aAny.userId;
      bValue = bAny.userId;
    } else if (sortConfig.key === 'applicationDate') {
      aValue = aAny.createdAt;
      bValue = bAny.createdAt;
    } else {
      aValue = a[sortConfig.key as keyof AdoptionApplicationDto];
      bValue = b[sortConfig.key as keyof AdoptionApplicationDto];
    }
    
    if (!aValue && !bValue) return 0;
    if (!aValue) return 1;
    if (!bValue) return -1;
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });
  // Use the sorted applications directly (API already handles pagination)
  const displayedApplications = sortedApplications;

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (key: keyof FilterConfig, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      applicantId: '',
      petId: '',
      status: 'all',
    });
    setPage(0);
  };

  const handleViewDetails = (application: AdoptionApplicationDto) => {
    setSelectedApplication(application);
    setDetailsModalOpen(true);
  };

  const handleStatusAction = (application: AdoptionApplicationDto, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setActionType(action);
    setConfirmModalOpen(true);
  };
  const confirmStatusUpdate = async () => {
    if (!selectedApplication || !actionType) return;

    const status = actionType === 'approve' ? ApplicationStatusDto.Approved : ApplicationStatusDto.Rejected;

    try {
      await updateApplicationStatus({ id: selectedApplication.id, status }).unwrap();
      
      refetch(); // Refresh the data
      setConfirmModalOpen(false);
      setActionType(null);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return 'N/A';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    // Format to YYYY-MM-DD HH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  if (error) {
    return (
      <PageContainer>
        <Alert severity="error">
          Error loading adoption applications. Please try again.
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
      >        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            // Mobile responsive font size
            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.125rem' },
          }}
        >
          Manage Adoption Applications
        </Typography>

        <StyledPaper>
          <FilterToolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search Applicant ID"
                  value={filters.applicantId}
                  onChange={(e) => handleFilterChange('applicantId', e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search Pet ID"
                  value={filters.petId}
                  onChange={(e) => handleFilterChange('petId', e.target.value)}
                  InputProps={{
                    startAdornment: <PetIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                    <MenuItem value="Withdrawn">Withdrawn</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Clear Filters">
                    <IconButton onClick={clearFilters} size="small">
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <IconButton onClick={() => refetch()} size="small">
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>            <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Showing: {displayedApplications.length} applications (Total: {totalCount})
                </Typography>
              </Grid>
            </Grid>
          </FilterToolbar>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>          ) : (
            <>
              <TableContainer sx={{ 
                // Make table horizontally scrollable on mobile
                overflowX: 'auto',
                '& .MuiTable-root': {
                  minWidth: { xs: 800, md: 'auto' }, // Set minimum width for mobile
                },
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        minWidth: { xs: 80, md: 'auto' },
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}>
                        <TableSortLabel
                          active={sortConfig.key === 'id'}
                          direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'}
                          onClick={() => handleSort('id')}
                        >
                          ID
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ 
                        minWidth: { xs: 120, md: 'auto' },
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}>
                        <TableSortLabel
                          active={sortConfig.key === 'applicantId'}
                          direction={sortConfig.key === 'applicantId' ? sortConfig.direction : 'asc'}
                          onClick={() => handleSort('applicantId')}
                        >
                          Applicant
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ 
                        minWidth: { xs: 100, md: 'auto' },
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}>
                        <TableSortLabel
                          active={sortConfig.key === 'petId'}
                          direction={sortConfig.key === 'petId' ? sortConfig.direction : 'asc'}
                          onClick={() => handleSort('petId')}
                        >
                          Pet ID
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ 
                        minWidth: { xs: 140, md: 'auto' },
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}>
                        <TableSortLabel
                          active={sortConfig.key === 'applicationDate'}
                          direction={sortConfig.key === 'applicationDate' ? sortConfig.direction : 'asc'}
                          onClick={() => handleSort('applicationDate')}
                        >
                          Application Date
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ 
                        minWidth: { xs: 100, md: 'auto' },
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}>Status</TableCell>
                      <TableCell sx={{ 
                        minWidth: { xs: 120, md: 'auto' },
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedApplications.map((application) => (                      <StyledTableRow 
                        key={application.id} 
                        applicationStatus={application.status}
                      >
                        <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                          <Typography variant="body2" fontWeight={600}>
                            #{application.id}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ 
                              color: 'text.secondary', 
                              fontSize: { xs: 18, md: 20 }
                            }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {(application as any).userId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline',
                                color: theme.palette.primary.main,
                              },
                            }}
                            onClick={() => setSelectedPetId(application.petId)}
                          >
                            <PetIcon sx={{ 
                              color: 'text.secondary', 
                              fontSize: { xs: 18, md: 20 }
                            }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              #{application.petId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                          >
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {formatDate((application as any).createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                          <StatusChip
                            label={application.status}
                            status={application.status}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(application)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {application.status === ApplicationStatusDto.Pending && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleStatusAction(application, 'approve')}
                                    sx={{ color: 'success.main' }}
                                  >
                                    <ApproveIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleStatusAction(application, 'reject')}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <RejectIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>              <TablePagination
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
                sx={{
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '& .MuiTablePagination-toolbar': {
                    paddingLeft: { xs: theme.spacing(1), md: theme.spacing(3) },
                    paddingRight: { xs: theme.spacing(1), md: theme.spacing(3) },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 0 },
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  },
                  '& .MuiTablePagination-actions': {
                    marginLeft: { xs: 0, sm: theme.spacing(2) },
                  },
                }}
              />
            </>
          )}
        </StyledPaper>

        {/* Application Details Modal */}
        <Dialog 
          open={detailsModalOpen} 
          onClose={() => setDetailsModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" component="div">
              Application Details #{selectedApplication?.id}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Applicant ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {(selectedApplication as ExtendedAdoptionApplicationDto).userId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pet ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    #{selectedApplication.petId}
                  </Typography>
                </Grid>                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Application Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {selectedApplication && formatDate((selectedApplication as any).createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <StatusChip
                    label={selectedApplication.status}
                    status={selectedApplication.status}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>                {(selectedApplication as ExtendedAdoptionApplicationDto).email && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Application Email
                    </Typography>
                    <Typography variant="body1">
                      {(selectedApplication as ExtendedAdoptionApplicationDto).email}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsModalOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Modal */}
        <Dialog
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
        >
          <DialogTitle>
            Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to {actionType} this adoption application?
              {actionType === 'approve' && ' The applicant will be notified of the approval.'}
              {actionType === 'reject' && ' The applicant will be notified of the rejection.'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmStatusUpdate}
              color={actionType === 'approve' ? 'success' : 'error'}
              variant="contained"
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>

        {selectedPet && (
          <PetDetailsModal
            pet={selectedPet}
            open={!!selectedPetId}
            onClose={() => setSelectedPetId(null)}
          />
        )}
      </motion.div>
    </PageContainer>
  );
};

export default AdoptionApplicationsPage;
