import { currentUser, projects } from "../mocks/data";
import type { Project, ProjectApplication, ProjectQuery, User } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
const MOCK = import.meta.env.VITE_USE_MOCKS !== "false";
const AUTH_STORAGE_KEY = "buildtogether-demo-auth";
const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 350));

// Sesja = ciasteczko HttpOnly, więc credentials: "include"; żadnych tokenów w localStorage.
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) throw new Error(`Błąd API (${res.status})`);
  return res.json() as Promise<T>;
}

const applications: ProjectApplication[] = [
  { id: "app-1", projectId: "2", role: "Python Developer", message: "Chciałbym pomóc w głębokim modelu i części backendowej projektu AI do planowania nauki.", status: "pending" },
  { id: "app-2", projectId: "5", role: "Game Designer", message: "Mam doświadczenie w mechanikach gier i chcę pomóc rozwijać design oraz systemy rozgrywki.", status: "accepted" },
  { id: "app-3", projectId: "11", role: "Frontend Developer", message: "Potrafię tworzyć interfejsy, animacje i dobre UX dla hackathonowych prototypów.", status: "rejected" },
];

const normalizeUser = (user: Partial<User> & { email?: string }): User => {
  const resolvedName = user.name?.trim() || "Demo User";
  const resolvedUsername = user.username?.trim() || (user.email ? user.email.split("@")[0] : currentUser.username);
  return {
    id: user.id || resolvedUsername,
    name: resolvedName,
    username: resolvedUsername,
    university: user.university || currentUser.university,
    skills: user.skills?.length ? user.skills : currentUser.skills,
  };
};

export const authApi = {
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem(AUTH_STORAGE_KEY));
  },
  getCurrentUser(): User {
    if (typeof window === "undefined") return currentUser;
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return currentUser;

    try {
      return normalizeUser(JSON.parse(raw));
    } catch {
      return currentUser;
    }
  },
  async login({ email, password }: { email: string; password: string }): Promise<User> {
    if (!MOCK) return http("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (!email || !password || password.length < 6) {
      throw new Error("E-mail i hasło są wymagane. Hasło musi mieć co najmniej 6 znaków.");
    }

    const user = normalizeUser({ ...currentUser, email, username: currentUser.username, id: currentUser.id });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return delay(user);
  },
  async register(payload: { name: string; email: string; university: string; password: string }): Promise<User> {
    if (!MOCK) return http("/auth/register", { method: "POST", body: JSON.stringify(payload) });
    const { name, email, university, password } = payload;
    if (!name.trim() || !email.trim() || !password.trim() || password.length < 6) {
      throw new Error("Uzupełnij wszystkie pola i podaj hasło z minimum 6 znakami.");
    }

    const username = email.split("@")[0].replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
    const user = normalizeUser({
      id: username,
      username,
      name: name.trim(),
      university: university.trim() || currentUser.university,
      email,
      skills: currentUser.skills,
    });

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return delay(user);
  },
  async logout(): Promise<boolean> {
    if (!MOCK) return http("/auth/logout", { method: "POST" });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return delay(true);
  },
};

export const usersApi = {
  async me(): Promise<User> {
    if (!MOCK) return http("/users/me");
    return delay(authApi.getCurrentUser());
  },
  async updateMe(payload: Partial<User>): Promise<User> {
    if (!MOCK) return http("/users/me", { method: "PATCH", body: JSON.stringify(payload) });
    const current = authApi.getCurrentUser();
    const next = normalizeUser({ ...current, ...payload, skills: payload.skills?.length ? payload.skills : current.skills });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    return delay(next);
  },
};

export const projectsApi = {
  list(q: ProjectQuery = {}): Promise<Project[]> {
    if (!MOCK) return http(`/projects?${new URLSearchParams(q as Record<string, string>)}`);
    const t = q.q?.toLowerCase().trim();
    const res = projects
      .filter((p) => !t || `${p.title} ${p.shortDescription} ${p.skills.join(" ")}`.toLowerCase().includes(t))
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
  create(project: Omit<Project, "id" | "createdAt"> & { id?: string; createdAt?: string }): Promise<Project> {
    if (!MOCK) return http("/projects", { method: "POST", body: JSON.stringify(project) });
    const created: Project = {
      ...project,
      id: project.id || String(projects.length + 1),
      createdAt: project.createdAt || new Date().toISOString(),
    };
    projects.unshift(created);
    return delay(created);
  },
};

export const applicationsApi = {
  list(): Promise<ProjectApplication[]> {
    return delay(applications);
  },
  hasApplied: (projectId: string) => applications.some((a) => a.projectId === projectId),
  apply(projectId: string, role: string, message: string): Promise<ProjectApplication> {
    if (!MOCK) return http(`/projects/${projectId}/applications`, { method: "POST", body: JSON.stringify({ role, message }) });
    if (applications.some((a) => a.projectId === projectId)) return Promise.reject(new Error("Już aplikowałeś do tego projektu."));
    const app = { id: crypto.randomUUID(), projectId, role, message, status: "pending" as const };
    applications.push(app);
    return delay(app);
  },
};

export const teamsApi = {
  list(): Promise<{ id: string; name: string }[]> {
    return delay([{ id: "team-1", name: "BuildTogether" }]);
  },
};

export const me = currentUser;
