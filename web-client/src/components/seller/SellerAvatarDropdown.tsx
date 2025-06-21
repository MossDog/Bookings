import { useEffect, useState } from "react";
import { getUser, signOut } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

export default function SellerAvatarDropdown() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    async function findUser() {
      setUser(await getUser());
    }

    findUser();
  });

  const handleSignOut = async () => {
    await signOut();
    navigate(0);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <li>
        <button onClick={() => handleNavigation(`${user?.id}/profile`)}>
          Profile
        </button>
      </li>
      <li>
        <button onClick={() => handleNavigation("/settings")}>Settings</button>
      </li>
      <li>
        <button onClick={handleSignOut}>Logout</button>
      </li>
    </>
  );
}
