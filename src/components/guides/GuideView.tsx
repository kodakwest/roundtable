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
        className="mb-3 flex items-center gap-1.5 text-xs text-cyan-400 transition-all hover:text-cyan-300 lg:hidden"
      >
        <ArrowLeft className="size-3.5" />
        Back to all guides
      </button>

      {/* Guide content */}
      <div className="min-h-0 flex-1 overflow-y-auto" data-guide-panel>
        {/* Anchor verse blockquote */}
        <div className="mb-6 rounded-lg border-l-4 border-cyan-600 bg-cyan-950/20 px-5 py-4">
          <p className="mb-1 text-sm italic leading-relaxed text-slate-300">
            &ldquo;{guide.anchorVerse.text}&rdquo;
          </p>
          <p className="text-xs text-cyan-400">&mdash; {guide.anchorVerse.reference}</p>
        </div>

        {/* Scripture map */}
        {guide.scriptureMap && (
          <p className="mb-4 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Scripture:</span> {guide.scriptureMap}
          </p>
        )}

        {/* Theme */}
        <h2 className="mb-2 text-lg font-bold text-slate-100">{guide.theme}</h2>

        {/* Framing sentence */}
        <p className="mb-6 text-sm leading-relaxed text-slate-400">{guide.framingSentence}</p>

        {/* Sections */}
        {guide.sections.map((section, i) => (
          <SectionBlock key={section.title} section={section} index={i} />
        ))}

        {/* Landing */}
        <div className="mt-6 border-t border-slate-800 pt-5">
          <h3 className="mb-2 text-base font-semibold text-slate-200">Landing the Plane</h3>
          <p className="mb-4 text-sm leading-relaxed text-slate-400">{guide.landing.paragraph}</p>
          <div className="rounded-lg border border-cyan-800/40 bg-cyan-950/10 p-4">
            <p className="flex items-start gap-2 text-sm font-medium text-cyan-200">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-cyan-400" aria-hidden="true" />
              <span>{guide.landing.finalQuestion}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
