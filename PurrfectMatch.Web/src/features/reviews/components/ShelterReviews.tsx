import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  styled,
  alpha,
} from '@mui/material';
import {
  Add,
  RateReview,
  Star,
} from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import { useUserInfoQuery } from '../../account/accountApi';
import PawRating from './PawRating';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import {
  useGetShelterReviewsQuery,
  useGetShelterAverageRatingQuery,
  useGetUserReviewForShelterQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from '../reviewsApi';
import {
  ReviewDto,
  CreateReviewDto,
  UpdateReviewDto,
} from '../../../app/models/review';

interface ShelterReviewsProps {
  shelterId: number;
  shelterName: string;
}

const SectionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 12px 40px rgba(0,0,0,0.3)'
    : '0 12px 40px rgba(0,0,0,0.1)',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const RatingOverview = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.3)
    : alpha(theme.palette.background.default, 0.5),
  borderRadius: 16,
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center',
    gap: theme.spacing(2),
  },
}));

const RatingNumber = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 800,
  color: theme.palette.primary.main,
  lineHeight: 1,
}));

const ReviewsGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const ShelterReviews: React.FC<ShelterReviewsProps> = ({
  shelterId,
  shelterName,
}) => {  const [formOpen, setFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewDto | null>(null);
  // Get current user from account API
  const { data: currentUser } = useUserInfoQuery();
  const isAuthenticated = !!currentUser;
  // API queries
  const { 
    data: reviews = [], 
    isLoading: reviewsLoading,
    refetch: refetchReviews
  } = useGetShelterReviewsQuery(shelterId);

  const { 
    data: ratingStats,
    refetch: refetchRatingStats
  } = useGetShelterAverageRatingQuery(shelterId);
  const { 
    data: userReview,
    refetch: refetchUserReview
  } = useGetUserReviewForShelterQuery(
    { userId: currentUser?.id || '', shelterId },
    { skip: !isAuthenticated || !currentUser?.id }
  );
  // Mutations
  const [createReview, { isLoading: creating, error: createError }] = useCreateReviewMutation();
  const [updateReview, { isLoading: updating, error: updateError }] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleCreateReview = () => {
    setEditingReview(null);
    setFormOpen(true);
  };

  const handleEditReview = (review: ReviewDto) => {
    setEditingReview(review);
    setFormOpen(true);
  };
  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId).unwrap();
        
        // Manually refetch all related data to ensure UI is updated
        await Promise.all([
          refetchReviews(),
          refetchRatingStats(),
          refetchUserReview(),
        ]);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };  const handleSubmitReview = async (data: CreateReviewDto | UpdateReviewDto) => {
    try {
      if (editingReview) {
        // Update existing review
        await updateReview({
          reviewId: editingReview.reviewId,
          data: data as UpdateReviewDto,
          shelterId, // Pass shelterId for proper cache invalidation
        }).unwrap();
      } else {
        // Create new review
        await createReview({
          ...data as CreateReviewDto,
          shelterId,
        }).unwrap();
      }
      
      // Manually refetch all related data to ensure UI is updated
      await Promise.all([
        refetchReviews(),
        refetchRatingStats(),
        refetchUserReview(),
      ]);
      
      setFormOpen(false);
      setEditingReview(null);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const canWriteReview = isAuthenticated && !userReview;
  const hasReviews = reviews.length > 0;

  if (reviewsLoading) {
    return (
      <SectionContainer>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <RateReview color="primary" sx={{ fontSize: '2rem' }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Reviews & Ratings
          </Typography>
        </Box>
        {canWriteReview && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateReview}
            sx={{ 
              borderRadius: 3,
              px: 3,
            }}
          >
            Write Review
          </Button>
        )}
      </SectionHeader>

      {ratingStats && (
        <RatingOverview>
          <Box display="flex" flexDirection="column" alignItems="center">
            <RatingNumber>
              {ratingStats.averageRating > 0 ? ratingStats.averageRating.toFixed(1) : '0.0'}
            </RatingNumber>
            <PawRating 
              value={Math.round(ratingStats.averageRating)} 
              readOnly 
              size="medium"
            />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {ratingStats.count} {ratingStats.count === 1 ? 'Review' : 'Reviews'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on user experiences
            </Typography>
          </Box>
        </RatingOverview>
      )}

      {!isAuthenticated && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Please log in to write a review for this shelter.
        </Alert>
      )}

      {userReview && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Your Review
          </Typography>
          <ReviewCard
            review={userReview}
            currentUserId={currentUser?.id}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        </Box>
      )}

      {hasReviews ? (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            All Reviews ({reviews.length})
          </Typography>
          <ReviewsGrid>
            <AnimatePresence>
              {reviews
                .filter(review => review.reviewId !== userReview?.reviewId)
                .map((review) => (
                  <ReviewCard
                    key={review.reviewId}
                    review={review}
                    currentUserId={currentUser?.id}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                  />
                ))}
            </AnimatePresence>
          </ReviewsGrid>
        </Box>
      ) : !userReview ? (
        <Box textAlign="center" py={4}>
          <Star sx={{ fontSize: '4rem', color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No reviews yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to share your experience with this shelter!
          </Typography>
        </Box>
      ) : null}

      <ReviewForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingReview(null);
        }}
        onSubmit={handleSubmitReview}
        loading={creating || updating}
        error={createError || updateError ? 'Failed to submit review. Please try again.' : undefined}
        editingReview={editingReview}
        shelterName={shelterName}
      />
    </SectionContainer>
  );
};

export default ShelterReviews;
