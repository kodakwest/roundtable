import type { GuideSection } from "../../types/guide";

interface SectionBlockProps {
  section: GuideSection;
  index: number;
}

export default function SectionBlock({ section, index }: SectionBlockProps) {
  return (
    <div className="border-t border-[var(--border-subtle)] pt-5">
      <h3 className="mb-2 text-base font-semibold text-[var(--ink-primary)]">
        {index + 1}. {section.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-[var(--ink-secondary)]">{section.context}</p>
      <ol className="space-y-3">
        {section.questions.map((q) => (
          <li key={q.id} className="flex gap-2 text-sm text-[var(--ink-secondary)]">
            <span className="mt-0.5 shrink-0 text-[var(--accent)]">•</span>
            <span>{q.prompt}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
