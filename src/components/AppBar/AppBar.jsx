// import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import Typography from '@mui/material/Typography'
// import Workspaces from './Menus/Workspaces'
// import Recent from './Menus/Recent'
// import Starred from './Menus/Starred'
// import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'
// import Button from '@mui/material/Button'
// import TextField from '@mui/material/TextField'
// import Badge from '@mui/material/Badge'
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
// import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
// import InputAdornment from '@mui/material/InputAdornment'
// import SearchIcon from '@mui/icons-material/Search'
// import CloseIcon from '@mui/icons-material/Close'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'

function AppBar() {
  // const [searchValue, setSearchValue] = useState('')

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.Wms.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to='/boards'>
          <Tooltip title="danh sách bảng">

            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>

        <Link to="/">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="span"
              sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white'
              }}>Quản lý công việc
            </Typography>
          </Box>
        </Link>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        {/* Tìm kiếm nhanh 1 hoặc nhiều bảng */}
        <AutoCompleteSearchBoard />

        <ModeSelect />
        {/* xử lý hiển thị thông báo */}
        <Notifications />

        <Tooltip title="help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>

        <Profiles />

      </Box>
    </Box>
  )
}

export default AppBar
