import { AccessAlarms, Home, Settings } from '@mui/icons-material'
import Button from '@mui/material/Button'
import { pink } from '@mui/material/colors'
import Typography from '@mui/material/Typography'

function App() {

  return (
    <>
      <div>
      Hello world
      </div>
      <Typography variant="h2">Hello world</Typography>
      <Typography variant="h2" color="text.secondary">Hello world</Typography>
      <Button variant="contained">Hello world</Button>
      <Button variant="outlined">Hello world</Button>
      <Button variant="text">Hello world</Button>
      <br/>
      <AccessAlarms/>
      <Settings/>
      <Home color="primary"/>
      <Home sx={{ color: pink[500] }}/>
      <Home sx={{ color: '#ad1457' }}/>
    </>
  )
}

export default App
