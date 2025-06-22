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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,  PersonRemove as PersonRemoveIcon,
  Clear as ClearIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  ManageAccounts as ShelterManagerIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useGetUsersQuery, useDeleteUserMutation, useAssignShelterManagerMutation, useRemoveShelterManagerMutation, useUpdateUserRoleMutation, useUpdateUserShelterMutation, useUpdateUserDetailsMutation } from '../../userManagement/userManagementApi';
import { useFetchFilteredSheltersQuery } from '../../shelter/shelterApi';
import { useUserInfoQuery } from '../../account/accountApi';
import type { UserManagement, UserFilter } from '../../../app/models/user';

// Types
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  email: string;
  userName: string;
  role: string;
  emailConfirmed?: boolean;
  isLockedOut?: boolean;
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

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(0.5, 1),
  textTransform: 'none',
  fontWeight: 500,
  minWidth: 'auto',
  '&.delete': {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
    '&:hover': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  },
  '&.assign': {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
    '&:hover': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
    },
  },
  '&.remove': {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.main,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
    '&:hover': {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
    },
  },
  transition: 'all 0.2s ease',
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.25),
  fontSize: '0.75rem',
  height: 24,
}));

const UserManagementPage: React.FC = () => {
  const theme = useTheme();
  const { data: currentUser } = useUserInfoQuery();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'email', direction: 'asc' });
  const [filters, setFilters] = useState<FilterConfig>({
    email: '',
    userName: '',
    role: '',
  });
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [editShelterDialogOpen, setEditShelterDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [selectedShelterId, setSelectedShelterId] = useState<number>(0);
  
  // Edit form states
  const [editUserForm, setEditUserForm] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    emailConfirmed: false,
    lockoutEnabled: false,
  });
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedNewShelterId, setSelectedNewShelterId] = useState<number>(0);
  const isAdmin = currentUser?.roles?.includes('Admin') || false;
  const isShelterManager = currentUser?.roles?.includes('ShelterManager') || false;

  // Debug logging
  React.useEffect(() => {
    console.log('Current user:', currentUser);
    console.log('Is admin:', isAdmin);
    console.log('Is shelter manager:', isShelterManager);
  }, [currentUser, isAdmin, isShelterManager]);
  // Get current user's shelter for shelter managers
  const currentUserShelterId = React.useMemo(() => {
    return currentUser?.shelterId || 0;
  }, [currentUser]);

  // Prepare API filter
  const apiFilter: UserFilter = {
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    sortBy: sortConfig.key,
    sortDescending: sortConfig.direction === 'desc',
    email: filters.email || undefined,
    userName: filters.userName || undefined,
    role: filters.role || undefined,
    emailConfirmed: filters.emailConfirmed,
    isLockedOut: filters.isLockedOut,
    shelterId: isShelterManager && !isAdmin ? currentUserShelterId : undefined,
  };  // API queries and mutations
  const { 
    data: usersResponse, 
    isLoading, 
    error,
    refetch   } = useGetUsersQuery(apiFilter, {
    // Add some debugging
    selectFromResult: ({ data, error, isLoading }) => {
      console.log('Users API Response:', { data, error, isLoading });
      console.log('Users Response Items:', data?.items);
      return { data, error, isLoading };
    },
    // Only call API if user has appropriate role
    skip: !isAdmin && !isShelterManager
  });

  const { data: sheltersResponse } = useFetchFilteredSheltersQuery({
    pageNumber: 1,
    pageSize: 100,
    sortBy: 'name',
    sortDescending: false,
  });
  const [deleteUser] = useDeleteUserMutation();
  const [assignShelterManager] = useAssignShelterManagerMutation();
  const [removeShelterManager] = useRemoveShelterManagerMutation();  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updateUserShelter] = useUpdateUserShelterMutation();
  const [updateUserDetails] = useUpdateUserDetailsMutation();

  const users = React.useMemo(() => usersResponse?.items || [], [usersResponse?.items]);
  const totalCount = usersResponse?.totalCount || 0;
  const shelters = sheltersResponse?.items || [];

  // Add safety check for users array
  const safeUsers = React.useMemo(() => Array.isArray(users) ? users : [], [users]);

  // Debug the users data
  React.useEffect(() => {
    console.log('Users data check:', {
      usersResponse,
      users,
      safeUsers,
      isArray: Array.isArray(users),
      length: users?.length
    });
  }, [usersResponse, users, safeUsers]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(0);
  };

  const handleFilterChange = (key: keyof FilterConfig, value: string | boolean | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      email: '',
      userName: '',
      role: '',
    });
    setPage(0);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id).unwrap();
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleAssignShelterManager = async () => {
    if (!assignEmail || !selectedShelterId) return;
    
    try {
      await assignShelterManager({
        email: assignEmail,
        shelterId: selectedShelterId,
      }).unwrap();
      setAssignDialogOpen(false);
      setAssignEmail('');
      setSelectedShelterId(0);
    } catch (error) {
      console.error('Failed to assign shelter manager:', error);
    }
  };

  const handleRemoveShelterManager = async () => {
    if (!selectedUser || !selectedUser.shelterId) return;
    
    try {
      await removeShelterManager({
        userId: selectedUser.id,
        shelterId: selectedUser.shelterId,
      }).unwrap();
      setRemoveDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to remove shelter manager:', error);
    }
  };

  const handleUpdateUserDetails = async () => {
    if (!selectedUser) return;
    
    try {
      await updateUserDetails({
        userId: selectedUser.id,
        ...editUserForm,
      }).unwrap();
      setEditUserDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };  const handleUpdateUserRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    console.log('Updating user role:', {
      userId: selectedUser.id,
      role: selectedRole,
      selectedUser
    });
    
    try {
      const result = await updateUserRole({
        userId: selectedUser.id,
        role: selectedRole,
      }).unwrap();
      console.log('Role update successful:', result);
      setEditRoleDialogOpen(false);
      setSelectedUser(null);
      setSelectedRole('');    } catch (error: unknown) {
      console.error('Failed to update user role:', error);
      // Show more detailed error to user
      let errorMessage = 'Unknown error occurred';
      if (error && typeof error === 'object') {
        if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
          errorMessage = String(error.data.message);
        } else if ('message' in error) {
          errorMessage = String(error.message);
        }
      }
      alert(`Failed to update user role: ${errorMessage}`);
    }
  };

  const handleUpdateUserShelter = async () => {
    if (!selectedUser) return;
    
    try {
      await updateUserShelter({
        userId: selectedUser.id,
        newShelterId: selectedNewShelterId || undefined,
        oldShelterId: selectedUser.shelterId,
      }).unwrap();
      setEditShelterDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user shelter:', error);
    }
  };

  const getRoleIcon = (roles: string[]) => {
    if (roles.includes('Admin')) return <AdminIcon color="error" />;
    if (roles.includes('ShelterManager')) return <ShelterManagerIcon color="primary" />;
    return <PersonIcon color="action" />;
  };

  const formatRoles = (roles: string[]) => {
    return roles.map(role => (
      <InfoChip
        key={role}
        label={role}
        size="small"
        color={role === 'Admin' ? 'error' : role === 'ShelterManager' ? 'primary' : 'default'}
        variant="outlined"
      />
    ));
  };
  if (!isAdmin && !isShelterManager) {
    return (
      <PageContainer>
        <Alert severity="error">
          You do not have permission to access user management.
        </Alert>
      </PageContainer>
    );
  }

  // Add loading state check to prevent rendering issues
  if (isLoading && !usersResponse) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
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
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isAdmin 
              ? 'Manage all users, assign roles, and control access.'
              : 'Manage users in your shelter.'}
          </Typography>
        </Box>

        <StyledPaper>
          <FilterToolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by email..."
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by username..."
                  value={filters.userName}
                  onChange={(e) => handleFilterChange('userName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filters.role}
                    label="Role"
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="ShelterManager">Shelter Manager</MenuItem>
                    <MenuItem value="Member">Member</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs="auto">
                <Tooltip title="Clear filters">
                  <IconButton onClick={clearFilters} color="default">
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs="auto">
                <Tooltip title="Refresh">
                  <IconButton onClick={handleRefresh} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              {(isAdmin || isShelterManager) && (
                <Grid item xs="auto">
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setAssignDialogOpen(true)}
                    sx={{ textTransform: 'none' }}
                  >
                    Add Shelter Manager
                  </Button>
                </Grid>
              )}
            </Grid>
          </FilterToolbar>

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {isAdmin && (
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.key === 'id'}
                        direction={sortConfig.direction}
                        onClick={() => handleSort('id')}
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                  )}
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'email'}
                      direction={sortConfig.direction}
                      onClick={() => handleSort('email')}
                    >
                      User Details
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'userName'}
                      direction={sortConfig.direction}
                      onClick={() => handleSort('userName')}
                    >
                      Username
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'emailConfirmed'}
                      direction={sortConfig.direction}
                      onClick={() => handleSort('emailConfirmed')}
                    >
                      Status
                    </TableSortLabel>                  </TableCell>
                  <TableCell>Shelter</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}
                {error && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} align="center">
                      <Alert severity="error">
                        Failed to load users
                        {error && 'data' in error && (
                          <details style={{ marginTop: 8 }}>
                            <summary>Error details</summary>
                            <pre style={{ fontSize: '0.8em', marginTop: 4 }}>
                              {JSON.stringify(error.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </Alert>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && safeUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {safeUsers.map((user) => (
                  <StyledTableRow key={user.id}>
                    {isAdmin && (
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {user.id.substring(0, 8)}...
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRoleIcon(user.roles)}
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.email}
                          </Typography>
                          {user.phoneNumber && (
                            <InfoChip
                              icon={<PhoneIcon />}
                              label={user.phoneNumber}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.userName || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>{formatRoles(user.roles)}</Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <InfoChip
                          label={user.emailConfirmed ? 'Verified' : 'Unverified'}
                          size="small"
                          color={user.emailConfirmed ? 'success' : 'warning'}
                          variant="outlined"
                        />
                        {user.lockoutEnd && new Date(user.lockoutEnd) > new Date() && (
                          <InfoChip
                            label="Locked"
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {user.shelterName && (
                        <InfoChip
                          icon={<BusinessIcon />}
                          label={user.shelterName}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {isAdmin && (
                          <>
                            <Tooltip title="Edit User Details">
                              <ActionButton
                                size="small"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setEditUserForm({
                                    userName: user.userName || '',
                                    email: user.email || '',
                                    phoneNumber: user.phoneNumber || '',
                                    emailConfirmed: user.emailConfirmed,
                                    lockoutEnabled: user.lockoutEnabled,
                                  });
                                  setEditUserDialogOpen(true);
                                }}
                              >
                                <EditIcon fontSize="small" />                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Edit Role">
                              <ActionButton
                                size="small"
                                onClick={() => {
                                  console.log('Opening role edit for user:', user);
                                  setSelectedUser(user);
                                  const currentRole = user.roles.length > 0 ? user.roles[0] : 'Member';
                                  console.log('Setting role to:', currentRole, 'from roles:', user.roles);
                                  setSelectedRole(currentRole);
                                  setEditRoleDialogOpen(true);
                                }}
                              >
                                <SecurityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Edit Shelter Assignment">
                              <ActionButton
                                size="small"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSelectedNewShelterId(user.shelterId || 0);
                                  setEditShelterDialogOpen(true);
                                }}
                              >
                                <HomeIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <ActionButton
                                className="delete"
                                size="small"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                          </>
                        )}
                        {(isAdmin || isShelterManager) && user.roles.includes('ShelterManager') && user.shelterId && (isAdmin || user.shelterId === currentUserShelterId) && (
                          <Tooltip title="Remove from Shelter">
                            <ActionButton
                              className="remove"
                              size="small"
                              onClick={() => {
                                setSelectedUser(user);
                                setRemoveDialogOpen(true);
                              }}
                            >
                              <PersonRemoveIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))}
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

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{selectedUser?.email}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Shelter Manager Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Assign Shelter Manager</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="User Email"
            type="email"
            value={assignEmail}
            onChange={(e) => setAssignEmail(e.target.value)}
            sx={{ mb: 2 }}
            helperText="Enter the email of the user to assign as shelter manager"
          />
          <FormControl fullWidth>
            <InputLabel>Shelter</InputLabel>
            <Select
              value={selectedShelterId}
              label="Shelter"
              onChange={(e) => setSelectedShelterId(Number(e.target.value))}
            >
              {shelters.map((shelter) => (
                <MenuItem key={shelter.shelterId} value={shelter.shelterId}>
                  {shelter.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAssignShelterManager} 
            color="primary" 
            variant="contained"
            disabled={!assignEmail || !selectedShelterId}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Shelter Manager Dialog */}
      <Dialog open={removeDialogOpen} onClose={() => setRemoveDialogOpen(false)}>
        <DialogTitle>Remove Shelter Manager</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove "{selectedUser?.email}" as a manager from "{selectedUser?.shelterName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRemoveShelterManager} color="warning" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Details Dialog */}
      <Dialog open={editUserDialogOpen} onClose={() => setEditUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={editUserForm.userName}
                onChange={(e) => setEditUserForm(prev => ({ ...prev, userName: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editUserForm.email}
                onChange={(e) => setEditUserForm(prev => ({ ...prev, email: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editUserForm.phoneNumber}
                onChange={(e) => setEditUserForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Email Confirmed</InputLabel>
                <Select
                  value={editUserForm.emailConfirmed ? "true" : "false"}
                  label="Email Confirmed"
                  onChange={(e) =>
                    setEditUserForm(prev => ({
                      ...prev,
                      emailConfirmed: e.target.value === "true"
                    }))
                  }
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Lockout Enabled</InputLabel>
                <Select
                  value={editUserForm.lockoutEnabled}
                  label="Lockout Enabled"
                  onChange={(e) => setEditUserForm(prev => ({ ...prev, lockoutEnabled: Boolean(e.target.value) }))}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUserDetails} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>      {/* Edit User Role Dialog */}
      <Dialog open={editRoleDialogOpen} onClose={() => {
        setEditRoleDialogOpen(false);
        setSelectedUser(null);
        setSelectedRole('');
      }}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Change the role for "{selectedUser?.email}". This will affect their permissions in the system.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole}
              label="Role"
              onChange={(e) => {
                console.log('Role changed to:', e.target.value);
                setSelectedRole(e.target.value);
              }}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="ShelterManager">Shelter Manager</MenuItem>
              <MenuItem value="Member">Member</MenuItem>
            </Select>
          </FormControl>        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditRoleDialogOpen(false);
            setSelectedUser(null);
            setSelectedRole('');
          }}>Cancel</Button>
          <Button 
            onClick={handleUpdateUserRole} 
            color="primary" 
            variant="contained"
            disabled={!selectedRole}
          >
            Update Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Shelter Dialog */}
      <Dialog open={editShelterDialogOpen} onClose={() => setEditShelterDialogOpen(false)}>
        <DialogTitle>Edit Shelter Assignment</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Change the shelter assignment for "{selectedUser?.email}".
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Shelter</InputLabel>
            <Select
              value={selectedNewShelterId}
              label="Shelter"
              onChange={(e) => setSelectedNewShelterId(Number(e.target.value))}
            >
              <MenuItem value={0}>No Shelter</MenuItem>
              {shelters.map((shelter) => (
                <MenuItem key={shelter.shelterId} value={shelter.shelterId}>
                  {shelter.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditShelterDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateUserShelter} 
            color="primary" 
            variant="contained"
          >
            Update Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default UserManagementPage;
