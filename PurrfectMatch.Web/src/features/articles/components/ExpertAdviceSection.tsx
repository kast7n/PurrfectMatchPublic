import { Box, Typography, Grid, Card, CardContent, Button, useTheme, alpha, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { UserCheck, Star, MessageCircle, Calendar, ArrowRight } from 'lucide-react';

const expertAdvice = [
  {
    id: 1,
    title: "Ask Dr. Sarah: Puppy Training Basics",
    expert: {
      name: "Dr. Sarah Johnson",
      title: "Veterinary Behaviorist",
      rating: 4.9,
      years: 15,
    },
    excerpt: "Get expert answers to common puppy training questions from our certified veterinary behaviorist.",
    category: "Q&A Session",
    date: "Tomorrow, 2:00 PM",
    isLive: true,
    responses: 156,
  },
  {
    id: 2,
    title: "Senior Pet Nutrition Guidelines",
    expert: {
      name: "Dr. Michael Chen",
      title: "Veterinary Nutritionist",
      rating: 4.8,
      years: 12,
    },
    excerpt: "Learn about proper nutrition for aging pets and how to adjust their diet for optimal health.",
    category: "Nutrition Guide",
    date: "Last week",
    isLive: false,
    responses: 89,
  },
  {
    id: 3,
    title: "Behavioral Issues in Rescue Pets",
    expert: {
      name: "Lisa Rodriguez",
      title: "Animal Behaviorist",
      rating: 4.9,
      years: 18,
    },
    excerpt: "Understanding and addressing common behavioral challenges in rescued animals.",
    category: "Behavioral",
    date: "2 days ago",
    isLive: false,
    responses: 234,
  },
  {
    id: 4,
    title: "Emergency Pet Care Webinar",
    expert: {
      name: "Dr. Emily Davis",
      title: "Emergency Veterinarian",
      rating: 4.7,
      years: 10,
    },
    excerpt: "Essential knowledge for handling pet emergencies before reaching the veterinary clinic.",
    category: "Live Webinar",
    date: "Next Friday, 7:00 PM",
    isLive: true,
    responses: 67,
  },
];

export const ExpertAdviceSection = () => {
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
            <UserCheck 
              style={{ 
                verticalAlign: 'middle', 
                marginRight: 16,
                color: theme.palette.primary.main 
              }} 
              size={40} 
            />
            Expert Advice
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Get professional guidance from certified veterinarians and animal behavior specialists
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {expertAdvice.map((advice, index) => (
          <Grid item xs={12} md={6} key={advice.id}>
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
                {/* Live Badge */}
                {advice.isLive && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
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
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'white',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                          '100%': { opacity: 1 },
                        },
                      }}
                    />
                    <Typography variant="caption" fontWeight={600}>
                      {advice.category.includes('Live') || advice.date.includes('Tomorrow') || advice.date.includes('Friday') ? 'LIVE' : 'UPCOMING'}
                    </Typography>
                  </Box>
                )}

                <CardContent sx={{ p: 4 }}>
                  {/* Expert Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      }}
                    >
                      <UserCheck size={28} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {advice.expert.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {advice.expert.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star size={16} color={theme.palette.warning.main} />
                          <Typography variant="caption" fontWeight={600}>
                            {advice.expert.rating}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          • {advice.expert.years} years experience
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Category */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={advice.category}
                      size="small"
                      sx={{
                        background: advice.isLive 
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.1),
                        color: advice.isLive 
                          ? theme.palette.error.main
                          : theme.palette.primary.main,
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                      lineHeight: 1.3,
                    }}
                  >
                    {advice.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {advice.excerpt}
                  </Typography>

                  {/* Meta Info */}
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
                      <Calendar size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        {advice.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MessageCircle size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" fontWeight={600}>
                        {advice.responses} responses
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant={advice.isLive ? "contained" : "outlined"}
                    endIcon={<ArrowRight size={16} />}
                    sx={
                      advice.isLive
                        ? {
                            background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
                            fontWeight: 600,
                            py: 1.5,
                            boxShadow: `0 4px 15px ${alpha(theme.palette.error.main, 0.3)}`,
                            '&:hover': {
                              boxShadow: `0 6px 20px ${alpha(theme.palette.error.main, 0.4)}`,
                            },
                          }
                        : {
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            '&:hover': {
                              background: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                            },
                          }
                    }
                  >
                    {advice.isLive ? 'Join Live Session' : 'View Advice'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowRight />}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            fontWeight: 600,
            px: 4,
            py: 1.5,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          Browse All Expert Advice
        </Button>
      </Box>
    </Box>
  );
};
