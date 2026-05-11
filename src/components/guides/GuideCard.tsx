import clsx from "clsx";
import type { Guide } from "../../types/guide";

interface GuideCardProps {
  guide: Guide;
  onSelect: (id: string) => void;
}

export default function GuideCard({ guide, onSelect }: GuideCardProps) {
  return (
    <button
      onClick={() => onSelect(guide.id)}
      className={clsx(
        "w-full rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-left transition-all active:scale-[0.98]",
        "hover:border-cyan-300/50",
      )}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-400">
          {guide.series}
        </span>
        <span className="text-[11px] text-slate-600">{guide.date}</span>
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{guide.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{guide.theme}</p>
    </button>
  );
}
