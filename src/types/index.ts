export type Category = "Startup" | "AI" | "Programowanie" | "Design" | "Gaming" | "Nauka" | "Inne";
export type RecruitmentStatus = "open" | "closed" | "in_progress";
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface User { id: string; name: string; username: string; university: string; skills: string[] }

export interface ProjectRole {
  id: string;
  name: string;
  slots: number;
  occupiedSlots?: number;
  availableSlots?: number;
}

export interface ProjectMember { user: User; role: string }

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  goals: string[];
  category: Category;
  university: string;
  owner: User;
  skills: string[];
  roles: ProjectRole[];
  members: ProjectMember[];
  status: RecruitmentStatus;
  createdAt: string;
  githubUrl?: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  roleId?: string;
  applicant?: User;
  applicantId?: string;
  role: string;
  message: string;
  status: ApplicationStatus;
  createdAt?: string;
  reviewedAt?: string;
}

export interface Notification { id: string; text: string; read: boolean; createdAt?: string }

export interface ProjectQuery { q?: string; category?: Category | "Wszystkie"; university?: string; skill?: string; status?: RecruitmentStatus | "" }
