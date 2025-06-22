import { Box, Container, Typography, Grid, Card, CardContent, Button, useTheme, alpha, Chip, Breadcrumbs, Link, Theme, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Heart, Clock, Eye, ArrowLeft, Home } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFetchAllCareGuideArticlesQuery } from './articlesApi';
import { stripAndTruncateHtml } from '../../shared/utils/htmlUtils';

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

const CareGuidesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: guidesResponse, isLoading, error } = useFetchAllCareGuideArticlesQuery({ pageNumber: 1, pageSize: 20 });
  const guides = guidesResponse?.items || [];

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
            <Typography color="text.primary">Care Guides</Typography>
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
              Comprehensive guides to help you provide the best care for your beloved pets
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
              Error loading care guides
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try again later
            </Typography>
          </Box>
        ) : guides.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Heart size={64} color={theme.palette.text.secondary} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No care guides available
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>            {guides.map((guide, index) => (
              <Grid item xs={12} md={6} lg={4} key={guide.postId}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >                <Card
                  onClick={() => navigate(`/articles/${guide.postId}`)}
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
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                  }}
                >
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
                    <Heart size={48} color="white" />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                        flexDirection: 'column',
                      }}
                    >                      <Chip
                        label="Beginner"
                        size="small"
                        sx={{
                          background: getDifficultyColor('Beginner', theme),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>                      <Chip
                        label={guide.postType || 'Care Guide'}
                        size="small"
                        sx={{
                          background: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
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
                    </Typography>                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 3,
                        lineHeight: 1.6,
                      }}
                    >
                      {stripAndTruncateHtml(guide.content, 120)}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Eye size={16} color={theme.palette.text.secondary} />
                          <Typography variant="caption" color="text.secondary">
                            0 views
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/articles/${guide.postId}`);
                      }}
                      sx={{
                        mt: 2,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        '&:hover': {
                          background: theme.palette.primary.main,
                          color: 'white',
                        },
                      }}
                    >
                      Read Guide
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

export default CareGuidesPage;
