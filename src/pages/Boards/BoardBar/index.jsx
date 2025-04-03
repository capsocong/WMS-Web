import { Avatar, AvatarGroup, Box, Button, Chip, Tooltip } from '@mui/material'
import theme from '~/theme'
import DashBoardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd';


const boardBar_style = {
  color: 'primary.main',
  backgroundColor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root':{
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {

  return (
    <Box sx={{
      backgroundColor: 'white',
      width: '100%',
      height: () => theme.Wms.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      borderTop: '1px solid #00bfa5',
      paddingX: 2

    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx = {boardBar_style}
          icon={<DashBoardIcon />}
          label="Board"
          clickable
        />
        <Chip
          sx = {boardBar_style}
          icon={<VpnLockIcon />}
          label="Private"
          clickable
        />
        <Chip
          sx = {boardBar_style}
          icon={<AddToDriveIcon />}
          label="Add to drive"
          clickable
        />
        <Chip
          sx = {boardBar_style}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx = {boardBar_style}
          icon={<FilterListIcon />}
          label="Filter"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<PersonAddIcon />} sx={{
          color: 'primary.main' }}>
          invite
        </Button>
        <AvatarGroup max={4} sx={{ '& .MuiAvatarGroup-avatar': { width: 30, height: 30 } }}>
          <Tooltip title='tien.tdev'>
            <Avatar
              alt='Tran Tien'
              src='https://avatars.githubusercontent.com/u/91900796?s=400&u=b11c97b0680d7d80abcc89e8999e7330bddfd3e2&v=4'/>
          </Tooltip>
          <Tooltip title='tien.tdev'>
            <Avatar
              alt='Tran Tien'
              src='https://avatars.githubusercontent.com/u/91900796?s=400&u=b11c97b0680d7d80abcc89e8999e7330bddfd3e2&v=4'/>
          </Tooltip>
          <Tooltip title='tien.tdev'>
            <Avatar
              alt='Tran Tien'
              src='https://avatars.githubusercontent.com/u/91900796?s=400&u=b11c97b0680d7d80abcc89e8999e7330bddfd3e2&v=4'/>
          </Tooltip>
          <Tooltip title='tien.tdev'>
            <Avatar
              alt='Tran Tien'
              src='https://avatars.githubusercontent.com/u/91900796?s=400&u=b11c97b0680d7d80abcc89e8999e7330bddfd3e2&v=4'/>
          </Tooltip>
          <Tooltip title='tien.tdev'>
            <Avatar
              alt='Tran Tien'
              src='https://avatars.githubusercontent.com/u/91900796?s=400&u=b11c97b0680d7d80abcc89e8999e7330bddfd3e2&v=4'/>
          </Tooltip>
          <Tooltip title='tien.tdev'>
            <Avatar
              alt='Tran Tien'
              src='https://avatars.githubusercontent.com/u/91900796?s=400&u=b11c97b0680d7d80abcc89e8999e7330bddfd3e2&v=4'/>
          </Tooltip>
          <Tooltip title='tien.tdev'>
            <Avatar
              alt='Tran Tien'
              src='https://avatars.githubusercontent.com/u/91900796?s=400&u=b11c97b0680d7d80abcc89e8999e7330bddfd3e2&v=4'/>
          </Tooltip>
          <Tooltip title='tien.tdev'>
            <Avatar
              alt='Tran Tien'
              src='https://avatars.githubusercontent.com/u/91900796?s=400&u=b11c97b0680d7d80abcc89e8999e7330bddfd3e2&v=4'/>
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar