import { Box, Typography, Grid, Card, CardContent, Button, useTheme, alpha, Avatar, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, ArrowRight } from 'lucide-react';

const adoptionStories = [
  {
    id: 1,
    title: "Bella's Second Chance",
    excerpt: "From shelter to beloved family member - how Bella found her forever home and transformed her new family's life.",
    petName: "Bella",
    petType: "Golden Retriever",
    family: "The Johnson Family",
    location: "Seattle, WA",
    adoptionDate: "6 months ago",
    rating: 5,
    image: "/images/stories/bella.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Max and the Kids",
    excerpt: "A heartwarming story of how rescue cat Max became the perfect companion for two young children.",
    petName: "Max",
    petType: "Tabby Cat",
    family: "The Rodriguez Family",
    location: "Austin, TX",
    adoptionDate: "1 year ago",
    rating: 5,
    image: "/images/stories/max.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Charlie's New Adventure",
    excerpt: "Senior dog Charlie proves that older pets make wonderful companions in this touching adoption story.",
    petName: "Charlie",
    petType: "Beagle Mix",
    family: "Margaret & Tom",
    location: "Portland, OR",
    adoptionDate: "8 months ago",
    rating: 5,
    image: "/images/stories/charlie.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Luna and the Big Move",
    excerpt: "How Luna helped her new family adjust to moving across the country and made their house a home.",
    petName: "Luna",
    petType: "Border Collie",
    family: "The Kim Family",
    location: "Denver, CO",
    adoptionDate: "4 months ago",
    rating: 5,
    image: "/images/stories/luna.jpg",
    featured: true,
  },
];

export const AdoptionStoriesSection = () => {
  const theme = useTheme();

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
            <Heart 
              style={{ 
                verticalAlign: 'middle', 
                marginRight: 16,
                color: theme.palette.error.main 
              }} 
              size={40} 
            />
            Adoption Success Stories
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Real stories from families who found their perfect companions through adoption
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {adoptionStories.map((story, index) => (
          <Grid item xs={12} md={story.featured ? 6 : 6} lg={story.featured ? 6 : 6} key={story.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                  backdropFilter: 'blur(10px)',
                  border: story.featured 
                    ? `2px solid ${theme.palette.error.main}`
                    : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    borderColor: theme.palette.error.main,
                    boxShadow: `0 12px 40px ${alpha(theme.palette.error.main, 0.2)}`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Featured Badge */}
                {story.featured && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.secondary.main})`,
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderBottomRightRadius: 12,
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Heart size={16} />
                    <Typography variant="caption" fontWeight={600}>
                      Featured Story
                    </Typography>
                  </Box>
                )}

                {/* Pet Image Section */}
                <Box
                  sx={{
                    height: story.featured ? 200 : 160,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.8)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Heart size={48} color="white" />
                  
                  {/* Pet Avatar */}
                  <Avatar
                    sx={{
                      position: 'absolute',
                      bottom: -20,
                      left: 24,
                      width: 60,
                      height: 60,
                      border: `3px solid ${theme.palette.background.paper}`,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  >
                    <Heart size={24} />
                  </Avatar>
                </Box>

                <CardContent sx={{ p: 3, pt: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Pet Info */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 0.5,
                      }}
                    >
                      {story.petName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 1,
                      }}
                    >
                      {story.petType}
                    </Typography>
                    <Rating value={story.rating} readOnly size="small" />
                  </Box>

                  <Typography
                    variant={story.featured ? "h5" : "h6"}
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                      lineHeight: 1.3,
                    }}
                  >
                    {story.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 3,
                      lineHeight: 1.6,
                      flexGrow: 1,
                    }}
                  >
                    {story.excerpt}
                  </Typography>

                  {/* Family Info */}
                  <Box
                    sx={{
                      p: 2,
                      background: alpha(theme.palette.error.main, 0.05),
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      {story.family}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MapPin size={14} color={theme.palette.text.secondary} />
                        <Typography variant="caption" color="text.secondary">
                          {story.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Calendar size={14} color={theme.palette.text.secondary} />
                        <Typography variant="caption" color="text.secondary">
                          {story.adoptionDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowRight size={16} />}
                    sx={{
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.main,
                      fontWeight: 600,
                      '&:hover': {
                        background: theme.palette.error.main,
                        color: 'white',
                      },
                    }}
                  >
                    Read Full Story
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Box
          sx={{
            mt: 6,
            p: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            textAlign: 'center',
          }}
        >
          <Heart 
            size={48} 
            color={theme.palette.error.main} 
            style={{ marginBottom: 16 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Share Your Adoption Story
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Inspire others by sharing your pet adoption journey and help more animals find loving homes
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.secondary.main})`,
              fontWeight: 600,
              px: 4,
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(theme.palette.error.main, 0.4)}`,
              },
            }}
          >
            Share Your Story
          </Button>
        </Box>
      </motion.div>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button
          variant="outlined"
          size="large"
          endIcon={<ArrowRight />}
          sx={{
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main,
            fontWeight: 600,
            px: 4,
            py: 1.5,
            '&:hover': {
              background: theme.palette.error.main,
              color: 'white',
            },
          }}
        >
          Read More Success Stories
        </Button>
      </Box>
    </Box>
  );
};
