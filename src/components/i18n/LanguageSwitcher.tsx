import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [changeLanguage, setChangeLanguage] = useState<
    ((lang: "en" | "ru") => Promise<unknown>) | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mod = await import("react-i18next");
      const translation = (mod as unknown as { useTranslation: () => unknown })
        .useTranslation();

      const i18n = translation as unknown as { changeLanguage: (lng: string) => Promise<unknown> };
      if (!cancelled)
        setChangeLanguage(() => (lng: string) => i18n.changeLanguage(lng));
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-4 space-x-2">
      <button
        onClick={() => changeLanguage?.("en")}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={!changeLanguage}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage?.("ru")}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={!changeLanguage}
      >
        RU
      </button>
    </div>
  );
}


  