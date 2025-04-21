import { useParams } from 'react-router-dom';

const BookingForm = () => {
	const { serviceName } = useParams<{ serviceName: string }>();

	return (
		<div style={{ textAlign: 'center', padding: '20px' }}>
			<h1>Book a Time for {serviceName}</h1>
			<form style={{ display: 'inline-block', textAlign: 'left', marginTop: '20px' }}>
				<div style={{ marginBottom: '10px' }}>
					<label htmlFor="name">Name:</label>
					<input type="text" id="name" name="name" style={{ marginLeft: '10px' }} required />
				</div>
				<div style={{ marginBottom: '10px' }}>
					<label htmlFor="email">Email:</label>
					<input type="email" id="email" name="email" style={{ marginLeft: '10px' }} required />
				</div>
				<div style={{ marginBottom: '10px' }}>
					<label htmlFor="date">Date:</label>
					<input type="date" id="date" name="date" style={{ marginLeft: '10px' }} required />
				</div>
				<div style={{ marginBottom: '10px' }}>
					<label htmlFor="time">Time:</label>
					<input type="time" id="time" name="time" style={{ marginLeft: '10px' }} required />
				</div>
				<button type="submit" style={{ display: 'block', margin: '20px auto' }}>Book Now</button>
			</form>
		</div>
	);
};

export default BookingForm;