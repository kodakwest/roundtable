---
type: knowledge
tags: [admin, roundtable, design, workflow]
---

# Roundtable — Agent Instructions

## Project Overview
Roundtable is a sermon discussion guide application. It uses a structured pipeline to generate, store, and display these guides. This app's admin interface at `/admin` is designed to allow sermon guide authors (typically pastors) to quickly paste markdown, preview it as an editable form, and publish it via a one-click workflow to a D1 database.

## Tech Stack
- **Framework:** React 19
- **State Management:** Zustand 5
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 6
- **Deployment:** Cloudflare Pages with D1 Database

## Design Conventions
- **Theme:** Dark Theme
- **Colors:**
  - Background: `#0e0f0d`
  - Accent: `#d4a373` (Gold)
- **Icons:** Lucide React
- **Typography:** Spacious, readable text settings to reflect a writing tool feel rather than a typical data entry form.

## Admin Interface Workflow & UX

The `/admin` interface requires minimal friction. Its core features include:
1. **Markdown to Guide Conversion:**
   - A worker parses structured markdown (which includes title, series, scripture, sections with questions, and a landing section) into the `Guide` JSON schema defined in `src/types/guide.ts`.
   - The UI should clearly show confidence levels or warnings after parsing (e.g., highlighting fields that were successfully parsed vs. those needing attention).

2. **Editable Preview:**
   - After pasting and parsing, do not redirect to a complex separate form. Instead, display the guide as an *editable preview*.
   - Use inline editing directly on the preview to allow the author to tweak content quickly and intuitively.

3. **Spacious Textarea:**
   - The initial markdown paste area should feel like a dedicated writing tool (e.g., large, distraction-free) rather than a small generic text input.

4. **One-Click Publish:**
   - A prominent publish action that saves the JSON to the D1 database.
   - Upon saving, the guide should immediately become available on the main site.

5. **Mobile Friendliness:**
   - Since users may access the admin interface from a tablet or mobile device, ensure all UI components (textarea, inline editors, buttons) are fully responsive and touch-friendly.

6. **Authentication:**
   - The `/admin` page is protected by a simple shared-key gate rather than a complex authentication system. Ensure the UI includes an unobtrusive input for this key before granting access.

## Code Conventions
- When writing components for the admin, continue to use `clsx()` for conditional classes.
- Ensure that the generated JSON strictly adheres to the schema defined in `src/types/guide.ts`.
- When creating documentation or knowledge base files, use the 'Graph Seed frontmatter' convention at the top of the file (as seen at the top of this document).

