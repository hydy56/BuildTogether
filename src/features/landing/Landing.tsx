import { Link } from "react-router-dom";
import { Logo, ProjectCard } from "../../components/ui";
import { projects } from "../../mocks/data";

const steps = ["Znajdź inspirujący projekt.", "Dołącz do zespołu.", "Stwórz coś wyjątkowego."];
const cats = ["Startup", "AI", "Programowanie", "Design", "Gaming", "Nauka", "Inne"];
const perks = ["Zespół o komplementarnych umiejętnościach", "Portfolio realnych projektów", "Hackathony, konkursy i inicjatywy naukowe", "Kontakty ponad granicami uczelni"];

export default function Landing() {
  return (
    <div>
      <header className="mx-auto flex max-w-7xl items-center justify-between p-4"><Logo />
        <div className="flex gap-2 text-sm"><Link to="/login" className="rounded-lg px-3 py-2 hover:bg-slate-100">Zaloguj się</Link><Link to="/projects" className="rounded-lg bg-brand-600 px-3 py-2 text-white hover:bg-brand-700">Wejdź do aplikacji</Link></div>
      </header>
      <section className="bg-gradient-to-b from-brand-50 to-transparent px-4 py-16 text-center">
        <p className="text-sm font-medium text-brand-600">Znajdź ludzi. Zbuduj projekt. Pokaż, co potrafisz.</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Wielkie projekty zaczynają się od właściwych ludzi.</h1>
        <p className="mx-auto mt-5 max-w-xl text-slate-600">BuildTogether łączy studentów z całej Polski, którzy chcą tworzyć razem: startupy, gry, projekty naukowe i hackathony.</p>
        <div className="mt-8 flex justify-center gap-3"><Link to="/projects" className="rounded-xl bg-brand-600 px-5 py-3 font-medium text-white hover:bg-brand-700">Odkrywaj projekty</Link><Link to="/projects/new" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium hover:bg-slate-50">Dodaj swój projekt</Link></div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 text-left sm:grid-cols-3">{projects.slice(0, 3).map((p) => <ProjectCard key={p.id} p={p} />)}</div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-16"><h2 className="text-center text-3xl font-bold">Jak działa BuildTogether?</h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-3">{steps.map((s, i) => <li key={s} className="rounded-2xl border border-slate-200 bg-white p-6"><span className="grid size-9 place-items-center rounded-full bg-brand-100 font-bold text-brand-700">{i + 1}</span><p className="mt-3 font-semibold">{s}</p></li>)}</ol></section>
      <section className="mx-auto max-w-5xl px-4 pb-16"><h2 className="text-2xl font-bold">Kategorie projektów</h2><div className="mt-4 flex flex-wrap gap-2">{cats.map((c) => <Link key={c} to="/projects" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:border-brand-500">{c}</Link>)}</div>
        <h2 className="mt-12 text-2xl font-bold">Korzyści dla studentów</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{perks.map((p) => <li key={p} className="rounded-xl bg-white p-4 shadow-sm">✓ {p}</li>)}</ul></section>
      <section className="bg-brand-600 px-4 py-16 text-center text-white"><h2 className="text-3xl font-bold">Gotowy, żeby zbudować coś razem?</h2><Link to="/projects" className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-medium text-brand-700">Odkrywaj projekty</Link></section>
      <footer className="p-6 text-center text-sm text-slate-500">© 2026 BuildTogether · Polityka prywatności · Regulamin</footer>
    </div>
  );
}
