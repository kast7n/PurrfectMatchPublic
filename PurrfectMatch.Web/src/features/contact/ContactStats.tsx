import { Box, Typography, alpha, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { Pets, Favorite, Support, Group } from '@mui/icons-material';

// Styled components
const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: theme.spacing(3),
  padding: theme.spacing(2, 0),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(2),
  },
}));

const StatCard = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: 20,
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha('#1F2937', 0.8)} 0%, ${alpha('#111827', 0.6)} 100%)`
    : `linear-gradient(135deg, ${alpha('#FFFFFF', 0.9)} 0%, ${alpha('#F9FAFB', 0.7)} 100%)`,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`
      : `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const StatIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
    : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: '1.8rem',
    color: theme.palette.primary.main,
  },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
    : `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  marginBottom: theme.spacing(1),
}));

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
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

export default function ContactStats() {  const stats = [
    {
      icon: <Pets />,
      number: '500+',
      label: 'Partner Shelters',
      description: 'Rescue organizations nationwide',
    },
    {
      icon: <Favorite />,
      number: '10,000+',
      label: 'Successful Matches',
      description: 'Pets connected with families',
    },
    {
      icon: <Support />,
      number: '< 2hrs',
      label: 'Response Time',
      description: 'Quick answers to your questions',
    },
    {
      icon: <Group />,
      number: '50,000+',
      label: 'Active Users',
      description: 'Growing community of pet lovers',
    },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 600,
          mb: 4,
          color: 'text.primary',
        }}
      >
        Why Choose PurrfectMatch Support?
      </Typography>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <StatsContainer>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              variants={cardVariants}
              whileHover="hover"
            >
              <StatIcon>
                {stat.icon}
              </StatIcon>
              
              <StatNumber variant="h3">
                {stat.number}
              </StatNumber>
              
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                {stat.label}
              </Typography>
              
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.4,
                }}
              >
                {stat.description}
              </Typography>
            </StatCard>
          ))}
        </StatsContainer>
      </motion.div>
    </Box>
  );
}
