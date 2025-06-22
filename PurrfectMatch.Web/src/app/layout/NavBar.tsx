import { Close, Menu, Login, PersonAdd } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  Box,
  Button,
  useMediaQuery,
  Drawer,
  Divider,
  styled,
  useTheme,
  alpha,
  useScrollTrigger,
  GlobalStyles,
  ListItemButton,
} from "@mui/material";
import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { toggleDarkMode } from "./uiSlice";
import UserMenu from "./UserMenu";
import PurrfectMatchLogo from "../../images/PurffectMatchLogo.png";
import MuiLottieLoader from "../shared/components/MuiLottieLoader";
import ShibaInuIcon from "../shared/components/ShibaInuIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfoQuery, useLogoutMutation } from "../../features/account/accountApi";
import NotificationDropdown from "../../features/notification/components/NotificationDropdown";

// AnimatedShibaThemeToggle Component
interface AnimatedShibaThemeToggleProps {
  isDarkMode: boolean;
  onClick: () => void;
}

const AnimatedShibaThemeToggle: React.FC<AnimatedShibaThemeToggleProps> = ({ isDarkMode, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 600);
  };
  return (
    <Box 
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        animation: isAnimating 
          ? `${isDarkMode ? 'bounce3DLight' : 'bounce3DDark'} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)` 
          : 'none',
        '&::before': isAnimating ? {
          content: '""',
          position: 'absolute',
          top: '-8px',
          left: '-8px',
          right: '-8px',
          bottom: '-8px',
          background: theme => theme.palette.mode === 'dark' 
            ? 'radial-gradient(circle, rgba(255,138,138,0.4) 0%, rgba(255,138,138,0) 70%)' 
            : 'radial-gradient(circle, rgba(255,107,107,0.3) 0%, rgba(255,107,107,0) 70%)',
          borderRadius: '50%',
          animation: 'pulseEffect 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: -1,
        } : {},
        '@keyframes pulseEffect': {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '50%': { transform: 'scale(1.2)', opacity: 1 },
          '100%': { transform: 'scale(1.5)', opacity: 0 },
        },
        '@keyframes bounce3DLight': {
          '0%': { transform: 'scale(1) rotateY(0deg)' },
          '40%': { transform: 'scale(1.15) rotateY(180deg)' },
          '70%': { transform: 'scale(1.05) rotateY(300deg)' },
          '100%': { transform: 'scale(1) rotateY(360deg)' }
        },
        '@keyframes bounce3DDark': {
          '0%': { transform: 'scale(1) rotateY(0deg)' },
          '40%': { transform: 'scale(1.15) rotateY(-180deg)' },
          '70%': { transform: 'scale(1.05) rotateY(-300deg)' },
          '100%': { transform: 'scale(1) rotateY(-360deg)' }
        }
      }}
    >      <ShibaInuIcon 
        width={32} 
        height={32} 
        variant={isDarkMode ? 'dark' : 'light'} 
        className={isAnimating ? "animating-shiba" : ""}
      />
    </Box>
  );
};

const midLinks = [
  { title: "home", path: "/" },
  { title: "adopt", path: "/pets" },
  { title: "shelters", path: "/shelters" },
  { title: "articles", path: "/articles" },
  { title: "about", path: "/about" },
  { title: "donate", path: "/donate" },
  { title: "contact", path: "/contact" },
];

// Define interfaces for our styled components
interface ScrollableComponentProps {
  $isScrolled?: boolean;
}

// Styled components for the Navbar
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== '$isScrolled',
})<ScrollableComponentProps>(({ theme, $isScrolled = false }) => ({
  boxShadow: "none",
  backgroundColor: "transparent",
  transition: "all 0.3s ease-in-out",
  marginTop: "1rem",
  border: "none", // Remove any border
  "& .MuiToolbar-root": {
    minHeight: "auto",
    padding: "0.5rem 1rem",
    background: "transparent",
    boxShadow: "none", // Remove any shadow
    border: "none", // Remove any border
    [theme.breakpoints.up("md")]: {
      padding: "0.5rem 1rem", // Consistent padding on all screen sizes
    },
  },
  ...($isScrolled && {
    backgroundColor: "transparent",
    boxShadow: "none", // Remove any shadow
    "& .MuiToolbar-root": {
      backgroundColor: "transparent",
      boxShadow: "none", // Remove any shadow
    },
  }),
}));

const NavLinksContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isScrolled',
})<ScrollableComponentProps>(({ theme, $isScrolled = false }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center", // Center items vertically
  backgroundColor: theme.palette.mode === "dark" 
    ? alpha("#1F2937", $isScrolled ? 0.95 : 0.7) 
    : alpha("#FFFFFF", $isScrolled ? 0.95 : 0.85),
  backdropFilter: "blur(8px)",
  borderRadius: 28,
  padding: "4px 8px", // Reduced horizontal padding
  border: "none", // Remove any border
  boxShadow: theme.palette.mode === "dark"
    ? `0 4px 12px rgba(0, 0, 0, ${$isScrolled ? 0.25 : 0.2})`
    : `0 4px 12px rgba(0, 0, 0, ${$isScrolled ? 0.08 : 0.05})`,
  transition: "all 0.3s ease-in-out",
  height: "46px", // Set a fixed height
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: "inherit",
  transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
  backgroundColor: theme.palette.mode === "dark" 
    ? alpha("#1F2937", 0.7) 
    : alpha("#FFFFFF", 0.85),
  backdropFilter: "blur(8px)",
  boxShadow: theme.palette.mode === "dark"
    ? "0 2px 6px rgba(0, 0, 0, 0.15)"
    : "0 2px 6px rgba(0, 0, 0, 0.05)",
  width: "36px", // Fixed width
  height: "36px", // Fixed height
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" 
      ? alpha(theme.palette.primary.main, 0.15) 
      : alpha(theme.palette.primary.main, 0.05),
    transform: "scale(1.05) translateY(-1px)",
  },
}));

// User section container
const UserActionsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isScrolled',
})<ScrollableComponentProps>(({ theme, $isScrolled = false }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5), // Reduced gap between elements
  backgroundColor: theme.palette.mode === "dark" 
    ? alpha("#1F2937", $isScrolled ? 0.95 : 0.7) 
    : alpha("#FFFFFF", $isScrolled ? 0.95 : 0.85),
  backdropFilter: "blur(8px)",
  borderRadius: 28,
  padding: "4px 6px", // Reduced horizontal padding
  border: "none", // Remove any border
  boxShadow: theme.palette.mode === "dark"
    ? `0 4px 12px rgba(0, 0, 0, ${$isScrolled ? 0.25 : 0.2})`
    : `0 4px 12px rgba(0, 0, 0, ${$isScrolled ? 0.08 : 0.05})`,
  transition: "all 0.3s ease-in-out",
  height: "46px", // Set a fixed height
}));

// Auth buttons for right section
const AuthButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: "none",
  padding: "4px 8px", // Reduced padding
  fontFamily: "'Inter', 'Roboto', sans-serif",
  fontWeight: 500,
  fontSize: "0.85rem",
  transition: "all 0.2s ease-in-out",
  minWidth: "auto",
  height: "36px", // Fixed height for consistency
  "&:hover": {
    transform: "translateY(-1px)",
  },
  margin: theme.spacing(0, 0.25), // Reduced margin between buttons
}));

export default function NavBar() {
  const { isLoading, darkMode } = useAppSelector((state) => state.ui);
  const dispatch = useDispatch();
  const { data: user } = useUserInfoQuery(); // Fetch user data
  const [logout] = useLogoutMutation(); // Add logout mutation
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  
  // Scroll effect
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Mobile drawer content
  const drawerContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        padding: theme.spacing(3, 0),
        backgroundColor: "transparent",
      }}
      role="presentation"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // Center the logo horizontally
          position: "relative", // For absolute positioning of close button
          padding: "0 24px 24px 24px", // Replaces theme.spacing(0, 3, 3, 3)
        }}
      >
        <Box
          sx={{ height: 75, display: 'flex', alignItems: 'center' }}
          component="span"
        >
          <img src={PurrfectMatchLogo} alt="Purrfect Match Logo" style={{ height: 75, width: 'auto', display: 'block' }} />
        </Box>
        <StyledIconButton 
          onClick={toggleDrawer}
          sx={{
            position: "absolute",
            right: 24, // Matches left/right padding
            top: "50%",
            transform: "translateY(-50%)",
            width: 36,
            height: 36,
            backgroundColor: theme.palette.mode === "dark" 
              ? alpha("#111827", 0.7) 
              : alpha("#F1F5F9", 0.7)
          }}
        >
          <Close fontSize="small" />
        </StyledIconButton>
      </Box>

      <Divider sx={{ mb: 3, opacity: 0.6 }} />

      <List sx={{ px: 1 }}>
        {midLinks.map(({ title, path }) => (
          <ListItem disablePadding key={path}>
            <ListItemButton onClick={() => { toggleDrawer(); navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }); }} sx={{ borderRadius: 28, px: 3, py: 1 }}>
              {title.charAt(0).toUpperCase() + title.slice(1)}
            </ListItemButton>
          </ListItem>
        ))}
      </List>      <Divider sx={{ my: 2, opacity: 0.6 }} />

      <Box 
        sx={{ 
          px: 3, 
          py: 2,
          mx: 2,
          backgroundColor: theme.palette.mode === "dark" 
            ? alpha("#111827", 0.5) 
            : alpha("#FFFFFF", 0.5),
          backdropFilter: "blur(4px)",
          borderRadius: 4
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 2, 
            opacity: 0.7,
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: 0.5
          }}
        >
          Theme
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.palette.mode === "dark" 
              ? alpha("#1F2937", 0.7) 
              : alpha("#F1F5F9", 0.7),
            borderRadius: 20,
            padding: "6px 12px",
          }}
        >
          <Typography variant="body2">
            {darkMode ? "Dark Mode" : "Light Mode"}
          </Typography>          <StyledIconButton 
            sx={{ 
              width: 36, 
              height: 36,
              backgroundColor: "transparent",
              boxShadow: "none"
            }}
          >
            <AnimatedShibaThemeToggle isDarkMode={darkMode} onClick={() => dispatch(toggleDarkMode())} />
          </StyledIconButton>
        </Box>
      </Box>

      <Divider sx={{ my: 2, opacity: 0.6 }} />

      {user ? (
        <Box 
          sx={{ 
            px: 3, 
            py: 1,
            mx: 2,
            backgroundColor: theme.palette.mode === "dark" 
              ? alpha("#111827", 0.5) 
              : alpha("#FFFFFF", 0.5),
            backdropFilter: "blur(4px)",
            borderRadius: 4
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 2, 
              opacity: 0.7,
              fontWeight: 600,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: 0.5
            }}
          >
            User Options
          </Typography>
          <List sx={{ px: 0 }}>            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 28, px: 3, py: 1 }} onClick={() => {
                console.log("Profile clicked, navigating to /profile");
                navigate("/profile/dashboard");
                toggleDrawer(); // Close the drawer after navigation
              }}>
                Profile
              </ListItemButton>
            </ListItem>            {user.roles?.includes("Admin") && (
              <ListItem disablePadding>
                <ListItemButton sx={{ borderRadius: 28, px: 3, py: 1 }} onClick={() => {
                  navigate("/dashboard");
                  toggleDrawer(); // Close the drawer after navigation
                }}>
                  Admin Dashboard
                </ListItemButton>
              </ListItem>
            )}
            {user.roles?.includes("ShelterManager") && (
              <ListItem disablePadding>
                <ListItemButton sx={{ borderRadius: 28, px: 3, py: 1 }} onClick={() => {
                  navigate("/dashboard");
                  toggleDrawer(); // Close the drawer after navigation
                }}>
                  Shelter Dashboard
                </ListItemButton>
              </ListItem>            )}            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 28, px: 3, py: 1 }} onClick={() => {
                navigate("/notifications");
                toggleDrawer(); // Close the drawer after navigation
              }}>
                Notifications
              </ListItemButton>
            </ListItem>            <ListItem disablePadding>              <ListItemButton sx={{ borderRadius: 28, px: 3, py: 1 }} onClick={() => {
                navigate("/favorites");
                toggleDrawer(); // Close the drawer after navigation
              }}>
                Favorites
              </ListItemButton>
            </ListItem><ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  logout();
                  toggleDrawer(); // Close the drawer after logout
                }}
                sx={{ borderRadius: 28, px: 3, py: 1 }}
              >
                Logout
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      ) : (
        <Box 
          sx={{ 
            padding: theme.spacing(2),
            mx: 2,
            backgroundColor: theme.palette.mode === "dark" 
              ? alpha("#111827", 0.5) 
              : alpha("#FFFFFF", 0.5),
            backdropFilter: "blur(4px)",
            borderRadius: 4
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >            <AuthButton
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/login");
                toggleDrawer(); // Close the drawer after navigation
              }}
              startIcon={<Login />}
              fullWidth
            >
              Login
            </AuthButton>
            <AuthButton
              variant="outlined"
              color="primary"
              onClick={() => {
                navigate("/register");
                toggleDrawer(); // Close the drawer after navigation
              }}
              startIcon={<PersonAdd />}
              fullWidth
            >
              Sign Up
            </AuthButton>
          </Box>
        </Box>
      )}
    </Box>
  );  return (
    <>
      <GlobalStyles
        styles={{
          '.animating-shiba': {
            filter: `drop-shadow(0 0 5px ${theme.palette.mode === 'dark' ? 'rgba(255,138,138,0.7)' : 'rgba(255,107,107,0.5)'})`,
            transition: 'filter 0.3s ease-in-out',
          },
          '.logo-fade-in, .logo-fade-out': {
            willChange: 'opacity, transform, filter',
          },
          '.logo-fade-in': {
            opacity: 1,
            transform: 'none',
            filter: 'blur(0px) drop-shadow(0 2px 12px rgba(0,0,0,0.10))',
            transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          },
          '.logo-fade-out': {
            opacity: 0,
            transform: 'translateY(-40px) scale(0.7) rotate(-12deg)',
            filter: 'blur(4px) drop-shadow(0 8px 24px rgba(0,0,0,0.18))',
            transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          },
        }}
      />
      <StyledAppBar position="fixed" $isScrolled={scrollTrigger}><Toolbar
          sx={{
            display: "flex",
            justifyContent: "center", // Center all sections
            alignItems: "center",
            background: "transparent", // Ensure toolbar has transparent background
            boxShadow: "none", // Remove any shadow
            borderBottom: "none", // Remove any border
            gap: "8px", // Minimal spacing between sections
            padding: "0.5rem 1rem", // Reduce overall padding of the toolbar
            height: "62px", // Fixed height (46px + 16px padding)
          }}
        >{/* Left section - Logo */}          <Box
            className={scrollTrigger ? "logo-fade-out" : "logo-fade-in"}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // Center the logo horizontally
              padding: "4px 14px", // Increased horizontal padding for width
              border: "none",
              height: "75px", // Increased from 46px to fit larger logo
              minHeight: "52px",
              minWidth: "120px", // Add a minWidth for balance
            }}
          >
            <Box
              sx={{ height: 75, display: 'flex', alignItems: 'center' }}
              component="span"
            >
              <img src={PurrfectMatchLogo} alt="Purrfect Match Logo" style={{ height: 75, width: 'auto', display: 'block' }} />
            </Box>
          </Box>          {/* Center section - Navigation Links (desktop only) */}
          {!isMobile && (
            <NavLinksContainer $isScrolled={scrollTrigger}>
              <List
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  p: 0,
                }}
              >
                {midLinks.map(({ title, path }) => (
                  <ListItem disablePadding key={path}>
                    <ListItemButton onClick={() => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }); }} sx={{ borderRadius: 20, px: 2, py: 1 }}>
                      {title.charAt(0).toUpperCase() + title.slice(1)}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </NavLinksContainer>
          )}          {/* Right section - User Actions */}
          <UserActionsContainer $isScrolled={scrollTrigger}>
            {/* Theme Toggle - now first in right section */}
            <StyledIconButton
              aria-label="toggle dark mode"
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                transition: "transform 0.5s ease",
              }}
            >
              <AnimatedShibaThemeToggle isDarkMode={darkMode} onClick={() => dispatch(toggleDarkMode())} />
            </StyledIconButton>            {/* Notifications Dropdown */}
            {user && <NotificationDropdown iconSize="small" />}

            {/* User Menu or Auth Buttons (desktop only) */}
            {!isMobile && user ? (
              <UserMenu user={user} />
            ) : (
              !isMobile && (
                <Box sx={{ display: "flex" }}>
                  <AuthButton
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </AuthButton>
                  <AuthButton
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </AuthButton>
                </Box>
              )
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <StyledIconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ ml: 0.5 }}
              >
                <Menu />
              </StyledIconButton>
            )}
          </UserActionsContainer>
        </Toolbar>
        {isLoading && <MuiLottieLoader />}
      </StyledAppBar>      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            width: "280px",
            background: theme.palette.mode === "dark" 
              ? "linear-gradient(to bottom, #1F2937, #111827)" 
              : "linear-gradient(to bottom, #FFFFFF, #F9FAFB)",
            boxShadow: theme.palette.mode === "dark"
              ? "-4px 0 24px rgba(0, 0, 0, 0.3)"
              : "-4px 0 24px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
