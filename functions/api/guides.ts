type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

type D1PreparedStatement = {
  all: <T = unknown>() => Promise<{ results?: T[] }>;
};

type Env = {
  DB: D1Database;
};

type DbGuide = {
  id: string;
  title: string;
  series: string;
  date: string;
  scripture_map: string;
  anchor_reference: string;
  anchor_text: string;
  theme: string;
  framing_sentence: string;
  sections: string;
  landing_paragraph: string;
  landing_question: string;
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const { results = [] } = await env.DB.prepare(
      `SELECT id, title, series, date, scripture_map, anchor_reference, anchor_text,
        theme, framing_sentence, sections, landing_paragraph, landing_question
       FROM guides
       ORDER BY date DESC`,
    ).all<DbGuide>();

    const guides = results.map((row) => ({
      id: row.id,
      title: row.title,
      series: row.series,
      date: row.date,
      scriptureMap: row.scripture_map,
      anchorVerse: {
        reference: row.anchor_reference,
        text: row.anchor_text,
      },
      theme: row.theme,
      framingSentence: row.framing_sentence,
      sections: parseSections(row.sections),
      landing: {
        paragraph: row.landing_paragraph,
        finalQuestion: row.landing_question,
      },
    }));

    return json({ guides });
  } catch (error) {
    return json({ error: "Unable to load guides" }, 500);
  }
};

function parseSections(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}
