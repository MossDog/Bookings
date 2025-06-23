import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Seller } from "../types/types";
import SellerBrowser from "@/components/home_page/SellerBrowser";
import { getSellers } from "@/utils/seller";
import HeroSection from "@/components/home_page/HeroSection";

export default function HomePage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setSellers(await getSellers());
      } catch (err) {
        setError("Failed to load sellers");
        console.error(err);
      }
    };

    fetchSellers();
  }, []);

  return (
    <div>
      <Navbar />
      {error && <p className="text-error">{error}</p>}
      <main className="container mx-auto px-4 py-8 bg-base-100 text-base-content min-h-screen">
        <HeroSection />
        <SellerBrowser sellers={sellers} />
      </main>
    </div>
  );
}
