import React, { useState } from "react";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Error logging in:", error);
    } else {
      toast.success("Login successful!");
      navigate("/");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });

    if (error) {
      toast.error("Google sign-in failed.");
      console.error(error);
    }
  };

  return (
    <form className="card-body w-full max-w-md gap-4">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-control">
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-control mt-4">
        <button className="btn btn-primary w-full" onClick={onSubmit}>
          Login
        </button>
      </div>

      <div className="divider">OR</div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="btn btn-outline w-full"
      >
        Continue with Google
      </button>

      <div className="text-center mt-2">
        Don't have an account?{" "}
        <a href="/sign-up" className="underline">
          Sign up
        </a>
      </div>
    </form>
  );
}