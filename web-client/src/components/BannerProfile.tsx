import React from 'react';

const BannerProfile = ({ bannerImage, profileImage, name = "Your Boy", bio = "A passionate professional and a proud member of the goon squad." }: { bannerImage: string; profileImage: string; name?: string; bio?: string }) => {
	return (

		<div className="relative w-full mb-25">
			<img
				src={bannerImage}
				alt="Banner Image"
				className="w-full h-[250px] object-cover rounded-lg shadow-lg"
			/>
			<div className="absolute bottom-0 left-0 flex items-center transform translate-x-5 translate-y-1/2">
				<img
					src={profileImage}
					alt="Profile Image"
					className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-md"
				/>
				<div className="ml-4 text-left translate-y-2/3">
					<h1 className="text-xl font-bold">{name}</h1>
					<p className="text-gray-600 line-clamp-2">{bio}</p>
				</div>
			</div>
			<hr className='translate-y-25'/>
		</div>

	);
};

export default BannerProfile;