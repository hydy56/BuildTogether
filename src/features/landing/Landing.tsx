import { ArrowRight, ArrowUpRight, BadgeCheck, Rocket, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo, ProjectCard } from "../../components/ui";
import { projects } from "../../mocks/data";

const steps = [
  { title: "Znajdź inspirujący projekt.", text: "Przeglądaj pomysły z różnych dziedzin i wybieraj te, które pasują do Twoich kompetencji." },
  { title: "Dołącz do zespołu.", text: "Łącz się z osobami, które uzupełniają Twoje umiejętności i chcą budować razem." },
  { title: "Stwórz coś wyjątkowego.", text: "Współtwórz produkty, startupy, prototypy i inicjatywy, które mają realny wpływ." },
];
const cats = ["Startup", "AI", "Programowanie", "Design", "Gaming", "Nauka", "Inne"];
const perks = [
  "Kooperacja z ludźmi o komplementarnych umiejętnościach",
  "Portfolio realnych projektów i doświadczeń",
  "Hackathony, konkursy i inicjatywy naukowe",
  "Sieć kontaktów ponad granicami uczelni",
];

export default function Landing() {
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.dataset.theme === "dark");

  useEffect(() => {
    const syncTheme = () => setIsDarkMode(document.documentElement.dataset.theme === "dark");
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900">
      <header className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
          <Logo />
          <nav className="hidden items-center gap-2 text-sm md:flex">
            <Link to="/projects" className="rounded-full px-3 py-2 text-slate-600 hover:bg-slate-100">Projekty</Link>
            <Link to="/login" className="rounded-full px-3 py-2 text-slate-600 hover:bg-slate-100">Zaloguj się</Link>
          </nav>
          <Link to="/projects" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            Odkrywaj projekty <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:pt-12">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="grid gap-10 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  <Sparkles size={14} /> BuildTogether
                </div>
                <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Wielkie projekty zaczynają się od właściwych ludzi.
                </h1>
                <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
                  Łączymy studentów, twórców i przyszłych startupowców, aby wspólnie budować projekty, zdobywać doświadczenie i tworzyć portfolio, które ma sens.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/projects" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
                    Odkrywaj projekty <ArrowUpRight size={16} />
                  </Link>
                  <Link to="/projects/new" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
                    Utwórz projekt
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                    <Users size={14} className="text-brand-600" /> zespoły studentów
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                    <Rocket size={14} className="text-brand-600" /> startupowe pomysły
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                    <BadgeCheck size={14} className="text-brand-600" /> portfolio i doświadczenie
                  </span>
                </div>
              </div>

              <div className={`rounded-[1.5rem] border p-5 shadow-inner ${isDarkMode ? "border-white/10 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"}`}>
                <div className={`rounded-2xl border p-4 ${isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                  <p className={`text-xs uppercase tracking-[0.18em] ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>Najciekawsze dziś</p>
                  <div className="mt-4 space-y-3">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className={`rounded-2xl border p-3 ${isDarkMode ? "border-white/10 bg-slate-950/50" : "border-slate-200 bg-white"}`}>
                        <div className="flex items-center justify-between gap-3">
                          <p className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{project.title}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${isDarkMode ? "bg-brand-500/15 text-brand-200" : "bg-brand-50 text-brand-700"}`}>{project.category}</span>
                        </div>
                        <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{project.shortDescription}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Jak to działa</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Twórz zespół, który naprawdę wspiera Twój pomysł.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="grid size-10 place-items-center rounded-2xl bg-brand-50 text-lg font-bold text-brand-700">{index + 1}</div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Featured</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Najciekawsze pomysły</h2>
            </div>
            <Link to="/projects" className="hidden text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex">
              Zobacz wszystkie projekty →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">{projects.slice(0, 3).map((p) => <ProjectCard key={p.id} p={p} />)}</div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-3xl font-bold text-slate-900">Kategorie projektów</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {cats.map((category) => (
                <Link key={category} to="/projects" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
                  {category}
                </Link>
              ))}
            </div>

            <h2 className="mt-10 text-2xl font-bold text-slate-900">Korzyści dla studentów</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-brand-100 text-brand-700">✓</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-r from-brand-600 to-indigo-600 p-8 text-center text-white shadow-lg">
            <h2 className="text-3xl font-bold">Gotowy, żeby zbudować coś razem?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/80">Dołącz do społeczności, która łączy pomysły, umiejętności i energię studentów.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/projects" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-slate-100">
                Odkrywaj projekty
              </Link>
              <Link to="/projects/new" className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Utwórz projekt
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500">
        <p>© 2026 BuildTogether</p>
        <div className="flex gap-4">
          <span>Polityka prywatności</span>
          <span>Regulamin</span>
        </div>
      </footer>
    </div>
  );
}
