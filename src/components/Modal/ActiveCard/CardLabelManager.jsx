import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  TextField,
  Grid
} from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import { fetchDefaultLabelsAPI } from '~/apis'

const ColorOption = styled(Box)(({ selected }) => ({
  width: 30,
  height: 30,
  borderRadius: '50%',
  cursor: 'pointer',
  border: selected ? '3px solid #1976d2' : '2px solid #e0e0e0',
  '&:hover': {
    transform: 'scale(1.1)',
    transition: 'transform 0.2s'
  }
}))

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
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  }
}))

const PRESET_COLORS = [
  '#ff4d4f', '#faad14', '#52c41a', '#1890ff', '#722ed1',
  '#8c8c8c', '#eb2f96', '#f5222d', '#13c2c2', '#a0d911'
]

const DEFAULT_LABELS = [
  { name: 'Khẩn cấp', color: '#ff4d4f' },
  { name: 'Quan trọng', color: '#faad14' },
  { name: 'Hoàn thành', color: '#52c41a' },
  { name: 'Đang tiến hành', color: '#1890ff' },
  { name: 'Chờ xử lý', color: '#722ed1' },
  { name: 'Đã hủy', color: '#8c8c8c' },
  { name: 'Cần review', color: '#eb2f96' },
  { name: 'Bug', color: '#f5222d' },
  { name: 'Feature', color: '#13c2c2' },
  { name: 'Improvement', color: '#a0d911' }
]

function CardLabelManager({ cardLabels = [], onUpdateLabels }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [defaultLabels, setDefaultLabels] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newLabelName, setNewLabelName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])

  useEffect(() => {
    fetchDefaultLabels()
  }, [])

  const fetchDefaultLabels = async () => {
    try {
      setDefaultLabels(labels)
      const labels = await fetchDefaultLabelsAPI()
    } catch (error) {
      // Fallback to static labels if API fails
      setDefaultLabels(DEFAULT_LABELS)
    }
  }

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setShowCreateForm(false)
    setNewLabelName('')
    setSelectedColor(PRESET_COLORS[0])
  }
  const handleSelectLabel = (selectedLabel) => {
    const isLabelAlreadyAdded = cardLabels.some(label =>
      label.name === selectedLabel.name && label.color === selectedLabel.color
    )

    if (!isLabelAlreadyAdded) {
      const updatedLabels = [...cardLabels, selectedLabel]
      onUpdateLabels(updatedLabels)
    }
    handleCloseMenu()
  }

  const handleRemoveLabel = (indexToRemove) => {
    const updatedLabels = cardLabels.filter((_, index) => index !== indexToRemove)
    onUpdateLabels(updatedLabels)
  }
  const handleCreateNewLabel = () => {
    if (newLabelName.trim()) {
      const newLabel = {
        name: newLabelName.trim(),
        color: selectedColor
      }

      const isLabelAlreadyAdded = cardLabels.some(label =>
        label.name === newLabel.name && label.color === newLabel.color
      )

      if (!isLabelAlreadyAdded) {
        const updatedLabels = [...cardLabels, newLabel]
        onUpdateLabels(updatedLabels)
      }

      handleCloseMenu()
    }
  }

  return (
    <>
      <SidebarItem onClick={handleOpenMenu}>
        <LocalOfferIcon fontSize="small" />
        Thêm nhãn
      </SidebarItem>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { width: 300, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quản lý nhãn
          </Typography>

          {/* Hiển thị labels hiện tại của card */}
          {cardLabels.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Nhãn hiện tại:
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5}>
                {cardLabels.map((label, index) => (
                  <Chip
                    key={index}
                    label={label.name}
                    size="small"
                    onDelete={() => handleRemoveLabel(index)}
                    sx={{
                      backgroundColor: label.color,
                      color: '#fff',
                      '& .MuiChip-deleteIcon': {
                        color: '#fff'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Form tạo nhãn mới */}
          {showCreateForm ? (
            <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">Tạo nhãn mới</Typography>
                <IconButton size="small" onClick={() => setShowCreateForm(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Tên nhãn"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" sx={{ mb: 1 }}>Chọn màu:</Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {PRESET_COLORS.map((color) => (
                  <Grid item key={color}>
                    <ColorOption
                      sx={{ backgroundColor: color }}
                      selected={selectedColor === color}
                      onClick={() => setSelectedColor(color)}
                    />
                  </Grid>
                ))}
              </Grid>

              <Button
                fullWidth
                variant="contained"
                size="small"
                onClick={handleCreateNewLabel}
                disabled={!newLabelName.trim()}
              >
                Tạo nhãn
              </Button>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateForm(true)}
              sx={{ mb: 2 }}
            >
              Tạo nhãn mới
            </Button>
          )}

          {/* Danh sách nhãn có sẵn */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Nhãn có sẵn:
          </Typography>          <Stack spacing={0.5}>
            {defaultLabels.map((label, index) => (
              <MenuItem
                key={index}
                onClick={() => handleSelectLabel(label)}
                sx={{ p: 1, borderRadius: 1 }}
              >
                <Chip
                  label={label.name}
                  size="small"
                  sx={{
                    backgroundColor: label.color,
                    color: '#fff',
                    fontWeight: 'bold'
                  }}
                />
              </MenuItem>
            ))}
          </Stack>
        </Box>
      </Menu>
    </>
  )
}

export default CardLabelManager
