import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  styled,
  alpha,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Person,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import PawRating from './PawRating';
import { ReviewDto } from '../../../app/models/review';

interface ReviewCardProps {
  review: ReviewDto;
  currentUserId?: string;
  onEdit?: (review: ReviewDto) => void;
  onDelete?: (reviewId: number) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.3)'
    : '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0,0,0,0.4)'
      : '0 12px 40px rgba(0,0,0,0.15)',
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.palette.text.primary,
}));

const ReviewDate = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginLeft: 'auto',
}));

const CommentText = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  lineHeight: 1.6,
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
}));

const RatingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isOwnReview = currentUserId === review.userId;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(review);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(review.reviewId);
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StyledCard>
        <CardContent sx={{ p: 3 }}>
          <UserInfo>
            <Avatar
              sx={{ 
                mr: 2, 
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
              }}
            >
              <Person />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <UserName>
                {review.userName}
              </UserName>
              <RatingContainer>
                <PawRating 
                  value={review.rating} 
                  readOnly 
                  size="small"
                />
                <Chip
                  label={`${review.rating}/5`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ ml: 1, fontSize: '0.75rem' }}
                />
              </RatingContainer>
            </Box>
            <ReviewDate>
              {formatDate(review.createdAt)}
            </ReviewDate>
            {isOwnReview && (onEdit || onDelete) && (
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 1 }}
              >
                <MoreVert />
              </IconButton>
            )}
          </UserInfo>

          {review.comment && (
            <CommentText>
              {review.comment}
            </CommentText>
          )}

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {onEdit && (
              <MenuItem onClick={handleEdit}>
                <Edit sx={{ mr: 1 }} fontSize="small" />
                Edit Review
              </MenuItem>
            )}
            {onDelete && (
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <Delete sx={{ mr: 1 }} fontSize="small" />
                Delete Review
              </MenuItem>
            )}
          </Menu>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
};

export default ReviewCard;
