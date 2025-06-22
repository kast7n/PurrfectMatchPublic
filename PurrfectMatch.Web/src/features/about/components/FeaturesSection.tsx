import { Typography, Grid, Card, CardContent, Box, styled, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  ContactSupport as ContactIcon,
  AutoStories as StoriesIcon
} from '@mui/icons-material';

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0,0,0,0.4)' 
      : '0 20px 40px rgba(0,0,0,0.15)',
  },
}));

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

export default function FeaturesSection() {
  const theme = useTheme();

  const features: Feature[] = [
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Search',
      description: 'Easily browse through a wide variety of cats, dogs, and other pets available for adoption.'
    },
    {
      icon: <FilterIcon sx={{ fontSize: 40 }} />,
      title: 'Filter',
      description: 'Refine your search based on species, breed, age, size, and more to find the perfect match for your lifestyle.'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: 'Favorites',
      description: 'Save your favorite pets to come back to later or compare options.'
    },
    {
      icon: <HomeIcon sx={{ fontSize: 40 }} />,
      title: 'Adoption Process',
      description: 'Learn about the adoption process and requirements for each pet, including vaccination status, spay/neuter status, and temperament.'
    },
    {
      icon: <ContactIcon sx={{ fontSize: 40 }} />,
      title: 'Shelter Information',
      description: 'Access detailed information about the shelters and rescues hosting each pet, including location, contact information, and adoption fees.'
    },
    {
      icon: <StoriesIcon sx={{ fontSize: 40 }} />,
      title: 'Adoption Stories',
      description: 'Read heartwarming adoption stories from previous PurrfectMatch users and share your own journey.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Typography variant="h3" component="h2" gutterBottom textAlign="center" fontWeight="bold" mb={6}>
        Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <FeatureCard>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}
