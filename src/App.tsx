import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useRoundtableStore } from "./store/useRoundtableStore";
import { checkAuth, redirectToLogin } from "./lib/authCheck";
import Admin from "./pages/Admin";
import SearchBar from "./components/controls/SearchBar";
import SeriesFilter from "./components/controls/SeriesFilter";
import GuideCard from "./components/guides/GuideCard";
import GuideView from "./components/guides/GuideView";
import PrintGuide from "./components/PrintGuide";

export default function App() {
  if (window.location.pathname.startsWith("/admin")) {
    return <Admin />;
  }

  return <PublicApp />;
}

function PublicApp() {
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    checkAuth().then((user) => {
      if (user) {
        setAuthState("authenticated");
      } else {
        setAuthState("unauthenticated");
        redirectToLogin();
      }
    });
  }, []);

  if (authState !== "authenticated") return <AuthLoading />;

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const guides = useRoundtableStore((s) => s.guides);
  const isLoading = useRoundtableStore((s) => s.isLoading);
  const view = useRoundtableStore((s) => s.view);
  const selectedGuideId = useRoundtableStore((s) => s.selectedGuideId);
  const searchQuery = useRoundtableStore((s) => s.searchQuery);
  const selectedSeries = useRoundtableStore((s) => s.selectedSeries);
  const loadGuides = useRoundtableStore((s) => s.loadGuides);
  const setView = useRoundtableStore((s) => s.setView);
  const selectGuide = useRoundtableStore((s) => s.selectGuide);

  const selectedGuide = selectedGuideId ? guides.find((guide) => guide.id === selectedGuideId) : null;

  useEffect(() => {
    void loadGuides();
  }, [loadGuides]);

  useEffect(() => {
    const guideId = new URLSearchParams(window.location.search).get("guide");
    if (guideId && guides.some((guide) => guide.id === guideId)) {
      selectGuide(guideId);
      setView("guide");
    }
  }, [guides, selectGuide, setView]);

  // Filter guides
  const filteredGuides = useMemo(() => {
    let result = guides;
    if (selectedSeries) {
      result = result.filter((g) => g.series === selectedSeries);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.series.toLowerCase().includes(q) ||
          g.theme.toLowerCase().includes(q) ||
          g.scriptureMap.toLowerCase().includes(q),
      );
    }
    return result;
  }, [guides, selectedSeries, searchQuery]);

  // When switching to guide view, scroll to top
  useEffect(() => {
    if (view === "guide") {
      const panel = document.querySelector("[data-guide-panel]");
      panel?.closest("section")?.scrollTo(0, 0);
      window.scrollTo(0, 0);
    }
  }, [view]);

  function handleSelectGuide(id: string) {
    selectGuide(id);
    setView("guide");
    window.history.replaceState(null, "", `/?guide=${encodeURIComponent(id)}`);
  }

  // Print: Ctrl+P or window.print() triggered by button
  function handlePrint() {
    window.print();
  }

  return (
    <>
      {/* Print overlay - rendered at app level */}
      {selectedGuide && <PrintGuide guide={selectedGuide} />}

      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-[var(--ink-primary)]">Roundtable</h1>
              <p className="text-xs text-[var(--ink-tertiary)]">Sermon Discussion Guides</p>
            </div>
            {selectedGuide && (
              <button
                onClick={handlePrint}
                className="screen-only flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--ink-secondary)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95"
              >
                Print Guide
              </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <main
          className={clsx(
            "relative flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6",
            "lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-6",
          )}
        >
          {/* Sidebar - list view */}
          <aside
            className={clsx(
              "min-h-0 rounded-lg",
              "transition-all duration-300 ease-in-out",
              view === "guide" ? "hidden lg:block" : "flex min-h-0 flex-1 flex-col",
            )}
          >
            {/* Search + filters */}
            <div className="mb-4 space-y-3">
              <SearchBar />
              <SeriesFilter />
            </div>

            {/* Guide list */}
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
              {isLoading ? (
                <p className="py-8 text-center text-sm text-[var(--ink-tertiary)]">
                  Loading guides...
                </p>
              ) : filteredGuides.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--ink-tertiary)]">
                  No guides match your search.
                </p>
              ) : (
                filteredGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} onSelect={handleSelectGuide} />
                ))
              )}
            </div>
          </aside>

          {/* Content - guide view */}
          <section
            className={clsx(
              "min-h-0 rounded-lg",
              "transition-all duration-300 ease-in-out",
              view === "list" ? "hidden lg:block" : "flex min-h-0 flex-1 flex-col",
            )}
          >
            {selectedGuide ? (
              <GuideView guide={selectedGuide} />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-center text-sm text-[var(--ink-tertiary)]">
                  Select a guide to view
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0d0e] text-[#e8e6e1]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#2a2d31] border-t-[#4da8da]" />
        <div className="font-serif text-xl font-bold text-[#4da8da]">Roundtable</div>
      </div>
    </div>
  );
}
