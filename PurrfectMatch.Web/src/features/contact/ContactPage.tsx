
import { Box, Container, styled } from '@mui/material';
import { motion } from 'framer-motion';
import ContactHero from './ContactHero.tsx';
import ContactForm from './ContactForm.tsx';
import ContactInfo from './ContactInfo.tsx';
import ContactStats from './ContactStats.tsx';

// Styled components following the app's design patterns
const ContactContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(6),
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'radial-gradient(ellipse at center, rgba(31, 41, 55, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)'
    : 'radial-gradient(ellipse at center, rgba(249, 250, 251, 0.98) 0%, rgba(243, 244, 246, 0.95) 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ContactPage() {
  return (
    <ContentWrapper>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ContactContainer maxWidth="lg">
          {/* Hero Section */}
          <motion.div variants={sectionVariants}>
            <SectionContainer>
              <ContactHero />
            </SectionContainer>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={sectionVariants}>
            <SectionContainer>
              <ContactStats />
            </SectionContainer>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div variants={sectionVariants}>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
              gap={4}
              alignItems="start"
            >
              {/* Contact Information */}
              <ContactInfo />
              
              {/* Contact Form */}
              <ContactForm />
            </Box>
          </motion.div>
        </ContactContainer>
      </motion.div>
    </ContentWrapper>
  );
}
