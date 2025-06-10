import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { getUser, signOut } from "@/utils/authUtils"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"

export default function NavbarDialogMenu() {
  const [user, setUser] = useState<User | null>();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser(){
      setUser(await getUser());
    }

    fetchUser();
  }, []);

  async function handleSignout() {
    await signOut();
    navigate(0);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="rounded-full p-3 cursor-pointer">
          <Menu/>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle>My Account</DialogTitle>
        </DialogHeader>
        <div className="min-h-[200px] flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <button className="w-fit cursor-pointer font-semibold" onClick={() => navigate(`${user?.id}/profile`)}>Profile</button>
            <button className="w-fit cursor-pointer font-semibold" onClick={() => navigate(`/settings`)}>Settings</button>
            <button className="w-fit cursor-pointer font-semibold" onClick={handleSignout}>Sign out</button>
          </div>
          <Button className="w-full">Add your business</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
