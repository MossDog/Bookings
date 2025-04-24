import { Link } from 'react-router-dom';
import BannerProfile from '../components/BannerProfile';

const bannerImage = "src/images/placeholder_banner.webp";
const profileImage = "src/images/placeholder_profile.jpg";

const Single = () => {
	return (
		<div className="text-center p-5">
			<BannerProfile bannerImage={bannerImage} profileImage={profileImage} />
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