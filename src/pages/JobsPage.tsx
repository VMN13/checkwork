import { useMemo } from "react";
import JobsTable from "../components/tables/JobsTable";
import { useAppSearch } from "../components/search/useAppSearch";

export default function JobsPage() {
  const query = useAppSearch();

  const title = useMemo(() => {
    return query.trim() ? `Jobs (filtered)` : "Jobs";
  }, [query]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {query.trim() ? `Search: “${query.trim()}”` : "Search works from the top bar"}
        </div>
      </div>

      <JobsTable query={query} />
    </section>
  );
}
