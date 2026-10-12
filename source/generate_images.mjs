// Generates the four recipe photographs with FLUX 1.1 Pro Ultra on Replicate.
// Usage: REPLICATE_API_TOKEN=... node source/generate_images.mjs [slug ...]
// Prompts are read from images/IMAGE_PROMPTS.md (shared style block + per-recipe block).
// The token is read from the environment only and is never written to disk.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = dirname(fileURLToPath(import.meta.url));
const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) throw new Error("Set REPLICATE_API_TOKEN");

const md = readFileSync(join(SRC, "images/IMAGE_PROMPTS.md"), "utf8");
const quote = (block) => block.split("\n").filter((l) => l.startsWith("> ") && !l.startsWith("> *Exclude")).map((l) => l.slice(2)).join(" ");
const shared = quote(md.split("## Shared style block")[1].split("\n## ")[0]);
const recipes = [...md.matchAll(/^## \d\. `([^`]+)\.jpg`\n([\s\S]*?)(?=\n## |(?![\s\S]))/gm)].map(([, slug, body]) => ({
  slug,
  // FLUX has no negative prompt: exclusions stay in the brief for review; the prompt states what IS in frame.
  prompt: `${quote(body)} The only food in the photograph is exactly this dish. ${shared}`,
}));

const only = process.argv.slice(2);
if (process.env.DRY) { for (const r of recipes) console.log(r.slug, "\n", r.prompt, "\n"); process.exit(0); }
for (const r of recipes.filter((r) => !only.length || only.includes(r.slug))) {
  let p;
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", Prefer: "wait=60" },
    body: JSON.stringify({ input: { prompt: r.prompt, aspect_ratio: "1:1", raw: true, output_format: "jpg", safety_tolerance: 2 } }),
    });
    p = await res.json();
    if (res.ok) break;
    console.error(r.slug, res.status, p.detail ?? p.title, "- retrying");
    await new Promise((ok) => setTimeout(ok, 1000 * (Number(p.retry_after) || 15)));
  }
  while (p.status && !["succeeded", "failed", "canceled"].includes(p.status)) {
    await new Promise((ok) => setTimeout(ok, 2000));
    p = await (await fetch(p.urls.get, { headers: { Authorization: `Bearer ${TOKEN}` } })).json();
  }
  if (p.status !== "succeeded") { console.error(r.slug, p.status, p.error ?? p.detail); continue; }
  const url = Array.isArray(p.output) ? p.output[0] : p.output;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(join(SRC, "images", `${r.slug}.jpg`), buf);
  console.log("saved", r.slug, buf.length, "bytes");
}
