import { Box, Typography, Grid, Card, CardContent, Button, useTheme, alpha, Chip, LinearProgress, Theme } from '@mui/material';
import { motion } from 'framer-motion';
import { Zap, Clock, TrendingUp, ArrowRight, Star } from 'lucide-react';

const trainingTips = [
  {
    id: 1,
    title: "Positive Reinforcement Training",
    excerpt: "Master the art of positive reinforcement to build stronger bonds and faster learning with your pet.",
    category: "Basic Training",
    difficulty: "Beginner",
    duration: "2-3 weeks",
    successRate: 95,
    rating: 4.9,
    isPopular: true,
  },
  {
    id: 2,
    title: "Leash Training Made Easy",
    excerpt: "Step-by-step guide to teach your dog proper leash manners and enjoy stress-free walks together.",
    category: "Walking",
    difficulty: "Beginner",
    duration: "1-2 weeks",
    successRate: 88,
    rating: 4.7,
    isPopular: false,
  },
  {
    id: 3,
    title: "Advanced Obedience Commands",
    excerpt: "Take your pet's training to the next level with advanced commands and complex behavioral patterns.",
    category: "Advanced Training",
    difficulty: "Advanced",
    duration: "4-6 weeks",
    successRate: 76,
    rating: 4.8,
    isPopular: false,
  },
  {
    id: 4,
    title: "Solving Separation Anxiety",
    excerpt: "Proven techniques to help your pet overcome separation anxiety and feel secure when alone.",
    category: "Behavioral",
    difficulty: "Intermediate",
    duration: "3-4 weeks",
    successRate: 82,
    rating: 4.6,
    isPopular: true,
  },
];

const getDifficultyColor = (difficulty: string, theme: Theme) => {
  switch (difficulty) {
    case 'Beginner':
      return theme.palette.success.main;
    case 'Intermediate':
      return theme.palette.warning.main;
    case 'Advanced':
      return theme.palette.error.main;
    default:
      return theme.palette.text.secondary;
  }
};

export const TrainingTipsSection = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            <Zap 
              style={{ 
                verticalAlign: 'middle', 
                marginRight: 16,
                color: theme.palette.primary.main 
              }} 
              size={40} 
            />
            Training Tips
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Effective training techniques to help your pet learn faster and build better habits
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {trainingTips.map((tip, index) => (
          <Grid item xs={12} md={6} key={tip.id}>
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
              >
                {/* Popular Badge */}
                {tip.isPopular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.warning.main})`,
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderBottomLeftRadius: 12,
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <TrendingUp size={16} />
                    <Typography variant="caption" fontWeight={600}>
                      Popular
                    </Typography>
                  </Box>
                )}

                <CardContent sx={{ p: 4 }}>
                  {/* Header with Tags */}
                  <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={tip.category}
                      size="small"
                      sx={{
                        background: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={tip.difficulty}
                      size="small"
                      sx={{
                        background: alpha(getDifficultyColor(tip.difficulty, theme), 0.1),
                        color: getDifficultyColor(tip.difficulty, theme),
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                      lineHeight: 1.3,
                    }}
                  >
                    {tip.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    {tip.excerpt}
                  </Typography>

                  {/* Progress and Stats */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {tip.successRate}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={tip.successRate}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        },
                      }}
                    />
                  </Box>

                  {/* Stats Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 3,
                      p: 2,
                      background: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Clock size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        {tip.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star size={16} color={theme.palette.warning.main} />
                      <Typography variant="body2" fontWeight={600}>
                        {tip.rating}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowRight size={16} />}
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontWeight: 600,
                      py: 1.5,
                      boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Start Training
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button
          variant="outlined"
          size="large"
          endIcon={<ArrowRight />}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            fontWeight: 600,
            px: 4,
            py: 1.5,
            '&:hover': {
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }}
        >
          View All Training Tips
        </Button>
      </Box>
    </Box>
  );
};
