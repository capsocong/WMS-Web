import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import { Tooltip } from '@mui/material'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'

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
  // Function to get board bar background style like Trello
  const getBoardBarBackgroundStyle = () => {
    if (!board) {
      return {
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(4px)'
      }
    }
    if (board.backgroundType === 'image' && board.backgroundImage) {
      return {
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }
    } else if (board.backgroundType === 'color' && board.backgroundColor) {
      return {
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(4px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }
    }
    // Default background
    return {
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(4px)'
    }
  }

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
      ...getBoardBarBackgroundStyle()
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
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/*mời người dùng vào board */}
        <InviteBoardUser boardId={board._id} />
        {/* hien thi danh sach thanh vien board */}
        <BoardUserGroup boardUsers={board?.FE_allUsers}/>
      </Box>
    </Box>
  )
}

export default BoardBar
