import LoginForm from '../../components/auth/LoginForm'
import AuthLayout from './AuthLayout'

export default function LoginPage() {
  return (
    <AuthLayout>
      <p>Login</p>
      <LoginForm />
    </AuthLayout>
  )
}