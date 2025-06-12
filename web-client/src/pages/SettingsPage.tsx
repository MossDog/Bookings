// Import React hooks for state and effect management
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Key used for storing theme preference in localStorage
const THEME_KEY = 'theme-preference';
// Available theme options for the user
const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'cupcake', label: 'Cupcake' },
  { value: 'bumblebee', label: 'Bumblebee' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'aqua', label: 'Aqua' },
  { value: 'lofi', label: 'Lofi' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'black', label: 'Black' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'business', label: 'Business' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'caramellatte', label: 'Caramellatte' },
  { value: 'winter', label: 'Winter' },
];

// Settings page component
export default function Settings() {
  const navigate = useNavigate();
  // State to track the selected theme, initialized from localStorage or default to 'system'
  const [theme, setTheme] = useState<string>(() => {
    // If system was previously selected, default to light
    const stored = localStorage.getItem(THEME_KEY);
    return stored || 'light';
  });

  // Whenever the theme changes, apply it and save to localStorage
  useEffect(() => {
    // Remove any previously set data-theme on the html element
    document.documentElement.removeAttribute('data-theme');
    // Set the data-theme attribute globally for DaisyUI/Tailwind
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded shadow space-y-6 bg-base-100 text-base-content" data-theme={theme}>
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div>
        {/* Theme selection label */}
        <label htmlFor="theme-select" className="block font-medium mb-2">Theme</label>
        {/* Theme selection dropdown uses the selected theme */}
        <select
          id="theme-select"
          className="w-full p-2 border rounded bg-base-100 text-base-content"
          value={theme}
          onChange={e => setTheme(e.target.value)}
          data-theme={theme}
        >
          {/* Render each theme option */}
          {themes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Navigation buttons for testing */}
      <div className="flex flex-col gap-2 mt-6">
        <button className="btn btn-primary" onClick={() => navigate('/')}>Home</button>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
        <button className="btn btn-primary" onClick={() => navigate('/sign-up')}>Sign Up</button>
        <button className="btn btn-primary" onClick={() => navigate('/profile-creation')}>Profile Creation</button>
        <button className="btn btn-primary" onClick={() => navigate('/edit-seller-profile')}>Edit Seller Profile</button>
        <button className="btn btn-primary" onClick={() => navigate('/confirm')}>Confirm Email</button>
        {/* Example seller page navigation (replace USER_ID with a real id for real test) */}
        <button className="btn btn-primary" onClick={() => navigate('/test-user-id/profile')}>Seller Page (example)</button>
      </div>
    </div>
  );
}