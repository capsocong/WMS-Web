import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Link, useLocation } from 'react-router-dom'
import SidebarCreateBoardModal from './create'
import EditBoardModal from './EditBoardModal'
import { fetchBoardsAPI, deleteBoardAPI } from '~/apis'
import { styled } from '@mui/material/styles'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'

// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  // Function to get board background style for card cover
  const getBoardCoverStyle = (board) => {
    if (!board) {
      return {
        backgroundColor: '#1976d2' // Default color
      }
    }
    if (board.backgroundType === 'image' && board.backgroundImage) {
      return {
        backgroundImage: `url(${board.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    } else if (board.backgroundType === 'color' && board.backgroundColor) {
      return {
        backgroundColor: board.backgroundColor
      }
    }
    // Default fallback
    return {
      backgroundColor: '#1976d2'
    }
  }

  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null)
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null)

  // State cho dropdown menu
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedBoard, setSelectedBoard] = useState(null)

  // State cho edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [boardToEdit, setBoardToEdit] = useState(null)

  const confirmDeleteBoard = useConfirm()

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation()
  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   */
  const query = new URLSearchParams(location.search)
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
   */
  const page = parseInt(query.get('page') || '1', 10)

  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  // Handlers cho dropdown menu
  const handleMenuOpen = (event, board) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedBoard(board)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedBoard(null)
  }

  const handleEditBoard = () => {
    setBoardToEdit(selectedBoard)
    setIsEditModalOpen(true)
    handleMenuClose()
  }

  const handleDeleteBoard = () => {
    confirmDeleteBoard({
      title: 'Xóa bảng?',
      description: 'Hành động này sẽ xóa vĩnh viễn bảng của bạn! Bạn có chắc chắn?',
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy'
    }).then(async () => {
      await deleteBoardAPI(selectedBoard._id)
      toast.success('Xóa bảng thành công!')
      fetchBoardsAPI(location.search).then(updateStateData)
    }).finally(() => {
      handleMenuClose()
    })
  }
  useEffect(() => {
    // Fake tạm 16 cái item thay cho boards
    // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    // setBoards([...Array(16)].map((_, i) => i))
    // Fake tạm giả sử trong Database trả về có tổng 100 bản ghi boards
    // setTotalBoards(100)
    // console.log(location.search)
    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsAPI(location.search).then(updateStateData)
  }, [location.search])
  const afterCreateNewBoard = () => {
    // fetch lại ds boards
    fetchBoardsAPI(location.search).then(updateStateData)
  }

  const afterUpdateBoard = () => {
    // fetch lại ds boards
    fetchBoardsAPI(location.search).then(updateStateData)
    setIsEditModalOpen(false)
    setBoardToEdit(null)
  }
  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{
        paddingX: 2,
        my: 4
      }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Danh sách bảng
              </SidebarItem>
              {/* <SidebarItem>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem> */}
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
            </Stack>
          </Grid>

          <Grid xs={12} sm={9}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Các bảng của bạn</Typography>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 &&
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>Không tìm thấy bảng!</Typography>
            }

            {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
            {boards?.length > 0 &&
              <Grid container spacing={2}>
                {boards.map(b =>
                  <Grid xs={2} sm={3} md={4} key={b._id}>
                    <Card sx={{ width: '250px', position: 'relative' }}>
                      {/* Ý tưởng mở rộng về sau làm ảnh Cover cho board nhé */}
                      {/* <CardMedia component="img" height="100" image="https://picsum.photos/100" /> */}
                      <Box sx={{
                        height: '100px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-end',
                        ...getBoardCoverStyle(b)
                      }}>
                        {/* Dropdown menu button */}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'white',
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            }
                          }}
                          onClick={(event) => handleMenuOpen(event, b)}
                        >
                          <MoreVertIcon />
                        </IconButton>

                        {/* Title overlay on cover */}
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            p: 2,
                            width: '100%',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                          }}
                        >
                          {b?.title}
                        </Typography>
                      </Box>

                      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {b?.description || 'No description available'}
                        </Typography>
                        <Box
                          component={Link}
                          to={`/boards/${b._id}`}
                          sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'primary.main',
                            '&:hover': { color: 'primary.light' }
                          }}>
                          truy cập bảng <ArrowRightIcon fontSize="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            }

            {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
            {(totalBoards > 0) &&
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  // Giá trị của page hiện tại đang đứng
                  page={page}
                  // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            }
          </Grid>
        </Grid>
      </Box>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleEditBoard}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sửa bảng</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleDeleteBoard}
          sx={{
            '&:hover': {
              color: 'error.main',
              '& .delete-icon': { color: 'error.main' }
            }
          }}
        >
          <ListItemIcon>
            <DeleteIcon className="delete-icon" fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xóa bảng</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Board Modal */}
      <EditBoardModal
        board={boardToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setBoardToEdit(null)
        }}
        afterUpdateBoard={afterUpdateBoard}
      />
    </Container>
  )
}

export default Boards