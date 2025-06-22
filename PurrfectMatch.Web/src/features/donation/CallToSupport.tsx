import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  styled,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import ShareIcon from '@mui/icons-material/Share';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

// Styled components following the established patterns
const CallToSupportContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6, 0),
  position: 'relative',
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha('#1F2937', 0.9)} 0%, ${alpha('#111827', 0.9)} 100%)`
    : `linear-gradient(135deg, ${alpha('#FFF9F9', 0.9)} 0%, ${alpha('#FFF1F1', 0.9)} 100%)`,
  borderRadius: theme.spacing(4),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8, 4),
  },
}));

const ActionCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#1F2937', 0.7)
    : alpha('#FFFFFF', 0.8),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 28px rgba(255, 107, 107, 0.25)'
      : '0 12px 28px rgba(255, 107, 107, 0.15)',
    borderColor: alpha(theme.palette.primary.main, 0.3),
    '& .action-icon': {
      transform: 'scale(1.1)',
      color: theme.palette.primary.main,
    },
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 64,
  height: 64,
  margin: '0 auto 16px auto',
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: '2rem',
    color: theme.palette.primary.main,
    transition: 'all 0.3s ease',
  },
}));

const CallToActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  minWidth: '200px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 24px rgba(255, 107, 107, 0.4)'
      : '0 8px 24px rgba(255, 107, 107, 0.3)',
  },
}));

interface SupportAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  link?: string;
}

const supportActions: SupportAction[] = [
  {
    icon: <ShareIcon />,
    title: 'Share Our Mission',
    description: 'Help us reach more people by sharing our cause on social media.',
    action: 'Share Now',
    link: '#',
  },
  {
    icon: <VolunteerActivismIcon />,
    title: 'Become a Volunteer',
    description: 'Join our team of dedicated volunteers and make a hands-on difference.',
    action: 'Volunteer',
    link: '/volunteer',
  },
  {
    icon: <PeopleIcon />,
    title: 'Monthly Giving',
    description: 'Set up a recurring donation to provide consistent support.',
    action: 'Set Up Monthly',
    link: '/monthly-giving',
  },
];

export default function CallToSupport() {
  const theme = useTheme();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Support PurrfectMatch',
        text: 'Help pets find their forever homes by supporting PurrfectMatch',
        url: window.location.origin,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      // You could show a toast here
    }
  };

  return (
    <CallToSupportContainer>
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
          Other Ways to Help
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 6, maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}
        >
          Your donation is just one way to make a difference. Explore other meaningful
          ways to support our mission and help more pets find their forever homes.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {supportActions.map((action, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ActionCard>
                  <IconContainer>
                    <div className="action-icon">
                      {action.icon}
                    </div>
                  </IconContainer>
                  
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    {action.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{ mb: 3, lineHeight: 1.6, flexGrow: 1 }}
                  >
                    {action.description}
                  </Typography>
                    {action.title === 'Share Our Mission' ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleShare}
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      {action.action}
                    </Button>
                  ) : (
                    <Link to={action.link || '#'} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                          borderRadius: 20,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {action.action}
                      </Button>
                    </Link>
                  )}
                </ActionCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Ready to Adopt?
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}
            >
              Browse our available pets and find your perfect companion today.
              Every adoption opens up space for another rescue.
            </Typography>            <Link to="/pets" style={{ textDecoration: 'none' }}>
              <CallToActionButton
                variant="contained"
                color="primary"
                size="large"
              >
                Browse Available Pets
              </CallToActionButton>
            </Link>
          </Box>

          <Box
            sx={{
              pt: 4,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              "Until one has loved an animal, a part of one's soul remains unawakened."
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontWeight: 600 }}
            >
              - Anatole France
            </Typography>
          </Box>
        </motion.div>
      </motion.div>
    </CallToSupportContainer>
  );
}
