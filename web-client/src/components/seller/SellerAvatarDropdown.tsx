import { signOut } from '../../utils/authUtils'
import { useNavigate } from 'react-router-dom';

export default function SellerAvatarDropdown() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate(0);
  }

  const handleNavigation = (path: string) => {
    navigate(path);
  }

  return (
    <>
      <li>
        <button onClick={() => handleNavigation('/profile')}>
          Profile
        </button>
      </li>
      <li>
        <button onClick={() => handleNavigation('/settings')}>
          Settings
        </button>
      </li>
      <li>
        <button onClick={handleSignOut}>
          Logout
        </button>
      </li>
    </>
  )
}
