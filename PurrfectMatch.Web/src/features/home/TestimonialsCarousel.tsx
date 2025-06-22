import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  styled, 
  useTheme,
  IconButton,
  Rating
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PetsIcon from '@mui/icons-material/Pets';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components for the testimonials section
const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(4),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main,
  },
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5, 4),
  borderRadius: 24,  background: theme.palette.mode === 'dark'
    ? 'rgba(17, 24, 39, 0.85)'
    : 'rgba(255, 255, 255, 0.85)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.35)'
    : '0 8px 32px rgba(255, 107, 107, 0.12)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'visible',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  '&::before': {
    display: 'none',
  },
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: 20,
  fontSize: 60,
  color: theme.palette.mode === 'dark'
    ? theme.palette.grey[800]
    : theme.palette.grey[200],
  transform: 'rotate(180deg)',
}));

const TestimonialAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  border: `4px solid ${theme.palette.primary.light}`,
  margin: '0 auto',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 12px rgba(0, 0, 0, 0.25)'
    : '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

const TestimonialContent = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  lineHeight: 1.8,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  position: 'relative',
  zIndex: 1,
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 12px rgba(0, 0, 0, 0.25)'
    : '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const cardVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Emma Thompson',
    avatar: '/images/Testimonials/testimonial-emma.webp',
    petAvatar: '/images/Testimonials/happy-golden-retriever.webp',
    petName: 'Buddy',
    rating: 5,
    date: 'March 2, 2025',
    content: "Adopting Buddy through PurrfectMatch was the best decision we've ever made. The process was so smooth, and they really cared about finding the right home for each pet. Buddy has brought so much joy to our family, and we couldn't imagine life without him now!",
    petType: 'Dog',
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    avatar: '/images/Testimonials/testimonial-michael.webp',
    petAvatar: '/images/Testimonials/Whiskers.webp',
    petName: 'Whiskers',
    rating: 5,
    date: 'January 15, 2025',
    content: "I was nervous about adopting a cat with special needs, but PurrfectMatch supported me every step of the way. Whiskers has completely transformed from a shy kitty to the most affectionate companion. The post-adoption support from this platform is outstanding!",
    petType: 'Cat',
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    avatar: '/images/Testimonials/testimonial-sarah.webp',
    petAvatar: '/images/Testimonials/happy-beagle.webp',
    petName: 'Bella',
    rating: 5,
    date: 'April 18, 2025',
    content: "After losing our senior dog, we weren't sure if we could open our hearts to another pet. But when we saw Bella's profile on PurrfectMatch, something just clicked. The detailed pet profiles helped us find exactly what we were looking for, and now Bella is the heart of our home.",
    petType: 'Dog',
  },
];

export default function TestimonialsCarousel() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const goToNext = () => {
    setCurrentIndex(prev => [
      prev[0] === testimonials.length - 1 ? 0 : prev[0] + 1,
      1
    ]);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => [
      prev[0] === 0 ? testimonials.length - 1 : prev[0] - 1,
      -1
    ]);
  };

  // Auto-rotate testimonials unless paused
  useEffect(() => {
    if (!paused) {
      const interval = setInterval(goToNext, 8000);
      return () => clearInterval(interval);
    }
  }, [paused]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <SectionTitle variant="h4" as="h2">
          Adoption Stories
        </SectionTitle>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <NavButton onClick={goToPrev} size="medium">
            <NavigateBeforeIcon />
          </NavButton>
          <NavButton onClick={goToNext} size="medium">
            <NavigateNextIcon />
          </NavButton>
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          position: 'relative',
          minHeight: { xs: 340, sm: 400 }, // Ensure min height for mobile
          overflow: 'hidden',
          borderRadius: { xs: 1, sm: 3 }, // Less rounded corners
          p: { xs: 0.5, sm: 2 },
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '12px',
              minHeight: '100%',
            }}
          >
            <TestimonialCard sx={{
              width: '100%',
              maxWidth: { xs: '98vw', sm: 680 },
              margin: '0 auto',
              boxSizing: 'border-box',
              minHeight: { xs: 280, sm: 340, md: 400 }, // Ensure card is visible on mobile
              background: theme.palette.mode === 'dark'
                ? 'rgba(38, 38, 38, 0.85)'
                : 'rgba(255, 255, 255, 0.85)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.35)'
                : '0 8px 32px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: { xs: 1, sm: 3 }, // Less rounded corners
              p: { xs: 1.5, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              overflow: 'hidden', // Prevent text overflow
              wordBreak: 'break-word', // Break long words
            }}>
              <QuoteIcon sx={{ fontSize: { xs: 36, sm: 60 }, top: { xs: 8, sm: 20 }, right: { xs: 8, sm: 20 } }} />
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                mb: { xs: 2, sm: 3 },
                position: 'relative',
                zIndex: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                textAlign: { xs: 'center', sm: 'left' },
              }}>
                <TestimonialAvatar src={currentTestimonial.avatar} alt={currentTestimonial.name} sx={{ width: { xs: 56, sm: 80 }, height: { xs: 56, sm: 80 } }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {currentTestimonial.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    Adopted {currentTestimonial.petName} • {currentTestimonial.date}
                  </Typography>
                  <Rating 
                    value={currentTestimonial.rating} 
                    readOnly 
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
              <TestimonialContent variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, mb: { xs: 2, sm: 3 }, maxWidth: '100%', overflowWrap: 'break-word' }}>
                "{currentTestimonial.content}"
              </TestimonialContent>
              <Box sx={{ 
                mt: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 3 },
                p: { xs: 1, sm: 2.5 },
                backgroundColor: isDarkMode 
                  ? 'rgba(80,48,80,0.25)'
                  : 'rgba(250,240,245,0.5)',
                borderRadius: 3, 
                position: 'relative',
                zIndex: 1,
                minHeight: { xs: 60, sm: 90 },
                flexDirection: { xs: 'column', sm: 'row' },
                textAlign: { xs: 'center', sm: 'left' },
              }}>
                <Avatar 
                  src={currentTestimonial.petAvatar} 
                  alt={currentTestimonial.petName}
                  sx={{ 
                    width: { xs: 44, sm: 64 }, 
                    height: { xs: 44, sm: 64 },
                    border: isDarkMode 
                      ? '2px solid rgba(255,255,255,0.1)'
                      : '2px solid white',
                    boxShadow: isDarkMode 
                      ? '0 2px 6px rgba(0,0,0,0.18)'
                      : '0 2px 6px rgba(0,0,0,0.08)'
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', fontSize: { xs: '1rem', sm: '1.1rem' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    {currentTestimonial.petName} 
                    <PetsIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {currentTestimonial.petType} • Found forever home
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <Typography variant="caption" sx={{ 
                      bgcolor: isDarkMode ? 'success.dark' : 'success.light', 
                      color: isDarkMode ? '#fff' : 'success.contrastText',
                      px: 1, 
                      py: 0.2, 
                      borderRadius: 1,
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.85rem' }
                    }}>
                      Happy Tale
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </TestimonialCard>
          </motion.div>
        </AnimatePresence>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="outlined" 
          color="primary"
          href="/adoption-stories"
          sx={{ 
            borderRadius: 20, 
            px: 3,
            py: 1,
            fontWeight: 600
          }}
        >
          Read More Adoption Stories
        </Button>
      </Box>
    </Box>
  );
}