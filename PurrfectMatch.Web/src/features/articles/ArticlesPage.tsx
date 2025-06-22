import { Box, Container, styled } from '@mui/material';
import { ArticlesHero } from './components/ArticlesHero';
import { LearningSection } from './components/LearningSection';
import { CareGuidesSection } from './components/CareGuidesSection';
import { HealthWellnessSection } from './components/HealthWellnessSection';
import { NewsUpdatesSection } from './components/NewsUpdatesSection';
import { PawDivider } from './components/PawDivider';

// Create a styled component for the page container with a subtle background pattern
const ArticlesPageContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(to bottom, #111827, #0d1424)`
    : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
  backgroundImage: theme.palette.mode === 'dark'
    ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222842' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B6B' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  minHeight: '100vh',
}));

// Create a styled section container for consistent spacing
const SectionContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

const ArticlesPage = () => {
  return (
    <ArticlesPageContainer>
      {/* Hero Section */}
      <ArticlesHero />
      
      {/* Learning Section */}
      <SectionContainer maxWidth="xl">
        <LearningSection />
      </SectionContainer>
      
      <PawDivider />
      
      {/* Care Guides Section */}
      <SectionContainer maxWidth="xl">
        <CareGuidesSection />
      </SectionContainer>
        <PawDivider />
      
      {/* Health & Wellness Section */}
      <SectionContainer maxWidth="xl">
        <HealthWellnessSection />
      </SectionContainer>
        <PawDivider />
      
      {/* News & Updates Section */}
      <SectionContainer maxWidth="xl">
        <NewsUpdatesSection />
      </SectionContainer>
    </ArticlesPageContainer>
  );
};

export default ArticlesPage;
