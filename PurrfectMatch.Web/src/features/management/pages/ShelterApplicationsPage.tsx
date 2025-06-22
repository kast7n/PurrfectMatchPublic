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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { 
  useFetchShelterApplicationsQuery,
  useUpdateShelterApplicationStatusMutation,
} from '../../shelter/shelterApi';
import type { 
  ShelterCreationRequestDto, 
  ShelterApplicationFilterDto,
  UpdateShelterApplicationStatusDto 
} from '../../../app/models/shelter';

// Types
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  shelterName: string;
  status: string;
  isApproved: string; // 'all' | 'approved' | 'pending' | 'rejected'
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
  shouldForwardProp: (prop) => prop !== 'applicationStatus',
})<{ applicationStatus?: string }>(({ theme, applicationStatus }) => ({
  backgroundColor: applicationStatus === 'rejected'
    ? alpha(theme.palette.error.main, 0.05)
    : applicationStatus === 'approved'
    ? alpha(theme.palette.success.main, 0.05)
    : 'transparent',
  '&:hover': {
    backgroundColor: applicationStatus === 'rejected'
      ? alpha(theme.palette.error.main, 0.1)
      : applicationStatus === 'approved'
      ? alpha(theme.palette.success.main, 0.1)
      : alpha(theme.palette.action.hover, 0.04),
  },
  transition: 'background-color 0.2s ease',
}));

const ShelterApplicationsPage: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'requestDate', direction: 'desc' });
  
  const [filters, setFilters] = useState<FilterConfig>({
    shelterName: '',
    status: 'all',
    isApproved: 'all',
  });

  // Modal states
  const [selectedApplication, setSelectedApplication] = useState<ShelterCreationRequestDto | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // Prepare API filter
  const apiFilter: ShelterApplicationFilterDto = {
    pageNumber: page + 1, // API uses 1-based pagination
    pageSize: rowsPerPage,
    sortBy: sortConfig.key === 'requestDate' ? 'createdAt' : sortConfig.key,
    sortDescending: sortConfig.direction === 'desc',
    isApproved: filters.isApproved === 'approved' ? true 
               : filters.isApproved === 'rejected' ? false 
               : undefined,
  };

  // API queries and mutations
  const { 
    data: applicationsResponse, 
    isLoading, 
    error,
    refetch 
  } = useFetchShelterApplicationsQuery(apiFilter);

  const [updateApplicationStatus] = useUpdateShelterApplicationStatusMutation();

  const applications = applicationsResponse?.items || [];
  const totalCount = applicationsResponse?.totalCount || 0;

  // Filter applications locally for shelter name search
  const filteredApplications = applications.filter(app => 
    filters.shelterName === '' || 
    app.shelterName?.toLowerCase().includes(filters.shelterName.toLowerCase())
  );

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(0);
  };

  const handleFilterChange = (key: keyof FilterConfig, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      shelterName: '',
      status: 'all',
      isApproved: 'all',
    });
    setPage(0);
  };

  const handleViewDetails = (application: ShelterCreationRequestDto) => {
    setSelectedApplication(application);
    setDetailsModalOpen(true);
  };

  const handleStatusAction = (application: ShelterCreationRequestDto, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setActionType(action);
    setConfirmModalOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedApplication || !actionType) return;

    const statusData: UpdateShelterApplicationStatusDto = {
      isApproved: actionType === 'approve',
      remarks: actionType === 'approve' 
        ? 'Application approved by admin' 
        : 'Application rejected by admin'
    };

    try {
      await updateApplicationStatus({
        id: selectedApplication.requestId,
        statusData
      }).unwrap();
      
      refetch(); // Refresh the data
      setConfirmModalOpen(false);
      setActionType(null);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };
  const getStatusFromApplication = (app: ShelterCreationRequestDto): 'pending' | 'approved' | 'rejected' => {
    if (app.isApproved === true) return 'approved';
    if (app.isApproved === false) return 'rejected';
    return 'pending';
  };

  if (error) {
    return (
      <PageContainer>
        <Alert severity="error">
          Error loading shelter applications. Please try again.
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
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}
        >
          Manage Shelter Applications
        </Typography>

        <StyledPaper>
          <FilterToolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search Shelter Name"
                  value={filters.shelterName}
                  onChange={(e) => handleFilterChange('shelterName', e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Approval Status</InputLabel>
                  <Select
                    value={filters.isApproved}
                    label="Approval Status"
                    onChange={(e) => handleFilterChange('isApproved', e.target.value)}
                  >
                    <MenuItem value="all">All Applications</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
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

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total: {totalCount} applications
                </Typography>
              </Grid>
            </Grid>
          </FilterToolbar>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'shelterName'}
                      direction={sortConfig.key === 'shelterName' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('shelterName')}
                    >
                      Shelter Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Applicant</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'requestDate'}
                      direction={sortConfig.key === 'requestDate' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('requestDate')}
                    >
                      Application Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No shelter applications found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (                  filteredApplications.map((application) => {
                    const status = getStatusFromApplication(application);
                    return (                      <StyledTableRow
                        key={application.requestId}
                        applicationStatus={status}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {application.shelterName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {application.userId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(application.requestDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {application.remarks ? 
                              (application.remarks.length > 50 
                                ? `${application.remarks.substring(0, 50)}...` 
                                : application.remarks)
                              : 'No remarks'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(application)}
                                sx={{ color: 'primary.main' }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {status === 'pending' && (
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
                    );
                  })
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
          />
        </StyledPaper>
      </motion.div>

      {/* Application Details Modal */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Application Details
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Shelter Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedApplication.shelterName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Applicant ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedApplication.userId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Application Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedApplication.requestDate).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Remarks
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedApplication.remarks || 'No remarks provided'}
                  </Typography>
                </Grid>                {selectedApplication.requestedAddress && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Requested Address
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.requestedAddress}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
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
            Are you sure you want to {actionType} the shelter application for "{selectedApplication?.shelterName}"?
            This action cannot be undone.
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
    </PageContainer>
  );
};

export default ShelterApplicationsPage;
