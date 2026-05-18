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
        "w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 text-left transition-all active:scale-[0.98]",
        "hover:border-[var(--accent)]",
      )}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-secondary)]">
          {guide.series}
        </span>
        <span className="text-[11px] text-[var(--ink-tertiary)]">{guide.date}</span>
      </div>
      <h3 className="text-sm font-semibold text-[var(--ink-primary)]">{guide.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--ink-tertiary)]">{guide.theme}</p>
    </button>
  );
}
