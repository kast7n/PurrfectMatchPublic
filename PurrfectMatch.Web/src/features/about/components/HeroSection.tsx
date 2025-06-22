import { Box, Typography, styled, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import PetsIcon from '@mui/icons-material/Pets';

const HeroContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
  padding: theme.spacing(6, 0),
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #1F2937 100%)`
    : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, #FFF 100%)`,
  borderRadius: 24,
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 16px 40px rgba(0,0,0,0.3)' 
    : '0 16px 40px rgba(0,0,0,0.12)',
}));

export default function HeroSection() {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <HeroContainer>
        <PetsIcon sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          PurrfectMatch
        </Typography>
        <Typography variant="h5" component="h2" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
          Your go-to solution for finding your perfect furry companion! Whether you're looking for a cuddly kitten, 
          a playful puppy, or a loyal senior pet, PurrfectMatch has you covered.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
          Our platform connects pet lovers with their ideal companions from shelters and rescues around the world.
        </Typography>
      </HeroContainer>
    </motion.div>
  );
}
