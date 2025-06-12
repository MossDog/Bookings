import { Seller } from "@/types/types";
import { Link } from "react-router-dom";

interface SellerCardProps {
  seller: Seller;
}

export default function SellerCard({
  seller
}: SellerCardProps) {
  return (
    <Link
      key={seller.user_id}
      to={`/${seller.user_id}/profile`}
      className="block border rounded-lg p-4 shadow hover:shadow-md transition hover:bg-base-200 bg-base-100 text-base-content"
    >
      <h2 className="text-xl font-semibold mb-1">
        {seller.name || 'Unnamed Business'}
      </h2>

      <p className="text-sm text-base-content/70 mb-2">
        {seller.description || 'No description provided.'}
      </p>

      <p className="text-sm text-base-content/60 mb-1">
        <span className="font-medium">Category:</span> {seller.category || 'N/A'}
      </p>

      <p className="text-sm text-base-content/60 mb-1">
        <span className="font-medium">Address:</span> {seller.address || 'N/A'}
      </p>

      <p className="text-xs text-base-content/40">
        Joined on {new Date(seller.created_at).toLocaleDateString()}
      </p>
    </Link>
  )
}
