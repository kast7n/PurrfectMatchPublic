// moved to adoptionTips folder
import { CardContent, Button, List, useTheme, Box } from '@mui/material';
import TipCardMedia from './TipCardMedia';
import TipIcon from './TipIcon';
import TipListItem from './TipListItem';
import { Tip } from './tipTypes';
import { motion, Variants } from 'framer-motion';

interface AdoptionTipCardProps {
  tip: Tip;
  index: number;
  cardVariants: Variants;
}

export default function AdoptionTipCard({ tip, index, cardVariants }: AdoptionTipCardProps) {
  const theme = useTheme();
  return (
    <motion.div
      style={{ height: '100%' }}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={cardVariants}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 420,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(40,40,40,0.60) 70%, rgba(129,199,132,0.10) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.65) 70%, rgba(255, 183, 197, 0.10) 100%)',
          borderRadius: 2, // less round
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0,0,0,0.18)'
            : '0 8px 24px rgba(255, 107, 107, 0.10)',
          border: `1.5px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decorative paws/circles - subtle background objects */}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            left: 18,
            opacity: 0.10,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill={theme.palette.primary.light} />
          </svg>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 18,
            right: 18,
            opacity: 0.12,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <ellipse cx="16" cy="16" rx="16" ry="12" fill={theme.palette.secondary.light} />
          </svg>
        </Box>
        {/* Optional paw print SVG for extra subtlety */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 32,
            opacity: 0.08,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <ellipse cx="18" cy="28" rx="8" ry="4" fill={theme.palette.primary.main} />
            <circle cx="10" cy="16" r="3" fill={theme.palette.primary.main} />
            <circle cx="26" cy="16" r="3" fill={theme.palette.primary.main} />
            <circle cx="14" cy="10" r="2" fill={theme.palette.primary.main} />
            <circle cx="22" cy="10" r="2" fill={theme.palette.primary.main} />
          </svg>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 60,
            right: 24,
            opacity: 0.07,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <ellipse cx="14" cy="22" rx="6" ry="3" fill={theme.palette.primary.main} />
            <circle cx="7" cy="12" r="2" fill={theme.palette.primary.main} />
            <circle cx="21" cy="12" r="2" fill={theme.palette.primary.main} />
            <circle cx="10" cy="6" r="1.2" fill={theme.palette.primary.main} />
            <circle cx="18" cy="6" r="1.2" fill={theme.palette.primary.main} />
          </svg>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 120,
            left: 60,
            opacity: 0.06,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <ellipse cx="11" cy="17" rx="4" ry="2" fill={theme.palette.primary.main} />
            <circle cx="5" cy="8" r="1.2" fill={theme.palette.primary.main} />
            <circle cx="17" cy="8" r="1.2" fill={theme.palette.primary.main} />
            <circle cx="8" cy="3" r="0.8" fill={theme.palette.primary.main} />
            <circle cx="14" cy="3" r="0.8" fill={theme.palette.primary.main} />
          </svg>
        </Box>
        <TipCardMedia image={tip.image} title={tip.title}>
          <TipIcon icon={tip.icon} />
        </TipCardMedia>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3 }}>
          <List dense sx={{ flex: 1, mb: 2 }}>
            {tip.tips.map((item: string, i: number) => (
              <TipListItem key={i} item={item} />
            ))}
          </List>
          <Button 
            variant="text" 
            color="primary"
            sx={{ fontWeight: 600, alignSelf: 'flex-start', '&:hover': { backgroundColor: 'rgba(229, 115, 115, 0.08)' } }}
            href={`/adoption-guides/${tip.id}`}
          >
            Read More Tips
          </Button>
        </CardContent>
      </Box>
    </motion.div>
  );
}
