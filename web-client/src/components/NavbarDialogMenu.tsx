import {
  Dialog,
  DialogContent,
  DialogDescription,
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
        <div className="bg-white rounded-full p-3 cursor-pointer">
          <Menu className="text-[#484848]"/>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle>My Account</DialogTitle>
        </DialogHeader>
        <div className="min-h-[200px] flex flex-col text-[#484848] justify-between">
          <div className="flex flex-col gap-2">
            <button className="w-fit cursor-pointer font-semibold text-[#5d5aff]" onClick={() => navigate(`${user?.id}/profile`)}>Profile</button>
            <button className="w-fit cursor-pointer font-semibold text-[#5d5aff]" onClick={() => navigate(`/settings`)}>Settings</button>
            <button className="w-fit cursor-pointer font-semibold text-[#5d5aff]" onClick={handleSignout}>Sign out</button>
          </div>
          <Button className="w-full bg-[#5d5aff]">Add your business</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
