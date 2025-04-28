import { useState } from 'react';
import BannerProfile from '../components/BannerProfile';
import BookingForm from './BookingForm';

const bannerImage = "src/images/placeholder_banner.webp";
const profileImage = "src/images/placeholder_profile.jpg";

const Single = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<div className="text-center p-5">
			<BannerProfile bannerImage={bannerImage} profileImage={profileImage} />
			<h1 className="text-2xl font-bold mt-10">Single Page</h1>
			<p className="text-gray-600">
				This is the single page. Here you can create a booking for a single service.
			</p>
			<button
				onClick={openModal}
				className="inline-block mt-5 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
			>
				Create Booking
			</button>

			{isModalOpen && (
				<div
					className="fixed inset-0 flex justify-center items-center modal-background"
					onClick={closeModal}
				>
					<div
						className="bg-white p-5 rounded shadow-lg w-96"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={closeModal}
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
						>
							&times;
						</button>
						<BookingForm serviceName="Single Service" />
					</div>
				</div>
			)}
		</div>
	);
};

export default Single;