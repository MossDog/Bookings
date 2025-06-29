export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
  const encodedAddress = encodeURIComponent(address);

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding error:", data);
      return null;
    }
  } catch (error) {
    console.error("Geocoding fetch error:", error);
    return null;
  }
}