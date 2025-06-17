import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../utils/supabase";

interface ProfileData {
  profile_url: string;
}

export default function ProfilePicture() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("seller")
        .select("profile_url")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile picture:", error.message);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile?.profile_url) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "220px", // adjust depending on banner height
        left: "20px",
        width: "100px",
        height: "100px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "3px solid white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        backgroundColor: "#fff",
      }}
    >
      <img
        src={profile.profile_url}
        alt="Profile"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
