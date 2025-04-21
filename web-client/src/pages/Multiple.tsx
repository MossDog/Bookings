import React from 'react';
import { Link } from 'react-router-dom';

const Multiple = () => {
	return (
		<div style={{ textAlign: 'center', padding: '20px' }}>
			<img src="/path-to-image1.jpg" alt="Image 1" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }} />
			<img src="/path-to-image2.jpg" alt="Image 2" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }} />
			<h1>Multiple Page</h1>
			<p>This is the multiple page. Here you can find multiple items displayed in a structured format.</p>
			<ul style={{ listStyleType: 'none', padding: 0 }}>
				<li><Link to="/service/haircut">Haircut</Link></li>
				<li><Link to="/service/coloring">Hair Coloring</Link></li>
				<li><Link to="/service/styling">Hair Styling</Link></li>
			</ul>
		</div>
	);
};

export default Multiple;