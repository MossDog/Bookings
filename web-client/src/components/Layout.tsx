import { Link } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<h1>Welcome to Bookings</h1>
			<nav>
				<ul>
					<li><Link to="/multiple">Multiple</Link></li>
					<li><Link to="/single">Single</Link></li>
				</ul>
			</nav>
			<div>{children}</div>
		</div>
	);
};

export default Layout;