import { useEffect, useState } from "react";
import { LogOut, Plus, RefreshCw } from "lucide-react";
import { clearAdminKey } from "../../lib/api";
import { useRoundtableStore } from "../../store/useRoundtableStore";
import GuideComposer from "./GuideComposer";

type Props = {
  onLogout: () => void;
};

export default function AdminDashboard({ onLogout }: Props) {
  const guides = useRoundtableStore((s) => s.guides);
  const isLoading = useRoundtableStore((s) => s.isLoading);
  const loadGuides = useRoundtableStore((s) => s.loadGuides);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    void loadGuides();
  }, [loadGuides]);

  function handleLogout() {
    clearAdminKey();
    onLogout();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2d31] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#e8e6e1]">Roundtable Admin</h1>
          <p className="text-sm text-[#6e6e73]">Paste, preview, and publish discussion guides.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadGuides()}
            className="flex items-center gap-2 rounded-lg border border-[#2a2d31] px-3 py-2 text-sm text-[#a0a0a5] transition hover:border-[#4da8da]/60 hover:text-[#4da8da]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-[#2a2d31] px-3 py-2 text-sm text-[#a0a0a5] transition hover:border-red-400/60 hover:text-red-400"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </header>

      {isComposing ? (
        <GuideComposer
          onCancel={() => setIsComposing(false)}
          onSaved={() => {
            setIsComposing(false);
            void loadGuides();
          }}
        />
      ) : (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#a0a0a5]">Existing Guides</h2>
              <button
                type="button"
                onClick={() => setIsComposing(true)}
                className="flex items-center gap-2 rounded-lg bg-[#4da8da] px-3 py-2 text-sm font-semibold text-[#e8e6e1] transition hover:bg-[#4da8da]/90 active:scale-[0.99]"
              >
                <Plus size={16} />
                Add New Guide
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#2a2d31]">
              {isLoading ? (
                <p className="px-4 py-8 text-center text-sm text-[#6e6e73]">Loading guides...</p>
              ) : guides.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[#6e6e73]">No guides found.</p>
              ) : (
                <div className="divide-y divide-[#2a2d31]">
                  {guides.map((guide) => (
                    <article key={guide.id} className="px-4 py-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-[#e8e6e1]">{guide.title}</h3>
                          <p className="mt-1 text-sm text-[#6e6e73]">
                            {guide.series} · {guide.date}
                          </p>
                        </div>
                        <a
                          href={`/?guide=${guide.id}`}
                          className="text-sm text-[#4da8da] transition hover:text-[#4da8da]/80"
                        >
                          View
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-lg border border-[#2a2d31] bg-[#131618]/50 p-4">
            <h2 className="font-semibold text-[#e8e6e1]">Publish Flow</h2>
            <ol className="mt-3 space-y-2 text-sm text-[#a0a0a5]">
              <li>1. Paste the markdown from your vault.</li>
              <li>2. Parse and check the structured preview.</li>
              <li>3. Save to publish through D1.</li>
            </ol>
          </aside>
        </section>
      )}
    </main>
  );
}
