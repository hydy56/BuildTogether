# BuildTogether (frontend MVP – rdzeń)
`npm install && npm run dev` → http://localhost:5173 (Vite nasłuchuje na 0.0.0.0, działa w Dockerze).

- Tryb demo: `VITE_USE_MOCKS=true` (dane w `src/mocks`, zmiany żyją do odświeżenia strony).
- Warstwa API: `src/services/api.ts` – `projectsApi`, `applicationsApi` (kontrakty `/api/...` do podmiany na Spring Boot; docelowo sesje HttpOnly cookie, `credentials: "include"`, bez tokenów w localStorage).
- Zaimplementowane: design system, layout, landing, odkrywanie projektów (filtry), szczegóły + aplikowanie.
- Do zrobienia: auth, tworzenie/edycja projektu, dashboard, zgłoszenia, profil, ustawienia, shadcn/ui, RHF+Zod.
