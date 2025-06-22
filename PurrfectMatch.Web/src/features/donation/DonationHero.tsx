import { Box, Typography, useTheme, alpha, styled } from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';

// Styled components following the established patterns
const HeroContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6, 0),
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8, 0),
  },
}));

const HeroIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  '& svg': {
    fontSize: '3rem',
    color: theme.palette.primary.main,
    [theme.breakpoints.up('md')]: {
      fontSize: '4rem',
    },
  },
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(4),
  marginTop: theme.spacing(4),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#1F2937', 0.7)
    : alpha('#FFFFFF', 0.8),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  minWidth: '120px',
  [theme.breakpoints.up('md')]: {
    minWidth: '150px',
    padding: theme.spacing(3),
  },
}));

const PawDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  margin: theme.spacing(4, 0),
  color: theme.palette.primary.main,
  opacity: 0.6,
}));

export default function DonationHero() {
  const theme = useTheme();

  return (
    <HeroContainer>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <HeroIconContainer>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FavoriteIcon />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <PetsIcon />
          </motion.div>
        </HeroIconContainer>

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #ff8a80 30%, #ff5722 90%)'
              : 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Support Our Mission
        </Typography>

        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: '600px',
            margin: '0 auto',
            fontWeight: 300,
            lineHeight: 1.6,
            fontSize: { xs: '1.1rem', md: '1.3rem' },
          }}
        >
          Your donation helps us rescue, care for, and find loving homes for pets in need.
          Every contribution makes a difference in a pet's life.
        </Typography>

        <PawDivider>
          <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
            <path d="M256 224c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 240c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96-43.1 96-96 96z"/>
          </svg>
          <svg width="24" height="24" viewBox="0 0 512 512" fill="currentColor">
            <path d="M256 224c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 240c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96-43.1 96-96 96z"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
            <path d="M256 224c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 240c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96-43.1 96-96 96z"/>
          </svg>
        </PawDivider>

        <StatsContainer>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <StatBox>
              <Typography variant="h4" fontWeight="bold" color="primary">
                2,500+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pets Rescued
              </Typography>
            </StatBox>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <StatBox>
              <Typography variant="h4" fontWeight="bold" color="primary">
                1,800+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adoptions
              </Typography>
            </StatBox>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <StatBox>
              <Typography variant="h4" fontWeight="bold" color="primary">
                150+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Partner Shelters
              </Typography>
            </StatBox>
          </motion.div>
        </StatsContainer>
      </motion.div>
    </HeroContainer>
  );
}
