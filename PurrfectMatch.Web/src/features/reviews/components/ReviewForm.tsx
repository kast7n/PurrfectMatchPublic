import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  styled,
  alpha,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import PawRating from './PawRating';
import { CreateReviewDto, UpdateReviewDto, ReviewDto } from '../../../app/models/review';

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReviewDto | UpdateReviewDto) => void;
  loading?: boolean;
  error?: string;
  editingReview?: ReviewDto | null;
  shelterName?: string;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.95)
      : alpha(theme.palette.background.paper, 0.98),
    backdropFilter: 'blur(12px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 24px 48px rgba(0,0,0,0.4)'
      : '0 24px 48px rgba(0,0,0,0.15)',
    minWidth: 400,
    maxWidth: 600,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const RatingSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.3)
    : alpha(theme.palette.background.default, 0.5),
  borderRadius: 12,
  marginBottom: theme.spacing(3),
  textAlign: 'center',
}));

const ReviewForm: React.FC<ReviewFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  error,
  editingReview,
  shelterName,
}) => {
  const [rating, setRating] = useState(editingReview?.rating || 0);
  const [comment, setComment] = useState(editingReview?.comment || '');

  // Update form state when editingReview changes
  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setComment(editingReview.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [editingReview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return; // Rating is required
    }

    if (editingReview) {
      // Update existing review
      onSubmit({
        rating,
        comment,
      } as UpdateReviewDto);
    } else {
      // Create new review (shelterId will be added by parent component)
      onSubmit({
        shelterId: 0, // This will be set by parent
        rating,
        comment,
      } as CreateReviewDto);
    }
  };
  const handleClose = () => {
    // Reset form to initial state
    if (editingReview) {
      setRating(editingReview.rating);
      setComment(editingReview.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
    onClose();
  };

  const isValid = rating > 0;

  return (
    <StyledDialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >        <StyledDialogTitle>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {editingReview ? 'Edit Review' : 'Write a Review'}
            </Typography>
            {shelterName && (
              <Typography variant="body2" color="text.secondary">
                for {shelterName}
              </Typography>
            )}
          </Box>
          <Button
            onClick={handleClose}
            color="inherit"
            size="small"
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </StyledDialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <RatingSection>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                How would you rate this shelter?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click the paws to give your rating
              </Typography>
              <PawRating
                value={rating}
                onChange={setRating}
                size="large"
                showValue
              />
              {rating === 0 && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  Please select a rating
                </Typography>
              )}
            </RatingSection>

            <TextField
              label="Your Review (Optional)"
              placeholder="Share your experience with this shelter..."
              multiline
              rows={4}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </form>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isValid || loading}
            size="large"
            sx={{ 
              borderRadius: 2,
              minWidth: 120,
            }}
          >
            {loading ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </DialogActions>
      </motion.div>
    </StyledDialog>
  );
};

export default ReviewForm;
