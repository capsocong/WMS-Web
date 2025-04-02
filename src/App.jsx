import { AccessAlarms, Home, Settings } from '@mui/icons-material'
import Button from '@mui/material/Button'
import { pink } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  useColorScheme
} from '@mui/material/styles'
import { Box, Container, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkMode'
import { SettingsBrightness } from '@mui/icons-material'
import theme from './theme'

function SelectMode() {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event) => {
    // setAge(event.target.value)
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-small-label">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="">
        </MenuItem>
        <MenuItem value="light">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LightModeIcon/> Light Mode
          </div>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeOutlinedIcon/> Dark Mode
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsBrightness/>System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}


function App() {

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <Box sx={{
        backgroundColor: 'primary.light',
        height: () => theme.Wms.appBarHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center'

      }}>
        headerbar
        <SelectMode />
      </Box>
      <Box sx={{
        backgroundColor: 'primary.dark',
        width: '100%',
        height: () => theme.Wms.boardBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}>boardBar</Box>
      <Box sx={{
        backgroundColor: 'primary.main',
        width: '100%',
        height: (theme) => `calc(100vh - ${theme.Wms.appBarHeight} - ${theme.Wms.boardBarHeight})`,
        display: 'flex',
        alignItems: 'center'
      }}>BoardContent</Box>
    </Container>
  )
}

export default App
