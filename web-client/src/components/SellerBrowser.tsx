import { Seller } from "@/types/types";
import SellerCard from "./SellerCard";

interface SellerBrowserProps {
  sellers: Seller[];
}

export default function SellerBrowser({
  sellers
}: SellerBrowserProps) {
  return (
    <main className="p-6 bg-base-100 text-base-content">
    <h1 className="text-3xl font-bold mb-6">Explore Businesses</h1>

    

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {sellers.map((seller) => (
        <SellerCard seller={seller}/>
      ))}
    </div>
  </main>
  )
}
