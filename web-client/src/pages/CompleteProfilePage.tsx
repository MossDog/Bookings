import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/supabase";
import { toast } from "sonner";

export default function CompleteProfilePage() {
  const user = useUser();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");

  useEffect(() => {
    if (!user) return;
    const [first = "", last = ""] = (user.user_metadata?.full_name || "").split(" ");
    setFirstName(first);
    setLastName(last);
  }, [user]);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !birthday) {
      toast.error("Please fill all fields.");
      return;
    }

    const { error } = await supabase.from("user_profile").insert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      birthday,
    });

    if (error) toast.error("Failed to save profile.");
    else {
      toast.success("Profile completed!");
      navigate("/");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 bg-base-100 shadow">
      <h1 className="text-2xl font-bold">Complete Your Profile</h1>
      <input
        type="text"
        placeholder="First Name"
        className="input input-bordered w-full"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        className="input input-bordered w-full"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="date"
        className="input input-bordered w-full"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      />
      <button className="btn btn-primary w-full" onClick={handleSubmit}>
        Save & Continue
      </button>
    </div>
  );
}