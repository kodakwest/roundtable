#!/usr/bin/env python3
"""
Roundtable Guide Pipeline — Convert a sermon discussion guide markdown file
to Roundtable JSON format and wire it into the codebase.

Usage:
  python3 scripts/import-guide.py <path-to-markdown>

The markdown must follow the established guide format:
  # Discussion Guide: <Title>
  **Series Name | Date**
  > Anchor verse blockquote — Reference
  **Scripture:** Ref1 · Ref2 · ...
  Theme: <one-line theme>
  Framing paragraph (1-2 sentences)

  ## Section Title (3 sections)
  Context paragraph...
  - Question 1
  - Question 2

  ## Landing the Plane
  Closing paragraph...
  Final Question: <question>
"""

import sys
import re
import json
import os
from pathlib import Path
from typing import Optional

PROJECT_DIR = Path("/mnt/s/Projects/roundtable")
GUIDES_DIR = PROJECT_DIR / "src" / "data" / "guides"
GUIDE_DATA = PROJECT_DIR / "src" / "lib" / "guideData.ts"

def slugify(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def extract_id(title: str) -> str:
    return slugify(title.split('—')[0].strip() if '—' in title else title)

def parse_guide(md_path: Path) -> dict:
    text = md_path.read_text(encoding="utf-8")
    
    # Title
    title_match = re.search(r'^# Discussion Guide:\s*(.+)$', text, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else "Untitled"
    
    # Series and date
    series_match = re.search(r'\*\*(.+?)\s*\|\s*(.+?)\s*\*\*', text)
    series = series_match.group(1).strip() if series_match else "General"
    date = series_match.group(2).strip() if series_match else "Unknown"
    
    # Anchor verse blockquote
    anchor_match = re.search(r'^>\s*[""](.+?)[""]\s*—\s*(.+)$', text, re.MULTILINE)
    anchor_text = anchor_match.group(1).strip() if anchor_match else ""
    anchor_ref = anchor_match.group(2).strip() if anchor_match else ""
    
    # Scripture map
    scripture_match = re.search(r'\*\*Scripture:\*\*\s*(.+)$', text, re.MULTILINE)
    scripture_map = scripture_match.group(1).strip() if scripture_match else ""
    
    # Theme
    theme_match = re.search(r'\*\*Theme:\*\*\s*(.+)$', text, re.MULTILINE)
    theme = theme_match.group(1).strip() if theme_match else ""
    
    # Framing — first paragraph after theme
    framing = ""
    lines = text.split('\n')
    in_framing = False
    for line in lines:
        if '**Theme:**' in line or '**Theme:**' in line.replace('*', ''):
            in_framing = True
            continue
        if in_framing and line.strip() and not line.startswith('#') and not line.startswith('---'):
            framing = line.strip()
            break
    
    # Sections
    sections = []
    current_section = None
    current_context = []
    in_context = False
    
    for line in lines:
        # Section header: ## Section Name
        sec_header = re.match(r'^##\s+(.+)$', line)
        if sec_header and sec_header.group(1).strip() != "Landing the Plane":
            if current_section:
                current_section['context'] = ' '.join(current_context).strip()
                sections.append(current_section)
            current_section = {
                "title": sec_header.group(1).strip(),
                "context": "",
                "questions": []
            }
            current_context = []
            in_context = True
            continue
        
        if line.strip() == '---':
            if current_section:
                current_section['context'] = ' '.join(current_context).strip()
                sections.append(current_section)
            current_section = None
            current_context = []
            in_context = False
            continue
        
        if current_section:
            # Question: starts with - or bullet
            q_match = re.match(r'^\s*[-•]\s+(.+)$', line)
            if q_match:
                q_text = q_match.group(1).strip()
                # Check if it ends with ?
                current_section['questions'].append({
                    "id": f"{extract_id(title)}-q{len(current_section['questions'])+1}",
                    "prompt": q_text
                })
            elif in_context and line.strip():
                current_context.append(line.strip())
    
    # Landing section
    landing_para = ""
    final_question = ""
    in_landing = False
    in_final_question = False
    
    for line in lines:
        if re.match(r'^##\s+Landing the Plane\s*$', line):
            in_landing = True
            continue
        if in_landing and line.strip():
            fq_match = re.match(r'^\*\*Final Question:\*\*\s*(.+)$', line)
            if fq_match:
                final_question = fq_match.group(1).strip()
            elif not final_question:
                # Skip "The battle Paul calls us to fight..." type paragraph — it's the landing text
                if line.startswith('>') or line.startswith('**'):
                    continue
                if landing_para:
                    landing_para += ' ' + line.strip()
                else:
                    landing_para = line.strip()
    
    guide_id = extract_id(title)
    
    # If no anchor verse from blockquote, try to find one
    if not anchor_ref and sections:
        for s in sections:
            m = re.search(r'([A-Za-z]+\s*\d+:\d+[-–]\d+)', s['context'])
            if m:
                anchor_ref = m.group(1)
                break
    
    return {
        "id": guide_id,
        "title": title,
        "series": series,
        "date": date,
        "scriptureMap": scripture_map,
        "anchorVerse": {
            "reference": anchor_ref or scripture_map.split('·')[0].strip(),
            "text": anchor_text or ""
        },
        "theme": theme,
        "framingSentence": framing,
        "sections": sections,
        "landing": {
            "paragraph": landing_para.strip(),
            "finalQuestion": final_question
        }
    }

def write_guide(guide: dict):
    path = GUIDES_DIR / f"{guide['id']}.json"
    path.write_text(json.dumps(guide, indent=2) + '\n', encoding="utf-8")
    print(f"✅ Written: {path}")
    return path

def update_guide_data(guide_id: str):
    text = GUIDE_DATA.read_text(encoding="utf-8")
    
    # Add import
    var_name = guide_id.replace('-', '_')
    import_line = f'import {var_name} from "../data/guides/{guide_id}.json";'
    
    if import_line not in text:
        # Add import after the last existing import
        last_import = list(re.finditer(r'^import .+ from ".+";$', text, re.MULTILINE))
        if last_import:
            pos = last_import[-1].end()
            text = text[:pos] + '\n' + import_line + text[pos:]
        
        # Add to guideFiles array
        array_insert = re.search(r'(const guideFiles = \[)', text)
        if array_insert:
            pos = array_insert.end()
            text = text[:pos] + f'\n  {var_name},' + text[pos:]
        
        GUIDE_DATA.write_text(text, encoding="utf-8")
        print(f"✅ Updated: {GUIDE_DATA}")
    else:
        print(f"⏭️  Already in guideData.ts: {guide_id}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/import-guide.py <path-to-markdown>")
        sys.exit(1)
    
    md_path = Path(sys.argv[1])
    if not md_path.exists():
        print(f"❌ File not found: {md_path}")
        sys.exit(1)
    
    guide = parse_guide(md_path)
    write_guide(guide)
    update_guide_data(guide['id'])
    
    print(f"\n📋 Summary:")
    print(f"  Title: {guide['title']}")
    print(f"  Series: {guide['series']}")
    print(f"  Date: {guide['date']}")
    print(f"  Sections: {len(guide['sections'])}")
    print(f"  Questions: {sum(len(s['questions']) for s in guide['sections'])}")
    print(f"\nNext: npm run build && git add . && git commit -m 'feat: add {guide['id']} guide' && git push")

if __name__ == "__main__":
    main()
