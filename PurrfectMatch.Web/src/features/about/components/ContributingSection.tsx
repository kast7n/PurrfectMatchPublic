import { Typography, Grid, Card, CardContent, Box, styled } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Lightbulb as FeatureIcon,
  BugReport as BugIcon,
  Code as CodeIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0,0,0,0.4)' 
      : '0 20px 40px rgba(0,0,0,0.15)',
  },
}));

interface ContributionType {
  icon: React.ReactElement;
  title: string;
  description: string;
}

export default function ContributingSection() {
  const contributionTypes: ContributionType[] = [
    {
      icon: <FeatureIcon />,
      title: 'Feature Requests',
      description: 'Have an idea for a new feature or improvement? Let us know by opening an issue on GitHub.'
    },
    {
      icon: <BugIcon />,
      title: 'Bug Reports',
      description: 'Encountered a bug or issue while using PurrfectMatch? Report it on GitHub so we can investigate and fix it.'
    },
    {
      icon: <CodeIcon />,
      title: 'Code Contributions',
      description: 'Fork the repository, make your changes, and submit a pull request. We appreciate all contributions!'
    },
    {
      icon: <ShareIcon />,
      title: 'Spread the Word',
      description: 'Help spread the word about PurrfectMatch by sharing it with your friends, family, and social networks.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Typography variant="h3" component="h2" gutterBottom textAlign="center" fontWeight="bold" mb={6}>
        Contributing
      </Typography>
      <Typography variant="body1" textAlign="center" mb={6} color="text.secondary">
        We welcome contributions from the community to help improve PurrfectMatch and make it even better 
        for pet lovers everywhere. Whether you're a developer, designer, or passionate pet advocate, 
        there are many ways to get involved:
      </Typography>
      <Grid container spacing={4}>
        {contributionTypes.map((contribution, index) => (
          <Grid item xs={12} md={6} key={index}>
            <FeatureCard>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ color: 'primary.main', mr: 2 }}>
                    {contribution.icon}
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold">
                    {contribution.title}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {contribution.description}
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}
