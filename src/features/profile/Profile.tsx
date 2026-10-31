import { ArrowUpRight, BriefcaseBusiness, MapPin, Sparkles, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Avatar } from "../../components/ui";
import { projects } from "../../mocks/data";
import { me } from "../../services/api";

export default function Profile() {
  const { username } = useParams();
  const user = username === me.username || username === me.id ? me : me;
  const ownedProjects = projects.filter((project) => project.owner.id === user.id || project.owner.username === user.username);
  const joinedProjects = projects.filter((project) => project.members.some((member) => member.user.id === user.id));
  const skills = user.skills.length ? user.skills : ["React", "TypeScript", "UI/UX", "Product design"];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size={72} />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-600">Profil użytkownika</p>
              <h1 className="mt-1 text-3xl font-bold">{user.name}</h1>
              <p className="text-sm text-slate-500">@{user.username}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Edytuj profil
            </button>
            <Link to="/projects" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Zobacz projekty
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Projekty</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{ownedProjects.length + joinedProjects.length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Umiejętności</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{skills.length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Uczelnia</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{user.university}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">O mnie</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="text-brand-600" size={18} />
                <span>{user.university}</span>
              </div>
              <div className="flex items-center gap-3">
                <UserRound className="text-brand-600" size={18} />
                <span>Aktywny członek społeczności BuildTogether</span>
              </div>
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="text-brand-600" size={18} />
                <span>Szuka zespołu, projektów i możliwości nauki</span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Umiejętności</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Moje projekty</h2>
            <div className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              <Sparkles size={14} />
              {ownedProjects.length + joinedProjects.length} aktywne
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {ownedProjects.length === 0 && joinedProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                Brak projektów do wyświetlenia. Dodaj swój pierwszy pomysł albo dołącz do istniejącego zespołu.
              </div>
            ) : (
              <>
                {ownedProjects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{project.title}</h3>
                        <p className="text-sm text-slate-500">Założyciel</p>
                      </div>
                      <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                        Otwórz <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                ))}

                {joinedProjects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{project.title}</h3>
                        <p className="text-sm text-slate-500">Członek zespołu</p>
                      </div>
                      <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                        Otwórz <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
