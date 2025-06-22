import React from 'react';
import { Box, IconButton, Typography, styled } from '@mui/material';
import { Pets } from '@mui/icons-material';

interface PawRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
}

const PawContainer = styled(Box)<{ size: 'small' | 'medium' | 'large' }>(({ theme, size }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: size === 'small' ? theme.spacing(0.5) : size === 'medium' ? theme.spacing(1) : theme.spacing(1.5),
}));

const PawButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['filled', 'readOnly'].includes(prop as string),
})<{ 
  filled: boolean; 
  size: 'small' | 'medium' | 'large';
  readOnly: boolean;
}>(({ theme, filled, size, readOnly }) => ({
  padding: size === 'small' ? 2 : size === 'medium' ? 4 : 6,
  transition: 'all 0.2s ease-in-out',
  cursor: readOnly ? 'default' : 'pointer',
  '&:hover': readOnly ? {} : {
    transform: 'scale(1.1)',
    '& .MuiSvgIcon-root': {
      color: theme.palette.warning.main,
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: size === 'small' ? '1.2rem' : size === 'medium' ? '1.5rem' : '2rem',
    color: filled 
      ? theme.palette.warning.main 
      : theme.palette.action.disabled,
    transition: 'color 0.2s ease-in-out',
  },
}));

const RatingText = styled(Typography)<{ size: 'small' | 'medium' | 'large' }>(({ theme, size }) => ({
  marginLeft: theme.spacing(1),
  fontWeight: 600,
  fontSize: size === 'small' ? '0.875rem' : size === 'medium' ? '1rem' : '1.125rem',
  color: theme.palette.text.secondary,
}));

const PawRating: React.FC<PawRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'medium',
  showValue = false,
}) => {
  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <PawContainer size={size}>      {[1, 2, 3, 4, 5].map((star) => (
        <PawButton
          key={star}
          filled={star <= value}
          size={size}
          readOnly={readOnly}
          onClick={() => handleClick(star)}
          disabled={readOnly}
        >
          <Pets />
        </PawButton>
      ))}
      {showValue && (
        <RatingText size={size}>
          {value > 0 ? `${value}/5` : 'No rating'}
        </RatingText>
      )}
    </PawContainer>
  );
};

export default PawRating;
