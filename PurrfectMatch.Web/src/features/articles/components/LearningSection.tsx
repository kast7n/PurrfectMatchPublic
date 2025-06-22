import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, useTheme, alpha, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetchAllLearningArticlesQuery, Article } from '../articlesApi';
import { stripAndTruncateHtml } from '../../../shared/utils/htmlUtils';
import { calculateFeaturedGridColumns } from '../../../shared/utils/gridUtils';

export const LearningSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();  // Fetch learning articles from API with pagination info
  const { data: apiResponse, isLoading } = useFetchAllLearningArticlesQuery({ pageNumber: 1, pageSize: 3 });
  const apiArticles = apiResponse?.items;
  // Map API articles to expected format with fallback data
  const mapApiToLocalFormat = (apiArticle: Article) => ({
    id: apiArticle.postId,
    title: apiArticle.title,
    excerpt: stripAndTruncateHtml(apiArticle.content, 150) || 'No content available',
    image: "/images/articles/default-article.jpg", // Default image since API doesn't have images
    readTime: "5 min read", // Default read time
    author: apiArticle.userName || 'Anonymous',
    category: apiArticle.postType || 'Learning',
    featured: Math.random() > 0.7, // Random featured status
  });
    // Use API data if available, show empty state if no data
  const displayedArticles = apiArticles?.length 
    ? apiArticles.map(mapApiToLocalFormat).slice(0, 3)
    : [];
    // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading learning articles...
        </Typography>
      </Box>
    );
  }

  // Show empty state if no articles
  if (!apiArticles?.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No learning articles available at the moment.
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
            <BookOpen 
              style={{ 
                verticalAlign: 'middle', 
                marginRight: 16,
                color: theme.palette.primary.main 
              }} 
              size={40} 
            />
            Learning Center
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Essential knowledge and expert insights to help you become the best pet parent
          </Typography>
        </Box>
      </motion.div>      <Grid container spacing={4} justifyContent={displayedArticles.length === 1 ? "center" : "flex-start"}>
        {displayedArticles.map((article, index) => (
          <Grid item xs={12} md={displayedArticles.length === 1 ? 6 : 6} lg={calculateFeaturedGridColumns(displayedArticles.length, article.featured)} key={article.id}>
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
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: article.featured ? 250 : 200,
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.8)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <BookOpen size={48} color="white" />
                  {article.featured && (
                    <Chip
                      label="Featured"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </CardMedia>

                <CardContent sx={{ 
                  p: 3, 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  minHeight: 200 // Set consistent content height
                }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={article.category}
                      size="small"
                      sx={{
                        background: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  <Typography
                    variant={article.featured ? "h5" : "h6"}
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                      lineHeight: 1.3,
                    }}
                  >
                    {article.title}
                  </Typography>                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 3,
                      lineHeight: 1.6,
                      flexGrow: 1, // Take remaining space
                      display: '-webkit-box',
                      WebkitLineClamp: 3, // Limit to 3 lines
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {article.excerpt}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 'auto',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <User size={16} color={theme.palette.text.secondary} />
                        <Typography variant="caption" color="text.secondary">
                          {article.author}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={16} color={theme.palette.text.secondary} />
                        <Typography variant="caption" color="text.secondary">
                          {article.readTime}
                        </Typography>
                      </Box>
                    </Box>                    <Button
                      size="small"
                      endIcon={<ArrowRight size={16} />}
                      onClick={() => navigate(`/articles/${article.id}`)}
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      Read Article
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>      {/* Show "View All" button only if there are more than 3 articles */}
      {apiResponse && apiResponse.totalCount > 3 && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowRight />}
            onClick={() => navigate('/articles/learning')}
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
            View All Learning Articles
          </Button>
        </Box>
      )}
    </Box>
  );
};
