import { useState } from 'react'
import { Badge, Box, Button, InputAdornment, TextField, Typography } from '@mui/material'
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
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

// #1565c0
function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <Box px={2} sx={{
      height: () => theme.Wms.appBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      '&::-webkit-scrollbar-track': { m: 2 },
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <AppsIcon sx={{ color: 'white' }}/>
        <Typography variant='span' sx={{ fontSize: '1,2rem', fontWeight: 'bold', color: 'white', alignItems: 'center' }} >
           ManagementTask
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspace />
          <Recent />
          <Starred />
          <Templates />
          <Button
            sx={{ color: 'white', border: 'none', '&:hover':{ border: 'none' } }}

            variant="outlined"
            startIcon={<LibraryAddIcon/>} >Create
          </Button>
        </Box>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id='outlined-search'
          type='text'
          label='Search'
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClick={() => setSearchValue('')}
          InputProps={{
            startAdornment: (
              <InputAdornment position = 'start'>
                <SearchIcon sx={{ color: 'white' }}/>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position = 'end'>
                <CloseIcon
                  sx={{ color: searchValue ? 'white' : 'transparent', cursor: 'pointer' }}
                  onClick={() => setSearchValue('')}
                  fontSize='small'
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth:  '170px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root':{
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}
        />
        <SelectMode />
        <Tooltip title="Notifications">
          <Badge color="warning" variant="dot" >
            <NotificationsNoneIcon sx={{ cursor: 'pointer', color: 'white' }}/>
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }}/>
        </Tooltip>
        <Profiles />
      </Box>
    </Box>)
}

export default AppBar