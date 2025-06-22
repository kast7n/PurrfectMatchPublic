import React, { useState, useEffect } from 'react';
import { 
  Box, 
  useMediaQuery, 
  useTheme, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography,
  alpha
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUserInfoQuery } from '../account/accountApi';
import DashboardSidebar from './components/DashboardSidebar';

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: user } = useUserInfoQuery();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Auto-adjust sidebar state based on screen size
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Determine user role - priority: Admin > ShelterManager > fallback to Admin
  const getUserRole = (): 'Admin' | 'ShelterManager' => {
    if (!user?.roles) return 'Admin';
    
    if (user.roles.includes('Admin')) return 'Admin';
    if (user.roles.includes('ShelterManager')) return 'ShelterManager';
    
    return 'Admin'; // Fallback
  };

  const userRole = getUserRole();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleMenuItemClick = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[900]
          : theme.palette.grey[50],
        flexDirection: 'column',
      }}
    >      {/* Mobile Header */}
      {isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.appBar - 1, // Lower than main NavBar
            backgroundColor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.95)
              : alpha(theme.palette.background.paper, 0.95),
            color: theme.palette.text.primary,
            boxShadow: 'none',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            top: '80px', // Position below main NavBar
            backdropFilter: 'blur(12px)',
          }}
        >
          <Toolbar sx={{ minHeight: '56px !important', py: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="admin menu"
              onClick={handleSidebarToggle}
              size="small"
              sx={{ 
                mr: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: theme.palette.primary.main,
              }}
            >
              Admin Panel
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Management
            </Typography>
          </Toolbar>
        </AppBar>
      )}      {/* Main Content Container */}
      <Box sx={{ display: 'flex', flex: 1, mt: isMobile ? '136px' : 0 }}> {/* Reduced from 144px to 136px */}
        {/* Sidebar */}
        <DashboardSidebar
          userRole={userRole}
          isOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
          isMobile={isMobile}
          onMenuItemClick={handleMenuItemClick}
          currentPath={location.pathname}
          userId={user?.id}
          user={user}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            // Better mobile spacing
            minHeight: isMobile ? 'calc(100vh - 136px)' : '100vh',
            // Add left margin when sidebar is expanded on desktop
            ml: !isMobile && sidebarOpen ? 0 : 0, // Sidebar handles its own width
            transition: theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),        }}
        >
          {/* Page Content */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 1, sm: 2, md: 3 }, // More responsive padding
              overflow: 'auto',
              // Better mobile content spacing
              height: isMobile ? 'calc(100vh - 136px)' : 'auto',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer - 1,
          }}
          onClick={handleSidebarToggle}
        />
      )}
    </Box>
  );
};

export default DashboardLayout;
