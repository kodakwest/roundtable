type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<unknown>;
};

type Env = {
  ADMIN_KEY: string;
  DB: D1Database;
};

type Guide = {
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
  sections: unknown[];
  landing: {
    paragraph: string;
    finalQuestion: string;
  };
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const adminKey = request.headers.get("X-Admin-Key");
  if (!env.ADMIN_KEY || adminKey !== env.ADMIN_KEY) {
    return json({ error: "Invalid admin key" }, 401);
  }

  try {
    const body = (await request.json()) as { guide?: unknown };
    const guide = body.guide;
    const error = validateGuide(guide);
    if (error) return json({ error }, 400);

    const cleanGuide = guide as Guide;
    await env.DB.prepare(
      `INSERT OR REPLACE INTO guides (
        id, title, series, date, scripture_map, anchor_reference, anchor_text,
        theme, framing_sentence, sections, landing_paragraph, landing_question,
        created_at, updated_at
      )
      VALUES (
        ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12,
        COALESCE((SELECT created_at FROM guides WHERE id = ?1), datetime('now')),
        datetime('now')
      )`,
    )
      .bind(
        cleanGuide.id,
        cleanGuide.title,
        cleanGuide.series,
        cleanGuide.date,
        cleanGuide.scriptureMap,
        cleanGuide.anchorVerse.reference,
        cleanGuide.anchorVerse.text,
        cleanGuide.theme,
        cleanGuide.framingSentence,
        JSON.stringify(cleanGuide.sections),
        cleanGuide.landing.paragraph,
        cleanGuide.landing.finalQuestion,
      )
      .run();

    return json({ success: true, id: cleanGuide.id });
  } catch (error) {
    return json({ error: "Database error, please try again" }, 500);
  }
};

function validateGuide(value: unknown): string | null {
  if (!value || typeof value !== "object") return "Guide is required";
  const guide = value as Partial<Guide>;

  const requiredStrings: Array<[unknown, string]> = [
    [guide.id, "id"],
    [guide.title, "title"],
    [guide.series, "series"],
    [guide.date, "date"],
    [guide.scriptureMap, "scriptureMap"],
    [guide.anchorVerse?.reference, "anchorVerse.reference"],
    [guide.anchorVerse?.text, "anchorVerse.text"],
    [guide.theme, "theme"],
    [guide.framingSentence, "framingSentence"],
    [guide.landing?.paragraph, "landing.paragraph"],
    [guide.landing?.finalQuestion, "landing.finalQuestion"],
  ];

  for (const [field, name] of requiredStrings) {
    if (typeof field !== "string" || !field.trim()) return `Missing ${name}`;
  }

  if (!Array.isArray(guide.sections) || guide.sections.length === 0) {
    return "At least one section is required";
  }

  return null;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}
