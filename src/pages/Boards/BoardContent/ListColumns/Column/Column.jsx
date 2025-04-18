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
import { mapOrder } from '~/utils/sort'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


function Column({ column }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })
  const dndKitColumnStyle = {
    // touchAction: 'none', // Dành cho sensor dạng pointerSensor
    transform: CSS.Translate.toString(transform),
    transition,
    // chiều cao của column phải là 100% vì khi kéo thả sẽ bị ảnh hưởng bởi chiều cao của column
    // kết hợp với {...listeners} nằm ở box chứ không phải ở div để tránh trường hợp kéo vào vùng xanh
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => { setAnchorEl(event.currentTarget)}
  const handleClose = () => { setAnchorEl(null) }

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  return (
    // bọc div over box để tránh lỗi flickering khi kéo thả
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes} >
      <Box
        {...listeners}
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
          }}>
            {column?.title}
          </Typography>
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
        <ListCards cards = {orderedCards} />
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
    </div>
  )
}

export default Column