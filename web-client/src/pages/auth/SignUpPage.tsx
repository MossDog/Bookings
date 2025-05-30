import AuthLayout from './AuthLayout'
import SignUpForm from '../../components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <AuthLayout>
      <p>Sign Up</p>
      <SignUpForm />
    </AuthLayout>
  )
}
