import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  useTheme, 
  alpha, 
  Chip, 
  Breadcrumbs, 
  Link, 
  CircularProgress,
  Avatar,
  Divider,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Grid,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Clock, User, Calendar, Tag, BookOpen, Heart, Share2, Bookmark, Edit, Trash2 } from 'lucide-react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFetchArticleByIdQuery, useUpdateArticleMutation, useFetchAllArticleTagsQuery, useDeleteArticleMutation, type UpdateArticleDto } from './articlesApi';
import { sanitizeHtml } from '../../shared/utils/htmlUtils';
import { useUserInfoQuery } from '../account/accountApi';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface ArticleFormData {
  title: string;
  content: string;
  postType: string;
  tagIds: number[];
}

const postTypes = [
  { value: 'Article', label: 'Article' },
  { value: 'News', label: 'News' },
  { value: 'Guide', label: 'Care Guide' },
  { value: 'Health', label: 'Health & Wellness' },
  { value: 'Education', label: 'Educational' },
  { value: 'Announcement', label: 'Announcement' },
];

const ArticleDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // API hooks
  const { data: article, isLoading, error } = useFetchArticleByIdQuery(
    id ? parseInt(id) : 0,
    { skip: !id }
  );
  
  const { data: currentUser } = useUserInfoQuery();
  const { data: availableTags = [] } = useFetchAllArticleTagsQuery();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

  // Form handling
  const { control, handleSubmit, reset, setValue } = useForm<ArticleFormData>({
    defaultValues: {
      title: '',
      content: '',
      postType: 'Article',
      tagIds: [],
    },  });

  // Check if current user can edit this article
  const canEditArticle = currentUser && article && (
    currentUser.id === article.userId || 
    currentUser.roles?.includes('Admin')
  );

  // Helper functions
  const openEditDialog = () => {
    if (!article) return;
    setValue('title', article.title);
    setValue('content', article.content);
    setValue('postType', article.postType);
    setValue('tagIds', article.tags.map(tag => tag.tagId));
    setEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setEditDialogOpen(false);
    reset();
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteArticle = async () => {
    if (!article) return;

    try {
      await deleteArticle(article.postId).unwrap();
      toast.success('Article deleted successfully!');
      closeDeleteDialog();
      // Navigate back to articles list after successful deletion
      navigate('/articles');
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error('Failed to delete article. Please try again.');
    }
  };

  const handleEditArticle = async (data: ArticleFormData) => {
    if (!article) return;

    try {
      const updateDto: UpdateArticleDto = {
        title: data.title,
        content: data.content,
        postType: data.postType,
        tagIds: data.tagIds,
      };

      console.log('Updating article with data:', updateDto);
      
      await updateArticle({
        id: article.postId,
        updatedArticle: updateDto,
      }).unwrap();

      console.log('Article updated successfully');
      toast.success('Article updated successfully!');
      closeEditDialog();
    } catch (error) {
      console.error('Failed to update article:', error);
      toast.error('Failed to update article. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(to bottom, #111827, #0d1424)`
          : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
        minHeight: '100vh',
        py: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Box sx={{ 
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(to bottom, #111827, #0d1424)`
          : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
        minHeight: '100vh',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" color="error" gutterBottom>
              Article Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The article you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              startIcon={<ArrowLeft />}
              onClick={() => navigate('/articles')}
              variant="contained"
            >
              Back to Articles
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: theme.palette.mode === 'dark' 
        ? `linear-gradient(to bottom, #111827, #0d1424)`
        : `linear-gradient(to bottom, #FFF9F9, #FFF1F1)`,
      minHeight: '100vh',
      py: 4
    }}>      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs 
            sx={{ 
              mb: 4,
              '& .MuiBreadcrumbs-separator': {
                mx: { xs: 0.5, sm: 1 }
              },
              '& .MuiBreadcrumbs-li': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
          >            <Link 
              component={RouterLink} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.primary.main },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              <Home size={isMobile ? 14 : 16} style={{ marginRight: 4 }} />
              Home
            </Link>
            <Link 
              component={RouterLink} 
              to="/articles" 
              sx={{ 
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.primary.main },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Articles
            </Link>
            <Typography 
              color="text.primary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                wordBreak: 'break-word'
              }}
            >
              {article.title.length > 30 && isMobile 
                ? `${article.title.substring(0, 30)}...` 
                : article.title}
            </Typography>
          </Breadcrumbs>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >          <Button
            startIcon={<ArrowLeft size={isMobile ? 16 : 20} />}
            onClick={() => navigate(-1)}
            sx={{ 
              mb: 3,
              color: theme.palette.primary.main,
              '&:hover': { background: alpha(theme.palette.primary.main, 0.1) },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Back
          </Button>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            sx={{
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : theme.palette.background.paper,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >            {/* Article Header */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 6 } }}>
              {/* Article Type & Tags */}
              <Box sx={{ 
                mb: 3, 
                display: 'flex', 
                gap: { xs: 0.5, sm: 1 }, 
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <Chip
                  label={article.postType || 'Article'}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    background: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                />
                {article.tags.map((tag) => (
                  <Chip
                    key={tag.tagId}
                    label={tag.tagName}
                    size={isMobile ? "small" : "medium"}
                    variant="outlined"
                    icon={<Tag size={isMobile ? 12 : 14} />}
                    sx={{
                      borderColor: alpha(theme.palette.secondary.main, 0.3),
                      color: theme.palette.secondary.main,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                ))}
              </Box>              {/* Article Title */}
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                  fontSize: { 
                    xs: '1.75rem', 
                    sm: '2.125rem', 
                    md: '2.5rem' 
                  },
                  wordBreak: 'break-word',
                  hyphens: 'auto'
                }}
              >
                {article.title}
              </Typography>              {/* Article Meta */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                justifyContent: 'space-between',
                gap: { xs: 3, sm: 2 },
                mb: 4 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 2, sm: 3 }, 
                  flexWrap: 'wrap',
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      }}
                    >
                      <User size={isMobile ? 16 : 20} />
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color="text.primary"
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        {article.userName || 'Admin'}
                      </Typography>
                      {article.shelterName && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          {article.shelterName}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={isMobile ? 14 : 16} color={theme.palette.text.secondary} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {formatDate(article.createdAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Clock size={isMobile ? 14 : 16} color={theme.palette.text.secondary} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {getReadingTime(article.content)}
                    </Typography>
                  </Box>
                </Box>                {/* Action Buttons */}
                <Stack 
                  direction={isMobile ? "column" : "row"} 
                  spacing={1}
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    '& .MuiButton-root': {
                      minWidth: { xs: '100%', sm: 'auto' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 2, sm: 1.5 },
                      py: { xs: 1, sm: 0.5 }
                    }
                  }}
                >
                  {canEditArticle && (
                    <Button
                      variant="outlined"
                      size={isMobile ? "medium" : "small"}
                      startIcon={<Edit size={isMobile ? 14 : 16} />}
                      onClick={openEditDialog}
                      sx={{
                        borderColor: alpha(theme.palette.success.main, 0.3),
                        color: theme.palette.success.main,
                        '&:hover': {
                          background: alpha(theme.palette.success.main, 0.1),
                          borderColor: theme.palette.success.main,
                        },
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {canEditArticle && (
                    <Button
                      variant="outlined"
                      size={isMobile ? "medium" : "small"}
                      startIcon={<Trash2 size={isMobile ? 14 : 16} />}
                      onClick={openDeleteDialog}
                      sx={{
                        borderColor: alpha(theme.palette.error.main, 0.3),
                        color: theme.palette.error.main,
                        '&:hover': {
                          background: alpha(theme.palette.error.main, 0.1),
                          borderColor: theme.palette.error.main,
                        },
                      }}
                    >
                      Delete
                    </Button>
                  )}
                  {!isMobile && (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Bookmark size={16} />}
                        sx={{
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          color: theme.palette.primary.main,
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.1),
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Share2 size={16} />}
                        sx={{
                          borderColor: alpha(theme.palette.secondary.main, 0.3),
                          color: theme.palette.secondary.main,
                          '&:hover': {
                            background: alpha(theme.palette.secondary.main, 0.1),
                            borderColor: theme.palette.secondary.main,
                          },
                        }}
                      >
                        Share
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Heart size={16} />}
                        sx={{
                          borderColor: alpha(theme.palette.error.main, 0.3),
                          color: theme.palette.error.main,
                          '&:hover': {
                            background: alpha(theme.palette.error.main, 0.1),
                            borderColor: theme.palette.error.main,
                          },
                        }}
                      >
                        Like
                      </Button>
                    </>
                  )}
                  {isMobile && (
                    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                      <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<Bookmark size={14} />}
                        sx={{
                          flex: 1,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          color: theme.palette.primary.main,
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.1),
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<Share2 size={14} />}
                        sx={{
                          flex: 1,
                          borderColor: alpha(theme.palette.secondary.main, 0.3),
                          color: theme.palette.secondary.main,
                          '&:hover': {
                            background: alpha(theme.palette.secondary.main, 0.1),
                            borderColor: theme.palette.secondary.main,
                          },
                        }}
                      >
                        Share
                      </Button>
                      <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<Heart size={14} />}
                        sx={{
                          flex: 1,
                          borderColor: alpha(theme.palette.error.main, 0.3),
                          color: theme.palette.error.main,
                          '&:hover': {
                            background: alpha(theme.palette.error.main, 0.1),
                            borderColor: theme.palette.error.main,
                          },
                        }}
                      >
                        Like
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Box>

              <Divider sx={{ mb: 4 }} />              {/* Article Content */}
              <Box
                sx={{
                  '& p': {
                    marginBottom: { xs: 1.5, sm: 2 },
                    lineHeight: { xs: 1.6, sm: 1.8 },
                    fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                    color: theme.palette.text.primary,
                  },
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    marginTop: { xs: 2, sm: 3 },
                    marginBottom: { xs: 1.5, sm: 2 },
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    wordBreak: 'break-word',
                  },
                  '& h1': {
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  },
                  '& h2': {
                    fontSize: { xs: '1.5rem', sm: '1.65rem', md: '1.75rem' },
                  },
                  '& h3': {
                    fontSize: { xs: '1.25rem', sm: '1.4rem', md: '1.5rem' },
                  },
                  '& h4': {
                    fontSize: { xs: '1.125rem', sm: '1.2rem', md: '1.25rem' },
                  },
                  '& ul, & ol': {
                    marginBottom: { xs: 1.5, sm: 2 },
                    paddingLeft: { xs: 2, sm: 3 },
                  },
                  '& li': {
                    marginBottom: { xs: 0.5, sm: 1 },
                    lineHeight: { xs: 1.5, sm: 1.6 },
                    fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                  },
                  '& blockquote': {
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    paddingLeft: { xs: 1.5, sm: 2 },
                    marginLeft: 0,
                    marginRight: 0,
                    marginBottom: { xs: 1.5, sm: 2 },
                    fontStyle: 'italic',
                    background: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: '0 8px 8px 0',
                    padding: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    marginBottom: { xs: 1.5, sm: 2 },
                    display: 'block',
                    margin: '0 auto',
                  },
                  '& code': {
                    background: alpha(theme.palette.primary.main, 0.1),
                    padding: '2px 6px',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: { xs: '0.875rem', sm: '0.9rem' },
                    wordBreak: 'break-all',
                  },
                  '& pre': {
                    background: alpha(theme.palette.background.default, 0.8),
                    padding: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    overflow: 'auto',
                    marginBottom: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.875rem', sm: '0.9rem' },
                    '& code': {
                      background: 'transparent',
                      padding: 0,
                    },
                  },
                  '& table': {
                    width: '100%',
                    overflowX: 'auto',
                    display: { xs: 'block', sm: 'table' },
                    marginBottom: { xs: 1.5, sm: 2 },
                    '& th, & td': {
                      padding: { xs: '8px', sm: '12px' },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
              />              {/* Article Footer */}
              <Divider sx={{ mt: { xs: 4, sm: 6 }, mb: { xs: 3, sm: 4 } }} />
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' },
                justifyContent: 'space-between',
                gap: { xs: 3, sm: 2 },
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  Last updated: {formatDate(article.updatedAt)}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                    variant="contained"
                    startIcon={<BookOpen size={isMobile ? 16 : 18} />}
                    onClick={() => navigate('/articles')}
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      px: { xs: 2, sm: 3 },
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Read More Articles
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>        </motion.div>        {/* Edit Article Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={closeEditDialog}
          maxWidth="md" 
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              m: { xs: 0, sm: 2 },
              maxHeight: { xs: '100vh', sm: '90vh' }
            }
          }}
        >
          <form onSubmit={handleSubmit(handleEditArticle)}>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: 'Title is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Title"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="postType"
                    control={control}
                    rules={{ required: 'Post type is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        select
                        label="Post Type"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      >
                        {postTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="content"
                    control={control}
                    rules={{ required: 'Content is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Content"
                        multiline
                        rows={10}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="tagIds"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Tags</InputLabel>
                        <Select
                          {...field}
                          multiple
                          input={<OutlinedInput label="Tags" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {(selected as number[]).map((tagId) => {
                                const tag = availableTags.find(t => t.tagId === tagId);
                                return tag ? (
                                  <Chip key={tagId} label={tag.tagName} size="small" />
                                ) : null;
                              })}
                            </Box>
                          )}
                        >
                          {availableTags.map((tag) => (
                            <MenuItem key={tag.tagId} value={tag.tagId}>
                              <Checkbox checked={(field.value || []).includes(tag.tagId)} />
                              <ListItemText primary={tag.tagName} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={closeEditDialog}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={isUpdating}
              >
                {isUpdating ? <CircularProgress size={20} /> : 'Update'}
              </Button>
            </DialogActions>          </form>
        </Dialog>        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              m: { xs: 0, sm: 2 }
            }
          }}
        >
          <DialogTitle>Delete Article</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{article?.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>Cancel</Button>
            <Button 
              onClick={handleDeleteArticle} 
              color="error" 
              variant="contained"
              disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={20} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ArticleDetailPage;
