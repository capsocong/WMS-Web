import { Box } from '@mui/material'
import SelectMode from '../ModeSelect'
import theme from '../../theme'

function AppBar() {
  return (
    <Box sx={{
      backgroundColor: 'primary.light',
      height: () => theme.Wms.appBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }}>
        headerbar
      <SelectMode />
    </Box>)
}

export default AppBar