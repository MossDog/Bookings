// Import React hooks for state and effect management
import { useEffect, useState } from 'react';

// Key used for storing theme preference in localStorage
const THEME_KEY = 'theme-preference';
// Available theme options for the user
const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
];

// Function to apply the selected theme to the html element for Tailwind/DaisyUI
let systemListener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null = null;
function applyTheme(theme: string) {
  const html = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  // Remove any previous listener
  if (systemListener) {
    media.removeEventListener('change', systemListener);
    systemListener = null;
  }

  if (theme === 'system') {
    // Set according to system preference
    const isDark = media.matches;
    html.classList.toggle('dark', isDark);
    // Add listener for system changes
    systemListener = (e) => {
      html.classList.toggle('dark', e.matches);
    };
    media.addEventListener('change', systemListener);
  } else {
    // Remove the dark class if light, add if dark
    html.classList.toggle('dark', theme === 'dark');
  }
}

// Settings page component
export default function Settings() {
  // State to track the selected theme, initialized from localStorage or default to 'system'
  const [theme, setTheme] = useState<string>(() => {
    // If system was previously selected, default to light
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'system' ? 'light' : (stored || 'light');
  });

  // Whenever the theme changes, apply it and save to localStorage
  useEffect(() => {
    // If theme is system (from old storage), treat as light
    applyTheme(theme === 'system' ? 'light' : theme);
    localStorage.setItem(THEME_KEY, theme === 'system' ? 'light' : theme);
  }, [theme]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded shadow space-y-6" data-theme={theme}>
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div>
        {/* Theme selection label */}
        <label htmlFor="theme-select" className="block font-medium mb-2">Theme</label>
        {/* Theme selection dropdown uses the selected theme */}
        <select
          id="theme-select"
          className="w-full p-2 border rounded"
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
    </div>
  );
}