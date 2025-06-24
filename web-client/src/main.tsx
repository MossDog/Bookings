import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import supabase from "./utils/supabase";

import "./index.css";

import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignUpPage from "./pages/auth/SignUpPage.tsx";
import ConfirmEmailPage from "./pages/ConfirmEmailPage.tsx";
import SellerProfileSetupPage from "./pages/seller/profile-creation/SellerProfileSetupPage.tsx";
import SellerPage from "./pages/seller/SellerPage.tsx";
import Settings from "./pages/SettingsPage.tsx";
import ViewUserBookings from "./pages/ViewUserBookings.tsx";
import { theme } from "./utils/theme.ts";
import DashboardPage from "./pages/seller/DashboardPage.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

// Sets the theme
document.documentElement.setAttribute("data-theme", theme);

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/profile-creation", element: <SellerProfileSetupPage /> },
  { path: "/confirm", element: <ConfirmEmailPage /> },
  { path: "/settings", element: <Settings /> },
  { path: "/my-bookings", element: <ViewUserBookings /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/:slug", element: <SellerPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <div className="min-h-screen bg-base-100 text-base-content">
        <RouterProvider router={router} />
        <Toaster 
          richColors={true}
          toastOptions={{
            className: "font-medium rounded-lg shadow-md border",
            duration: 4000,
          }}
        />
      </div>
    </SessionContextProvider>
  </StrictMode>,
);
