import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,  Chip,  IconButton,
  Card,
  CardContent,
  Badge,
  useTheme,
  styled,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

interface DashboardHeaderProps {
  userRole: 'Admin' | 'ShelterManager';
  userName: string;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
  notificationCount: number;
  // Optional props for dynamic content
  statsData?: StatsCardProps[];
  quickActions?: QuickActionProps[];
  recentNotifications?: NotificationItemProps[];
}

// Styled components
const HeaderContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 20,
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`
    : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.3)'
    : '0 8px 32px rgba(0,0,0,0.1)',
  // Mobile responsive padding
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 16,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    borderRadius: 12,
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
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

const QuickActionCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px rgba(0,0,0,0.3)'
      : '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const NotificationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: 12,
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
  },
}));

const StatsCardComponent: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  subtitle,
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <StatsCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} color={`${color}.main`} sx={{ mb: 0.5 }}>
                {value}
              </Typography>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[color].main, 0.1),
                color: `${color}.main`,
                width: 56,
                height: 56,
              }}
            >
              {icon}
            </Avatar>
          </Box>

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={trend.direction === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${trend.direction === 'up' ? '+' : '-'}${trend.value}%`}
                size="small"
                color={trend.direction === 'up' ? 'success' : 'error'}
                variant="outlined"
                sx={{ fontSize: '0.75rem', height: 24 }}
              />
              <Typography variant="caption" color="text.secondary">
                {trend.period}
              </Typography>
            </Box>
          )}
        </CardContent>
      </StatsCard>
    </motion.div>
  );
};

const QuickActionComponent: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onClick,
  color = 'primary',
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <QuickActionCard onClick={onClick}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: `${color}.main`,
              width: 64,
              height: 64,
              margin: '0 auto 16px',
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </QuickActionCard>
    </motion.div>
  );
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  timestamp,
  type,
  read,
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <WarningIcon color="error" />;
      default:
        return <AssignmentIcon color="info" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NotificationCard sx={{ opacity: read ? 0.7 : 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'transparent' }}>
            {getTypeIcon()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timestamp}
            </Typography>
          </Box>
          {!read && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                mt: 1,
              }}
            />
          )}
        </Box>
      </NotificationCard>
    </motion.div>
  );
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userRole,
  userName,
  onNotificationClick,
  onSettingsClick,
  notificationCount,
  statsData = [],
  quickActions = [],
  recentNotifications = [],
}) => {
  const theme = useTheme();
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box>      {/* Welcome Header */}
      <HeaderContainer elevation={0}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between', 
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1.5, sm: 2 },
            width: { xs: '100%', sm: 'auto' }
          }}>            <Avatar
              sx={{
                width: { xs: 48, sm: 64 },
                height: { xs: 48, sm: 64 },
                border: `3px solid ${theme.palette.primary.main}`,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: { xs: 1, sm: 'none' } }}>
              <Typography 
                variant="h4" 
                fontWeight={700} 
                color="text.primary"
                sx={{ 
                  fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' },
                  lineHeight: { xs: 1.2, sm: 1.4 }
                }}
              >
                Welcome back, {userName}! 👋
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                }}
              >
                {currentTime}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            alignSelf: { xs: 'flex-end', sm: 'center' }
          }}>
            <IconButton
              onClick={onNotificationClick}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
              }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon color="primary" fontSize="small" />
              </Badge>
            </IconButton>
            <IconButton
              onClick={onSettingsClick}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
              }}
            >
              <SettingsIcon color="primary" fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Role Badge */}
        <Chip
          label={userRole === 'Admin' ? 'System Administrator' : 'Shelter Manager'}
          color="primary"
          size="small"
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        />
      </HeaderContainer>      {/* Stats Cards */}
      {statsData.length > 0 && (
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCardComponent {...stat} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Content Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <Grid item xs={12} lg={8}>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              gutterBottom 
              sx={{ 
                mb: { xs: 2, md: 3 },
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <QuickActionComponent
                    {...action}
                    onClick={() => console.log(`Quick action: ${action.title}`)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Recent Notifications */}
        <Grid item xs={12} lg={quickActions.length > 0 ? 4 : 12}>
          <Typography 
            variant="h5" 
            fontWeight={700} 
            gutterBottom 
            sx={{ 
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Recent Notifications
          </Typography><Box sx={{ 
            maxHeight: { xs: 300, md: 400 }, 
            overflowY: 'auto',
            pr: { xs: 0, sm: 1 }
          }}>
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <NotificationItem key={notification.id} {...notification} />
              ))
            ) : (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                No recent notifications
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHeader;
