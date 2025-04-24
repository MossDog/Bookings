import { useParams } from 'react-router-dom';

const BookingForm = () => {
	const { serviceName } = useParams<{ serviceName: string }>();

	return (
		<div className="text-center p-5">
			<h1 className="text-2xl font-bold">Book a Time for {serviceName}</h1>
			<form className="inline-block text-left mt-5">
				<div className="mb-4">
					<label htmlFor="name" className="block font-medium">
						Name:
					</label>
					<input
						type="text"
						id="name"
						name="name"
						className="border border-gray-300 rounded p-2 w-full"
						required
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="email" className="block font-medium">
						Email:
					</label>
					<input
						type="email"
						id="email"
						name="email"
						className="border border-gray-300 rounded p-2 w-full"
						required
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="date" className="block font-medium">
						Date:
					</label>
					<input
						type="date"
						id="date"
						name="date"
						className="border border-gray-300 rounded p-2 w-full"
						required
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="time" className="block font-medium">
						Time:
					</label>
					<input
						type="time"
						id="time"
						name="time"
						className="border border-gray-300 rounded p-2 w-full"
						required
					/>
				</div>
				<button
					type="submit"
					className="block mx-auto mt-5 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Book Now
				</button>
			</form>
		</div>
	);
};

export default BookingForm;