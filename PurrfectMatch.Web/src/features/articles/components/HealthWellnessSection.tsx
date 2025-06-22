import { Box, Typography, Grid, Card, CardContent, Button, useTheme, alpha, Chip, Avatar, IconButton, Theme } from '@mui/material';
import { motion } from 'framer-motion';
import { Activity, Clock, Bookmark, Share2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetchAllHealthArticlesQuery, Article } from '../articlesApi';
import { stripAndTruncateHtml } from '../../../shared/utils/htmlUtils';
import { calculateGridColumns } from '../../../shared/utils/gridUtils';

const getUrgencyColor = (urgency: string, theme: Theme) => {
  switch (urgency) {
    case 'high':
      return theme.palette.error.main;
    case 'medium':
      return theme.palette.warning.main;
    case 'low':
      return theme.palette.success.main;
    default:
      return theme.palette.text.secondary;
  }
};

const getUrgencyLabel = (urgency: string) => {
  switch (urgency) {
    case 'high':
      return 'Important';
    case 'medium':
      return 'Helpful';
    case 'low':
      return 'Good to Know';
    default:
      return '';
  }
};

export const HealthWellnessSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // Fetch health articles from API with pagination info
  const { data: apiResponse, isLoading } = useFetchAllHealthArticlesQuery({ pageNumber: 1, pageSize: 3 });
  const apiArticles = apiResponse?.items;
    // Map API articles to expected format with fallback data
  const mapApiToLocalFormat = (apiArticle: Article) => ({
    id: apiArticle.postId,
    title: apiArticle.title,
    excerpt: stripAndTruncateHtml(apiArticle.content, 150) || 'No content available',
    category: apiArticle.postType || 'Health',
    readTime: "10 min read", // Default read time
    isBookmarked: Math.random() > 0.5, // Random bookmark status
    urgency: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)], // Random urgency
    lastUpdated: Math.floor(Math.random() * 7 + 1) + " days ago", // Random last updated
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
          Loading health articles...
        </Typography>
      </Box>
    );
  }

  // Show empty state if no articles
  if (!apiArticles?.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No health articles available at the moment.
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
            <Activity 
              style={{ 
                verticalAlign: 'middle', 
                marginRight: 16,
                color: theme.palette.primary.main 
              }} 
              size={40} 
            />
            Health & Wellness
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Expert advice on keeping your pet healthy, happy, and thriving
          </Typography>
        </Box>
      </motion.div>      <Grid container spacing={3} justifyContent={displayedArticles.length === 1 ? "center" : "flex-start"}>
        {displayedArticles.map((article, index) => (
          <Grid item xs={12} md={displayedArticles.length === 1 ? 4 : 6} lg={calculateGridColumns(displayedArticles.length)} key={article.id}>
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
                {/* Header with Health Icon */}
                <Box
                  sx={{
                    height: 100,
                    background: `linear-gradient(135deg, ${alpha(getUrgencyColor(article.urgency, theme), 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    position: 'relative',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: `linear-gradient(45deg, ${getUrgencyColor(article.urgency, theme)}, ${theme.palette.primary.main})`,
                    }}
                  >
                    <Activity size={28} />
                  </Avatar>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      sx={{
                        color: article.isBookmarked ? theme.palette.secondary.main : theme.palette.text.secondary,
                        '&:hover': {
                          background: alpha(theme.palette.secondary.main, 0.1),
                        },
                      }}
                    >
                      <Bookmark size={20} fill={article.isBookmarked ? 'currentColor' : 'none'} />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <Share2 size={20} />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Tags */}
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={article.category}
                      size="small"
                      sx={{
                        background: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={getUrgencyLabel(article.urgency)}
                      size="small"
                      sx={{
                        background: alpha(getUrgencyColor(article.urgency, theme), 0.1),
                        color: getUrgencyColor(article.urgency, theme),
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
                    {article.title}
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
                    {article.excerpt}
                  </Typography>

                  {/* Stats and Meta */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 3,
                      p: 2,
                      background: alpha(theme.palette.background.default, 0.5),
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Clock size={16} color={theme.palette.text.secondary} />
                      <Typography variant="caption" color="text.secondary">
                        {article.readTime}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Updated {article.lastUpdated}
                    </Typography>
                  </Box>                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowRight size={16} />}
                    onClick={() => navigate(`/articles/${article.id}`)}
                    sx={{
                      borderColor: getUrgencyColor(article.urgency, theme),
                      color: getUrgencyColor(article.urgency, theme),
                      fontWeight: 600,
                      '&:hover': {
                        background: getUrgencyColor(article.urgency, theme),
                        color: 'white',
                      },
                    }}
                  >
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Show "View All" button only if there are more than 3 articles */}
      {apiResponse && apiResponse.totalCount > 3 && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowRight />}
            onClick={() => navigate('/articles/health-wellness')}
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
            View All Health Articles
          </Button>
        </Box>
      )}
    </Box>
  );
};
