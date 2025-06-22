import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  alpha,
  styled,
} from '@mui/material';
import { motion } from 'framer-motion';
import PetsIcon from '@mui/icons-material/Pets';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Styled components following the established patterns
const ImpactContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6, 0),
}));

const ImpactCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#1F2937', 0.7)
    : alpha('#FFFFFF', 0.9),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 16px 40px rgba(255, 107, 107, 0.25)'
      : '0 16px 40px rgba(255, 107, 107, 0.15)',
    borderColor: alpha(theme.palette.primary.main, 0.3),
    '& .impact-icon': {
      transform: 'scale(1.1)',
      color: theme.palette.primary.main,
    },
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 80,
  height: 80,
  margin: '0 auto 24px auto',
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: '2.5rem',
    color: theme.palette.primary.main,
    transition: 'all 0.3s ease',
  },
}));

const StoryContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#111827', 0.7)
    : alpha('#F8F9FA', 0.8),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

interface ImpactData {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
}

const impactData: ImpactData[] = [
  {
    icon: <PetsIcon />,
    title: 'Rescue & Shelter',
    description: 'Provide safe shelter, food, and care for abandoned and stray pets.',
    impact: 'Your $25 feeds a pet for an entire week',
  },
  {
    icon: <LocalHospitalIcon />,
    title: 'Medical Care',
    description: 'Fund essential veterinary care, vaccinations, and emergency treatments.',
    impact: 'Your $100 covers a complete health checkup',
  },
  {
    icon: <HomeIcon />,
    title: 'Forever Homes',
    description: 'Support adoption programs that match pets with loving families.',
    impact: 'Your $250 helps process 5 adoptions',
  },
  {
    icon: <FavoriteIcon />,
    title: 'Special Needs',
    description: 'Care for senior pets and those with special medical requirements.',
    impact: 'Your $500 sponsors a special needs pet for a month',
  },
];

export default function ImpactSection() {
  return (
    <ImpactContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          Your Impact Matters
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 6, maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}
        >
          See how your generous donation directly transforms lives and creates
          lasting change in our community of pets and their future families.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {impactData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ImpactCard elevation={0}>
                  <CardContent sx={{ p: 3 }}>
                    <IconContainer>
                      <div className="impact-icon">
                        {item.icon}
                      </div>
                    </IconContainer>
                    
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      fontWeight="bold"
                      sx={{ mb: 2 }}
                    >
                      {item.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ mb: 2, lineHeight: 1.6 }}
                    >
                      {item.description}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight="600"
                      sx={{ fontStyle: 'italic' }}
                    >
                      {item.impact}
                    </Typography>
                  </CardContent>
                </ImpactCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StoryContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <FavoriteIcon 
                sx={{ 
                  fontSize: '2rem', 
                  color: 'primary.main', 
                  mr: 1 
                }} 
              />
              <Typography variant="h5" fontWeight="bold">
                Success Story
              </Typography>
            </Box>
            
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                fontStyle: 'italic',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              "Thanks to donations from supporters like you, we rescued Bella, a senior dog who
              needed emergency surgery. After months of care and rehabilitation, she found her
              perfect family. Today, Bella is thriving in her forever home, bringing joy to her
              new family every single day."
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, fontWeight: 600 }}
            >
              - PurrfectMatch Rescue Team
            </Typography>
          </StoryContainer>
        </motion.div>
      </motion.div>
    </ImpactContainer>
  );
}
