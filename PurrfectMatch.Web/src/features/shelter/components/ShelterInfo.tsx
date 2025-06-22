import React from 'react';
import {
  Box,
  Typography,
  Paper,
  styled,
  alpha,
  useTheme,
  Grid,
  Divider,
} from '@mui/material';
import {
  Info,
  Business,
  Schedule,
  Policy,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Shelter } from '../../../app/models/shelter';

interface ShelterInfoProps {
  shelter: Shelter;
}

const InfoContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
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
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
  },
}));

const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.main, 0.05)
    : alpha(theme.palette.primary.main, 0.03),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
    transform: 'translateY(-2px)',
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    marginTop: 2,
  },
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  lineHeight: 1.8,
  color: theme.palette.text.secondary,
  fontSize: '1.1rem',
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.3)
    : alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const ShelterInfo: React.FC<ShelterInfoProps> = ({ shelter }) => {  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <InfoContainer elevation={0}>
        <SectionTitle variant="h4">
          <Info />
          About {shelter.name}
        </SectionTitle>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {shelter.description && (
              <InfoSection>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
                >
                  Our Mission
                </Typography>
                <DescriptionText variant="body1">
                  {shelter.description}
                </DescriptionText>
              </InfoSection>
            )}

            <InfoSection>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
              >
                Facility Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoItem>
                    <Business />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Organization Type
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Animal Shelter & Rescue
                      </Typography>
                    </Box>
                  </InfoItem>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InfoItem>
                    <Schedule />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Operating Hours
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mon-Fri: 9AM-6PM<br />
                        Sat-Sun: 10AM-4PM
                      </Typography>
                    </Box>
                  </InfoItem>
                </Grid>

                <Grid item xs={12}>
                  <InfoItem>
                    <Policy />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Adoption Policy
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        We conduct thorough screening processes to ensure our pets find loving, 
                        permanent homes. All adoptions include spay/neuter, vaccinations, and microchipping.
                      </Typography>
                    </Box>
                  </InfoItem>
                </Grid>
              </Grid>
            </InfoSection>
          </Grid>

          <Grid item xs={12} md={4}>
            <InfoSection>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
              >
                Services Offered
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  'Pet Adoption',
                  'Spay & Neuter Services',
                  'Vaccination Programs',
                  'Microchipping',
                  'Pet Training Classes',
                  'Foster Care Program',
                  'Emergency Pet Care',
                  'Lost Pet Recovery',
                ].map((service, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: 1.5,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.success.main, 0.15),
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.success.main,
                      }}
                    >
                      ✓ {service}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </InfoSection>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body1"
            sx={{
              fontStyle: 'italic',
              color: 'text.secondary',
              fontSize: '1.1rem',
            }}
          >
            "Every pet deserves a loving home, and every family deserves the joy of a furry companion."
          </Typography>
        </Box>
      </InfoContainer>
    </motion.div>
  );
};

export default ShelterInfo;
