# Deep Dave — Portfolio

Personal portfolio for **Deep Dave**, AI/ML Engineer (Pune, India). Built with
Next.js App Router, TypeScript and Tailwind CSS, exported as a fully static site
so it hosts free anywhere.

---

## Editing the content

**All copy, links, skills, jobs, projects and metadata live in one file:**

```
src/data/portfolio.ts
```

Components only read from it — you never need to open a component to change
text. The file is typed, so if you get the shape wrong, `npm run build` tells
you exactly where.

| What you want to change | Export to edit |
| --- | --- |
| Name, title, pitch, About paragraphs, hero stats | `person` |
| Email address | `email` |
| LinkedIn / GitHub / LeetCode links | `socials` |
| Resume file path | `resumeHref` |
| Nav items (must match section `id`s) | `navItems` |
| Skill groups and tags | `skillGroups` |
| Jobs on the timeline | `experience` |
| Project cards | `projects` |
| Certification badges | `certifications` |
| Degree, college, CGPA | `education` |
| Page title, description, keywords, domain | `seo`, `siteUrl` |
| Contact heading, blurb, availability pill | `contact` |
| Section headings and intros ("Where I've shipped", etc.) | `sections` |
| Email address, phone number | `email`, `phone` / `phoneDisplay` |

A few conventions worth knowing:

- **Featured project** — set `featured: true` on a project and it renders as the
  large two-column card above the grid. `highlights` fills the spec panel on its
  right. More than one featured project is fine; they stack.
- **Placeholder links** — any `github`/`demo`/social link left as `"#"` renders
  as a dashed, non-clickable "Repo soon" / "link soon" chip instead of a dead
  link. Paste a real URL and it turns into a working button automatically.
- **Skills order is the display order**, and the group with `primary: true` gets
  the wide accent card at the top. AI/ML is first on purpose.
- **Experience is newest-first**, and `current: true` gives that role the live
  pulsing node and the "Current" pill.
- **Social icons** are keyed by `id` (`email` / `linkedin` / `github` /
  `leetcode`). To add a different platform, add the id to `SocialId`, then map
  an icon for it in `src/components/Icons.tsx`.

### Changing colours or fonts

Every colour is a CSS custom property in `src/app/globals.css` — `:root` is the
dark theme, `[data-theme="light"]` overrides it for light. Components use
semantic token classes (`bg-bg-elev`, `text-muted`, `text-accent-ink`) and never
hard-code a colour, so changing the accent in those two blocks restyles the
whole site. Fonts are loaded in `src/app/layout.tsx` via `next/font`.

> If you change the light-mode accent, re-run `npm run audit` — it checks colour
> contrast and will fail if the new colour drops below WCAG AA.

---

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # regenerates og.png, then static-exports to out/
npm run preview      # serves out/ at http://localhost:4000 (and on your LAN,
                     # so you can open it on your phone). Pass a port: 
                     #   npm run preview -- 5000
```

### Other scripts

| Script | What it does |
| --- | --- |
| `npm run audit` | Launches Chrome and checks the running site at 375 / 768 / 1440px in **both** themes: axe-core accessibility, colour contrast, horizontal overflow, console errors, failed requests, in-page anchors, asset content types and keyboard focus rings. Writes screenshots to `audit/`. Run the dev server first, or point it at the preview: `npm run audit -- http://localhost:3000` |
| `npm run gen:og` | Regenerates `public/og.png` from `portfolio.ts`. Runs automatically on every build. |
| `npm run lint` | ESLint |

---

## Deploying to Vercel

The site is a static export (`output: "export"` in `next.config.ts`), so there's
no server and no runtime cost.

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel detects Next.js automatically — **leave every setting at its default**
   and click Deploy. (Build command `npm run build`, output directory `out`.)
4. Once it's live, set your real domain in `siteUrl` in `portfolio.ts` and
   redeploy, so the Open Graph tags and `sitemap.xml` point at the right host.

Every push to `main` redeploys automatically.

<details>
<summary>Deploying to GitHub Pages instead</summary>

`out/` is a plain static folder, so GitHub Pages works too. If the site lives at
`username.github.io/repo-name` rather than a root domain, set `basePath` and
`assetPrefix` to `"/repo-name"` in `next.config.ts` first, otherwise the CSS and
JS 404.

</details>

---

## Placeholders you still need to fill in

These are deliberately left as placeholders — the site builds and looks correct
with them in place, but replace them before sharing the link:

- [ ] **`public/resume.pdf`** — currently a generated one-page stub. Drop your
      real PDF at this exact path; the hero button is already wired to it.
- [ ] **`projects[].github`** — Aerospace Hybrid RAG points at the real repo.
      The other four are still `"#"` and render as "Repo soon" chips. Add repo
      URLs as each goes public, and `demo: "https://..."` for any live demo.
- [ ] **AI SQL Analyst description** — a placeholder description of the ADK
      agent; rewrite it in your own words once the project firms up.
- [ ] **`siteUrl`** — set to `https://deepdave.dev`. Change it to your real
      deployed domain (this drives OG tags, canonical URL and the sitemap).
- [ ] **Certification years** — optional `year` field is unset on all six; add
      `year: "2026"` to any you want dated.

Already done: LinkedIn, GitHub and LeetCode point at your real profiles, and
your phone number is live in Contact as a tap-to-call link.

---

## What's in here

```
src/
├── data/portfolio.ts          ← all content, fully typed (edit this)
├── app/
│   ├── layout.tsx             metadata, fonts, JSON-LD, pre-paint theme script
│   ├── page.tsx               section order
│   ├── globals.css            theme tokens, base styles, utilities
│   ├── icon.svg               favicon
│   ├── sitemap.ts / robots.ts
└── components/
    ├── Nav.tsx                sticky nav, active-section highlighting
    ├── ThemeToggle.tsx        dark/light, persisted to localStorage
    ├── NodeGraph.tsx          hero canvas motif (~2KB, pauses off-screen)
    ├── MotionProvider.tsx     honours prefers-reduced-motion globally
    ├── Reveal.tsx             the single scroll-in animation
    ├── Section.tsx            shared section shell
    ├── Icons.tsx              inline SVG set (no icon library)
    ├── Footer.tsx
    └── sections/              Hero, About, Skills, Experience, Projects,
                               Credentials, Contact
scripts/
├── generate-og.mjs            builds public/og.png from portfolio.ts
├── serve.mjs                  local static server for out/
└── audit.mjs                  responsive + accessibility audit
```

### Notes on a few decisions

- **The contact form has no backend.** Submitting composes a `mailto:` link and
  hands off to the visitor's mail client — nothing is sent or stored by the
  site, which keeps it a genuinely static deploy.
- **The OG image is generated into `public/og.png`** rather than using Next's
  `opengraph-image` file convention, because that convention emits an
  extensionless file that some static hosts serve as `application/octet-stream`,
  and link scrapers then ignore it.
- **The hero canvas pauses** when scrolled out of view or when the tab is
  hidden, scales its node count to the viewport, and renders a single static
  frame under `prefers-reduced-motion`.
- **Scroll-reveal degrades safely.** Revealed blocks start at `opacity: 0` and
  are animated in by JS; a `<noscript>` rule forces them visible, so visitors and
  crawlers without JavaScript still see the whole page.

---

## Verified

Last checked against the production static export (`out/`), served locally with
gzip on, as a host like Vercel would.

| Check | Result |
| --- | --- |
| Lighthouse — desktop | Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100** |
| Lighthouse — mobile | Performance **92** (median of 8 runs, range 91–94), Accessibility **100**, Best Practices **100**, SEO **100**, CLS 0 |
| axe-core (WCAG 2.1 AA) | 0 violations at 375 / 768 / 1440px, both themes |
| Horizontal overflow | None at any tested width |
| Console errors / failed requests | None |
| Keyboard | Every tab stop has a visible focus ring; skip link present |
| Reduced motion | Background canvas renders one static frame and never animates |

### Performance notes

Mobile performance is the tightest number, so the things that keep it there are
worth knowing before you change them:

- **The hero is never scroll-revealed.** It's above the fold, so animating it in
  only delays the largest contentful paint behind hydration. Everything below
  the fold still reveals.
- **Framer Motion is lazy-loaded** through `LazyMotion` with the slim `m`
  component (see `MotionProvider.tsx`). The full `motion` bundle was the single
  heaviest script on the page.
- **The background canvas is deliberately cheap** (`RelevanceField.tsx`): static
  first frame, animation starts 1.5s after `load`, ~1s of motion then a timer
  sleep (no `requestAnimationFrame` loop held open), batched fills, and it is
  sized by a `ResizeObserver`. Do not measure it with `getBoundingClientRect()`
  during mount — that forces a full-page layout inside React's effect flush and
  cost ~350ms of blocking time on roughly a third of runs.
- **CSS is inlined** (`experimental.inlineCss` in `next.config.ts`), removing the
  render-blocking stylesheet request. It's the right trade for a one-page site;
  it would be the wrong one for a large multi-page app.
- **Measure against a server that gzips.** `npm run preview` does. A server that
  doesn't will show a large, fake "text compression" penalty and a mobile score
  that is 15+ points too low.

### The interaction layer

Everything that reacts to the pointer is deliberately concentrated in two files,
so it is easy to tune or delete:

- `src/app/interactions.css` — every hover, spotlight, lift, cursor and entrance style.
- `src/components/Interactions.tsx` — one delegated `pointermove` listener that
  drives the scroll-progress bar, cursor ring, ambient glow, card spotlight,
  magnetic buttons and the portrait's tilt and eye-tracking.

To make something respond, add an attribute rather than writing JavaScript:
`data-spotlight` (a card the light follows inside), `data-magnetic` (a button that
tugs toward the cursor), `data-tilt` (the portrait). Add the `fx-card` class for
the lift, `btn` / `btn-primary` for buttons, `tag-cascade` for scroll-in tags.

Rules it keeps, which are worth keeping if you extend it:

- **Fine pointers only.** The ring, glow, magnetism and tilt exist only for a
  mouse, trackpad or pen. Touch screens get tap feedback instead.
- **Reduced motion is respected.** Every movement is dropped; colour changes stay.
- **Idle means zero work.** The frame loop starts on mouse move and stops itself
  when everything has settled. Nothing animates on a still page.
- **Loaded late.** `LazyEffects.tsx` fetches the canvas and the interaction layer
  after the page is idle, so they never sit on the critical path.
- **Never measure layout at mount.** Reading sizes during hydration forces a
  full-page layout; do it only inside pointer or resize handlers.
