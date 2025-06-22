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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  styled,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Base interfaces for attribute management
export interface BaseAttribute {
  id: number;
  name: string;
}

export interface BaseAttributeFormData {
  name: string;
}

interface AttributeManagementPageProps<T extends BaseAttribute> {
  title: string;
  subtitle: string;
  data: T[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRefresh: () => void;
  onCreate: (data: BaseAttributeFormData) => void;
  onUpdate: (id: number, data: BaseAttributeFormData) => void;
  onDelete: (id: number) => void;
  createLoading?: boolean;
  updateLoading?: boolean;
  deleteLoading?: boolean;
  getDisplayValue?: (item: T) => string;
  getIdValue?: (item: T) => number;
  validateForm?: (data: BaseAttributeFormData) => string | null;
  extraFormFields?: (
    formData: Record<string, unknown>,
    onChange: (field: string, value: unknown) => void,
    editingItem?: T | null
  ) => React.ReactNode;
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

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  '&.primary': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
  },
  transition: 'all 0.2s ease',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.04),
  },
  transition: 'background-color 0.2s ease',
}));

function AttributeManagementPage<T extends BaseAttribute>({
  title,
  subtitle,
  data,
  isLoading,
  error,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
  createLoading = false,
  updateLoading = false,
  deleteLoading = false,
  getDisplayValue = (item) => item.name,
  getIdValue = (item) => item.id,
  validateForm,
  extraFormFields,
}: AttributeManagementPageProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({ name: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);  const handleOpenModal = (item?: T) => {
    if (item) {
      setEditingItem(item);
      const baseData = { name: getDisplayValue(item) };
      // Add any additional properties from the item
      const additionalData = { ...item } as Record<string, unknown>;
      setFormData({ ...baseData, ...additionalData });
    } else {
      setEditingItem(null);
      setFormData({ name: '' });
    }
    setFormError(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({ name: '' });
    setFormError(null);
  };  const handleFormSubmit = () => {
    setFormError(null);
    
    // Validate name field exists and is a string
    if (!formData.name || typeof formData.name !== 'string' || !formData.name.trim()) {
      setFormError('Name is required');
      return;
    }

    // Pass the entire formData object (cast to match expected interface)
    const submissionData = formData as unknown as BaseAttributeFormData;

    if (validateForm) {
      const error = validateForm(submissionData);
      if (error) {
        setFormError(error);
        return;
      }
    }

    if (editingItem) {
      onUpdate(getIdValue(editingItem), submissionData);
    } else {
      onCreate(submissionData);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      onDelete(getIdValue(itemToDelete));
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };
  const handleFormFieldChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (error) {
    return (
      <PageContainer>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load {title.toLowerCase()}. Please try again.
        </Alert>
        <Button onClick={onRefresh} startIcon={<RefreshIcon />}>
          Retry
        </Button>
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
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={onRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
            <ActionButton
              className="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
            >
              Add New
            </ActionButton>
          </Box>
        </Box>

        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : data && data.length > 0 ? (
                  data.map((item) => (
                    <StyledTableRow key={getIdValue(item)}>
                      <TableCell>{getIdValue(item)}</TableCell>
                      <TableCell>{getDisplayValue(item)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleOpenModal(item)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(item)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No {title.toLowerCase()} found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* Create/Edit Modal */}
        <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingItem ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
          </DialogTitle>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => handleFormFieldChange('name', e.target.value)}
              margin="normal"
              required
            />

            {extraFormFields && extraFormFields(formData, handleFormFieldChange, editingItem)}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              disabled={createLoading || updateLoading}
            >
              {createLoading || updateLoading ? (
                <CircularProgress size={20} />
              ) : editingItem ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{itemToDelete ? getDisplayValue(itemToDelete) : ''}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleteLoading}
            >
              {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </PageContainer>
  );
}

export default AttributeManagementPage;
