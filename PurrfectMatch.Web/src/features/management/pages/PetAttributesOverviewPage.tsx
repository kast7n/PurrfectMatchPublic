import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  styled,
  alpha,
} from '@mui/material';
import {
  Pets as PetsIcon,
  Category as SpeciesIcon,
  Palette as ColorsIcon,
  FitnessCenter as ActivityIcon,
  HealthAndSafety as HealthIcon,
  Brush as CoatIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface AttributeCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark'
    ? theme.palette.grey[900]
    : theme.palette.grey[50],
  minHeight: '100vh',
}));

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'colorTheme',
})<{ colorTheme: string }>(({ theme, colorTheme }) => ({
  height: '100%',
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(colorTheme, 0.2)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.3)'
    : '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 16px 40px ${alpha(colorTheme, 0.2)}`,
    borderColor: alpha(colorTheme, 0.4),
  },
}));

const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'colorTheme',
})<{ colorTheme: string }>(({ theme, colorTheme }) => ({
  width: 64,
  height: 64,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(colorTheme, 0.1),
  border: `2px solid ${alpha(colorTheme, 0.2)}`,
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: 32,
    color: colorTheme,
  },
}));

const PetAttributesOverviewPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const attributeCards: AttributeCard[] = [
    {
      title: 'Species Management',
      description: 'Manage pet species like dogs, cats, birds, and more.',
      icon: <SpeciesIcon />,
      path: '/dashboard/pet-attributes/species',
      color: theme.palette.primary.main,
    },
    {
      title: 'Breeds Management',
      description: 'Manage breeds for each species with detailed categorization.',
      icon: <PetsIcon />,
      path: '/dashboard/pet-attributes/breeds',
      color: theme.palette.secondary.main,
    },
    {
      title: 'Colors Management',
      description: 'Manage pet colors and color patterns for better matching.',
      icon: <ColorsIcon />,
      path: '/dashboard/pet-attributes/colors',
      color: '#FF6B6B',
    },
    {
      title: 'Coat Lengths',
      description: 'Manage different coat length categories for pets.',
      icon: <CoatIcon />,
      path: '/dashboard/pet-attributes/coat-lengths',
      color: '#4ECDC4',
    },
    {
      title: 'Activity Levels',
      description: 'Manage activity level categories to help with pet matching.',
      icon: <ActivityIcon />,
      path: '/dashboard/pet-attributes/activity-levels',
      color: '#45B7D1',
    },
    {
      title: 'Health Statuses',
      description: 'Manage health status options for comprehensive pet profiles.',
      icon: <HealthIcon />,
      path: '/dashboard/pet-attributes/health-statuses',
      color: '#96CEB4',
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
            Pet Attributes Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage all pet attributes including species, breeds, colors, and other characteristics
            to ensure comprehensive pet profiling and better adoption matching.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {attributeCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StyledCard colorTheme={card.color}>
                  <CardActionArea
                    onClick={() => handleCardClick(card.path)}
                    sx={{ p: 3, height: '100%' }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <IconContainer colorTheme={card.color}>
                        {card.icon}
                      </IconContainer>
                      
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {card.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </PageContainer>
  );
};

export default PetAttributesOverviewPage;
