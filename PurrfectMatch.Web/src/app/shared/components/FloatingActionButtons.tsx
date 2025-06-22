// FloatingActionButtons component (shared)
import { useState } from 'react';
import { 
  Box, 
  Fab, 
  Zoom, 
  Badge, 
  Tooltip, 
  styled,
  useScrollTrigger,
  Paper,
  Typography,
  IconButton,
  useTheme
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGetUserFavoritesQuery } from '../../../features/favorites/favoritesApi';
import { useUserInfoQuery } from '../../../features/account/accountApi';

const FloatingButtonsContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(2),
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 12px rgba(0,0,0,0.3)'
    : '0 4px 12px rgba(0,0,0,0.15)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 16px rgba(0,0,0,0.35)'
      : '0 6px 16px rgba(0,0,0,0.18)',
  },
  transition: 'all 0.3s ease',
}));

const ChatPopup = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  bottom: 80,
  right: 0,
  width: 300,
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.25)'
    : '0 8px 32px rgba(0,0,0,0.15)',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ChatContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  maxHeight: 300,
  overflowY: 'auto',
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.background.paper
    : '#ffffff',
}));

const popupVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 20,
    transition: { 
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function FloatingActionButtons() {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const { data: userInfo } = useUserInfoQuery();
  const { data: favorites } = useGetUserFavoritesQuery(userInfo?.id || '', {
    skip: !userInfo?.id
  });
  const favoritesCount = favorites?.length || 0;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <FloatingButtonsContainer>
      {/* Back to top button - only shows when scrolled down */}
      <Zoom in={trigger}>
        <StyledFab 
          size="medium" 
          color="default" 
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{ 
            backgroundColor: isDarkMode ? 'rgba(48, 48, 48, 0.9)' : 'white',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
            opacity: 0.9,
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(58, 58, 58, 0.95)' : 'white',
              opacity: 1,
            }
          }}
        >
          <ArrowUpwardIcon />
        </StyledFab>
      </Zoom>
        {/* Favorites button */}
      <Tooltip title="View your favorites" placement="left">
        <StyledFab 
          size="medium" 
          color="primary" 
          aria-label="favorites"
          onClick={() => navigate('/favorites')}
          sx={{ 
            backgroundColor: isDarkMode ? '#f48fb1' : '#f8bbd0',
            color: isDarkMode ? '#c2185b' : '#c2185b',
            '&:hover': {
              backgroundColor: isDarkMode ? '#f06292' : '#f48fb1',
            }
          }}
        >
          <Badge 
            badgeContent={favoritesCount} 
            color="error"
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: isDarkMode ? '#f50057' : '#ff4081',
                color: 'white',
                fontWeight: 'bold',
              }
            }}
          >
            <FavoriteIcon />
          </Badge>
        </StyledFab>
      </Tooltip>
      
      {/* Chat/help button */}
      <Box sx={{ position: 'relative' }}>
        <Tooltip title="Chat with us" placement="left">
          <StyledFab 
            size="medium" 
            color="secondary" 
            aria-label="chat"
            onClick={() => setShowChat(!showChat)}
            sx={{
              backgroundColor: isDarkMode ? '#66bb6a' : '#81c784',
              '&:hover': {
                backgroundColor: isDarkMode ? '#4caf50' : '#66bb6a',
              }
            }}
          >
            <ChatIcon />
          </StyledFab>
        </Tooltip>

        <AnimatePresence>
          {showChat && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={popupVariants}
              style={{ position: 'absolute', bottom: 0, right: 0 }}
            >
              <ChatPopup>
                <ChatHeader>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Pet Adoption Support
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setShowChat(false)}
                    sx={{ color: 'white' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </ChatHeader>
                <ChatContent>
                  <Typography variant="body2" sx={{ 
                    mb: 2,
                    color: isDarkMode ? 'text.primary' : 'inherit'
                  }}>
                    Hello! 👋 Have questions about pet adoption?
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    mb: 2,
                    color: isDarkMode ? 'text.primary' : 'inherit'
                  }}>
                    Our team is here to help you find your perfect companion.
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ 
                    color: isDarkMode ? 'text.primary' : 'inherit'
                  }}>
                    How can we assist you today?
                  </Typography>
                </ChatContent>
              </ChatPopup>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </FloatingButtonsContainer>
  );
}
