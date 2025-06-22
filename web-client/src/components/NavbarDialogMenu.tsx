import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { getUser, signOut } from "@/utils/auth";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export default function NavbarDialogMenu() {
  const [user, setUser] = useState<User | null>();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      setUser(await getUser());
    }

    fetchUser();
  }, []);

  async function handleSignout() {
    await signOut();
    toast.success("Signed out successfully");
    navigate(0);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-base-100 rounded-full p-3 cursor-pointer">
          <Menu className="text-base-content" />
        </div>
      </DialogTrigger>
      <DialogContent className="bg-base-100 border-base-100">
        <DialogHeader className="mb-5 text-base-content">
          <DialogTitle>My Account</DialogTitle>
        </DialogHeader>
        <div className="min-h-[200px] flex flex-col text-base-content justify-between">
          <div className="flex flex-col gap-2 text-base-content">
            <button
              className="w-fit cursor-pointer font-semibold"
              onClick={() => navigate(`${user?.id}/profile`)}
            >
              Profile
            </button>
            <button
              className="w-fit cursor-pointer font-semibold"
              onClick={() => navigate(`/settings`)}
            >
              Settings
            </button>
            <button
              className="w-fit cursor-pointer font-semibold"
              onClick={handleSignout}
            >
              Sign out
            </button>
          </div>
          <Button className="w-full bg-primary text-primary-foreground">
            Add your business
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
