import type { Guide, SeriesMeta } from "../types/guide";

import battleOfTheMindWomen from "../data/guides/battle-of-the-mind-women.json";
import realFaith from "../data/guides/real-faith.json";
import armorForTheMind from "../data/guides/armor-for-the-mind.json";
import designedOnPurpose from "../data/guides/designed-on-purpose.json";
import finishStrong from "../data/guides/finish-strong.json";

const guideFiles = [
  battleOfTheMindWomen,
  realFaith,
  armorForTheMind,
  designedOnPurpose,
  finishStrong,
] as unknown[];

const guides: Guide[] = guideFiles.map((g) => g as Guide);
guides.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getAllGuides(): Guide[] {
  return guides;
}

export function getGuideById(id: string): Guide | undefined {
  return guides.find((g) => g.id === id);
}

export function getSeriesList(): SeriesMeta[] {
  const seriesMap = new Map<string, number>();
  for (const g of guides) {
    seriesMap.set(g.series, (seriesMap.get(g.series) || 0) + 1);
  }
  return Array.from(seriesMap.entries())
    .map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getGuidesBySeries(series: string): Guide[] {
  return guides.filter((g) => g.series === series);
}
