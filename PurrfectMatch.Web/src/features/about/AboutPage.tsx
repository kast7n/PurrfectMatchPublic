import { Box, Container, styled } from '@mui/material';
import {
  HeroSection,
  FeaturesSection,
  GettingStartedSection,
  TechnicalImplementationSection,
  ContributingSection,
  SupportSection,
  PawDivider,
  FooterMessage
} from './components';

// Styled components
const AboutPageContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(to bottom, #111827, #0d1424)`
    : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

export default function AboutPage() {
  return (
    <AboutPageContainer>
      <Container maxWidth="lg">
        <HeroSection />
        <PawDivider />
        <FeaturesSection />
        <PawDivider />
        <GettingStartedSection />
        <PawDivider />
        <TechnicalImplementationSection />
        <PawDivider />
        <ContributingSection />
        <PawDivider />
        <SupportSection />
        <FooterMessage />
      </Container>
    </AboutPageContainer>
  );
}