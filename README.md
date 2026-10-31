# BuildTogether Frontend

Frontend MVP platformy wspierającej studentów w odkrywaniu projektów, rekrutacji i budowaniu zespołów.

## Dokumentacja

- [Specyfikacja API](BACKEND_API_SPEC.md)
- [Przykładowe zmienne środowiska](.env.example)
- [Kod warstwy API](src/services/api.ts)

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

Plik [.env.example](.env.example) zawiera podstawowe ustawienia:

```env
VITE_API_BASE_URL=/api
VITE_USE_MOCKS=false
VITE_PROXY_TARGET=http://localhost:8080
```

W Dockerze można ustawić:

```env
VITE_PROXY_TARGET=http://backend:8080
```

## Architektura backend-ready

- pusty stan startowy: [src/mocks/data.ts](src/mocks/data.ts)
- warstwa API: [src/services/api.ts](src/services/api.ts)
- tryb backend-ready: `VITE_USE_MOCKS=false`
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

Aplikacja została przygotowana w pustym stanie startowym, bez danych demonstracyjnych. Repo nie ma osobnego backendu Java; frontend jest gotowy do integracji z backendem Java Spring Boot i do testów z realnym API. Dokumentacja API obejmuje zarówno kontrakt frontendowy, jak i plan integracji z backendem.
