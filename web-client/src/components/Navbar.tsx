import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import { isAuthenticated } from '../utils/authUtils';

export default function Navbar() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function authenticate() {
      setAuthenticated(await isAuthenticated());
    }

    authenticate();
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm min-h-[90px]">
      <div className="navbar-start">
        <Link
          to="/"
          className="text-xl font-semibold tracking-wide hover:opacity-80 transition"
        >
          Bookings
        </Link>
      </div>

      <div className="navbar-end">
        {authenticated ? <UserAvatar /> : <AuthPart />}
      </div>
    </div>
  );
}

function AuthPart() {
  const navigate = useNavigate();

  return (
    <button
      className="text-sm font-medium text-gray-700 hover:text-black transition"
      onClick={() => navigate('/login')}
    >
      Log in
    </button>
  );
}