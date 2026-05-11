import { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useRoundtableStore } from "./store/useRoundtableStore";
import { getGuideById } from "./lib/guideData";
import SearchBar from "./components/controls/SearchBar";
import SeriesFilter from "./components/controls/SeriesFilter";
import GuideCard from "./components/guides/GuideCard";
import GuideView from "./components/guides/GuideView";
import PrintGuide from "./components/PrintGuide";

export default function App() {
  const guides = useRoundtableStore((s) => s.guides);
  const view = useRoundtableStore((s) => s.view);
  const selectedGuideId = useRoundtableStore((s) => s.selectedGuideId);
  const searchQuery = useRoundtableStore((s) => s.searchQuery);
  const selectedSeries = useRoundtableStore((s) => s.selectedSeries);
  const setView = useRoundtableStore((s) => s.setView);
  const selectGuide = useRoundtableStore((s) => s.selectGuide);

  const selectedGuide = selectedGuideId ? getGuideById(selectedGuideId) : null;

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
        <header className="border-b border-slate-800 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-100">Roundtable</h1>
              <p className="text-xs text-slate-500">Sermon Discussion Guides</p>
            </div>
            {selectedGuide && (
              <button
                onClick={handlePrint}
                className="screen-only flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-cyan-300/50 hover:text-cyan-300 active:scale-95"
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
              {filteredGuides.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-600">
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
                <p className="text-center text-sm text-slate-600">
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
