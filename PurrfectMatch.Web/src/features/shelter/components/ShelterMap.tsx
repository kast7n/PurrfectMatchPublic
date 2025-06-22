import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  styled,
  alpha,
} from '@mui/material';
import {
  Map,
  Directions,
  LocationOn,
  OpenInNew,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Shelter } from '../../../app/models/shelter';

interface ShelterMapProps {
  shelter: Shelter;
}

const MapContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 12px 40px rgba(0,0,0,0.3)'
    : '0 12px 40px rgba(0,0,0,0.08)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
  '& .MuiSvgIcon-root': {
    color: theme.palette.warning.main,
    fontSize: '1.5rem',
  },
}));

const MapPlaceholder = styled(Box)(({ theme }) => ({
  height: 200,
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.3)
    : alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 20%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
}));

const MapIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.main, 0.2)
    : alpha(theme.palette.primary.main, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    fontSize: '2rem',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  marginBottom: theme.spacing(1),
  fontWeight: 600,
  textTransform: 'none',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const AddressInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.3)
    : alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
}));

const ShelterMap: React.FC<ShelterMapProps> = ({ shelter }) => {
  const formatAddress = () => {
    if (!shelter.address) return null;
    const parts = [];
    if (shelter.address.street) parts.push(shelter.address.street);
    if (shelter.address.city) parts.push(shelter.address.city);
    if (shelter.address.state) parts.push(shelter.address.state);
    if (shelter.address.postalCode) parts.push(shelter.address.postalCode);
    return parts.join(', ');
  };

  const handleGetDirections = () => {
    if (!shelter.address) return;
    
    const address = formatAddress();
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }
  };

  const handleViewOnMap = () => {
    if (!shelter.address) return;
    
    const address = formatAddress();
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }  };

  if (!shelter.address || !formatAddress()) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <MapContainer elevation={0}>
          <SectionTitle variant="h6">
            <Map />
            Location
          </SectionTitle>
          
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Location information not available
            </Typography>
          </Box>
        </MapContainer>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <MapContainer elevation={0}>
        <SectionTitle variant="h6">
          <Map />
          Location & Directions
        </SectionTitle>

        <AddressInfo>
          <LocationOn sx={{ color: 'primary.main', mt: 0.5 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {shelter.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatAddress()}
            </Typography>
          </Box>
        </AddressInfo>

        <MapPlaceholder onClick={handleViewOnMap}>
          <MapIcon>
            <Map />
          </MapIcon>
          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
            View on Map
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Click to open in Google Maps
          </Typography>
        </MapPlaceholder>

        <ActionButton
          variant="contained"
          color="primary"
          onClick={handleGetDirections}
          startIcon={<Directions />}
        >
          Get Directions
        </ActionButton>

        <ActionButton
          variant="outlined"
          color="primary"
          onClick={handleViewOnMap}
          startIcon={<OpenInNew />}
        >
          View on Google Maps
        </ActionButton>

        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 2,
            fontStyle: 'italic',
          }}
        >
          Tap to open your device's map application
        </Typography>
      </MapContainer>
    </motion.div>
  );
};

export default ShelterMap;
