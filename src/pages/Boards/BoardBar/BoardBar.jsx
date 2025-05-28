import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.Wms.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="tiendev">
            <Avatar alt=""
              src="https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/495541821_122230017956029709_2486229336548815633_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=h5RTV9tu5kEQ7kNvwGsK21i&_nc_oc=Adl6bK92IOdbmyDuyhNaj3ytY6uIMVGB7B5EI9bmZ7RhFvAgalgjMsyiZMszZO8f7NA&_nc_zt=23&_nc_ht=scontent.fhan5-11.fna&_nc_gid=mfb-V-e99HoOEliNqllsjA&oh=00_AfJMbH8b07SrBUHJ2h0qnvH76gS1lTBxKE3wHbV0hgRoKw&oe=683687AD"
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src="https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/472449411_122209158014029709_7017434410367113048_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=ZgUS9vA4j_0Q7kNvwHkrzHE&_nc_oc=AdnlyzdzZBYrn_8CysCbKFDa-lYeVCMct3AWUUZEsQ6EQQ0SWlpGTTq0CeTq0GzbKzg&_nc_zt=23&_nc_ht=scontent.fhan5-2.fna&_nc_gid=INoL6obHJ_UFGimdHzYUAg&oh=00_AfJXg-riIsB4TwXelhMveMgbPSGsz8fdpjN3Vjv4IrfZtw&oe=68366087"
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src="https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-6/472267303_122208586604029709_8970034264989688186_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=XYTZ73ocuCIQ7kNvwGdZRX4&_nc_oc=AdkjVSYjDP7afCohPjOQKodaMC_P-2wwjzZ5zEcpwKNyfYvHbVrkrckmVY9bB-Z7h9E&_nc_zt=23&_nc_ht=scontent.fhan5-8.fna&_nc_gid=YNUDHAJP2Gy6GzTowjJj7A&oh=00_AfL8QOTtXZZlpSYgyTlNL00uINjxzNioplehRXWIYxDN3A&oe=683672C3"
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src="https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/468160064_122202526076029709_4178091142810834584_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=KF2aywgBdpAQ7kNvwFkAl2x&_nc_oc=AdmXpEzqhcfP9w8kINPFaKRZfYLRa08fJvu2Q8trA0zpQZTuJaGHW3ryjYNHxZKfhOk&_nc_zt=23&_nc_ht=scontent.fhan5-11.fna&_nc_gid=jbTVSFTi6SD9qesnIVH0EQ&oh=00_AfI9OgKwlCR4Y00HjnP62oFOhraMv-yvTm2ZloUT1cTUqw&oe=68366937"
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src="https://scontent.fhan5-6.fna.fbcdn.net/v/t39.30808-6/363413680_823128436049449_7321433174205329713_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=3OsBGXS2dwwQ7kNvwF3k3OP&_nc_oc=Admxxzsow9MYXDmNRSc6fof0eHB6DCKnkNz_z9aEeGa8OYN3EuSZtvE__e6QJ4zsIYE&_nc_zt=23&_nc_ht=scontent.fhan5-6.fna&_nc_gid=iOy9rmCFHORcfGHDLoHSlw&oh=00_AfIiQTZvRFAPWWNtimrooYeu5kWnEV6YhbdT-UTSfWkjkA&oe=68367463"
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src="https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-6/497816409_2112093632637552_7151425510578040793_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1NF9jTVBTYUQ7kNvwFFm6Qf&_nc_oc=AdlnsrpZX5BWb9RijBPkEWtNEMa9J4HhUPbKOv6bYgXwVwaLSngBZXiAPt7F9h35VSw&_nc_zt=23&_nc_ht=scontent.fhan5-9.fna&_nc_gid=KAccUZIHSfUw-hgzL-vgCw&oh=00_AfI3BOvKRH1ibEe3SrAGw6fLYEaUM9OetXDGl-wJcUet3A&oe=683686C7"
            />
          </Tooltip>

          <Tooltip title="tiendev">
            <Avatar alt=""
              src=""
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src=""
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src=""
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src=""
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src=""
            />
          </Tooltip>
          <Tooltip title="tiendev">
            <Avatar alt=""
              src=""
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
