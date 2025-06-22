import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  useTheme,
  styled,
  alpha,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`
    : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.3)'
    : '0 8px 32px rgba(0,0,0,0.1)',
  textAlign: 'center',
  minHeight: 400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ 
  title, 
  description = 'This feature is currently under development and will be available soon.' 
}) => {
  const theme = useTheme();

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
          {title}
        </Typography>
        
        <StyledCard>
          <CardContent sx={{ p: 6 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  margin: '0 auto 24px',
                }}
              >
                <ConstructionIcon sx={{ fontSize: 60 }} />
              </Avatar>
            </motion.div>

            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
              Coming Soon
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              {description}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              We're working hard to bring you this feature. Stay tuned!
            </Typography>
          </CardContent>
        </StyledCard>
      </motion.div>
    </Box>
  );
};

export default ComingSoonPage;
