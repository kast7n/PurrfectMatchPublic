import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useUserInfoQuery } from '../../account/accountApi';
import { stripHtmlTags } from '../../../shared/utils/textUtils';
import {
  articlesApi,
  type Article,
  type CreateArticleDto,
  type UpdateArticleDto,
} from '../../articles/articlesApi';

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
  { value: 'Education', label: 'Educational' },  { value: 'Announcement', label: 'Announcement' },
];

const ArticleManagementPage: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Check if user is admin
  const { data: user } = useUserInfoQuery();
  const isAdmin = user?.roles?.includes('Admin') || false;
  // API Hooks
  const { data: articles, isLoading, error } = articlesApi.useFetchFilteredArticlesQuery({
    pageNumber: 1,
    pageSize: 50,
    sortBy: 'createdAt',
    sortDescending: true,
  });

  const { data: availableTags = [] } = articlesApi.useFetchAllArticleTagsQuery();

  const [createArticle, { isLoading: isCreating }] = articlesApi.useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = articlesApi.useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeleting }] = articlesApi.useDeleteArticleMutation();
  // Form handling
  const { control, handleSubmit, reset, setValue } = useForm<ArticleFormData>({
    defaultValues: {
      title: '',
      content: '',
      postType: 'Article',
      tagIds: [],
    },
  });
  const handleCreateArticle = async (data: ArticleFormData) => {
    try {
      const createDto: CreateArticleDto = {
        title: data.title,
        content: data.content,
        postType: data.postType,
        tagIds: data.tagIds,
      };

      await createArticle(createDto).unwrap();
      closeCreateDialog();
    } catch (error) {
      console.error('Failed to create article:', error);
    }
  };
  const handleEditArticle = async (data: ArticleFormData) => {
    if (!selectedArticle) return;

    try {
      const updateDto: UpdateArticleDto = {
        title: data.title,
        content: data.content,
        postType: data.postType,
        tagIds: data.tagIds,
      };

      await updateArticle({
        id: selectedArticle.postId,
        updatedArticle: updateDto,
      }).unwrap();

      closeEditDialog();
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;

    try {
      await deleteArticle(selectedArticle.postId).unwrap();
      setDeleteDialogOpen(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };
  const openEditDialog = (article: Article) => {
    setSelectedArticle(article);
    setValue('title', article.title);
    setValue('content', article.content);
    setValue('postType', article.postType);
    setValue('tagIds', article.tags.map(tag => tag.tagId));
    setEditDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
    reset(); // Reset form to default values
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedArticle(null);
    reset(); // Reset form to default values
  };

  const openDeleteDialog = (article: Article) => {
    setSelectedArticle(article);
    setDeleteDialogOpen(true);
  };
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Access denied. Only administrators can manage articles.
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load articles. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Article Management
        </Typography>        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            reset(); // Reset form before opening create dialog
            setCreateDialogOpen(true);
          }}
          size="large"
        >
          Create Article
        </Button>
      </Box>

      {/* Articles Grid */}
      <Grid container spacing={3}>
        {articles?.items?.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.postId}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom noWrap>
                  {article.title}
                </Typography>
                
                <Chip 
                  label={article.postType} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                  <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2
                  }}
                >
                  {stripHtmlTags(article.content)}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(article.createdAt).toLocaleDateString()}
                </Typography>

                {article.tags.length > 0 && (
                  <Box mt={1}>
                    {article.tags.map((tag) => (
                      <Chip
                        key={tag.tagId}
                        label={tag.tagName}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>

              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => openEditDialog(article)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => openDeleteDialog(article)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>      {/* Create Article Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={closeCreateDialog}
        maxWidth="md" 
        fullWidth
      >        <form onSubmit={handleSubmit(handleCreateArticle)}>
          <DialogTitle>Create New Article</DialogTitle>
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
          </DialogContent><DialogActions>
            <Button onClick={closeCreateDialog}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isCreating}
            >
              {isCreating ? <CircularProgress size={20} /> : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>      {/* Edit Article Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={closeEditDialog}
        maxWidth="md" 
        fullWidth
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
              </Grid>              <Grid item xs={12}>
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
          </DialogContent><DialogActions>
            <Button onClick={closeEditDialog}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isUpdating}
            >
              {isUpdating ? <CircularProgress size={20} /> : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Article</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedArticle?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
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
  );
};

export default ArticleManagementPage;