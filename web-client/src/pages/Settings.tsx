// Import React hooks for state and effect management
import { useEffect, useState } from 'react';

// Key used for storing theme preference in localStorage
const THEME_KEY = 'theme-preference';
// Available theme options for the user
const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System Default' },
];

// Function to apply the selected theme to the document body
function applyTheme(theme: string) {
  if (theme === 'system') {
    // Remove any explicit theme classes to use system default
    document.body.classList.remove('light', 'dark');
  } else {
    // Remove both theme classes, then add the selected one
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }
}

// Settings page component
export default function Settings() {
  // State to track the selected theme, initialized from localStorage or default to 'system'
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem(THEME_KEY) || 'system';
  });

  // Whenever the theme changes, apply it and save to localStorage
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded shadow space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div>
        {/* Theme selection label */}
        <label htmlFor="theme-select" className="block font-medium mb-2">Theme</label>
        {/* Theme selection dropdown */}
        <select
          id="theme-select"
          className="w-full p-2 border rounded bg-base-100 text-base-content"
          value={theme}
          onChange={e => setTheme(e.target.value)}
        >
          {/* Render each theme option */}
          {themes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}