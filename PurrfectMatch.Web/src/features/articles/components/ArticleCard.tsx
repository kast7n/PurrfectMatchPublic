import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Article } from '../articlesApi';
import { truncateText, formatDate } from '../../../shared/utils/textUtils';

interface ArticleCardProps {
  article: Article;
  onReadMore?: (articleId: number) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onReadMore }) => {
  const getPostTypeColor = (postType: string) => {
    switch (postType.toLowerCase()) {
      case 'guide':
        return 'primary';
      case 'health':
        return 'error';
      case 'news':
        return 'warning';
      case 'education':
        return 'info';
      case 'announcement':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          elevation: 6,
          transform: 'translateY(-4px)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Post Type Chip */}
        <Box mb={2}>
          <Chip 
            label={article.postType} 
            size="small" 
            color={getPostTypeColor(article.postType)}
            variant="filled"
          />
        </Box>

        {/* Title */}
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.title}
        </Typography>        {/* Content Preview */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          {truncateText(article.content)}
        </Typography>

        {/* Tags */}
        {article.tags.length > 0 && (
          <Box mb={2}>
            {article.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag.tagId}
                label={tag.tagName}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
            {article.tags.length > 3 && (
              <Chip
                label={`+${article.tags.length - 3} more`}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            )}
          </Box>
        )}

        {/* Author and Date Info */}
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          mt="auto"
          pt={1}
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 14 }} />
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {article.userName || 'Admin'}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center">
            <TimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(article.createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
        <Button 
          size="small" 
          color="primary" 
          variant="outlined"
          fullWidth
          onClick={() => onReadMore?.(article.postId)}
          sx={{ 
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
};

export default ArticleCard;
