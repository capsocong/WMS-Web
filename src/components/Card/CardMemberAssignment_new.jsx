import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentActiveBoard, updatedCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { assignMemberToCardAPI, unassignMemberFromCardAPI } from '~/apis'
import { updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function CardMemberAssignment({ card }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const isMenuOpen = Boolean(anchorEl)

  // Kiểm tra user hiện tại có phải owner không
  const isCurrentUserOwner = board?.ownerIds?.some(ownerId => ownerId === currentUser?._id)

  // Lấy danh sách members được assign
  const getAssignedMembers = () => {
    if (!card?.memberIds?.length || !board?.FE_allUsers) return []
    return board.FE_allUsers.filter(user =>
      card.memberIds.includes(user._id)
    )
  }

  // Lấy danh sách members có thể assign (chưa được assign)
  const getAvailableMembers = () => {
    if (!board?.FE_allUsers) return []
    return board.FE_allUsers.filter(user =>
      !card?.memberIds?.includes(user._id)
    )
  }

  const handleOpenMenu = (event) => {
    if (!isCurrentUserOwner) {
      toast.error('Chỉ có chủ sở hữu bảng mới có thể chỉ định thành viên vào thẻ!')
      return
    }
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleAssignMember = async (memberId) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const updatedCard = await assignMemberToCardAPI(card._id, memberId)
      
      // Debug logs để kiểm tra structure
      console.log('API Response - Updated card:', updatedCard)
      console.log('Current card memberIds:', card.memberIds)
      console.log('Updated card memberIds:', updatedCard.memberIds)

      // Cập nhật card trong Redux - cả activeCard và card trong activeBoard
      dispatch(updateCurrentActiveCard(updatedCard))
      dispatch(updatedCardInBoard(updatedCard))

      const assignedMember = board.FE_allUsers.find(user => user._id === memberId)
      toast.success(`Đã chỉ định ${assignedMember?.displayName} vào thẻ`)
      handleCloseMenu()
    } catch (error) {
      console.error('Error assigning member:', error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi chỉ định thành viên!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnassignMember = async (memberId) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const updatedCard = await unassignMemberFromCardAPI(card._id, memberId)
      // Debug logs
      console.log('API Response - Updated card after unassign:', updatedCard)
      console.log('Updated card memberIds:', updatedCard.memberIds)
      // Cập nhật card trong Redux - cả activeCard và card trong activeBoard
      dispatch(updateCurrentActiveCard(updatedCard))
      dispatch(updatedCardInBoard(updatedCard))

      const unassignedMember = board.FE_allUsers.find(user => user._id === memberId)
      toast.success(`Đã hủy chỉ định ${unassignedMember?.displayName} khỏi thẻ`)
    } catch (error) {
      console.error('Error unassigning member:', error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy chỉ định thành viên!')
    } finally {
      setIsLoading(false)
    }
  }

  const assignedMembers = getAssignedMembers()
  const availableMembers = getAvailableMembers()

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Thành viên được chỉ định ({assignedMembers.length})
        </Typography>

        {isCurrentUserOwner && (
          <Tooltip title="Chỉ định thành viên">
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              disabled={isLoading}
            >
              <PersonAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Hiển thị members được assign */}
      {assignedMembers.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {assignedMembers.map(member => (
            <Chip
              key={`assigned-${member._id}`}
              avatar={<Avatar src={member.avatar} sx={{ width: 24, height: 24 }} />}
              label={member.displayName}
              size="small"
              onDelete={isCurrentUserOwner ? () => handleUnassignMember(member._id) : undefined}
              deleteIcon={isCurrentUserOwner ? <PersonRemoveIcon /> : undefined}
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Chưa có thành viên nào được chỉ định
        </Typography>
      )}

      {/* Menu để assign members */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { minWidth: 250, maxHeight: 400 }
        }}
      >
        <MenuItem disabled sx={{ fontWeight: 'bold' }}>
          Chỉ định thành viên
        </MenuItem>
        <Divider />

        {availableMembers.length > 0 ? (
          availableMembers.map(member => (
            <MenuItem
              key={`available-${member._id}`}
              onClick={() => handleAssignMember(member._id)}
              disabled={isLoading}
            >
              <Avatar
                src={member.avatar}
                sx={{ width: 28, height: 28, mr: 1 }}
              />
              <Box>
                <Typography variant="body2">{member.displayName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {member.email}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Tất cả thành viên đã được chỉ định
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default CardMemberAssignment
