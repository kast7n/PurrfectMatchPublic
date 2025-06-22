import React from 'react';
import { Box, CircularProgressProps } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/**
 * Custom MUI Loader using a Lottie animation.
 * Appears centered on the screen.
 */
const MuiLottieLoader: React.FC<CircularProgressProps> = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1301, // above modal/dialog
        bgcolor: 'rgba(255,255,255,0.7)', // subtle overlay
      }}
    >
      <DotLottieReact
        src="/Lottie/Walking-Dog.lottie"
        loop
        autoplay
        style={{ height: 180, width: 180 }}
      />
    </Box>
  );
};

export default MuiLottieLoader;
