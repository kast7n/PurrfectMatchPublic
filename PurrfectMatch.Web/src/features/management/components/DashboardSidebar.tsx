import React, { useState, useMemo } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Collapse,
  Badge,
  Chip,
  useTheme,
  styled,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Pets as PetsIcon,
  Business as SheltersIcon,
  People as UsersIcon,
  Assessment as AnalyticsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings,
  ManageAccounts,  Assignment as ApplicationsIcon,
  HealthAndSafety as HealthIcon,
  Category as SpeciesIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetchFilteredAdoptionApplicationsQuery } from '../../adoptionApplication/adoptionApplicationApi';
import { useFetchAllShelterApplicationsQuery } from '../../shelter/shelterApi';
import { ApplicationStatusDto } from '../../../app/models/AdoptionApplication';
import { User } from '../../../app/models/user';

// User roles type
type UserRole = 'Admin' | 'ShelterManager';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
  badge?: number;
  children?: MenuItem[];
}

interface DashboardSidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
  onMenuItemClick: (path: string) => void;
  currentPath: string;
  userId?: string; // Add user ID to fetch applications
  user?: User; // Add user object to get shelterId
}

// Styled components with theme integration
const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen' && prop !== 'isMobile',
})<{ isOpen: boolean; isMobile: boolean }>(({ theme, isOpen, isMobile }) => ({
  height: '100vh',
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.9)
    : alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(12px)',
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  width: isOpen ? (isMobile ? 280 : 260) : (isMobile ? 0 : 72),
  minWidth: isOpen ? (isMobile ? 280 : 260) : (isMobile ? 0 : 72),
  position: isMobile ? 'fixed' : 'relative',
  top: isMobile ? 0 : 'auto',
  left: isMobile ? 0 : 'auto',
  zIndex: isMobile ? theme.zIndex.drawer : 'auto',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark'
    ? '4px 0 20px rgba(0,0,0,0.3)'
    : '4px 0 20px rgba(0,0,0,0.08)',
  transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
}));

const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2, 1, 2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  minHeight: 80,
}));

const MenuSection = styled(Box)(() => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha('#000', 0.2),
    borderRadius: 2,
  },
}));

const ToggleButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>(({ theme, isOpen }) => ({
  position: 'absolute',
  top: '50%',
  right: isOpen ? 12 : -16,
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  width: 32,
  height: 32,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 12px rgba(0,0,0,0.3)'
    : '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1000,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-50%) scale(1.1)',
  },
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isOpen',
})<{ isActive?: boolean; isOpen: boolean }>(({ theme, isActive, isOpen }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: 12,
  minHeight: 48,
  backgroundColor: isActive
    ? alpha(theme.palette.primary.main, 0.12)
    : 'transparent',
  border: isActive
    ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
    : '1px solid transparent',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',  '&:hover': {
    backgroundColor: isActive
      ? alpha(theme.palette.primary.main, 0.18)
      : theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.08)
        : alpha(theme.palette.primary.main, 0.04),
    transform: 'translateX(4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(0,0,0,0.2)'
      : '0 4px 12px rgba(0,0,0,0.1)',
  },
  '& .MuiListItemIcon-root': {
    minWidth: isOpen ? 40 : 'auto',
    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
    transition: 'color 0.3s ease',
  },
  '& .MuiListItemText-root': {
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 0.3s ease',
    '& .MuiTypography-root': {
      fontWeight: isActive ? 600 : 500,
      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    },
  },
}));

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: ['Admin', 'ShelterManager'],
  },  {
    id: 'pets',
    title: 'Pet Management',
    icon: <PetsIcon />,
    path: '/dashboard/pets',
    roles: ['Admin', 'ShelterManager'],
    children: [
      {
        id: 'pets-all',
        title: 'All Pets',
        icon: <PetsIcon />,
        path: '/dashboard/pets/all',
        roles: ['Admin', 'ShelterManager'],
      },
      {
        id: 'pets-applications',
        title: 'Adoption Applications',
        icon: <ApplicationsIcon />,
        path: '/dashboard/applications',
        roles: ['ShelterManager'],
      },
    ],
  },
  {
    id: 'shelters',
    title: 'Shelter Management',
    icon: <SheltersIcon />,
    path: '/dashboard/shelters',
    roles: ['Admin'],
    children: [
      {
        id: 'shelters-all',
        title: 'All Shelters',
        icon: <SheltersIcon />,
        path: '/dashboard/shelters/all',
        roles: ['Admin'],
      },      {
        id: 'shelters-applications',
        title: 'Applications',
        icon: <ApplicationsIcon />,
        path: '/dashboard/shelters/applications',
        roles: ['Admin'],
      },
    ],
  },  {
    id: 'my-shelter',
    title: 'My Shelter',
    icon: <SheltersIcon />,
    path: '/dashboard/my-shelter',
    roles: ['ShelterManager'],
    children: [
      {
        id: 'my-shelter-info',
        title: 'Shelter Info',
        icon: <SheltersIcon />,
        path: '/dashboard/my-shelter/info',
        roles: ['ShelterManager'],
      },
      {
        id: 'my-shelter-pets',
        title: 'My Pets',
        icon: <PetsIcon />,
        path: '/dashboard/my-shelter/pets',
        roles: ['ShelterManager'],
      },
    ],
  },  {
    id: 'users',
    title: 'User Management',
    icon: <UsersIcon />,
    path: '/dashboard/users',
    roles: ['Admin', 'ShelterManager'],
  },
  {
    id: 'pet-attributes',
    title: 'Pet Attributes',
    icon: <SpeciesIcon />,
    path: '/dashboard/pet-attributes',
    roles: ['Admin'],
    children: [
      {
        id: 'pet-attributes-species',
        title: 'Species',
        icon: <SpeciesIcon />,
        path: '/dashboard/pet-attributes/species',
        roles: ['Admin'],
      },
      {
        id: 'pet-attributes-breeds',
        title: 'Breeds',
        icon: <PetsIcon />,
        path: '/dashboard/pet-attributes/breeds',
        roles: ['Admin'],
      },
      {
        id: 'pet-attributes-colors',
        title: 'Colors',
        icon: <SpeciesIcon />,
        path: '/dashboard/pet-attributes/colors',
        roles: ['Admin'],
      },
      {
        id: 'pet-attributes-coat-lengths',
        title: 'Coat Lengths',
        icon: <SpeciesIcon />,
        path: '/dashboard/pet-attributes/coat-lengths',
        roles: ['Admin'],
      },
      {
        id: 'pet-attributes-activity-levels',
        title: 'Activity Levels',
        icon: <AnalyticsIcon />,
        path: '/dashboard/pet-attributes/activity-levels',
        roles: ['Admin'],
      },
      {
        id: 'pet-attributes-health-statuses',
        title: 'Health Statuses',
        icon: <HealthIcon />,
        path: '/dashboard/pet-attributes/health-statuses',
        roles: ['Admin'],
      },    ],
  },
  {
    id: 'articles',
    title: 'Article Management',
    icon: <ArticleIcon />,
    path: '/dashboard/articles',
    roles: ['Admin'],
  }
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  userRole,
  isOpen,
  onToggle,
  isMobile,
  onMenuItemClick,
  currentPath,
  user, // Get user object to access shelterId
}) => {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Fetch adoption applications for ShelterManagers to show badge count
  const { data: adoptionApplications } = useFetchFilteredAdoptionApplicationsQuery(
    {
      shelterId: user?.shelterId,
      status: ApplicationStatusDto.Pending,
    },
    {
      skip: userRole !== 'ShelterManager' || !user?.shelterId, // Only fetch for ShelterManagers with shelterId
    }
  );

  // Fetch shelter applications for Admins to show badge count
  const { data: shelterApplications } = useFetchAllShelterApplicationsQuery(
    { isApproved: false }, // Only fetch pending applications
    {
      skip: userRole !== 'Admin', // Only fetch for Admins
    }
  );  // Calculate badge counts
  const adoptionApplicationCount = useMemo(() => {
    if (userRole !== 'ShelterManager' || !adoptionApplications?.data) return 0;
    return adoptionApplications.data.length; // Use data.length since we're already filtering by pending status
  }, [adoptionApplications, userRole]);
  const shelterApplicationCount = useMemo(() => {
    if (userRole !== 'Admin' || !shelterApplications) return 0;
    return shelterApplications.length; // Already filtered to pending applications
  }, [shelterApplications, userRole]);
  // Create dynamic menu items with calculated badge counts
  const dynamicMenuItems = useMemo(() => {
    return menuItems.map(item => {
      // Add badge to Pet Management and its children for ShelterManagers
      if (item.id === 'pets' && userRole === 'ShelterManager') {
        const updatedChildren = item.children?.map(child => {
          if (child.id === 'pets-applications') {
            return { ...child, badge: adoptionApplicationCount > 0 ? adoptionApplicationCount : undefined };
          }
          return child;
        });
        return { 
          ...item, 
          badge: adoptionApplicationCount > 0 ? adoptionApplicationCount : undefined,
          children: updatedChildren 
        };
      }
      
      // Add badge to Shelter Management Applications for Admins
      if (item.id === 'shelters') {
        const updatedChildren = item.children?.map(child => {
          if (child.id === 'shelters-applications' && userRole === 'Admin') {
            return { ...child, badge: shelterApplicationCount > 0 ? shelterApplicationCount : undefined };
          }
          return child;
        });
        return { ...item, children: updatedChildren };
      }
      
      return item;
    });
  }, [userRole, adoptionApplicationCount, shelterApplicationCount]);

  // Filter menu items based on user role
  const filteredMenuItems = dynamicMenuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleExpandClick = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item.path);
    const filteredChildren = item.children?.filter(child => 
      child.roles.includes(userRole)
    );

    return (
      <Box key={item.id}>
        <StyledListItemButton
          isActive={isActive}
          isOpen={isOpen}
          onClick={() => {
            if (hasChildren && isOpen) {
              handleExpandClick(item.id);
            } else {
              onMenuItemClick(item.path);
            }
          }}
          sx={{ pl: level * 2 + 1 }}
        >
          <ListItemIcon>
            <Badge
              badgeContent={item.badge}
              color="error"
              overlap="circular"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.7rem',
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              {item.icon}
            </Badge>
          </ListItemIcon>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1 }}
              >
                <ListItemText 
                  primary={item.title}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '0.9rem',
                    },
                  }}
                />
                
                {hasChildren && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        color="primary"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    )}
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </StyledListItemButton>

        {/* Submenu */}
        {hasChildren && filteredChildren && (
          <Collapse in={isExpanded && isOpen} timeout="auto" unmountOnExit>
            <List disablePadding>
              {filteredChildren.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const sidebarContent = (
    <SidebarContainer isOpen={isOpen} isMobile={isMobile}>
      {/* Logo Section */}
      <LogoSection>
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {userRole === 'Admin' ? <AdminPanelSettings /> : <ManageAccounts />}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {userRole === 'Admin' ? 'Admin Panel' : 'Shelter Manager'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Management Dashboard
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {userRole === 'Admin' ? <AdminPanelSettings /> : <ManageAccounts />}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </LogoSection>

      {/* Menu Section */}
      <MenuSection>
        <List disablePadding sx={{ py: 1 }}>
          {filteredMenuItems.map(item => renderMenuItem(item))}
        </List>
      </MenuSection>

      {/* Footer Section */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                PurrfectMatch v1.0
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                © 2024 All rights reserved
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Toggle Button */}
      {!isMobile && (
        <ToggleButton isOpen={isOpen} onClick={onToggle}>
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </ToggleButton>
      )}
    </SidebarContainer>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            border: 'none',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return sidebarContent;
};

export default DashboardSidebar;
