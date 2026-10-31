import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import type { Project, RecruitmentStatus } from "../types";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 font-bold text-lg" aria-label="BuildTogether – strona główna">
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden><circle cx="10" cy="14" r="8" fill="#7c5cf0" opacity=".9"/><circle cx="18" cy="14" r="8" fill="#4f46e5" opacity=".7"/></svg>
    Build<span className="text-brand-600">Together</span>
  </Link>
);
export const Avatar = ({ name, size = 32 }: { name: string; size?: number }) => (
  <span style={{ width: size, height: size }} className="inline-grid place-items-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-xs font-semibold text-white" aria-hidden>
    {name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
  </span>
);
export const SkillBadge = ({ s }: { s: string }) => <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600">{s}</span>;
const st: Record<RecruitmentStatus, [string, string]> = {
  open: ["Trwa rekrutacja", "bg-emerald-50 text-emerald-700"], in_progress: ["W realizacji", "bg-amber-50 text-amber-700"], closed: ["Rekrutacja zamknięta", "bg-slate-100 text-slate-600"],
};
export const StatusBadge = ({ s }: { s: RecruitmentStatus }) => <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st[s][1]}`}>{st[s][0]}</span>;
export const Skeleton = () => <div className="h-64 animate-pulse rounded-2xl bg-slate-200/70" />;
export const EmptyState = ({ title, text }: { title: string; text: string }) => (
  <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div>
);
export const ProjectCard = ({ p }: { p: Project }) => (
  <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
    <div className="flex items-center justify-between"><span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{p.category}</span><StatusBadge s={p.status} /></div>
    <h3 className="mt-3 text-lg font-semibold leading-snug">{p.title}</h3>
    <p className="mt-1 text-sm text-slate-600">{p.shortDescription}</p>
    <div className="mt-3 flex flex-wrap gap-1.5">{p.skills.map((s) => <SkillBadge key={s} s={s} />)}</div>
    <div className="mt-4 flex items-center gap-2 text-sm"><Avatar name={p.owner.name} /><div><p className="font-medium leading-none">{p.owner.name}</p><p className="text-xs text-slate-500">{p.university}</p></div></div>
    <div className="mt-4 flex items-center justify-between pt-3">
      <span className="flex items-center gap-1 text-sm text-slate-500"><Users size={16} />{p.members.length} os.</span>
      <Link to={`/projects/${p.id}`} className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">Zobacz projekt</Link>
    </div>
  </article>
);
