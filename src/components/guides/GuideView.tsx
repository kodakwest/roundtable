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
        className="mb-3 flex items-center gap-1.5 text-xs text-[#4da8da] transition-all hover:text-[#4da8da] lg:hidden"
      >
        <ArrowLeft className="size-3.5" />
        Back to all guides
      </button>

      {/* Guide content */}
      <div className="min-h-0 flex-1 overflow-y-auto" data-guide-panel>
        {/* Anchor verse blockquote */}
        <div className="mb-6 rounded-lg border-l-4 border-[#4da8da] bg-[#4da8da]/10 px-5 py-4">
          <p className="mb-1 text-sm italic leading-relaxed text-[#a0a0a5]">
            &ldquo;{guide.anchorVerse.text}&rdquo;
          </p>
          <p className="text-xs text-[#4da8da]">&mdash; {guide.anchorVerse.reference}</p>
        </div>

        {/* Scripture map */}
        {guide.scriptureMap && (
          <p className="mb-4 text-xs text-[#6e6e73]">
            <span className="font-medium text-[#a0a0a5]">Scripture:</span> {guide.scriptureMap}
          </p>
        )}

        {/* Theme */}
        <h2 className="mb-2 text-lg font-bold text-[#e8e6e1]">{guide.theme}</h2>

        {/* Framing sentence */}
        <p className="mb-6 text-sm leading-relaxed text-[#a0a0a5]">{guide.framingSentence}</p>

        {/* Sections */}
        {guide.sections.map((section, i) => (
          <SectionBlock key={section.title} section={section} index={i} />
        ))}

        {/* Landing */}
        <div className="mt-6 border-t border-[#2a2d31] pt-5">
          <h3 className="mb-2 text-base font-semibold text-[#e8e6e1]">Landing the Plane</h3>
          <p className="mb-4 text-sm leading-relaxed text-[#a0a0a5]">{guide.landing.paragraph}</p>
          <div className="rounded-lg border border-[#4da8da]/30 bg-[#4da8da]/5 p-4">
            <p className="flex items-start gap-2 text-sm font-medium text-[#4da8da]">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-[#4da8da]" aria-hidden="true" />
              <span>{guide.landing.finalQuestion}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
