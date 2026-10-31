import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { projectsApi } from "../../services/api";
import { EmptyState, ProjectCard, Skeleton } from "../../components/ui";
import { projects } from "../../mocks/data";
import type { Category, ProjectQuery, RecruitmentStatus } from "../../types";

const cats = ["Wszystkie", "Startup", "AI", "Programowanie", "Design", "Gaming", "Nauka", "Inne"] as const;
const unis = [...new Set(projects.map((p) => p.university))].sort();
const skills = [...new Set(projects.flatMap((p) => p.skills))].sort();
const sel = "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm";

export default function Discover() {
  const [params] = useSearchParams();
  const [f, setF] = useState<ProjectQuery>({ q: params.get("q") ?? "", category: "Wszystkie", university: "", skill: "", status: "" });
  const { data, isLoading, isError } = useQuery({ queryKey: ["projects", f], queryFn: () => projectsApi.list(f) });
  return (
    <div>
      <h1 className="text-2xl font-bold">Odkrywaj projekty</h1>
      <p className="text-slate-600">Znajdź zespół, do którego pasują Twoje umiejętności.</p>
      <input aria-label="Szukaj projektów" placeholder="Szukaj po nazwie lub opisie…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} className={`${sel} mt-4 w-full`} />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Kategorie">
        {cats.map((c) => <button key={c} aria-pressed={f.category === c} onClick={() => setF({ ...f, category: c as Category | "Wszystkie" })} className={`rounded-full border px-3 py-1 text-sm ${f.category === c ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white hover:border-brand-500"}`}>{c}</button>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <select aria-label="Uczelnia" className={sel} value={f.university} onChange={(e) => setF({ ...f, university: e.target.value })}><option value="">Wszystkie uczelnie</option>{unis.map((u) => <option key={u}>{u}</option>)}</select>
        <select aria-label="Umiejętności" className={sel} value={f.skill} onChange={(e) => setF({ ...f, skill: e.target.value })}><option value="">Wszystkie umiejętności</option>{skills.map((s) => <option key={s}>{s}</option>)}</select>
        <select aria-label="Status rekrutacji" className={sel} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as RecruitmentStatus | "" })}><option value="">Każdy status</option><option value="open">Trwa rekrutacja</option><option value="in_progress">W realizacji</option><option value="closed">Zamknięta</option></select>
        <span className={`${sel} text-slate-500`}>Sortuj: najnowsze</span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} />)}
        {isError && <EmptyState title="Nie udało się pobrać projektów" text="Spróbuj ponownie za chwilę." />}
        {data?.length === 0 && <EmptyState title="Brak wyników" text="Zmień filtry lub wyszukiwaną frazę." />}
        {data?.map((p) => <ProjectCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
