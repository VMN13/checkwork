import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { printHtmlViaIframe } from "../utils/printViaIframe";
import { resumesApi } from "../api/resumesApi";
import { ApiError } from "../api/client";

type ResumeSubmitFormData = {
  jobTarget: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  status: "Draft" | "Published" | string;
};

function escapeHtml(value: string) {
  return (
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "<")
      .replaceAll(">", ">")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;")
  );
}

export default function ResumeSubmitPage() {
  const [error, setError] = useState<string | null>(null);

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const defaultValues = useMemo<ResumeSubmitFormData>(
    () => ({
      jobTarget: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      status: "Draft",
    }),
    [],
  );

  const { register, handleSubmit } = useForm<ResumeSubmitFormData>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  function onGeneratePdf(data: ResumeSubmitFormData) {
    try {
      const candidateName =
        `${data.firstName} ${data.lastName}`.trim() || "Кандидат";
      const title = `Резюме PDF: ${candidateName}`;

      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px;">
          <h1 style="margin:0 0 6px 0; font-size: 22px;">${escapeHtml(candidateName)}</h1>
          <div style="color:#555; margin-bottom: 14px; font-size: 14px;">${escapeHtml(
            data.jobTarget || "Должность",
          )}</div>

          <div style="display:inline-block; padding:6px 10px; border-radius:999px; background:#f3f4f6; color:#111827; font-size: 12px; margin-bottom: 16px;">
            Status: ${escapeHtml(data.status)}
          </div>

          <div style="margin-bottom: 14px; padding: 12px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="font-size: 12px; color:#666;">Контакты</div>
            <div style="margin-top:6px; font-size: 14px; line-height: 1.6;">
              <div><strong>Email:</strong> ${escapeHtml(data.email || "-")}</div>
              <div><strong>Phone:</strong> ${escapeHtml(data.phone || "-")}</div>
              <div><strong>Address:</strong> ${escapeHtml(data.address || "-")}</div>
              <div><strong>City/State:</strong> ${escapeHtml(
                `${data.city}/${data.state}`.replaceAll("//", "/"),
              ) || "-"}</div>
              <div><strong>Country:</strong> ${escapeHtml(data.country || "-")}</div>
            </div>
          </div>

          <div style="margin-top: 26px; color:#666; font-size: 12px;">
            Резюме сформировано из введённых данных.
          </div>
        </div>
      `;

      printHtmlViaIframe(html, title);
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    }
  }

  async function onSubmitToServer(data: ResumeSubmitFormData) {
    setServerError(null);
    setSuccessMessage(null);

    const candidateName =
      `${data.firstName} ${data.lastName}`.trim() || "Кандидат";
    const jobTitle = data.jobTarget || "Должность";

    const resumeIdFromUpload =
      data.email?.trim() ||
      `${data.firstName || "имя"}-${data.lastName || "фамилия"}`.trim();

    if (!candidateName || !jobTitle || !resumeIdFromUpload) {
      setServerError(
        "Заполните минимум: имя/фамилию, jobTarget и email или оба имени для идентификатора резюме.",
      );
      return;
    }

    setSubmitLoading(true);
    try {
      const draft = await resumesApi.createDraftResume({
        resumeIdFromUpload,
        candidateName,
        jobTitle,
      });

      const submitted = await resumesApi.submitResume(draft.resumeId);

      setSuccessMessage(
        `Резюме отправлено на сервер (статус: ${submitted.status}).`,
      );
    } catch (e) {
      if (e instanceof ApiError) {
        setServerError(
          `Ошибка отправки на сервер: ${e.message}${
            e.status ? ` (status: ${e.status})` : ""
          }${e.body ? ` — ${typeof e.body === "string" ? e.body : JSON.stringify(e.body)}` : ""}`,
        );
      } else {
        const msg = e instanceof Error ? e.message : String(e);
        setServerError(msg);
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Подача резюме</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          PDF не загружается пользователем. Резюме генерируется из данных формы
          и открывается для сохранения через печать браузером.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {serverError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-200">
          {serverError}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-500/40 dark:bg-green-900/20 dark:text-green-200">
          {successMessage}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onGeneratePdf)}
        className="rounded-lg border border-green-200 bg-white p-4 text-sm text-gray-800 dark:border-green-500/40 dark:bg-gray-900 dark:text-gray-100"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Желаемая должность</label>
            <input
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Желаемая роль"
              {...register("jobTarget")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Статус</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("status")}
            >
              <option value="Draft">Черновик</option>
              <option value="Published">Опубликовано</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Имя</label>
            <input
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("firstName")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Фамилия</label>
            <input
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("lastName")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Телефон</label>
            <input
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("phone")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Адрес</label>
            <input
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("address")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Город</label>
            <input
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("city")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Штат/Регион</label>
            <input
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("state")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Страна</label>
            <input
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("country")}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Сформировать PDF
          </button>

          <button
            type="button"
            disabled={submitLoading}
            onClick={handleSubmit(onSubmitToServer)}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading ? "Отправляем..." : "Отправить на сервер"}
          </button>
        </div>
      </form>
    </section>
  );
}
