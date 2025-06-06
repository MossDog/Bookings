import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'

import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/auth/LoginPage.tsx'
import SignUpPage from './pages/auth/SignUpPage.tsx'
import ConfirmEmailPage from './pages/ConfirmEmailPage.tsx'
import SellerHomePage from './pages/seller/SellerHomePage.tsx'
import SellerProfile from './pages/SellerProfile.tsx'
import SellerProfileSetupPage from './pages/seller/profile-creation/SellerProfileSetupPage.tsx'

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/login", element: <LoginPage /> },
  { path : "/profile-creation", element: <SellerProfileSetupPage /> },
  { path: "/confirm", element: <ConfirmEmailPage />},
  { path: "/seller-shop", element: <SellerHomePage />},
  { path: "/edit-seller-profile", element: <SellerProfile />}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
