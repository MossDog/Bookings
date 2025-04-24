import React from 'react';
import { Link } from 'react-router-dom';

let banner_image: string = "src/images/placeholder_banner.webp";
let profile_image: string = "src/images/placeholder_profile.jpg";

const Multiple = () => {
	return (
		<div className="text-center p-5">
			<div className="relative w-full mb-5">
				<img
					src={banner_image}
					alt="Banner Image"
					className="w-full h-[250px] object-cover rounded-lg shadow-lg"
				/>
				<img
					src={profile_image}
					alt="Profile Image"
					className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-md absolute bottom-0 left-0 transform translate-x-1/2 translate-y-1/2"
				/>
			</div>
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