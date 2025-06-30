import { useState, useMemo } from 'react'
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
import { selectCurrentActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function CardMemberAssignment({ card }) {
  const [anchorEl, setAnchorEl] = useState(null)
  // const [isLoading, setIsLoading] = useState(false)
  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const activeCard = useSelector(selectCurrentActiveCard)
  const dispatch = useDispatch()

  // Use the most up-to-date card data (either from prop or from Redux if available)
  const currentCard = useMemo(() => {
    // If we're in the modal view and have active card data, use it
    if (activeCard?._id === card._id) {
      return activeCard
    }
    // Otherwise use the card prop passed to this component
    return card
  }, [card, activeCard])

  const isMenuOpen = Boolean(anchorEl)

  // Kiểm tra user hiện tại có phải owner không
  const isCurrentUserOwner = useMemo(() => {
    return board?.ownerIds?.some(ownerId => ownerId === currentUser?._id)
  }, [board?.ownerIds, currentUser?._id])
  // Compute member lists
  const { assignedMembers, availableMembers } = useMemo(() => {
    if (!board?.FE_allUsers) {
      return { assignedMembers: [], availableMembers: [] }
    }

    // For assigned members
    const assigned = board.FE_allUsers.filter(user =>
      (currentCard?.memberIds || []).includes(user._id)
    )

    // For available members
    const available = board.FE_allUsers.filter(user =>
      !(currentCard?.memberIds || []).includes(user._id)
    )

    return { assignedMembers: assigned, availableMembers: available }
  }, [currentCard?.memberIds, board?.FE_allUsers])

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
    // if (isLoading) return
    // setIsLoading(true)

    // Find the member to be assigned for UI feedback
    const memberToAssign = board.FE_allUsers.find(user => user._id === memberId)

    try {
      // Optimistic update - update UI immediately
      const optimisticCard = {
        ...currentCard,
        memberIds: [...(currentCard.memberIds || []), memberId]
      }

      // Update both active card and board card
      dispatch(updateCurrentActiveCard(optimisticCard))
      dispatch(updatedCardInBoard(optimisticCard))

      // Show success message
      toast.success(`Đã chỉ định ${memberToAssign?.displayName} vào thẻ`)

      // Close menu
      handleCloseMenu()

      // Actual API call
      const updatedCard = await assignMemberToCardAPI(currentCard._id, memberId)

      // Update Redux with server response for consistency
      dispatch(updateCurrentActiveCard(updatedCard))
      dispatch(updatedCardInBoard(updatedCard))
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateCurrentActiveCard(currentCard))
      dispatch(updatedCardInBoard(currentCard))

      // Show error message
      toast.error('Có lỗi xảy ra khi chỉ định thành viên!')
    } finally {
      // setIsLoading(false)
    }
  }

  const handleUnassignMember = async (memberId) => {
    // if (isLoading) return
    // setIsLoading(true)

    // Find the member to be unassigned for UI feedback
    const memberToUnassign = board.FE_allUsers.find(user => user._id === memberId)

    try {
      // Optimistic update - update UI immediately
      const optimisticCard = {
        ...currentCard,
        memberIds: (currentCard.memberIds || []).filter(id => id !== memberId)
      }

      // Update both active card and board card
      dispatch(updateCurrentActiveCard(optimisticCard))
      dispatch(updatedCardInBoard(optimisticCard))

      // Show success message
      toast.success(`Đã hủy chỉ định ${memberToUnassign?.displayName} khỏi thẻ`)

      // Actual API call
      const updatedCard = await unassignMemberFromCardAPI(currentCard._id, memberId)

      // Update Redux with server response for consistency
      dispatch(updateCurrentActiveCard(updatedCard))
      dispatch(updatedCardInBoard(updatedCard))
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateCurrentActiveCard(currentCard))
      dispatch(updatedCardInBoard(currentCard))

      // Show error message
      toast.error('Có lỗi xảy ra khi hủy chỉ định thành viên!')
    } finally {
      // setIsLoading(false)
    }
  }

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
              // disabled={isLoading}
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
              // disabled={isLoading}
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
