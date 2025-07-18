import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CardLabels from '~/components/Card/CardLabels'
import { AccessTime as AccessTimeIcon } from '@mui/icons-material'
import dayjs from 'dayjs'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'


function Card({ card }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })
  
  const dndKitCardStyles = {
    // touchAction: 'none', // Dành cho sensor default dạng PointerSensor
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length || !!card?.dueDate
  }

  const getDueDateChip = () => {
    if (!card?.dueDate) return null

    const now = dayjs()
    const dueDate = dayjs(card.dueDate)
    const diff = dueDate.diff(now, 'hour')

    let color = 'default'
    let text = dueDate.format('DD/MM HH:mm')

    if (diff < 0) {
      color = 'error'
      text = `Quá hạn ${Math.abs(diff)}h`
    } else if (diff < 24) {
      color = 'warning'
      text = `${diff}h còn lại`
    }

    return (
      <Chip
        icon={<AccessTimeIcon />}
        label={text}
        size="small"
        color={color}
        sx={{
          fontSize: '11px',
          height: '20px',
          '& .MuiChip-icon': { fontSize: '12px' }
        }}
      />
    )
  }

  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
  }

  // Lấy thông tin members được assign
  const getAssignedMembers = () => {
    if (!card?.memberIds?.length || !board?.FE_allUsers) return []

    return board.FE_allUsers.filter(user =>
      card.memberIds.includes(user._id)
    ).slice(0, 3) // Chỉ hiển thị tối đa 3 avatars
  }

  const assignedMembers = getAssignedMembers()
  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        borderRadius: '8px',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: (theme) => theme.palette.primary.main,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'none' // Remove bounce effect
        }
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} /> }
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        {/* Hiển thị labels */}
        <CardLabels labels={card?.labels} />
        <Typography sx={{ mb: 1 }}>{card?.title}</Typography>
        {/* Hiển thị ngày hết hạn */}
        {card?.dueDate && (
          <Box sx={{ mb: 1 }}>
            {getDueDateChip()}
          </Box>
        )}
      </CardContent>
      {shouldShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 20, height: 20, fontSize: '0.75rem' } }}>
                {assignedMembers.map(member => (
                  <Avatar
                    key={member._id}
                    src={member.avatar}
                    alt={member.displayName}
                    title={member.displayName}
                  />
                ))}
              </AvatarGroup>
              {card.memberIds.length > 3 && (
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  +{card.memberIds.length - 3}
                </Typography>
              )}
            </Box>
          )}
          {!!card?.comments?.length &&
            <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>
          }
          {!!card?.attachments?.length &&
            <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>
          }
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card