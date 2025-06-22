// Shared styled components and animation variants for HeroSection
import { Box, Container, styled } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

export const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100vw',
  marginLeft: 'calc(-50vw + 50%)',
  height: '90vh',
  minHeight: '600px',
  maxHeight: '900px',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    minHeight: 'unset',
    height: 'auto',
    alignItems: 'flex-start',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export const HeroBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '5%',
    left: '10%',
    width: '25%',
    height: '35%',
    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle, rgba(123, 31, 162, 0.08) 0%, rgba(32, 32, 44, 0.03) 100%)'
      : 'radial-gradient(circle, rgba(253, 216, 235, 0.5) 0%, rgba(255, 236, 244, 0.2) 100%)',
    filter: 'blur(40px)',
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '15%',
    right: '10%',
    width: '30%',
    height: '40%',
    borderRadius: '50% 50% 30% 70% / 50% 50% 70% 30%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle, rgba(30, 123, 163, 0.08) 0%, rgba(32, 44, 54, 0.03) 100%)'
      : 'radial-gradient(circle, rgba(216, 235, 253, 0.5) 0%, rgba(236, 244, 255, 0.2) 100%)',
    filter: 'blur(40px)',
    zIndex: 0,
  },
  [theme.breakpoints.down('sm')]: {
    '&::before': {
      top: '10%',
      left: '5%',
      width: '50%',
      height: '25%',
      filter: 'blur(24px)',
    },
    '&::after': {
      bottom: '5%',
      right: '5%',
      width: '60%',
      height: '30%',
      filter: 'blur(24px)',
    },
  },
}));

export const ContentContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 3,
  color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    maxWidth: '55%',
    marginLeft: '10%',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    marginLeft: 0,
    padding: theme.spacing(2, 1.5, 2, 1.5),
    alignItems: 'center',
    textAlign: 'center',
  },
}));

export const PawPrintIcon = styled(PetsIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  fontSize: '1.5rem',
}));

export const HighlightText = styled('span')(({ theme }) => ({
  position: 'relative',
  color: theme.palette.primary.main,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-4px',
    left: 0,
    width: '100%',
    height: '8px',
    backgroundColor: theme.palette.primary.main,
    opacity: 0.3,
    borderRadius: '4px',
    zIndex: -1,
  },
}));

export const StatBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.2)'
    : '0 4px 20px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 30px rgba(0, 0, 0, 0.3)'
      : '0 8px 30px rgba(0, 0, 0, 0.1)',
  },
}));

export const StatIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  '& svg': {
    fontSize: '2rem',
  },
}));

export const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const statsVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.6,
    },
  },
};

export const statItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
