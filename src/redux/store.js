// Redux: State management tool

import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'
// cấu hình redux persist
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { notificationsReducer } from './notifications/notificationSlice'

const rootPersistConfig = {
  key: 'root', // key của persist do mình chỉ định là 'root'
  storage: storage, // biến storage - lưu vào localStorage
  whiteList: ['user'] // định nghĩa các slide được lưu trữ mỗi lần f5 trình duyệt
  // blackList: [] // định nghĩa các slide không được lưu trữ mỗi lần f5 trình duyệt
}
// combie các reducer trong dự án
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer
})
// thực hiện persistReducer
const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,

  // fix bug hook.js:608 A non-serializable value was detected in an action
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false //tắt kiểm tra tính tuần tự của các giá trị trong action
  })
})