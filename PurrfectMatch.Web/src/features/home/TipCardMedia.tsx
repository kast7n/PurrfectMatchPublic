import { CardMedia, Box } from '@mui/material';

interface TipCardMediaProps {
  image: string;
  title: string;
  children?: React.ReactNode;
}

export default function TipCardMedia({ image, title, children }: TipCardMediaProps) {
  return (
    <CardMedia 
      image={image} 
      title={title}
      sx={{
        height: 180,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <Box sx={{ 
        position: 'absolute', 
        top: 12, 
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        px: 2,
        py: 0.5,
        fontSize: '1.2rem',
        fontWeight: 600,
        color: 'primary.main',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <span style={{ marginRight: 4 }}>{title}</span>
      </Box>
      {children}
    </CardMedia>
  );
}
