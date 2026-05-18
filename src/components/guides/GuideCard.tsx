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
        "w-full rounded-lg border border-[#2a2d31] bg-[#131618]/50 p-4 text-left transition-all active:scale-[0.98]",
        "hover:border-[#4da8da]/50",
      )}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="rounded-md bg-[#1a1d21] px-2 py-0.5 text-[11px] font-medium text-[#a0a0a5]">
          {guide.series}
        </span>
        <span className="text-[11px] text-[#6e6e73]">{guide.date}</span>
      </div>
      <h3 className="text-sm font-semibold text-[#e8e6e1]">{guide.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6e6e73]">{guide.theme}</p>
    </button>
  );
}
