import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

export const PawDivider = () => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
          opacity: 0.6,
        }}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M20 35C20 30 25 25 30 25C35 25 40 30 40 35C40 40 35 45 30 45C25 45 20 40 20 35Z"
            fill={theme.palette.primary.main}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M60 35C60 30 65 25 70 25C75 25 80 30 80 35C80 40 75 45 70 45C65 45 60 40 60 35Z"
            fill={theme.palette.primary.main}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M30 15C30 10 35 5 40 5C45 5 50 10 50 15C50 20 45 25 40 25C35 25 30 20 30 15Z"
            fill={theme.palette.secondary.main}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M50 15C50 10 55 5 60 5C65 5 70 10 70 15C70 20 65 25 60 25C55 25 50 20 50 15Z"
            fill={theme.palette.secondary.main}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M35 65C35 55 40 50 50 50C60 50 65 55 65 65C65 70 62 75 58 78C55 80 52 82 50 85C48 82 45 80 42 78C38 75 35 70 35 65Z"
            fill={theme.palette.primary.main}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1 }}
            viewport={{ once: true }}
          />
        </svg>
      </Box>
    </motion.div>
  );
};
