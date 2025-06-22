import { Box, Typography, Grid, Card, CardContent, Button, useTheme, alpha, Chip, Avatar, Theme } from '@mui/material';
import { motion } from 'framer-motion';
import { Newspaper, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetchAllNewsArticlesQuery, Article } from '../articlesApi';
import { stripAndTruncateHtml } from '../../../shared/utils/htmlUtils';
import { calculateGridColumns } from '../../../shared/utils/gridUtils';

const getCategoryColor = (category: string, theme: Theme) => {
  switch (category) {
    case 'Legal Updates':
      return theme.palette.info.main;
    case 'Medical Research':
      return theme.palette.success.main;
    case 'Community News':
      return theme.palette.secondary.main;
    case 'Technology':
      return theme.palette.primary.main;
    case 'Research':
      return theme.palette.warning.main;
    case 'Local News':
      return theme.palette.error.main;
    default:
      return theme.palette.text.secondary;
  }
};

export const NewsUpdatesSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
    // Fetch news articles from API with pagination info
  const { data: apiResponse, isLoading } = useFetchAllNewsArticlesQuery({ pageNumber: 1, pageSize: 3 });
  const apiArticles = apiResponse?.items;
    // Map API articles to expected format with fallback data
  const mapApiToLocalFormat = (apiArticle: Article) => ({
    id: apiArticle.postId,
    title: apiArticle.title,
    excerpt: stripAndTruncateHtml(apiArticle.content, 150) || 'No content available',
    category: ['Legal Updates', 'Medical Research', 'Community News', 'Technology', 'Research', 'Local News'][Math.floor(Math.random() * 6)],
    date: Math.floor(Math.random() * 7 + 1) + " days ago", // Random date
    isBreaking: false, // Remove breaking news functionality
    source: apiArticle.shelterName || 'Pet News Network',
    readTime: "5 min read", // Default read time
  });
    // Use API data if available, show empty state if no data
  const displayedNews = apiArticles?.length 
    ? apiArticles.map(mapApiToLocalFormat).slice(0, 3)
    : [];
    // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading news updates...
        </Typography>
      </Box>
    );
  }

  // Show empty state if no news
  if (!apiArticles?.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No news updates available at the moment.
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
            <Newspaper 
              style={{ 
                verticalAlign: 'middle', 
                marginRight: 16,
                color: theme.palette.primary.main 
              }} 
              size={40} 
            />
            News & Updates
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Stay informed with the latest news, research, and developments in the pet care world
          </Typography>        </Box>
      </motion.div>

      <Grid container spacing={3} justifyContent={displayedNews.length === 1 ? "center" : "flex-start"}>
        {displayedNews.map((news, index) => (
          <Grid item xs={12} md={displayedNews.length === 1 ? 4 : 6} lg={calculateGridColumns(displayedNews.length)} key={news.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
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
                  border: news.isBreaking 
                    ? `2px solid ${theme.palette.error.main}`
                    : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    borderColor: getCategoryColor(news.category, theme),
                    boxShadow: `0 8px 32px ${alpha(getCategoryColor(news.category, theme), 0.2)}`,
                  },
                }}
              >

                {/* Header with Icon */}
                <Box
                  sx={{
                    height: 100,
                    background: `linear-gradient(135deg, ${alpha(getCategoryColor(news.category, theme), 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: `linear-gradient(45deg, ${getCategoryColor(news.category, theme)}, ${theme.palette.primary.main})`,
                    }}
                  >
                    <Newspaper size={28} />
                  </Avatar>
                </Box>

                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Category and Source */}
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Chip
                      label={news.category}
                      size="small"
                      sx={{
                        background: alpha(getCategoryColor(news.category, theme), 0.1),
                        color: getCategoryColor(news.category, theme),
                        fontWeight: 500,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {news.source}
                    </Typography>
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
                    {news.title}
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
                    {news.excerpt}
                  </Typography>

                  {/* Meta Info */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 3,
                      pt: 2,
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {news.date}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Clock size={14} color={theme.palette.text.secondary} />
                      <Typography variant="caption" color="text.secondary">
                        {news.readTime}
                      </Typography>
                    </Box>
                  </Box>                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowRight size={16} />}
                    onClick={() => navigate(`/articles/${news.id}`)}
                    sx={{
                      borderColor: getCategoryColor(news.category, theme),
                      color: getCategoryColor(news.category, theme),
                      fontWeight: 600,
                      '&:hover': {
                        background: getCategoryColor(news.category, theme),
                        color: 'white',
                      },
                    }}
                  >
                    Read Full Article
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>        ))}
      </Grid>      {/* Show "View All" button only if there are more than 3 articles */}
      {apiResponse && apiResponse.totalCount > 3 && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowRight />}
            onClick={() => navigate('/articles/news')}
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
            View All News & Updates
          </Button>
        </Box>
      )}
    </Box>
  );
};
