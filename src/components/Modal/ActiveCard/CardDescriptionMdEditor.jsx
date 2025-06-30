import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import EditNoteIcon from '@mui/icons-material/EditNote'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useTheme } from '@mui/material/styles'

function CardDescriptionEditor({ cardDescriptionProp, handleUpdateCardDescription }) {
  const theme = useTheme()
  // State xử lý chế độ Edit và chế độ View
  const [editMode, setEditMode] = useState(false)
  // State xử lý giá trị description khi chỉnh sửa
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp || '')

  // Cấu hình toolbar cho ReactQuill
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
      ]
    }
  }), [])

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'align', 'link'
  ]

  const updateCardDescription = () => {
    setEditMode(false)
    handleUpdateCardDescription(cardDescription)
  }

  const cancelEdit = () => {
    setEditMode(false)
    setCardDescription(cardDescriptionProp || '')
  }

  return (
    <Box sx={{ mt: 1 }}>
      {editMode ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              '& .ql-toolbar': {
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
              },
              '& .ql-container': {
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                fontSize: '14px'
              },
              '& .ql-editor': {
                minHeight: '200px',
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.87)' : 'rgba(0,0,0,0.87)',
                '&.ql-blank::before': {
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  fontStyle: 'italic'
                }
              }
            }}
          >
            <ReactQuill
              theme="snow"
              value={cardDescription}
              onChange={setCardDescription}
              modules={modules}
              formats={formats}
              placeholder="Thêm mô tả chi tiết hơn..."
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-end' }}>
            <Button
              onClick={cancelEdit}
              variant="outlined"
              size="small"
              startIcon={<CancelIcon />}
              sx={{ textTransform: 'none' }}
            >
              Hủy
            </Button>
            <Button
              onClick={updateCardDescription}
              className="interceptor-loading"
              variant="contained"
              size="small"
              startIcon={<SaveIcon />}
              sx={{ textTransform: 'none' }}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{
              alignSelf: 'flex-end',
              textTransform: 'none'
            }}
            onClick={() => setEditMode(true)}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditNoteIcon />}
          >
            {cardDescription ? 'Chỉnh sửa' : 'Thêm mô tả'}
          </Button>

          {cardDescription ? (
            <Box
              sx={{
                p: 2,
                minHeight: '60px',
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
                },
                '& h1, & h2, & h3': {
                  margin: '0.5em 0',
                  fontWeight: 'bold'
                },
                '& h1': { fontSize: '1.5em' },
                '& h2': { fontSize: '1.3em' },
                '& h3': { fontSize: '1.1em' },
                '& p': {
                  margin: '0.5em 0',
                  lineHeight: 1.6
                },
                '& ul, & ol': {
                  paddingLeft: '1.5em',
                  margin: '0.5em 0'
                },
                '& strong': { fontWeight: 'bold' },
                '& em': { fontStyle: 'italic' },
                '& u': { textDecoration: 'underline' },
                '& s': { textDecoration: 'line-through' },
                '& a': {
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }
              }}
              onClick={() => setEditMode(true)}
              dangerouslySetInnerHTML={{ __html: cardDescription }}
            />
          ) : (
            <Box
              sx={{
                p: 2,
                minHeight: '60px',
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                border: (theme) => `1px dashed ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                  borderColor: (theme) => theme.palette.primary.main
                }
              }}
              onClick={() => setEditMode(true)}
            >
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  fontStyle: 'italic'
                }}
              >
                Nhấp để thêm mô tả chi tiết hơn...
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default CardDescriptionEditor
