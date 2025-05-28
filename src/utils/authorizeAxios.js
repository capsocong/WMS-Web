import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
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
authorizeAxiosInstance.interceptors.response.use((response) => {
  // chặn spam click của người dùng
  interceptorLoadingElements(false)
  return response
}, function (error) {

  // chặn spam click của người dùng
  interceptorLoadingElements(false)
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