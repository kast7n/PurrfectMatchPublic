import { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { getStripe } from '../../lib/stripe';

export default function StripeDebugComponent() {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [envKey, setEnvKey] = useState<string>('');

  useEffect(() => {
    const checkStripe = async () => {
      try {
        // Check environment variable
        const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        setEnvKey(key || 'NOT SET');
        
        // Try to load Stripe
        const stripe = await getStripe();
        if (stripe) {
          setStripeLoaded(true);
          console.log('Stripe loaded successfully:', stripe);
        } else {
          setStripeError('Stripe failed to load');
        }
      } catch (error) {
        setStripeError(error instanceof Error ? error.message : 'Unknown error');
        console.error('Stripe loading error:', error);
      }
    };

    checkStripe();
  }, []);

  return (
    <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Stripe Configuration Debug
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Environment Key:</strong> {envKey ? envKey.substring(0, 20) + '...' : 'NOT SET'}
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Stripe Status:</strong> {stripeLoaded ? '✅ Loaded' : '❌ Not Loaded'}
      </Typography>
      
      {stripeError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {stripeError}
        </Alert>
      )}
      
      <Button 
        variant="contained" 
        onClick={() => window.location.reload()}
        sx={{ mt: 2 }}
      >
        Reload Page
      </Button>
    </Box>
  );
}
