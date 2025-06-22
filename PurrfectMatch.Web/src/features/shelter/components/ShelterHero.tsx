import React from 'react';
import {
  Box,
  Typography,
  Button,
  styled,
  alpha,
  useTheme,
  Chip,
} from '@mui/material';
import {
  LocationOn,
  Language,
  Favorite,
  Star,
  Pets,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Shelter } from '../../../app/models/shelter';

interface ShelterHeroProps {
  shelter: Shelter;
}

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: 24,
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #1F2937 100%)`
    : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, #FFF 100%)`,
  padding: theme.spacing(6, 4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.palette.mode === 'dark'
    ? '0 20px 60px rgba(0,0,0,0.4)'
    : '0 20px 60px rgba(0,0,0,0.12)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
    animation: 'float 6s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 3),
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
}));

const ShelterIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1976d2, #1565c0)'
    : 'linear-gradient(135deg, #ffffff, #f5f5f5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 12px 40px rgba(0,0,0,0.4)'
    : '0 12px 40px rgba(0,0,0,0.15)',
  border: `4px solid ${theme.palette.background.paper}`,
  marginBottom: theme.spacing(3),
  fontSize: '2.5rem',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2',
  animation: 'pulse 2s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1.5, 4),
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(1),
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px rgba(25, 118, 210, 0.4)'
      : '0 8px 25px rgba(25, 118, 210, 0.3)',
  },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  },
}));

const ShelterHero: React.FC<ShelterHeroProps> = ({ shelter }) => {
  const theme = useTheme();

  const handleWebsiteClick = () => {
    if (shelter.website) {
      window.open(shelter.website, '_blank');
    }
  };

  const handleDonateClick = () => {
    if (shelter.donationUrl) {
      window.open(shelter.donationUrl, '_blank');
    }
  };

  const formatAddress = () => {
    if (!shelter.address) return null;
    const parts = [];
    if (shelter.address.city) parts.push(shelter.address.city);
    if (shelter.address.state) parts.push(shelter.address.state);
    return parts.join(', ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <HeroContainer>
        <HeroContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
            <ShelterIcon>
              🏠
            </ShelterIcon>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {shelter.name}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
                {formatAddress() && (
                  <InfoChip
                    icon={<LocationOn />}
                    label={formatAddress()}
                    size="medium"
                  />
                )}
                <InfoChip
                  icon={<Pets />}
                  label="Animal Shelter"
                  size="medium"
                />
                <InfoChip
                  icon={<Star />}
                  label="Verified"
                  size="medium"
                />
              </Box>

              {shelter.description && (
                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    opacity: 0.9,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mb: 4,
                  }}
                >
                  {shelter.description}
                </Typography>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {shelter.website && (
                  <ActionButton
                    variant="contained"
                    startIcon={<Language />}
                    onClick={handleWebsiteClick}
                    color="primary"
                  >
                    Visit Website
                  </ActionButton>
                )}
                {shelter.donationUrl && (
                  <ActionButton
                    variant="contained"
                    startIcon={<Favorite />}
                    onClick={handleDonateClick}
                    color="secondary"
                  >
                    Donate Now
                  </ActionButton>
                )}
              </Box>
            </Box>
          </Box>
        </HeroContent>
      </HeroContainer>
    </motion.div>
  );
};

export default ShelterHero;
