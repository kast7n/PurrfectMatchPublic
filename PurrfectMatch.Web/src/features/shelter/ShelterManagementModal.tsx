import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Shelter, UpdateShelterDto } from '../../app/models/shelter';
import { 
  useUpdateShelterMutation, 
  useDeleteShelterMutation,
  useFetchShelterMetricsQuery
} from './shelterApi';

interface ShelterManagementModalProps {
  shelter: Shelter | null;
  open: boolean;
  onClose: () => void;
  onShelterUpdated: () => void;
}

// Styled components
const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  maxHeight: '90vh',
  overflow: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 24px 64px rgba(0,0,0,0.4)'
    : '0 24px 64px rgba(0,0,0,0.15)',
  outline: 'none',
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
  borderRadius: '16px 16px 0 0',
}));

const Content = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const MetricBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  borderRadius: 12,
  background: alpha(theme.palette.primary.main, 0.05),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const ShelterManagementModal: React.FC<ShelterManagementModalProps> = ({
  shelter,
  open,
  onClose,
  onShelterUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateShelterDto>({});

  // API hooks
  const [updateShelter, { isLoading: updateLoading }] = useUpdateShelterMutation();
  const [deleteShelter, { isLoading: deleteLoading }] = useDeleteShelterMutation();
  const { data: metrics } = useFetchShelterMetricsQuery(shelter?.shelterId || 0, {
    skip: !shelter?.shelterId,
  });

  // Reset form when shelter changes
  useEffect(() => {
    if (shelter) {
      setEditForm({
        name: shelter.name,
        description: shelter.description,
        phoneNumber: shelter.phoneNumber,
        email: shelter.email,
        website: shelter.website,
        address: shelter.address,
      });
      setIsEditing(false);
    }
  }, [shelter]);

  const handleSave = async () => {
    if (!shelter) return;

    try {
      await updateShelter({
        id: shelter.shelterId,
        updatedShelter: editForm,
      }).unwrap();
      
      setIsEditing(false);
      onShelterUpdated();
    } catch (error) {
      console.error('Failed to update shelter:', error);
    }
  };

  const handleDelete = async () => {
    if (!shelter) return;

    try {
      await deleteShelter(shelter.shelterId).unwrap();
      setDeleteDialogOpen(false);
      onClose();
      onShelterUpdated();
    } catch (error) {
      console.error('Failed to delete shelter:', error);
    }
  };

  const handleCancel = () => {
    if (shelter) {
      setEditForm({
        name: shelter.name,
        description: shelter.description,
        phoneNumber: shelter.phoneNumber,
        email: shelter.email,
        website: shelter.website,
        address: shelter.address,
      });
    }
    setIsEditing(false);
  };

  if (!shelter) return null;

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalContainer>
          <Header>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Shelter Management
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  ID: #{shelter.shelterId} • {shelter.name}
                </Typography>
              </Box>
              <IconButton
                onClick={onClose}
                sx={{ color: 'inherit' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Header>

          <Content>
            {/* Shelter Metrics */}
            {metrics && (
              <StyledPaper>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Shelter Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MetricBox>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {metrics.totalPets}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Pets
                      </Typography>
                    </MetricBox>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <MetricBox>
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {metrics.availablePets}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Available
                      </Typography>
                    </MetricBox>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <MetricBox>
                      <Typography variant="h4" fontWeight={700} color="info.main">
                        {metrics.adoptedPets}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Adopted
                      </Typography>
                    </MetricBox>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <MetricBox>
                      <Typography variant="h4" fontWeight={700} color="secondary.main">
                        {metrics.followerCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Followers
                      </Typography>
                    </MetricBox>
                  </Grid>
                </Grid>
              </StyledPaper>
            )}

            {/* Shelter Information */}
            <StyledPaper>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Shelter Information
                </Typography>
                <Box>
                  {isEditing ? (
                    <>
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={updateLoading}
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        {updateLoading ? <CircularProgress size={16} /> : 'Save'}
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        variant="outlined"
                        size="small"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Shelter Name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={editForm.phoneNumber || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={editForm.website || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!isEditing}
                    multiline
                    rows={3}
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Address Information */}
              {(shelter.address || isEditing) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Address Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={editForm.address?.street || ''}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, street: e.target.value }
                        }))}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="City"
                        value={editForm.address?.city || ''}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="State"
                        value={editForm.address?.state || ''}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, state: e.target.value }
                        }))}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Postal Code"
                        value={editForm.address?.postalCode || ''}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, postalCode: e.target.value }
                        }))}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </StyledPaper>
          </Content>
        </ModalContainer>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Delete Shelter
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All data associated with this shelter will be permanently removed.
          </Alert>
          <Typography>
            Are you sure you want to delete <strong>{shelter.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShelterManagementModal;
