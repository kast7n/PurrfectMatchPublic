import {
  Menu,
  Fade,
  MenuItem,
  Button,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../models/user";
import { Favorite, Logout, Person, Dashboard } from "@mui/icons-material";
import { useLogoutMutation } from "../../features/account/accountApi";

type Props = {
  user: User;
};

export default function UserMenu({ user }: Props) {
  const [logout] = useLogoutMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>      <Button
        color="inherit"
        size="large"
        sx={{
          fontSize: '1.1rem',
          textTransform: 'none',
          padding: '6px 16px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
        onClick={handleClick}
      >
        {user.email.split('@')[0]}
      </Button><Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
          sx: {
            padding: 0,
            borderRadius: '8px',
            boxShadow: (theme) => theme.palette.mode === 'dark' 
              ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
              : '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
            minWidth: '200px',
            backgroundColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(31, 41, 55, 0.95)' 
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            border: (theme) => theme.palette.mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.05)',
          },
        }}
      >        <MenuItem 
          component={Link} 
          to="/profile/dashboard"
          onClick={handleClose} 
          sx={{
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <ListItemIcon>
            <Person sx={{ color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Profile</ListItemText>
        </MenuItem>
          {/* Admin Dashboard Link */}
        {(user.roles?.includes('Admin') || user.roles?.includes('ShelterManager')) && (          <MenuItem 
            component={Link} 
            to="/dashboard"
            onClick={handleClose} 
            sx={{
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <ListItemIcon>
              <Dashboard sx={{ color: 'warning.main' }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>
              Admin Dashboard
            </ListItemText>
          </MenuItem>
        )}          <MenuItem 
          component={Link} 
          to="/favorites"
          onClick={handleClose} 
          sx={{
          '&:hover': {
            backgroundColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.05)',
          },
        }}>
          <ListItemIcon>
            <Favorite sx={{ color: 'secondary.main' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Favorites</ListItemText>
        </MenuItem>
        <Divider sx={{ 
          borderColor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(0, 0, 0, 0.12)' 
        }} />        <MenuItem
          onClick={() => logout()}
          sx={{
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(255, 0, 0, 0.2)' 
                : 'rgba(255, 0, 0, 0.1)',
            },
          }}
        >
          <ListItemIcon>
            <Logout sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
