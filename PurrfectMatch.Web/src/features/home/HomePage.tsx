import HeroSection from './HeroSection/HeroSection';
import SearchFilters from './SearchFilters';
import FeaturedPetsGrid from './FeaturedPetsGrid';
import HowItWorks from './HowItWorks/HowItWorksSection';
import TestimonialsCarousel from './TestimonialsCarousel';
import AdoptionTips from './adoptionTips/AdoptionTips';
import CallToAction from './CallToAction';
import { NewsUpdatesSection } from '../articles/components';
import { Box, Container, styled, useTheme } from '@mui/material';

// Create a styled component for the page container with a subtle background pattern
const HomePageContainer = styled(Box)(({ theme }) => ({  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(to bottom, #111827, #0d1424)`
    : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
  backgroundImage: theme.palette.mode === 'dark'
    ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222842' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B6B' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  minHeight: '100vh',
}));

// Create a styled section container for consistent spacing
const SectionContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

// Main paw print divider component
const PawDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: theme.spacing(6, 0),
  opacity: 0.6,
  '& svg': {
    margin: theme.spacing(0, 1),
    color: theme.palette.primary.main,
  }
}));

export default function HomePage() {
  const theme = useTheme();
  // const { darkMode } = useAppSelector(state => state.ui);

  return (
    <HomePageContainer>
      {/* Main hero banner with emotional appeal */}
      <HeroSection />
      
      {/* Search filters with soft styling */}
      <SectionContainer>
        <SearchFilters />
      </SectionContainer>
      
      {/* Paw print divider */}
      <PawDivider>
        <svg width="24" height="24" viewBox="0 0 512 512">
          <path fill="currentColor" d="M256 224c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 240c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96-43.1 96-96 96zm143.9-320C375.5 64.7 335.2 0 288 0c-13.2 0-27 10.7-27 24 0 13.7 9.3 24 22.5 24 32.6 0 65.4 47.3 73.7 84.3.4 1.7.9 3.5 1.3 5.2 3.4 15.1 16.9 25.5 32 25.5 17.7 0 32-14.3 32-32 0-18.9-9.5-36.3-22.6-48zM144 64C99.8 64 59.5 128.7 35.1 144C14.5 156.3 5 173.7 5 192c0 17.7 14.3 32 32 32 15.1 0 28.6-10.4 32-25.5.4-1.7.9-3.5 1.3-5.2 8.3-37 41.1-84.3 73.7-84.3 13.2 0 22.5-10.3 22.5-24 0-13.3-13.8-24-27-24zm216.3 144c-19.2 0-42.5 16.7-54.5 35.3-3.5 5.4-6.6 10.1-9.4 15.3-9.1 16.7-24.5 47.4-45.6 47.4-13.2 0-24 10.8-24 24s10.8 24 24 24c32.5 0 60.1-45.3 71.6-65.2 6.7-11.7 15.9-27.8 39.8-27.8 13.2 0 24-10.8 24-24s-10.8-24-24-24h-1.9zm-193.9 0h-1.9c-13.2 0-24 10.8-24 24s10.8 24 24 24c23.9 0 33.2 16.1 39.8 27.8 11.5 19.9 39.1 65.2 71.6 65.2 13.2 0 24-10.8 24-24s-10.8-24-24-24c-21.2 0-36.5-30.7-45.6-47.4-2.8-5.2-5.9-9.9-9.4-15.3-12-18.6-35.3-35.3-54.5-35.3z"/>
        </svg>
        <svg width="16" height="16" viewBox="0 0 512 512">
          <path fill="currentColor" d="M256 224c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 240c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96-43.1 96-96 96zm143.9-320C375.5 64.7 335.2 0 288 0c-13.2 0-27 10.7-27 24 0 13.7 9.3 24 22.5 24 32.6 0 65.4 47.3 73.7 84.3.4 1.7.9 3.5 1.3 5.2 3.4 15.1 16.9 25.5 32 25.5 17.7 0 32-14.3 32-32 0-18.9-9.5-36.3-22.6-48zM144 64C99.8 64 59.5 128.7 35.1 144C14.5 156.3 5 173.7 5 192c0 17.7 14.3 32 32 32 15.1 0 28.6-10.4 32-25.5.4-1.7.9-3.5 1.3-5.2 8.3-37 41.1-84.3 73.7-84.3 13.2 0 22.5-10.3 22.5-24 0-13.3-13.8-24-27-24zm216.3 144c-19.2 0-42.5 16.7-54.5 35.3-3.5 5.4-6.6 10.1-9.4 15.3-9.1 16.7-24.5 47.4-45.6 47.4-13.2 0-24 10.8-24 24s10.8 24 24 24c32.5 0 60.1-45.3 71.6-65.2 6.7-11.7 15.9-27.8 39.8-27.8 13.2 0 24-10.8 24-24s-10.8-24-24-24h-1.9zm-193.9 0h-1.9c-13.2 0-24 10.8-24 24s10.8 24 24 24c23.9 0 33.2 16.1 39.8 27.8 11.5 19.9 39.1 65.2 71.6 65.2 13.2 0 24-10.8 24-24s-10.8-24-24-24c-21.2 0-36.5-30.7-45.6-47.4-2.8-5.2-5.9-9.9-9.4-15.3-12-18.6-35.3-35.3-54.5-35.3z"/>
        </svg>
        <svg width="20" height="20" viewBox="0 0 512 512">
          <path fill="currentColor" d="M256 224c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 240c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96-43.1 96-96 96zm143.9-320C375.5 64.7 335.2 0 288 0c-13.2 0-27 10.7-27 24 0 13.7 9.3 24 22.5 24 32.6 0 65.4 47.3 73.7 84.3.4 1.7.9 3.5 1.3 5.2 3.4 15.1 16.9 25.5 32 25.5 17.7 0 32-14.3 32-32 0-18.9-9.5-36.3-22.6-48zM144 64C99.8 64 59.5 128.7 35.1 144C14.5 156.3 5 173.7 5 192c0 17.7 14.3 32 32 32 15.1 0 28.6-10.4 32-25.5.4-1.7.9-3.5 1.3-5.2 8.3-37 41.1-84.3 73.7-84.3 13.2 0 22.5-10.3 22.5-24 0-13.3-13.8-24-27-24zm216.3 144c-19.2 0-42.5 16.7-54.5 35.3-3.5 5.4-6.6 10.1-9.4 15.3-9.1 16.7-24.5 47.4-45.6 47.4-13.2 0-24 10.8-24 24s10.8 24 24 24c32.5 0 60.1-45.3 71.6-65.2 6.7-11.7 15.9-27.8 39.8-27.8 13.2 0 24-10.8 24-24s-10.8-24-24-24h-1.9zm-193.9 0h-1.9c-13.2 0-24 10.8-24 24s10.8 24 24 24c23.9 0 33.2 16.1 39.8 27.8 11.5 19.9 39.1 65.2 71.6 65.2 13.2 0 24-10.8 24-24s-10.8-24-24-24c-21.2 0-36.5-30.7-45.6-47.4-2.8-5.2-5.9-9.9-9.4-15.3-12-18.6-35.3-35.3-54.5-35.3z"/>
        </svg>
      </PawDivider>
      
      {/* Featured pets section with emotional cards */}
      <SectionContainer>
        <FeaturedPetsGrid />
      </SectionContainer>
      
      {/* How the adoption process works - illustrated */}      <SectionContainer sx={{ 
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(17, 24, 39, 0.7)' 
          : 'rgba(255, 242, 233, 0.7)', 
        borderRadius: 4,
        padding: 4,
        boxShadow: theme.palette.mode === 'dark'
          ? '0px 4px 20px rgba(0, 0, 0, 0.3)'
          : '0px 4px 20px rgba(255, 107, 107, 0.15)'
      }}>
        <HowItWorks />
      </SectionContainer>
        {/* Testimonials with real stories */}
      <SectionContainer>
        <TestimonialsCarousel />
      </SectionContainer>
        {/* News & Updates Section */}
      <SectionContainer maxWidth="xl">
        <NewsUpdatesSection />
      </SectionContainer>
      
      {/* Adoption tips with cute illustrations */}
      <SectionContainer>
        <AdoptionTips />
      </SectionContainer>
      
      {/* Strong emotional call to action */}
      <SectionContainer>
        <CallToAction />
      </SectionContainer>
    </HomePageContainer>
  );
}