import { Box, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';

interface TipIconProps {
  icon: string;
}

export default function TipIcon({ icon }: TipIconProps) {
  return (
    <Box sx={{
      position: 'absolute',
      top: -30,
      right: -30,
      width: 80,
      height: 80,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      background: (theme: Theme) => theme.palette.mode === 'dark'
        ? 'rgba(255, 107, 107, 0.15)'
        : 'rgba(255, 107, 107, 0.1)',
      opacity: 0.7,
    }}>
      <Typography variant="h3" sx={{ color: 'primary.main', opacity: 0.8 }}>
        {icon}
      </Typography>
    </Box>
  );
}
