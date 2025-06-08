import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/authUtils';
import { Calendar } from 'lucide-react';
import NavbarDialogMenu from './NavbarDialogMenu';
import { Button } from './ui/button';

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
      className='navbar px-10 bg-[#f3f3f5] drop-shadow-sm min-h-[90px]'
    >
      <div className='navbar-start flex gap-2'>
        <Calendar size={35} className='text-[#5d5aff]' />
        <h2 className='text-2xl font-mono text-[#484848] tracking-wide font-semibold'>bookeo</h2>
      </div>

      <div className='navbar-end'>
        { authenticated ? (
          <NavbarDialogMenu/>
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
    <Button 
      className='text-[#5d5aff] cursor-pointer'
      onClick={() => {navigate("/login")}}
      variant={"link"}
    >
      Login
    </Button>
  )
}