import { Box, Container, Typography, Grid, Card, CardContent, Button, useTheme, alpha, Chip, Breadcrumbs, Link, Theme, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Newspaper, Clock, ArrowLeft, Home } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFetchAllNewsArticlesQuery } from './articlesApi';
import { stripAndTruncateHtml } from '../../shared/utils/htmlUtils';

// All news updates data - now using API

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
      return theme.palette.error.main;    case 'Industry News':
      return theme.palette.primary.main;
    case 'Public Safety':
      return theme.palette.warning.main;
    case 'Healthcare':
      return theme.palette.success.main;
    default:
      return theme.palette.text.secondary;
  }
};

const NewsUpdatesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();  const { data: newsResponse, isLoading, error } = useFetchAllNewsArticlesQuery({ pageNumber: 1, pageSize: 20 });
  const newsUpdates = newsResponse?.items || [];

  return (
    <Box sx={{ 
      background: theme.palette.mode === 'dark' 
        ? `linear-gradient(to bottom, #111827, #0d1424)`
        : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs sx={{ mb: 4 }}>
            <Link 
              component={RouterLink} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.primary.main }
              }}
            >
              <Home size={16} style={{ marginRight: 4 }} />
              Home
            </Link>
            <Link 
              component={RouterLink} 
              to="/articles" 
              sx={{ 
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.primary.main }
              }}
            >
              Articles
            </Link>
            <Typography color="text.primary">News & Updates</Typography>
          </Breadcrumbs>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Button
              startIcon={<ArrowLeft />}
              onClick={() => navigate('/articles')}
              sx={{ 
                mb: 3,
                color: theme.palette.primary.main,
                '&:hover': { background: alpha(theme.palette.primary.main, 0.1) }
              }}
            >
              Back to Articles
            </Button>
            
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
            </Typography>
          </Box>
        </motion.div>

        {/* News Grid */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Error loading news updates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try again later
            </Typography>
          </Box>
        ) : newsUpdates.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Newspaper size={64} color={theme.palette.text.secondary} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No news updates available
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>          {newsUpdates.map((news, index) => (
            <Grid item xs={12} md={6} lg={4} key={news.postId}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >                <Card
                  onClick={() => navigate(`/articles/${news.postId}`)}
                  sx={{
                    height: '100%',
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.8)
                      : theme.palette.background.paper,
                    backdropFilter: 'blur(10px)',                    border: news.title?.toLowerCase().includes('breaking') 
                      ? `2px solid ${theme.palette.error.main}`
                      : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    cursor: 'pointer',                    '&:hover': {
                      borderColor: getCategoryColor(news.postType || 'News', theme),
                      boxShadow: `0 8px 32px ${alpha(getCategoryColor(news.postType || 'News', theme), 0.2)}`,
                    },
                  }}
                >{news.title?.toLowerCase().includes('breaking') && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
                        zIndex: 1,
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      height: 200,
                      background: `linear-gradient(45deg, ${alpha(getCategoryColor(news.postType || 'News', theme), 0.8)}, ${alpha(theme.palette.primary.main, 0.8)})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >                    <Newspaper size={48} color="white" />
                    {news.title?.toLowerCase().includes('breaking') && (
                      <Chip
                        label="BREAKING"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: theme.palette.error.main,
                          color: 'white',
                          fontWeight: 600,
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.7 },
                            '100%': { opacity: 1 },
                          },
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>                      <Chip
                        label={news.postType || 'News'}
                        size="small"
                        sx={{
                          background: alpha(getCategoryColor(news.postType || 'News', theme), 0.1),
                          color: getCategoryColor(news.postType || 'News', theme),
                          fontWeight: 500,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Recently
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
                    </Typography>                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 3,
                        lineHeight: 1.6,
                      }}
                    >
                      {stripAndTruncateHtml(news.content, 120)}
                    </Typography>                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 'auto',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>                        <Typography variant="caption" color="text.secondary">
                          PurrfectMatch
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Clock size={14} color={theme.palette.text.secondary} />
                          <Typography variant="caption" color="text.secondary">
                            5 min
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/articles/${news.postId}`);
                      }}
                      sx={{
                        mt: 2,
                        borderColor: getCategoryColor(news.postType || 'News', theme),
                        color: getCategoryColor(news.postType || 'News', theme),
                        fontWeight: 600,
                        '&:hover': {
                          background: getCategoryColor(news.postType || 'News', theme),
                          color: 'white',
                        },
                      }}
                    >
                      Read Full Article
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>          ))}
        </Grid>
        )}
      </Container>
    </Box>
  );
};

export default NewsUpdatesPage;
