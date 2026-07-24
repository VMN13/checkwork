import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { navigate } from "../../app/hashRouter";
import MaterialIcons from "../../material-icons/materialIcons";

type Role = "candidate" | "recruiter" | "admin";

function getStoredRole(): Role {
  const v = localStorage.getItem("role") as Role | null;
  return v === "recruiter" || v === "admin" || v === "candidate" ? v : "candidate";
}

export default function HeaderBar() {

  const { i18n } = useTranslation();
  const [role] = useState<Role>(() => getStoredRole());
  const [query, setQuery] = useState("");

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("auth.accessToken");
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth.accessToken") setAccessToken(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const placeholder = useMemo(() => {
    const ru = "Поиск по всем данным…";
    const en = "Search everything…";
    return i18n.language === "ru" ? ru : en;
  }, [i18n.language]);

  useEffect(() => {
    const ev = new CustomEvent("app:searchChanged", { detail: { query } });
    window.dispatchEvent(ev);
  }, [query]);

  const lang = i18n.language === "ru" ? "ru" : "en";

  return (
    <header className="sticky top-0 z-40 border-b border-green-200 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ name: "home" })}
              className="text-left"
              aria-label="Home"
            >
              <div className="flex items-center gap-2">
                <MaterialIcons className="text-gray-900" />
                <div className="text-sm font-semibold text-gray-900">
                  ResumeBoard
                </div>
              </div>
              <div className="text-xs text-gray-600">
                {role === "candidate"
                  ? i18n.language === "ru"
                    ? "Кандидат"
                    : "Candidate"
                  : role === "recruiter"
                    ? i18n.language === "ru"
                      ? "Рекрутер"
                      : "Recruiter"
                    : i18n.language === "ru"
                      ? "Администратор"
                      : "Administrator"}
              </div>
            </button>

            <nav className="hidden items-center gap-2 sm:flex" aria-label="Navigation">
              <button
                type="button"
                onClick={() => navigate({ name: "jobs" })}
                className="rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {i18n.language === "ru" ? "Вакансии" : "Jobs"}
              </button>
              <button
                type="button"
                onClick={() => navigate({ name: "resumes" })}
                className="rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {i18n.language === "ru" ? "Резюме" : "Resumes"}
              </button>

              <button
                type="button"
                onClick={() => navigate({ name: "resumeSubmit" })}
                className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-700"
              >
                {i18n.language === "ru" ? "Подача резюме" : "Submit resume"}
              </button>

              {accessToken ? (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("auth.accessToken");
                    setAccessToken(null);
                    navigate({ name: "login" });
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
                >
                  {i18n.language === "ru" ? "Выйти" : "Logout"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate({ name: "login" })}
                    className="rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {i18n.language === "ru" ? "Вход" : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate({ name: "register" })}
                    className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                  >
                    {i18n.language === "ru" ? "Регистрация" : "Register"}
                  </button>
                </>
              )}
            </nav>

            {/* Mobile nav */}
            <div className="flex gap-2 sm:hidden" aria-label="Navigation mobile">
              <button
                type="button"
                onClick={() => navigate({ name: "jobs" })}
                className="rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {i18n.language === "ru" ? "Вакансии" : "Jobs"}
              </button>
              <button
                type="button"
                onClick={() => navigate({ name: "resumes" })}
                className="rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {i18n.language === "ru" ? "Резюме" : "Resumes"}
              </button>
              <button
                type="button"
                onClick={() => navigate({ name: "resumeSubmit" })}
                className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-700"
              >
                {i18n.language === "ru" ? "Подача" : "Submit"}
              </button>

              {accessToken ? (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("auth.accessToken");
                    setAccessToken(null);
                    navigate({ name: "login" });
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
                >
                  {i18n.language === "ru" ? "Выход" : "Logout"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate({ name: "login" })}
                    className="rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {i18n.language === "ru" ? "Вход" : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate({ name: "register" })}
                    className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                  >
                    {i18n.language === "ru" ? "Регистрация" : "Register"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end sm:flex-row sm:gap-3">
            <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => i18n.changeLanguage("en")}
                disabled={lang === "en"}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  lang === "en"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage("ru")}
                disabled={lang === "ru"}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  lang === "ru"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                aria-label="Switch to Russian"
              >
                RU
              </button>
            </div>

            <div className="w-full sm:w-72">
              <label className="sr-only" htmlFor="globalSearch">
                {i18n.language === "ru" ? "Поиск" : "Search"}
              </label>
              <input
                id="globalSearch"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
