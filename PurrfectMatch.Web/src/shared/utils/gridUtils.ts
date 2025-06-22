/**
 * Calculate the appropriate grid column width based on the number of items
 * to ensure items take up all available space
 */
export const calculateGridColumns = (itemCount: number) => {
  if (itemCount === 0) return 12; // Default full width
  if (itemCount === 1) return 4;  // Single item takes normal width (1/3) and stays centered
  if (itemCount === 2) return 6;  // Two items each take half width
  if (itemCount >= 3) return 4;   // Three or more items each take third width
  return 4; // Default fallback
};

/**
 * Calculate the appropriate grid column width for featured articles layout
 */
export const calculateFeaturedGridColumns = (itemCount: number, isFeatured: boolean = false) => {
  if (itemCount === 0) return 12;
  if (itemCount === 1) return 6;  // Single item takes normal width (1/2) and stays centered
  if (itemCount === 2) return 6;  // Two items each take half width
  if (itemCount >= 3) {
    // For 3+ items, featured takes half, others take quarter
    return isFeatured ? 6 : 3;
  }
  return 4; // Default fallback
};
