
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

function ListColumns({ columns, createNewColumn, createNewCard }) {
  const [openNewColumnForm, setNewOpenColumnForm] = useState(false)
  const toggleNewColumnForm = () => setNewOpenColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Vui lòng nhập tiêu đề cho cột mới')
      return
    }
    //Tạo dữ liệu column để gọi api
    const newColumnData = {
      title: newColumnTitle
    }

    await createNewColumn(newColumnData)

    // đóng trạng thái thêm mới & clear input
    toggleNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items={columns?.map((c, index) => c._id || `fallback-${index}`)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {/* box column 01 */}

        {columns?.map(column => <Column key={column._id} column = {column} createNewCard = {createNewCard}/>)}
        {/* {columns?.map((column, index) => {
          console.log('column._id:', column._id) // 👈 Ghi log mỗi column khi render
          return (
            <Column
              key={column._id}
              column={column}
              createNewCard={createNewCard}
            />
          )
        })} */}
        {/* box add new column */}
        {!openNewColumnForm
          ? <Box onClick={toggleNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <Button
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                p: 1
              }}
              startIcon={<NoteAddIcon />}
            >  Add new column
            </Button>
          </Box>
          : <Box sx ={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label='enter column title....'
              type='text'
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root':{
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant='contained' color='success' size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid ',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.light }
                }}
              >Add column
              </Button>
              <CloseIcon
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleNewColumnForm}
                fontSize='small'
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns