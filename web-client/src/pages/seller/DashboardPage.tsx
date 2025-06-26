import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "@/utils/auth";
import { toast } from "sonner";
// import { Button } from "react-day-picker";
import { Button } from "@/components/ui/button";

export default function NavbarDialogMenu() {
  const navigate = useNavigate();

  async function handleSignout() {
    await signOut();
    toast.success("Signed out successfully");
    navigate(0);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-base-100 rounded-full p-3 shadow cursor-pointer hover:bg-base-200 transition">
          <Menu className="text-base-content w-5 h-5" />
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-0 max-w-xs">
        <div className="card bg-base-100 shadow-lg p-6 space-y-4 w-full">
          <h2 className="text-lg font-bold text-base-content">My Account</h2>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/my-account")}
            >
              Account
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/my-bookings")}
            >
              My Bookings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              Settings
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleSignout}
            >
              Sign Out
            </Button>
          </div>

          <Button
            className="w-full mt-4"
            onClick={() => navigate("/profile-creation")}
          >
            Add Your Business
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}