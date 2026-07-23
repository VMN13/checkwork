import { useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { navigate } from "../app/hashRouter";

type Status = "idle" | "loading" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && status !== "loading";
  }, [email, password, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem("auth.accessToken", res.accessToken);
      navigate({ name: "resumes" });
    } catch (err: unknown) {
      setStatus("error");
      const msg =
        (typeof err === "object" && err !== null && "body" in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err as any)?.body?.message
          : undefined) ??
        (err instanceof Error ? err.message : undefined) ??
        "Login failed. Please try again.";
      setError(String(msg));
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-4 text-2xl font-semibold">Login</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border px-3 py-2"
            type="email"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border px-3 py-2"
            type="password"
            required
          />
        </label>

        {error ? <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

        <button
          disabled={!canSubmit}
          className="rounded bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-60"
          type="submit"
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm text-gray-600 underline"
        onClick={() => navigate({ name: "register" })}
      >
        No account? Register
      </button>
    </div>
  );
}
