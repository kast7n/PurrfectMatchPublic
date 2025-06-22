import { Box, Typography, alpha, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { ContactMail, Support, Favorite, Pets } from '@mui/icons-material';

// Styled components following the established patterns
const HeroContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6, 0),
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8, 0),
  },
}));

const HeroIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  '& svg': {
    fontSize: '3rem',
    color: theme.palette.primary.main,
    [theme.breakpoints.up('md')]: {
      fontSize: '4rem',
    },
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
    : `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

const FloatingIcon = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  color: alpha(theme.palette.primary.main, 0.1),
  pointerEvents: 'none',
  zIndex: 0,
}));

// Animation variants
const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const floatingIconVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function ContactHero() {
  return (
    <HeroContainer>
      {/* Floating Background Icons */}
      <FloatingIcon
        variants={floatingIconVariants}
        animate="animate"
        style={{
          top: '20%',
          left: '10%',
        }}
      >
        <Pets sx={{ fontSize: '2rem' }} />
      </FloatingIcon>
        <FloatingIcon
        variants={floatingIconVariants}
        animate="animate"
        style={{
          top: '60%',
          right: '15%',
          animationDelay: '1s',
        }}
      >
        <Favorite sx={{ fontSize: '1.5rem' }} />
      </FloatingIcon>

      <FloatingIcon
        variants={floatingIconVariants}
        animate="animate"
        style={{
          bottom: '25%',
          left: '8%',
          animationDelay: '2s',
        }}
      >
        <Pets sx={{ fontSize: '1.8rem' }} />
      </FloatingIcon>

      <FloatingIcon
        variants={floatingIconVariants}
        animate="animate"
        style={{
          bottom: '15%',
          right: '25%',
          animationDelay: '0.5s',
        }}
      >
        <Favorite sx={{ fontSize: '1.3rem' }} />
      </FloatingIcon>

      <FloatingIcon
        variants={floatingIconVariants}
        animate="animate"
        style={{
          bottom: '35%',
          left: '75%',
          animationDelay: '2.5s',
        }}
      >
        <ContactMail sx={{ fontSize: '1.6rem' }} />
      </FloatingIcon>

      <FloatingIcon
        variants={floatingIconVariants}
        animate="animate"
        style={{
          bottom: '10%',
          left: '30%',
          animationDelay: '1.8s',
        }}
      >
        <Support sx={{ fontSize: '1.4rem' }} />
      </FloatingIcon>

      {/* Main Hero Content */}
      <motion.div variants={iconVariants}>
        <HeroIconContainer>
          <ContactMail />
          <Support />
        </HeroIconContainer>
      </motion.div>

      <motion.div variants={iconVariants}>
        <GradientText variant="h2">
          Get in Touch
        </GradientText>
      </motion.div>

      <motion.div variants={iconVariants}>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            fontWeight: 400,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          We're here to help you find your perfect furry companion
        </Typography>
      </motion.div>

      <motion.div variants={iconVariants}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: 500,
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: 1.7,
          }}
        >
          Have questions about adoption, need support, or want to share your PurrfectMatch story? 
          We'd love to hear from you!
        </Typography>
      </motion.div>
    </HeroContainer>
  );
}
