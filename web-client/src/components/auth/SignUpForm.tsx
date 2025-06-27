import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signUpWithProfile } from "@/utils/auth";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signUpWithProfile(email, password, firstName, lastName, birthday);

    setLoading(false);

    if (!result.success) {
      setError(result.error || "An unexpected error occurred.");
      return;
    }

    toast.success("Sign-up successful! Please check your email to confirm.");
    navigate("/");
  };

  return (
    <form className="card-body w-full max-w-md gap-4" onSubmit={onSubmit}>
      {error && <div className="alert alert-error"><span>{error}</span></div>}

      <input
        type="text"
        placeholder="First Name"
        className="input input-bordered w-full"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Last Name"
        className="input input-bordered w-full"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />

      <input
        type="date"
        placeholder="Birthday"
        className="input input-bordered w-full"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        required
      />

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

      <button className="btn btn-primary w-full mt-4" type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <div className="text-center">
        Already have an account? <a href="/login" className="underline">Login</a>
      </div>
    </form>
  );
}