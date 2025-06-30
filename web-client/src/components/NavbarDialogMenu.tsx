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
import { signOut } from "@/utils/auth";
import { toast } from "sonner";

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

      <DialogContent className="bg-base-100 border border-base-300 rounded-xl max-w-xs p-6">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-xl font-bold text-base-content">
            My Menu
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/my-account")}
          >
            Account
          </button>

          <button
            className="btn btn-outline w-full"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </button>

          <button
            className="btn btn-outline w-full"
            onClick={() => navigate("/settings")}
          >
            Settings
          </button>

          <button
            className="btn btn-error w-full"
            onClick={() => {
    handleSignout();
    navigate("/profile-creation");
  }}
          >
            Sign out
          </button>
        </div>

        <div className="mt-6">
          <Button
            className="btn btn-primary w-full"
            onClick={() => navigate("/profile-creation")}
          >
            Add Your Business
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}