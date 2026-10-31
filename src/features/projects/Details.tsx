import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import { applicationsApi, authApi, projectsApi } from "../../services/api";
import { Avatar, SkillBadge, Skeleton, StatusBadge } from "../../components/ui";
import type { Project } from "../../types";

function ApplyModal({ p, onClose, onDone }: { p: Project; onClose: () => void; onDone: () => void }) {
  const rolesWithSlots = p.roles.filter((role) => applicationsApi.getRoleAvailability(p.id, role.name).available > 0);
  const [role, setRole] = useState(rolesWithSlots[0]?.name ?? "");
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok">("idle");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return setErr("Brak dostępnych ról do aplikacji.");
    if (msg.trim().length < 20) return setErr("Napisz co najmniej 20 znaków. Krótka wiadomość nie wystarczy.");
    setState("loading");
    setErr("");

    try {
      await applicationsApi.apply(p.id, role, msg);
      setState("ok");
      onDone();
    } catch (x) {
      setErr((x as Error).message);
      setState("idle");
    }
  };

  if (!rolesWithSlots.length) {
    return (
      <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" onClick={onClose}>
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-bold text-slate-900">Brak dostępnych miejsc</h2>
          <p className="mt-2 text-sm text-slate-600">Wszystkie role w tym projekcie są już pełne.</p>
          <button onClick={onClose} className="mt-5 rounded-lg bg-brand-600 px-4 py-2 text-white">Zamknij</button>
        </div>
      </div>
    );
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="ttl" className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {state === "ok" ? (
          <div className="text-center">
            <p className="text-4xl">🎉</p>
            <h2 id="ttl" className="mt-2 text-xl font-bold">Zgłoszenie wysłane!</h2>
            <p className="mt-1 text-sm text-slate-600">Autor projektu odpowie wkrótce.</p>
            <button onClick={onClose} className="mt-5 rounded-lg bg-brand-600 px-4 py-2 text-white">Zamknij</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <h2 id="ttl" className="text-xl font-bold">Aplikuj do: {p.title}</h2>
            <label className="block text-sm font-medium">
              Rola
              <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2">
                {rolesWithSlots.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Dlaczego chcesz dołączyć?
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 hover:bg-slate-100">Anuluj</button>
              <button disabled={state === "loading"} className="rounded-lg bg-brand-600 px-4 py-2 text-white disabled:opacity-60">
                {state === "loading" ? "Wysyłanie…" : "Wyślij zgłoszenie"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Details() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { data: p, isLoading } = useQuery({ queryKey: ["project", id], queryFn: () => projectsApi.get(id) });
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(applicationsApi.hasApplied(id));

  if (isLoading) return <Skeleton />;
  if (!p) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <p className="text-xl font-bold text-slate-900">Nie znaleziono projektu</p>
        <p className="mt-2 text-sm text-slate-500">Ten projekt nie istnieje albo został usunięty.</p>
        <Link to="/projects" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          <ArrowLeft size={15} /> Wróć do listy
        </Link>
      </div>
    );
  }

  const currentUser = authApi.getCurrentUser();
  const isOwner = currentUser.id === p.owner.id;
  const isMember = p.members.some((member) => member.user.id === currentUser.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800">
        <ArrowLeft size={15} /> Wszystkie projekty
      </Link>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{p.category}</span>
          <StatusBadge s={p.status} />
        </div>

        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{p.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                <Avatar name={p.owner.name} /> {p.owner.name}
              </span>
              <span>·</span>
              <span>{p.university}</span>
              <span>·</span>
              <span>{new Date(p.createdAt).toLocaleDateString("pl-PL")}</span>
            </div>
          </div>

          <button
            disabled={applied || p.status === "closed" || isOwner || isMember || !authApi.isAuthenticated()}
            onClick={() => {
              if (!authApi.isAuthenticated()) {
                navigate("/login", { replace: true });
                return;
              }
              setOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isOwner ? "To Twój projekt" : isMember ? "Jesteś już w zespole" : p.status === "closed" ? "Rekrutacja zamknięta" : applied ? "Zgłoszenie wysłane" : "Aplikuj do projektu"}
          </button>
        </div>

        <p className="mt-6 text-base leading-7 text-slate-700">{p.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Cele i oczekiwane efekty</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
              {p.goals.map((goal) => <li key={goal}>{goal}</li>)}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Wymagane umiejętności</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.skills.map((skill) => <SkillBadge key={skill} s={skill} />)}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Twórca</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={p.owner.name} size={48} />
              <div>
                <p className="font-semibold text-slate-900">{p.owner.name}</p>
                <p className="text-sm text-slate-500">{p.university}</p>
              </div>
            </div>
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800">
                GitHub projektu <ExternalLink size={14} />
              </a>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Otwarte role</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {p.roles.map((role) => {
                const availability = applicationsApi.getRoleAvailability(p.id, role.name);
                return (
                  <li key={role.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                    <span>{role.name}</span>
                    <span className="font-medium text-slate-600">{availability.available}/{role.slots} wolne</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">Zespół</h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <Users size={14} /> {p.members.length} osób
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {p.members.map((member) => (
            <div key={member.user.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <Avatar name={member.user.name} size={40} />
              <div>
                <p className="font-medium text-slate-900">{member.user.name}</p>
                <p className="text-sm text-slate-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {open && <ApplyModal p={p} onClose={() => setOpen(false)} onDone={() => setApplied(true)} />}
    </div>
  );
}
