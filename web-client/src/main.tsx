import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import supabase from './utils/supabase'

import './index.css'

import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/auth/LoginPage.tsx'
import SignUpPage from './pages/auth/SignUpPage.tsx'
import ConfirmEmailPage from './pages/ConfirmEmailPage.tsx'
import SellerProfileSetupPage from './pages/seller/profile-creation/SellerProfileSetupPage.tsx'
import SellerPage from './pages/seller/SellerPage.tsx'
import Settings from './pages/SettingsPage.tsx'
import AccountPage from './pages/AccountPage.tsx'
import MyBookings from './pages/MyBookings.tsx'

// --- THEME INIT LOGIC ---
const THEME_KEY = 'theme-preference';
const storedTheme = localStorage.getItem(THEME_KEY);
const theme = storedTheme === 'system' ? 'light' : (storedTheme || 'light');
document.documentElement.setAttribute('data-theme', theme);
// --- END THEME INIT LOGIC ---

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/login", element: <LoginPage /> },
  { path : "/profile-creation", element: <SellerProfileSetupPage /> },
  { path: "/:slug", element: <SellerPage />},
  { path: "/confirm", element: <ConfirmEmailPage />},
  { path: "/edit-seller-profile", element: <AccountPage />},
  { path: "/settings", element: <Settings />},
  { path: "/my-bookings", element: <MyBookings />}

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <div className="min-h-screen bg-base-100 text-base-content">
        <RouterProvider router={router} />
      </div>
    </SessionContextProvider>
  </StrictMode>,
)
