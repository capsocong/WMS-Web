import { createSlice } from '@reduxjs/toolkit'

// khởi tạo giá trị state của slice trong redux
const initialState = {
  currentActiveCard: null
}
// khởi tạo slice trong kho lưu trữ redux
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // nơi xử lý dữ liệu đồng bộ
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload
      state.currentActiveCard = fullCard
    }
  },
  // nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {}
})
// Action creators are generated for each case reducer function
// Actions là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đông bộ)
// để ý ở trên sẽ không thấy property nào là actions, mà sẽ có property là reducers
// vì redux toolkit đã tự động tạo ra cho chúng ta
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

// selectors là nơi để lấy dữ liệu từ redux store gọi bằng useSelector()
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}
// export default activeBoardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer