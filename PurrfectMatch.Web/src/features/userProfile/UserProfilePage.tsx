import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  styled, 
  Grid, 
  useMediaQuery, 
  useTheme,
  Drawer,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Menu as MenuIcon, ChevronRight } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import ProfileDashboard from './ProfileDashboard';
import ManageApplications from './ManageApplications';
import ChangePasswordForm from './ChangePasswordForm';
import EditProfileForm from './EditProfileForm';

// Styled components following the app's design patterns
const UserProfileContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(to bottom, #111827, #0d1424)`
    : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
  minHeight: '100vh',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(4),
  },
}));

const MobileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1, 0),
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(31, 41, 55, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(1.5),
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
    : '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(31, 41, 55, 0.9)'
      : 'rgba(255, 255, 255, 0.95)',
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)'
      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: 'none',
    padding: theme.spacing(2),
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  minHeight: '500px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    fontSize: '2.125rem',
    marginBottom: theme.spacing(4),
  },
}));

const SectionBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiBreadcrumbs-separator': {
    color: theme.palette.text.secondary,
  },
  '& .MuiLink-root': {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    fontSize: '0.875rem',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiTypography-root': {
    color: theme.palette.primary.main,
    fontSize: '0.875rem',
    fontWeight: 500,
  },
}));

const UserProfilePage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Default to dashboard if no section specified
  const activeSection = section || 'dashboard';

  // Redirect to /profile/dashboard if no section in URL
  useEffect(() => {
    if (!section) {
      navigate('/profile/dashboard', { replace: true });
    }
  }, [section, navigate]);

  const handleSidebarItemClick = (itemId: string) => {
    navigate(`/profile/${itemId}`);
    // Close mobile menu when item is selected
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'dashboard':
        return 'Dashboard';
      case 'applications':
        return 'Manage Applications';
      case 'edit-profile':
        return 'Edit Profile';
      case 'change-password':
        return 'Change Password';
      default:
        return 'User Profile';
    }
  };const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ProfileDashboard />;
      case 'applications':
        return <ManageApplications />;
      case 'edit-profile':
        return <EditProfileForm />;
      case 'change-password':
        return <ChangePasswordForm />;
      default:
        return null;
    }
  };
    return (
    <UserProfileContainer>
      <Container maxWidth="xl">
        <Box sx={{ py: { xs: 2, md: 4 } }}>          {/* Mobile Header with Menu Button */}
          {isMobile && (
            <MobileHeader>
              <PageTitle variant="h4">
                {getSectionTitle(activeSection)}
              </PageTitle>
              <MobileMenuButton onClick={handleMobileMenuToggle}>
                <MenuIcon />
              </MobileMenuButton>
            </MobileHeader>
          )}

          {/* Desktop Title */}
          {!isMobile && (
            <Box sx={{ mb: 4 }}>
              <PageTitle variant="h4">
                User Profile
              </PageTitle>
              <SectionBreadcrumbs separator={<ChevronRight fontSize="small" />}>
                <Link onClick={() => navigate('/profile/dashboard')} sx={{ cursor: 'pointer' }}>
                  Profile
                </Link>
                <Typography>{getSectionTitle(activeSection)}</Typography>
              </SectionBreadcrumbs>
            </Box>
          )}

          {/* Mobile Drawer for Navigation */}
          <MobileDrawer
            anchor="left"
            open={mobileMenuOpen}
            onClose={handleMobileMenuToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
          >
            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3, 
                  textAlign: 'center',
                  color: 'primary.main' 
                }}
              >
                Profile Menu
              </Typography>
              <ProfileSidebar 
                activeItem={activeSection}
                onItemClick={handleSidebarItemClick}
              />
            </Box>
          </MobileDrawer>
          
          <Grid container spacing={{ xs: 0, md: 3 }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
              <Grid item md={3}>
                <ProfileSidebar 
                  activeItem={activeSection}
                  onItemClick={handleSidebarItemClick}
                />
              </Grid>
            )}
            
            {/* Main Content Area */}
            <Grid item xs={12} md={isMobile ? 12 : 9}>
              <ContentContainer>
                {renderContent()}
              </ContentContainer>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </UserProfileContainer>
  );
};

export default UserProfilePage;
