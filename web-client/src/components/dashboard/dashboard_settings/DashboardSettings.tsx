import { Seller } from "@/types/types";
import DeleteProfileModal from "./DeleteProfileModal";

interface DashboardSettingsProps {
  seller: Seller;
}

export default function DashboardSettings({
  seller
}: DashboardSettingsProps) {
  return (
    <div className="col-span-3">
      <DeleteProfileModal sellerName={seller.name}/>
    </div>
  )
}
