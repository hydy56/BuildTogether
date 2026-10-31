import type { Category, Project, RecruitmentStatus, User } from "../types";
const u = (id: string, name: string, university: string): User => ({ id, name, username: id, university, skills: [] });
export const currentUser: User = u("jan-kowalski", "Jan Kowalski", "Politechnika Wrocławska");
const owners = [u("anna-nowak","Anna Nowak","Uniwersytet Warszawski"), u("piotr-wisniewski","Piotr Wiśniewski","AGH w Krakowie"), u("marta-zielinska","Marta Zielińska","Politechnika Gdańska"), u("kacper-lewandowski","Kacper Lewandowski","Uniwersytet Jagielloński"), u("zofia-wojcik","Zofia Wójcik","SGH w Warszawie")];
const rows: [string,string,Category,string,string[],RecruitmentStatus][] = [
 ["Aplikacja do wspólnych notatek","Platforma do współdzielenia notatek z wykładów.","Startup","Uniwersytet Warszawski",["React","Node.js","UI/UX"],"open"],
 ["Asystent AI do planowania nauki","Model rekomendujący plan powtórek przed sesją.","AI","AGH w Krakowie",["Python","Machine Learning","FastAPI"],"open"],
 ["Rynek używanych podręczników","Marketplace książek między studentami.","Programowanie","Politechnika Gdańska",["Java","Spring Boot","PostgreSQL"],"open"],
 ["Rebranding festiwalu studenckiego","Nowa identyfikacja wizualna Juwenaliów.","Design","Uniwersytet Jagielloński",["Figma","Ilustracja","Motion"],"in_progress"],
 ["Pixelowa gra roguelike „Kampus”","Indie game z mechaniką sesji egzaminacyjnej.","Gaming","Politechnika Wrocławska",["Unity","C#","Pixel art"],"open"],
 ["Analiza smogu w miastach","Projekt naukowy z czujnikami jakości powietrza.","Nauka","Politechnika Śląska",["Python","Statystyka","IoT"],"open"],
 ["Platforma dla kół naukowych","Rekrutacja i kalendarz wydarzeń kół.","Startup","SGH w Warszawie",["TypeScript","React","Marketing"],"closed"],
 ["Chatbot dla biura karier","Bot odpowiadający na pytania o praktyki.","AI","Uniwersytet Wrocławski",["Python","NLP","LLM"],"open"],
 ["Mobilna aplikacja do car-poolingu","Wspólne dojazdy na uczelnię.","Programowanie","Politechnika Poznańska",["Kotlin","Android","Firebase"],"in_progress"],
 ["Podcast o przedsiębiorczości","Rozmowy z młodymi founderami.","Inne","Uniwersytet Łódzki",["Montaż audio","Copywriting"],"open"],
 ["Zespół na hackathon HackYeah","Szukamy backendowca i designera.","Startup","Politechnika Wrocławska",["Java","Figma","Pitching"],"open"],
];
export const projects: Project[] = rows.map(([title, short, category, university, skills, status], i) => ({
  id: String(i + 1), title, shortDescription: short, category, university, skills, status,
  description: `${short} Szukamy zaangażowanych osób, które chcą w semestrze doprowadzić pomysł do działającego prototypu i pokazać go publicznie.`,
  goals: ["Działający prototyp do końca semestru", "Prezentacja na wydarzeniu uczelnianym", "Wpis do portfolio każdego członka zespołu"],
  owner: owners[i % owners.length],
  roles: skills.slice(0, 2).map((s, j) => ({ id: `r${i}-${j}`, name: `Specjalista: ${s}`, slots: 1 + (j % 2) })),
  members: [{ user: owners[i % owners.length], role: "Założyciel" }],
  createdAt: new Date(2026, 9, 28 - i * 2).toISOString(),
  githubUrl: i % 3 === 0 ? "https://github.com" : undefined,
}));
