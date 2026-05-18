import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { setAdminKey } from "../../lib/api";

type Props = {
  onLogin: () => void;
};

export default function AdminLogin({ onLogin }: Props) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!key.trim()) {
      setError("Enter the admin key.");
      return;
    }
    setAdminKey(key.trim());
    onLogin();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-6 shadow-xl shadow-black/20"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]">
            <LockKeyhole size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[var(--ink-primary)]">Roundtable Admin</h1>
            <p className="text-sm text-[var(--ink-tertiary)]">Enter your publishing key.</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-[var(--ink-secondary)]" htmlFor="admin-key">
          Admin key
        </label>
        <input
          id="admin-key"
          type="password"
          value={key}
          onChange={(event) => {
            setKey(event.target.value);
            setError("");
          }}
          className="mt-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--ink-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)]"
          autoComplete="current-password"
        />
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-base)] transition hover:brightness-110 active:scale-[0.99]"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
