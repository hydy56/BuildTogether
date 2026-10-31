import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { applicationsApi, projectsApi } from "../../services/api";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border border-rose-200",
} as const;

const statusLabels = {
  pending: "W trakcie rozpatrywania",
  accepted: "Zaakceptowane",
  rejected: "Odrzucone",
} as const;

export default function Applications() {
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => projectsApi.list() });
  const { data: applications = [] } = useQuery({ queryKey: ["applications"], queryFn: () => applicationsApi.list() });

  const items = applications.map((application) => {
    const project = projects.find((item) => item.id === application.projectId);
    return { ...application, project };
  });

  const accepted = items.filter((item) => item.status === "accepted").length;
  const pending = items.filter((item) => item.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-600">Zgłoszenia</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Twoje zgłoszenia</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">W toku</p>
            <Clock3 className="text-amber-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{pending}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Zaakceptowane</p>
            <CheckCircle2 className="text-emerald-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{accepted}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Łącznie</p>
            <ArrowUpRight className="text-brand-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{items.length}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">Historia zgłoszeń</h2>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {items.length} wpisów
          </span>
        </div>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Nie wysłałeś jeszcze żadnego zgłoszenia do projektów.
            </div>
          ) : (
            items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
                        {item.project?.category ?? "Projekt"}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}>
                        {statusLabels[item.status]}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.project?.title ?? "Projekt"}</h3>
                    <p className="mt-2 text-sm text-slate-600">Rola: {item.role}</p>
                    <p className="mt-2 text-sm text-slate-600">Wiadomość: “{item.message}”</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {item.project ? (
                      <Link
                        to={`/projects/${item.project.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Zobacz projekt
                        <ArrowUpRight size={15} />
                      </Link>
                    ) : (
                      <span className="rounded-lg bg-slate-200 px-3 py-2 text-sm text-slate-500">Projekt usunięty</span>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
