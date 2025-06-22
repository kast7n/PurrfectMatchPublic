import { Box, Typography, Button } from '@mui/material';

export default function TipsConsultationBox() {
  return (
    <Box 
      sx={{ 
        mt: 6,
        p: 3,
        borderRadius: 3,
        backgroundColor: 'rgba(129, 199, 132, 0.1)',
        border: '1px dashed rgba(129, 199, 132, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}
    >
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: 500,
          textAlign: { xs: 'center', sm: 'left' } 
        }}
      >
        Need personalized adoption advice? Our pet counselors are here to help!
      </Typography>
      <Button 
        variant="contained" 
        color="secondary"
        sx={{ 
          borderRadius: 20, 
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}
        href="/adoption-counseling"
      >
        Get Free Consultation
      </Button>
    </Box>
  );
}
