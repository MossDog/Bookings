import { useState } from "react";
import supabase from "@/utils/supabase";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent.");
      onBack();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 mt-4">
      <input
        type="email"
        placeholder="Your email"
        className="input input-bordered w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="btn btn-primary w-full"
        onClick={handleForgotPassword}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
      <button className="btn btn-ghost w-full" onClick={onBack}>
        Back to Login
      </button>
    </div>
  );
}