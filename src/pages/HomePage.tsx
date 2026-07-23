import { useEffect, useState } from "react";
import JobsTable from "../components/tables/JobsTable";
import { useAppSearch } from "../components/search/useAppSearch";
import { statsApi, type PopularJobItem, type StatsResponse } from "../api/statsApi";

export default function HomePage() {
  const query = useAppSearch();

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [popularJobs, setPopularJobs] = useState<PopularJobItem[]>([]);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStatsError(null);

      try {
        const [statsRes, popularRes] = await Promise.all([
          statsApi.getStats(),
          statsApi.getPopularJobs(5),
        ]);

        if (cancelled) return;

        setStats(statsRes);
        setPopularJobs(popularRes?.items ?? []);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Unknown error";
        setStatsError(msg);
        setStats(null);
        setPopularJobs([]);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">ResumeBoard</h1>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {query.trim() ? `Showing filtered content for: “${query.trim()}”` : "Browse jobs and resumes"}
          </div>
        </div>

        <div className="rounded-lg border border-green-200 bg-white p-3 text-sm text-gray-700 dark:border-green-500/40 dark:bg-gray-900 dark:text-gray-200">
          <div className="font-semibold mb-1">Stats</div>

          {statsError ? (
            <div className="text-xs text-red-600 dark:text-red-400">
              Failed to load stats
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Resumes (24h)</div>
              <div className="font-semibold">{stats ? stats.resumes24h : "…"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Jobs</div>
              <div className="font-semibold">{stats ? stats.jobsTotal : "…"}</div>
            </div>
            <div className="sm:col-span-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">Candidates</div>
              <div className="font-semibold">{stats ? stats.candidatesTotal : "…"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col h-full">
            <h2 className="mb-3 text-lg font-semibold">Latest jobs</h2>
            <JobsTable query={query} />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="rounded-lg border border-green-200 bg-white p-4 text-sm text-gray-700 dark:border-green-500/40 dark:bg-gray-900 dark:text-gray-200 h-full">
            <div className="font-semibold mb-2">Popular jobs (Top 5)</div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-green-200 bg-gray-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-green-500/40 dark:bg-gray-800 dark:text-gray-200">
                      Title
                    </th>
                    <th className="border-b border-green-200 bg-gray-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-green-500/40 dark:bg-gray-800 dark:text-gray-200">
                      Rank
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(popularJobs ?? []).length === 0 ? (
                    <tr>
                      <td
                        className="border-b border-gray-100 px-3 py-2 text-sm"
                        colSpan={2}
                      >
                        {statsError ? "Failed to load popular jobs" : "…"}
                      </td>
                    </tr>
                  ) : (
                    popularJobs.map((job) => (
                      <tr key={`${job.rank}-${job.title}`}>
                        <td className="border-b border-gray-100 px-3 py-2 text-sm">
                          {job.title}
                        </td>
                        <td className="border-b border-gray-100 px-3 py-2 text-sm">
                          {job.rank}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
