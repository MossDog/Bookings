import AuthLayout from './AuthLayout'
import SignUpForm from '../../components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <AuthLayout>
      <p className='font-semibold'>Sign Up</p>
      <SignUpForm />
    </AuthLayout>
  )
}
