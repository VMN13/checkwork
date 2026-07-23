import { useEffect, useMemo, useState } from "react";
import ResumesTable, { type Resume } from "../components/tables/ResumesTable";
import { useAppSearch } from "../components/search/useAppSearch";
import { resumesApi, type GetResumesResponseItem } from "../api/resumesApi";

export default function ResumesPage() {
  const query = useAppSearch();

  const title = useMemo(() => {
    return query.trim() ? `Resumes (filtered)` : "Resumes";
  }, [query]);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await resumesApi.getResumes();

        if (!mounted) return;

        if (!Array.isArray(res)) {
          const serialized =
            typeof res === "string" ? res : (() => {
              try {
                return JSON.stringify(res);
              } catch {
                return String(res);
              }
            })();

          setError(
            `Unexpected /resumes response. Expected array, got: ${typeof res}. Body: ${serialized}`,
          );
          setResumes([]);
          return;
        }

        const mapped: Resume[] = (res as GetResumesResponseItem[]).map((r) => ({
          id: r.id,
          candidateName: r.candidateName,
          jobTitle: r.jobTitle,
          status: r.status,
          likesCount: r.likesCount,
          updatedAt: r.updatedAt,
        }));

        setResumes(mapped);
      } catch (e) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {query.trim() ? `Search: “${query.trim()}”` : "Search works from the top bar"}
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-gray-600 dark:text-gray-300">Loading resumes...</div>
      ) : (
        <ResumesTable query={query} resumes={resumes} />
      )}
    </section>
  );
}
