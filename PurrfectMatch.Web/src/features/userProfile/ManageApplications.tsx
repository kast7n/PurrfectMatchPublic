import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  Divider,
  Grid,
  styled,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Cancel as CancelIcon,
  Pets as PetsIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useUserInfoQuery } from '../account/accountApi';
import { 
  useFetchUserAdoptionApplicationsQuery, 
  useUpdateAdoptionApplicationStatusMutation 
} from '../adoptionApplication/adoptionApplicationApi';
import { useFetchPetByIdQuery } from '../pet/petApi';
import { AdoptionApplicationDto, ApplicationStatusDto } from '../../app/models/AdoptionApplication';
import { toast } from 'react-toastify';

// Styled components following the app's design patterns
const ApplicationsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const ApplicationCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 107, 107, 0.1)'
    : '1px solid rgba(255, 107, 107, 0.05)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0, 0, 0, 0.4)'
      : '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #FF6B6B 0%, #FBBF24 100%)'
    : 'linear-gradient(135deg, #FF6B6B 0%, #FFD166 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const PetNameText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const DateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

// Status color mapping
const getStatusColor = (status: ApplicationStatusDto) => {
  switch (status) {
    case ApplicationStatusDto.Pending:
      return { color: 'warning', label: 'Pending Review' };
    case ApplicationStatusDto.Approved:
      return { color: 'success', label: 'Approved' };
    case ApplicationStatusDto.Rejected:
      return { color: 'error', label: 'Not Approved' };
    case ApplicationStatusDto.Withdrawn:
      return { color: 'default', label: 'Withdrawn' };
    default:
      return { color: 'default', label: 'Unknown' };
  }
};

interface ApplicationMenuProps {
  application: AdoptionApplicationDto;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onWithdraw: (applicationId: number) => void;
}

interface ApplicationItemProps {
  application: AdoptionApplicationDto;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, application: AdoptionApplicationDto) => void;
}

const ApplicationItem: React.FC<ApplicationItemProps> = ({ application, onMenuOpen }) => {
  const { data: pet, isLoading: petLoading } = useFetchPetByIdQuery(application.petId);
  const statusConfig = getStatusColor(application.status);

  if (petLoading) {
    return (
      <ListItem sx={{ p: 0, mb: 2 }}>
        <ApplicationCard sx={{ width: '100%' }}>
          <CardContent>
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
            </Box>
          </CardContent>
        </ApplicationCard>
      </ListItem>
    );
  }

  return (
    <ListItem sx={{ p: 0, mb: 2 }}>
      <ApplicationCard sx={{ width: '100%' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <PetNameText variant="h6">
                <PetsIcon color="primary" />
                {pet?.name || `Pet #${application.petId}`}
              </PetNameText>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                label={statusConfig.label}
                color={statusConfig.color as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                variant="filled"
                size="small"
                sx={{
                  fontWeight: 500,
                  minWidth: '120px',
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <DateText>
                <CalendarIcon fontSize="small" />
                Submitted: {new Date(application.createdAt).toLocaleDateString()}
              </DateText>
            </Grid>
            
            <Grid item xs={12} sm={6} md={1}>
              <Box display="flex" justifyContent="flex-end">
                {application.status === ApplicationStatusDto.Pending && (
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuOpen(e, application)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </ApplicationCard>
    </ListItem>
  );
};

const ApplicationMenu: React.FC<ApplicationMenuProps> = ({
  application,
  anchorEl,
  onClose,
  onWithdraw,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {application.status === ApplicationStatusDto.Pending && (
        <MenuItem onClick={() => onWithdraw(application.id)} sx={{ color: 'error.main' }}>
          <CancelIcon sx={{ mr: 1 }} />
          Withdraw Application
        </MenuItem>
      )}
    </Menu>
  );
};

const ManageApplications: React.FC = () => {
  const { data: user, isLoading: userLoading } = useUserInfoQuery();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<AdoptionApplicationDto | null>(null);
  // Fetch user's adoption applications
  const { 
    data: applications, 
    isLoading: applicationsLoading, 
    error: applicationsError,
    refetch: refetchApplications
  } = useFetchUserAdoptionApplicationsQuery(
    user?.id || '',
    { skip: !user?.id }
  );
  const [updateApplicationStatus] = useUpdateAdoptionApplicationStatusMutation();

  const isLoading = userLoading || applicationsLoading;

  // Debug logging
  console.log('ManageApplications Debug:', {
    user,
    userLoading,
    applications,
    applicationsLoading,
    applicationsError,
    isLoading
  });
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, application: AdoptionApplicationDto) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplication(application);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApplication(null);
  };
  const handleWithdraw = async (applicationId: number) => {
    try {
      await updateApplicationStatus({
        id: applicationId,
        status: ApplicationStatusDto.Withdrawn
      }).unwrap();
      
      toast.success('Application withdrawn successfully');
      refetchApplications();
      handleMenuClose();
    } catch (error) {
      toast.error('Failed to withdraw application');
      console.error('Error withdrawing application:', error);
    }
  };
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (applicationsError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load applications. Please try again later.
      </Alert>
    );
  }

  return (
    <ApplicationsContainer>
      <SectionTitle variant="h5">
        <PetsIcon />
        My Adoption Applications
      </SectionTitle>

      {(applications || []).length === 0 ? (
        <Alert severity="info">
          You haven't submitted any adoption applications yet. Browse our pets to get started!
        </Alert>      ) : (        <List sx={{ p: 0 }}>
          {(applications || []).map((application, index) => (            <React.Fragment key={application.id}>
              <ApplicationItem
                application={application}
                onMenuOpen={handleMenuOpen}
              />
              {index < (applications || []).length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      )}      {selectedApplication && (
        <ApplicationMenu
          application={selectedApplication}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          onWithdraw={handleWithdraw}
        />
      )}
    </ApplicationsContainer>
  );
};

export default ManageApplications;
