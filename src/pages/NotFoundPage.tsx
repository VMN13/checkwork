import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    // В SPA (hash-router) нет реального HTTP 404, но делаем UX-объявление.
    document.title = "404 Not found";
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">404 Not found</h1>

      <div className="rounded-lg border border-green-200 bg-white p-4 text-sm dark:border-green-500/40 dark:bg-gray-900">
        Страница не найдена. Проверьте адрес в строке браузера или перейдите на главную.
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        <a
          href="#/home"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 font-medium shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          Back to home
        </a>
      </div>
    </section>
  );
}
