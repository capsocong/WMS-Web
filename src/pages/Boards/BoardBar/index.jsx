import { Box } from '@mui/material'
import theme from '~/theme'

function BoardBar() {
  return (
    <Box sx={{
      backgroundColor: 'primary.dark',
      width: '100%',
      height: () => theme.Wms.boardBarHeight,
      display: 'flex',
      alignItems: 'center'
    }}>boardBar</Box>
  )
}

export default BoardBar