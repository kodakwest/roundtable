import type { GuideSection } from "../../types/guide";

interface SectionBlockProps {
  section: GuideSection;
  index: number;
}

export default function SectionBlock({ section, index }: SectionBlockProps) {
  return (
    <div className="border-t border-[#2a2d31] pt-5">
      <h3 className="mb-2 text-base font-semibold text-[#e8e6e1]">
        {index + 1}. {section.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-[#a0a0a5]">{section.context}</p>
      <ol className="space-y-3">
        {section.questions.map((q) => (
          <li key={q.id} className="flex gap-2 text-sm text-[#a0a0a5]">
            <span className="mt-0.5 shrink-0 text-[#4da8da]">•</span>
            <span>{q.prompt}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
