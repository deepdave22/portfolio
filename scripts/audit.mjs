/**
 * Visual + accessibility audit.
 *
 *   node scripts/audit.mjs [baseUrl] [outDir]
 *
 * For every viewport × theme combination it:
 *   - screenshots the full page
 *   - fails on horizontal overflow (the classic mobile bug)
 *   - runs axe-core and reports violations
 *   - collects console errors and failed network requests
 * Then it checks every in-page anchor resolves and every asset returns 200.
 */

import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3001";
const OUT = process.argv[3] ?? "audit";
mkdirSync(OUT, { recursive: true });

const AXE = readFileSync("node_modules/axe-core/axe.min.js", "utf8");

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];
const THEMES = ["dark", "light"];

const SECTIONS = [
  "top",
  "about",
  "skills",
  "experience",
  "projects",
  "certifications",
  "contact",
];

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  FAIL  ${msg}`);
};
const pass = (msg) => console.log(`  ok    ${msg}`);

const browser = await chromium.launch({ channel: "chrome" });

for (const vp of VIEWPORTS) {
  for (const theme of THEMES) {
    const tag = `${vp.name}-${vp.width}-${theme}`;
    console.log(`\n=== ${tag} ===`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    // Seed the theme before any script runs, so we test the real first paint.
    await context.addInitScript(`try{localStorage.setItem('theme','${theme}')}catch(e){}`);

    const page = await context.newPage();
    const consoleErrors = [];
    const badResponses = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("requestfailed", (r) =>
      badResponses.push(`${r.url()} — ${r.failure()?.errorText}`),
    );
    page.on("response", (r) => {
      if (r.status() >= 400) badResponses.push(`${r.url()} — HTTP ${r.status()}`);
    });

    await page.goto(BASE, { waitUntil: "networkidle" });

    // Confirm the theme actually applied.
    const applied = await page.getAttribute("html", "data-theme");
    if (applied !== theme) fail(`theme attribute is "${applied}", expected "${theme}"`);
    else pass(`theme = ${theme}`);

    // Every section present and rendered with real height.
    for (const id of SECTIONS) {
      const box = await page.locator(`#${id}`).first().boundingBox().catch(() => null);
      if (!box) fail(`section #${id} missing or not rendered`);
      else if (box.height < 40) fail(`section #${id} has height ${box.height}`);
    }
    pass(`${SECTIONS.length} sections checked`);

    // Horizontal overflow.
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const widest = [...document.querySelectorAll("body *")]
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { right: Math.round(r.right), tag: el.tagName, cls: el.className?.toString?.().slice(0, 60) };
        })
        .filter((x) => x.right > de.clientWidth + 1)
        .sort((a, b) => b.right - a.right)
        .slice(0, 3);
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, widest };
    });
    if (overflow.scrollW > overflow.clientW + 1) {
      fail(
        `horizontal overflow: scrollWidth ${overflow.scrollW} > ${overflow.clientW}` +
          (overflow.widest.length
            ? ` — widest: ${overflow.widest.map((w) => `${w.tag}.${w.cls}@${w.right}`).join(", ")}`
            : ""),
      );
    } else pass("no horizontal overflow");

    // Scroll the whole page so every scroll-reveal block fires, then return to
    // the top. Without this the screenshot captures unrevealed sections at
    // opacity 0 and axe reports nothing useful about them.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.75;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        // behavior:"instant" overrides the page's smooth-scroll CSS, which
        // would otherwise swallow these jumps and never fire the observers.
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 400));
    });

    // Nothing should still be mid-animation or stuck hidden.
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll("[data-reveal]")]
        .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99)
        .map((el) => el.className?.toString?.().slice(0, 50) || el.tagName),
    );
    if (hidden.length) fail(`${hidden.length} reveal block(s) still hidden: ${hidden.slice(0, 3).join(" | ")}`);
    else pass("all reveal blocks visible");

    // Text contrast + full a11y sweep.
    await page.addScriptTag({ content: AXE });
    const results = await page.evaluate(async () =>
      await window.axe.run(document, {
        resultTypes: ["violations"],
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      }),
    );
    if (results.violations.length) {
      for (const v of results.violations) {
        fail(
          `axe ${v.id} (${v.impact}) ×${v.nodes.length}: ${v.help} — e.g. ${v.nodes[0].target.join(" ")}`,
        );
      }
    } else pass("axe-core: 0 violations");

    if (consoleErrors.length) consoleErrors.forEach((e) => fail(`console: ${e}`));
    else pass("no console errors");

    if (badResponses.length) [...new Set(badResponses)].forEach((r) => fail(`request: ${r}`));
    else pass("no failed requests");

    await page.screenshot({
      path: join(OUT, `${tag}.png`),
      fullPage: true,
    });

    await context.close();
  }
}

/* ── Link integrity, checked once at desktop width ──────────────────────── */

console.log(`\n=== links ===`);
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });

const links = await page.evaluate(() =>
  [...document.querySelectorAll("a[href]")].map((a) => ({
    href: a.getAttribute("href"),
    text: (a.textContent || "").trim().slice(0, 40),
    hasName: !!(a.textContent?.trim() || a.getAttribute("aria-label")),
  })),
);

for (const link of links) {
  if (!link.hasName) fail(`link with no accessible name: ${link.href}`);
  if (link.href.startsWith("#")) {
    const id = link.href.slice(1);
    const exists = await page.locator(`#${id}`).count();
    if (!exists) fail(`anchor ${link.href} has no target`);
  }
}
pass(`${links.length} links checked (${links.filter((l) => l.href.startsWith("#")).length} in-page anchors)`);

for (const asset of ["/resume.pdf", "/og.png", "/icon.svg", "/sitemap.xml", "/robots.txt"]) {
  const res = await page.request.get(BASE + asset);
  if (!res.ok()) fail(`${asset} → HTTP ${res.status()}`);
  else pass(`${asset} → ${res.status()} ${res.headers()["content-type"]}`);
}

/* ── Keyboard: tab through and confirm focus is always visible ──────────── */

console.log(`\n=== keyboard ===`);
const focusTrail = [];
for (let i = 0; i < 12; i++) {
  await page.keyboard.press("Tab");
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const s = getComputedStyle(el);
    return {
      tag: el.tagName,
      label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30),
      outline: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0,
    };
  });
  if (!info) break;
  focusTrail.push(info);
}
const noRing = focusTrail.filter((f) => !f.outline);
if (noRing.length) fail(`${noRing.length} focused elements had no visible outline: ${noRing.map((f) => f.tag + ":" + f.label).join(", ")}`);
else pass(`${focusTrail.length} tab stops, all with visible focus ring`);

await context.close();
await browser.close();

console.log(`\n${failures === 0 ? "PASS" : "FAIL"} — ${failures} issue(s). Screenshots in ${OUT}/`);
process.exit(failures === 0 ? 0 : 1);
