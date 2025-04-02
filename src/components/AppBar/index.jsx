import { Badge, Box, Button, TextField, Typography } from '@mui/material'
import SelectMode from '~/components/ModeSelect'
import theme from '~/theme'
import AppsIcon from '@mui/icons-material/Apps'
import Workspace from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/templates'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Profiles from './Menus/Profiles'


function AppBar() {
  return (
    <Box px={2} sx={{
      height: () => theme.Wms.appBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AppsIcon sx={{ color: 'primary.main' }}/>
        <Typography variant='span' sx={{ fontSize: '1,2rem', fontWeight: 'bold', color: 'primary.main' }} >ManagementTask </Typography>
        <Workspace />
        <Recent />
        <Starred />
        <Templates />
        <Button variant="outlined">Create</Button>
      </Box>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField id="oulined-search" label="Search..." size='small'/>
        <SelectMode />
        <Tooltip title="Notifications">
          <Badge color="secondary" variant="dot" >
            <NotificationsNoneIcon sx={{ cursor: 'pointer' }}/>
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer' }}/>
        </Tooltip>
        <Profiles />
      </Box>
    </Box>)
}

export default AppBar