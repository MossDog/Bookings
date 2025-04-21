import { Link } from 'react-router-dom';

const Single = () => {
	return (
		<div style={{ textAlign: 'center', padding: '20px' }}>
			<img src="/path-to-image1.jpg" alt="Image 1" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }} />
			<img src="/path-to-image2.jpg" alt="Image 2" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }} />
			<h1>Single Page</h1>
			<p>This is the single page. Here you can create a booking for a single service.</p>
			<Link to="/service/single" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>
				Create Booking
			</Link>
		</div>
	);
};

export default Single;