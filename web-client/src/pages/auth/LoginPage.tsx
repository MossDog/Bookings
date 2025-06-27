import { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import AuthLayout from "./AuthLayout";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default function LoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <AuthLayout>
      {showForgotPassword ? (
        <>
          <p className="font-semibold">Forgot Password</p>
          <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
        </>
      ) : (
        <>
          <p className="font-semibold">Login</p>
          <LoginForm />
          <button
            className="link text-primary mt-4"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot your password?
          </button>
        </>
      )}
    </AuthLayout>
  );
}