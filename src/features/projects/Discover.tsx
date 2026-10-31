import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { projectsApi } from "../../services/api";
import { EmptyState, ProjectCard, Skeleton } from "../../components/ui";
import { projects } from "../../mocks/data";
import type { Category, ProjectQuery, RecruitmentStatus } from "../../types";

const cats = ["Wszystkie", "Startup", "AI", "Programowanie", "Design", "Gaming", "Nauka", "Inne"] as const;
const unis = [...new Set(projects.map((p) => p.university))].sort();
const skills = [...new Set(projects.flatMap((p) => p.skills))].sort();
const sel = "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none";

export default function Discover() {
  const [params] = useSearchParams();
  const [f, setF] = useState<ProjectQuery>({ q: params.get("q") ?? "", category: "Wszystkie", university: "", skill: "", status: "" });
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const { data, isLoading, isError } = useQuery({ queryKey: ["projects", f], queryFn: () => projectsApi.list(f) });

  const visibleProjects = useMemo(() => {
    if (!data) return [];
    const sorted = [...data];
    if (sortBy === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sortBy === "oldest") sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    if (sortBy === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [data, sortBy]);

  const resetFilters = () => {
    setF({ q: "", category: "Wszystkie", university: "", skill: "", status: "" });
    setSortBy("newest");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand-600">Odkrywaj</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Znajdź projekt, do którego pasujesz.</h1>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            aria-label="Szukaj projektów"
            placeholder="Szukaj po nazwie, opisie lub umiejętnościach…"
            value={f.q}
            onChange={(e) => setF({ ...f, q: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Kategorie">
          {cats.map((c) => (
            <button
              key={c}
              aria-pressed={f.category === c}
              onClick={() => setF({ ...f, category: c as Category | "Wszystkie" })}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                f.category === c ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <select aria-label="Uczelnia" className={sel} value={f.university} onChange={(e) => setF({ ...f, university: e.target.value })}>
            <option value="">Wszystkie uczelnie</option>
            {unis.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>

          <select aria-label="Umiejętności" className={sel} value={f.skill} onChange={(e) => setF({ ...f, skill: e.target.value })}>
            <option value="">Wszystkie umiejętności</option>
            {skills.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select aria-label="Status rekrutacji" className={sel} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as RecruitmentStatus | "" })}>
            <option value="">Każdy status</option>
            <option value="open">Trwa rekrutacja</option>
            <option value="in_progress">W realizacji</option>
            <option value="closed">Zamknięta</option>
          </select>

          <select aria-label="Sortowanie" className={sel} value={sortBy} onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}>
            <option value="newest">Najnowsze</option>
            <option value="oldest">Najstarsze</option>
            <option value="title">Alfabetycznie</option>
          </select>

          <button type="button" onClick={resetFilters} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <X size={14} /> Wyczyść
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
          <SlidersHorizontal size={14} /> Filtry aktywne
        </div>
        <p className="text-sm text-slate-500">{visibleProjects.length} wyników</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} />)}
        {isError && <EmptyState title="Nie udało się pobrać projektów" text="Spróbuj ponownie za chwilę." />}
        {visibleProjects.length === 0 && !isLoading && <EmptyState title="Brak wyników" text="Zmień filtry lub wyszukiwane frazy, aby znaleźć pasujące projekty." />}
        {visibleProjects.map((p) => <ProjectCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
