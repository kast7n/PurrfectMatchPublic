import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button, Box, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Home, Pets } from '@mui/icons-material';

export default function NotFound() {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 4
    }}>
      <Box 
        sx={{
          textAlign: 'center',
          width: '100%',
        }}
      >
        {/* Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box sx={{ 
            maxWidth: 400, 
            mx: 'auto', 
            mb: 3,
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DotLottieReact
              src="/Lottie/404.lottie"
              loop
              autoplay
              style={{ 
                width: '100%', 
                height: '100%',
                maxWidth: '400px',
                maxHeight: '300px'
              }}
            />
          </Box>
        </motion.div>

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Pawsome! You found our secret cat hideout! 🐾
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.palette.text.secondary,
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Oops! It looks like this page has wandered off like a curious kitty. 
            <br />
            Don't worry - let's get you back to finding your purrfect match! 🐱
          </Typography>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexWrap: 'wrap',
            mt: 4
          }}>
            <Button 
              variant="contained" 
              component={Link} 
              to='/'
              startIcon={<Home />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                }
              }}
            >
              Take Me Home
            </Button>
            
            <Button 
              variant="outlined" 
              component={Link} 
              to='/pets'
              startIcon={<Pets />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderWidth: 2,
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                }
              }}
            >
              Find Pets
            </Button>
          </Box>
        </motion.div>

        {/* Fun Pet Facts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{ 
            mt: 6, 
            p: 3, 
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(255, 107, 107, 0.05)' 
              : 'rgba(255, 107, 107, 0.1)',
            borderRadius: 3,
            border: `1px solid ${theme.palette.mode === 'light' 
              ? 'rgba(255, 107, 107, 0.2)' 
              : 'rgba(255, 107, 107, 0.3)'}`,
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
                fontSize: '0.95rem'
              }}
            >
              💡 <strong>Did you know?</strong> Cats spend 70% of their lives sleeping - that's 13-16 hours a day! 
              Maybe this page is just taking a cat nap? 😴
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Container>
  )
}