// Builds the 4-recipe sample: recipes.json + styles.css -> sample.html -> PDF.
// Usage (from repo root):  NODE_PATH=$(npm root -g) node source/build.mjs
// Photographs: drop source/images/<slug>.jpg (300 ppi at 3.98 × 3.75 in, i.e. >= 1200 × 1125 px).
// A missing photograph is rendered as a clearly labelled empty frame, never as a stand-in image.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const SRC = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SRC, "..");
const OUT_PDF = join(ROOT, "Delicious_Discipline_4_Recipe_Sample.pdf");
const OUT_HTML = join(SRC, "sample.html");

const data = JSON.parse(readFileSync(join(SRC, "recipes.json"), "utf8"));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Typographic refinement only: curly quotes/apostrophes, single-digit fractions set with the
// font's "frac" feature (the underlying text stays "1/2" when copied). Words are never changed.
function typo(s) {
  let t = esc(s)
    .replace(/(^|[\s(:])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/'/g, "’");
  t = t.replace(/(^|[^\d/])(\d)\/(\d)(?![\d/])/g, '$1<span class="frac">$2/$3</span>');
  // keep a number with its unit / the word that follows it on the same line
  t = t.replace(/(\d) (cups?|teaspoons?|tablespoons?|ounces?|pounds?|minutes|seconds|inch|inches|eggs?|sticks?|slices?|ribs?|cloves?|balls|halves|squares|by)\b/g, "$1 $2");
  // anti-widow: tie a short final word group to the word before it
  t = t.replace(/ (\S+) (\S+)$/, (m, a, b) => /[<>"=]/.test(a + b) ? m : (a + b).replace(/<[^>]+>/g, "").length <= 10 ? `\u00A0${a}\u00A0${b}` : ` ${a}\u00A0${b}`);
  return t;
}

function photo(r) {
  const file = ["jpg", "jpeg", "png", "webp"].map((x) => `images/${r.slug}.${x}`).find((p) => existsSync(join(SRC, p)));
  if (file) return `<figure class="photo"><img src="${file}" alt="${esc(r.title)}"></figure>`;
  return `<figure class="photo placeholder" aria-label="Photograph to come">
      <span class="ph-label">Photograph to come</span>
      <span class="ph-name">${typo(r.title)}</span>
    </figure>`;
}

function page(r, i) {
  const variant = r.fullCarnivore
    ? `<p class="note variant"><span class="label">Go full carnivore:</span> ${typo(r.fullCarnivore)}</p>`
    : "";
  return `
<section class="page" id="r${r.number}">
  <div class="live">
    <header class="head">
      <p class="kicker">${esc(r.section)}<span class="sep"></span>No. ${r.number}</p>
      <h1 class="title">${typo(r.title)}</h1>
      <p class="built-on">${typo(r.builtOn)}</p>
      <p class="headnote">${typo(r.headnote)}</p>
    </header>
    ${photo(r)}
    <p class="meta">${r.meta.map((m) => `<span>${typo(m)}</span>`).join("")}</p>
    <div class="basis">
      <p><span class="label">Carnivore base:</span> ${typo(r.carnivoreBase)}</p>
      <p><span class="label">Keto assist:</span> ${typo(r.ketoAssist)}</p>
    </div>
    <div class="col-left">
      <h2 class="section-head">You need</h2>
      <ul class="ingredients">${r.ingredients.map((x) => `<li>${typo(x)}</li>`).join("")}</ul>
      ${variant}
    </div>
    <div class="col-right">
      <h2 class="section-head">Do this</h2>
      <ol class="steps">${r.steps.map((x) => `<li>${typo(x)}</li>`).join("")}</ol>
      <p class="note reveal"><span class="label">The Reveal.</span> ${typo(r.reveal)}</p>
    </div>
  </div>
  <footer class="folio"><span>${esc(data.book)}</span><span class="num">${i + 1}</span></footer>
</section>`;
}


const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(data.book)} — Recipe Sample</title>
<link rel="stylesheet" href="styles.css">
</head><body>
${data.recipes.map(page).join("\n")}
<script>
// Layout rule: The Reveal closes whichever column leaves the page shorter overall.
for (const p of document.querySelectorAll(".page")) {
  const L = p.querySelector(".col-left"), R = p.querySelector(".col-right"), rv = p.querySelector(".reveal");
  const foot = () => Math.max(L.getBoundingClientRect().bottom, R.getBoundingClientRect().bottom);
  const inRight = foot();
  L.appendChild(rv);
  if (foot() >= inRight) R.appendChild(rv);
}
</script>
</body></html>`;
writeFileSync(OUT_HTML, html);

const browser = await chromium.launch();
const pg = await browser.newPage();
await pg.goto("file://" + OUT_HTML);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForLoadState("networkidle");
await pg.evaluate(() => document.fonts.ready);

// QA: report any element that overflows the live area or any page whose content runs long.
const report = await pg.evaluate(() => {
  const out = [];
  for (const p of document.querySelectorAll(".page")) {
    const live = p.querySelector(".live").getBoundingClientRect();
    let maxBottom = 0;
    for (const el of p.querySelectorAll(".live > *")) maxBottom = Math.max(maxBottom, el.getBoundingClientRect().bottom);
    const head = p.querySelector(".head");
    const ptPerPx = 72 / 96;
    out.push({
      id: p.id,
      spareBelowPt: +((live.bottom - maxBottom) * ptPerPx).toFixed(1),
      headOverflowPt: +((head.scrollHeight - head.clientHeight) * ptPerPx).toFixed(1),
      fontsLoaded: [...document.fonts].filter((f) => f.status === "loaded").length,
    });
  }
  return out;
});
console.table(report);

await pg.pdf({ path: OUT_PDF, preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log("Wrote", OUT_PDF);
