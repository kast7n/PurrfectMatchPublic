import React from 'react';
import {
  Box,
  Typography,
  Paper,
  styled,
  alpha,
  useTheme,
  CircularProgress,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  Pets,
  Favorite,
  Star,
  TrendingUp,
  Home,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ShelterMetricsDto } from '../../../app/models/shelter';

interface ShelterStatsProps {
  metrics?: ShelterMetricsDto;
  isLoading: boolean;
}

const StatsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 12px 40px rgba(0,0,0,0.3)'
    : '0 12px 40px rgba(0,0,0,0.08)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
  '& .MuiSvgIcon-root': {
    color: theme.palette.secondary.main,
    fontSize: '1.5rem',
  },
}));

const StatItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.3)
    : alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0,0,0,0.4)'
      : '0 8px 32px rgba(0,0,0,0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 100%)',
    pointerEvents: 'none',
  },
  marginBottom: theme.spacing(2),
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '2.5rem',
  lineHeight: 1,
  marginBottom: theme.spacing(0.5),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
}));

const StatIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.main, 0.2)
    : alpha(theme.palette.primary.main, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(1.5),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
  },
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.success.main, 0.1)
    : alpha(theme.palette.success.main, 0.05),
  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
}));

const ShelterStats: React.FC<ShelterStatsProps> = ({ metrics, isLoading }) => {
  const theme = useTheme();

  // Debug logging to check metrics values
  React.useEffect(() => {
    if (metrics) {
      console.log('Shelter Metrics Debug:', {
        totalPets: metrics.totalPets,
        availablePets: metrics.availablePets,
        adoptedPets: metrics.adoptedPets,
        followerCount: metrics.followerCount,
        averageRating: metrics.averageRating,
        reviewCount: metrics.reviewCount
      });
    }
  }, [metrics]);

  // Calculate rates
  const adoptionRate = metrics && metrics.totalPets > 0 
    ? Math.round((metrics.adoptedPets / metrics.totalPets) * 100) 
    : 0;

  const availabilityRate = metrics && metrics.totalPets > 0 
    ? Math.round((metrics.availablePets / metrics.totalPets) * 100) 
    : 0;

  // Debug logging for calculations
  React.useEffect(() => {
    if (metrics) {
      console.log('Calculation Debug:', {
        adoptionRate,
        availabilityRate,
        calculation: `${metrics.adoptedPets}/${metrics.totalPets} * 100 = ${adoptionRate}%`,
        availabilityCalculation: `${metrics.availablePets}/${metrics.totalPets} * 100 = ${availabilityRate}%`
      });
    }
  }, [metrics, adoptionRate, availabilityRate]);

  if (isLoading) {
    return (
      <StatsContainer elevation={0}>
        <SectionTitle variant="h6">
          <TrendingUp />
          Shelter Statistics
        </SectionTitle>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      </StatsContainer>
    );
  }

  if (!metrics) {
    return (
      <StatsContainer elevation={0}>
        <SectionTitle variant="h6">
          <TrendingUp />
          Shelter Statistics
        </SectionTitle>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          Statistics not available
        </Typography>
      </StatsContainer>
    );  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <StatsContainer elevation={0}>
        <SectionTitle variant="h6">
          <TrendingUp />
          Shelter Statistics
        </SectionTitle>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StatItem>
              <StatIcon>
                <Pets />
              </StatIcon>
              <StatNumber variant="h4">
                {metrics.totalPets}
              </StatNumber>
              <StatLabel>
                Total Pets
              </StatLabel>
            </StatItem>
          </Grid>

          <Grid item xs={6}>
            <StatItem>
              <StatIcon>
                <Home />
              </StatIcon>
              <StatNumber variant="h4">
                {metrics.availablePets}
              </StatNumber>
              <StatLabel>
                Available
              </StatLabel>
            </StatItem>
          </Grid>

          <Grid item xs={6}>
            <StatItem>
              <StatIcon>
                <CheckCircle />
              </StatIcon>
              <StatNumber variant="h4">
                {metrics.adoptedPets}
              </StatNumber>
              <StatLabel>
                Adopted
              </StatLabel>
            </StatItem>
          </Grid>

          <Grid item xs={6}>
            <StatItem>
              <StatIcon>
                <Favorite />
              </StatIcon>
              <StatNumber variant="h4">
                {metrics.followerCount}
              </StatNumber>
              <StatLabel>
                Followers
              </StatLabel>
            </StatItem>
          </Grid>
        </Grid>

        <ProgressSection>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Adoption Success Rate
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                {adoptionRate}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={adoptionRate}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.success.main, 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: theme.palette.success.main,
                },
              }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Pets Available
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {availabilityRate}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={availabilityRate}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
          </Box>
        </ProgressSection>

        {metrics.averageRating > 0 && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Star sx={{ color: 'warning.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {metrics.averageRating.toFixed(1)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Based on {metrics.reviewCount} reviews
            </Typography>
          </Box>
        )}
      </StatsContainer>
    </motion.div>
  );
};

export default ShelterStats;
