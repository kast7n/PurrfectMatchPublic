import {
  Box,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Chip,
  styled,
  alpha,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

// Styled components
const ShowcaseContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6, 0),
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha('#1F2937', 0.95)} 0%, ${alpha('#111827', 0.9)} 100%)`
    : `linear-gradient(135deg, ${alpha('#FEFCFC', 0.95)} 0%, ${alpha('#FFF5F5', 0.9)} 100%)`,
  borderRadius: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 30% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 138, 138, 0.08) 0%, transparent 50%)'
      : 'radial-gradient(circle at 30% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 138, 138, 0.08) 0%, transparent 50%)',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const DonorCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(3),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha('#374151', 0.8)} 0%, ${alpha('#1F2937', 0.9)} 100%)`
    : `linear-gradient(135deg, ${alpha('#FFFFFF', 0.9)} 0%, ${alpha('#FFF8F8', 0.95)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(255, 107, 107, 0.15)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.4)'
      : '0 20px 40px rgba(255, 107, 107, 0.25)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
  },
}));

const DonorAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  fontSize: '2rem',
  fontWeight: 'bold',
  border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 24px rgba(255, 107, 107, 0.3)'
    : '0 8px 24px rgba(255, 107, 107, 0.2)',
}));

const AmountChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  height: '36px',
  borderRadius: '18px',
  '& .MuiChip-icon': {
    color: 'white',
  },
}));

const HeartIcon = styled(FavoriteIcon)(({ theme }) => ({
  position: 'absolute',
  fontSize: '120px',
  color: alpha(theme.palette.primary.main, 0.1),
  top: '20px',
  right: '20px',
  transform: 'rotate(15deg)',
  zIndex: 0,
}));

// Mock donor data (in real app, this would come from API)
const mockDonors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    amount: 250,
    message: 'Happy to help these beautiful pets find their forever homes! ❤️',
    avatar: null,
    donationDate: '2024-06-18',
    isAnonymous: false,
  },
  {
    id: 2,
    name: 'Anonymous',
    amount: 100,
    message: 'Every pet deserves love and care.',
    avatar: null,
    donationDate: '2024-06-18',
    isAnonymous: true,
  },
  {
    id: 3,
    name: 'Michael Chen',
    amount: 500,
    message: 'Thank you for the amazing work you do! My family adopted our dog here last year.',
    avatar: null,
    donationDate: '2024-06-17',
    isAnonymous: false,
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    amount: 75,
    message: 'Supporting the cause one donation at a time! 🐕🐱',
    avatar: null,
    donationDate: '2024-06-17',
    isAnonymous: false,
  },
  {
    id: 5,
    name: 'Anonymous',
    amount: 300,
    message: 'Keep up the wonderful work!',
    avatar: null,
    donationDate: '2024-06-16',
    isAnonymous: true,
  },
  {
    id: 6,
    name: 'David Wilson',
    amount: 150,
    message: 'In memory of my beloved cat Whiskers. Hope this helps other pets find loving homes.',
    avatar: null,
    donationDate: '2024-06-16',
    isAnonymous: false,
  },
];

interface DonorData {
  id: number;
  name: string;
  amount: number;
  message?: string;
  avatar?: string | null;
  donationDate: string;
  isAnonymous: boolean;
}

const getInitials = (name: string): string => {
  if (name === 'Anonymous') return '💖';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export default function DonorShowcase() {
  const theme = useTheme();
  
  // In a real app, you'd use the actual API data
  // const { data: donations, isLoading } = useFetchDonationsQuery();
  
  // For now, we'll use mock data but show how to integrate real data
  const donors: DonorData[] = mockDonors;
  // Filter to show only recent donations (non-anonymous or anonymous with messages)
  const displayDonors = donors
    .filter(donor => !donor.isAnonymous || donor.message)
    .slice(0, 6); // Show only the first 6 donors

  return (
    <ShowcaseContainer>
      <HeartIcon />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 2 }}>
          <VolunteerActivismIcon 
            sx={{ 
              fontSize: 60, 
              color: 'primary.main',
              mb: 2
            }} 
          />        </Box>

        <Grid container spacing={4} sx={{ mt: 4, mb: 4 }}>
          {displayDonors.map((donor, index) => (
            <Grid item xs={12} sm={6} lg={4} key={donor.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <DonorCard elevation={0}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <DonorAvatar>
                      {getInitials(donor.name)}
                    </DonorAvatar>
                    
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ mt: 2, mb: 1 }}
                    >
                      {donor.name}
                    </Typography>
                    
                    <AmountChip
                      icon={<FavoriteIcon />}
                      label={`$${donor.amount}`}
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 2 }}
                    >
                      {formatDate(donor.donationDate)}
                    </Typography>
                    
                    {donor.message && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                          minHeight: '3em',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        "{donor.message}"
                      </Typography>
                    )}
                  </CardContent>
                </DonorCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography
            variant="h6"
            color="primary.main"
            fontWeight="600"
            sx={{ 
              background: alpha(theme.palette.primary.main, 0.1),
              padding: theme.spacing(2, 4),
              borderRadius: theme.spacing(3),
              display: 'inline-block',
            }}
          >
            Join our community of donors and make a difference today! 💕
          </Typography>
        </motion.div>
      </motion.div>
    </ShowcaseContainer>
  );
}
