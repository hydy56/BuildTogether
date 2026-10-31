import { ArrowUpRight, BriefcaseBusiness, FolderKanban, PencilLine, Plus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, StatusBadge } from "../../components/ui";
import { applicationsApi, authApi, projectsApi } from "../../services/api";

export default function Dashboard() {
  const currentUser = authApi.getCurrentUser();
  const { data: projects = [], isLoading, refetch: refetchProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsApi.list(),
  });

  const myProjects = useMemo(
    () => projects.filter((project) => project.owner.id === currentUser.id || project.members.some((member) => member.user.id === currentUser.id)),
    [projects, currentUser.id]
  );

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedProjectId && myProjects[0]) setSelectedProjectId(myProjects[0].id);
    if (selectedProjectId && !myProjects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(myProjects[0]?.id ?? null);
    }
  }, [myProjects, selectedProjectId]);

  const selectedProject = myProjects.find((project) => project.id === selectedProjectId) ?? myProjects[0] ?? null;

  const { data: projectApplications = [], isLoading: isLoadingApplications, refetch: refetchApplications } = useQuery({
    queryKey: ["project-applications", selectedProjectId],
    queryFn: () => (selectedProjectId ? applicationsApi.listByProject(selectedProjectId) : Promise.resolve([])),
    enabled: !!selectedProjectId,
  });

  const handleStatusChange = async (applicationId: string, status: "accepted" | "rejected") => {
    const confirmed = window.confirm(status === "accepted" ? "Zaakceptować to zgłoszenie i dodać osobę do zespołu?" : "Odrzucić to zgłoszenie?");
    if (!confirmed) return;

    try {
      await applicationsApi.updateStatus(applicationId, status);
      await Promise.all([refetchApplications(), refetchProjects()]);
    } catch (error) {
      window.alert((error as Error).message);
    }
  };

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
          <p className="mt-4 text-3xl font-bold text-slate-900">{isLoading ? "…" : activeProjects}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Łącznie członków</p>
            <Users className="text-brand-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{isLoading ? "…" : totalMembers}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Zespoły</p>
            <BriefcaseBusiness className="text-brand-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{isLoading ? "…" : myProjects.length}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">Twoje projekty</h2>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {isLoading ? "Ładowanie…" : `${myProjects.length} projektów`}
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">Ładowanie danych projektu…</div>
          ) : myProjects.length === 0 ? (
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

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Podgląd
                      <ArrowUpRight size={15} />
                    </Link>
                    {project.owner.id === currentUser.id && (
                      <button
                        type="button"
                        onClick={() => setSelectedProjectId(project.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
                      >
                        Zarządzaj zgłoszeniami
                      </button>
                    )}
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

      {selectedProject && selectedProject.owner.id === currentUser.id && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-600">Zgłoszenia</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{selectedProject.title}</h2>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              {projectApplications.length} zgłoszeń
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {isLoadingApplications ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Ładowanie zgłoszeń…
              </div>
            ) : projectApplications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Brak zgłoszeń do tego projektu.
              </div>
            ) : (
              projectApplications.map((application) => {
                const applicant = application.applicant ?? {
                  id: "unknown",
                  name: "Użytkownik",
                  username: "unknown",
                  university: "Brak danych",
                  skills: [],
                };

                return (
                  <article key={application.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <Avatar name={applicant.name} size={40} />
                          <div>
                            <p className="font-semibold text-slate-900">{applicant.name}</p>
                            <p className="text-sm text-slate-500">@{applicant.username}</p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Uczelnia</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">{applicant.university}</p>
                          </div>
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Rola</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">{application.role}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Motywacja</p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">“{application.message}”</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {applicant.skills.map((skill) => (
                            <span key={`${application.id}-${skill}`} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:w-52">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${application.status === "pending" ? "bg-amber-50 text-amber-700" : application.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                          {application.status === "pending" ? "Oczekujące" : application.status === "accepted" ? "Zaakceptowane" : "Odrzucone"}
                        </span>
                        <Link to={`/profile/${applicant.username}`} className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                          Otwórz profil
                        </Link>
                        {application.status === "pending" && (
                          <>
                            <button type="button" onClick={() => handleStatusChange(application.id, "accepted")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                              Zaakceptuj
                            </button>
                            <button type="button" onClick={() => handleStatusChange(application.id, "rejected")} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100">
                              Odrzuć
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
