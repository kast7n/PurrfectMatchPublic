import { Box, Container, styled } from '@mui/material';
import DonationHero from './DonationHero.tsx';
import ImpactSection from './ImpactSection.tsx';
import DonationForm from './DonationForm.tsx';
import CallToSupport from './CallToSupport.tsx';

// Styled container with gradient background similar to HomePage
const DonationPageContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(to bottom, #111827, #0d1424)`
    : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
  backgroundImage: theme.palette.mode === 'dark'
    ? 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 138, 138, 0.05) 0%, transparent 50%)'
    : 'radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.08) 0%, transparent 50%)',
  minHeight: '100vh',
  position: 'relative',
}));

// Section container for consistent spacing
const SectionContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(4, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 3),
  },
}));

export default function DonationPage() {
  return (
    <DonationPageContainer>
      {/* Hero section */}
      <SectionContainer>
        <DonationHero />
      </SectionContainer>      {/* Donation form */}
      <SectionContainer>
        <DonationForm />
      </SectionContainer>      {/* Impact section */}
      <SectionContainer>
        <ImpactSection />
      </SectionContainer>

      {/* Call to support section */}
      <SectionContainer>
        <CallToSupport />
      </SectionContainer>
    </DonationPageContainer>
  );
}
