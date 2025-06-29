import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Seller } from "@/types/types";
import SellerBrowser from "@/components/home_page/SellerBrowser";
import { getSellers } from "@/utils/seller";
import HeroSection from "@/components/home_page/HeroSection";
import { geocodeAddress } from "@/utils/geocoding";

export default function HomePage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showCityPrompt, setShowCityPrompt] = useState(false);
  const [city, setCity] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setSellers(await getSellers());
      } catch (err) {
        setError("Failed to load businesses.");
        console.error(err);
      }
    };

    fetchSellers();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported.");
      setShowCityPrompt(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation denied or error:", err);
        setShowCityPrompt(true);
      }
    );
  }, []);

  const handleCitySubmit = async () => {
    if (!city) return;

    try {
      const geo = await geocodeAddress(city);
      if (geo) {
        setCoords({ lat: geo.lat, lng: geo.lng });
        setShowCityPrompt(false);
      } else {
        alert("Could not locate city. Please check spelling.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      {error && <p className="text-error text-center mt-4">{error}</p>}
      <main className="container mx-auto px-4 py-8 bg-base-100 text-base-content min-h-screen">
        <HeroSection />

        {showCityPrompt && (
          <div className="p-4 bg-base-100 border rounded space-y-2 max-w-md mx-auto mb-6">
            <label className="block font-medium">Enter your city:</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Dublin, Ireland"
            />
            <button className="btn btn-primary w-full mt-2" onClick={handleCitySubmit}>
              Confirm
            </button>
          </div>
        )}

        <SellerBrowser sellers={sellers} coords={coords} />
      </main>
    </div>
  );
}