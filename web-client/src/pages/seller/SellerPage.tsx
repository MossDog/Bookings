import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Seller, Service } from "@/types/types";
import Navbar from "@/components/Navbar";
import MapsWidget from "@/components/MapWidget";
import ServicesWidget from "@/components/widgets/ServicesWidget";
import SellerTitle from "@/components/seller/SellerTitle";
import HighlightWidget from "@/components/widgets/HighlightWidget";
import SellerTitleCard from "@/components/seller/SellerTitleCard";
import { getPublicUrl } from "@/utils/bucket";
import { getProfileFromSlug, updateWidgetOrder } from "@/utils/seller";
import { toast } from "sonner";
import { getServicesFromId } from "@/utils/sellerProfile";
import { getUser } from "@/utils/auth";
import AboutUsWidget from "@/components/AboutUsWidget";
import FAQWidget from "@/components/FAQWidget";
import ReviewsWidget from "@/components/ReviewsWidget";
import {
  moveItemUp,
  moveItemDown,
  ALL_WIDGETS,
} from "@/utils/widgetorder";
import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

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
  const [animatingWidgets, setAnimatingWidgets] = useState<Set<number>>(
    new Set(),
  );
  const widgetRefs = useState(() => new Map<number, HTMLDivElement>())[0];

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
      setServices((await getServicesFromId(data.user_id)) || []);
      setBannerImageUrl(
        (await getPublicUrl("public.images", `${data.user_id}/bannerimage`)) ||
          undefined,
      );
      setProfileImageUrl(
        (await getPublicUrl("public.images", `${data.user_id}/profileimage`)) ||
          undefined,
      );
      const user = await getUser();
      setUserId(user?.id || null);
    };

    fetchSeller().finally(() => setLoading(false));
  }, [slug, navigate]);

  // TODO: Dont need below any more but just leaving it in case lol
  //const hiddenWidgets = ALL_WIDGETS.filter((w) => !widgets.includes(w));
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    setAnimatingWidgets((prev) => new Set([...prev, index, index - 1]));

    // Small delay to allow the animation to start
    setTimeout(() => {
      setWidgets((prev) => moveItemUp(prev, index));

      // Clear animation state and scroll to new position
      setTimeout(() => {
        setAnimatingWidgets((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          newSet.delete(index - 1);
          return newSet;
        });

        // Scroll to the widget's new position (moved up)
        const newPosition = index - 1;
        const targetElement = widgetRefs.get(newPosition);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 100); // Match CSS transition duration
    }, 50);
  };

  const handleMoveDown = async (index: number) => {
    if (index === widgets.length - 1) return;

    setAnimatingWidgets((prev) => new Set([...prev, index, index + 1]));

    // Small delay to allow the animation to start
    setTimeout(() => {
      setWidgets((prev) => moveItemDown(prev, index));

      // Clear animation state and scroll to new position
      setTimeout(() => {
        setAnimatingWidgets((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          newSet.delete(index + 1);
          return newSet;
        });

        // Scroll to the widget's new position (moved down)
        const newPosition = index + 1;
        const targetElement = widgetRefs.get(newPosition);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 100); // Match CSS transition duration
    }, 50);
  };

  const renderWidget = (widget: string) => {
    switch (widget) {
      case "highlight":
        return (
          <HighlightWidget
            key="highlight"
            services={services}
            isLoading={loading}
          />
        );
      case "services":
        return (
          <ServicesWidget
            key="services"
            services={services}
            isLoading={loading}
          />
        );
      case "map":
        return <MapsWidget key="map" seller={seller!} />;
      case "about":
        return (
          <AboutUsWidget
            key="about"
            aboutUs={seller?.about_us}
            isLoading={loading}
          />
        );
      case "faq":
        return <FAQWidget key="faq" seller={seller!} />;
      case "reviews":
        return <ReviewsWidget key="reviews" seller={seller!} />;
      default:
        return null;
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
      />

      <div className="flex flex-col lg:flex-row max-w-[1440px] mx-auto px-4 md:px-10 gap-6 mt-8">
        {seller && (
          <div className="flex-1 max-w-4xl flex flex-col relative gap-6">
            <div className="absolute -top-15">
              {userId === seller.user_id &&
                (!isEditing ? (
                  <button
                    className="btn btn-outline mt-4 self-start"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Widgets
                  </button>
                ) : (
                  <div className="flex gap-2 mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Order"}
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ))}
            </div>
            {/* TODO: Add this functionality in dashboard */}
            {/* {isEditing && hiddenWidgets.length > 0 && (
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
            )} */}{" "}
            {widgets.map((widget, index) => (
              <div
                key={widget}
                ref={(el) => {
                  if (el) {
                    widgetRefs.set(index, el);
                  } else {
                    widgetRefs.delete(index);
                  }
                }}
                className={`relative group gap-2 items-start transition-all duration-300 ease-in-out ${
                  animatingWidgets.has(index)
                    ? "transform scale-105 opacity-90"
                    : ""
                }`}
              >
                {isEditing && (
                  <div className="absolute -left-12 top-8 flex flex-col gap-1">
                    {/* Up arrow */}
                    <button
                      className="btn btn-xs btn-circle btn-outline hover:btn-primary disabled:btn-disabled transition-all duration-200"
                      onClick={() => handleMoveUp(index)}
                      disabled={
                        index === 0 ||
                        animatingWidgets.has(index) ||
                        animatingWidgets.has(index - 1)
                      }
                      title="Move up"
                    >
                      <ArrowUp size={16} />
                    </button>

                    {/* Down arrow */}
                    <button
                      className="btn btn-xs btn-circle btn-outline hover:btn-primary disabled:btn-disabled transition-all duration-200"
                      onClick={() => handleMoveDown(index)}
                      disabled={
                        index === widgets.length - 1 ||
                        animatingWidgets.has(index) ||
                        animatingWidgets.has(index + 1)
                      }
                      title="Move down"
                    >
                      <ArrowDown size={16} />
                    </button>
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
