import React from 'react';

const BannerProfile = ({ bannerImage, profileImage }: { bannerImage: string; profileImage: string }) => {
	return (
		<div className="relative w-full mb-5">
			<img
				src={bannerImage}
				alt="Banner Image"
				className="w-full h-[250px] object-cover rounded-lg shadow-lg"
			/>
			<img
				src={profileImage}
				alt="Profile Image"
				className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-md absolute bottom-0 left-0 transform translate-x-1/2 translate-y-1/2"
			/>
		</div>
	);
};

export default BannerProfile;