export type Route =
  | { name: "home" }
  | { name: "jobs" }
  | { name: "resumes" }
  | { name: "resumeSubmit" }
  | { name: "login" }
  | { name: "register" }
  | { name: "jobDetails"; id: string }
  | { name: "resumeDetails"; id: string }
  | { name: "testErrors" }
  | { name: "notFound" };

export function parseHashRoute(hash: string): Route {
  const cleaned = (hash || "").replace(/^#/, "").trim();
  if (!cleaned) return { name: "home" };

  const [path, maybeId] = cleaned.split("/").filter(Boolean);

  switch (path) {
    case "jobs":
      return { name: "jobs" };
    case "resumes":
      return { name: "resumes" };
    case "job":
      return { name: "jobDetails", id: maybeId ?? "unknown" };
    case "resume":
      return { name: "resumeDetails", id: maybeId ?? "unknown" };
    case "resume-submit":
      return { name: "resumeSubmit" };
    case "login":
      return { name: "login" };
    case "register":
      return { name: "register" };
    case "test-errors":
      return { name: "testErrors" };
    case "home":
      return { name: "home" };
    default:
      return { name: "notFound" };
  }
}

export function buildHash(route: Route): string {
  switch (route.name) {
    case "home":
      return "#/home";
    case "jobs":
      return "#/jobs";
    case "resumes":
      return "#/resumes";
    case "jobDetails":
      return `#/job/${encodeURIComponent(route.id)}`;
    case "resumeDetails":
      return `#/resume/${encodeURIComponent(route.id)}`;
    case "resumeSubmit":
      return "#/resume-submit";
    case "login":
      return "#/login";
    case "register":
      return "#/register";
    case "testErrors":
      return "#/test-errors";
    case "notFound":
      return "#/404";
  }
}

export function navigate(route: Route) {
  window.location.hash = buildHash(route);
}
