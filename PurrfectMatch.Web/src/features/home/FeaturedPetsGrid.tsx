import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Skeleton,
  useTheme,
  styled,
  Grid,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { motion } from 'framer-motion';
import { Pet, PetFilterDto } from '../../app/models/pet';
import { useFetchFilteredPetsQuery } from '../pet/petApi';
import PetCard from '../pet/PetCard';

// Styled components for the featured pets section
const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(2),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main,
  },
}));

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function FeaturedPetsGrid() {
  const [pets, setPets] = useState<Pet[] | undefined>();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const filter: PetFilterDto = { pageSize: 3, pageNumber: 1 };
  const { data, isLoading: petsLoading } = useFetchFilteredPetsQuery(filter);
  useEffect(() => {
    if (data) {
      setPets(data.items);
    }
    setLoading(petsLoading);
  }, [data, petsLoading]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <SectionTitle variant="h2">Featured Pets</SectionTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            These adorable companions are looking for their forever homes
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          endIcon={<PetsIcon />}
          href="/pets"
          sx={{
            borderRadius: 16,
            px: 2,
            fontWeight: 600,
            borderWidth: isDarkMode ? 1 : 2,
            '&:hover': {
              borderWidth: isDarkMode ? 1 : 2,
            },
          }}
        >
          View All Pets
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={240} />
                <CardContent>
                  <Skeleton variant="text" height={32} width="60%" />
                  <Skeleton variant="text" height={24} width="40%" />
                  <Skeleton variant="text" height={80} />
                  <Skeleton
                    variant="rectangular"
                    height={36}
                    width="100%"
                    sx={{ mt: 2, borderRadius: 20 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (        <Grid container spacing={3}>
          {pets?.map((pet, index) => (
            <Grid item xs={12} sm={6} md={4} key={pet.petId || `pet-${index}`}>
              <motion.div
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={cardVariants}
                style={{ height: '100%' }}
              >
                <PetCard
                  pet={pet}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 5,
          pt: 3,
          borderTop: isDarkMode
            ? '1px dashed rgba(255,255,255,0.1)'
            : '1px dashed rgba(0,0,0,0.1)',
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="large"
          href="/adoption-guide"
          sx={{ borderRadius: 20, px: 3, fontWeight: 600 }}
        >
          Learn About Our Adoption Process
        </Button>
      </Box>
    </Box>
  );
}