import React, { useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message || "Sign-up failed. Please try again.");
      console.error("Error signing up:", error);
    } else {
      toast.success("Sign-up successful! Please check your email to confirm.");
      navigate("/");
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      toast.error("Google sign-up failed.");
      console.error("Google sign-up error:", error);
    }
  };

  return (
    <form className="card-body w-full max-w-md gap-4" onSubmit={handleEmailSignUp}>
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        className="input input-bordered w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="input input-bordered w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        className="btn btn-primary w-full mt-4"
        type="submit"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <div className="divider">OR</div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="btn btn-outline w-full"
      >
        Sign Up with Google
      </button>

      <div className="text-center mt-2">
        Already have an account?{" "}
        <a href="/login" className="underline">Login</a>
      </div>
    </form>
  );
}