# Roundtable — Sermon Discussion Guide App

**Plan v0.1** · May 11, 2026 · TARS + Codex

---

## Concept

A web app that generates, stores, and displays sermon discussion guides — using the same pipeline that Shepherd uses for parenting lessons. Each guide is a structured JSON file (generated via Codex CLI from sermon transcripts), rendered in a dark-themed React app with print and markdown export.

**Working name:** Roundtable (evokes Life Group table discussion)

---

## Pipeline (Shepherd-Inspired)

```
Sermon Transcript (Bible Study Vault / YouTube)
    │
    ▼
BibleFlow (scripture extraction + classification)
    │
    ▼
Codex CLI (self-contained spec → Guide JSON)
    │
    ▼
Verify (bibleflow verify-guide.py + tsc)
    │
    ▼
Save + Publish (git commit → vault → deploy)
```

### Step-by-Step

1. **Source sermon transcript** from Bible Study Vault (`/mnt/s/Bible Study Vault/Pastor Kevin Sermons/`) or YouTube (via youtube-transcript-api)
2. **Run bibleflow** to extract all scripture references, classify them (main/supporting/incidental), identify anchor verse
3. **Write Codex spec** — self-contained document with:
   - Guide JSON schema (same pattern as Shepherd topic spec)
   - Sermon excerpt + key points
   - Scripture references with NET/BSB text
   - Requirements (3 sections max, 2 questions per section, no emojis, etc.)
4. **Dispatch to Codex CLI** — generates guide JSON in `src/data/guides/`
5. **Verify** — run bibleflow verification script, run `tsc --noEmit`
6. **Save** — commit to GitHub, deploy to Cloudflare Pages

---

## App Architecture

### Tech Stack (identical to Shepherd)

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| State | Zustand 5 |
| Bundler | Vite 8 |
| Styling | Tailwind 4 |
| Language | TypeScript 6 (strict) |
| Deployment | Cloudflare Pages |
| Icons | Lucide React |
| Data format | Per-guide JSON files |

### Data Model (`src/types/guide.ts`)

```typescript
export type GuideSection = {
  title: string;
  context: string;          // 2-3 sentences of section intro
  questions: GuideQuestion[];
};

export type GuideQuestion = {
  id: string;
  prompt: string;
};

export type GuideLanding = {
  paragraph: string;         // Pulls all sections together
  finalQuestion: string;     // Single, direct closing question
};

export type GuideAnchorVerse = {
  reference: string;         // e.g. "1 Timothy 1:18-19"
  text: string;              // Quoted text
};

export type Guide = {
  id: string;                // kebab-case unique
  title: string;
  series: string;            // Sermon series name
  date: string;              // ISO date
  scriptureMap: string;      // "1 Timothy 1:18-19, 2:1-15 · Galatians 3:28"
  anchorVerse: GuideAnchorVerse;
  theme: string;             // One-line theme
  framingSentence: string;   // Sets up the guide's frame
  sections: GuideSection[];  // 3 sections, exactly 2 questions each
  landing: GuideLanding;
  // Optional — reused from Shepherd concept
  deeperDive?: string[];     // Supporting scripture IDs for further study
};
```

### File Structure

```
src/
  types/guide.ts             — Type definitions
  data/
    guides/
      battle-of-the-mind-women.json    — One file per guide
      real-faith.json
      good-samaritan.json
      ...
    series.json               — Series metadata (auto-extracted)
  lib/
    guideData.ts              — Auto-discovered guide loader
    guideSelectors.ts         — Filter/search/resolve helpers
    exportMarkdown.ts         — Guide → markdown export (reuse from Shepherd)
    search.ts                 — Search across guides
  store/
    useRoundtableStore.ts     — Zustand store
  components/
    controls/
      SeriesFilter.tsx         — Filter by sermon series
      BookFilter.tsx           — Filter by Bible book
    guides/
      GuideCard.tsx            — Guide preview card
      GuideView.tsx            — Full guide display
      SectionBlock.tsx         — One section of the guide
      AnchorVerse.tsx          — Anchor verse blockquote component
    ExportPrint.tsx            — Print layout + markdown export
  App.tsx                     — App shell
  index.css                   — Dark theme + print styles
```

### App Features (MVP)

- **Browse by**: Sermon series, Bible book, date
- **Guide view**: Full discussion guide with anchor verse blockquote, sections, questions, landing
- **Print**: One-page print layout (reuse Shepherd's print CSS pattern)
- **Export**: Markdown download
- **Search**: Across guide titles, series, scripture references
- **Dark theme**: Same design system as Shepherd

### Routes (single page app, no router needed — same panel-switching as Shepherd)

- **List view** (default) — Filter/sort/search guides
- **Guide view** — Selected guide displayed in detail panel
- Panel switching: same `hidden`/`flex` toggle pattern as Shepherd

---

## Shepherd Reuse Inventory

### Direct Copy (same tech, minimal changes)

| Item | Notes |
|------|-------|
| React + Zustand + Vite + Tailwind + TS 6 | Full stack, same versions |
| Vite config (`vite.config.ts`) | Same Tailwind plugin, React plugin |
| TypeScript config (`tsconfig*.json`) | Same strict settings |
| `index.html` | Same base template |
| `tailwindcss` + `@tailwindcss/vite` | Same setup |
| Dark theme variables + base colors | Same slate/cyan palette |
| `transition-all active:scale-95` | Same interaction pattern |
| Responsive flex-col layout | Same sidebar/content panel pattern |
| Print layout in `index.css` `@media print` | Same architecture |
| App-level PrintLesson pattern | Same top-level render for print |
| `clsx()` utility pattern | Same usage |
| Lucide icon pattern | Same import + usage |
| Cloudflare Pages deployment | Same `wrangler.toml` + dashboard config |

### Adapted (same pattern, different data)

| Pattern | Shepherd | Roundtable |
|---------|----------|------------|
| Data files | `src/data/topics/{topic}.json` | `src/data/guides/{guide}.json` |
| Auto-discovery | `topicFiles` array in `topicData.ts` | `guideFiles` array in `guideData.ts` |
| Store | `useShepherdStore` | `useRoundtableStore` |
| Filters | Age tier + category + search | Series + Bible book + date + search |
| Print | Full lesson (7 sections) | Full guide (anchor + 3 sections + landing) |
| Markdown export | Lesson → markdown | Guide → markdown |
| Resolver | `resolveLesson(selectedTier)` | `resolveGuide()` (no tier needed) |
| BTB population | `populate-scripture-text.ts` | Same script, adapted for guide data |
| Codex dispatch | Topic spec → topic JSON | Guide spec → guide JSON |

### Not Needed (Shepherd features that don't apply)

- Age tier system (guides are for all-ages Life Groups)
- Age gating / `minAgeTierId`
- `ageVariants` / tier-specific content
- `fromThePulpit` section (the whole guide IS from the pulpit)
- Age selector component
- Topic category system (guides categorized by series/book instead)

---

## Content Pipeline (First Batch)

### Existing Guides to Import

From the vault, 6 existing discussion guides to convert to JSON format:

| Guide | Series | Date |
|-------|--------|------|
| Battle of the Mind — Women | Battle of the Mind | 2026-05-10 |
| Real Faith | Luke | 2026-02-15 |
| Good Samaritan | Stories From Luke | 2023-05-21 |
| Armor for the Mind | Battle of the Mind | TBD |
| Designed On Purpose | Designed | TBD |
| Answer the Call | TBD | TBD |

### Batch Generation Pattern

Same proven pattern as Shepherd:
1. Read existing guide markdown from vault
2. Write Codex spec with schema + content → dispatch
3. Verify with tsc
4. Save + commit

---

## Deployment

Same model as Shepherd:
- Cloudflare Pages via dashboard (no API token)
- GitHub repo: `kodakwest/roundtable`
- Build command: `npm run build`
- Output dir: `dist/`
- Domain: `roundtable.pages.dev` (or similar)

---

## Phases

### Phase 1 (MVP) — App shell + first guides
- [ ] Init project (Vite + React + TS + Tailwind + Zustand)
- [ ] Define types in `src/types/guide.ts`
- [ ] Create `src/data/guides/` with 2-3 hand-written guide JSONs
- [ ] Build Zustand store (list + selected guide + filters)
- [ ] Build list view (search, series/book filters)
- [ ] Build guide view (anchor verse + sections + landing)
- [ ] Print layout
- [ ] Markdown export
- [ ] Deploy to CF Pages

### Phase 2 — Content pipeline
- [ ] Codex CLI dispatch pattern (spec template for guides)
- [ ] BibleFlow integration for new guides
- [ ] Batch generate remaining existing guides
- [ ] BTB scripture text population
- [ ] Automated verification

### Phase 3 — Automation
- [ ] Dedicated Hermes profile for guide generation
- [ ] Cron job for new sermon → guide workflow
- [ ] YouTube transcript integration for new sermons

---

## Project Location

`/mnt/s/Projects/roundtable/`

Same S: drive location as Shepherd.

---

## Next Steps

1. ✅ Plan reviewed
2. ⬜ Codex dispatch: scaffold project + 3 sample guides
3. ⬜ Verify: `tsc --noEmit` + build
4. ⬜ GitHub repo: `kodakwest/roundtable`
5. ⬜ Deploy to CF Pages
