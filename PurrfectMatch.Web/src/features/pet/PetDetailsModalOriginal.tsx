import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import { keyframes, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PetsIcon from '@mui/icons-material/Pets';
import { Pet } from '../../app/models/pet';

// Enhanced Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.8) rotate(-5deg); 
    filter: blur(10px);
  }
  to { 
    opacity: 1; 
    transform: scale(1) rotate(0deg); 
    filter: blur(0px);
  }
`;

const slideInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(50px) scale(0.9); 
    filter: blur(5px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
    filter: blur(0px);
  }
`;

const rainbow = keyframes`
  0% { filter: hue-rotate(0deg) saturate(1.2) brightness(1.1); }
  25% { filter: hue-rotate(90deg) saturate(1.3) brightness(1.2); }
  50% { filter: hue-rotate(180deg) saturate(1.4) brightness(1.3); }
  75% { filter: hue-rotate(270deg) saturate(1.3) brightness(1.2); }
  100% { filter: hue-rotate(360deg) saturate(1.2) brightness(1.1); }
`;

const pulse = keyframes`
  0% { 
    transform: scale(1); 
    box-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
  }
  50% { 
    transform: scale(1.05); 
    box-shadow: 0 0 50px rgba(255, 107, 107, 0.6);
  }
  100% { 
    transform: scale(1); 
    box-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const glow = keyframes`
  0% { 
    box-shadow: 
      0 0 20px rgba(255, 107, 107, 0.4),
      0 0 40px rgba(238, 90, 36, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 40px rgba(255, 107, 107, 0.8),
      0 0 80px rgba(238, 90, 36, 0.6),
      inset 0 0 30px rgba(255, 255, 255, 0.2);
  }
  100% { 
    box-shadow: 
      0 0 20px rgba(255, 107, 107, 0.4),
      0 0 40px rgba(238, 90, 36, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
`;

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95vw',
  maxWidth: '1200px',
  height: '95vh',
  maxHeight: '900px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '25px',
  boxShadow: `
    0 25px 50px rgba(0,0,0,0.25),
    0 0 100px rgba(255, 107, 107, 0.3),
    inset 0 0 50px rgba(255, 255, 255, 0.1)
  `,
  padding: 0,
  animation: `${fadeIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
  display: 'flex',
  flexDirection: 'column',
  border: `3px solid transparent`,
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box,
       linear-gradient(135deg, #ff6b6b, #ee5a24, #ff9ff3, #54a0ff) border-box`
    : `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box,
       linear-gradient(135deg, #ff6b6b, #ee5a24, #ff9ff3, #54a0ff) border-box`,
  overflow: 'hidden',
  // Mobile responsiveness
  [theme.breakpoints.down('md')]: {
    width: '95vw',
    height: '95vh',
    borderRadius: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '98vw',
    height: '98vh',
    borderRadius: '15px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    background: `linear-gradient(135deg, 
      #ff6b6b 0%, 
      #ee5a24 25%, 
      #ff9ff3 50%, 
      #54a0ff 75%, 
      #5f27cd 100%
    )`,
    borderRadius: '25px',
    zIndex: -1,
    animation: `${rainbow} 4s ease-in-out infinite`,
    [theme.breakpoints.down('md')]: {
      borderRadius: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: '15px',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 30% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 60%)'
      : 'radial-gradient(circle at 30% 20%, rgba(255, 107, 107, 0.05) 0%, transparent 60%)',
    borderRadius: '25px',
    zIndex: 0,
    pointerEvents: 'none',
    [theme.breakpoints.down('md')]: {
      borderRadius: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: '15px',
    },
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 30px',
  borderBottom: `2px solid transparent`,
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(135deg, 
        rgba(255, 107, 107, 0.3) 0%, 
        rgba(238, 90, 36, 0.3) 50%, 
        rgba(255, 159, 243, 0.3) 100%
      )` 
    : `linear-gradient(135deg, 
        rgba(255, 107, 107, 0.2) 0%, 
        rgba(238, 90, 36, 0.2) 50%, 
        rgba(255, 159, 243, 0.2) 100%
      )`,
  borderRadius: '25px 25px 0 0',
  position: 'relative',
  zIndex: 2,
  animation: `${glow} 3s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, 
      #ff6b6b 0%, 
      #ee5a24 25%, 
      #ff9ff3 50%, 
      #54a0ff 75%, 
      #5f27cd 100%
    )`,
    animation: `${shimmer} 2s ease-in-out infinite`,
  },
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '28px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #ff6b6b, #ee5a24, #ff9ff3, #54a0ff)'
    : 'linear-gradient(45deg, #ff6b6b, #ee5a24, #ff9ff3, #54a0ff)',
  backgroundSize: '400% 400%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  animation: `${rainbow} 3s ease-in-out infinite, ${float} 2s ease-in-out infinite`,
  textShadow: theme.palette.mode === 'dark'
    ? '0 0 30px rgba(255, 107, 107, 0.5)'
    : '0 0 20px rgba(255, 107, 107, 0.3)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    height: '3px',
    background: `linear-gradient(90deg, 
      transparent 0%, 
      #ff6b6b 25%, 
      #ee5a24 50%, 
      #ff9ff3 75%, 
      transparent 100%
    )`,
    borderRadius: '2px',
    animation: `${pulse} 2s ease-in-out infinite`,
  },
}));

const ModalContentArea = styled(Box)(({ theme }) => ({
  padding: '20px 30px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden', // Remove scrolling
  height: 'calc(100% - 160px)', // Account for header and footer
  // Mobile responsiveness
  [theme.breakpoints.down('md')]: {
    padding: '15px 20px',
    height: 'calc(100% - 140px)',
    overflowY: 'auto', // Allow scrolling on mobile
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 15px',
    height: 'calc(100% - 120px)',
  },
}));

const ImageSlideshowContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  height: '45%', // Fixed height for better layout
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(135deg, #2c3e50, #3498db, #9b59b6)` 
    : `linear-gradient(135deg, #ff9a9e, #fecfef, #a8edea, #fed6e3)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `
    0 15px 35px rgba(0,0,0,0.1),
    0 0 50px rgba(255, 107, 107, 0.2),
    inset 0 0 30px rgba(255, 255, 255, 0.1)
  `,
  border: `2px solid transparent`,
  backgroundClip: 'padding-box',
  animation: `${glow} 4s ease-in-out infinite`,
  // Mobile responsiveness
  [theme.breakpoints.down('md')]: {
    height: '40%',
    borderRadius: '15px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '35%',
    borderRadius: '12px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    background: `linear-gradient(135deg, 
      #ff6b6b 0%, 
      #ee5a24 25%, 
      #ff9ff3 50%, 
      #54a0ff 75%, 
      #5f27cd 100%
    )`,
    borderRadius: '22px',
    zIndex: -1,
    animation: `${rainbow} 6s linear infinite`,
    [theme.breakpoints.down('md')]: {
      borderRadius: '17px',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: '14px',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent)'
      : 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
    transform: 'rotate(45deg)',
    animation: `${shimmer} 3s ease-in-out infinite`,
    pointerEvents: 'none',
  },
}));

const SlideImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  animation: `${fadeIn} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)`,
  borderRadius: '18px',
  position: 'relative',
  zIndex: 1,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    filter: 'brightness(1.1) contrast(1.1)',
  },
});

const PlaceholderEmoji = styled(Typography)({
  fontSize: '120px',
  animation: `${float} 3s ease-in-out infinite, ${pulse} 2s ease-in-out infinite`,
  filter: 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.5))',
  position: 'relative',
  zIndex: 1,
});

const SlideNavButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 107, 107, 0.8)',
  color: 'white',
  width: '50px',
  height: '50px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: 'rgba(238, 90, 36, 0.9)',
    transform: 'translateY(-50%) scale(1.1)',
    boxShadow: '0 0 30px rgba(255, 107, 107, 0.8)',
  },
  zIndex: 2,
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  animation: `${pulse} 3s ease-in-out infinite`,
}));

const DotsContainer = styled(Box)({
  position: 'absolute',
  bottom: '15px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '12px',
  padding: '8px 16px',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  borderRadius: '25px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
});

const Dot = styled(Box)<{ active?: boolean }>(({ active }) => ({
  width: active ? '20px' : '12px',
  height: '12px',
  borderRadius: '6px',
  backgroundColor: active ? '#ff6b6b' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  boxShadow: active ? '0 0 15px rgba(255, 107, 107, 0.8)' : 'none',
  animation: active ? `${pulse} 2s ease-in-out infinite` : 'none',
  '&:hover': {
    backgroundColor: '#ff6b6b',
    transform: 'scale(1.2)',
    boxShadow: '0 0 20px rgba(255, 107, 107, 0.9)',
  },
}));

const PetInfoGrid = styled(Grid)(() => ({
  animation: `${slideInUp} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s`,
  animationFillMode: 'forwards',
  opacity: 0,
  height: '30%', // Fixed height
  marginTop: '20px',
}));

const InfoItem = styled(Paper)(({ theme }) => ({
  padding: '12px',
  textAlign: 'center',
  borderRadius: '15px',
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(135deg, rgba(66, 66, 66, 0.8), rgba(97, 97, 97, 0.8))` 
    : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.9))`,
  boxShadow: `
    0 4px 15px rgba(0,0,0,0.1),
    0 0 20px rgba(255, 107, 107, 0.1)
  `,
  height: '80px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid transparent`,
  backgroundClip: 'padding-box',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  animation: `${float} 3s ease-in-out infinite`,
  '&:hover': {
    transform: 'translateY(-5px) scale(1.05)',
    boxShadow: `
      0 8px 25px rgba(0,0,0,0.15),
      0 0 30px rgba(255, 107, 107, 0.3)
    `,
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(238, 90, 36, 0.2))` 
      : `linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1))`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-1px',
    left: '-1px',
    right: '-1px',
    bottom: '-1px',
    background: `linear-gradient(135deg, 
      #ff6b6b 0%, 
      #ee5a24 25%, 
      #ff9ff3 50%, 
      #54a0ff 75%, 
      #5f27cd 100%
    )`,
    borderRadius: '16px',
    zIndex: -1,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.text.secondary,
  marginBottom: '4px',
  textTransform: 'uppercase',
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const DescriptionBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '20px',
  borderRadius: '15px',
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(135deg, rgba(66, 66, 66, 0.8), rgba(97, 97, 97, 0.8))` 
    : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.9))`,
  animation: `${slideInUp} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s`,
  animationFillMode: 'forwards',
  opacity: 0,
  border: `2px solid transparent`,
  backgroundClip: 'padding-box',
  position: 'relative',
  marginTop: '20px',
  boxShadow: `
    0 4px 15px rgba(0,0,0,0.1),
    0 0 20px rgba(255, 107, 107, 0.1)
  `,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    background: `linear-gradient(135deg, 
      #ff6b6b 0%, 
      #ee5a24 25%, 
      #ff9ff3 50%, 
      #54a0ff 75%, 
      #5f27cd 100%
    )`,
    borderRadius: '17px',
    zIndex: -1,
    opacity: 0.3,
    animation: `${rainbow} 8s linear infinite`,
  },
}));

const ModalActions = styled(Box)(({ theme }) => ({
  padding: '20px 30px',
  borderTop: `2px solid transparent`,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '16px',
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(135deg, 
        rgba(255, 107, 107, 0.1) 0%, 
        rgba(238, 90, 36, 0.1) 50%, 
        rgba(255, 159, 243, 0.1) 100%
      )` 
    : `linear-gradient(135deg, 
        rgba(255, 107, 107, 0.05) 0%, 
        rgba(238, 90, 36, 0.05) 50%, 
        rgba(255, 159, 243, 0.05) 100%
      )`,
  borderRadius: '0 0 25px 25px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, 
      #ff6b6b 0%, 
      #ee5a24 25%, 
      #ff9ff3 50%, 
      #54a0ff 75%, 
      #5f27cd 100%
    )`,
    animation: `${shimmer} 2s ease-in-out infinite reverse`,
  },
}));

const AdoptButtonStyled = styled(Button)(() => ({
  background: `linear-gradient(135deg, 
    #ff6b6b 0%, 
    #ee5a24 25%, 
    #ff9ff3 50%, 
    #54a0ff 75%, 
    #5f27cd 100%
  )`,
  backgroundSize: '400% 400%',
  color: 'white',
  fontWeight: 700,
  fontSize: '16px',
  padding: '12px 30px',
  borderRadius: '25px',
  border: '2px solid transparent',
  position: 'relative',
  overflow: 'hidden',
  textTransform: 'none',
  animation: `${rainbow} 3s ease-in-out infinite, ${float} 2s ease-in-out infinite`,
  boxShadow: `
    0 8px 25px rgba(255, 107, 107, 0.4),
    0 0 40px rgba(255, 107, 107, 0.3)
  `,
  '&:hover': {
    transform: 'translateY(-3px) scale(1.05)',
    boxShadow: `
      0 15px 40px rgba(255, 107, 107, 0.6),
      0 0 60px rgba(255, 107, 107, 0.5)
    `,
    animation: `${rainbow} 1s ease-in-out infinite, ${pulse} 0.5s ease-in-out infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease',
  },
  '&:hover::before': {
    width: '300px',
    height: '300px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
    transform: 'rotate(45deg)',
    animation: `${shimmer} 2s ease-in-out infinite`,
  },
}));

const EditButtonStyled = styled(Button)(() => ({
  background: 'transparent',
  border: `2px solid #ff6b6b`,
  color: '#ff6b6b',
  fontWeight: 600,
  padding: '10px 20px',
  borderRadius: '20px',
  position: 'relative',
  overflow: 'hidden',
  textTransform: 'none',
  animation: `${float} 3s ease-in-out infinite`,
  '&:hover': {
    background: `linear-gradient(135deg, #ff6b6b, #ee5a24)`,
    color: 'white',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: `0 8px 25px rgba(255, 107, 107, 0.4)`,
    borderColor: '#ee5a24',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease',
  },
  '&:hover::before': {
    width: '200px',
    height: '200px',
  },
}));


interface PetDetailsModalProps {
  pet: Pet | null;
  open: boolean;
  onClose: () => void;
  isShelterManager?: boolean; // Optional: to show Edit button
}

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({ pet, open, onClose, isShelterManager }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!pet) return null;

  const {
    name,
    age,
    gender,
    speciesName,
    breedName,
    description,
    photoUrls = [],
    isAdopted,
    coatLength,
    color,
    activityLevel,
    healthStatus,
    size,
    // Assuming shelter info might be part of pet object or fetched separately
    // shelterName, 
    // shelterContact,
  } = pet;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (photoUrls.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + (photoUrls.length || 1)) % (photoUrls.length || 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  const getPetEmoji = () => {
    const lowerSpeciesName = speciesName?.toLowerCase() || '';
    if (lowerSpeciesName.includes('dog')) return '🐕';
    if (lowerSpeciesName.includes('cat')) return '🐱';
    if (lowerSpeciesName.includes('rabbit') || lowerSpeciesName.includes('bunny')) return '🐰';
    if (lowerSpeciesName.includes('bird')) return '🦜';
    return '🐾';
  };

  const petAttributes = [
    { label: 'Age', value: `${age} ${parseInt(age as string, 10) === 1 ? 'year' : 'years'}` },
    { label: 'Gender', value: gender },
    { label: 'Species', value: speciesName },
    { label: 'Breed', value: breedName },
    { label: 'Size', value: size },
    { label: 'Coat', value: coatLength },
    { label: 'Color', value: color },
    { label: 'Activity', value: activityLevel },
    { label: 'Health', value: healthStatus },
  ].filter(attr => attr.value); // Filter out attributes with no value

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="pet-details-title"
      aria-describedby="pet-details-description"
      closeAfterTransition
    >
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id="pet-details-title">{name} {isAdopted && <Chip label="Adopted" color="error" size="small" sx={{ ml: 1 }} />}</ModalTitle>
          <Box>
            {isShelterManager && (
              <EditButtonStyled
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => console.log(`Edit pet ${pet.petId}`)} // Corrected string interpolation
                sx={{ mr: 1 }}
              >
                Edit Pet
              </EditButtonStyled>
            )}
            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </ModalHeader>        <ModalContentArea>
          <ImageSlideshowContainer>
            {photoUrls && photoUrls.length > 0 ? (
              <>
                <SlideImage src={photoUrls[currentImageIndex]} alt={`${name} - image ${currentImageIndex + 1}`} /> {/* Corrected string interpolation */}
                {photoUrls.length > 1 && (
                  <>
                    <SlideNavButton onClick={handlePrevImage} sx={{ left: 12 }}>
                      <ArrowBackIosNewIcon fontSize="small" />
                    </SlideNavButton>
                    <SlideNavButton onClick={handleNextImage} sx={{ right: 12 }}>
                      <ArrowForwardIosIcon fontSize="small" />
                    </SlideNavButton>
                    <DotsContainer>
                      {photoUrls.map((_, index) => (
                        <Dot key={index} active={index === currentImageIndex} onClick={() => handleDotClick(index)} />
                      ))}
                    </DotsContainer>
                  </>
                )}
              </>
            ) : (
              <PlaceholderEmoji>{getPetEmoji()}</PlaceholderEmoji>
            )}
          </ImageSlideshowContainer>

          <PetInfoGrid container spacing={2}>
            {petAttributes.map(attr => (
              <Grid item xs={6} sm={4} md={2.4} key={attr.label}>
                <InfoItem elevation={2}>
                  <InfoLabel>{attr.label}</InfoLabel>
                  <InfoValue>{attr.value}</InfoValue>
                </InfoItem>
              </Grid>
            ))}
             {/* Special chip for health status if it's "Special Needs" */}
             {healthStatus === "Special Needs" && !isAdopted && (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Chip 
                  label="💖 Special Needs Pet" 
                  sx={{ 
                    backgroundColor: '#ff6b6b', 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    animation: `${pulse} 2s ease-in-out infinite`,
                    boxShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
                  }} 
                />
              </Grid>
            )}
          </PetInfoGrid>

          <DescriptionBox>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 700, 
              fontSize: '20px',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: '12px'
            }}>
              About {name}
            </Typography>
            <Typography variant="body1" id="pet-details-description" sx={{ 
              lineHeight: 1.7, 
              fontSize: '16px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
            }}>
              {description || `${gender === 'Male' ? 'He' : gender === 'Female' ? 'She' : 'This pet'} is looking for a loving home! This adorable companion would make the perfect addition to your family. They are ready to bring joy, love, and endless happiness to their forever home.`}
            </Typography>
          </DescriptionBox>
        </ModalContentArea>
        
        <ModalActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
          {!isAdopted && (
            <AdoptButtonStyled
              variant="contained"
              startIcon={<PetsIcon />}
              onClick={() => console.log(`Adopt pet ${pet.petId}`)} // Corrected string interpolation
            >
              Adopt {name}
            </AdoptButtonStyled>
          )}
        </ModalActions>
      </ModalContainer>
    </Modal>
  );
};

export default PetDetailsModal;
