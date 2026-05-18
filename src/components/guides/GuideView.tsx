import { ArrowLeft, BookOpen } from "lucide-react";
import type { Guide } from "../../types/guide";
import { useRoundtableStore } from "../../store/useRoundtableStore";
import SectionBlock from "./SectionBlock";

interface GuideViewProps {
  guide: Guide;
}

export default function GuideView({ guide }: GuideViewProps) {
  const setView = useRoundtableStore((s) => s.setView);
  const selectGuide = useRoundtableStore((s) => s.selectGuide);

  function handleBack() {
    selectGuide(null);
    setView("list");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Mobile back button */}
      <button
        onClick={handleBack}
        className="mb-3 flex items-center gap-1.5 text-xs text-[var(--accent)] transition-all hover:text-[var(--accent)] lg:hidden"
      >
        <ArrowLeft className="size-3.5" />
        Back to all guides
      </button>

      {/* Guide content */}
      <div className="min-h-0 flex-1 overflow-y-auto" data-guide-panel>
        {/* Anchor verse blockquote */}
        <div className="mb-6 rounded-lg border-l-4 border-[var(--accent)] bg-[var(--accent-muted)] px-5 py-4">
          <p className="mb-1 text-sm italic leading-relaxed text-[var(--ink-secondary)]">
            &ldquo;{guide.anchorVerse.text}&rdquo;
          </p>
          <p className="text-xs text-[var(--accent)]">&mdash; {guide.anchorVerse.reference}</p>
        </div>

        {/* Scripture map */}
        {guide.scriptureMap && (
          <p className="mb-4 text-xs text-[var(--ink-tertiary)]">
            <span className="font-medium text-[var(--ink-secondary)]">Scripture:</span> {guide.scriptureMap}
          </p>
        )}

        {/* Theme */}
        <h2 className="mb-2 text-lg font-bold text-[var(--ink-primary)]">{guide.theme}</h2>

        {/* Framing sentence */}
        <p className="mb-6 text-sm leading-relaxed text-[var(--ink-secondary)]">{guide.framingSentence}</p>

        {/* Sections */}
        {guide.sections.map((section, i) => (
          <SectionBlock key={section.title} section={section} index={i} />
        ))}

        {/* Landing */}
        <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
          <h3 className="mb-2 text-base font-semibold text-[var(--ink-primary)]">Landing the Plane</h3>
          <p className="mb-4 text-sm leading-relaxed text-[var(--ink-secondary)]">{guide.landing.paragraph}</p>
          <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent-muted)] p-4">
            <p className="flex items-start gap-2 text-sm font-medium text-[var(--accent)]">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
              <span>{guide.landing.finalQuestion}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
