import { useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { navigate } from "../app/hashRouter";

type Status = "idle" | "loading" | "error";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      email.trim().length > 0 && password.length > 0 && status !== "loading"
    );
  }, [email, password, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      await authApi.register({
        email,
        password,
        name: name.trim() ? name : undefined,
      });

      const res = await authApi.login({ email, password });
      localStorage.setItem("auth.accessToken", res.accessToken);
      navigate({ name: "resumes" });
    } catch (err: unknown) {
      setStatus("error");
      const msg =
        (typeof err === "object" && err !== null && "body" in err
          ? (err as { body?: { message?: string } }).body?.message
          : undefined) ??
        (err instanceof Error ? err.message : undefined) ??
        "Register failed. Please try again.";
      setError(String(msg));
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-4 text-2xl font-semibold">Register</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Name (optional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border px-3 py-2"
            type="text"
          />
        </label>

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

        {error ? (
          <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          disabled={!canSubmit}
          className="rounded bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-60"
          type="submit"
        >
          {status === "loading" ? "Creating..." : "Create account"}
        </button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm text-gray-600 underline"
        onClick={() => navigate({ name: "login" })}
      >
        Have an account? Login
      </button>
    </div>
  );
}
