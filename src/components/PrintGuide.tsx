import type { Guide } from "../types/guide";

interface PrintGuideProps {
  guide: Guide;
}

export default function PrintGuide({ guide }: PrintGuideProps) {
  return (
    <div className="print-only print-guide">
      <div className="print-guide-header">
        <h1>{guide.title}</h1>
        <p className="print-meta">
          {guide.series} &middot; {guide.date}
        </p>
      </div>

      <blockquote>
        &ldquo;{guide.anchorVerse.text}&rdquo;
        <br />
        &mdash; {guide.anchorVerse.reference}
      </blockquote>

      {guide.scriptureMap && (
        <p className="print-meta" style={{ marginTop: "0.12in" }}>
          <strong>Scripture:</strong> {guide.scriptureMap}
        </p>
      )}

      <p style={{ marginTop: "0.12in" }}>
        <strong>Theme:</strong> {guide.theme}
      </p>

      {guide.sections.map((section) => (
        <div key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.context}</p>
          <ol>
            {section.questions.map((q) => (
              <li key={q.id}>{q.prompt}</li>
            ))}
          </ol>
        </div>
      ))}

      <div>
        <h2>Landing the Plane</h2>
        <p>{guide.landing.paragraph}</p>
        <div className="print-final">
          <p>
            <strong>Final Question:</strong> {guide.landing.finalQuestion}
          </p>
        </div>
      </div>

      <p className="print-meta" style={{ marginTop: "0.2in", textAlign: "center", fontSize: "9pt" }}>
        roundtable.pages.dev &middot; Sermon Discussion Guides
      </p>
    </div>
  );
}
