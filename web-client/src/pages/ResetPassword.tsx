import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/supabase";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated. Please log in.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn btn-primary w-full"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Updating..." : "Set New Password"}
        </button>
      </div>
    </div>
  );
}