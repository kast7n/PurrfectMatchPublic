import { Box, Container, Typography, Grid, CircularProgress, Button, styled, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useGetUserFavoritesQuery } from './favoritesApi';
import { useUserInfoQuery } from '../account/accountApi';
import PetCard from '../pet/PetCard';
import { useFetchPetByIdQuery } from '../pet/petApi';

const PageContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(to bottom, #111827, #0d1424)`
    : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
  backgroundImage: theme.palette.mode === 'dark'
    ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222842' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B6B' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  minHeight: '100vh',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  // Mobile-specific adjustments
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));

const PageHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  position: 'relative',
  // Mobile adjustments
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(2),
    textAlign: 'left', // Left align on mobile for better layout
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #ff6b6b, #f8bbd0)'
    : 'linear-gradient(45deg, #ff6b6b, #c2185b)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  // Mobile adjustments
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
    justifyContent: 'flex-start', // Left align on mobile
    marginTop: theme.spacing(1),
    gap: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: '2rem',
    },
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  borderRadius: '50px',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 107, 107, 0.1)',
  color: theme.palette.mode === 'dark' ? '#ff8a80' : '#c2185b',
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 138, 128, 0.3)' : '1px solid rgba(194, 24, 91, 0.3)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 138, 128, 0.2)' : 'rgba(255, 107, 107, 0.2)',
    transform: 'translateY(-50%) translateX(-4px)',
  },
  transition: 'all 0.3s ease',
  // Mobile adjustments
  [theme.breakpoints.down('md')]: {
    position: 'static',
    transform: 'none',
    marginBottom: theme.spacing(2),
    alignSelf: 'flex-start',
    padding: theme.spacing(0.75, 1.5),
    fontSize: '0.875rem',
    '&:hover': {
      transform: 'none',
    },
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 0),
  opacity: 0.8,
  // Mobile adjustments
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 0),
  },
}));

const FavoriteItem = ({ petId }: { petId: number }) => {
  const { data: pet, isLoading, error } = useFetchPetByIdQuery(petId);

  if (isLoading) {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress color="primary" />
        </Box>
      </Grid>
    );
  }

  if (error || !pet) {
    return null;
  }

  return (
    <Grid item xs={12} sm={6} md={4} xl={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -8 }}
      >
        <PetCard pet={pet} />
      </motion.div>
    </Grid>
  );
};

export default function FavoritesPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: userInfo } = useUserInfoQuery();
  
  const { 
    data: favorites, 
    isLoading, 
    error 
  } = useGetUserFavoritesQuery(userInfo?.id || '', {
    skip: !userInfo?.id
  });

  const handleBack = () => {
    navigate(-1);
  };
  if (!userInfo) {
    return (
      <PageContainer>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <PageHeader>
            <PageTitle variant={isMobile ? "h4" : "h3"}>
              <FavoriteIcon fontSize={isMobile ? "medium" : "large"} />
              My Favorites
            </PageTitle>
          </PageHeader>
          <EmptyStateContainer>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Please log in to view your favorites
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </EmptyStateContainer>
        </Container>
      </PageContainer>
    );
  }
  if (isLoading) {
    return (
      <PageContainer>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <PageHeader>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              position: 'relative',
              gap: { xs: 2, md: 0 }
            }}>
              <BackButton onClick={handleBack} startIcon={<ArrowBackIcon />}>
                Back
              </BackButton>
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: { xs: 'flex-start', md: 'center' }
              }}>
                <PageTitle variant={isMobile ? "h4" : "h3"}>
                  <FavoriteIcon fontSize={isMobile ? "medium" : "large"} />
                  My Favorites
                </PageTitle>
              </Box>
            </Box>
          </PageHeader>
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <CircularProgress size={60} color="primary" />
          </Box>
        </Container>
      </PageContainer>
    );
  }
  if (error) {
    return (
      <PageContainer>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <PageHeader>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              position: 'relative',
              gap: { xs: 2, md: 0 }
            }}>
              <BackButton onClick={handleBack} startIcon={<ArrowBackIcon />}>
                Back
              </BackButton>
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: { xs: 'flex-start', md: 'center' }
              }}>
                <PageTitle variant={isMobile ? "h4" : "h3"}>
                  <FavoriteIcon fontSize={isMobile ? "medium" : "large"} />
                  My Favorites
                </PageTitle>
              </Box>
            </Box>
          </PageHeader>
          <EmptyStateContainer>
            <Typography variant="h5" color="error" gutterBottom>
              Failed to load favorites
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please try again later
            </Typography>
          </EmptyStateContainer>
        </Container>
      </PageContainer>
    );
  }

  const favoritePetIds = favorites?.map(fav => fav.petId) || [];
  return (
    <PageContainer>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <PageHeader>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            position: 'relative',
            gap: { xs: 2, md: 0 }
          }}>
            <BackButton onClick={handleBack} startIcon={<ArrowBackIcon />}>
              Back
            </BackButton>
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'center' }
            }}>
              <PageTitle variant={isMobile ? "h4" : "h3"}>
                <FavoriteIcon fontSize={isMobile ? "medium" : "large"} />
                My Favorites
              </PageTitle>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  textAlign: { xs: 'left', md: 'center' },
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                {favoritePetIds.length === 0 
                  ? "No favorites yet" 
                  : `${favoritePetIds.length} favorite${favoritePetIds.length === 1 ? '' : 's'}`
                }
              </Typography>
            </Box>
          </Box>
        </PageHeader>        {favoritePetIds.length === 0 ? (
          <EmptyStateContainer>
            <PetsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography 
              variant="h5" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
            >
              No favorites yet
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                textAlign: 'center',
                fontSize: { xs: '0.875rem', md: '1rem' },
                px: { xs: 2, md: 0 }
              }}
            >
              Start browsing pets and click the heart icon to add them to your favorites!
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/pets')}
              size={isMobile ? "medium" : "large"}
              sx={{ 
                borderRadius: '50px',
                px: 4,
                py: 1.5,
              }}
            >
              Browse Pets
            </Button>
          </EmptyStateContainer>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {favoritePetIds.map((petId) => (
              <FavoriteItem key={petId} petId={petId} />
            ))}
          </Grid>
        )}
      </Container>
    </PageContainer>
  );
}
