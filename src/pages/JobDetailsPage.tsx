import { useMemo, useState } from "react";
import { type Job } from "../components/tables/JobsTable";
import KeyValueTable from "../components/common/KeyValueTable";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageTyped";
import { printHtmlViaIframe } from "../utils/printViaIframe";

function getMockJob(id: string): Job {
  const fallback: Job[] = [
    {
      id: "1",
      title: "Business Analyst",
      company: "Acme Corp",
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      salaryMin: 80,
      salaryMax: 120,
      location: "Remote",
      isOpen: true,
    },
    {
      id: "2",
      title: "Frontend Engineer (React)",
      company: "Globex",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      salaryMin: 100,
      salaryMax: 180,
      location: "Warsaw",
      isOpen: true,
    },
    {
      id: "3",
      title: "DevOps Engineer",
      company: "Initech",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      salaryMin: 120,
      salaryMax: 220,
      location: "Berlin",
      isOpen: false,
    },
    {
      id: "4",
      title: "QA Engineer",
      company: "Soylent",
      updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      salaryMin: 70,
      salaryMax: 130,
      location: "Kyiv",
      isOpen: true,
    },
  ];

  return (
    fallback.find((j) => j.id === id) ?? {
      id,
      title: `Job ${id}`,
      company: "Mock company",
      updatedAt: new Date().toISOString(),
      salaryMin: 50,
      salaryMax: 100,
      location: "Unknown",
      isOpen: true,
    }
  );
}

export default function JobDetailsPage({ id }: { id: string }) {
  const mock = useMemo(() => getMockJob(id), [id]);
  const [saved, setSaved] = useState<Job | null>(() =>
    loadFromLocalStorage<Job>(`job:${id}`),
  );

  const job = saved ?? mock;

  const alreadySaved = saved != null;

  const handleSave = () => {
    saveToLocalStorage<Job>(`job:${job.id}`, job);
    setSaved(job);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {job.company} • {job.location}
          </div>
          <div className="mt-2 text-xs">
            <span
              className={[
                "inline-flex items-center rounded-full px-2 py-1 font-medium",
                job.isOpen
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
              ].join(" ")}
            >
              {job.isOpen ? "Open" : "Closed"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Сохранить
          </button>

          <button
            type="button"
            onClick={() => {
              const title = `Job PDF: ${job.title}`;
              const salary =
                typeof job.salaryMin === "number" || typeof job.salaryMax === "number"
                  ? `${job.salaryMin ?? "—"}–${job.salaryMax ?? "—"}`
                  : "—";

              const html = `
                <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px;">
                  <h1 style="margin:0 0 8px 0;">${job.title}</h1>
                  <div style="color:#555; margin-bottom: 14px;">${job.company} • ${job.location}</div>
                  <div style="margin-bottom: 20px; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    <div style="font-size: 12px; color:#666;">Обновлено</div>
                    <div style="margin-top:4px;">${new Date(job.updatedAt).toLocaleString()}</div>

                    <div style="height:10px"></div>

                    <div style="font-size: 12px; color:#666;">Зарплата</div>
                    <div style="margin-top:4px;">${salary}</div>

                    <div style="height:10px"></div>

                    <div style="font-size: 12px; color:#666;">Статус</div>
                    <div style="margin-top:4px;">${job.isOpen ? "Open" : "Closed"}</div>
                  </div>

                  <h2 style="margin:0 0 8px 0; font-size:16px;">Описание (mock)</h2>
                  <p style="color:#333; margin:0; line-height:1.5;">
                    Это демонстрационная страница вакансии. PDF генерируется через печать браузером.
                  </p>
                </div>
              `;
              printHtmlViaIframe(html, title);
            }}
            className="rounded-md border border-green-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-green-500/30 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Скачать PDF
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-green-200 bg-white p-4 text-sm text-gray-800 dark:border-green-500/40 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="mb-2 text-lg font-semibold">Описание (mock)</h2>
        <p className="text-gray-700 dark:text-gray-200">
          Это демонстрационная страница вакансии. Здесь должен быть подробный текст вакансии,
          соответствующий данным с бэкенда/шаблонами, но сейчас используется mock для UI/роутинга.
        </p>

        <KeyValueTable
          rows={[
            {
              keyLabel: "Обновлено",
              value: new Date(job.updatedAt).toLocaleString(),
            },
            {
              keyLabel: "Зарплата",
              value:
                typeof job.salaryMin === "number" || typeof job.salaryMax === "number"
                  ? `${job.salaryMin ?? "—"}–${job.salaryMax ?? "—"}`
                  : "—",
            },
          ]}
        />

        {alreadySaved && (
          <div className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            Сохранено в localStorage для id: {job.id}
          </div>
        )}
      </div>
    </section>
  );
}
