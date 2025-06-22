import { createTheme, PaletteMode } from '@mui/material/styles';

// Define light and dark palette options
const lightPalette = {
  primary: {
    main: '#FF6B6B', // Warm coral red
    light: '#FF8A8A',
    dark: '#FF4C4C',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FFD166', // Soft golden yellow
    light: '#FFE199',
    dark: '#FFC233',
    contrastText: '#1F2937',
  },
  background: {
    default: '#F9FAFB', // Soft off-white
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1F2937', // Dark gray
    secondary: '#4B5563', // Muted gray
  },
  error: {
    main: '#EF4444',
  },
  warning: {
    main: '#F59E0B',
  },
  info: {
    main: '#3B82F6',
  },
  success: {
    main: '#10B981',
  },
};

const darkPalette = {
  primary: {
    main: '#FF6B6B', // Same coral red (consistent brand)
    light: '#FF8A8A',
    dark: '#FF4C4C',
    contrastText: '#111827',
  },
  secondary: {
    main: '#FBBF24', // Gold/yellow
    light: '#FCD34D',
    dark: '#F59E0B',
    contrastText: '#111827',
  },
  background: {
    default: '#111827', // Rich charcoal
    paper: '#1F2937', // Slate gray
  },
  text: {
    primary: '#F9FAFB', // Almost white
    secondary: '#9CA3AF', // Cool gray
  },
  error: {
    main: '#F87171',
  },
  warning: {
    main: '#FBBF24',
  },
  info: {
    main: '#60A5FA',
  },
  success: {
    main: '#34D399',
  },
};

// Create the theme with your palette
export const purrfectTheme = (mode: PaletteMode) => 
  createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
    typography: {
      fontFamily: '"Nunito", "Quicksand", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.2rem',
        lineHeight: 1.5,
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.1rem',
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        fontSize: '0.875rem',
        textTransform: 'none',
        borderRadius: '24px',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '24px',
            padding: '8px 24px',
            boxShadow: mode === 'light' 
              ? '0px 3px 12px rgba(0, 0, 0, 0.08)'
              : '0px 3px 12px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light' 
                ? '0px 5px 15px rgba(0, 0, 0, 0.12)'
                : '0px 5px 15px rgba(255, 107, 107, 0.3)',
            },
          },
          contained: {
            '&.MuiButton-containedPrimary': {
              background: mode === 'light'
                ? 'linear-gradient(45deg, #FF6B6B 30%, #FF8A8A 90%)'
                : 'linear-gradient(45deg, #FF6B6B 30%, #FF4C4C 90%)',
            },
            '&.MuiButton-containedSecondary': {
              background: mode === 'light'
                ? 'linear-gradient(45deg, #FFD166 30%, #FFE199 90%)'
                : 'linear-gradient(45deg, #FBBF24 30%, #FCD34D 90%)',
              color: '#1F2937',
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: mode === 'light'
              ? '0px 4px 16px rgba(0, 0, 0, 0.08)'
              : '0px 4px 16px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#1F2937',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: mode === 'light'
                ? '0px 8px 24px rgba(0, 0, 0, 0.12)'
                : '0px 8px 24px rgba(0, 0, 0, 0.5)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            fontWeight: 500,
            backgroundColor: mode === 'light' ? '#E5E7EB' : '#374151',
          },
          colorPrimary: {
            backgroundColor: mode === 'light' ? '#FF8A8A' : '#FF4C4C',
            color: mode === 'light' ? '#FFFFFF' : '#111827',
          },
          colorSecondary: {
            backgroundColor: mode === 'light' ? '#FFE199' : '#FCD34D',
            color: '#1F2937',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: mode === 'light' ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#E5E7EB' : '#4B5563',
            },
            '& .MuiInputLabel-root': {
              color: mode === 'light' ? '#4B5563' : '#9CA3AF',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#111827',
            color: mode === 'light' ? '#1F2937' : '#F9FAFB',
            boxShadow: mode === 'light'
              ? '0px 1px 3px rgba(0, 0, 0, 0.08)'
              : '0px 1px 3px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: mode === 'light' ? '#E5E7EB' : '#4B5563',
            '&.Mui-checked': {
              color: '#FF6B6B',
            },
            '&.Mui-checked + .MuiSwitch-track': {
              backgroundColor: mode === 'light' ? '#FF8A8A' : '#FF4C4C',
            },
          },
          track: {
            backgroundColor: mode === 'light' ? '#9CA3AF' : '#374151',
          },
        },
      },
    },
  });

// Export the default light theme
export default purrfectTheme('light');