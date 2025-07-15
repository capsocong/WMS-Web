import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from './pages/Settings/Settings'
import Boards from './pages/Boards'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/login' replace />
  }
  return <Outlet/>
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  // Component to handle default redirect based on user role
  const DefaultRedirect = () => {
    return <Navigate to='/boards' replace />
  }

  return (
    <Routes>
      <Route path='/' element={<DefaultRedirect />} />
      {/* ProtectedRoute là những route chỉ cho truy cập sau khi đã login thành công  */}
      <Route element={<ProtectedRoute user={currentUser}/>}>
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} replace={true} />
        <Route path='/boards' element={<Boards />} replace={true} />
        {/* User Profile */}
        <Route path='/settings/account' element={<Settings/>}/>
        <Route path='/settings/security' element={<Settings/>}/>
      </Route>
      {/* Authentication */}
      <Route path='/login' element= {<Auth/>}/>
      <Route path='/register' element= {<Auth/>}/>
      <Route path='/account/verification' element={<AccountVerification/>} />
      {/* 404 Not Found */}
      <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default App
