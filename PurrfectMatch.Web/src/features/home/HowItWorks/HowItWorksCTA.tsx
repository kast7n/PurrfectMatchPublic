import { Box, Typography } from '@mui/material';

const HowItWorksCTA = () => (
  <Box sx={{ mt: 5, textAlign: 'center' }}>
    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}>
      Ready to meet your new best friend?
    </Typography>
    <a href="/adopt" style={{ textDecoration: 'none' }}>
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          bgcolor: 'primary.main',
          color: '#fff',
          px: 5,
          py: 1.5,
          borderRadius: 99,
          fontWeight: 700,
          fontSize: 20,
          boxShadow: '0 2px 8px rgba(229,115,115,0.15)',
          transition: 'background 0.2s',
          '&:hover': {
            bgcolor: 'primary.dark',
            boxShadow: '0 4px 16px rgba(229,115,115,0.20)',
          },
          cursor: 'pointer',
        }}
      >
        Start Your Journey
      </Box>
    </a>
  </Box>
);

export default HowItWorksCTA;
