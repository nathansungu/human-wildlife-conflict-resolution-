import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#2E7D32',
      light: '#66BB6A',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#A5D6A7',
      light: '#C8E6C9',
      dark: '#81C784',
      contrastText: '#0F2A13',
    },

    success: {
      main: '#43A047',
      light: '#81C784',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },

    warning: {
      main: '#F9A825',
      light: '#FFD54F',
      dark: '#F57F17',
      contrastText: '#2B2100',
    },

    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#B71C1C',
      contrastText: '#FFFFFF',
    },

    info: {
      main: '#388E3C',
      light: '#A5D6A7',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },

    background: {
      default: '#F4FAF4',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#102A12',
      secondary: '#4F6F52',
    },

    divider: 'rgba(46, 125, 50, 0.14)',
  },

  typography: {
    fontFamily: '"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '2.5rem' },
    h2: { fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '2rem' },
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '1.75rem' },
    h4: { fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '1.5rem' },
    h5: { fontFamily: '"Syne", sans-serif', fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 600, fontSize: '1rem' },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F4FAF4',
          minHeight: '100vh',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(46, 125, 50, 0.12)',
          boxShadow: '0 8px 24px rgba(27, 94, 32, 0.06)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(46, 125, 50, 0.12)',
          boxShadow: '0 8px 24px rgba(27, 94, 32, 0.06)',
          transition: 'all 0.25s ease',
          '&:hover': {
            borderColor: '#66BB6A',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 30px rgba(27, 94, 32, 0.10)',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 20px',
        },

        containedPrimary: {
          backgroundColor: '#2E7D32',
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.28)',
          '&:hover': {
            backgroundColor: '#1B5E20',
          },
        },

        containedSecondary: {
          backgroundColor: '#A5D6A7',
          color: '#0F2A13',
          '&:hover': {
            backgroundColor: '#81C784',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: 'rgba(46, 125, 50, 0.18)',
            },
            '&:hover fieldset': {
              borderColor: '#66BB6A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2E7D32',
            },
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
          backgroundColor: '#E8F5E9',
          color: '#1B5E20',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(46, 125, 50, 0.12)',
        },
        head: {
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
          color: '#2E7D32',
          backgroundColor: '#E8F5E9',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(46, 125, 50, 0.12)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#102A12',
          borderBottom: '1px solid rgba(46, 125, 50, 0.12)',
          boxShadow: '0 4px 16px rgba(27, 94, 32, 0.05)',
        },
      },
    },
  },
});

export default theme;