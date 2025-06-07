import LoginForm from '../../components/auth/LoginForm'
import AuthLayout from './AuthLayout'

export default function LoginPage() {
  return (
    <AuthLayout>
      <p className='font-semibold'>Login</p>
      <LoginForm />
    </AuthLayout>
  )
}