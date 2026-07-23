import React from "react";

type ErrorInfo = {
  name: string;
  message: string;
  stack?: string;
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: ErrorInfo | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(err: unknown) {
    if (err instanceof Error) {
      return {
        error: {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
      };
    }
    return { error: { name: "UnknownError", message: String(err) } };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <section className="space-y-3">
          <h1 className="text-2xl font-bold">React error boundary caught an error</h1>

          <div className="rounded-lg border border-green-200 bg-white p-4 text-sm dark:border-green-500/40 dark:bg-gray-900">
            <div className="font-semibold">{error.name}</div>
            <div className="mt-1 whitespace-pre-wrap break-words text-gray-800 dark:text-gray-100">
              {error.message}
            </div>
            {error.stack ? (
                <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-3 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-green-200/60 dark:border-green-500/30">
                {error.stack}
              </pre>
            ) : null}
          </div>

          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            onClick={() => this.setState({ error: null })}
          >
            Clear error
          </button>
        </section>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default function TestErrorsPage() {
  return (
    <ErrorBoundary>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Test Errors</h1>

        <div className="rounded-lg border border-green-200 bg-white p-4 text-sm dark:border-green-500/40 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold mb-1">Convenient buttons for debugging</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Errors will be shown right on this page.
              </div>
            </div>

            <a
              href="#/test-errors"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Test errors
            </a>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                throw new Error("Sync render error (thrown immediately)");
              }}
            >
              Throw sync error
            </button>

            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                setTimeout(() => {
                  // This will not be caught by React error boundaries; shown here for awareness.
                  // eslint-disable-next-line no-throw-literal
                  throw new Error("Async error (setTimeout) — may not be caught by ErrorBoundary");
                }, 50);
              }}
            >
              Trigger async error
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-300">
            Note: ErrorBoundary catches errors during rendering/lifecycles/constructors, not necessarily async callbacks.
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
