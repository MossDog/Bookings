import { useEffect, useState } from "react";
import { fileExistsInBucket, getSupabaseImageUrl } from "../utils/bucket";
import { getUser } from "../utils/auth";
import SellerAvatarDropdown from "./seller/SellerAvatarDropdown";

export default function UserAvatar() {
  const [profileImageSrc, setProfileImageSrc] = useState<string>(
    "no-profile-picture-icon.png",
  );

  useEffect(() => {
    async function fetchProfileImage() {
      const user = await getUser();

      if (!user) {
        return;
      }

      const imageExists = await fileExistsInBucket(
        "public.images",
        `${user.id}/profilepicture`,
      );

      if (imageExists) {
        const imageUrl = getSupabaseImageUrl(user.id, "profileimage");
        setProfileImageSrc(imageUrl);
      }
    }

    fetchProfileImage();
  });

  return (
    <div className="dropdown dropdown-end w-14">
      <div tabIndex={0} role="button" className="w-14 avatar cursor-pointer">
        <div className="rounded-full">
          <img
            src={profileImageSrc}
            alt="Profile"
            className="mask mask-squircle"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu menu-sm z-[1] mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        <SellerAvatarDropdown />
      </ul>
    </div>
  );
}
