import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { UserProfile } from "@/types/types";
import { getUserProfile } from "@/utils/user";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Account() {
  const user = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const fetchedProfile = await getUserProfile(user.id);
        setProfile(fetchedProfile);
      } catch (error) {
        console.error("Error fetching profile or bookings:", error);
        toast.error("Failed to load profile or bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return <p className="text-center mt-10">Please log in to view your profile.</p>;
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 space-y-6 bg-base-100 shadow-lg rounded-lg mt-8">
        <h1 className="text-3xl font-bold text-primary mb-4">My Profile</h1>

        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>First Name:</strong> {profile?.first_name || "Not set"}
          </p>
          <p>
            <strong>Last Name:</strong> {profile?.last_name || "Not set"}
          </p>
          <p>
            <strong>Birthday:</strong> {profile?.birthday || "Not set"}
          </p>
        </div>

        <button
          onClick={() => navigate("/reset-password")}
          className="btn btn-outline btn-sm mt-4"
        >
          Reset Password
        </button>

        <hr className="my-6" />
      </div>
    </>
  );
}