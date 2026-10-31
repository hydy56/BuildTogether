# BuildTogether – specyfikacja API dla frontendu

Ten dokument definiuje, jakie endpointy i dane backend musi dostarczyć, aby frontend działał zgodnie z istniejącą architekturą aplikacji.

> Status: w obecnym repo jest frontend z mock API i pełnym flow aplikacji. Nie ma osobnego backendu Java Spring Boot w tym repozytorium.

## Spis treści

- [1. Założenia techniczne](#1-założenia-techniczne)
- [2. Zmienne środowiskowe i base URL](#2-zmienne-środowiskowe-i-base-url)
- [3. Modele danych](#3-modele-danych)
- [4. Tabela endpointów](#4-tabela-endpointów)
- [5. Endpointy auth](#5-endpointy-auth)
- [6. Endpointy użytkowników](#6-endpointy-użytkowników)
- [7. Endpointy projektów](#7-endpointy-projektów)
- [8. Endpointy zgłoszeń](#8-endpointy-zgłoszeń)
- [9. Endpointy powiadomień](#9-endpointy-powiadomień)
- [10. Reguły biznesowe](#10-reguły-biznesowe)
- [11. Autoryzacja i bezpieczeństwo](#11-autoryzacja-i-bezpieczeństwo)
- [12. Integracja frontendu](#12-integracja-frontendu)
- [13. Modele bazy danych](#13-modele-bazy-danych)
- [14. Przykłady request/response](#14-przykłady-requestresponse)
- [15. Checklist implementacji](#15-checklist-implementacji)
- [16. Pliki projektu](#16-pliki-projektu)

---

## 1. Założenia techniczne

- Autoryzacja oparta na ciasteczku sesyjnym `HttpOnly`.
- Frontend wysyła `credentials: "include"` przy każdym zapytaniu.
- Nie przechowujemy tokenów JWT ani access tokenów w `localStorage`.
- Wszelkie endpointy zwracają JSON.
- Zmienne środowiskowe są czytane w Vite z `VITE_API_BASE_URL`, `VITE_USE_MOCKS`, `VITE_PROXY_TARGET`.
- Aktualny kontrakt wspiera frontend w trybie mock oraz przyszłą integrację z Java Spring Boot.

---

## 2. Zmienne środowiskowe i base URL

### Frontend local config

```env
VITE_API_BASE_URL=/api
VITE_USE_MOCKS=true
VITE_PROXY_TARGET=http://localhost:8080
```

### Wartość domyślna

- `VITE_API_BASE_URL=/api`
- `VITE_PROXY_TARGET=http://localhost:8080`
- `VITE_USE_MOCKS=true` w repo

W [vite.config.ts](vite.config.ts) istnieje proxy `/api -> VITE_PROXY_TARGET`, dzięki czemu frontend w lokalnym środowisku może działać bez osobnej konfiguracji backendu.

> W tym repo nie ma uruchomionego Swagger/OpenAPI ani backendu Java. Dokumentacja opisuje kontrakt docelowy oraz bieżące mock behavior.

---

## 3. Modele danych

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
  "slots": 2,
  "occupiedSlots": 1,
  "availableSlots": 1
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
  "roleId": "r_backend",
  "applicantId": "u_77",
  "role": "Python Developer",
  "message": "Chciałbym pomóc w backendzie i modelowaniu danych.",
  "status": "pending",
  "createdAt": "2026-10-31T12:00:00.000Z",
  "reviewedAt": "2026-10-31T12:20:00.000Z"
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

## 4. Tabela endpointów

| Sekcja | Metoda | Endpoint | Cel | Autoryzacja | Status |
| --- | --- | --- | --- | --- | --- |
| Auth | POST | `/api/auth/login` | Logowanie użytkownika | Public | Implemented (mock) |
| Auth | POST | `/api/auth/register` | Rejestracja | Public | Implemented (mock) |
| Auth | POST | `/api/auth/logout` | Wylogowanie | Wymagana sesja | Implemented (mock) |
| Auth | POST | `/api/auth/reset-password` | Reset hasła | Public | Implemented (mock) |
| Auth | GET | `/api/auth/me` | Aktualny użytkownik | Wymagana sesja | Mock only |
| Users | GET | `/api/users/me` | Profil aktywnego użytkownika | Wymagana sesja | Implemented (mock) |
| Users | PATCH | `/api/users/me` | Aktualizacja profilu | Wymagana sesja | Implemented (mock) |
| Users | GET | `/api/users/:username` | Profil publiczny | Public | Planned |
| Projects | GET | `/api/projects` | Lista projektów | Public | Implemented (mock) |
| Projects | GET | `/api/projects/:id` | Szczegóły projektu | Public | Implemented (mock) |
| Projects | POST | `/api/projects` | Utworzenie projektu | Wymagana sesja | Implemented (mock) |
| Projects | PATCH | `/api/projects/:id` | Edycja projektu | Wymagana sesja + własność | Mock only |
| Projects | GET | `/api/projects/mine` | Projekty właściciela | Wymagana sesja | Mock only |
| Projects | GET | `/api/projects/:id/members` | Lista członków zespołu | Public lub sesja | Mock only |
| Projects | GET | `/api/projects/:id/applications` | Zgłoszenia dla projektu | Wymaga właściciela | Mock only |
| Applications | POST | `/api/projects/:id/applications` | Wysłanie zgłoszenia | Wymagana sesja | Implemented (mock) |
| Applications | GET | `/api/applications/me` | Moje zgłoszenia | Wymagana sesja | Implemented (mock) |
| Applications | PATCH | `/api/applications/:id/status` | Akceptacja / odrzucenie | Wymagana sesja + właściciel | Mock only |
| Notifications | GET | `/api/notifications` | Lista powiadomień | Wymagana sesja | Mock only |
| Notifications | PATCH | `/api/notifications/:id/read` | Odczyt powiadomienia | Wymagana sesja | Mock only |
| Notifications | PATCH | `/api/notifications/read-all` | Odczyt wszystkich | Wymagana sesja | Mock only |

---

## 5. Endpointy auth

### POST /api/auth/login

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

Error 401:

```json
{
  "message": "Nieprawidłowy email lub hasło"
}
```

### POST /api/auth/register

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

### POST /api/auth/logout

Response 200:

```json
{
  "success": true
}
```

### POST /api/auth/reset-password

Request:

```json
{
  "email": "jan@example.com",
  "token": "valid-token",
  "password": "NoweHaslo123"
}
```

Response 200:

```json
{
  "success": true,
  "message": "Hasło zostało zresetowane."
}
```

### GET /api/auth/me

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

## 6. Endpointy użytkowników

### GET /api/users/me

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

### PATCH /api/users/me

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

### GET /api/users/:username

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

## 7. Endpointy projektów

### GET /api/projects

Query params:

- `q`
- `category`
- `university`
- `skill`
- `status`

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
      {
        "user": {
          "id": "u_123",
          "name": "Jan Kowalski",
          "username": "janek",
          "university": "Uniwersytet Warszawski",
          "skills": ["React"]
        },
        "role": "Założyciel"
      }
    ],
    "status": "open",
    "createdAt": "2026-10-31T12:00:00.000Z",
    "githubUrl": "https://github.com/example/project"
  }
]
```

### GET /api/projects/:id

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
    {
      "user": {
        "id": "u_123",
        "name": "Jan Kowalski",
        "username": "janek",
        "university": "Uniwersytet Warszawski",
        "skills": ["React"]
      },
      "role": "Założyciel"
    }
  ],
  "status": "open",
  "createdAt": "2026-10-31T12:00:00.000Z",
  "githubUrl": "https://github.com/example/project"
}
```

### POST /api/projects

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
    {
      "user": {
        "id": "u_123",
        "name": "Jan Kowalski",
        "username": "janek",
        "university": "Uniwersytet Warszawski",
        "skills": ["React"]
      },
      "role": "Założyciel"
    }
  ],
  "status": "open",
  "createdAt": "2026-10-31T12:00:00.000Z"
}
```

### PATCH /api/projects/:id

Request:

```json
{
  "status": "in_progress",
  "githubUrl": "https://github.com/example/project"
}
```

Response 200:

```json
{
  "id": "p_1",
  "status": "in_progress",
  "githubUrl": "https://github.com/example/project"
}
```

### GET /api/projects/mine

Response 200:

```json
[
  {
    "id": "p_1",
    "title": "AI mentor do nauki",
    "owner": {
      "id": "u_123",
      "name": "Jan Kowalski",
      "username": "janek",
      "university": "Uniwersytet Warszawski",
      "skills": ["React"]
    },
    "status": "open"
  }
]
```

### GET /api/projects/:id/members

Response 200:

```json
[
  {
    "user": {
      "id": "u_77",
      "name": "Marta Nowak",
      "username": "marta",
      "university": "Politechnika Warszawska",
      "skills": ["Java", "Spring Boot"]
    },
    "role": "Python Developer"
  }
]
```

---

## 8. Endpointy zgłoszeń

### POST /api/projects/:id/applications

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
  "roleId": "r_backend",
  "applicantId": "u_77",
  "role": "Python Developer",
  "message": "Chciałbym pomóc w backendzie i modelowaniu danych.",
  "status": "pending",
  "createdAt": "2026-10-31T12:00:00.000Z"
}
```

### GET /api/projects/:id/applications

Response 200:

```json
[
  {
    "id": "app_1",
    "projectId": "p_12",
    "roleId": "r_backend",
    "applicantId": "u_77",
    "applicant": {
      "id": "u_77",
      "name": "Marta Nowak",
      "username": "marta",
      "university": "Politechnika Warszawska",
      "skills": ["Java", "Spring Boot"]
    },
    "role": "Python Developer",
    "message": "Chciałbym pomóc w backendzie i modelowaniu danych.",
    "status": "pending",
    "createdAt": "2026-10-31T12:00:00.000Z"
  }
]
```

### GET /api/applications/me

Response 200:

```json
[
  {
    "id": "app_1",
    "projectId": "p_12",
    "roleId": "r_backend",
    "applicantId": "u_77",
    "role": "Python Developer",
    "message": "Chciałbym pomóc w backendzie i modelowaniu danych.",
    "status": "pending"
  },
  {
    "id": "app_2",
    "projectId": "p_5",
    "roleId": "r_game",
    "applicantId": "u_77",
    "role": "Game Designer",
    "message": "Mam doświadczenie w mechanikach i UI gier.",
    "status": "accepted"
  }
]
```

### PATCH /api/applications/:id/status

Request:

```json
{
  "status": "accepted"
}
```

Response 200:

```json
{
  "id": "app_1",
  "projectId": "p_12",
  "roleId": "r_backend",
  "applicantId": "u_77",
  "role": "Python Developer",
  "message": "Chciałbym pomóc w backendzie i modelowaniu danych.",
  "status": "accepted",
  "createdAt": "2026-10-31T12:00:00.000Z",
  "reviewedAt": "2026-10-31T12:20:00.000Z"
}
```

---

## 9. Endpointy powiadomień

### GET /api/notifications

Response 200:

```json
[
  {
    "id": "n_1",
    "text": "Anna zaakceptowała Twoje zgłoszenie do projektu AI mentor.",
    "read": false,
    "createdAt": "2026-10-31T12:00:00.000Z"
  }
]
```

### PATCH /api/notifications/:id/read

Response 200:

```json
{
  "id": "n_1",
  "read": true
}
```

### PATCH /api/notifications/read-all

Response 200:

```json
{
  "updated": 5
}
```

---

## 10. Reguły biznesowe

### Kto może aplikować

- użytkownik musi być zalogowany
- nie może aplikować do własnego projektu
- nie może być już członkiem projektu
- projekt musi mieć status `open`
- rola musi istnieć i mieć wolne miejsca
- użytkownik nie może wysłać dwóch aktywnych zgłoszeń do tego samego projektu

### Kto może akceptować zgłoszenia

- tylko właściciel projektu ma uprawnienie do akceptacji/odrzucenia zgłoszenia
- status musi być `pending`
- applicant nie może już należeć do zespołu
- liczba miejsc w roli musi pozwalać na akceptację

### Role capacity

- `slots` = maksymalna liczba członków dla roli
- `occupiedSlots` = liczba zaakceptowanych zgłoszeń + obecnych członków tej roli
- `availableSlots` = `slots - occupiedSlots`
- frontend nie pozwala aplikować do pełnej roli
- backend powinien zwracać `409 Conflict` dla pełnej roli

### Status transitions

- `pending` → `accepted` lub `rejected`
- `accepted` / `rejected` nie mogą wrócić do `pending`
- odrzucenie nie dodaje użytkownika do zespołu
- akceptacja dodaje użytkownika do `project_members` i zmniejsza dostępność roli

### Closed recruitment

- gdy projekt ma `status = "closed"`, nie można składać nowych zgłoszeń
- frontend blokuje przycisk aplikacji

---

## 11. Autoryzacja i bezpieczeństwo

### Sesja cookie

- backend powinien używać ciasteczka `HttpOnly`
- frontend wysyła `fetch(..., { credentials: "include" })`
- nie przechowujemy tokenów JWT ani access tokenów w `localStorage`

### CSRF i CORS

- przy Sesion/Cookie-based auth należy włączyć CSRF dla state-changing endpoints
- CORS powinien umożliwiać przeglądarkę z `http://localhost:5173`
- `SameSite=Lax` lub `Strict` zależnie od konfiguracji, `Secure` w produkcji

### Authorization rules

- public endpoints: logowanie, rejestracja, reset hasła, pobieranie publicznych projektów
- protected endpoints: profil, dashboard, applications, project creation, modification, team management, notifications

### Standardowe kody błędów

- `400` — invalid request
- `401` — unauthenticated
- `403` — insufficient permissions
- `404` — resource not found
- `409` — duplicate application, full role, or conflicting state
- `422` — validation error

---

## 12. Integracja frontendu

### Mock mode vs real backend

W repo frontend działa w trybie mock. Zmienne środowiskowe są zdefiniowane w [README.md](README.md) oraz [.env.example](.env.example).

```env
VITE_API_BASE_URL=/api
VITE_USE_MOCKS=true
VITE_PROXY_TARGET=http://localhost:8080
```

- `VITE_USE_MOCKS=true` = dane z localStorage + mock services
- `VITE_USE_MOCKS=false` = frontend wysyła żądania do backendu przez `/api`
- w trybie lokalnym proxy z [vite.config.ts](vite.config.ts) przekierowuje `/api` do `VITE_PROXY_TARGET`

### Uruchomienie localne

```bash
npm install
npm run dev
```

### Aktualne pliki integracji

- [src/services/api.ts](src/services/api.ts)
- [src/app/App.tsx](src/app/App.tsx)
- [src/features/projects/Details.tsx](src/features/projects/Details.tsx)
- [src/features/dashboard/Dashboard.tsx](src/features/dashboard/Dashboard.tsx)
- [src/features/applications/Applications.tsx](src/features/applications/Applications.tsx)
- [vite.config.ts](vite.config.ts)

### Braki integracyjne

W tym repo nie ma backendu Java. Brakuje więc:

- prawdziwej sesji po stronie serwera
- właściwej autoryzacji i CSRF
- repozytoriów i migracji bazy danych
- real endpointów Spring Security
- Swagger/OpenAPI w repo

---

## 13. Modele bazy danych

### users

| Kolumna | Typ | Opis |
| --- | --- | --- |
| id | UUID / varchar PK | Identyfikator użytkownika |
| email | varchar unique | Email logowania |
| password_hash | varchar | Zhashowane hasło |
| name | varchar | Pełne imię i nazwisko |
| username | varchar unique | Nazwa użytkownika |
| university | varchar | Uczelnia |
| created_at | timestamp | Data utworzenia |

### projects

| Kolumna | Typ | Opis |
| --- | --- | --- |
| id | UUID / varchar PK | Identyfikator projektu |
| title | varchar | Tytuł projektu |
| short_description | text | Krótki opis do listy |
| description | text | Pełny opis |
| category | varchar | Kategoria projektu |
| university | varchar | Uczelnia |
| owner_id | FK users.id | Właściciel |
| status | varchar | `open`, `in_progress`, `closed` |
| created_at | timestamp | Data utworzenia |
| github_url | text nullable | Link do repo |

### project_roles

| Kolumna | Typ | Opis |
| --- | --- | --- |
| id | UUID / varchar PK | Identyfikator roli |
| project_id | FK projects.id | Projekt |
| name | varchar | Nazwa roli |
| slots | int | Maksymalna liczba członków |
| UNIQUE(project_id, name) | --- | Unikalność roli w projekcie |

### project_members

| Kolumna | Typ | Opis |
| --- | --- | --- |
| id | UUID / varchar PK | Identyfikator wpisu |
| project_id | FK projects.id | Projekt |
| user_id | FK users.id | Użytkownik |
| role_id | FK project_roles.id | Rola w projekcie |
| role_name | varchar | Nazwa roli |
| UNIQUE(project_id, user_id) | --- | Jeden użytkownik tylko raz w projekcie |

### project_applications

| Kolumna | Typ | Opis |
| --- | --- | --- |
| id | UUID / varchar PK | Identyfikator zgłoszenia |
| project_id | FK projects.id | Projekt |
| role_id | FK project_roles.id nullable | Rola z listy |
| applicant_id | FK users.id | Użytkownik składający zgłoszenie |
| message | text | Motywacja |
| status | varchar | `pending`, `accepted`, `rejected` |
| created_at | timestamp | Data wysłania |
| reviewed_at | timestamp nullable | Data rozpatrzenia |
| UNIQUE(project_id, applicant_id, role_id) | --- | Duplikat zgłoszenia nie może istnieć |

### notifications

| Kolumna | Typ | Opis |
| --- | --- | --- |
| id | UUID / varchar PK | Identyfikator powiadomienia |
| user_id | FK users.id | Użytkownik właściciel powiadomienia |
| text | text | Treść powiadomienia |
| read | boolean | Czy odczytane |
| created_at | timestamp | Data utworzenia |

---

## 14. Przykłady request/response

### Login

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

### Current user

```json
{
  "id": "u_123",
  "name": "Jan Kowalski",
  "username": "janek",
  "university": "Uniwersytet Warszawski",
  "skills": ["React", "TypeScript", "UX"]
}
```

### Project creation

```json
{
  "title": "AI mentor do nauki",
  "shortDescription": "Platforma do wspólnego planowania nauki.",
  "description": "Pełny opis projektu.",
  "goals": ["Cel 1", "Cel 2"],
  "category": "AI",
  "skills": ["React", "Python", "UX"],
  "roles": [
    { "name": "Frontend Developer", "slots": 2 },
    { "name": "Product Designer", "slots": 1 }
  ],
  "status": "open"
}
```

### Project edit

```json
{
  "status": "in_progress",
  "githubUrl": "https://github.com/example/project"
}
```

### Application acceptance

```json
{
  "status": "accepted"
}
```

### Application rejection

```json
{
  "status": "rejected"
}
```

### Project membership

```json
[
  {
    "user": {
      "id": "u_77",
      "name": "Marta Nowak",
      "username": "marta",
      "university": "Politechnika Warszawska",
      "skills": ["Java", "Spring Boot"]
    },
    "role": "Python Developer"
  }
]
```

### Notifications

```json
[
  {
    "id": "n_1",
    "text": "Anna zaakceptowała Twoje zgłoszenie do projektu AI mentor.",
    "read": false,
    "createdAt": "2026-10-31T12:00:00.000Z"
  }
]
```

### Standard API error

```json
{
  "type": "https://example.com/problems/conflict",
  "title": "Zgłoszenie już istnieje",
  "status": 409,
  "detail": "Użytkownik ma już aktywne zgłoszenie do tego projektu."
}
```

---

## 15. Checklist implementacji

- [x] Frontend route flow: landing, discover, project details, auth, dashboard, applications, settings
- [x] Mock application submission flow
- [x] Duplicate application prevention
- [x] Role availability logic in frontend
- [x] Application acceptance and rejection flow in mock mode
- [x] Team membership updates after acceptance
- [x] Role capacity calculations in frontend
- [x] `credentials: "include"` in fetch layer
- [x] Session-based frontend integration model
- [x] API specification documentation updated
- [ ] Real Java Spring Boot backend in repo
- [ ] Production DB and security hardening
- [ ] Real integration tests for application flow
- [ ] Swagger/OpenAPI generation in this repository

---

## 16. Pliki projektu

- [README.md](README.md)
- [BACKEND_API_SPEC.md](BACKEND_API_SPEC.md)
- [src/services/api.ts](src/services/api.ts)
- [src/types/index.ts](src/types/index.ts)
- [src/app/App.tsx](src/app/App.tsx)
- [src/features/projects/Details.tsx](src/features/projects/Details.tsx)
- [src/features/dashboard/Dashboard.tsx](src/features/dashboard/Dashboard.tsx)
- [src/features/applications/Applications.tsx](src/features/applications/Applications.tsx)
- [vite.config.ts](vite.config.ts)

---

## 17. Podsumowanie

Aktualny frontend BuildTogether posiada działający mock flow aplikowania do projektu i akceptacji zgłoszeń. Repo nie zawiera osobnego backendu Java; specyfikacja ma więc charakter kontraktu projektowego i dokumentacji integracyjnej. Backend Spring Boot powinien wdrożyć powyższe endpointy z sesją HTTP-only, walidacją, blokadami duplikatów i kontrolą właściciela projektu.
