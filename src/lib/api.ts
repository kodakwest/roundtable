import type { Guide } from "../types/guide";

const ADMIN_KEY_STORAGE = "roundtable-admin-key";

export type ParseMarkdownResult = {
  guide: Guide;
  confidence: number;
  warnings: string[];
};

export async function fetchGuides(): Promise<Guide[]> {
  const response = await fetch("/api/guides");
  if (!response.ok) throw new Error("Unable to load guides");

  const data = (await response.json()) as { guides?: unknown[] };
  return (data.guides ?? []).map(normalizeGuide);
}

export async function parseMarkdown(markdown: string): Promise<ParseMarkdownResult> {
  const response = await fetch("/api/admin/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown }),
  });

  if (!response.ok) throw new Error(await readError(response, "Unable to parse markdown"));
  return (await response.json()) as ParseMarkdownResult;
}

export async function saveGuide(guide: Guide): Promise<{ success: boolean; id: string }> {
  const response = await fetch("/api/admin/guides", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": getAdminKey(),
    },
    body: JSON.stringify({ guide }),
  });

  if (response.status === 401) {
    clearAdminKey();
    throw new Error("Invalid admin key");
  }

  if (!response.ok) throw new Error(await readError(response, "Unable to save guide"));
  return (await response.json()) as { success: boolean; id: string };
}

export function getAdminKey() {
  return sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
}

export function setAdminKey(key: string) {
  sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearAdminKey() {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
}

function normalizeGuide(value: unknown): Guide {
  const guide = value as Guide & { sections?: string };
  return {
    ...guide,
    sections: typeof guide.sections === "string" ? JSON.parse(guide.sections) : guide.sections,
  } as Guide;
}

async function readError(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}
