import { Box, Typography } from '@mui/material';

const HowItWorksQuote = () => (
  <Box
    sx={{
      mt: 7,
      p: 4,
      borderRadius: 4,
      bgcolor: 'rgba(229, 115, 115, 0.10)',
      textAlign: 'center',
      boxShadow: '0 4px 24px rgba(229,115,115,0.08)',
      maxWidth: 700,
      mx: 'auto',
      position: 'relative',
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
      “Adopt, don’t shop!”
    </Typography>
    <Typography variant="body1" sx={{ fontStyle: 'italic', fontWeight: 500, color: 'text.secondary', mb: 2 }}>
      Adopting a pet is a life-changing act of kindness. You’re not just giving them a home—you’re gaining a loyal friend, endless cuddles, and unconditional love.
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
      <img src="/images/Testimonials/Whiskers.webp" alt="Whiskers the Cat" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '50%', border: '2px solid #e57373', background: '#fff' }} />
      <img src="/images/Testimonials/happy-golden-retriever.webp" alt="Happy Golden Retriever" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '50%', border: '2px solid #81c784', background: '#fff' }} />
      <img src="/images/Testimonials/happy-beagle.webp" alt="Happy Beagle" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '50%', border: '2px solid #64b5f6', background: '#fff' }} />
    </Box>
  </Box>
);

export default HowItWorksQuote;
