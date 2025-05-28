import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'


const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/login' replace />
  }
  return <Outlet/>
}
function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      {/* Redirect to /boards */}
      <Route path='/' element={<Navigate to='/boards/681d7a1b63a2ee619fd6a63e' />} />
      {/* ProtectedRoute là những route chỉ cho truy cập sau khi đã login thành công  */}
      <Route element={<ProtectedRoute user={currentUser}/>}>
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} replace={true} />
      </Route>
      {/* Authentication */}
      <Route path='/login' element= {<Auth/>}/>
      <Route path='/register' element= {<Auth/>}/>
      <Route path='account/verification' element={<AccountVerification/>} />
      {/* 404 Not Found */}
      <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default App
