import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { z } from "zod";
import { ProfileCreationData } from "@/utils/sellerProfile";
import ImageSlot from "@/components/image/ImageSlot";
import { useUser } from "@supabase/auth-helpers-react";

// Zod schema for validation
const SellerFormSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  category: z.string().min(1, "Category is required"),
});

interface SellerProfileCreationFormProps {
  onValidData: () => void;
  onInvalidData: () => void;
  setProfileData: Dispatch<SetStateAction<ProfileCreationData>>;
  profileData: ProfileCreationData;
  bannerImage: { file: File | null; previewUrl: string | null };
  setBannerImage: (file: File | null) => void;
  profileImage: { file: File | null; previewUrl: string | null };
  setProfileImage: (file: File | null) => void;
}

function SellerProfileCreationForm({
  onValidData,
  onInvalidData,
  profileData,
  setProfileData,
  bannerImage,
  setBannerImage,
  profileImage,
  setProfileImage,
}: SellerProfileCreationFormProps) {
  const user = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only validate if user exists and form data changes
    if (!user) {
      onInvalidData();
      return;
    }

    try {
      SellerFormSchema.parse(profileData);
      onValidData();
      setError(null); // Clear any previous errors
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
      onInvalidData();
    }
  }, [profileData, user, onInvalidData, onValidData]); // Add all dependencies

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Basic Info Card - Takes up 3 columns on large screens */}
      <div className="lg:col-span-3 h-full space-y-8">
        <div className="card bg-base-100 shadow-md h-full">
          <div className="bg-base-200/50 p-6 border-b border-base-200">
            <h3 className="text-xl font-semibold text-base-content">
              Basic Information
            </h3>
            <p className="text-base-content/70 text-sm mt-1">
              Tell us about your business to help customers find you
            </p>
          </div>

          <div className="card-body p-6 space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Business Name</span>
              </label>
              <input
                name="name"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your business name"
                value={profileData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-32 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Describe your services, experience, and what makes your business unique..."
              />
              <label className="label">
                <span className="label-text-alt text-base-content/70">
                  A compelling description helps attract the right customers
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Business Category
                  </span>
                </label>
                <select
                  name="category"
                  value={profileData.category}
                  onChange={handleInputChange}
                  className="select select-bordered w-full focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="beauty">Beauty & Wellness</option>
                  <option value="health">Health & Fitness</option>
                  <option value="home">Home Services</option>
                  <option value="events">Events & Entertainment</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Business Address
                  </span>
                </label>
                <input
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter your business address"
                />
              </div>
            </div>

            <div className="min-h-[48px] transition-all duration-200">
              {" "}
              <div
                className={`min-h-[3rem] transition-all duration-200 ${error ? "opacity-100" : "opacity-0"}`}
              >
                {error && (
                  <div className="alert alert-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Images Card - Takes up 2 columns on large screens */}
      <div className="lg:col-span-2">
        <div className="card bg-base-100 shadow-md h-full sticky top-4">
          <div className="bg-base-200/50 p-6 border-b border-base-200">
            <h3 className="text-xl font-semibold text-base-content">
              Business Photos
            </h3>
            <p className="text-base-content/70 text-sm mt-1">
              Add photos to showcase your business
            </p>
          </div>

          <div className="card-body p-6 space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Banner Image</span>
                <span className="label-text-alt text-base-content/70">
                  This will appear at the top of your profile
                </span>
              </label>
              <div className="relative w-full h-[200px] rounded-lg bg-base-200 overflow-hidden">
                <ImageSlot
                  imagePreviewUrl={bannerImage.previewUrl}
                  onImageSelected={setBannerImage}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Profile Image</span>
                <span className="label-text-alt text-base-content/70">
                  This will be your business avatar
                </span>
              </label>
              <div className="flex justify-center">
                <div className="w-32 h-32 relative rounded-full overflow-hidden bg-base-200">
                  <ImageSlot
                    imagePreviewUrl={profileImage.previewUrl}
                    onImageSelected={setProfileImage}
                    circle
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerProfileCreationForm;
