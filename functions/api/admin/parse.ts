type ParsedGuide = {
  id: string;
  title: string;
  series: string;
  date: string;
  scriptureMap: string;
  anchorVerse: {
    reference: string;
    text: string;
  };
  theme: string;
  framingSentence: string;
  sections: Array<{
    title: string;
    context: string;
    questions: Array<{ id: string; prompt: string }>;
  }>;
  landing: {
    paragraph: string;
    finalQuestion: string;
  };
};

type ParseResult = {
  guide: ParsedGuide;
  confidence: number;
  warnings: string[];
};

export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const body = (await request.json()) as { markdown?: unknown };
    if (typeof body.markdown !== "string" || !body.markdown.trim()) {
      return json({ error: "Markdown is required" }, 400);
    }

    return json(parseGuideMarkdown(body.markdown));
  } catch (error) {
    return json({ error: "Unable to parse markdown" }, 500);
  }
};

function parseGuideMarkdown(markdown: string): ParseResult {
  const normalized = markdown.replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");
  const warnings: string[] = [];

  const title = capture(normalized, /^#\s*Discussion Guide:\s*(.+?)\s*$/im);
  const seriesDate = capture(normalized, /^\*\*(.+?)\s*\|\s*(.+?)\*\*\s*$/im, 0);
  const seriesDateMatch = seriesDate.match(/^\*\*(.+?)\s*\|\s*(.+?)\*\*$/);
  const series = seriesDateMatch?.[1]?.trim() ?? "";
  const date = seriesDateMatch?.[2]?.trim() ?? "";

  const anchorMatch = normalized.match(/^>\s*["“](.+?)["”]\s*[—-]\s*(.+?)\s*$/im);
  const scriptureMap = capture(normalized, /^\*\*Scripture:\*\*\s*(.+?)\s*$/im);
  const theme = capture(normalized, /^\*\*Theme:\*\*\s*(.+?)\s*$/im);
  const framingSentence = findFramingSentence(lines);
  const guideId = slugify(title || "untitled-guide");

  const parsedSections = parseSections(lines, guideId);
  const landing = parsedSections.landing;
  const sections = parsedSections.sections;

  const guide: ParsedGuide = {
    id: guideId,
    title,
    series,
    date,
    scriptureMap,
    anchorVerse: {
      reference: anchorMatch?.[2]?.trim() || fallbackReference(scriptureMap),
      text: anchorMatch?.[1]?.trim() || "",
    },
    theme,
    framingSentence,
    sections,
    landing,
  };

  const confidence = scoreGuide(guide, warnings);

  return { guide, confidence, warnings };
}

function capture(source: string, regex: RegExp, group = 1) {
  return source.match(regex)?.[group]?.trim() ?? "";
}

function findFramingSentence(lines: string[]) {
  const themeIndex = lines.findIndex((line) => /^\*\*Theme:\*\*/i.test(line.trim()));
  if (themeIndex === -1) return "";

  for (const line of lines.slice(themeIndex + 1)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(">")) continue;
    if (/^\*\*.+?:\*\*/.test(trimmed)) continue;
    return trimmed;
  }
  return "";
}

function parseSections(lines: string[], guideId: string) {
  const sections: ParsedGuide["sections"] = [];
  const landing: ParsedGuide["landing"] = { paragraph: "", finalQuestion: "" };
  let current:
    | {
        title: string;
        contextLines: string[];
        questions: string[];
        isLanding: boolean;
      }
    | null = null;

  const flush = () => {
    if (!current) return;
    const context = current.contextLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();

    if (current.isLanding) {
      landing.paragraph = context;
      landing.finalQuestion = current.questions[0] ?? "";
    } else {
      const questionOffset = sections.reduce((sum, section) => sum + section.questions.length, 0);
      sections.push({
        title: current.title,
        context,
        questions: current.questions.map((prompt, index) => ({
          id: `${guideId}-q${questionOffset + index + 1}`,
          prompt,
        })),
      });
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const headingMatch = line.match(/^##\s+(.+?)\s*$/);
    if (headingMatch) {
      flush();
      current = {
        title: headingMatch[1].trim(),
        contextLines: [],
        questions: [],
        isLanding: /^Landing the Plane$/i.test(headingMatch[1].trim()),
      };
      continue;
    }

    if (!current) continue;
    if (!line) {
      if (current.contextLines.length > 0 && current.contextLines.at(-1) !== "") {
        current.contextLines.push("");
      }
      continue;
    }

    const finalQuestion = line.match(/^\*\*Final Question:\*\*\s*(.+?)\s*$/i);
    if (finalQuestion) {
      current.questions.push(finalQuestion[1].trim());
      continue;
    }

    const bulletQuestion = line.match(/^[-*•]\s+(.+?)\s*$/);
    if (bulletQuestion) {
      current.questions.push(bulletQuestion[1].trim());
      continue;
    }

    current.contextLines.push(line);
  }

  flush();
  return { sections, landing };
}

function fallbackReference(scriptureMap: string) {
  return scriptureMap.split("·")[0]?.trim() ?? "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function scoreGuide(guide: ParsedGuide, warnings: string[]) {
  let score = 0;

  add(Boolean(guide.title), 0.15, "Missing title");
  add(Boolean(guide.series), 0.1, "Missing series");
  add(Boolean(guide.date), 0.1, "Missing date");
  add(Boolean(guide.scriptureMap), 0.1, "Missing scripture map");
  add(Boolean(guide.anchorVerse.reference && guide.anchorVerse.text), 0.15, "Missing anchor verse");
  add(Boolean(guide.theme), 0.1, "Missing theme");
  add(Boolean(guide.framingSentence), 0.1, "Missing framing sentence");

  const sectionCompleteness =
    guide.sections.length === 0
      ? 0
      : guide.sections.reduce((sum, section) => {
          const title = section.title ? 0.25 : 0;
          const context = section.context ? 0.25 : 0;
          const questions = Math.min(section.questions.length, 2) * 0.25;
          return sum + title + context + questions;
        }, 0) / guide.sections.length;
  score += sectionCompleteness * 0.1;
  if (guide.sections.length === 0) warnings.push("No discussion sections found");
  if (guide.sections.some((section) => section.questions.length === 0)) {
    warnings.push("One or more sections have no questions");
  }

  const landingCompleteness = Number(Boolean(guide.landing.paragraph)) * 0.05
    + Number(Boolean(guide.landing.finalQuestion)) * 0.05;
  score += landingCompleteness;
  if (!guide.landing.paragraph) warnings.push("Missing landing paragraph");
  if (!guide.landing.finalQuestion) warnings.push("Missing final question");

  return Math.round(score * 100) / 100;

  function add(condition: boolean, weight: number, warning: string) {
    if (condition) {
      score += weight;
    } else {
      warnings.push(warning);
    }
  }
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}
