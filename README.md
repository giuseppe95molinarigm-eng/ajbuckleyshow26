# Delicious Discipline: 4-recipe layout sample

| Path | What it is |
|---|---|
| `Delicious_Discipline_4_Recipe_Sample.pdf` | The sample: 4 recipe pages, 8.5 × 11 in, no bleed, fonts embedded, text selectable |
| `source/recipes.json` | Recipe text, transcribed verbatim from *25 Days of Discipline: The 25 Recipes* |
| `source/styles.css` | Grid, type scale, colours and reusable styles (title, meta, ingredients, steps, notes, folio) |
| `source/build.mjs` | Template + build: JSON → `source/sample.html` → PDF (Chromium via Playwright) |
| `source/fonts/` | Cormorant Garamond and Source Sans 3 (SIL Open Font License) |
| `source/images/` | The four photographs (2048 × 2048 JPG, about 534 ppi effective in the layout) and `IMAGE_PROMPTS.md` |
| `source/generate_images.mjs` | Regenerates the photographs on Replicate (FLUX 1.1 Pro Ultra): `REPLICATE_API_TOKEN=… node source/generate_images.mjs [slug]` |
| `NOTES.md` | Editorial notes and points for the client to confirm |

## Rebuild

```sh
NODE_PATH=$(npm root -g) node source/build.mjs
```

The build prints a QA table showing the spare space below the content on each page. A negative value means overflow.

## Design system (summary)

- **Grid:** live area 504 × 688 pt (margins: top 43, sides 54, bottom 61); 12 columns, 18 pt gutters, split 5 | 7.
  The left side holds the title block, ingredients and variants. The right side holds the photograph, method and The Reveal.
- **Type:** Cormorant Garamond for display (title 30/31, section heads 17, step numerals 17). Source Sans 3 for text (body 10.75/14.5, notes 10/13.75, small-caps labels 8.5).
- **Colour:** ivory `#F8F3E9`, anthracite `#2A2A28`, fir green `#2E4A3B`, bordeaux `#7B2533`, rule `#CFC2AC`.
- **Holiday elements:**
  - *Advent seal:* the recipe number on a bordeaux seal pinned to the photograph, after *25 Days of Discipline*.
  - *Page frame:* a fir-green double frame set 20 pt in from the trim.
  - *Yield and times:* a fir-green band.
  - *Photographs:* an ivory mat around each one.
  - *The Reveal:* marked by a bordeaux rule.
- **Rules:** text is left-aligned with no hyphenation. Numbers stay on the same line as their units, and short last words are tied to the word before them. The Reveal closes whichever column gives the shorter page.
