import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  styled,
  alpha,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Home,
  Business,
  Pets,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFetchShelterByIdQuery, useFetchShelterMetricsQuery } from './shelterApi';
import { useFetchFilteredPetsQuery } from '../pet/petApi';
import { PetFilterDto } from '../../app/models/pet';

// Import the components we'll create
import {
  ShelterHero,
  ShelterInfo,
  ShelterStats,
  ShelterPets,
  ShelterContact,
  ShelterMap,
} from './components';
import { ShelterReviews } from '../reviews';

// Styled components following the app's design patterns
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? 'radial-gradient(ellipse at center, rgba(31, 41, 55, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)'
    : 'radial-gradient(ellipse at center, rgba(249, 250, 251, 0.98) 0%, rgba(243, 244, 246, 0.95) 100%)',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(8),
}));

const ContentContainer = styled(Container)(() => ({
  position: 'relative',
  zIndex: 1,
}));

const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1, 3),
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const BreadcrumbContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  marginBottom: theme.spacing(3),
  borderRadius: 15,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0,0,0,0.3)'
    : '0 4px 20px rgba(0,0,0,0.08)',
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4),
  },
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const ShelterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const shelterId = id ? parseInt(id) : 0;

  // API queries
  const { 
    data: shelter, 
    isLoading: shelterLoading, 
    error: shelterError 
  } = useFetchShelterByIdQuery(shelterId, {
    skip: !shelterId,
  });

  const { 
    data: metrics, 
    isLoading: metricsLoading 
  } = useFetchShelterMetricsQuery(shelterId, {
    skip: !shelterId,
  });

  // Fetch pets for this shelter
  const petFilter: PetFilterDto = {
    shelterId: shelterId,
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'name',
    sortDescending: false,
  };
  const { 
    data: petsResponse, 
    isLoading: petsLoading 
  } = useFetchFilteredPetsQuery(petFilter, {
    skip: !shelterId,
  });

  // Debug logging
  console.log('ShelterDetailPage - Debug info:', {
    shelterId,
    petFilter,
    petsResponse,
    petsLoading,
    petsCount: petsResponse?.items?.length || 0
  });

  const handleBack = () => {
    navigate('/shelters');
  };

  if (shelterLoading) {
    return (
      <PageContainer>
        <ContentContainer>
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="60vh"
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (shelterError || !shelter) {
    return (
      <PageContainer>
        <ContentContainer>
          <Box sx={{ py: 8 }}>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 4,
                fontSize: '1.1rem',
                py: 2,
              }}
            >
              {shelterError ? 'Failed to load shelter details' : 'Shelter not found'}
            </Alert>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={handleBack}
                startIcon={<ArrowBack />}
                size="large"
                sx={{ borderRadius: 3 }}
              >
                Back to Shelters
              </Button>
            </Box>
          </Box>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <BackButton
              startIcon={<ArrowBack />}
              onClick={handleBack}
              variant="outlined"
            >
              Back to Shelters
            </BackButton>
          </motion.div>

          <motion.div variants={itemVariants}>
            <BreadcrumbContainer elevation={0}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  underline="hover"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'text.secondary',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/')}
                >
                  <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                  Home
                </Link>
                <Link
                  underline="hover"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'text.secondary',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/shelters')}
                >
                  <Business sx={{ mr: 0.5 }} fontSize="inherit" />
                  Shelters
                </Link>
                <Typography
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'text.primary',
                    fontWeight: 600,
                  }}
                >
                  <Pets sx={{ mr: 0.5 }} fontSize="inherit" />
                  {shelter.name}
                </Typography>
              </Breadcrumbs>
            </BreadcrumbContainer>
          </motion.div>

          <Grid container spacing={4}>
            {/* Left Column - Main Content */}
            <Grid item xs={12} lg={8}>
              <motion.div variants={itemVariants}>
                <SectionContainer>
                  <ShelterHero shelter={shelter} />
                </SectionContainer>
              </motion.div>

              <motion.div variants={itemVariants}>
                <SectionContainer>
                  <ShelterInfo shelter={shelter} />
                </SectionContainer>
              </motion.div>              <motion.div variants={itemVariants}>
                <SectionContainer>                  <ShelterPets 
                    pets={petsResponse?.items || []} 
                    isLoading={petsLoading}
                    shelterId={shelterId}
                  />
                </SectionContainer>
              </motion.div>

              <motion.div variants={itemVariants}>
                <SectionContainer>
                  <ShelterReviews 
                    shelterId={shelterId}
                    shelterName={shelter?.name || ''}
                  />
                </SectionContainer>
              </motion.div>
            </Grid>

            {/* Right Column - Sidebar */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <motion.div variants={itemVariants}>
                  <SectionContainer>
                    <ShelterStats 
                      metrics={metrics} 
                      isLoading={metricsLoading} 
                    />
                  </SectionContainer>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <SectionContainer>
                    <ShelterContact shelter={shelter} />
                  </SectionContainer>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <SectionContainer>
                    <ShelterMap shelter={shelter} />
                  </SectionContainer>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </ContentContainer>
    </PageContainer>
  );
};

export default ShelterDetailPage;
