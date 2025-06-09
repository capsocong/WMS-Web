import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'


// khởi tạo giá trị state của slice trong redux
const initialState = {
  currentNotifications: null
}
// những hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, sử dụng Middleware createAsyncThunk
// đi kèm với extraReducers

export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)
export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)
// khởi tạo slice trong kho lưu trữ redux
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  // nơi xử lý dữ liệu đồng bộ
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotifications: (state, actions) => {
      const incomingInvitation = actions.payload
      state.currentNotifications.unshift(incomingInvitation)
    }
  },
  // nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
    // action.payload là dữ liệu trả về từ api
      let incomingInvitations = action.payload
      state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload
      const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitation._id)
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})
// Action creators are generated for each case reducer function
// Actions là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đông bộ)
// để ý ở trên sẽ không thấy property nào là actions, mà sẽ có property là reducers
// vì redux toolkit đã tự động tạo ra cho chúng ta
export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotifications
} = notificationsSlice.actions
// selectors là nơi để lấy dữ liệu từ redux store gọi bằng useSelector()
export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}

// export default activeBoardSlice.reducer

export const notificationsReducer = notificationsSlice.reducer