import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Menu,
  TextField,
  Checkbox,
  IconButton,
  LinearProgress,
  Divider
} from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { styled } from '@mui/material/styles'

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

const ChecklistItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 0',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
  }
}))

function CardChecklistManager({ card, onUpdateChecklist }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [checklistTitle, setChecklistTitle] = useState('')
  const [newItemText, setNewItemText] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [editText, setEditText] = useState('')

  const checklist = card?.checklist || []

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
    setChecklistTitle(card?.checklistTitle || 'Danh sách công việc')
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setNewItemText('')
    setEditingItem(null)
    setEditText('')
  }

  const handleAddItem = () => {
    if (!newItemText.trim()) return

    const newItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    const updatedChecklist = [...checklist, newItem]
    onUpdateChecklist({
      checklist: updatedChecklist,
      checklistTitle: checklistTitle || 'Danh sách công việc'
    })
    setNewItemText('')
  }

  const handleToggleItem = (itemId) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    )
    onUpdateChecklist({
      checklist: updatedChecklist,
      checklistTitle: card?.checklistTitle || 'Danh sách công việc'
    })
  }

  const handleDeleteItem = (itemId) => {
    const updatedChecklist = checklist.filter(item => item.id !== itemId)
    onUpdateChecklist({
      checklist: updatedChecklist,
      checklistTitle: card?.checklistTitle || 'Danh sách công việc'
    })
  }

  const handleEditItem = (item) => {
    setEditingItem(item.id)
    setEditText(item.text)
  }

  const handleSaveEdit = (itemId) => {
    if (!editText.trim()) return

    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, text: editText.trim() } : item
    )
    onUpdateChecklist({
      checklist: updatedChecklist,
      checklistTitle: card?.checklistTitle || 'Danh sách công việc'
    })
    setEditingItem(null)
    setEditText('')
  }

  const getProgress = () => {
    if (checklist.length === 0) return 0
    const completed = checklist.filter(item => item.completed).length
    return (completed / checklist.length) * 100
  }

  const progress = getProgress()

  return (
    <>
      <SidebarItem onClick={handleOpenMenu}>
        <ChecklistIcon fontSize="small" />
        Checklist
      </SidebarItem>

      {/* Hiển thị checklist nếu có */}
      {checklist.length > 0 && (
        <Box sx={{ mt: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {card?.checklistTitle || 'Danh sách công việc'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {checklist.filter(item => item.completed).length}/{checklist.length}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 2,
              height: 6,
              borderRadius: 3,
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }}
          />

          <Box>
            {checklist.map((item) => (
              <ChecklistItem key={item.id}>
                <Checkbox
                  checked={item.completed}
                  onChange={() => handleToggleItem(item.id)}
                  size="small"
                />
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textDecoration: item.completed ? 'line-through' : 'none',
                    opacity: item.completed ? 0.6 : 1
                  }}
                >
                  {item.text}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleEditItem(item)}
                  sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteItem(item.id)}
                  color="error"
                  sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ChecklistItem>
            ))}
          </Box>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            borderRadius: '12px',
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            background: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(46, 46, 46, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Checklist
          </Typography>

          {/* Tiêu đề checklist */}
          <TextField
            label="Tiêu đề"
            value={checklistTitle}
            onChange={(e) => setChecklistTitle(e.target.value)}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Danh sách các items */}
          {checklist.length > 0 && (
            <Box sx={{ mb: 2, maxHeight: 300, overflowY: 'auto' }}>
              {checklist.map((item) => (
                <Box key={item.id} sx={{ mb: 1 }}>
                  {editingItem === item.id ? (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        size="small"
                        fullWidth
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(item.id)
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        size="small"
                        onClick={() => handleSaveEdit(item.id)}
                        variant="contained"
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        ✓
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setEditingItem(null)}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        ✕
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        checked={item.completed}
                        onChange={() => handleToggleItem(item.id)}
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          textDecoration: item.completed ? 'line-through' : 'none',
                          opacity: item.completed ? 0.6 : 1
                        }}
                      >
                        {item.text}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleEditItem(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(item.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Thêm item mới */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              placeholder="Thêm mục mới..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              size="small"
              fullWidth
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddItem()
                }
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAddItem}
              disabled={!newItemText.trim()}
              startIcon={<AddIcon />}
              sx={{ textTransform: 'none' }}
            >
              Thêm
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCloseMenu}
              sx={{ textTransform: 'none' }}
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  )
}

export default CardChecklistManager
