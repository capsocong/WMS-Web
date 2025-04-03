
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'


// Create a theme instance.
const theme = extendTheme({

  Wms: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {},
  // ...other properties
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': { borderWidth: '0.5px' }
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar':{
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          height: 0,
          minheight: 1.5
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldSet': {
            borderWidth: '0.5px !important'
          },
          '&:hover fieldSet': {
            borderWidth: '1px !important'
          },
          '&.Mui-focused fieldSet': {
            borderWidth: '1px !important'
          }
        }
      }
    }
  }
})

export default theme