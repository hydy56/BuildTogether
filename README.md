# BuildTogether Frontend

Frontend MVP platformy wspierającej studentów w odkrywaniu projektów, rekrutacji i budowaniu zespołów.

## Uruchomienie

### Lokalnie

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem http://localhost:5173.

### Docker

```bash
docker compose up --build
```

Frontend działa na porcie 5173, a proxy API jest konfigurowane przez zmienną `VITE_PROXY_TARGET`.

## Konfiguracja środowiska

Plik `.env.example` zawiera podstawowe ustawienia:

```env
VITE_API_BASE_URL=/api
VITE_USE_MOCKS=true
VITE_PROXY_TARGET=http://localhost:8080
```

W Dockerze można ustawić:

```env
VITE_PROXY_TARGET=http://backend:8080
```

## Architektura demo

- dane mockowane: `src/mocks/data.ts`
- warstwa API: `src/services/api.ts`
- tryb demo: `VITE_USE_MOCKS=true`
- frontend używa `/api` oraz `credentials: "include"` zgodnie z planem integracji z backendem Spring Boot

## Zaimplementowane obszary

- landing page
- lista projektów z wyszukiwaniem i filtrami
- szczegóły projektu
- aplikacja do projektu
- auth: login, rejestracja, reset hasła
- profil użytkownika
- dashboard projektów
- zgłoszenia
- tworzenie projektu
- ustawienia
- dark mode i powiadomienia

## Uwagi

To jest wersja demo/frontendowa. Nie należy traktować jej jako bezpiecznego systemu uwierzytelniania produkcyjnego — jest to warstwa prezentacyjna i mock API przygotowane pod integrację z backendem Java Spring Boot.
