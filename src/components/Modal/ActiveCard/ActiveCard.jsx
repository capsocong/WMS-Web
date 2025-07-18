// import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
// import Divider from '@mui/material/Divider'
// import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
// import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
// import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
// import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
// import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
// import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
// import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
// import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
// import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
// import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
// import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
// import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
// import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
// import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
// import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import CardLabels from '~/components/Card/CardLabels'
import CardMemberAssignment_new from '~/components/Card/CardMemberAssignment'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
// import CardUserGroup from './CardUserGroup'
import CardDescriptionEditor from './CardDescriptionMdEditor'
import CardLabelManager from './CardLabelManager'

// import CardActivitySection from './CardActivitySection'
import { useDispatch, useSelector } from 'react-redux'
import { useConfirm } from 'material-ui-confirm'
import {
  selectCurrentActiveCard,
  clearCurrentActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { styled } from '@mui/material/styles'
import { updateCardDetailAPI, deleteCardAPI } from '~/apis'
import { updatedCardInBoard, deletedCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
// import CardUserGroup from './CardUserGroup'
// import { Pending } from '@mui/icons-material'
// import { Button } from '@mui/material'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const confirmDeleteCard = useConfirm()

  const handleCloseModal = () => {
    dispatch(clearCurrentActiveCard())
  }
  // function dùng chung cho các trường hợp update thông tin của Card
  const callApiUpdateCard = async (updateData) => {
    const updatedCard = await updateCardDetailAPI(activeCard._id, updateData)
    //B1: cập nhật lại card đang active trong modal hien tai
    dispatch(updateCurrentActiveCard(updatedCard))
    //B2: cập nhật lại bản ghi card trong activeBoard (nested data)
    dispatch(updatedCardInBoard(updatedCard))
    return updatedCard
  }
  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }
  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }
  const onUpdateCardLabels = (newLabels) => {
    callApiUpdateCard({ labels: newLabels })
  }
  const onUploadCardCover = (event) => {
    // console.log(event.target?.files[0])
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])
    // Gọi API...
    toast.promise(
      callApiUpdateCard(reqData).finally(() => {
        event.target.value = '',
        { Pending: 'đang tải lên ảnh bìa thẻ...' }
      })

    )
  }

  // Xử lý xóa card
  const handleDeleteCard = () => {
    confirmDeleteCard({
      title: 'Xóa thẻ?',
      description: 'Hành động này sẽ xóa vĩnh viễn thẻ của bạn! Bạn có chắc chắn?',
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy'
    })
      .then(async () => {
        // Gọi API xóa card
        await deleteCardAPI(activeCard._id)
        // Cập nhật Redux store - xóa card khỏi board
        dispatch(deletedCardInBoard(activeCard))
        // Đóng modal
        handleCloseModal()
        // Hiển thị thông báo thành công
        toast.success('Xóa thẻ thành công!')
      })
      .catch(() => {
        // Người dùng hủy, không làm gì
      })
  }

  return (
    <Modal
      disableScrollLock
      open={true}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: 900,
        maxWidth: 900,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>
        {/* Feature 00: Xử lý hiển thị thông tin của Card cover */}

        {activeCard?.cover &&
        <Box sx={{ mb: 4 }}>
          <img
            style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
            src={activeCard?.cover}
            alt="card-cover"
          />
        </Box>
        }

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard.title}
            onChangedValue={onUpdateCardTitle} />
        </Box>

        {/* Hiển thị labels */}
        {activeCard?.labels && activeCard.labels.length > 0 && (
          <Box sx={{ mb: 2, pr: 2.5 }}>
            <CardLabels labels={activeCard.labels} />
          </Box>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              {/* <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Thành viên</Typography> */}

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardMemberAssignment_new card={activeCard} />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Mô tả</Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />

            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {/* <DvrOutlinedIcon /> */}
                {/* <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Hoạt động</Typography> */}
              </Box>
              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              {/* <CardActivitySection /> */}
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Thêm vào thẻ</Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {/* <SidebarItem className="active">
                <PersonOutlineOutlinedIcon fontSize="small" />
                Tham gia
              </SidebarItem> */}
              {/* Feature 06: Xử lý quản lý nhãn của Card */}
              <CardLabelManager
                cardLabels={activeCard?.labels || []}
                onUpdateLabels={onUpdateCardLabels}
              />
              {/* Feature 07: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Ảnh bìa
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>
              {/* <SidebarItem><AttachFileOutlinedIcon fontSize="small" />Đính kèm</SidebarItem> */}
            </Stack>
            {/* <Divider sx={{ my: 2 }} /> */}
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Hành động</Typography>
            <SidebarItem onClick={handleDeleteCard} sx={{
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
                color: 'error.main',
                '& .delete-icon': { color: 'error.main' }
              }
            }}>
              <DeleteForeverIcon className="delete-icon"/>Xóa thẻ
            </SidebarItem>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard