import { Box, Typography } from '@mui/material';

export default function FooterMessage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" color="primary">
        Thank you for choosing PurrfectMatch! 🐾
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Happy adopting!
      </Typography>
    </Box>
  );
}
