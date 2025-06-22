import { Typography, Grid, Card, Box, List, ListItem, ListItemIcon, ListItemText, styled, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Security as SecurityIcon,
  Speed as PerformanceIcon,
  Storage as DatabaseIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const TechCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.7)' 
    : 'rgba(255, 255, 255, 0.9)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 16px rgba(0,0,0,0.3)' 
      : '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

interface TechFeature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

export default function TechnicalImplementationSection() {
  const theme = useTheme();

  const techFeatures: TechFeature[] = [
    {
      icon: <SecurityIcon />,
      title: 'Structured Logging',
      description: 'Comprehensive Serilog integration with Azure SQL'
    },
    {
      icon: <PerformanceIcon />,
      title: 'Performance Monitoring',
      description: 'Request/response logging and performance tracking'
    },
    {
      icon: <DatabaseIcon />,
      title: 'Centralized Logs',
      description: 'All logs stored in Azure SQL ApplicationLogs table'
    },
    {
      icon: <CodeIcon />,
      title: 'Clean Architecture',
      description: 'Manager-based architecture with dependency injection'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Typography variant="h3" component="h2" gutterBottom textAlign="center" fontWeight="bold" mb={6}>
        Technical Implementation
      </Typography>
      <Typography variant="body1" textAlign="center" mb={6} color="text.secondary">
        PurrfectMatch is built with modern technologies and best practices for reliability and scalability.
      </Typography>
      
      <Grid container spacing={3}>
        {techFeatures.map((tech, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <TechCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ color: theme.palette.primary.main, mr: 2 }}>
                  {tech.icon}
                </Box>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  {tech.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {tech.description}
              </Typography>
            </TechCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ 
        mt: 6, 
        p: 4, 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)', 
        borderRadius: 2 
      }}>
        <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
          Serilog Integration Highlights
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Key Features:</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><SecurityIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Multi-sink logging (Console, File, Azure SQL)" />
              </ListItem>
              <ListItem>
                <ListItemIcon><PerformanceIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Request/Response and Performance logging middleware" />
              </ListItem>
              <ListItem>
                <ListItemIcon><DatabaseIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Centralized ApplicationLogs table in Azure SQL" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Benefits:</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CodeIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Structured and queryable logs" />
              </ListItem>
              <ListItem>
                <ListItemIcon><SecurityIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Enhanced debugging and monitoring" />
              </ListItem>
              <ListItem>
                <ListItemIcon><PerformanceIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Scalable logging architecture" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
