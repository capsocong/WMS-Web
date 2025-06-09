import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// khởi tạo giá trị state của slice trong redux
const initialState = {
  currentUser: null
}
// những hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, sử dụng Middleware createAsyncThunk
// đi kèm với extraReducers

export const logOutUserAPI = createAsyncThunk(
  'user/logOutUserAPI',
  async (messageSuccess = true) => {
    const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (messageSuccess) {
      // hiển thị thông báo thành công
      toast.success('Logout successfully!', { theme: 'colored' })
    }
    return response.data
  }
)
export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return response.data
  }
)
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
  }
)
// khởi tạo slice trong kho lưu trữ redux
export const userSlice = createSlice({
  name: 'user',
  initialState,

  // nơi xử lý dữ liệu đồng bộ
  reducers: {},

  // nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
    // action.payload là dữ liệu trả về từ api
      const user = action.payload
      // xử lý dữ liệu nếu cần thiết
      state.currentUser = user
    })
    builder.addCase(logOutUserAPI.fulfilled, (state) => {
      // khi đăng xuất thành công thì xóa dữ liệu currentUser
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Action creators are generated for each case reducer function
// Actions là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đông bộ)
// để ý ở trên sẽ không thấy property nào là actions, mà sẽ có property là reducers
// vì redux toolkit đã tự động tạo ra cho chúng ta
// export const {} = userSlice.actions
// selectors là nơi để lấy dữ liệu từ redux store gọi bằng useSelector()
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}


export const userReducer = userSlice.reducer