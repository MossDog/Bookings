import { Link } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="p-5">
			<h1 className="text-3xl font-bold mb-5">Welcome to Bookings</h1>
			<nav className="mb-5">
				<ul className="flex space-x-4">
					<li>
						<Link to="/multiple" className="text-blue-500 hover:underline">
							Multiple
						</Link>
					</li>
					<li>
						<Link to="/single" className="text-blue-500 hover:underline">
							Single
						</Link>
					</li>
				</ul>
			</nav>
			<div>{children}</div>
		</div>
	);
};

export default Layout;