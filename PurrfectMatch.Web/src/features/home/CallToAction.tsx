import { 
  Box, 
  Typography, 
  Button, 
  styled, 
  useTheme,
  Container
} from '@mui/material';
import { motion } from 'framer-motion';
import PetsIcon from '@mui/icons-material/Pets';

// Styled components for the call to action section
const CTAContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: 24,
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 16px 40px rgba(0,0,0,0.3)' 
    : '0 16px 40px rgba(0,0,0,0.12)',
}));

const CTABackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(120deg, ${theme.palette.primary.dark} 0%, #1F2937 100%)`
    : `linear-gradient(120deg, ${theme.palette.primary.light} 0%, #FFF 100%)`,
  backgroundImage: 'url("/images/happy-pet-collage.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: theme.palette.mode === 'dark' ? 'brightness(0.7)' : 'none',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(to right, rgba(31,41,55,0.85) 0%, rgba(255,107,107,0.7) 100%)'
      : 'linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,107,107,0.5) 100%)',
  },
}));

const CTAContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6, 4),
  color: 'white',
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8, 4),
  },
}));

const DecorativeIcon = styled(Box)({
  position: 'absolute',
  opacity: 0.3,
  color: 'white',
});

const CTAButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
  color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : '#fff',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 16px rgba(0,0,0,0.25)'
    : '0 4px 16px rgba(0,0,0,0.15)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.primary.main
      : theme.palette.primary.dark,
    color: '#fff',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 20px rgba(0,0,0,0.3)'
      : '0 6px 20px rgba(0,0,0,0.18)',
  },
}));

export default function CallToAction() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <CTAContainer>
      <CTABackground />
      <CTAContent>
        <DecorativeIcon sx={{ left: '5%', top: '15%', fontSize: '80px' }}>❤️</DecorativeIcon>
        <DecorativeIcon sx={{ right: '5%', top: '65%', fontSize: '60px' }}>❤️</DecorativeIcon>
        <DecorativeIcon sx={{ left: '8%', top: '70%', fontSize: '50px' }}>🐾</DecorativeIcon>
        <DecorativeIcon sx={{ right: '8%', top: '20%', fontSize: '70px' }}>🐾</DecorativeIcon>
        
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark,
                textShadow: isDarkMode
                  ? `0 2px 8px ${theme.palette.background.default}`
                  : `0 2px 4px ${theme.palette.grey[300]}`
              }}
            >
              Every Pet Deserves a Loving Home
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                fontWeight: 400, 
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.92,
                color: isDarkMode ? theme.palette.grey[100] : theme.palette.grey[900],
                textShadow: isDarkMode
                  ? `0 1px 4px ${theme.palette.background.default}`
                  : `0 1px 2px ${theme.palette.grey[200]}`
              }}
            >
              Join thousands of families who have found their perfect companions. 
              Whether you're looking to adopt or foster, your future best friend is waiting for you.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <CTAButton 
                variant="contained" 
                startIcon={<PetsIcon />}
                href="/pets"
              >
                Meet Your Companion
              </CTAButton>
              
              <Button 
                variant="outlined" 
                color={theme.palette.mode === 'dark' ? 'primary' : 'inherit'}
                sx={{ 
                  borderRadius: 30,
                  padding: theme.spacing(1.5, 4),
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderWidth: 2,
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,107,107,0.08)' : 'rgba(255,107,107,0.08)',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  }
                }}
                href="/shelters"
              >
                Support Our Shelters
              </Button>
            </Box>
          </motion.div>
          
          <Box sx={{ 
            mt: 6, 
            pt: 3, 
            borderTop: '1px solid rgba(255,255,255,0.2)',
            opacity: isDarkMode ? 0.7 : 0.8
          }}>
            <Typography variant="body2" sx={{ 
              opacity: isDarkMode ? 0.9 : 0.8,
              fontWeight: isDarkMode ? 400 : 500 
            }}>
              Over 10,000 pets have found loving homes through PurrfectMatch
            </Typography>
          </Box>
        </Container>
      </CTAContent>
    </CTAContainer>
  );
}