
import { Box, Divider, Menu, MenuItem } from '@mui/material'
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
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

function BoardContent() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => { setAnchorEl(event.currentTarget)}
  const handleClose = () => { setAnchorEl(null) }

  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      width: '100%',
      height: (theme) => theme.Wms.boardContentHeight,
      display: 'flex',
      overflowX: 'auto',
      overflowY: 'hidden',
      p: '10px 0'
    }}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {/* box column 01 */}
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
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: 'flex',
              alignItems: 'center',
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
          <Box sx={{
            p: '0 5px',
            m: '0 5px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: (theme) => `calc(
            ${theme.Wms.boardContentHeight} - 
            ${theme.spacing(5)} -
            ${COLUMN_HEADER_HEIGHT} - 
            ${COLUMN_FOOTER_HEIGHT} 
            )`,
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }

          }}>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardMedia
                sx={{ height: 140 }}
                image="https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/472449411_122209158014029709_7017434410367113048_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFBrOOhJFoc730lGHcy4uk5nJehVvTWQUicl6FW9NZBSBP5YMrBhsrjuFjHTacgBNQNPzuKt85P_rPjJLUhXSGk&_nc_ohc=7qwjJKarEMwQ7kNvgFCLw9Z&_nc_oc=AdmUGbiGAOX11Fx_qQC5B-IFOeW98QrLdskKTvwA0GM8J-rwg7i_nb0Hia0rZoEhV7w&_nc_zt=23&_nc_ht=scontent.fhan5-2.fna&_nc_gid=a8W5noGOedhVQK7bv987bw&oh=00_AYGDoYxxnKvjbVNxb5_wDuiBJUYL40DMb4okhNQrWIhzPA&oe=67F47587"
                title="green iguana"
              />
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">TranTienDev</Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button size="small" startIcon={<GroupIcon/>}>20</Button>
                <Button size="small" startIcon={<CommentIcon/>}>20</Button>
                <Button size="small" startIcon={<AttachmentIcon/>}>20</Button>
              </CardActions>
            </Card>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">Card01</Typography>
              </CardContent>
            </Card>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">Card01</Typography>
              </CardContent>
            </Card>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">Card01</Typography>
              </CardContent>
            </Card>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">Card01</Typography>
              </CardContent>
            </Card>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">Card01</Typography>
              </CardContent>
            </Card>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">Card01</Typography>
              </CardContent>
            </Card>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">Card01</Typography>
              </CardContent>
            </Card>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">Card01</Typography>
              </CardContent>
            </Card>
          </Box>
          {/* box columnFooter */}
          <Box
            sx={{
              height: COLUMN_FOOTER_HEIGHT,
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
        {/* box column 02 */}
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
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: 'flex',
              alignItems: 'center',
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
          <Box sx={{
            p: '0 5px',
            m: '0 5px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: (theme) => `calc(
            ${theme.Wms.boardContentHeight} - 
            ${theme.spacing(5)} -
            ${COLUMN_HEADER_HEIGHT} - 
            ${COLUMN_FOOTER_HEIGHT} 
            )`,
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }

          }}>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardMedia
                sx={{ height: 140 }}
                image="https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/472449411_122209158014029709_7017434410367113048_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFBrOOhJFoc730lGHcy4uk5nJehVvTWQUicl6FW9NZBSBP5YMrBhsrjuFjHTacgBNQNPzuKt85P_rPjJLUhXSGk&_nc_ohc=7qwjJKarEMwQ7kNvgFCLw9Z&_nc_oc=AdmUGbiGAOX11Fx_qQC5B-IFOeW98QrLdskKTvwA0GM8J-rwg7i_nb0Hia0rZoEhV7w&_nc_zt=23&_nc_ht=scontent.fhan5-2.fna&_nc_gid=a8W5noGOedhVQK7bv987bw&oh=00_AYGDoYxxnKvjbVNxb5_wDuiBJUYL40DMb4okhNQrWIhzPA&oe=67F47587"
                title="green iguana"
              />
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">TranTienDev</Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button size="small" startIcon={<GroupIcon/>}>20</Button>
                <Button size="small" startIcon={<CommentIcon/>}>20</Button>
                <Button size="small" startIcon={<AttachmentIcon/>}>20</Button>
              </CardActions>
            </Card>
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">Card01</Typography>
              </CardContent>
            </Card>
          </Box>
          {/* box columnFooter */}
          <Box
            sx={{
              height: COLUMN_FOOTER_HEIGHT,
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
      </Box>

    </Box>
  )
}

export default BoardContent