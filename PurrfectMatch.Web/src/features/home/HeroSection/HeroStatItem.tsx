// HeroStatItem component for each stat box
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { StatBox, StatIcon, statItemVariants } from './heroSectionStyles';

export default function HeroStatItem({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <Box
      component={motion.div}
      variants={statItemVariants}
      sx={{ flex: '1 1 0', minWidth: 0, mb: 0 }}
    >
      <StatBox>
        <StatIcon>{icon}</StatIcon>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            color: theme.palette.primary.main,
          }}
        >
          {number}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            fontWeight: 500,
            color: isDarkMode ? 'rgba(255,255,255,0.8)' : theme.palette.text.secondary,
          }}
        >
          {label}
        </Typography>
      </StatBox>
    </Box>
  );
}
