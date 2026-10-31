import { ArrowUpRight, BriefcaseBusiness, FolderKanban, PencilLine, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "../../components/ui";
import { me } from "../../services/api";
import { projects } from "../../mocks/data";

const myProjects = projects.filter((project) => project.owner.id === me.id || project.members.some((member) => member.user.id === me.id));

export default function Dashboard() {
  const activeProjects = myProjects.filter((p) => p.status !== "closed").length;
  const totalMembers = myProjects.reduce((sum, project) => sum + project.members.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-600">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Moje projekty</h1>
        </div>

        <Link
          to="/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          <Plus size={16} />
          Utwórz projekt
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Aktywne projekty</p>
            <FolderKanban className="text-brand-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{activeProjects}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Łącznie członków</p>
            <Users className="text-brand-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{totalMembers}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Zespoły</p>
            <BriefcaseBusiness className="text-brand-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{myProjects.length}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">Twoje projekty</h2>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {myProjects.length} projektów
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {myProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Nie dołączyłeś jeszcze do żadnego projektu. Stwórz własną inicjatywę albo znajdź ciekawy zespół.
            </div>
          ) : (
            myProjects.map((project) => (
              <article key={project.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">{project.category}</span>
                      <StatusBadge s={project.status} />
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900">{project.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{project.shortDescription}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span key={`${project.id}-${skill}`} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Podgląd
                      <ArrowUpRight size={15} />
                    </Link>
                    <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                      <PencilLine size={15} />
                      Edytuj
                    </button>
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
