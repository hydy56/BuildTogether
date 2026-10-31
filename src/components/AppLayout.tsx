import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { Bell, Compass, FolderKanban, Inbox, LogOut, Search, Settings, User as UserIcon, Plus } from "lucide-react";
import { Avatar, Logo } from "./ui";
import { authApi } from "../services/api";

const currentUser = authApi.getCurrentUser();

const nav = [
  { to: "/projects", label: "Odkrywaj projekty", icon: Compass },
  { to: "/dashboard", label: "Moje projekty", icon: FolderKanban },
  { to: "/applications", label: "Zgłoszenia", icon: Inbox },
  { to: `/profile/${currentUser.username}`, label: "Mój profil", icon: UserIcon },
  { to: "/settings", label: "Ustawienia", icon: Settings },
];

const initialNotifications = [
  { id: 1, text: "Anna zaakceptowała Twoje zgłoszenie do projektu AI mentor.", time: "2 min temu", read: false },
  { id: 2, text: "Dziś kończy się rekrutacja do projektu Campus Quest.", time: "1 godz. temu", read: false },
  { id: 3, text: "Nowy komentarz w projekcie „Aplikacja do wspólnych notatek”.", time: "Dziś", read: true },
  { id: 4, text: "Masz 3 nowe powiadomienia z zespołów, do których dołączyłeś.", time: "Wczoraj", read: true },
];

export default function AppLayout() {
  const go = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.dataset.theme === "dark");
  const [user, setUser] = useState(currentUser);

  useEffect(() => {
    setUser(authApi.getCurrentUser());
  }, []);

  useEffect(() => {
    const syncTheme = () => setIsDarkMode(document.documentElement.dataset.theme === "dark");
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      observer.disconnect();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const cls = ({ isActive }: { isActive: boolean }) => {
    const base = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition";
    if (isActive) {
      return `${base} ${isDarkMode ? "bg-brand-500/15 text-brand-300" : "bg-brand-50 text-brand-700"}`;
    }
    return `${base} ${isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`;
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const markOneAsRead = (id: number) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const handleLogout = async () => {
    await authApi.logout();
    go("/login", { replace: true });
  };

  return (
    <div className="min-h-screen">
      <header className={`sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 backdrop-blur ${isDarkMode ? "border-slate-700 bg-slate-950/85" : "border-slate-200 bg-white/90"}`}>
        <Logo />
        <form
          className="relative mx-auto hidden max-w-md flex-1 sm:block"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const q = String(form.get("q") ?? "");
            go(`/projects?q=${encodeURIComponent(q)}`);
          }}
        >
          <Search className={`absolute left-3 top-2.5 ${isDarkMode ? "text-slate-400" : "text-slate-400"}`} size={16} />
          <input
            name="q"
            aria-label="Szukaj"
            placeholder="Szukaj projektów…"
            className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm ${isDarkMode ? "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-400" : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"}`}
          />
        </form>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/projects/new" className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"><Plus size={16} /><span className="hidden sm:inline">Utwórz projekt</span></Link>

          <div ref={ref} className="relative">
            <button
              aria-label="Powiadomienia"
              onClick={() => setIsNotificationsOpen((value) => !value)}
              className={`relative rounded-lg p-2 transition ${isDarkMode ? "text-slate-200 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className={`absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-2xl border shadow-xl ${isDarkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"}`}>
                <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <h2 className={`text-sm font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>Powiadomienia</h2>
                  {unreadCount > 0 && (
                    <button type="button" onClick={markAllAsRead} className="text-xs font-medium text-brand-500 hover:text-brand-400">
                      Odczytaj wszystko
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className={`p-4 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Brak nowych powiadomień.</div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => markOneAsRead(item.id)}
                        className={`flex w-full flex-col items-start gap-1 border-b px-4 py-3 text-left transition ${
                          isDarkMode ? "border-slate-700 text-slate-100" : "border-slate-200 text-slate-800"
                        } ${!item.read ? (isDarkMode ? "bg-brand-500/10" : "bg-brand-50/40") : isDarkMode ? "bg-slate-900" : "bg-white"}`}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-sm font-medium">{item.text}</span>
                          {!item.read && <span className="h-2.5 w-2.5 rounded-full bg-brand-500" aria-label="Nowe powiadomienie" />}
                        </div>
                        <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{item.time}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/profile/${user.username}`} aria-label="Mój profil"><Avatar name={user.name} /></Link>
            <button type="button" onClick={handleLogout} className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium ${isDarkMode ? "text-slate-200 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`} aria-label="Wyloguj się">
              <LogOut size={16} />
              <span className="hidden sm:inline">Wyloguj</span>
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl">
        <aside className={`sticky top-[57px] hidden h-[calc(100vh-57px)] w-60 shrink-0 flex-col gap-1 p-4 md:flex ${isDarkMode ? "bg-slate-950" : "bg-transparent"}`}>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={cls}>
              <n.icon size={18} />
              {n.label}
            </NavLink>
          ))}
        </aside>
        <main className={`min-w-0 flex-1 p-4 pb-24 md:p-8 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-transparent"}`}><Outlet /></main>
      </div>
      <nav className={`fixed inset-x-0 bottom-0 z-30 flex justify-around border-t p-2 md:hidden ${isDarkMode ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-white"}`} aria-label="Nawigacja mobilna">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} aria-label={n.label} className={({ isActive }) => `rounded-lg p-2 ${isActive ? (isDarkMode ? "text-brand-400" : "text-brand-600") : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            <n.icon size={22} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
