import { Box, Typography, Link, IconButton, useTheme, alpha, Button } from '@mui/material';
import { Facebook, Instagram, Twitter, Business } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useUserInfoQuery } from '../../features/account/accountApi';

export default function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { data: user } = useUserInfoQuery();
  return (
    <Box
      component="footer"
      sx={{
        background: isDark
          ? `linear-gradient(90deg, ${alpha('#1F2937', 0.98)} 0%, ${alpha('#111827', 0.98)} 100%)`
          : `linear-gradient(90deg, ${alpha('#FFFFFF', 0.98)} 0%, ${alpha('#F9FAFB', 0.98)} 100%)`,
        color: isDark ? 'grey.100' : 'grey.900',
        borderTop: `1.5px solid ${alpha(theme.palette.divider, 0.18)}`,
        boxShadow: isDark
          ? '0 -2px 16px 0 rgba(0,0,0,0.18)'
          : '0 -2px 16px 0 rgba(0,0,0,0.06)',
        padding: { xs: 3, sm: 4 },
        textAlign: 'center',
        mt: 6,
      }}
    >      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 1 }}>
        <img
          src="/images/PurffectMatchLogo.png"
          alt="PurrfectMatch Logo"
          style={{ height: 75}}
        />
      </Box><Typography variant="body2" gutterBottom sx={{ opacity: 0.85, mb: 1 }}>
        Helping pets find their forever homes.
      </Typography>

      {/* Show "Become a Shelter" button for authenticated users who are not already shelter managers */}
      {user && !user.roles?.includes('ShelterManager') && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Business />}
            onClick={() => navigate('/become-shelter')}
            sx={{
              borderRadius: 28,
              textTransform: 'none',
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 4px 16px rgba(79, 172, 254, 0.4)' 
                : '0 4px 16px rgba(79, 172, 254, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 6px 20px rgba(79, 172, 254, 0.5)' 
                  : '0 6px 20px rgba(79, 172, 254, 0.4)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Become a Shelter
          </Button>
        </Box>
      )}<Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Link component={RouterLink} to="/about" color="inherit" underline="hover" sx={{ fontWeight: 500, opacity: 0.85, '&:hover': { color: 'primary.main', opacity: 1 } }}>
          About
        </Link>
        <Link component={RouterLink} to="/donate" color="inherit" underline="hover" sx={{ fontWeight: 500, opacity: 0.85, '&:hover': { color: 'primary.main', opacity: 1 } }}>
          Donate
        </Link>
        <Link component={RouterLink} to="/contact" color="inherit" underline="hover" sx={{ fontWeight: 500, opacity: 0.85, '&:hover': { color: 'primary.main', opacity: 1 } }}>
          Contact
        </Link>
        <Link component={RouterLink} to="/faq" color="inherit" underline="hover" sx={{ fontWeight: 500, opacity: 0.85, '&:hover': { color: 'primary.main', opacity: 1 } }}>
          FAQ
        </Link>
        <Link component={RouterLink} to="/privacy" color="inherit" underline="hover" sx={{ fontWeight: 500, opacity: 0.85, '&:hover': { color: 'primary.main', opacity: 1 } }}>
          Privacy
        </Link>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 1 }}>
        <IconButton href="https://twitter.com" target="_blank" color="inherit" sx={{ '&:hover': { color: 'primary.main', background: alpha(theme.palette.primary.main, 0.08) } }}>
          <Twitter />
        </IconButton>
        <IconButton href="https://instagram.com" target="_blank" color="inherit" sx={{ '&:hover': { color: 'primary.main', background: alpha(theme.palette.primary.main, 0.08) } }}>
          <Instagram />
        </IconButton>
        <IconButton href="https://facebook.com" target="_blank" color="inherit" sx={{ '&:hover': { color: 'primary.main', background: alpha(theme.palette.primary.main, 0.08) } }}>
          <Facebook />
        </IconButton>
      </Box>
      <Typography variant="caption" display="block" sx={{ mt: 2, opacity: 0.7 }}>
        © {new Date().getFullYear()} PurrfectMatch. All rights reserved.
      </Typography>
    </Box>
  );
}