import React from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button,
  Pagination,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ShelterCard from '../ShelterCard';
import type { Shelter } from '../../../app/models/shelter';

interface ShelterResultsProps {
  shelters: Shelter[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isMobile?: boolean;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onClearFilters: () => void;
}

const ShelterResults: React.FC<ShelterResultsProps> = ({
  shelters,
  totalCount,
  totalPages,
  currentPage,
  isLoading,
  isMobile = false,
  onPageChange,
  onClearFilters,
}) => {
  // Loading State
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // No Results
  if (shelters.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" gutterBottom>
          No shelters found
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Try adjusting your filters to see more results
        </Typography>
        <Button onClick={onClearFilters} variant="outlined" sx={{ mt: 2 }}>
          Clear Filters
        </Button>
      </Box>
    );
  }

  return (
    <>
      {/* Results Header */}
      {!isMobile && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {totalCount} Shelters Found
          </Typography>
        </Box>
      )}      {/* Results Grid */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {shelters.map((shelter: Shelter, index: number) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              lg={4} 
              key={shelter.shelterId} 
              sx={{ 
                display: 'flex',
                '& > div': {
                  width: '100%',
                  height: '100%',
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{ 
                  width: '100%', 
                  display: 'flex',
                  minHeight: '520px', // Ensure minimum height for consistency
                }}
              >
                <ShelterCard shelter={shelter} />
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  );
};

export default ShelterResults;
