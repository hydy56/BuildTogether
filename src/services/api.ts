import { currentUser, projects } from "../mocks/data";
import type { Project, ProjectApplication, ProjectQuery } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
const MOCK = import.meta.env.VITE_USE_MOCKS !== "false";
const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 350));

// Sesja = ciasteczko HttpOnly, więc credentials: "include"; żadnych tokenów w localStorage.
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) throw new Error(`Błąd API (${res.status})`);
  return res.json() as Promise<T>;
}

const applications: ProjectApplication[] = [];

export const projectsApi = {
  list(q: ProjectQuery = {}): Promise<Project[]> {
    if (!MOCK) return http(`/projects?${new URLSearchParams(q as Record<string, string>)}`);
    const t = q.q?.toLowerCase().trim();
    const res = projects
      .filter((p) => !t || `${p.title} ${p.shortDescription}`.toLowerCase().includes(t))
      .filter((p) => !q.category || q.category === "Wszystkie" || p.category === q.category)
      .filter((p) => !q.university || p.university === q.university)
      .filter((p) => !q.skill || p.skills.includes(q.skill))
      .filter((p) => !q.status || p.status === q.status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return delay(res);
  },
  get(id: string): Promise<Project | undefined> {
    return MOCK ? delay(projects.find((p) => p.id === id)) : http(`/projects/${id}`);
  },
};

export const applicationsApi = {
  hasApplied: (projectId: string) => applications.some((a) => a.projectId === projectId),
  apply(projectId: string, role: string, message: string): Promise<ProjectApplication> {
    if (!MOCK) return http(`/projects/${projectId}/applications`, { method: "POST", body: JSON.stringify({ role, message }) });
    if (applications.some((a) => a.projectId === projectId)) return Promise.reject(new Error("Już aplikowałeś do tego projektu."));
    const app = { id: crypto.randomUUID(), projectId, role, message, status: "pending" as const };
    applications.push(app);
    return delay(app);
  },
};
export const me = currentUser;
