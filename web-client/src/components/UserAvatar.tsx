import { useEffect, useState } from 'react'
import { fileExistsInBucket, getPublicUrl } from '../utils/bucketUtils';
import { getUser } from '../utils/authUtils';
import SellerAvatarDropdown from './seller/SellerAvatarDropdown';

export default function UserAvatar() {
  const [profileImageSrc, setProfileImageSrc] = useState<string>('no-profile-picture-icon.png');

  useEffect(() => {
    async function fetchProfileImage() {
      const user = await getUser();

      if(!user){
        return;
      }

      const imageExists = await fileExistsInBucket('public.images', `${user.id}/profilepicture`);
    
      if(!imageExists){
        return;
      }

      const imageUrl = await getPublicUrl('public.images', `${user.id}/profilepicture`);

      if(imageUrl){
        setProfileImageSrc(imageUrl);
      }
    }

    fetchProfileImage();
  })

  return (
    <div className="dropdown dropdown-end w-14">
      <div 
        tabIndex={0} 
        role="button" 
        className="w-14 avatar avatar-online cursor-pointer"
      >
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
  )
}
