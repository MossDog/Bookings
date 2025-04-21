import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Multiple from './pages/Multiple';
import Single from './pages/Single';
import BookingForm from './pages/BookingForm';

function App() {
	return (
	  <Router>
			<Routes>
				<Route
					path="/"
					element={
						<Layout>
							<div>Welcome to the landing page!</div>
						</Layout>
					}
				/>
				<Route path="/multiple" element={<Multiple />} />
				<Route path="/single" element={<Single />} />
				<Route path="/service/:serviceName" element={<BookingForm />} />
			</Routes>
		</Router>
	);
}

export default App;
