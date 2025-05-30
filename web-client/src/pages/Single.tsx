import { Link } from 'react-router-dom';
import BannerProfile from '../components/BannerProfile';
import BookingForm from './BookingForm';
import GalleryWidget from '../components/GalleryWidget';

const bannerImage = "src/images/placeholder_banner.webp";
const profileImage = "src/images/placeholder_profile.jpg";

const Single = () => {
	return (
		<div className="text-center p-5">
			<div className="w-full mb-5">
				<BannerProfile bannerImage={bannerImage} profileImage={profileImage} />
			</div>

			<div className="flex flex-col lg:flex-row">
				<div className="w-full lg:w-2/3 my-8 lg:my-0 lg:pr-5">
					<GalleryWidget />
				</div>
				<div className="w-full lg:w-1/3">
					<BookingForm />
				</div>
			</div>
		</div>
	);
};

export default Single;