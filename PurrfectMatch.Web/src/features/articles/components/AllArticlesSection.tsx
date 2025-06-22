import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  InputAdornment,
  Container,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { articlesApi, type ArticleFilterDto } from '../articlesApi';
import ArticleCard from './ArticleCard';

const postTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'Article', label: 'Articles' },
  { value: 'News', label: 'News' },
  { value: 'Guide', label: 'Care Guides' },
  { value: 'Health', label: 'Health & Wellness' },
  { value: 'Education', label: 'Educational' },
  { value: 'Announcement', label: 'Announcements' },
];

const AllArticlesSection: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ArticleFilterDto>({
    pageNumber: 1,
    pageSize: 12,
    sortBy: 'createdAt',
    sortDescending: true,
  });

  const { data: articlesResponse, isLoading, error } = articlesApi.useFetchFilteredArticlesQuery(filter);

  const handleFilterChange = (field: keyof ArticleFilterDto, value: string | number) => {
    setFilter(prev => ({
      ...prev,
      [field]: value,
      pageNumber: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setFilter(prev => ({
      ...prev,
      pageNumber: page,
    }));
  };

  const handleReadMore = (articleId: number) => {
    navigate(`/articles/${articleId}`);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load articles. Please try again later.
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box>
        {/* Section Header */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            All Articles
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Explore our comprehensive collection of pet care articles, guides, and latest news
          </Typography>
        </Box>

        {/* Filters */}
        <Box 
          display="flex" 
          gap={2} 
          mb={4} 
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems="center"
        >
          <TextField
            placeholder="Search articles..."
            variant="outlined"
            size="small"
            value={filter.title || ''}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 250 }}
          />

          <TextField
            select
            label="Article Type"
            size="small"
            value={filter.postType || ''}
            onChange={(e) => handleFilterChange('postType', e.target.value)}
            sx={{ minWidth: 150 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterIcon color="action" />
                </InputAdornment>
              ),
            }}
          >
            {postTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Articles Grid */}
        {!isLoading && articlesResponse && (
          <>
            <Grid container spacing={3}>
              {articlesResponse.items.map((article) => (
                <Grid item xs={12} sm={6} md={4} key={article.postId}>
                  <ArticleCard 
                    article={article} 
                    onReadMore={handleReadMore}
                  />
                </Grid>
              ))}
            </Grid>

            {/* No Results */}
            {articlesResponse.items.length === 0 && (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No articles found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search criteria or filters
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {articlesResponse.totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={6}>
                <Pagination
                  count={articlesResponse.totalPages}
                  page={filter.pageNumber}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* Results Summary */}
            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="text.secondary">
                Showing {articlesResponse.items.length} of {articlesResponse.totalCount} articles
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default AllArticlesSection;
