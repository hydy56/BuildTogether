import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "../components/AppLayout";
import Soon from "../features/misc/Soon";
import { ForgotPassword, Login, Register } from "../features/auth/AuthPages";
const Landing = lazy(() => import("../features/landing/Landing"));
const Discover = lazy(() => import("../features/projects/Discover"));
const Details = lazy(() => import("../features/projects/Details"));
const qc = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={qc}><BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Suspense fallback={<p className="p-8">Ładowanie…</p>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<AppLayout />}>
          <Route path="/projects" element={<Discover />} />
          <Route path="/projects/new" element={<Soon title="Utwórz projekt" />} />
          <Route path="/projects/:id" element={<Details />} />
          <Route path="/dashboard" element={<Soon title="Moje projekty" />} />
          <Route path="/applications" element={<Soon title="Zgłoszenia" />} />
          <Route path="/profile/:username" element={<Soon title="Profil" />} />
          <Route path="/settings" element={<Soon title="Ustawienia" />} />
        </Route>
        <Route path="*" element={<Soon title="Nie znaleziono strony" />} />
      </Routes>
    </Suspense></BrowserRouter></QueryClientProvider>
  );
}
