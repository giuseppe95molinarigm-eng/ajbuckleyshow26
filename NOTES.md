# Editorial notes: for internal use and client confirmation (not part of the PDF)

## Sources compared
- `25 Days of Discipline The 25 Recipes.pdf` and `… Recipes_1.pdf` differ **only in the subtitle on page 1**:
  - A: *Delicious Discipline: Ketovore Holiday Recipes to Stay Lean Without White Knuckling It*
  - B: *Delicious Discipline: An Actor's Holiday Cheat Code. Keto Carnivore Recipes to Eat Everything You Love and Stay Lean*

  The recipe text is identical in both. The sample uses only the shared title "Delicious Discipline" in the footer, so **the subtitle still needs to be chosen**.
- The Kids Bonus was used for context only. No recipes were taken from it.

## Recipes selected
| Page | No. | Recipe | Section | Why |
|---|---|---|---|---|
| 1 | 1 | Buckley's Brown Butter Chocolate Chip Cookies | Desserts | Signature recipe that carries AJ's name; a warm brown, baked look |
| 2 | 11 | Deviled Eggs of Christmas Past | Bring It to the Party | Shows the "Go full carnivore" variant; bright, light look |
| 3 | 16 | Meatball Ornaments | Bring It to the Party | The meat-forward carnivore identity, with a variant; deep red and brown look |
| 4 | 25 | Christmas Morning Cinnamon Rolls | Breads | The Christmas centrepiece and the longest text, which stress-tests the layout |

Bravo Three Buns and Ghostfacer Garlic Knots were left out on purpose. The manuscript says those two names need clearance from the client's reps.

## Presentation choices (content unchanged)
- The sentence "Makes 16. 15 minutes of work, 12 in the oven." is set as a separate row of small-caps cells: *Makes 16 | 15 minutes of work | 12 in the oven*. The words are unchanged.
- "Go full carnivore:" appears as a subordinate panel under the ingredients rather than in the same paragraph as Carnivore base / Keto assist.
- Typographic changes only: curly quotes and apostrophes, and fraction glyphs. Copied text still reads "1/2".
- Folios 1–4 are provisional sample numbers.

## Manuscript inconsistencies (reported, NOT changed)
1. **Meatball Ornaments:** step 5 serves the meatballs "with warm marinara", and the variant says "skip the marinara", but marinara is not in the ingredient list.
2. **Christmas Morning Cinnamon Rolls:** step 3 calls for a "buttered 8 by 8 pan", but the 5 tablespoons of butter are fully used (3 in step 2, 2 in step 5), so the butter for the pan isn't counted. "9 by 12 rectangle" has no unit (inches presumably). One ingredient line combines two different sweeteners.
3. **Deviled Eggs:** the "25 minutes" doesn't seem to include cooking the bacon, which is listed as "cooked crisp and crumbled".
4. **Chocolate Chip Cookies:** the header times (15 minutes of work, 12 in the oven) don't include the 10-minute cool, 20-minute chill and 15-minute rest in the method. This is consistent with the style of the rest of the book, but worth knowing.
5. **Cinnamon Rolls (also):**
   - Step 1 says "Heat the oven to 375°F", which clashes with the headnote's plan to build the rolls Christmas Eve and bake them in the morning.
   - "then 30 more" has no unit (seconds implied).
   - The front matter says recipe 2's icing goes on the cinnamon rolls, but No. 25 has its own icing.
6. **Meatball Ornaments (also):** counting marinara, the recipe has 8 ingredients, which breaks house rule 1 (7 max).
7. **Deviled Eggs (also):** no quantity is given for smoked paprika or for salt and pepper, and the type of mustard is not specified.
8. The section is called "Party" in the contents table and "Bring It to the Party" as the Part title. The sample uses the Part title.

## Independent QA (separate agent)
- **Content:** a word-for-word comparison against the manuscript found no defects.
- **Layout:** no blocking issues. Its minor points were fixed:
  - ragged short lines, by switching to normal wrapping and two-word anti-widow ties
  - the "of" left at a title line end
- **Kept by design:**
  - The Reveal changes column from page to page. It closes whichever column gives the shorter page.
  - The headnote sits on the photo's bottom edge, so the space above it changes with title length.

## Production notes
- **Ivory background:** KDP prints colour interiors on white paper. A full-page ivory tint therefore needs bleed (8.625 × 11.25 in) in the final files. The alternative is a white page with ivory used only in panels. This sample is set to trim size with no bleed, as the brief asked.
- **Trim size:** provisional at 8.5 × 11 in. Everything is driven by CSS variables, so a different trim means a reflow, not a redesign.
- **Photographs:**
  - *Source:* AI-generated with FLUX 1.1 Pro Ultra and checked against each recipe. Meatballs and cinnamon rolls were regenerated once because the first versions showed a crumb coating and a drizzled glaze.
  - *Remaining detail:* on the meatball tray a few crumbs are still scattered next to the dish.
  - *Disclosure:* these are AI images, so check KDP's AI-content disclosure.
  - *For the final book:* real photography of the cooked recipes is recommended.
- **Page frame:** the decorative frame sits 20 pt (0.28 in) inside the trim. That is within KDP's 0.25 in minimum, but trim tolerance can make it look slightly off-centre. Confirm it for print or move it to 0.375 in.
