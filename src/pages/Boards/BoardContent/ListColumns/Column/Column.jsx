import React from 'react'
import AddCardIcon from '@mui/icons-material/AddCard'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import { Cloud, ContentPaste } from '@mui/icons-material'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { Box, Button, Divider, Menu, MenuItem } from '@mui/material'
import ListCards from './ListCards/ListCards'


function Column() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => { setAnchorEl(event.currentTarget)}
  const handleClose = () => { setAnchorEl(null) }
  return (
    <Box
      sx={{
        minWidth: '300px',
        maxWidth: '300px',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
        ml: 2,
        borderRadius: '6px',
        height: 'fit-content',
        maxHeight: (theme) => `calc(${theme.Wms.boardContentHeight} - ${theme.spacing(5)})`
      }}>
      {/* box column header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          height: (theme) => theme.Wms.columnHeaderHeight,
          justifyContent: 'space-between'
        }}>
        <Typography sx={{
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>Column title</Typography>
        <Box>
          <Tooltip title='More options'>
            <ExpandMoreIcon
              sx={{ color: 'text.primary', cursor: 'pointer' }}
              id="basic-button-workspaces"
              aria-haspopup="true"
              aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
              onClick={handleClick}
              aria-expanded={open ? 'true' : undefined}
            />
          </Tooltip>
          <Menu
            id="basic-menu-workspaces"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-column-dropdown'
            }}
          >
            <MenuItem>
              <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Add new card</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
              <ListItemText>Paste</ListItemText>
            </MenuItem>
            <Divider/>
            <MenuItem>
              <ListItemIcon> <DeleteForeverIcon fontSize="small" /> </ListItemIcon>
              <ListItemText>Remove this column</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon> <Cloud fontSize="small" /> </ListItemIcon>
              <ListItemText>Archive this column</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      {/* box list card */}
      <ListCards></ListCards>
      {/* box columnFooter */}
      <Box
        sx={{
          height: (theme) => theme.Wms.columnFooterHeight,
          p: 2,
          display:  'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        <Button startIcon={<AddCardIcon/>}>Add new card</Button>
        <Tooltip title='Drag to move'>
          <DragHandleIcon sx={{ cursor: 'pointer' }}></DragHandleIcon>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Column