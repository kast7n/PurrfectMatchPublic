import { Box, Container, Typography, Grid, Card, CardContent, Button, useTheme, alpha, Chip, IconButton, Breadcrumbs, Link, Theme, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Activity, Clock, Bookmark, Share2, ArrowLeft, Home } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFetchAllHealthArticlesQuery } from './articlesApi';
import { stripAndTruncateHtml } from '../../shared/utils/htmlUtils';

// All health & wellness articles data - now using API

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

const HealthWellnessPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: articlesResponse, isLoading, error } = useFetchAllHealthArticlesQuery({ pageNumber: 1, pageSize: 20 });
  const articles = articlesResponse?.items || [];

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
            <Typography color="text.primary">Health & Wellness</Typography>
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
              Expert health advice and wellness tips to keep your pets happy and healthy
            </Typography>
          </Box>
        </motion.div>        {/* Articles Grid */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Error loading health articles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try again later
            </Typography>
          </Box>
        ) : articles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Activity size={64} color={theme.palette.text.secondary} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No health articles available
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>          {articles.map((article, index) => (
            <Grid item xs={12} md={6} lg={4} key={article.postId}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >                <Card
                  onClick={() => navigate(`/articles/${article.postId}`)}
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
                    cursor: 'pointer',
                    position: 'relative',                    '&:hover': {
                      borderColor: getUrgencyColor('medium', theme),
                      boxShadow: `0 8px 32px ${alpha(getUrgencyColor('medium', theme), 0.2)}`,
                    },
                  }}
                >{/* Urgency indicator */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: getUrgencyColor('medium', theme),
                    }}
                  />

                  <Box
                    sx={{
                      height: 200,
                      background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.8)})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <Activity size={48} color="white" />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                      }}
                    >                        <IconButton
                        size="small"
                        sx={{
                          background: alpha(theme.palette.background.paper, 0.9),
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <Bookmark size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          background: alpha(theme.palette.background.paper, 0.9),
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <Share2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>                      <Chip
                        label={article.postType || 'Health'}
                        size="small"
                        sx={{
                          background: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        label="medium"
                        size="small"
                        sx={{
                          background: getUrgencyColor('medium', theme),
                          color: 'white',
                          fontWeight: 600,
                          textTransform: 'capitalize',
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
                    </Typography>                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 3,
                        lineHeight: 1.6,
                      }}
                    >
                      {stripAndTruncateHtml(article.content, 120)}
                    </Typography>                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 'auto',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Clock size={16} color={theme.palette.text.secondary} />                          <Typography variant="caption" color="text.secondary">
                            10 min
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Updated recently
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/articles/${article.postId}`);
                      }}
                      sx={{
                        mt: 2,
                        borderColor: getUrgencyColor('medium', theme),
                        color: getUrgencyColor('medium', theme),
                        fontWeight: 600,
                        '&:hover': {
                          background: getUrgencyColor('medium', theme),
                          color: 'white',
                        },
                      }}
                    >
                      Read Article
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

export default HealthWellnessPage;
