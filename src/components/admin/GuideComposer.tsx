import { ChangeEvent, useState } from "react";
import { AlertTriangle, ArrowLeft, Save, Wand2 } from "lucide-react";
import type { Guide, GuideSection } from "../../types/guide";
import { parseMarkdown, saveGuide } from "../../lib/api";

type Props = {
  onCancel: () => void;
  onSaved: () => void;
};

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
};

export default function GuideComposer({ onCancel, onSaved }: Props) {
  const [markdown, setMarkdown] = useState("");
  const [guide, setGuide] = useState<Guide | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleParse() {
    if (!markdown.trim()) {
      setError("Paste markdown before parsing.");
      return;
    }

    setError("");
    setSuccess("");
    setIsParsing(true);
    try {
      const result = await parseMarkdown(markdown);
      setGuide(result.guide);
      setConfidence(result.confidence);
      setWarnings(result.warnings);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "Unable to parse markdown");
    } finally {
      setIsParsing(false);
    }
  }

  async function handleSave() {
    if (!guide) return;

    setError("");
    setSuccess("");
    setIsSaving(true);
    try {
      const result = await saveGuide(guide);
      setSuccess(`Saved ${result.id}.`);
      onSaved();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save guide");
    } finally {
      setIsSaving(false);
    }
  }

  function updateGuide(patch: Partial<Guide>) {
    setGuide((current) => (current ? { ...current, ...patch } : current));
  }

  function updateSection(index: number, patch: Partial<GuideSection>) {
    setGuide((current) => {
      if (!current) return current;
      return {
        ...current,
        sections: current.sections.map((section, sectionIndex) =>
          sectionIndex === index ? { ...section, ...patch } : section,
        ),
      };
    });
  }

  function updateQuestion(sectionIndex: number, questionIndex: number, prompt: string) {
    setGuide((current) => {
      if (!current) return current;
      return {
        ...current,
        sections: current.sections.map((section, currentSectionIndex) => {
          if (currentSectionIndex !== sectionIndex) return section;
          return {
            ...section,
            questions: section.questions.map((question, currentQuestionIndex) =>
              currentQuestionIndex === questionIndex ? { ...question, prompt } : question,
            ),
          };
        }),
      };
    });
  }

  return (
    <section className="grid min-h-0 gap-5 lg:grid-cols-[minmax(320px,0.85fr)_minmax(420px,1.15fr)]">
      <div className="min-h-0">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-300/60 hover:text-cyan-200"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={handleParse}
            disabled={isParsing}
            className="flex items-center gap-2 rounded-lg bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Wand2 size={16} />
            {isParsing ? "Parsing..." : "Parse & Preview"}
          </button>
        </div>

        <textarea
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          className="h-[calc(100vh-170px)] min-h-[420px] w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-200 outline-none transition focus:border-cyan-300"
          placeholder="# Discussion Guide: ..."
        />
      </div>

      <div className="min-h-0 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        {error && (
          <div className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
            {success}
          </div>
        )}

        {!guide ? (
          <div className="flex min-h-[420px] items-center justify-center text-center text-sm text-slate-500">
            Parsed guide fields will appear here.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Editable Preview</h2>
                {confidence !== null && (
                  <p className="mt-1 text-sm text-slate-500">
                    Confidence: {Math.round(confidence * 100)}%
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-emerald-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Guide"}
              </button>
            </div>

            {warnings.length > 0 && (
              <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-100">
                  <AlertTriangle size={16} />
                  Parser warnings
                </div>
                <ul className="space-y-1 text-sm text-amber-100/80">
                  {warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title" value={guide.title} onChange={(title) => updateGuide({ title })} />
              <Field label="ID" value={guide.id} onChange={(id) => updateGuide({ id })} />
              <Field label="Series" value={guide.series} onChange={(series) => updateGuide({ series })} />
              <Field label="Date" value={guide.date} onChange={(date) => updateGuide({ date })} />
            </div>

            <Field
              label="Scripture map"
              value={guide.scriptureMap}
              onChange={(scriptureMap) => updateGuide({ scriptureMap })}
              multiline
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Anchor reference"
                value={guide.anchorVerse.reference}
                onChange={(reference) => updateGuide({ anchorVerse: { ...guide.anchorVerse, reference } })}
              />
              <Field
                label="Anchor text"
                value={guide.anchorVerse.text}
                onChange={(text) => updateGuide({ anchorVerse: { ...guide.anchorVerse, text } })}
              />
            </div>
            <Field label="Theme" value={guide.theme} onChange={(theme) => updateGuide({ theme })} multiline />
            <Field
              label="Framing sentence"
              value={guide.framingSentence}
              onChange={(framingSentence) => updateGuide({ framingSentence })}
              multiline
            />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Sections</h3>
              {guide.sections.map((section, sectionIndex) => (
                <div key={`${section.title}-${sectionIndex}`} className="rounded-lg border border-slate-800 p-3">
                  <Field
                    label="Section title"
                    value={section.title}
                    onChange={(title) => updateSection(sectionIndex, { title })}
                  />
                  <Field
                    label="Context"
                    value={section.context}
                    onChange={(context) => updateSection(sectionIndex, { context })}
                    multiline
                  />
                  <div className="space-y-2">
                    {section.questions.map((question, questionIndex) => (
                      <Field
                        key={question.id}
                        label={`Question ${questionIndex + 1}`}
                        value={question.prompt}
                        onChange={(prompt) => updateQuestion(sectionIndex, questionIndex, prompt)}
                        multiline
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-slate-800 p-3">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Landing</h3>
              <Field
                label="Landing paragraph"
                value={guide.landing.paragraph}
                onChange={(paragraph) => updateGuide({ landing: { ...guide.landing, paragraph } })}
                multiline
              />
              <Field
                label="Final question"
                value={guide.landing.finalQuestion}
                onChange={(finalQuestion) => updateGuide({ landing: { ...guide.landing, finalQuestion } })}
                multiline
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, value, onChange, multiline }: FieldProps) {
  const className =
    "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300";

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  return (
    <label className="mb-3 block text-sm font-medium text-slate-300">
      {label}
      {multiline ? (
        <textarea value={value} onChange={handleChange} rows={3} className={`${className} resize-y`} />
      ) : (
        <input value={value} onChange={handleChange} className={className} />
      )}
    </label>
  );
}
