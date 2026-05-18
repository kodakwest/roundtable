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
        className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
            <LockKeyhole size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-100">Roundtable Admin</h1>
            <p className="text-sm text-slate-500">Enter your publishing key.</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-slate-300" htmlFor="admin-key">
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
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
          autoComplete="current-password"
        />
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 active:scale-[0.99]"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
