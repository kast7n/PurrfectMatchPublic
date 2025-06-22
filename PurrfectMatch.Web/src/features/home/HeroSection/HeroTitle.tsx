// HeroTitle component for title and subtitle
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { HighlightText, textVariants } from './heroSectionStyles';
import { motion } from 'framer-motion';

export default function HeroTitle() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <motion.div initial="hidden" animate="visible" variants={textVariants}>
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontWeight: 800,
          mb: 2,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.8rem' },
          textShadow: isDarkMode
            ? '2px 2px 8px rgba(0,0,0,0.4)'
            : '2px 2px 4px rgba(0,0,0,0.15)',
          color: isDarkMode ? 'white' : theme.palette.text.primary,
        }}
      >
        Find Your <HighlightText>Purrfect</HighlightText> Match
      </Typography>
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          maxWidth: { xs: '100%', sm: '600px' },
          fontWeight: 400,
          textShadow: isDarkMode
            ? '1px 1px 4px rgba(0,0,0,0.3)'
            : '1px 1px 2px rgba(0,0,0,0.1)',
          color: isDarkMode ? 'white' : theme.palette.text.primary,
          lineHeight: 1.5,
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
        }}
      >
        Discover loving pets looking for their forever homes. With just a few clicks, your perfect companion is waiting.
      </Typography>
    </motion.div>
  );
}
