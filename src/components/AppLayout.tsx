import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { Bell, Compass, FolderKanban, Inbox, Search, Settings, User as UserIcon, Plus } from "lucide-react";
import { Avatar, Logo } from "./ui";
import { me } from "../services/api";

const nav = [
  { to: "/projects", label: "Odkrywaj projekty", icon: Compass }, { to: "/dashboard", label: "Moje projekty", icon: FolderKanban },
  { to: "/applications", label: "Zgłoszenia", icon: Inbox }, { to: `/profile/${me.username}`, label: "Mój profil", icon: UserIcon }, { to: "/settings", label: "Ustawienia", icon: Settings },
];

const initialNotifications = [
  { id: 1, text: "Anna zaakceptowała Twoje zgłoszenie do projektu AI mentor.", time: "2 min temu", read: false },
  { id: 2, text: "Dziś kończy się rekrutacja do projektu Campus Quest.", time: "1 godz. temu", read: false },
  { id: 3, text: "Nowy komentarz w projekcie „Aplikacja do wspólnych notatek”.", time: "Dziś", read: true },
  { id: 4, text: "Masz 3 nowe powiadomienia z zespołów, do których dołączyłeś.", time: "Wczoraj", read: true },
];

const cls = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`;

export default function AppLayout() {
  const go = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const markOneAsRead = (id: number) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <Logo />
        <form className="relative mx-auto hidden max-w-md flex-1 sm:block" role="search" onSubmit={(e) => { e.preventDefault(); go(`/projects?q=${encodeURIComponent(String(new FormData(e.currentTarget).get("q")))}`); }}>
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input name="q" aria-label="Szukaj" placeholder="Szukaj projektów…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm" />
        </form>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/projects/new" className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"><Plus size={16} /><span className="hidden sm:inline">Utwórz projekt</span></Link>

          <div ref={ref} className="relative">
            <button
              aria-label="Powiadomienia"
              onClick={() => setIsNotificationsOpen((value) => !value)}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark-panel">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-900">Powiadomienia</h2>
                  {unreadCount > 0 && (
                    <button type="button" onClick={markAllAsRead} className="text-xs font-medium text-brand-600 hover:text-brand-700">
                      Odczytaj wszystko
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">Brak nowych powiadomień.</div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => markOneAsRead(item.id)}
                        className={`flex w-full flex-col items-start gap-1 border-b border-slate-200 px-4 py-3 text-left transition ${
                          !item.read ? "bg-brand-50/40" : "bg-white"
                        } notification-item`}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-sm font-medium text-slate-800">{item.text}</span>
                          {!item.read && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" aria-label="Nowe powiadomienie" />}
                        </div>
                        <span className="text-xs text-slate-500">{item.time}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link to={`/profile/${me.username}`} aria-label="Mój profil"><Avatar name={me.name} /></Link>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-60 shrink-0 flex-col gap-1 p-4 md:flex">{nav.map((n) => <NavLink key={n.to} to={n.to} className={cls}><n.icon size={18} />{n.label}</NavLink>)}</aside>
        <main className="min-w-0 flex-1 p-4 pb-24 md:p-8"><Outlet /></main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white p-2 md:hidden" aria-label="Nawigacja mobilna">
        {nav.map((n) => <NavLink key={n.to} to={n.to} aria-label={n.label} className={({ isActive }) => `rounded-lg p-2 ${isActive ? "text-brand-600" : "text-slate-500"}`}><n.icon size={22} /></NavLink>)}
      </nav>
    </div>
  );
}
