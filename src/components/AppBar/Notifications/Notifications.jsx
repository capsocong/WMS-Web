import { useEffect, useState } from 'react'
import moment from 'moment'
import 'moment/dist/locale/vi' // Import the Vietnamese locale
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInvitationsAPI, updateBoardInvitationAPI, selectCurrentNotifications, addNotifications } from '~/redux/notifications/notificationSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIo } from '~/socketClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const BOARD_INVITATION_STATUS = {
  PENDING: 'đang chờ',
  ACCEPTED: 'đã chấp nhận',
  REJECTED: 'đã từ chối'
}

// Set Vietnamese as default locale
moment.locale('vi')

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    // khi click vào icon thông báo thì se lại trang thái của newNotification về false
    setNewNotification(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const Navigate = useNavigate()
  // lấy thông tin user hiện tại từ redux store
  const currentUser = useSelector(selectCurrentUser)
  // biến state để kiểm tra có thông báo mới hay không
  const [newNotification, setNewNotification] = useState(false)
  // lấy dữ liệu notification từ redux store
  const notifications = useSelector(selectCurrentNotifications)
  // fetch danh sách lời mời từ API
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchInvitationsAPI())
    // tạo một function xử lý để nhận được sự kiện realtime
    // https://socket.io/how-to/use-with-react
    const onReceiveNewInvitation = (invitation) => {
      // nếu như user đăng nhập hiện tại mà chúng ta đang lưu trong redux
      if (invitation.inviteeId === currentUser._id) {
        //thêm bản ghi lời mời vào redux store
        dispatch(addNotifications(invitation))
        //cập nhật trạng thái khi có thông báo đến
        setNewNotification(true)
      }
    }
    // lắng nghe sự kiện realtime từ server gửi về BE_USER_INVITED_TO_BOARD
    socketIo.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    // clean up sự kiện để ngăn chặn việc bị đăng ký lặp lại event
    return () => {
      socketIo.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }
  }, [dispatch, currentUser._id])


  // cập nhật trạng thái của lời mời
  const updateBoardInvitation = (status, invitationId) => {
    // console.log('status: ', status)
    // console.log('status: ', invitationId)
    dispatch(updateBoardInvitationAPI({ status, invitationId }))
      .then((res) => {
        // console.log(res)
        if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
          // Hiển thị thông báo thành công
          toast.success('Đã chấp nhận lời mời thành công!')
          // nếu như chấp nhận lời mời thì sẽ chuyển hướng đến trang board
          Navigate(`/boards/${res.payload.boardInvitation.boardId}`)
        } else if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.REJECTED) {
          // Hiển thị thông báo từ chối
          toast.info('Đã từ chối lời mời.')
        }
      })
  }

  return (
    <Box>
      <Tooltip title="Thông báo">
        <Badge
          color="warning"
          variant={newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{
            color: newNotification ? 'yellow' : 'white'
          }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notifications || notifications.length === 0) &&
        <MenuItem sx={{ minWidth: 200 }}>Bạn không có thông báo mới nào!</MenuItem>}
        {Array.isArray(notifications) && notifications.map((notification, index) =>
          <Box key={index}>
            <MenuItem sx={{
              minWidth: 200,
              maxWidth: 360,
              overflowY: 'auto'
            }}>
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Nội dung của thông báo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box><b>{notification.inviter?.displayName}</b> đã mời bạn tham gia vào bảng <b>{notification.board?.title}</b></Box>
                </Box>
                {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}
                {notification.boardInvitation.status === BOARD_INVITATION_STATUS.PENDING
                &&
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id )}
                  >
                    Từ chối
                  </Button>
                </Box>
                }
                {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                    <Chip icon={<DoneIcon />} label="Đã chấp nhận" color="success" size="small" />
                  }
                  {notification.boardInvitation.status === BOARD_INVITATION_STATUS.REJECTED &&
                    <Chip icon={<NotInterestedIcon />} label="Đã từ chối" size="small" />
                  }
                </Box>

                {/* Thời gian của thông báo */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="span" sx={{ fontSize: '13px' }}>
                    {moment(notification.createdAt).locale('vi').format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
            {index !== (notifications?.length - 1) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
