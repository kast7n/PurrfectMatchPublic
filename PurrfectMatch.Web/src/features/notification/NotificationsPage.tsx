import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  Button,
  Chip,
  Avatar,
  useTheme,
  alpha,
  styled,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle,
  CheckCircle,
  Info,
  Warning,
  Error,
  Clear,
  DoneAll,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFetchNotificationsByUserIdQuery, useMarkNotificationAsReadMutation, useDeleteNotificationMutation } from './notificationApi';
import { NotificationDto, NotificationTypeDto } from '../../app/models/Notification';
import { useUserInfoQuery } from '../account/accountApi';
import { useSignalRNotifications } from '../../hooks/useSignalRNotifications';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(to bottom, #111827, #0d1424)`
    : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)}, ${alpha(theme.palette.background.paper, 0.9)})`
    : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.background.paper, 0.9)})`,
  borderRadius: 20,
  marginBottom: theme.spacing(3),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.3)'
    : '0 8px 32px rgba(0,0,0,0.1)',
}));

const NotificationCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 24px rgba(0,0,0,0.2)'
      : '0 8px 24px rgba(0,0,0,0.08)',
    transform: 'translateY(-2px)',
  },
}));

const StatsGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  textAlign: 'center',
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const getNotificationIcon = (type: NotificationTypeDto, isRead: boolean) => {
  const iconProps = {
    fontSize: 'medium' as const,
    sx: { opacity: isRead ? 0.6 : 1 }
  };

  switch (type) {
    case NotificationTypeDto.NewApplication:
    case NotificationTypeDto.ApplicationUpdate:
      return <Info color="info" {...iconProps} />;
    case NotificationTypeDto.NewMatch:
    case NotificationTypeDto.NewPetListed:
      return <CheckCircle color="success" {...iconProps} />;
    case NotificationTypeDto.MessageReceived:
      return <Info color="primary" {...iconProps} />;
    case NotificationTypeDto.DonationReceived:
      return <CheckCircle color="success" {...iconProps} />;
    case NotificationTypeDto.FavoriteActivity:
      return <Warning color="warning" {...iconProps} />;
    case NotificationTypeDto.ShelterUpdate:
      return <Info color="info" {...iconProps} />;
    case NotificationTypeDto.GeneralUpdate:
    default:
      return <Circle color="primary" {...iconProps} />;
  }
};

const getNotificationTypeLabel = (type: NotificationTypeDto): string => {
  switch (type) {
    case NotificationTypeDto.NewApplication:
      return 'New Application';
    case NotificationTypeDto.ApplicationUpdate:
      return 'Application Update';
    case NotificationTypeDto.NewMatch:
      return 'New Match';
    case NotificationTypeDto.MessageReceived:
      return 'Message';
    case NotificationTypeDto.DonationReceived:
      return 'Donation';
    case NotificationTypeDto.NewPetListed:
      return 'New Pet';
    case NotificationTypeDto.FavoriteActivity:
      return 'Favorite Activity';
    case NotificationTypeDto.ShelterUpdate:
      return 'Shelter Update';
    case NotificationTypeDto.GeneralUpdate:
      return 'General';
    default:
      return 'Notification';
  }
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

type TabValue = 'all' | 'unread' | 'read';

export const NotificationsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<TabValue>('all');
  
  // Get current user
  const { data: user } = useUserInfoQuery();
  
  // Fetch notifications for the current user
  const { data: apiNotifications = [], isLoading, error, refetch } = useFetchNotificationsByUserIdQuery(
    user?.id || '', 
    { skip: !user?.id }
  );
    const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  // Initialize SignalR for real-time notifications
  useSignalRNotifications();

  // Sort notifications by date (newest first)
  const sortedNotifications = [...apiNotifications].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const validNotifications = sortedNotifications.filter(n => n.notificationId);

  const unreadNotifications = validNotifications.filter(n => !n.isRead);
  const readNotifications = validNotifications.filter(n => n.isRead);

  const getFilteredNotifications = (): NotificationDto[] => {
    switch (currentTab) {
      case 'unread':
        return unreadNotifications;
      case 'read':
        return readNotifications;
      default:
        return validNotifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
  };

  const handleNotificationClick = async (notification: NotificationDto) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.notificationId);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate to related entity if URL is provided
    if (notification.relatedEntityUrl) {
      navigate(notification.relatedEntityUrl);
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        unreadNotifications.map(notification => markAsRead(notification.notificationId))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <HeaderCard>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    <NotificationsIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      Notifications
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Stay updated with your latest activities and updates
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Refresh">
                    <IconButton onClick={handleRefresh} disabled={isLoading}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  {unreadNotifications.length > 0 && (
                    <Button
                      variant="outlined"
                      startIcon={<DoneAll />}
                      onClick={handleMarkAllAsRead}
                      sx={{ borderRadius: 2 }}
                    >
                      Mark All Read
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Statistics */}
              <StatsGrid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <StatCard elevation={0}>                    <Typography variant="h3" fontWeight={700} color="primary.main">
                      {apiNotifications.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Notifications
                    </Typography>
                  </StatCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard elevation={0}>
                    <Typography variant="h3" fontWeight={700} color="error.main">
                      {unreadNotifications.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unread
                    </Typography>
                  </StatCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard elevation={0}>
                    <Typography variant="h3" fontWeight={700} color="success.main">
                      {readNotifications.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Read
                    </Typography>
                  </StatCard>
                </Grid>
              </StatsGrid>
            </CardContent>
          </HeaderCard>

          {/* Tabs */}
          <Paper sx={{ borderRadius: 2, mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                },
              }}            >
              <Tab
                key="all"
                label={`All (${apiNotifications.length})`}
                value="all"
              />
              <Tab
                key="unread"
                label={`Unread (${unreadNotifications.length})`}
                value="unread"
              />
              <Tab
                key="read"
                label={`Read (${readNotifications.length})`}
                value="read"
              />
            </Tabs>
          </Paper>

          {/* Content */}
          <Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={40} />
              </Box>
            ) : error ? (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Error color="error" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Failed to load notifications
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  There was an error loading your notifications. Please try again.
                </Typography>
                <Button variant="outlined" onClick={handleRefresh}>
                  Try Again
                </Button>
              </Paper>
            ) : filteredNotifications.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {currentTab === 'unread' ? 'No unread notifications' : 
                   currentTab === 'read' ? 'No read notifications' : 
                   'No notifications yet'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentTab === 'unread' ? 'All caught up! You have no unread notifications.' :
                   currentTab === 'read' ? 'No notifications have been read yet.' :
                   "You'll see notifications here when you have new updates."}
                </Typography>
              </Paper>
            ) : (
              <List disablePadding>
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.notificationId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <NotificationCard
                        sx={{
                          cursor: 'pointer',
                          opacity: notification.isRead ? 0.8 : 1,
                          backgroundColor: notification.isRead 
                            ? 'transparent' 
                            : alpha(theme.palette.primary.main, 0.02),
                        }}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'transparent',
                              }}
                            >
                              {getNotificationIcon(notification.type, notification.isRead)}
                            </Avatar>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Chip
                                  label={getNotificationTypeLabel(notification.type)}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                                />
                                {!notification.isRead && (
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      backgroundColor: theme.palette.error.main,
                                    }}
                                  />
                                )}
                              </Box>

                              <Typography
                                variant="body1"
                                fontWeight={notification.isRead ? 400 : 600}
                                sx={{ mb: 1, lineHeight: 1.5 }}
                              >
                                {notification.message}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {getTimeAgo(notification.createdAt)}
                              </Typography>
                            </Box>

                            <IconButton
                              size="small"
                              onClick={(e) => handleDeleteNotification(e, notification.notificationId)}
                              sx={{ 
                                opacity: 0.6,
                                '&:hover': { opacity: 1 }
                              }}
                            >
                              <Clear fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </NotificationCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            )}
          </Box>
        </motion.div>
      </Container>
    </PageContainer>
  );
};

export default NotificationsPage;
