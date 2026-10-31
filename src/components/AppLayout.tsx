import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { Bell, Compass, FolderKanban, Inbox, Search, Settings, User as UserIcon, Plus } from "lucide-react";
import { Avatar, Logo } from "./ui";
import { me } from "../services/api";

const nav = [
  { to: "/projects", label: "Odkrywaj projekty", icon: Compass }, { to: "/dashboard", label: "Moje projekty", icon: FolderKanban },
  { to: "/applications", label: "Zgłoszenia", icon: Inbox }, { to: `/profile/${me.username}`, label: "Mój profil", icon: UserIcon }, { to: "/settings", label: "Ustawienia", icon: Settings },
];
const cls = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`;

export default function AppLayout() {
  const go = useNavigate();
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
          <button aria-label="Powiadomienia" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><Bell size={18} /></button>
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
