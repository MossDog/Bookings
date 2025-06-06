import AuthLayout from './AuthLayout'
import SellerSignUpForm from '../../components/auth/SellerSignUpForm'

export default function SignUpPage() {
  return (
    <AuthLayout>
      <p>Sign Up</p>
      <SellerSignUpForm />
    </AuthLayout>
  )
}
