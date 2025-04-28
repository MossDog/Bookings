import { useState } from 'react';
import BannerProfile from '../components/BannerProfile';
import BookingForm from './BookingForm';

const bannerImage = "src/images/placeholder_banner.webp";
const profileImage = "src/images/placeholder_profile.jpg";

const Multiple = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<string | null>(null);

	const openModal = (serviceName: string) => {
		setSelectedService(serviceName);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setSelectedService(null);
		setIsModalOpen(false);
	};

	return (
		<div className="text-center p-5">
			<BannerProfile bannerImage={bannerImage} profileImage={profileImage} />
			<ul className="list-none p-5 space-y-4">
				{[
					{ name: "Haircut", description: "A professional haircut tailored to your style.", price: "$25" },
					{ name: "Hair Coloring", description: "Expert hair coloring services for a vibrant look.", price: "$50" },
					{ name: "Hair Styling", description: "Get the perfect style for any occasion.", price: "$30" },
					{ name: "Beard Trim", description: "Keep your beard looking sharp and well-groomed.", price: "$15" },
					{ name: "Shampoo & Conditioning", description: "Revitalize your hair with our premium products.", price: "$20" },
					{ name: "Scalp Massage", description: "Relax and rejuvenate with a soothing scalp massage.", price: "$25" },
					{ name: "Blow Dry", description: "Achieve a polished look with our blow-dry service.", price: "$20" },
					{ name: "Updo Styling", description: "Perfect updos for weddings, proms, and special events.", price: "$40" },
					{ name: "Extensions", description: "Add length and volume with our high-quality extensions.", price: "$100" },
					{ name: "Keratin Treatment", description: "Smooth and strengthen your hair with keratin.", price: "$80" },
					{ name: "Perm", description: "Get long-lasting curls or waves with our perm service.", price: "$70" },
					{ name: "Hair Relaxing", description: "Achieve sleek, straight hair with our relaxing treatment.", price: "$60" },
					{ name: "Highlights", description: "Add dimension to your hair with expertly placed highlights.", price: "$75" },
					{ name: "Balayage", description: "A natural, sun-kissed look with our balayage technique.", price: "$90" },
					{ name: "Men's Haircut", description: "Classic and modern cuts tailored for men.", price: "$20" },
					{ name: "Children's Haircut", description: "Fun and stylish cuts for kids of all ages.", price: "$15" },
					{ name: "Hair Detox", description: "Remove buildup and impurities for healthier hair.", price: "$30" },
					{ name: "Hair Mask", description: "Deep conditioning treatment for soft, shiny hair.", price: "$25" },
					{ name: "Braiding", description: "Intricate and stylish braids for any occasion.", price: "$50" },
					{ name: "Hair Consultation", description: "Personalized advice for your hair care needs.", price: "$10" },
				].map((service, index) => (
					<li key={index} className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
						<div className="text-left">
							<h3 className="text-lg font-bold text-blue-500">{service.name}</h3>
							<p className="text-gray-600 text-sm">{service.description}</p>
						</div>
						<div className="text-right">
							<p className="text-lg font-bold text-gray-800">{service.price}</p>
								<button
									onClick={() => openModal(service.name)}
									className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Book Now
								</button>
						</div>
					</li>
				))}
			</ul>

			{isModalOpen && selectedService && (
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
						<BookingForm serviceName={selectedService} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Multiple;