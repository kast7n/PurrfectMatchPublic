import { Box, Typography, alpha, styled, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import {
  LocationOn,
  Phone,
  Email,
  Schedule,
  Emergency,
  Support,
  Info,
} from '@mui/icons-material';

// Styled components
const InfoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha('#1F2937', 0.95)} 0%, ${alpha('#111827', 0.90)} 100%)`
    : `linear-gradient(135deg, ${alpha('#FFFFFF', 0.95)} 0%, ${alpha('#F9FAFB', 0.90)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    : '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 107, 107, 0.1)',
  height: 'fit-content',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
}));

const InfoItem = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha('#374151', 0.3)
      : alpha('#F3F4F6', 0.5),
    transform: 'translateX(4px)',
  },
}));

const InfoIconContainer = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
    : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& svg': {
    fontSize: '1.5rem',
    color: theme.palette.primary.main,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
    : `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
}));

const QuickTipsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#374151', 0.3)
    : alpha('#F3F4F6', 0.8),
  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
}));

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ContactInfo() {  const contactInfo = [
    {
      icon: <LocationOn />,
      title: 'Our Platform',
      content: 'Connecting You with 500+ Partner Shelters',
      subtext: 'Find shelters and rescue organizations nationwide',
    },
    {
      icon: <Phone />,
      title: 'Call Us',
      content: '+1 (555) PETS-123',
      subtext: 'Monday - Friday, 8 AM - 8 PM PST',
    },
    {
      icon: <Email />,
      title: 'Email Support',
      content: 'hello@purrfectmatch.com',
      subtext: 'We respond within 2 hours',
    },
    {
      icon: <Schedule />,
      title: 'Support Hours',
      content: 'Monday - Sunday, 7 AM - 10 PM PST',
      subtext: 'Live chat and phone support available',
    },
    {
      icon: <Emergency />,
      title: 'Shelter Partnership',
      content: 'Join Our Network',
      subtext: 'Register your shelter or rescue organization',
    },
  ];
  const quickTips = [
    { label: 'Find Shelters', color: 'primary' as const },
    { label: 'Adoption Process', color: 'secondary' as const },
    { label: 'Shelter Registration', color: 'success' as const },
    { label: 'Platform Support', color: 'info' as const },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <InfoContainer>
        <motion.div variants={itemVariants}>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Support sx={{ color: 'primary.main', fontSize: '1.8rem' }} />
            <SectionTitle variant="h4">
              Contact Information
            </SectionTitle>
          </Box>
        </motion.div>

        {contactInfo.map((info, index) => (
          <InfoItem key={index} variants={itemVariants}>
            <InfoIconContainer>
              {info.icon}
            </InfoIconContainer>
            <Box flex={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0.5,
                }}
              >
                {info.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                {info.content}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.9rem' }}
              >
                {info.subtext}
              </Typography>
            </Box>
          </InfoItem>
        ))}

        <motion.div variants={itemVariants}>
          <QuickTipsContainer>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Info sx={{ color: 'info.main', fontSize: '1.2rem' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Quick Help Topics
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Common questions we can help you with:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {quickTips.map((tip, index) => (
                <Chip
                  key={index}
                  label={tip.label}
                  color={tip.color}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: (theme) =>
                        alpha(theme.palette[tip.color].main, 0.1),
                    },
                  }}
                />
              ))}
            </Box>
          </QuickTipsContainer>
        </motion.div>
      </InfoContainer>
    </motion.div>
  );
}
