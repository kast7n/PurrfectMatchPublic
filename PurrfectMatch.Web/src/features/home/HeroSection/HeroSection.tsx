// Main HeroSection container, imports subcomponents
import HeroBackground from './HeroBackground';
import HeroTitle from './HeroTitle';
import HeroButtons from './HeroButtons';
import HeroStats from './HeroStats';
import HeroCatAnimation from './HeroCatAnimation';
import { HeroContainer, ContentContainer } from './heroSectionStyles';

export default function HeroSection() {
  return (
    <HeroContainer>
      <HeroCatAnimation />
      <HeroBackground />
      <ContentContainer>
        <HeroTitle />
        <HeroButtons />
        <HeroStats />
      </ContentContainer>
    </HeroContainer>
  );
}
