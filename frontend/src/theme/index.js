import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: '#1E3A5F',     
      light: '#2C5282',
      dark: '#162C46',
      contrastText: '#E5E7EB',
    },

    secondary: {
      main: '#2F855A',    
      light: '#48BB78',
      dark: '#276749',
      contrastText: '#E6FFFA',
    },

    success: {
      main: '#38A169',
      light: '#68D391',
      dark: '#276749',
      contrastText: '#022c22',
    },

    warning: {
      main: '#D69E2E',
      light: '#ECC94B',
      dark: '#975A16',
      contrastText: '#1A1200',
    },

    error: {
      main: '#C53030',
      light: '#F56565',
      dark: '#742A2A',
      contrastText: '#ffffff',
    },

    info: {
      main: '#2B6CB0',
      light: '#63B3ED',
      dark: '#2C5282',
      contrastText: '#E6F6FF',
    },

    background: {
      default: '#0A0F1C',  
      paper: '#111827',     
    },

    text: {
      primary: '#E5E7EB',
      secondary: '#9CA3AF',
    },

    divider: 'rgba(255, 255, 255, 0.08)',
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
    borderRadius: 10,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0A0F1C', 
          minHeight: '100vh',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          transition: 'all 0.25s ease',
          '&:hover': {
            borderColor: '#2F855A', 
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 20px',
        },

        containedPrimary: {
          backgroundColor: '#1E3A5F',
          boxShadow: '0 4px 12px rgba(30, 58, 95, 0.4)',
          '&:hover': {
            backgroundColor: '#162C46',
          },
        },

        containedSecondary: {
          backgroundColor: '#2F855A',
          '&:hover': {
            backgroundColor: '#276749',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#020617',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2F855A', 
            },
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#020617',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.06)',
        },
        head: {
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
          color: '#9CA3AF',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111827',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
  },
});

export default theme;