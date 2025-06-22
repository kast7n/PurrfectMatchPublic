import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha,
  styled,
  CircularProgress,
} from '@mui/material';
import {
  Notifications,
  NotificationsNone,
  Circle,
  CheckCircle,
  Info,
  Warning,
  Error,
  ArrowForward,
  Clear,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFetchNotificationsByUserIdQuery, useMarkNotificationAsReadMutation, useDeleteNotificationMutation } from '../notificationApi';
import { NotificationDto, NotificationTypeDto } from '../../../app/models/Notification';
import { useUserInfoQuery } from '../../account/accountApi';
import { useSignalRNotifications } from '../../../hooks/useSignalRNotifications';

// Styled components
const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 16,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    overflow: 'hidden',
    minWidth: 320,
    maxWidth: 400,
    width: '90vw',
    maxHeight: '70vh',
    [theme.breakpoints.down('sm')]: {
      minWidth: 280,
      maxWidth: '95vw',
      width: '95vw',
      maxHeight: '80vh',
      borderRadius: 12,
    },
  },
}));

const NotificationItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    minHeight: 'auto',
  },
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)}, ${alpha(theme.palette.background.paper, 0.9)})`
    : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.background.paper, 0.9)})`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2),
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    gap: theme.spacing(1.5),
  },
}));

interface NotificationDropdownProps {
  iconSize?: 'small' | 'medium' | 'large';
}

const getNotificationIcon = (type: NotificationTypeDto, isRead: boolean) => {
  const iconProps = {
    fontSize: 'small' as const,
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

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ iconSize = 'small' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    // Get current user
  const { data: user } = useUserInfoQuery();
  
  // Fetch notifications for the current user
  const { data: apiNotifications = [], isLoading, error } = useFetchNotificationsByUserIdQuery(
    user?.id || '', 
    { skip: !user?.id }
  );  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  // Initialize SignalR for real-time notifications
  useSignalRNotifications();

  // Use real API notifications
  const notifications = apiNotifications;
  // Sort notifications by date (newest first) and then by read status (unread first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    // First sort by date (newest first)
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    if (dateA !== dateB) {
      return dateB - dateA; // Newest first
    }
    
    // If dates are equal, sort by read status (unread first)
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    
    return 0;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayedNotifications = sortedNotifications.slice(0, 5); // Show only 5 notifications

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleNotificationClick = async (notification: NotificationDto) => {    if (!notification.isRead && notification.notificationId) {
      try {
        await markAsRead(notification.notificationId);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate to related entity if URL is provided
    if (notification.relatedEntityUrl) {
      navigate(notification.relatedEntityUrl);
      handleClose();
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

  const handleViewAll = () => {
    navigate('/notifications');
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size={iconSize}
        aria-label="notifications"
        onClick={handleClick}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          position: 'relative',
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              height: 18,
              minWidth: 18,
              fontWeight: 600,
            }
          }}
        >
          {unreadCount > 0 ? (
            <Notifications fontSize={iconSize} />
          ) : (
            <NotificationsNone fontSize={iconSize} />
          )}
        </Badge>
      </IconButton>      <StyledPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile ? 'center' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isMobile ? 'center' : 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            marginTop: 1,
            ...(isMobile && {
              left: '50% !important',
              transform: 'translateX(-50%) !important',
              right: 'auto !important',
            }),
          },
        }}
      >        <NotificationHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography 
              variant={isMobile ? 'subtitle1' : 'h6'} 
              fontWeight={600}
              sx={{ fontSize: isMobile ? '1rem' : 'inherit' }}
            >
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography 
                variant="caption" 
                color="primary" 
                fontWeight={600}
                sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
              >
                {unreadCount} new
              </Typography>
            )}
          </Box>
        </NotificationHeader>

        <Box sx={{ 
          maxHeight: isMobile ? 300 : 400, 
          overflowY: 'auto',
          // Better scrolling on mobile
          ...(isMobile && {
            WebkitOverflowScrolling: 'touch',
          }),
        }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>          ) : error ? (
            <EmptyState>
              <Error color="error" sx={{ fontSize: isMobile ? 40 : 48 }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: isMobile ? '0.875rem' : 'inherit' }}
              >
                Failed to load notifications
              </Typography>
            </EmptyState>) : displayedNotifications.length === 0 ? (
            <EmptyState>
              <NotificationsNone sx={{ 
                fontSize: isMobile ? 40 : 48, 
                color: 'text.secondary' 
              }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: isMobile ? '0.875rem' : 'inherit' }}
              >
                No notifications yet
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: isMobile ? '0.75rem' : 'inherit',
                  px: isMobile ? 2 : 0,
                }}
              >
                You'll see notifications here when you have new updates
              </Typography>
            </EmptyState>
          ) : (            <List disablePadding>
              <AnimatePresence>
                {displayedNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.notificationId || `notification-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <NotificationItem
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        opacity: notification.isRead ? 0.7 : 1,
                        backgroundColor: notification.isRead 
                          ? 'transparent' 
                          : alpha(theme.palette.primary.main, 0.02),
                      }}
                    >                      <ListItemIcon sx={{ minWidth: isMobile ? 36 : 40 }}>
                        <Avatar
                          sx={{
                            width: isMobile ? 28 : 32,
                            height: isMobile ? 28 : 32,
                            bgcolor: 'transparent',
                          }}
                        >
                          {getNotificationIcon(notification.type, notification.isRead)}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Typography
                            variant={isMobile ? 'body2' : 'body2'}
                            fontWeight={notification.isRead ? 400 : 600}
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: isMobile ? 3 : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.4,
                              fontSize: isMobile ? '0.875rem' : 'inherit',
                              pr: 1,
                            }}
                          >
                            {notification.message}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary" sx={{
                            fontSize: isMobile ? '0.75rem' : 'inherit',
                          }}>
                            {getTimeAgo(notification.createdAt)}
                          </Typography>
                        }
                      />

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isMobile ? 0.5 : 1,
                        flexShrink: 0,
                      }}>                        {!notification.isRead && (
                          <Box
                            sx={{
                              width: isMobile ? 6 : 8,
                              height: isMobile ? 6 : 8,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.primary.main,
                            }}
                          />
                        )}                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteNotification(e, notification.notificationId || 0)}
                          sx={{ 
                            opacity: 0.6,
                            p: isMobile ? 0.5 : 1,
                            minWidth: isMobile ? 28 : 32,
                            minHeight: isMobile ? 28 : 32,
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          <Clear fontSize={isMobile ? 'small' : 'small'} />
                        </IconButton>
                      </Box>
                    </NotificationItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          )}
        </Box>        {displayedNotifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: isMobile ? 1.5 : 2 }}>
              <Button
                fullWidth
                variant="outlined"
                endIcon={<ArrowForward />}
                onClick={handleViewAll}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: isMobile ? '0.875rem' : 'inherit',
                  py: isMobile ? 1 : 1.5,
                }}
              >
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </StyledPopover>
    </>
  );
};

export default NotificationDropdown;
