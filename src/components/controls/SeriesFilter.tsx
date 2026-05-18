import clsx from "clsx";
import { useRoundtableStore } from "../../store/useRoundtableStore";
import { getSeriesList } from "../../lib/guideData";

export default function SeriesFilter() {
  const guides = useRoundtableStore((s) => s.guides);
  const selectedSeries = useRoundtableStore((s) => s.selectedSeries);
  const setSelectedSeries = useRoundtableStore((s) => s.setSelectedSeries);
  const seriesList = getSeriesList(guides);

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => setSelectedSeries(null)}
        className={clsx(
          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-95",
          selectedSeries === null
            ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
            : "border-[var(--border-subtle)] text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--ink-primary)]",
        )}
      >
        All
      </button>
      {seriesList.map((series) => (
        <button
          key={series.id}
          onClick={() => setSelectedSeries(series.name)}
          className={clsx(
            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-95",
            selectedSeries === series.name
              ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
              : "border-[var(--border-subtle)] text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--ink-primary)]",
          )}
        >
          {series.name} ({series.count})
        </button>
      ))}
    </div>
  );
}
