import React, { useState } from "react";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUpForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>(""); // YYYY-MM-DD
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError("Invalid email or password. Please try again.");
      console.error("Error signing up:", signUpError);
      return;
    }

    if (data?.user) {
      const { error: profileError } = await supabase.from("user_profile").insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        birthday,
      });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
    }

    toast.success("Sign-up successful! Please check your email to confirm.");
    navigate("/");
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
          type="text"
          placeholder="First Name"
          className="input input-bordered w-full"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="form-control">
        <input
          type="text"
          placeholder="Last Name"
          className="input input-bordered w-full"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="form-control">
        <input
          type="date"
          placeholder="Birthday"
          className="input input-bordered w-full"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </div>

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
          Sign Up
        </button>
      </div>

      <div className="flex w-full items-center justify-center">
        <span>
          Already have an account?{" "}
          <a href="/login" className="underline">
            Login
          </a>
        </span>
      </div>
    </form>
  );
}