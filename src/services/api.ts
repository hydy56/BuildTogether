import { currentUser, projects } from "../mocks/data";
import type { ApplicationStatus, Project, ProjectApplication, ProjectMember, ProjectQuery, User } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
const MOCK = import.meta.env.VITE_USE_MOCKS === "true";
const AUTH_STORAGE_KEY = "buildtogether-auth";
const APPLICATIONS_STORAGE_KEY = "buildtogether-applications";
const NOTIFICATIONS_STORAGE_KEY = "buildtogether-notifications";
const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 350));

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) {
    let message = `Błąd API (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data?.message === "string") message = data.message;
    } catch {
      // ignore invalid JSON
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

const defaultApplications: ProjectApplication[] = [];

const defaultNotifications: Array<{ id: string; text: string; read: boolean; createdAt?: string }> = [];

const readApplications = (): ProjectApplication[] => {
  if (typeof window === "undefined") return [...defaultApplications];

  try {
    const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(defaultApplications));
      return [...defaultApplications];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...defaultApplications];
  } catch {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(defaultApplications));
    return [...defaultApplications];
  }
};

const writeApplications = (items: ProjectApplication[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(items));
};

const readNotifications = () => {
  if (typeof window === "undefined") return [...defaultNotifications];

  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(defaultNotifications));
      return [...defaultNotifications];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...defaultNotifications];
  } catch {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(defaultNotifications));
    return [...defaultNotifications];
  }
};

const writeNotifications = (items: Array<{ id: string; text: string; read: boolean; createdAt?: string }>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
};

const normalizeUser = (user: Partial<User> & { email?: string }): User => {
  const resolvedName = user.name?.trim() || "User";
  const resolvedUsername = user.username?.trim() || (user.email ? user.email.split("@")[0] : currentUser.username);
  return {
    id: user.id || resolvedUsername,
    name: resolvedName,
    username: resolvedUsername,
    university: user.university || currentUser.university,
    skills: user.skills?.length ? user.skills : currentUser.skills,
  };
};

const getProjectRoleAvailability = (projectId: string, roleName: string) => {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return { used: 0, occupiedSlots: 0, limit: 0, slots: 0, available: 0, availableSlots: 0 };

  const role = project.roles.find((item) => item.name.toLowerCase() === roleName.trim().toLowerCase());
  if (!role) return { used: 0, occupiedSlots: 0, limit: 0, slots: 0, available: 0, availableSlots: 0 };

  const acceptedCount = readApplications().filter(
    (app) => app.projectId === projectId && app.role.toLowerCase() === roleName.trim().toLowerCase() && app.status === "accepted"
  ).length;

  const memberCount = project.members.filter((member) => member.role.toLowerCase() === roleName.trim().toLowerCase()).length;
  const occupiedSlots = acceptedCount + memberCount;
  const availableSlots = Math.max(0, role.slots - occupiedSlots);

  return {
    used: occupiedSlots,
    occupiedSlots,
    limit: role.slots,
    slots: role.slots,
    available: availableSlots,
    availableSlots,
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
  async me(): Promise<User> {
    if (!MOCK) return http("/auth/me");
    return delay(authApi.getCurrentUser());
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
  async resetPassword(payload: { email: string; password: string; token?: string }): Promise<{ success: boolean; message: string }> {
    if (!MOCK) return http("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) });
    if (!payload.email || !payload.password || payload.password.length < 6) {
      throw new Error("Podaj poprawny email i hasło z minimum 6 znakami.");
    }
    return delay({ success: true, message: "Hasło zostało zresetowane." });
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
  mine(): Promise<Project[]> {
    if (!MOCK) return http("/projects/mine");
    const currentUserId = authApi.getCurrentUser().id;
    return delay(projects.filter((project) => project.owner.id === currentUserId));
  },
  getMembers(projectId: string): Promise<ProjectMember[]> {
    if (!MOCK) return http(`/projects/${projectId}/members`);
    const project = projects.find((item) => item.id === projectId);
    return delay(project ? project.members : []);
  },
  update(id: string, payload: Partial<Project>): Promise<Project> {
    if (!MOCK) return http(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
    const project = projects.find((item) => item.id === id);
    if (!project) throw new Error("Projekt nie istnieje.");
    const next = { ...project, ...payload };
    const index = projects.findIndex((item) => item.id === id);
    if (index >= 0) projects[index] = next;
    return delay(next);
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
    const currentUserId = authApi.getCurrentUser().id;
    return delay(readApplications().filter((application) => (application.applicantId || application.applicant?.id) === currentUserId));
  },
  listByProject(projectId: string): Promise<ProjectApplication[]> {
    if (!MOCK) return http(`/projects/${projectId}/applications`);
    return delay(readApplications().filter((application) => application.projectId === projectId));
  },
  getProjectApplications(projectId: string): Promise<ProjectApplication[]> {
    return this.listByProject(projectId);
  },
  getRoleAvailability(projectId: string, roleName: string) {
    return getProjectRoleAvailability(projectId, roleName);
  },
  hasApplied(projectId: string): boolean {
    const currentUserId = authApi.getCurrentUser().id;
    return readApplications().some(
      (application) =>
        application.projectId === projectId &&
        (application.applicantId || application.applicant?.id) === currentUserId &&
        (application.status === "pending" || application.status === "accepted")
    );
  },
  apply(projectId: string, role: string, message: string): Promise<ProjectApplication> {
    if (!MOCK) return http(`/projects/${projectId}/applications`, { method: "POST", body: JSON.stringify({ role, message }) });

    const current = authApi.getCurrentUser();
    const project = projects.find((item) => item.id === projectId);

    if (!project) throw new Error("Projekt nie istnieje.");
    if (project.owner.id === current.id) throw new Error("Nie możesz aplikować do własnego projektu.");
    if (project.status === "closed") throw new Error("Rekrutacja do tego projektu została zamknięta.");
    if (project.members.some((member) => member.user.id === current.id)) throw new Error("Jesteś już członkiem tego zespołu.");
    if (!role || !role.trim()) throw new Error("Wybierz rolę, do której chcesz aplikować.");
    if (!message || message.trim().length < 20) throw new Error("Wiadomość musi mieć co najmniej 20 znaków.");

    const roleName = role.trim();
    const existingRole = project.roles.find((item) => item.name.toLowerCase() === roleName.toLowerCase());
    if (!existingRole) throw new Error("Wybrana rola nie istnieje w tym projekcie.");

    const existingApplications = readApplications();
    const duplicate = existingApplications.some(
      (application) =>
        application.projectId === projectId &&
        (application.applicantId || application.applicant?.id) === current.id &&
        (application.status === "pending" || application.status === "accepted")
    );
    if (duplicate) throw new Error("Już wysłałeś zgłoszenie do tego projektu.");

    const availability = getProjectRoleAvailability(projectId, roleName);
    if (availability.available <= 0) throw new Error("Ta rola nie ma już dostępnych miejsc.");

    const application: ProjectApplication = {
      id: crypto.randomUUID(),
      projectId,
      roleId: existingRole.id,
      applicant: current,
      applicantId: current.id,
      role: existingRole.name,
      message: message.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const next = [application, ...existingApplications];
    writeApplications(next);
    return delay(application);
  },
  updateStatus(applicationId: string, status: ApplicationStatus): Promise<ProjectApplication> {
    if (!MOCK) return http(`/applications/${applicationId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

    const current = readApplications();
    const index = current.findIndex((application) => application.id === applicationId);
    if (index === -1) throw new Error("Nie znaleziono zgłoszenia.");

    const application = current[index];
    if (application.status !== "pending") throw new Error("Zmiana statusu możliwa tylko dla oczekującego zgłoszenia.");

    const project = projects.find((item) => item.id === application.projectId);
    if (!project) throw new Error("Projekt dla tego zgłoszenia nie istnieje.");

    const applicant = application.applicant ?? authApi.getCurrentUser();

    if (status === "accepted") {
      const available = getProjectRoleAvailability(project.id, application.role);
      if (available.available <= 0) throw new Error("Ta rola nie ma już dostępnych miejsc.");
      if (project.members.some((member) => member.user.id === applicant.id)) throw new Error("Applicant jest już członkiem zespołu.");
      project.members.push({ user: applicant, role: application.role });
    }

    const nextApplication = {
      ...application,
      status,
      reviewedAt: new Date().toISOString(),
    };
    current[index] = nextApplication;
    writeApplications(current);
    return delay(nextApplication);
  },
};

export const notificationsApi = {
  list(): Promise<Array<{ id: string; text: string; read: boolean; createdAt?: string }>> {
    if (!MOCK) return http("/notifications");
    return delay(readNotifications());
  },
  markRead(notificationId: string): Promise<{ id: string; read: boolean }> {
    if (!MOCK) return http(`/notifications/${notificationId}/read`, { method: "PATCH" });
    const items = readNotifications().map((entry) => (entry.id === notificationId ? { ...entry, read: true } : entry));
    writeNotifications(items);
    const target = items.find((entry) => entry.id === notificationId);
    return delay({ id: notificationId, read: Boolean(target?.read) });
  },
  markAllRead(): Promise<{ updated: number }> {
    if (!MOCK) return http("/notifications/read-all", { method: "PATCH" });
    const items = readNotifications().map((entry) => ({ ...entry, read: true }));
    writeNotifications(items);
    return delay({ updated: items.length });
  },
};

export const teamsApi = {
  list(): Promise<{ id: string; name: string }[]> {
    return delay([{ id: "team-1", name: "BuildTogether" }]);
  },
};

export const me = currentUser;
