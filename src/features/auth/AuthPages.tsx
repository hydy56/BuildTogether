import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, School, UserRound } from "lucide-react";
import { Logo } from "../../components/ui";
import { authApi } from "../../services/api";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
};

function AuthShell({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <ArrowLeft size={16} />
            Wróć do strony głównej
          </Link>
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="hidden bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">BuildTogether</span>
              <h2 className="mt-8 max-w-md text-4xl font-bold leading-tight">Znajdź swoich ludzi i zbuduj coś razem.</h2>
            </div>
            <div className="space-y-4 text-sm text-indigo-50">
              <p>Dołącz do zespołów studentów, którzy realizują projekty startupowe, AI, gry i inicjatywy naukowe.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="font-semibold">3k+</p>
                  <p>aktywnych użytkowników</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="font-semibold">240+</p>
                  <p>projektów w rekrutacji</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">
              <div className="mb-6">
                <p className="text-sm font-medium text-brand-600">Dostęp do aplikacji</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
                <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
              </div>

              {children}

              <p className="mt-6 text-center text-sm text-slate-500">
                {footerText}{" "}
                <Link to={footerLinkTo} className="font-semibold text-brand-600 hover:text-brand-700">
                  {footerLinkText}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      setIsLoading(true);
      await authApi.login({ email, password });
      navigate("/projects", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Zaloguj się"
      subtitle="Witaj ponownie. Wejdź do swojego konta i kontynuuj rozwój projektów."
      footerText="Nie masz konta?"
      footerLinkText="Zarejestruj się"
      footerLinkTo="/register"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Adres e-mail</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} />
            <input
              type="email"
              name="email"
              defaultValue="demo@buildtogether.dev"
              placeholder="twoj@email.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
          </div>
        </label>

        <label className="block">
          <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
            <span>Hasło</span>
            <Link to="/forgot-password" className="text-brand-600 hover:text-brand-700">
              Zapomniałeś hasła?
            </Link>
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              defaultValue="demo123"
              placeholder="Wprowadź hasło"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 accent-brand-600" />
            Zapamiętaj mnie
          </label>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Demo</span>
        </div>

        <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400">
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const university = String(form.get("university") ?? "");
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Hasła muszą być takie same.");
      return;
    }

    try {
      setIsLoading(true);
      await authApi.register({ name, email, university, password });
      navigate("/projects", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Utwórz konto"
      subtitle="Dołącz do społeczności studentów i zacznij budować projekty razem."
      footerText="Masz już konto?"
      footerLinkText="Zaloguj się"
      footerLinkTo="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Imię i nazwisko</span>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} />
            <input
              type="text"
              name="name"
              placeholder="Jan Kowalski"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Adres e-mail</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} />
            <input
              type="email"
              name="email"
              placeholder="twoj@email.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Uczelnia</span>
          <div className="relative">
            <School className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} />
            <input
              type="text"
              name="university"
              placeholder="np. Uniwersytet Warszawski"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Hasło</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Utwórz hasło"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Powtórz hasło</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} />
            <input
              type={showRepeatPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Powtórz hasło"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
            />
            <button
              type="button"
              aria-label={showRepeatPassword ? "Ukryj hasło" : "Pokaż hasło"}
              onClick={() => setShowRepeatPassword((value) => !value)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
            >
              {showRepeatPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400">
          {isLoading ? "Tworzenie konta..." : "Utwórz konto"}
        </button>
      </form>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");

    if (!email.trim()) {
      setError("Podaj adres e-mail.");
      return;
    }

    setError("");
    setSent(true);
  };

  return (
    <AuthShell
      title="Resetowanie hasła"
      subtitle="Wpisz adres e-mail, a wyślemy Ci link do zmiany hasła."
      footerText="Pamiętasz hasło?"
      footerLinkText="Zaloguj się"
      footerLinkTo="/login"
    >
      {!sent ? (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Adres e-mail</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} />
              <input
                type="email"
                name="email"
                placeholder="twoj@email.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white"
              />
            </div>
          </label>

          <button type="submit" className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            Wyślij link resetujący
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          <p className="font-semibold">Link został wysłany.</p>
          <p className="mt-2 text-emerald-700">Sprawdź skrzynkę e-mail i użyj instrukcji, aby ustawić nowe hasło.</p>
          <Link to="/login" className="mt-4 inline-flex rounded-lg bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-700">
            Wróć do logowania
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
