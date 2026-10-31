import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Sparkles, Trash2 } from "lucide-react";
import { authApi, projectsApi } from "../../services/api";
import type { Category } from "../../types";

const categories: Category[] = ["Startup", "AI", "Programowanie", "Design", "Gaming", "Nauka", "Inne"];

const starterSkills = ["React", "TypeScript", "Python", "Figma", "Node.js", "UI/UX", "Marketing", "Product Design"];

export default function NewProject() {
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Startup");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState(["", "", ""]);
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript"]);
  const [roles, setRoles] = useState([{ name: "Frontend Developer", slots: 1 }, { name: "Product Designer", slots: 1 }]);

  const previewReady = useMemo(() => title.trim().length > 2 && shortDescription.trim().length > 15, [title, shortDescription]);

  const addGoal = () => setGoals((value) => [...value, ""]);
  const updateGoal = (index: number, value: string) => setGoals((current) => current.map((item, idx) => (idx === index ? value : item)));
  const removeGoal = (index: number) => setGoals((current) => (current.length > 1 ? current.filter((_, idx) => idx !== index) : current));

  const addSkill = (skill: string) => {
    if (!skill.trim() || skills.includes(skill.trim())) return;
    setSkills((value) => [...value, skill.trim()]);
  };

  const removeSkill = (skill: string) => setSkills((value) => value.filter((item) => item !== skill));

  const addRole = () => setRoles((value) => [...value, { name: "Nowa rola", slots: 1 }]);
  const updateRole = (index: number, field: "name" | "slots", value: string | number) => {
    setRoles((current) => current.map((role, idx) => (idx === index ? { ...role, [field]: value } : role)));
  };
  const removeRole = (index: number) => setRoles((current) => (current.length > 1 ? current.filter((_, idx) => idx !== index) : current));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanGoals = goals.map((goal) => goal.trim()).filter(Boolean);
    const cleanSkills = skills.map((skill) => skill.trim()).filter(Boolean);
    const cleanRoles = roles.map((role) => ({
      id: `r-${Math.random().toString(36).slice(2, 9)}`,
      name: role.name.trim() || "Nowa rola",
      slots: Number(role.slots) || 1,
    }));

    const created = await projectsApi.create({
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim() || shortDescription.trim(),
      goals: cleanGoals.length ? cleanGoals : ["Działający prototyp do końca semestru"],
      category,
      university: currentUser.university,
      owner: currentUser,
      skills: cleanSkills.length ? cleanSkills : ["React"],
      roles: cleanRoles,
      members: [{ user: currentUser, role: "Założyciel" }],
      status: "open",
      createdAt: new Date().toISOString(),
    });

    navigate(`/projects/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-600">Nowy projekt</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Utwórz projekt</h1>
        </div>
        <Link to="/projects" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Wróć do listy
          <ChevronRight size={16} />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Tytuł projektu</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="np. AI mentor do nauki"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Kategoria</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700">Uczelnia</p>
            <p className="mt-2">{currentUser.university}</p>
          </div>

          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Krótki opis</span>
            <textarea
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
              rows={3}
              placeholder="Opisz pomysł w 1–2 zdaniach."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Pełny opis</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="Opisz problem, rozwiązanie, grupę docelową i plan rozwoju projektu."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Cele projektu</h2>
            <button type="button" onClick={addGoal} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <Plus size={15} />
              Dodaj cel
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {goals.map((goal, index) => (
              <div key={`goal-${index}`} className="flex items-center gap-2">
                <input
                  value={goal}
                  onChange={(event) => updateGoal(index, event.target.value)}
                  placeholder={`Cel ${index + 1}`}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
                />
                {goals.length > 1 && (
                  <button type="button" onClick={() => removeGoal(index)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700" aria-label="Usuń cel">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Umiejętności</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {starterSkills.map((skill) => {
              const selected = skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => (selected ? removeSkill(skill) : addSkill(skill))}
                  className={`rounded-full border px-3 py-1.5 text-sm ${selected ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-brand-500"}`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              id="custom-skill"
              type="text"
              placeholder="Dodaj własną umiejętność"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const value = (event.currentTarget as HTMLInputElement).value;
                  addSkill(value);
                  (event.currentTarget as HTMLInputElement).value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={(event) => {
                const input = document.getElementById("custom-skill") as HTMLInputElement | null;
                if (!input) return;
                addSkill(input.value);
                input.value = "";
              }}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Dodaj
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Role w projekcie</h2>
            <button type="button" onClick={addRole} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <Plus size={15} />
              Dodaj rolę
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {roles.map((role, index) => (
              <div key={`role-${index}`} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-[1.3fr_0.7fr_auto]">
                <input
                  value={role.name}
                  onChange={(event) => updateRole(index, "name", event.target.value)}
                  placeholder="Nazwa roli"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
                />
                <input
                  type="number"
                  min={1}
                  value={role.slots}
                  onChange={(event) => updateRole(index, "slots", Number(event.target.value) || 1)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500"
                />
                {roles.length > 1 && (
                  <button type="button" onClick={() => removeRole(index)} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Usuń rolę">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <div className="flex items-center gap-3 text-sm text-brand-700">
            <Sparkles size={18} />
            <span>{previewReady ? "Projekt jest gotowy do publikacji." : "Dodaj tytuł i krótki opis, aby opublikować projekt."}</span>
          </div>

          <button
            type="submit"
            disabled={!previewReady}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Opublikuj projekt
          </button>
        </div>
      </form>
    </div>
  );
}
