// cấu hình socket.io phía client
// https://socket.io/how-to/use-with-react
import { io } from 'socket.io-client'
import { API_ROOT } from '~/utils/constants'
export const socketIo = io(API_ROOT)