---
title: "Roundtable Admin — Markdown Paste-to-Publish"
artifact_type: Architecture_Diagram
source_context: Codex build from adversarial spec (May 17, 2026). Jules design input via AGENTS.md.
domain: Sermon Discussion Guides; LogOS Ecosystem
systems: Cloudflare Pages; D1; Pages Functions; Vite; React 19; Zustand 5
primary_entities: Roundtable; D1 guides; Worker markdown parser; Admin page; GuideComposer
last_updated: 2026-05-18
status: active
---

# Roundtable Admin — Architecture

## Overview
Instead of a CLI-only import pipeline, Roundtable now has an admin page at `/admin` that lets sermon guide authors paste markdown, parse it into the Guide schema via a Worker, preview and edit, and one-click publish to D1.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  roundtable.logos-core.com                          │
│                                                     │
│  React App (src/)                                   │
│  ├── /admin                                         │
│  │   ├── AdminLogin.tsx        ← key gate           │
│  │   ├── AdminDashboard.tsx    ← guide list + add   │
│  │   └── GuideComposer.tsx     ← textarea → parse   │
│  │       → preview → save                          │
│  ├── Store loads from GET /api/guides                │
│  └── Static JSON fallback for dev                    │
│                                                     │
│  Pages Functions (functions/)                        │
│  ├── api/guides.ts                                   │
│  │   └── GET /api/guides → list from D1             │
│  ├── api/admin/parse.ts (234 lines)                  │
│  │   └── POST /api/admin/parse                      │
│  │       → TypeScript port of import-guide.py        │
│  │       → Regex-based, deterministic, instant       │
│  │       → Returns Guide JSON + confidence + warnings│
│  └── api/admin/guides.ts                             │
│       └── POST /api/admin/guides                    │
│           → Validates schema, inserts to D1          │
│           → X-Admin-Key header protected             │
│                                                     │
│  D1 Database (roundtable-guides)                     │
│  ├── guides table (id, title, series, date, ...)     │
│  ├── Seeded with 5 existing guides                  │
│  └── Database ID: 5a6f5c60-c926-4fa1-a53c-f2c97f090d7e
└─────────────────────────────────────────────────────┘
```

## Data Flow
1. User visits `/admin`, enters admin key (sessionStorage)
2. Pastes vault markdown into textarea
3. Clicks "Parse & Preview" → POST /api/admin/parse
4. Worker parses markdown, returns Guide JSON + confidence score + warnings
5. Editable preview renders — user adjusts if needed
6. Clicks "Save Guide" → POST /api/admin/guides (with X-Admin-Key)
7. Worker validates key, validates schema, INSERT OR REPLACE into D1
8. Guide immediately appears on main site (store re-fetches from API)

## Key Design Decisions
- **Worker-side parsing over LLM**: Regex-based + confidence scoring. Deterministic, instant, free. Reserve LLM for future "suggest questions" feature.
- **D1 over KV**: Need sort by date, filter by series. D1 handles relational queries cleanly.
- **Hybrid data loading**: API-first, static JSON fallback for dev. New guides appear without rebuild.
- **Simple admin key over OAuth**: Shared wrangler secret, stored in sessionStorage. Pragmatic for church app.

## Files Created (9 new, 1,087 lines)

| File | Lines | Purpose |
|---|---|---|
| `functions/api/guides.ts` | 72 | GET all guides from D1 |
| `functions/api/admin/parse.ts` | 234 | Markdown parser + confidence scoring |
| `functions/api/admin/guides.ts` | 112 | POST create guide (admin key protected) |
| `src/lib/api.ts` | 76 | API client (fetchGuides, parseMarkdown, saveGuide) |
| `src/pages/Admin.tsx` | 18 | Admin route wrapper |
| `src/components/admin/AdminLogin.tsx` | 64 | Admin key input |
| `src/components/admin/AdminDashboard.tsx` | 118 | Dashboard with guide list |
| `src/components/admin/GuideComposer.tsx` | 286 | Textarea → parse → preview → save |
| `seed.sql` | 107 | D1 seed data (5 guides) |

## Files Modified (5, +66/-8)

| File | Changes |
|---|---|
| `src/App.tsx` | `/admin` route, async guide loading, URL-based guide selection |
| `src/lib/guideData.ts` | Async fetch from API with static fallback |
| `src/store/useRoundtableStore.ts` | Async loadGuides, isLoading state |
| `src/components/controls/SeriesFilter.tsx` | Uses guides from store |
| `wrangler.toml` | D1 binding + compatibility_date |

## Setup
```bash
wrangler d1 create roundtable-guides      # → database_id
wrangler d1 execute roundtable-guides --file=seed.sql --remote
echo "your-key" | wrangler pages secret put ADMIN_KEY --project-name roundtable
# D1 binding configured in Cloudflare Pages dashboard
```

## Admin Key
Current key: `SGRvD48NFfEkOCFhpzJ6lY-VYpg4EQ_E`

## Jules Design Input
Jules session `12314559527403264646` produced `AGENTS.md` with design conventions:
- Dark theme, gold accent (#d4a373), spacious textarea
- Inline editing in preview, confidence/warning display
- Mobile-friendly admin, simple key gate

## Future Automation
GitHub webhook on vault repo (or directory watcher cron) → detect new markdown → call `/api/admin/parse` → upsert to D1. Zero-touch publish from vault to site.

## Graph Seed: Entity Relationships
roundtable-admin -> orchestrates -> markdown parser
roundtable-admin -> stores_in -> D1 database
markdown parser -> creates -> guide JSON
guide JSON -> loads_into -> roundtable app
admin page -> protected_by -> admin key
jules -> contributed -> AGENTS.md

## Retrieval Keywords
roundtable, admin, d1, markdown parser, pages functions, worker, guide import, sermon discussion guide, paste to publish

## Boundary Notes
This doc covers the admin feature only. For full Roundtable app architecture, see ROUNDTABLE-PLAN.md. For LogOS ecosystem context, see logos-ecosystem-handoff.md in vault.
