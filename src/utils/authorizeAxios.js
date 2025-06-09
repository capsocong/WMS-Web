import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logOutUserAPI } from '~/redux/user/userSlice'

/* không thể import store from 'redux' theo cách thông thường
  giải pháp: inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
*/

let axiosReduxStore
export const injectStore = (mainStore) => { axiosReduxStore = mainStore }

// khởi tạo một đối tượng Axios để custom và cấu hình
let authorizeAxiosInstance = axios.create()
// thời gian chờ tối đa của 1 request:
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10 // 10 phút
// withCredentials: cho phép Axios gửi cookie trong request
authorizeAxiosInstance.defaults.withCredentials = true
// cấu hình interceptor( bộ đánh chặn giữa request và response)
// Add a request interceptor
authorizeAxiosInstance.interceptors.request.use((config) => {
  // chặn spam click của người dùng
  interceptorLoadingElements(true)
  return config
}, function (error) {
// Do something with request error
  return Promise.reject(error)
})
// Add a response interceptor
// khởi tạo một cái promise cho việc gọi API refresh token
let refreshTokenPromise = null

authorizeAxiosInstance.interceptors.response.use((response) => {
  // chặn spam click của người dùng
  interceptorLoadingElements(false)
  return response
}, function (error) {

  // chặn spam click của người dùng
  interceptorLoadingElements(false)
  // xử lý refresh token tự động
  // b1 nếu là lỗi 401 - UNAUTHORIZED gọi api logOutUserAPI để xóa token trong cookie
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logOutUserAPI(false))
  }
  // b2 nếu là lỗi 410 - GONE gọi api refreshTokenAPI để lấy token mới
  const originalRequest = error.config
  console.log('originalRequest', originalRequest)
  if (error.response?.status === 410 && !originalRequest._retry) {
    originalRequest._retry = true
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // đồng thời accessToken đã nằm trong httpOnly cookie
          return data?.accessToken
        })
        .catch((_error) => {
          // nếu refresh token bị lỗi thì log out luôn
          axiosReduxStore.dispatch(logOutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // dù api gọi thành công hay thất bại thì cũng phải reset promise = null
          refreshTokenPromise = null // reset promise sau khi hoàn thành
        })
    }
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then((accessToken) => {
      // nếu cần lưu accessToken vào localStorage hoặc redux store thì làm ở đây
      // Return lại axio instance kết hợp với originalRequest để gọi lại các Api ban đầu bị lỗi
      return authorizeAxiosInstance(originalRequest)
    })
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // dùng toast để hiển thị lỗi lên màn hình - ngoại trừ mã lỗi 410 - GONE phục vụ việc tự động refresh token
  if (error.response?.status !== 410) {
    toast.error(errorMessage, {
      autoClose: 5000
    })
  }
  return Promise.reject(error)
})
export default authorizeAxiosInstance