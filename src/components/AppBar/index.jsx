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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';


function AppBar() {
  return (
    <Box px={2} sx={{
      height: () => theme.Wms.appBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto'
    }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <AppsIcon sx={{ color: 'primary.main' }}/>
        <Typography variant='span' sx={{ fontSize: '1,2rem', fontWeight: 'bold', color: 'primary.main', alignItems: 'center' }} >
           ManagementTask
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspace />
          <Recent />
          <Starred />
          <Templates />
          <Button variant="outlined" startIcon={<LibraryAddIcon/>} >Create</Button>
        </Box>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField id="outlined-search" label="Search..." size='small' sx={{ minWidth: '120px' }}/>
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