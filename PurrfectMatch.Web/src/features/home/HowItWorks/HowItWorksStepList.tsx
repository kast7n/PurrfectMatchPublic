import { Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PetsIcon from '@mui/icons-material/Pets';
import HowItWorksStepCard from './HowItWorksStepCard';

const steps = [
  {
    step: 1,
    icon: <SearchIcon sx={{ fontSize: 44, color: 'primary.main' }} />,
    title: 'Discover Your Soulmate',
    description:
      'Explore a vibrant gallery of pets, each with their own story and personality. Use our smart filters to find a companion who matches your lifestyle and heart.',
    imgSrc: '/images/svg/undraw_pet-adoption.svg',
    imgAlt: 'Find Your Match Illustration',
    pawColor: '#e57373',
    borderColor: '#e57373',
    boxShadow: '0 8px 32px rgba(229,115,115,0.10)',
    iconColor: 'primary',
    custom: 0,
  },
  {
    step: 2,
    icon: <AssignmentIcon sx={{ fontSize: 44, color: 'secondary.main' }} />,
    title: 'Apply with Confidence',
    description:
      'Fill out a quick, friendly application. Our caring team will guide you, answer your questions, and help you meet your future furry friend—no pressure, just love!',
    imgSrc: '/images/svg/undraw_complete-form.svg',
    imgAlt: 'Complete Application Illustration',
    pawColor: '#81c784',
    borderColor: '#81c784',
    boxShadow: '0 8px 32px rgba(129,199,132,0.10)',
    iconColor: 'secondary',
    custom: 1,
  },
  {
    step: 3,
    icon: <PetsIcon sx={{ fontSize: 44, color: 'info.main' }} />,
    title: 'Bring Home Happiness',
    description:
      'Finalize your adoption, receive a welcome kit, and start a new chapter together! Our support doesn’t end here—we’re always here for you and your pet.',
    imgSrc: '/images/svg/undraw_friends.svg',
    imgAlt: 'Welcome Home Illustration',
    pawColor: '#64b5f6',
    borderColor: '#64b5f6',
    boxShadow: '0 8px 32px rgba(100,181,246,0.10)',
    iconColor: 'info',
    custom: 2,
  },
];

const HowItWorksStepList = () => (
  <Grid container spacing={4}>
    {steps.map((step) => (
      <Grid item xs={12} md={4} key={step.step}>
        <HowItWorksStepCard {...step} />
      </Grid>
    ))}
  </Grid>
);

export default HowItWorksStepList;
