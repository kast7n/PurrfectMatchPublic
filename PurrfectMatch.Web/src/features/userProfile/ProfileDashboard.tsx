import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  styled,
  alpha,
} from '@mui/material';
import {
  Pets as PetsIcon,
  Favorite as FavoriteIcon,
  Assignment as ApplicationIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Notifications as NotificationIcon,
  Shield as ShieldIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserInfoQuery } from '../account/accountApi';
import { useGetUserFavoritesQuery } from '../favorites/favoritesApi';
import { useFetchUserAdoptionApplicationsQuery } from '../adoptionApplication/adoptionApplicationApi';
import { useGetCurrentUserProfileQuery, useUploadUserPhotoMutation } from './userProfileApi';

// Styled components with modern design
const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

const WelcomeCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, 
        rgba(99, 102, 241, 0.1) 0%, 
        rgba(168, 85, 247, 0.1) 35%, 
        rgba(236, 72, 153, 0.1) 100%)`
    : `linear-gradient(135deg, 
        rgba(99, 102, 241, 0.05) 0%, 
        rgba(168, 85, 247, 0.05) 35%, 
        rgba(236, 72, 153, 0.05) 100%)`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 25px 50px rgba(0, 0, 0, 0.25)'
    : '0 25px 50px rgba(0, 0, 0, 0.08)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6366F1 0%, #A855F7 35%, #EC4899 100%)',
  },
  // Mobile responsivity
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2.5),
  height: '100%',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 25px rgba(0, 0, 0, 0.3)'
    : '0 10px 25px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.4)'
      : '0 20px 40px rgba(0, 0, 0, 0.12)',
  },
}));

const QuickActionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2.5),
  height: '100%',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 25px rgba(0, 0, 0, 0.3)'
    : '0 10px 25px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.4)'
      : '0 20px 40px rgba(0, 0, 0, 0.12)',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 35%, #EC4899 100%)',
  fontSize: '2.5rem',
  fontWeight: 600,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 15px 35px rgba(99, 102, 241, 0.3)'
    : '0 15px 35px rgba(99, 102, 241, 0.2)',
  border: `4px solid ${theme.palette.background.paper}`,
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 45px rgba(99, 102, 241, 0.4)'
      : '0 20px 45px rgba(99, 102, 241, 0.3)',
  },
}));

const AvatarContainer = styled(Box)(() => ({
  position: 'relative',
  display: 'inline-block',
  '&:hover .avatar-overlay': {
    opacity: 1,
  },
}));

const AvatarOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  color: 'white',
  pointerEvents: 'none',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)'
    : 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  fontSize: '1.5rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '1.75rem',
    textAlign: 'left',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 15px 35px rgba(0, 0, 0, 0.3)'
    : '0 15px 35px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  // Mobile responsivity
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '200px',
    height: '200px',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
    borderRadius: '50%',
  },
}));

const ProfileDashboard: React.FC = () => {
  const { data: user, isLoading } = useUserInfoQuery();
  const { data: userProfile, isLoading: profileLoading } = useGetCurrentUserProfileQuery();
  const { data: favorites } = useGetUserFavoritesQuery(user?.id || '', { skip: !user?.id });
  const { data: applications } = useFetchUserAdoptionApplicationsQuery(user?.id || '', { skip: !user?.id });
  const [uploadPhoto] = useUploadUserPhotoMutation();
  const navigate = useNavigate();

  // Handle avatar photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadPhoto(file).unwrap();
      } catch (error) {
        console.error('Photo upload failed:', error);
      }
    }
  };

  // Extract first name from email or use fallback
  const getFirstName = () => {
    if (!user?.email) return 'Friend';
    
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[._-]/g, ' ');
  };

  const getUserInitials = () => {
    const name = getFirstName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  if (isLoading || profileLoading) {
    return (
      <DashboardContainer>
        <Typography variant="h5" textAlign="center">
          Loading your dashboard...
        </Typography>
      </DashboardContainer>
    );
  }

  const statsData = [
    {
      title: 'Favorite Pets',
      value: favorites?.length || 0,
      icon: <FavoriteIcon />,
      color: '#EC4899',
      progress: Math.min((favorites?.length || 0) * 10, 100),
      action: () => navigate('/favorites'),
    },
    {
      title: 'Applications',
      value: applications?.length || 0,
      icon: <ApplicationIcon />,
      color: '#6366F1',
      progress: Math.min((applications?.length || 0) * 20, 100),
      action: () => navigate('/profile/applications'),
    },
    {
      title: 'Profile Complete',
      value: '85%',
      icon: <TrendingUpIcon />,
      color: '#10B981',
      progress: 85,
      action: () => navigate('/profile/edit-profile'),
    },
  ];

  const quickActions = [
    {
      title: 'Browse Pets',
      description: 'Find your perfect companion',
      icon: <PetsIcon />,
      color: '#6366F1',
      action: () => navigate('/pets'),
    },
    {
      title: 'My Applications',
      description: 'Track adoption progress',
      icon: <ApplicationIcon />,
      color: '#A855F7',
      action: () => navigate('/profile/applications'),
    },
    {
      title: 'Edit Profile',
      description: 'Update your information',
      icon: <EditIcon />,
      color: '#EC4899',
      action: () => navigate('/profile/edit-profile'),
    },
    {
      title: 'Notifications',
      description: 'Stay up to date',
      icon: <NotificationIcon />,
      color: '#F59E0B',
      action: () => navigate('/notifications'),
    },
  ];

  return (
    <DashboardContainer>
      {/* Welcome Section */}      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WelcomeCard elevation={0}>
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box 
                display="flex" 
                alignItems={{ xs: 'flex-start', sm: 'center' }} 
                mb={2}
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={{ xs: 2, sm: 0 }}
              >
                <AvatarContainer>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload">
                    <UserAvatar 
                      src={userProfile?.photoUrl || undefined}
                      sx={{ 
                        cursor: 'pointer',
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 }
                      }}
                    >
                      {!userProfile?.photoUrl && getUserInitials()}
                    </UserAvatar>
                    <AvatarOverlay className="avatar-overlay">
                      <PhotoCameraIcon />
                    </AvatarOverlay>
                  </label>
                </AvatarContainer>
                <Box ml={{ xs: 0, sm: 3 }}>
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    Welcome back, {getFirstName()}! 🎉
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary"
                    sx={{ 
                      opacity: 0.8,
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    Ready to find your perfect companion?
                  </Typography>
                </Box>
              </Box>
              
              <Box 
                display="flex" 
                alignItems="center" 
                gap={2} 
                mt={3}
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent={{ xs: 'center', sm: 'flex-start' }}
              >
                <Chip 
                  icon={<ShieldIcon />} 
                  label="Verified User" 
                  color="primary" 
                  variant="filled"
                  sx={{ fontWeight: 500 }}
                />
                <Chip 
                  icon={<StarIcon />} 
                  label="Pet Lover" 
                  color="secondary" 
                  variant="filled"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="body1" color="text.secondary" paragraph>
                  Member since
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  <CalendarIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {new Date().getFullYear()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </WelcomeCard>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SectionTitle variant="h5">
          Your Journey Summary
        </SectionTitle>
          <Grid container spacing={{ xs: 2, md: 3 }}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <StatsCard onClick={stat.action}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box 
                        sx={{ 
                          p: { xs: 1, md: 1.5 }, 
                          borderRadius: 2, 
                          background: alpha(stat.color, 0.1),
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography 
                        variant="h4" 
                        fontWeight={700} 
                        color={stat.color}
                        sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                    >
                      {stat.title}
                    </Typography>
                    
                    <Box mt={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={stat.progress} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          backgroundColor: alpha(stat.color, 0.1),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: stat.color,
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </StatsCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionTitle variant="h5">
          Quick Actions
        </SectionTitle>
          <Grid container spacing={{ xs: 2, md: 3 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <QuickActionCard onClick={action.action}>
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    py: { xs: 3, md: 4 },
                    px: { xs: 1.5, md: 3 }
                  }}>
                    <Box 
                      sx={{ 
                        p: { xs: 1.5, md: 2 }, 
                        borderRadius: '50%', 
                        background: alpha(action.color, 0.1),
                        color: action.color,
                        display: 'inline-flex',
                        mb: 2,
                      }}
                    >
                      {action.icon}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                        lineHeight: 1.2
                      }}
                    >
                      {action.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        display: { xs: 'none', sm: 'block' }
                      }}
                    >
                      {action.description}
                    </Typography>
                  </CardContent>
                </QuickActionCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Feature Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >        <FeatureCard>
          <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h5" 
                fontWeight={700} 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                🐾 Your Perfect Match Awaits
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph
                sx={{ 
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Our advanced matching system considers your lifestyle, preferences, and experience 
                to help you find the perfect furry companion. Start your journey today and make a 
                difference in a pet's life!
              </Typography>
              <Box 
                mt={3}
                display="flex"
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/pets')}
                  sx={{ 
                    background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 35%, #EC4899 100%)',
                    borderRadius: 3,
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.2, md: 1.5 },
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      boxShadow: '0 15px 35px rgba(99, 102, 241, 0.4)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Start Browsing Pets
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  fontSize: { xs: '3rem', md: '4rem' },
                  opacity: 0.7,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                🐕🐱
              </Box>
            </Grid>
          </Grid>
        </FeatureCard>
      </motion.div>
    </DashboardContainer>
  );
};

export default ProfileDashboard;