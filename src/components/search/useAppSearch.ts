import { useEffect, useState } from "react";

export function useAppSearch() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onChanged = (e: Event) => {
      const ev = e as CustomEvent<{ query: string }>;
      const next = typeof ev.detail?.query === "string" ? ev.detail.query : "";
      setQuery(next);
    };

    window.addEventListener("app:searchChanged", onChanged);
    return () => window.removeEventListener("app:searchChanged", onChanged);
  }, []);

  return query;
}
