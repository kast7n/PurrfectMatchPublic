import { Box, Typography, Grid, Card, CardContent, Button, useTheme, alpha, Chip, Avatar, Theme } from '@mui/material';
import { motion } from 'framer-motion';
import { Heart, Clock, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetchAllCareGuideArticlesQuery, Article } from '../articlesApi';
import { stripAndTruncateHtml } from '../../../shared/utils/htmlUtils';
import { calculateGridColumns } from '../../../shared/utils/gridUtils';

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

export const CareGuidesSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // Fetch care guide articles from API with pagination info
  const { data: apiResponse, isLoading } = useFetchAllCareGuideArticlesQuery({ pageNumber: 1, pageSize: 3 });
  const apiArticles = apiResponse?.items;
    // Map API articles to expected format with fallback data
  const mapApiToLocalFormat = (apiArticle: Article) => ({
    id: apiArticle.postId,
    title: apiArticle.title,
    excerpt: stripAndTruncateHtml(apiArticle.content, 150) || 'No content available',
    category: apiArticle.postType || 'Care Guide',
    readTime: "10 min read", // Default read time
    views: Math.floor(Math.random() * 5000 + 1000).toString(), // Random views count
    difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)], // Random difficulty
    image: "/images/guides/default-guide.jpg", // Default image
  });
    // Use API data if available, show empty state if no data
  const displayedGuides = apiArticles?.length 
    ? apiArticles.map(mapApiToLocalFormat).slice(0, 3)
    : [];
    // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading care guides...
        </Typography>
      </Box>
    );
  }

  // Show empty state if no guides
  if (!apiArticles?.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No care guides available at the moment.
        </Typography>
      </Box>
    );
  }

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
            <Heart 
              style={{ 
                verticalAlign: 'middle', 
                marginRight: 16,
                color: theme.palette.primary.main 
              }} 
              size={40} 
            />
            Care Guides
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Comprehensive step-by-step guides for every aspect of pet care
          </Typography>
        </Box>
      </motion.div>      <Grid container spacing={3} justifyContent={displayedGuides.length === 1 ? "center" : "flex-start"}>
        {displayedGuides.map((guide, index) => (
          <Grid item xs={12} md={displayedGuides.length === 1 ? 4 : 6} lg={calculateGridColumns(displayedGuides.length)} key={guide.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >              <Card
                sx={{
                  height: '100%',
                  minHeight: 450, // Set consistent minimum height
                  display: 'flex',
                  flexDirection: 'column',
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Header with Icon */}
                <Box
                  sx={{
                    height: 120,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  >
                    <Heart size={32} />
                  </Avatar>
                  
                  <Chip
                    label={guide.difficulty}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: alpha(getDifficultyColor(guide.difficulty, theme), 0.1),
                      color: getDifficultyColor(guide.difficulty, theme),
                      fontWeight: 600,
                      border: `1px solid ${alpha(getDifficultyColor(guide.difficulty, theme), 0.3)}`,
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={guide.category}
                      size="small"
                      sx={{
                        background: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                      lineHeight: 1.3,
                    }}
                  >
                    {guide.title}
                  </Typography>                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 3,
                      lineHeight: 1.6,
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3, // Limit to 3 lines
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {guide.excerpt}
                  </Typography>

                  {/* Stats Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      pt: 2,
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={16} color={theme.palette.text.secondary} />
                        <Typography variant="caption" color="text.secondary">
                          {guide.readTime}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Eye size={16} color={theme.palette.text.secondary} />
                        <Typography variant="caption" color="text.secondary">
                          {guide.views}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowRight size={16} />}
                    onClick={() => navigate(`/articles/${guide.id}`)}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      '&:hover': {
                        background: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    Read Guide
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>      {/* Show "View All" button only if there are more than 3 articles */}
      {apiResponse && apiResponse.totalCount > 3 && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRight />}
            onClick={() => navigate('/articles/care-guides')}
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
            Browse All Care Guides
          </Button>
        </Box>
      )}
    </Box>
  );
};
