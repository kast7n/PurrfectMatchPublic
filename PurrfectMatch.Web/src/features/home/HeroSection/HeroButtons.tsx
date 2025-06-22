// HeroButtons component for action buttons
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { buttonVariants, PawPrintIcon } from './heroSectionStyles';

export default function HeroButtons() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={buttonVariants}
      style={{ display: 'flex', gap: 16, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 2 },
          width: '100%',
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: { xs: 'center', sm: 'flex-start' },
          mb: { xs: 2, sm: 0 },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="/pets"
          startIcon={<PawPrintIcon />}
          sx={{
            py: 1.5,
            px: 3,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 600,
            borderRadius: '12px',
            boxShadow: isDarkMode
              ? '0 8px 24px rgba(255, 107, 107, 0.3)'
              : '0 8px 24px rgba(255, 107, 107, 0.2)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: isDarkMode
                ? '0 12px 28px rgba(255, 107, 107, 0.4)'
                : '0 12px 28px rgba(255, 107, 107, 0.25)',
            },
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Browse Pets
        </Button>
        <Button
          variant="outlined"
          color={isDarkMode ? 'inherit' : 'primary'}
          size="large"
          href="/how-it-works"
          sx={{
            py: 1.5,
            px: 3,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 600,
            borderRadius: '12px',
            borderWidth: '2px',
            borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
            backgroundColor: isDarkMode
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255, 107, 107, 0.04)',
            '&:hover': {
              backgroundColor: isDarkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(255, 107, 107, 0.08)',
              borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
              borderWidth: '2px',
              transform: 'translateY(-3px)',
            },
            transition: 'transform 0.3s ease',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Learn More
        </Button>
      </Box>
    </motion.div>
  );
}
