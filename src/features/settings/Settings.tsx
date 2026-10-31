import { Bell, LockKeyhole, MoonStar, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { authApi, usersApi } from "../../services/api";

export default function Settings() {
  const currentUser = authApi.getCurrentUser();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.dataset.theme === "dark" || localStorage.getItem("theme") === "dark";
  });
  const [form, setForm] = useState({
    name: currentUser.name,
    university: currentUser.university,
    email: currentUser.username ? `${currentUser.username}@demo.local` : "demo@buildtogether.dev",
    bio: "Lubię budować produkty, szkolić się w UX i pracować nad prostymi, ale mocnymi rozwiązaniami.",
  });

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [isDark]);

  const handleSave = async () => {
    await usersApi.updateMe({
      name: form.name,
      university: form.university,
      skills: currentUser.skills,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-600">Ustawienia</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Twoje ustawienia</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Profil</h2>

          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Imię i nazwisko</span>
              <input
                value={form.name}
                onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Adres e-mail</span>
              <input
                value={form.email}
                onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Uczelnia</span>
              <input
                value={form.university}
                onChange={(event) => setForm((value) => ({ ...value, university: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Bio</span>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(event) => setForm((value) => ({ ...value, bio: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white"
              />
            </label>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Preferencje</h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <Bell className="text-brand-600" size={18} />
                  <span className="text-sm font-medium text-slate-700">Powiadomienia e-mail</span>
                </div>
                <button className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Włączone</button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <MoonStar className="text-brand-600" size={18} />
                  <span className="text-sm font-medium text-slate-700">Tryb ciemny</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDark((value) => !value)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    isDark ? "border-brand-500 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {isDark ? "Włączony" : "Wyłączony"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Bezpieczeństwo</h2>

            <div className="mt-5 space-y-4">
              <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100">
                <span className="flex items-center gap-3"><LockKeyhole size={18} className="text-brand-600" />Zmień hasło</span>
              </button>

              <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100">
                <span className="flex items-center gap-3"><ShieldCheck size={18} className="text-brand-600" />Dwa etapy</span>
              </button>

              <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100">
                <span className="flex items-center gap-3"><UserRound size={18} className="text-brand-600" />Zarządzaj kontem</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Zmiany w profilu</h2>
          <p className="text-sm text-slate-500">Zapisywane są lokalnie w demo.</p>
        </div>

        <button onClick={handleSave} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
          Zapisz ustawienia
        </button>
      </div>
    </div>
  );
}
