import clsx from "clsx";
import { useRoundtableStore } from "../../store/useRoundtableStore";
import { getSeriesList } from "../../lib/guideData";

export default function SeriesFilter() {
  const selectedSeries = useRoundtableStore((s) => s.selectedSeries);
  const setSelectedSeries = useRoundtableStore((s) => s.setSelectedSeries);
  const seriesList = getSeriesList();

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => setSelectedSeries(null)}
        className={clsx(
          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-95",
          selectedSeries === null
            ? "border-cyan-300 bg-cyan-300/10 text-cyan-100"
            : "border-slate-800 text-slate-400 hover:border-cyan-300/50 hover:text-slate-300",
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
              ? "border-cyan-300 bg-cyan-300/10 text-cyan-100"
              : "border-slate-800 text-slate-400 hover:border-cyan-300/50 hover:text-slate-300",
          )}
        >
          {series.name} ({series.count})
        </button>
      ))}
    </div>
  );
}
