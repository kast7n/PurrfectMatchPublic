import { Box, Typography, Container, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Lightbulb } from 'lucide-react';
import { 
  useFetchAllLearningArticlesQuery, 
  useFetchAllCareGuideArticlesQuery, 
  useFetchAllHealthArticlesQuery,
  useFetchAllNewsArticlesQuery 
} from '../articlesApi';

export const ArticlesHero = () => {
  const theme = useTheme();
    // Fetch article counts for each category
  const { data: learningData, isLoading: learningLoading } = useFetchAllLearningArticlesQuery({ pageNumber: 1, pageSize: 1 });
  const { data: careGuidesData, isLoading: careGuidesLoading } = useFetchAllCareGuideArticlesQuery({ pageNumber: 1, pageSize: 1 });
  const { data: healthData, isLoading: healthLoading } = useFetchAllHealthArticlesQuery({ pageNumber: 1, pageSize: 1 });
  const { data: newsData, isLoading: newsLoading } = useFetchAllNewsArticlesQuery({ pageNumber: 1, pageSize: 1 });
  const isLoading = learningLoading || careGuidesLoading || healthLoading || newsLoading;

  // Get individual article counts for each category
  const learningCount = learningData?.totalCount || 0;
  const careGuidesCount = careGuidesData?.totalCount || 0;
  const healthCount = healthData?.totalCount || 0;
  const newsCount = newsData?.totalCount || 0;

  // Display values with fallbacks for loading state - showing 4 categories
  const displayStats = [
    { 
      number: isLoading ? '...' : `${learningCount}+`, 
      label: 'Learning Articles' 
    },
    { 
      number: isLoading ? '...' : `${careGuidesCount}+`, 
      label: 'Care Guides' 
    },
    { 
      number: isLoading ? '...' : `${healthCount}+`, 
      label: 'Health Articles' 
    },
    { 
      number: isLoading ? '...' : `${newsCount}+`, 
      label: 'News Articles' 
    },
  ];
  
  return (
    <Box
      sx={{
        position: 'relative',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
      }}
    >
      {/* Floating Icons Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          overflow: 'hidden',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: 'absolute',
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
          >
            {i % 3 === 0 && <BookOpen size={24} />}
            {i % 3 === 1 && <Heart size={24} />}
            {i % 3 === 2 && <Lightbulb size={24} />}
          </motion.div>
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}
          >
            Pet Care Articles
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Discover expert advice, heartwarming stories, and essential guides to help you provide the best care for your furry friends
          </Typography>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Box            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: { xs: 2, md: 3 },
              mt: 4,
            }}
          >            {displayStats.map((stat, index) => (
              <Box
                key={index}                sx={{
                  textAlign: 'center',
                  px: { xs: 1, md: 2 },
                  minWidth: { xs: '120px', md: '140px' },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};
