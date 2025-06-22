import { Box, Typography } from '@mui/material';
import HowItWorksStepList from './HowItWorksStepList';
import HowItWorksQuote from './HowItWorksQuote';
import HowItWorksCTA from './HowItWorksCTA';
import { SectionTitle } from './howItWorksStyles';

const HowItWorksSection = () => {
  return (
    <Box>
      <SectionTitle variant="h2">How Adoption Works</SectionTitle>
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 5, fontWeight: 400, textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
        Ready to change a life? Our simple, loving process makes it easy to find your new best friend. Every adoption saves a life and brings joy to your home. Here’s how you can make a difference:
      </Typography>
      <HowItWorksStepList />
      <HowItWorksQuote />
      <HowItWorksCTA />
    </Box>
  );
};

export default HowItWorksSection;
