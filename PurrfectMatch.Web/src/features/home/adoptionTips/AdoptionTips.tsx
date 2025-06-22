import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  styled 
} from '@mui/material';
import AdoptionTipCard from './AdoptionTipCard';
import TipsConsultationBox from './TipsConsultationBox';
import type { Tip } from './tipTypes';

// Styled components for the adoption tips section
const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: '32px',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main,
  },
}));

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// Adoption tips data
const adoptionTips: Tip[] = [
  {
    id: 1,
    title: 'Preparing Your Home',
    image: '/images/pet-room.webp',
    icon: '🏠',
    tips: [
      'Pet-proof your space by removing hazards',
      'Create a cozy corner with a bed and toys',
      'Create a cozy corner with a bed and toys',
      'Get proper food, treats, and water bowls',
      'Install gates if needed to limit access to certain areas'
    ]
  },
  {
    id: 2,
    title: 'First Days Together',
    image: '/images/first-day-cat-adoption.webp',
    icon: '📅',
    tips: [
      'Give them space and time to adjust',
      'Establish a routine for feeding and walks',
      'Be patient with house training and behaviors',
      'Keep things calm and quiet for the first week'
    ]
  },
  {
    id: 3,
    title: 'Veterinary Care',
    image: '/images/close-up-veterinary-doctor-taking-care-pet.webp',
    icon: '🩺',
    tips: [
      'Schedule a vet visit within the first week',
      'Keep up with vaccinations and preventatives',
      'Consider microchipping if not already done',
      'Learn the signs that indicate a health concern'
    ]
  }
];

export default function AdoptionTips() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <SectionTitle variant="h4" as="h2">
          Adoption Tips
        </SectionTitle>
        <Button 
          variant="outlined" 
          color="primary"
          href="/adoption-guides"
          sx={{ borderRadius: 20, px: 3, fontWeight: 600 }}
        >
          View All Guides
        </Button>
      </Box>
      <Grid container spacing={4}>
        {adoptionTips.map((tip, index) => (
          <Grid item xs={12} md={4} key={tip.id}>
            <AdoptionTipCard tip={tip} index={index} cardVariants={cardVariants} />
          </Grid>
        ))}
      </Grid>
      <TipsConsultationBox />
    </Box>
  );
}