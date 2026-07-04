import { useEffect, useState } from "react";
import i18n from "./i18";

type Lang = "en" | "ru";

export default function LanguageSwitcher() {
  const [, force] = useState(0);
  const lang = (i18n.language === "ru" ? "ru" : "en") as Lang;
  const t = i18n.t as unknown as (key: string) => string;

  useEffect(() => {
    const onChanged = () => force((v) => v + 1);
    i18n.on("languageChanged", onChanged);
    return () => i18n.off("languageChanged", onChanged);
  }, []);

  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm text-gray-700">{t("page.dashboardTitle")}</div>
      <div className="space-x-2">
        <button
          type="button"
          onClick={() => i18n.changeLanguage("en")}
          disabled={lang === "en"}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {t("page.langEnButton")}
        </button>
        <button
          type="button"
          onClick={() => i18n.changeLanguage("ru")}
          disabled={lang === "ru"}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {t("page.langRuButton")}
        </button>
      </div>
    </div>
  );
}


  