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
            ? "border-[#4da8da] bg-[#4da8da]/10 text-[#4da8da]"
            : "border-[#2a2d31] text-[#a0a0a5] hover:border-[#4da8da]/50 hover:text-[#a0a0a5]",
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
              ? "border-[#4da8da] bg-[#4da8da]/10 text-[#4da8da]"
              : "border-[#2a2d31] text-[#a0a0a5] hover:border-[#4da8da]/50 hover:text-[#a0a0a5]",
          )}
        >
          {series.name} ({series.count})
        </button>
      ))}
    </div>
  );
}
