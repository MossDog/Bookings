import { Link } from 'react-router-dom';

let banner_image: string = "src/images/placeholder_banner.webp";
let profile_image: string = "src/images/placeholder_profile.jpg";

const Single = () => {
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
			<h1 className="text-2xl font-bold mt-10">Single Page</h1>
			<p className="text-gray-600">
				This is the single page. Here you can create a booking for a single service.
			</p>
			<Link
				to="/service/single"
				className="inline-block mt-5 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
			>
				Create Booking
			</Link>
		</div>
	);
};

export default Single;