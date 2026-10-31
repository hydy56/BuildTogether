import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { applicationsApi, projectsApi } from "../../services/api";
import { Avatar, SkillBadge, Skeleton, StatusBadge } from "../../components/ui";
import type { Project } from "../../types";

function ApplyModal({ p, onClose, onDone }: { p: Project; onClose: () => void; onDone: () => void }) {
  const [role, setRole] = useState(p.roles[0]?.name ?? "");
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok">("idle");
  const [err, setErr] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (msg.trim().length < 20) return setErr("Napisz co najmniej 20 znaków.");
    setState("loading"); setErr("");
    try { await applicationsApi.apply(p.id, role, msg); setState("ok"); onDone(); } catch (x) { setErr((x as Error).message); setState("idle"); }
  };
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="ttl" className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {state === "ok" ? (<div className="text-center"><p className="text-4xl">🎉</p><h2 id="ttl" className="mt-2 text-xl font-bold">Zgłoszenie wysłane!</h2><p className="mt-1 text-sm text-slate-600">Autor projektu odpowie wkrótce.</p><button onClick={onClose} className="mt-5 rounded-lg bg-brand-600 px-4 py-2 text-white">Zamknij</button></div>) : (
          <form onSubmit={submit} className="space-y-4">
            <h2 id="ttl" className="text-xl font-bold">Aplikuj do: {p.title}</h2>
            <label className="block text-sm font-medium">Rola<select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2">{p.roles.map((r) => <option key={r.id}>{r.name}</option>)}</select></label>
            <label className="block text-sm font-medium">Dlaczego chcesz dołączyć?<textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" /></label>
            {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
            <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 hover:bg-slate-100">Anuluj</button><button disabled={state === "loading"} className="rounded-lg bg-brand-600 px-4 py-2 text-white disabled:opacity-60">{state === "loading" ? "Wysyłanie…" : "Wyślij zgłoszenie"}</button></div>
          </form>)}
      </div>
    </div>
  );
}

export default function Details() {
  const { id = "" } = useParams();
  const { data: p, isLoading } = useQuery({ queryKey: ["project", id], queryFn: () => projectsApi.get(id) });
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(applicationsApi.hasApplied(id));
  if (isLoading) return <Skeleton />;
  if (!p) return <p>Nie znaleziono projektu. <Link className="text-brand-600 underline" to="/projects">Wróć do listy</Link></p>;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/projects" className="text-sm text-brand-600">← Wszystkie projekty</Link>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{p.category}</span><StatusBadge s={p.status} /></div>
        <h1 className="mt-3 text-3xl font-bold">{p.title}</h1>
        <div className="mt-3 flex items-center gap-2 text-sm"><Avatar name={p.owner.name} /><span className="font-medium">{p.owner.name}</span><span className="text-slate-500">· {p.university} · {new Date(p.createdAt).toLocaleDateString("pl-PL")}</span></div>
        <p className="mt-5 text-slate-700">{p.description}</p>
        <h2 className="mt-5 font-semibold">Cele i oczekiwane efekty</h2><ul className="mt-2 list-disc pl-5 text-slate-700">{p.goals.map((g) => <li key={g}>{g}</li>)}</ul>
        <h2 className="mt-5 font-semibold">Wymagane umiejętności</h2><div className="mt-2 flex flex-wrap gap-1.5">{p.skills.map((s) => <SkillBadge key={s} s={s} />)}</div>
        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-brand-600 underline">Link zewnętrzny</a>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Otwarte role</h2><ul className="mt-2 space-y-1 text-sm">{p.roles.map((r) => <li key={r.id}>{r.name} <span className="text-slate-500">({r.slots} miejsc)</span></li>)}</ul></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Zespół</h2><ul className="mt-2 space-y-2 text-sm">{p.members.map((m) => <li key={m.user.id} className="flex items-center gap-2"><Avatar name={m.user.name} />{m.user.name} <span className="text-slate-500">· {m.role}</span></li>)}</ul></div>
      </div>
      <button disabled={applied || p.status === "closed"} onClick={() => setOpen(true)} className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:bg-slate-300 sm:w-auto sm:px-8">{applied ? "Zgłoszenie wysłane" : "Aplikuj do projektu"}</button>
      {open && <ApplyModal p={p} onClose={() => setOpen(false)} onDone={() => setApplied(true)} />}
    </div>
  );
}
