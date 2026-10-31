import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "../components/AppLayout";
import Soon from "../features/misc/Soon";
import { ForgotPassword, Login, Register } from "../features/auth/AuthPages";
import { authApi } from "../services/api";

const Landing = lazy(() => import("../features/landing/Landing"));
const Discover = lazy(() => import("../features/projects/Discover"));
const Details = lazy(() => import("../features/projects/Details"));
const NewProject = lazy(() => import("../features/projects/NewProject"));
const Profile = lazy(() => import("../features/profile/Profile"));
const Dashboard = lazy(() => import("../features/dashboard/Dashboard"));
const Applications = lazy(() => import("../features/applications/Applications"));
const Settings = lazy(() => import("../features/settings/Settings"));
const qc = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authApi.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : preferredTheme;
    document.documentElement.dataset.theme = theme;
  }, []);

  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<p className="p-8">Ładowanie…</p>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={authApi.isAuthenticated() ? <Navigate to="/projects" replace /> : <Login />} />
            <Route path="/register" element={authApi.isAuthenticated() ? <Navigate to="/projects" replace /> : <Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/projects" element={<Discover />} />
              <Route path="/projects/new" element={<NewProject />} />
              <Route path="/projects/:id" element={<Details />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Soon title="Nie znaleziono strony" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
