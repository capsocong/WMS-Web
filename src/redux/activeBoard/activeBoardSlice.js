import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// khởi tạo giá trị state của slice trong redux
const initialState = {
  currentActiveBoard: null
}
// những hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, sử dụng Middleware createAsyncThunk
// đi kèm với extraReducers

export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)
// khởi tạo slice trong kho lưu trữ redux
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, actions) => {
    // actions.payload là chuẩn đặt tên nhận dữ liệu vào reducer
      const board = actions.payload

      // xử lý dữ liệu nếu cần thiết

      // update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
    // action.payload là dữ liệu trả về từ api
      let board = action.payload
      // xử lý dữ liệu nếu cần thiết
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      // tao placeholdercard cho cac column
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          let placeholderCard = generatePlaceholderCard(column)
          // tạo card mới cho column
          column.cards = [placeholderCard]
          column.cardOrderIds = [placeholderCard._id]
        } else {
        //sắp xếp thứ tự cards trước khi truyền xuống các component con
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })
      // update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
// Actions là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đông bộ)
// để ý ở trên sẽ không thấy property nào là actions, mà sẽ có property là reducers
// vì redux toolkit đã tự động tạo ra cho chúng ta
export const { updateCurrentActiveBoard } = activeBoardSlice.actions
// selectors là nơi để lấy dữ liệu từ redux store gọi bằng useSelector()
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer

export const activeBoardReducer = activeBoardSlice.reducer