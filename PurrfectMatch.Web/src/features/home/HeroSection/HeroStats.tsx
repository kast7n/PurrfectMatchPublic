// HeroStats component for the stats row
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import HeroStatItem from './HeroStatItem';
import { statsVariants } from './heroSectionStyles';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useFetchGlobalStatisticsQuery } from '../../statistics/statisticsApi';

// Helper function to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return Math.round(num / 100) / 10 + 'K+';
  }
  return num.toString();
};

export default function HeroStats() {
  const { data: statistics, isLoading, error } = useFetchGlobalStatisticsQuery();

  // Show loading state
  if (isLoading) {
    return (
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={statsVariants}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 6,
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // Show error state with fallback stats
  if (error || !statistics) {
    const fallbackStats = [
      {
        icon: <PetsIcon />,
        number: '0',
        label: 'Pets Available',
      },
      {
        icon: <HomeIcon />,
        number: '0',
        label: 'Shelters Joined',
      },
      {
        icon: <CheckCircleOutlineIcon />,
        number: '0',
        label: 'Happy Matches',
      },
    ];

    return (
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={statsVariants}
        sx={{
          display: 'flex',
          gap: { xs: 2, sm: 3, md: 4 },
          mt: 6,
          flexWrap: 'wrap',
          maxWidth: '100%',
          flexDirection: { xs: 'row', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        {fallbackStats.map((stat, idx) => (
          <HeroStatItem key={idx} {...stat} />
        ))}
      </Box>
    );
  }

  // Create stats array with dynamic data
  const stats = [
    {
      icon: <PetsIcon />,
      number: formatNumber(statistics.availablePets),
      label: 'Available Pets',
    },
    {
      icon: <HomeIcon />,
      number: formatNumber(statistics.sheltersJoined),
      label: 'Shelters Joined',
    },
    {
      icon: <CheckCircleOutlineIcon />,
      number: formatNumber(statistics.happyMatches),
      label: 'Happy Matches',
    },
  ];

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={statsVariants}
      sx={{
        display: 'flex',
        gap: { xs: 2, sm: 3, md: 4 },
        mt: 6,
        flexWrap: 'wrap',
        maxWidth: '100%',
        flexDirection: { xs: 'row', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
      }}
    >
      {stats.map((stat, idx) => (
        <HeroStatItem key={idx} {...stat} />
      ))}
    </Box>
  );
}
