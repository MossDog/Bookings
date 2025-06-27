import { useState } from "react";
import supabase from "@/utils/supabase";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    // Step 1: Check if user has a password
    const { data: profile, error: profileError } = await supabase
      .from("user_profile")
      .select("has_password")
      .eq("id", email)
      .single();

    if (profileError || !profile) {
      toast.error("Account not found.");
      setLoading(false);
      return;
    }

    if (!profile.has_password) {
      toast.error("Password reset is only available for accounts created with email and password.");
      setLoading(false);
      return;
    }

    // Step 2: Send reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent.");
    }

    setLoading(false);
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

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
    </div>
  );
}