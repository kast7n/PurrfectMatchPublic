import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  styled,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  Edit,
  Lock,
} from '@mui/icons-material';

// Styled components following the app's design patterns
const SidebarContainer = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  height: 'fit-content',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  minWidth: '250px',
  // Mobile responsivity
  [theme.breakpoints.down('md')]: {
    minWidth: 'auto',
    width: '100%',
    boxShadow: 'none',
    background: 'transparent',
    border: 'none',
    padding: theme.spacing(1),
  },
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
  textAlign: 'center',
  // Mobile responsivity
  [theme.breakpoints.down('md')]: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1.5),
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1.5, 2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.15)'
      : 'rgba(99, 102, 241, 0.08)',
    transform: 'translateX(4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(99, 102, 241, 0.2)'
      : '0 4px 12px rgba(99, 102, 241, 0.15)',
  },
  '&.active': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.2)'
      : 'rgba(99, 102, 241, 0.1)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  },
  // Mobile responsivity
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.2, 1.5),
    marginBottom: theme.spacing(0.8),
    '&:hover': {
      transform: 'none', // Disable transform on mobile
    },
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '40px',
  color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
  // Mobile responsivity
  [theme.breakpoints.down('md')]: {
    minWidth: '36px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.3rem',
    },
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: theme.palette.mode === 'dark' ? '#F3F4F6' : '#374151',
  },
  // Mobile responsivity
  [theme.breakpoints.down('md')]: {
    '& .MuiListItemText-primary': {
      fontSize: '0.9rem',
    },
  },
}));

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactElement;
}

interface ProfileSidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Dashboard />,
  },
  {
    id: 'applications',
    label: 'Manage Applications',
    icon: <Assignment />,
  },
  {
    id: 'edit-profile',
    label: 'Edit Profile',
    icon: <Edit />,
  },
  {
    id: 'change-password',
    label: 'Change Password',
    icon: <Lock />,
  },
];

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  activeItem = 'dashboard', 
  onItemClick 
}) => {
  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  return (
    <SidebarContainer elevation={0}>
      <SidebarTitle variant="h6">
        Profile Menu
      </SidebarTitle>
      
      <List sx={{ padding: 0 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <StyledListItemButton
              className={activeItem === item.id ? 'active' : ''}
              onClick={() => handleItemClick(item.id)}
            >
              <StyledListItemIcon>
                {item.icon}
              </StyledListItemIcon>
              <StyledListItemText primary={item.label} />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
    </SidebarContainer>
  );
};

export default ProfileSidebar;
