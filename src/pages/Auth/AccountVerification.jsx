import { useState, useEffect } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis/index'
function AccountVerification() {
  // lấy giá trị search params từ URL
  let [searchParams] = useSearchParams()
  //   console.log('🚀 ~ AccountVerification ~ searchParams:', searchParams)
  //   const email = searchParams.get('email')
  //   const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])
  // tao mot bien state de biet duoc la da verify tai khoan hay chua
  const [isVerified, setIsVerified] = useState(false)
  //goi api verify tai khoan
  useEffect( () => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {setIsVerified(true)})
    }
  }, [email, token])
  // neu email hoac token khong ton tai thi redirect ve trang 404
  if (!email || !token) {
    return <Navigate to='/404' />
  }
  // neu chua verify tai khoan xong thi hien thi loading
  if (!isVerified) {
    return <PageLoadingSpinner caption='Verifying your account...' />
  }
  return (
    <Navigate to={`/login?verifiedEmail=${email}`} />
  )
}

export default AccountVerification