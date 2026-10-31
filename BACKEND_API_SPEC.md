# BuildTogether – specyfikacja API dla frontendu

Ten dokument definiuje, jakie endpointy i dane backend musi dostarczyć, aby frontend działał zgodnie z istniejącą architekturą aplikacji.

## 1. Założenia techniczne

- Autoryzacja oparta na sesji/cookie HttpOnly.
- Frontend wysyła `credentials: "include"`.
- Nie ma tokenów JWT w localStorage.
- Wszystkie endpointy zwracają JSON.
- Wartość `VITE_USE_MOCKS` może włączać mock mode, ale backend musi obsługiwać kontrakt poniżej.

---

## 2. Model danych

### User
```json
{
  "id": "u_123",
  "name": "Jan Kowalski",
  "username": "janek",
  "university": "Uniwersytet Warszawski",
  "skills": ["React", "TypeScript", "UX"]
}
```

### ProjectRole
```json
{
  "id": "r_1",
  "name": "Frontend Developer",
  "slots": 2
}
```

### ProjectMember
```json
{
  "user": {
    "id": "u_123",
    "name": "Jan Kowalski",
    "username": "janek",
    "university": "Uniwersytet Warszawski",
    "skills": ["React", "TypeScript"]
  },
  "role": "Założyciel"
}
```

### Project
```json
{
  "id": "p_1",
  "title": "AI mentor do nauki",
  "shortDescription": "Platforma do wspólnego planowania nauki.",
  "description": "Pełny opis projektu, cele, grupa docelowa i plan rozwoju.",
  "goals": [
    "Zbudować MVP do końca semestru",
    "Dopisać integrację AI do planowania",
    "Zorganizować pierwszą wersję testów"
  ],
  "category": "AI",
  "university": "Uniwersytet Warszawski",
  "owner": {
    "id": "u_123",
    "name": "Jan Kowalski",
    "username": "janek",
    "university": "Uniwersytet Warszawski",
    "skills": ["React", "TypeScript"]
  },
  "skills": ["React", "Python", "UX"],
  "roles": [
    { "id": "r_1", "name": "Frontend Developer", "slots": 2 },
    { "id": "r_2", "name": "Product Designer", "slots": 1 }
  ],
  "members": [
    { "user": { "id": "u_123", "name": "Jan Kowalski", "username": "janek", "university": "Uniwersytet Warszawski", "skills": ["React", "TypeScript"] }, "role": "Założyciel" }
  ],
  "status": "open",
  "createdAt": "2026-10-31T12:00:00.000Z",
  "githubUrl": "https://github.com/example/project"
}
```

### ProjectApplication
```json
{
  "id": "app_1",
  "projectId": "p_12",
  "role": "Python Developer",
  "message": "Chciałbym pomóc w backendzie i modelowaniu danych.",
  "status": "pending"
}
```

### Notification
```json
{
  "id": "n_1",
  "text": "Anna zaakceptowała Twoje zgłoszenie do projektu AI mentor.",
  "read": false,
  "createdAt": "2026-10-31T12:00:00.000Z"
}
```

---

## 3. Endpointy auth

### POST /auth/login
Request:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Response 200:
```json
{
  "id": "u_123",
  "name": "Jan Kowalski",
  "username": "janek",
  "university": "Uniwersytet Warszawski",
  "skills": ["React", "TypeScript", "UX"]
}
```

Error:
```json
{
  "message": "Nieprawidłowy email lub hasło"
}
```

---

### POST /auth/register
Request:
```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "university": "Uniwersytet Warszawski",
  "password": "secret123"
}
```

Response 201:
```json
{
  "id": "u_124",
  "name": "Jan Kowalski",
  "username": "jan",
  "university": "Uniwersytet Warszawski",
  "skills": []
}
```

---

### POST /auth/logout
Response 200:
```json
{
  "success": true
}
```

---

### POST /auth/forgot-password
Request:
```json
{
  "email": "jan@example.com"
}
```

Response 200:
```json
{
  "success": true,
  "message": "Link resetujący hasło został wysłany"
}
```

---

## 4. Endpointy użytkowników

### GET /users/me
Response 200:
```json
{
  "id": "u_123",
  "name": "Jan Kowalski",
  "username": "janek",
  "university": "Uniwersytet Warszawski",
  "skills": ["React", "TypeScript", "UX"]
}
```

---

### PATCH /users/me
Request:
```json
{
  "name": "Jan Kowalski",
  "university": "Uniwersytet Warszawski",
  "skills": ["React", "TypeScript", "UX"]
}
```

Response 200:
```json
{
  "id": "u_123",
  "name": "Jan Kowalski",
  "username": "janek",
  "university": "Uniwersytet Warszawski",
  "skills": ["React", "TypeScript", "UX"]
}
```

---

### GET /users/:username
Response 200:
```json
{
  "id": "u_123",
  "name": "Jan Kowalski",
  "username": "janek",
  "university": "Uniwersytet Warszawski",
  "skills": ["React", "TypeScript", "UX"]
}
```

---

### GET /users/:username/projects
Response 200:
```json
[
  {
    "id": "p_1",
    "title": "AI mentor do nauki",
    "shortDescription": "Platforma do wspólnego planowania nauki.",
    "category": "AI",
    "status": "open",
    "createdAt": "2026-10-31T12:00:00.000Z",
    "owner": {
      "id": "u_123",
      "name": "Jan Kowalski",
      "username": "janek",
      "university": "Uniwersytet Warszawski",
      "skills": ["React", "TypeScript"]
    }
  }
]
```

---

## 5. Endpointy projektów

### GET /projects
Query params:
- `q` – fraza do wyszukiwania
- `category` – np. `AI`, `Startup`, `Programowanie`
- `university` – nazwa uczelni
- `skill` – np. `React`
- `status` – `open`, `in_progress`, `closed`

Response 200:
```json
[
  {
    "id": "p_1",
    "title": "AI mentor do nauki",
    "shortDescription": "Platforma do wspólnego planowania nauki.",
    "description": "Pełny opis projektu",
    "goals": ["Cel 1", "Cel 2"],
    "category": "AI",
    "university": "Uniwersytet Warszawski",
    "owner": {
      "id": "u_123",
      "name": "Jan Kowalski",
      "username": "janek",
      "university": "Uniwersytet Warszawski",
      "skills": ["React", "TypeScript"]
    },
    "skills": ["React", "Python", "UX"],
    "roles": [
      { "id": "r_1", "name": "Frontend Developer", "slots": 2 }
    ],
    "members": [
      { "user": { "id": "u_123", "name": "Jan Kowalski", "username": "janek", "university": "Uniwersytet Warszawski", "skills": ["React"] }, "role": "Założyciel" }
    ],
    "status": "open",
    "createdAt": "2026-10-31T12:00:00.000Z",
    "githubUrl": "https://github.com/example/project"
  }
]
```

---

### GET /projects/:id
Response 200:
```json
{
  "id": "p_1",
  "title": "AI mentor do nauki",
  "shortDescription": "Platforma do wspólnego planowania nauki.",
  "description": "Pełny opis projektu.",
  "goals": ["Dopisać MVP", "Zbudować modele rekomendacji"],
  "category": "AI",
  "university": "Uniwersytet Warszawski",
  "owner": {
    "id": "u_123",
    "name": "Jan Kowalski",
    "username": "janek",
    "university": "Uniwersytet Warszawski",
    "skills": ["React", "TypeScript"]
  },
  "skills": ["React", "Python", "UX"],
  "roles": [
    { "id": "r_1", "name": "Frontend Developer", "slots": 2 },
    { "id": "r_2", "name": "Product Designer", "slots": 1 }
  ],
  "members": [
    { "user": { "id": "u_123", "name": "Jan Kowalski", "username": "janek", "university": "Uniwersytet Warszawski", "skills": ["React"] }, "role": "Założyciel" }
  ],
  "status": "open",
  "createdAt": "2026-10-31T12:00:00.000Z",
  "githubUrl": "https://github.com/example/project"
}
```

---

### POST /projects
Request:
```json
{
  "title": "AI mentor do nauki",
  "shortDescription": "Platforma do wspólnego planowania nauki.",
  "description": "Pełny opis projektu",
  "goals": ["Cel 1", "Cel 2"],
  "category": "AI",
  "university": "Uniwersytet Warszawski",
  "skills": ["React", "Python", "UX"],
  "roles": [
    { "name": "Frontend Developer", "slots": 2 },
    { "name": "Product Designer", "slots": 1 }
  ],
  "status": "open"
}
```

Response 201:
```json
{
  "id": "p_1",
  "title": "AI mentor do nauki",
  "shortDescription": "Platforma do wspólnego planowania nauki.",
  "description": "Pełny opis projektu",
  "goals": ["Cel 1", "Cel 2"],
  "category": "AI",
  "university": "Uniwersytet Warszawski",
  "owner": {
    "id": "u_123",
    "name": "Jan Kowalski",
    "username": "janek",
    "university": "Uniwersytet Warszawski",
    "skills": ["React", "TypeScript"]
  },
  "skills": ["React", "Python", "UX"],
  "roles": [
    { "id": "r_1", "name": "Frontend Developer", "slots": 2 },
    { "id": "r_2", "name": "Product Designer", "slots": 1 }
  ],
  "members": [
    { "user": { "id": "u_123", "name": "Jan Kowalski", "username": "janek", "university": "Uniwersytet Warszawski", "skills": ["React"] }, "role": "Założyciel" }
  ],
  "status": "open",
  "createdAt": "2026-10-31T12:00:00.000Z"
}
```

---

## 6. Endpointy zgłoszeń

### POST /projects/:id/applications
Request:
```json
{
  "role": "Python Developer",
  "message": "Chciałbym pomóc w backendzie i modelowaniu danych."
}
```

Response 201:
```json
{
  "id": "app_1",
  "projectId": "p_12",
  "role": "Python Developer",
  "message": "Chciałbym pomóc w backendzie i modelowaniu danych.",
  "status": "pending"
}
```

---

### GET /applications/me
Response 200:
```json
[
  {
    "id": "app_1",
    "projectId": "p_12",
    "role": "Python Developer",
    "message": "Chciałbym pomóc w backendzie i modelowaniu danych.",
    "status": "pending"
  },
  {
    "id": "app_2",
    "projectId": "p_5",
    "role": "Game Designer",
    "message": "Mam doświadczenie w mechanikach i UI gier.",
    "status": "accepted"
  }
]
```

---

## 7. Endpointy powiadomień

### GET /notifications
Response 200:
```json
[
  {
    "id": "n_1",
    "text": "Anna zaakceptowała Twoje zgłoszenie do projektu AI mentor.",
    "read": false,
    "createdAt": "2026-10-31T12:00:00.000Z"
  },
  {
    "id": "n_2",
    "text": "Masz 3 nowe powiadomienia z zespołów, do których dołączyłeś.",
    "read": true,
    "createdAt": "2026-10-30T09:15:00.000Z"
  }
]
```

---

### PATCH /notifications/:id/read
Response 200:
```json
{
  "id": "n_1",
  "read": true
}
```

---

### PATCH /notifications/read-all
Response 200:
```json
{
  "updated": 5
}
```

---

## 8. Wymagania bezpieczeństwa

- Każdy endpoint chroniony (`/users/*`, `/projects`, `/applications`, `/notifications`) powinien wymagać aktywnej sesji.
- Sesja powinna być przechowywana w ciasteczku HttpOnly.
- Frontend wywołuje fetch z `credentials: "include"`.
- Brak przechowywania tokenów w localStorage.

---

## 9. Wymagania dotyczące walidacji

- Email: poprawny format.
- Hasło: minimum 6 znaków.
- Nazwa użytkownika może być generowana po rejestracji z adresu email.
- Tytuł projektu: wymagany.
- Krótki opis: wymagany i przydatny do listy.
- `category` musi należeć do dopuszczalnych wartości.
- `status` musi należeć do: `open`, `in_progress`, `closed`.

---

## 10. Minimalna lista narzędzi / obiektów backendowych, które warto zaimplementować

- AuthService
- UsersService
- ProjectsService
- ApplicationsService
- NotificationsService
- Session middleware / auth guard
- Validation layer
- Repository / DB models:
  - users
  - projects
  - project_members
  - project_applications
  - notifications

---

## 11. Podsumowanie

Frontend oczekuje od backendu następujących głównych obszarów:

1. Autoryzacja i sesje
2. Profil użytkownika
3. Projektowanie i wyszukiwanie projektów
4. Tworzenie projektów
5. Aplikowanie do projektów
6. Zgłoszenia użytkownika
7. Powiadomienia
8. Bezpieczny kontrakt z cookie-based auth

To są dokładnie te dane i informacje, które aplikacja frontendowa zamierza od backendu pobrać i wykorzystać w widokach: logowanie, rejestracja, dashboard, lista projektów, szczegóły projektu, profil, ustawienia, zgłoszenia i powiadomienia.
