import { Counter } from './features/counter/Counter'
import { TestComponents } from './components/TestComponents'
import HookForm from './hook-form/hookform'
import Materialicons from './material-icons/materialIcons'
import { UsersByCountryChart } from "./components/chart/UsersByCountryChart";
import DayPicker from './components/daypicker/daypicker'
import LanguageSwitcher from './components/i18n/LanguageSwitcher'
import "./components/i18n/i18";

import { useEffect, useState } from "react";

function App() {
  const [dashboardTitle, setDashboardTitle] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Срезаем типизацию useTranslation/t, чтобы избежать TS2589
      const mod = await import("react-i18next");
      const translation = (mod as unknown as { useTranslation: () => unknown })
        .useTranslation();

      const t = translation as unknown as { t: (key: string) => string };
      const next = t.t("page.dashboardTitle");

      if (!cancelled) setDashboardTitle(next);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {dashboardTitle}
      </h1>
      <DayPicker />
      <Materialicons />
      <HookForm />
      <Counter />
      <TestComponents />
      <UsersByCountryChart />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div className="mt-8">
        <LanguageSwitcher />
      </div>
    </>
  )
}

export default App
