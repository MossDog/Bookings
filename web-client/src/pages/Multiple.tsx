import React from 'react';
import { Link } from 'react-router-dom';
import BannerProfile from '../components/BannerProfile';

const bannerImage = "src/images/placeholder_banner.webp";
const profileImage = "src/images/placeholder_profile.jpg";

const Multiple = () => {
	return (
		<div className="text-center p-5">
			<BannerProfile bannerImage={bannerImage} profileImage={profileImage} />
			<h1 className="text-2xl font-bold mt-10">Multiple Page</h1>
			<p className="text-gray-600">
				This is the multiple page. Here you can find multiple items displayed in a structured format.
			</p>
			<ul className="list-none p-0">
				<li className="mb-2">
					<Link to="/service/haircut" className="text-blue-500 hover:underline">
						Haircut
					</Link>
				</li>
				<li className="mb-2">
					<Link to="/service/coloring" className="text-blue-500 hover:underline">
						Hair Coloring
					</Link>
				</li>
				<li>
					<Link to="/service/styling" className="text-blue-500 hover:underline">
						Hair Styling
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Multiple;