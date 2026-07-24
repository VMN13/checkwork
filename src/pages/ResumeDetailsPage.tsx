import { useMemo, useState } from "react";
import { type Resume } from "../components/tables/ResumesTable";
import KeyValueTable from "../components/common/KeyValueTable";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageTyped";
import { printHtmlViaIframe } from "../utils/printViaIframe";

function getMockResume(id: string): Resume {
  const fallback: Resume[] = [
    {
      id: "r1",
      candidateName: "John Doe",
      jobTitle: "Business Analyst",
      status: "Published",
      likesCount: 12,
      updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "r2",
      candidateName: "Anna Kowalski",
      jobTitle: "Frontend Engineer (React)",
      status: "Draft",
      likesCount: 3,
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "r3",
      candidateName: "Ivan Ivanov",
      jobTitle: "DevOps Engineer",
      status: "Published",
      likesCount: 7,
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];

  return (
    fallback.find((r) => r.id === id) ?? {
      id,
      candidateName: `Candidate ${id}`,
      jobTitle: "Unknown job",
      status: "Draft",
      likesCount: 0,
      updatedAt: new Date().toISOString(),
    }
  );
}

export default function ResumeDetailsPage({ id }: { id: string }) {
  const mock = useMemo(() => getMockResume(id), [id]);
  const [saved, setSaved] = useState<Resume | null>(() =>
    loadFromLocalStorage<Resume>(`resume:${id}`),
  );

  const resume = saved ?? mock;
  const alreadySaved = saved != null;

  const handleSave = () => {
    saveToLocalStorage<Resume>(`resume:${resume.id}`, resume);
    setSaved(resume);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{resume.candidateName}</h1>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {resume.jobTitle}
          </div>

          <div className="mt-2 text-xs">
            <span
              className={[
                "inline-flex items-center rounded-full px-2 py-1 font-medium",
                resume.status === "Published"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
              ].join(" ")}
            >
              {resume.status}
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
              const title = `Resume PDF: ${resume.candidateName}`;
              const html = `
                <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px;">
                  <h1 style="margin:0 0 8px 0;">${resume.candidateName}</h1>
                  <div style="color:#555; margin-bottom: 14px;">${resume.jobTitle}</div>

                  <div style="margin-bottom: 20px; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    <div style="font-size: 12px; color:#666;">Updated</div>
                    <div style="margin-top:4px;">${new Date(resume.updatedAt).toLocaleString()}</div>

                    <div style="height:10px"></div>

                    <div style="font-size: 12px; color:#666;">Status</div>
                    <div style="margin-top:4px;">${resume.status}</div>

                    <div style="height:10px"></div>

                    <div style="font-size: 12px; color:#666;">Likes</div>
                    <div style="margin-top:4px;">${resume.likesCount}</div>
                  </div>

                  <h2 style="margin:0 0 8px 0; font-size:16px;">Описание (mock)</h2>
                  <p style="color:#333; margin:0; line-height:1.5;">
                    Это демонстрационная страница резюме. PDF генерируется через печать браузером.
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
     

        <KeyValueTable
          rows={[
            {
              keyLabel: "Updated",
              value: new Date(resume.updatedAt).toLocaleString(),
            },
            {
              keyLabel: "Likes",
              value: resume.likesCount,
            },
          ]}
        />

        {alreadySaved && (
          <div className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            Сохранено в localStorage для id: {resume.id}
          </div>
        )}
      </div>
    </section>
  );
}
