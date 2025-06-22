import { Typography, Paper, Box, styled } from '@mui/material';

export const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(4),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const StepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: 24,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 24px rgba(0,0,0,0.15)'
      : '0 8px 24px rgba(255, 107, 107, 0.08)',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(17, 24, 39, 0.85)'
      : 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.text.primary,
}));

export const StepNumber = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -15,
  right: -15,
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 107, 107, 0.15)'
      : 'rgba(255, 107, 107, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.5rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  opacity: 0.6,
}));

export const IconCircle = styled(Box)(({ theme, color }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor:
    color === 'primary'
      ? `rgba(${theme.palette.mode === 'dark' ? '255, 107, 107' : '255, 107, 107'}, 0.15)`
      : color === 'secondary'
      ? `rgba(${theme.palette.mode === 'dark' ? '255, 209, 102' : '255, 209, 102'}, 0.15)`
      : `rgba(${theme.palette.mode === 'dark' ? '100, 181, 246' : '100, 181, 246'}, 0.15)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

export const StepTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

export const StepDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export const PawPrintPath = styled(Box)(() => ({
  position: 'absolute',
  bottom: 10,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '80%',
  height: 30,
  opacity: 0.2,
  zIndex: 0,
  display: 'flex',
  justifyContent: 'space-between',
}));
