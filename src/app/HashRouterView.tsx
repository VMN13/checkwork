import { useEffect, useMemo, useState } from "react";
import { parseHashRoute } from "./hashRouter";
import type { Route } from "./hashRouter";
import HeaderBar from "../components/app/HeaderBar";
import HomePage from "../pages/HomePage";
import JobsPage from "../pages/JobsPage";
import ResumesPage from "../pages/ResumesPage";
import JobDetailsPage from "../pages/JobDetailsPage";
import ResumeDetailsPage from "../pages/ResumeDetailsPage";
import ResumeSubmitPage from "../pages/ResumeSubmitPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function HashRouterView() {
  const [route, setRoute] = useState<Route>(() => parseHashRoute(window.location.hash));


  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const content = useMemo(() => {
    switch (route.name) {
      case "home":
        return <HomePage />;
      case "jobs":
        return <JobsPage />;
      case "resumes":
        return <ResumesPage />;
      case "jobDetails":
        return <JobDetailsPage id={route.id} />;
      case "resumeDetails":
        return <ResumeDetailsPage id={route.id} />;
      case "resumeSubmit":
        return <ResumeSubmitPage />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      default:
        return <NotFoundPage />;
    }
  }, [route]);

  return (
    <div className="flex min-h-dvh flex-col bg-white text-gray-900">
      <HeaderBar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">{content}</main>

      <footer className="border-t border-green-200 bg-white/85">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm text-gray-600">
          @Valiavaty Maksim
        </div>
      </footer>
    </div>
  );
}
