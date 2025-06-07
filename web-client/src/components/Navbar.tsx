import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserAvatar from './UserAvatar';
import { isAuthenticated } from '../utils/authUtils';

export default function Navbar() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function authenticate() {
      setAuthenticated(await isAuthenticated());
    }

    authenticate();
  });

  return (
    <div
      className='navbar bg-base-100 shadow-sm min-h-[90px]'
    >
      <div className='navbar-start'>
        <h2 className='text-2xl tracking-wider font-semibold'>Bookings</h2>
      </div>

      <div className='navbar-end'>
        { authenticated ? (
          <UserAvatar/>
        ) : (
          <AuthPart />
        )}
      </div>
    </div>
  )
}

function AuthPart() {
  const navigate = useNavigate();

  return (
    <button 
      className='btn'
      onClick={() => navigate("/login")}
    >
      Log in
    </button>
  )
}