import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Seller, Service, WorkingHours } from "@/types/types";
import Navbar from "@/components/Navbar";
import MapsWidget from "@/components/MapWidget";
import ServicesWidget from "@/components/widgets/ServicesWidget";
import SellerTitle from "@/components/seller/SellerTitle";
import HighlightWidget from "@/components/widgets/HighlightWidget";
import SellerTitleCard from "@/components/seller/SellerTitleCard";
import { getPublicUrl } from "@/utils/bucket";
import { getProfileFromSlug, updateWidgetOrder } from "@/utils/seller";
import { toast } from "sonner";
import { getServicesFromId, isSellerOpen } from "@/utils/sellerProfile";
import { getUser } from "@/utils/auth";
import AboutUsWidget from "@/components/AboutUsWidget";
import FAQWidget from "@/components/FAQWidget";
import ReviewsWidget from "@/components/ReviewsWidget";
import { addItem, moveItemUp, moveItemDown, moveItemTop, moveItemBottom, removeItem, capitalize } from "@/utils/widgetorder";
import { fetchTable } from "@/utils/dbdao";
import { DateTime } from "luxon";
import { getReviewCount } from "@/utils/reviews";

const ALL_WIDGETS = ["highlight", "services", "map", "about", "faq", "reviews"];

export default function SellerPage() {
  const { slug } = useParams<{ slug: string }>();
  const [seller, setSeller] = useState<Seller | undefined>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | undefined>();
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>();
  const [widgets, setWidgets] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeller = async () => {
      if (!slug) {
        toast.error("URL is invalid");
        navigate("/");
        return;
      }

      const data = await getProfileFromSlug(slug);
      if (!data) {
        toast.error("Business Page not Found");
        navigate("/");
        return;
      }

      setSeller(data);
      setWidgets(data.widget_order || ALL_WIDGETS);
      setServices(await getServicesFromId(data.user_id) || []);
      setBannerImageUrl(await getPublicUrl("public.images", `${data.user_id}/bannerimage`) || undefined);
      setProfileImageUrl(await getPublicUrl("public.images", `${data.user_id}/profileimage`) || undefined);
      const user = await getUser();
      setUserId(user?.id || null);

      const now = DateTime.local();
      const weekday = now.weekday % 7;
      const workingHours = await fetchTable<WorkingHours>("seller_working_hours", {
        user_id: data.user_id,
        day_of_week: weekday,
      });

      setIsOpen(isSellerOpen(now, workingHours));
      setReviewCount(await getReviewCount(data.user_id));
    };

    fetchSeller().finally(() => setLoading(false));
  }, [slug, navigate]);

  const hiddenWidgets = ALL_WIDGETS.filter((w) => !widgets.includes(w));

  const renderWidget = (widget: string) => {
    switch (widget) {
      case "highlight": return <HighlightWidget key="highlight" services={services} isLoading={loading} />;
      case "services": return <ServicesWidget key="services" services={services} isLoading={loading} />;
      case "map": return <MapsWidget key="map" seller={seller!} />;
      case "about": return <AboutUsWidget key="about" aboutUs={seller?.about_us} isLoading={loading} />;
      case "faq": return <FAQWidget key="faq" seller={seller!} />;
      case "reviews": return <ReviewsWidget key="reviews" seller={seller!} />;
      default: return null;
    }
  };

  const handleSave = async () => {
    if (!seller) return;
    setSaving(true);
    const success = await updateWidgetOrder(seller.user_id, widgets);
    if (success) {
      toast.success("Widget order updated");
      setIsEditing(false);
    } else {
      toast.error("Failed to update widget order");
    }
    setSaving(false);
  };

  return (
    <div>
      <Navbar />
      <SellerTitle
        seller={seller}
        bannerUrl={bannerImageUrl}
        profileUrl={profileImageUrl}
        isOpen={isOpen}
        rating={seller?.average_rating || 5}
        reviewCount={reviewCount}
      />
      <div className="flex flex-col lg:flex-row max-w-[1440px] mx-auto px-4 md:px-10 gap-6 mt-8">
        {seller && (
          <div className="flex-1 max-w-4xl flex flex-col gap-6">
            {userId === seller.user_id && (!isEditing ? (
              <button className="btn btn-outline mt-4 self-start" onClick={() => setIsEditing(true)}>Edit Widgets</button>
            ) : (
              <div className="flex gap-2 mt-4">
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Order"}</button>
                <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            ))}

            {isEditing && hiddenWidgets.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="label-text mb-2">Add Widget:</p>
                <div className="flex flex-wrap gap-2">
                  {hiddenWidgets.map((widget) => (
                    <div key={widget} className="badge badge-outline badge-lg cursor-pointer hover:bg-primary hover:text-primary-content" onClick={() => setWidgets((prev) => addItem(prev, widget))}>
                      + {capitalize(widget)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {widgets.map((widget, index) => (
              <div key={widget} className="relative group flex gap-2 items-start">
                {isEditing && (
                  <div className="flex flex-col space-y-1 pt-2">
                    <button className="btn btn-xs btn-outline" onClick={() => setWidgets((prev) => moveItemUp(prev, index))} disabled={index === 0}>↑</button>
                    <button className="btn btn-xs btn-outline" onClick={() => setWidgets((prev) => moveItemDown(prev, index))} disabled={index === widgets.length - 1}>↓</button>
                    <button className="btn btn-xs btn-outline" onClick={() => setWidgets((prev) => moveItemTop(prev, index))} disabled={index === 0}>Top</button>
                    <button className="btn btn-xs btn-outline" onClick={() => setWidgets((prev) => moveItemBottom(prev, index))} disabled={index === widgets.length - 1}>Bottom</button>
                    <button className="btn btn-xs btn-error mt-2" onClick={() => setWidgets((prev) => removeItem(prev, widget))}>Remove</button>
                  </div>
                )}
                <div className="flex-1">{renderWidget(widget)}</div>
              </div>
            ))}
          </div>
        )}

        <div className="hidden lg:block w-full max-w-[460px]">
          <div className="sticky top-28">
            <SellerTitleCard seller={seller} />
          </div>
        </div>
      </div>
    </div>
  );
}