// Animated cat Lottie component for HeroSection
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function HeroCatAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <DotLottieReact
          src="/Lottie/Cat-Playing-With-Thread.lottie"
          loop
          autoplay
          style={{ height: '65vh', width: 'auto', maxHeight: 520, pointerEvents: 'none', userSelect: 'none' }}
        />
      </Box>
    </motion.div>
  );
}
