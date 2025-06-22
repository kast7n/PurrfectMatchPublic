import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Pets as PetsIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUserInfoQuery } from '../account/accountApi';
import { useFetchGlobalStatisticsQuery } from '../statistics/statisticsApi';
import { useFetchNotificationsQuery } from '../notification/notificationApi';
import { useFetchFilteredAdoptionApplicationsQuery } from '../adoptionApplication/adoptionApplicationApi';
import { useFetchShelterMetricsQuery } from '../shelter/shelterApi';
import DashboardHeader from './components/DashboardHeader';
import { useNavigate } from 'react-router-dom';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0,0,0,0.3)'
      : '0 12px 40px rgba(0,0,0,0.15)',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const DashboardHomePage: React.FC = () => {
  const { data: user } = useUserInfoQuery();
  const navigate = useNavigate();

  // Determine user role
  const getUserRole = (): 'Admin' | 'ShelterManager' => {
    if (!user?.roles) return 'Admin';
    
    if (user.roles.includes('Admin')) return 'Admin';
    if (user.roles.includes('ShelterManager')) return 'ShelterManager';
    
    return 'Admin';
  };

  const userRole = getUserRole();
  // Get shelter ID for shelter managers - this should come from user profile or context
  const getShelterId = (): number | undefined => {
    // TODO: Implement proper shelter ID retrieval for shelter managers
    // This could come from:
    // 1. User profile/context if shelter managers are linked to specific shelters
    // 2. A separate API call to get the shelter associated with the current user
    // 3. Local storage or session data
    // For now, we'll return undefined to skip shelter-specific calls
    return userRole === 'ShelterManager' ? undefined : undefined;
  };

  const shelterId = getShelterId();

  // Role-based API calls
  const { data: globalStats, isLoading: globalStatsLoading } = useFetchGlobalStatisticsQuery(undefined, {
    skip: userRole !== 'Admin',
  });

  const { data: shelterMetrics, isLoading: shelterMetricsLoading } = useFetchShelterMetricsQuery(shelterId!, {
    skip: userRole !== 'ShelterManager' || !shelterId,
  });

  const { data: notifications, isLoading: notificationsLoading } = useFetchNotificationsQuery();
  // For admins: get all applications, for shelter managers: get applications for their shelter
  const { data: applications, isLoading: applicationsLoading } = useFetchFilteredAdoptionApplicationsQuery({
    page: 1,
    pageSize: 5,
    ...(userRole === 'ShelterManager' && shelterId ? { shelterId } : {}),
  });

  const isLoading = userRole === 'Admin' 
    ? (globalStatsLoading || notificationsLoading || applicationsLoading)
    : (shelterMetricsLoading || notificationsLoading || applicationsLoading);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Get statistics based on role
  const getStatistics = () => {
    if (userRole === 'Admin') {
      return {
        stat1: { label: 'Available Pets', value: globalStats?.availablePets || 0 },
        stat2: { label: 'Registered Shelters', value: globalStats?.sheltersJoined || 0 },
        stat3: { label: 'Successful Adoptions', value: globalStats?.happyMatches || 0 },
      };
    } else {
      return {
        stat1: { label: 'My Pets', value: shelterMetrics?.totalPets || 0 },
        stat2: { label: 'Available Pets', value: shelterMetrics?.availablePets || 0 },
        stat3: { label: 'Adopted Pets', value: shelterMetrics?.adoptedPets || 0 },
      };
    }
  };

  const statistics = getStatistics();

  // Handler functions for DashboardHeader
  const handleNotificationClick = () => {
    navigate('/dashboard/notifications');
  };

  const handleSettingsClick = () => {
    navigate('/dashboard/settings');
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NewApplication':
        return <PetsIcon color="primary" />;
      case 'ApplicationUpdate':
        return <TrendingUpIcon color="success" />;
      default:
        return <BusinessIcon color="info" />;
    }
  };
  return (
    <Box>
      {/* Dashboard Header with stats and welcome */}
      <DashboardHeader
        userRole={userRole}
        userName={user?.email || 'User'}
        onNotificationClick={handleNotificationClick}
        onSettingsClick={handleSettingsClick}
        notificationCount={notifications?.filter(n => !n.isRead).length || 0}
      />

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <PetsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />                <Typography variant="h3" fontWeight={700}>
                  {statistics.stat1.value}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {statistics.stat1.label}
                </Typography>
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <BusinessIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />                <Typography variant="h3" fontWeight={700}>
                  {statistics.stat2.value}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {statistics.stat2.label}
                </Typography>
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />                <Typography variant="h3" fontWeight={700}>
                  {statistics.stat3.value}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {statistics.stat3.label}
                </Typography>
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Recent Activity
                  </Typography>
                </Box>
                <List disablePadding>
                  {notifications?.slice(0, 5).map((notification, index) => (
                    <motion.div
                      key={notification.notificationId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'transparent' }}>
                            {getNotificationIcon(notification.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight={600}>
                              {notification.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {formatNotificationTime(notification.createdAt)}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  )) || (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No recent activity
                    </Typography>
                  )}
                </List>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        {/* Recent Applications */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <StyledCard>
              <CardContent sx={{ p: 3 }}>                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PetsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    {userRole === 'Admin' ? 'Recent Applications' : 'My Shelter Applications'}
                  </Typography>
                </Box>
                <List disablePadding>
                  {applications?.data?.slice(0, 5).map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                            <PetsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight={600}>
                              Pet ID: {application.petId}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Status: {application.status}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatNotificationTime(application.createdAt)}
                              </Typography>
                            </Box>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                      </ListItem>
                    </motion.div>
                  )) || (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No recent applications
                    </Typography>
                  )}
                </List>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHomePage;
