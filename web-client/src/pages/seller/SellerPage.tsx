import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Seller, Service } from "../../types/types";
import Navbar from "../../components/Navbar";
import ServicesWidget from "@/components/widgets/ServicesWidget";
import SellerTitle from "@/components/SellerTitle";
import HighlightWidget from "@/components/widgets/HighlightWidget";
import SellerTitleCard from "../../components/SellerTitleCard";
import { getPublicUrl } from "@/utils/bucketUtils";
import {
  getProfileFromSlug,
  getServicesFromId,
} from "@/utils/sellerProfileUtils";

export default function SellerPage() {
  const { slug } = useParams<{ slug: string }>();
  const [seller, setSeller] = useState<Seller | undefined>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [bannerImageUrl, setBannerImageUrl] = useState<string | undefined>(
    undefined,
  );
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    undefined,
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeller = async () => {
      if (!slug) {
        navigate("/");
        return;
      }

      const data = await getProfileFromSlug(slug);

      if (!data) {
        navigate("/");
        return;
      }

      setSeller(data);
      const servs = await getServicesFromId(data.user_id);
      setServices(servs || []);

      const bannerUrl = await getPublicUrl(
        "public.images",
        `${data.user_id}/bannerimage`,
      );
      const profileUrl = await getPublicUrl(
        "public.images",
        `${data.user_id}/profileimage`,
      );

      setBannerImageUrl(bannerUrl || undefined);
      setProfileImageUrl(profileUrl || undefined);
    };

    fetchSeller().then(() => setLoading(false));
  }, [slug]);

  return (
    <div>
      <Navbar />
      <SellerTitle
        seller={seller}
        bannerUrl={bannerImageUrl}
        profileUrl={profileImageUrl}
      />

      <div className="flex flex-col lg:flex-row max-w-[1440px] mx-auto px-4 md:px-10 gap-6 mt-8">
        {/* Left Side: Main Content */}{" "}
        {seller && (
          <div className="flex-1 max-w-4xl">
            <HighlightWidget services={services} isLoading={loading} />
            <ServicesWidget services={services} isLoading={loading} />
          </div>
        )}
        {/* Right Side: Sidebar (hidden on small screens) */}
        <div className="hidden lg:block w-full max-w-[460px]">
          <div className="sticky top-28">
            <SellerTitleCard seller={seller} />
          </div>
        </div>
      </div>
    </div>
  );
}
