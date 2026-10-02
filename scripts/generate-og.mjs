/**
 * Generates public/og.png — the social preview card.
 *
 * Runs automatically before every build (see the "prebuild" npm script), and
 * reads src/data/portfolio.ts directly, so the card can never drift out of
 * sync with the site's content.
 *
 * It writes a real .png rather than using Next's `opengraph-image` file
 * convention, because that convention emits an extensionless file which some
 * static hosts serve as application/octet-stream — and link scrapers ignore it.
 */

import { writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";
import { person, seo } from "../src/data/portfolio.ts";

const COLORS = {
  bg: "#0E1420",
  fg: "#E9EDF3",
  muted: "#8E9AAD",
  accent: "#E8A33D",
  semantic: "#2BB3A3",
  line: "rgba(255,255,255,0.12)",
};

const card = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: COLORS.bg,
      padding: "72px 80px",
      fontFamily: "sans-serif",
      color: COLORS.fg,
    },
  },
  h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 16 } },
    h("div", { style: { width: 34, height: 5, borderRadius: 3, background: COLORS.accent } }),
    h("div", { style: { width: 22, height: 5, borderRadius: 3, background: COLORS.semantic } }),
    h(
      "div",
      {
        style: {
          fontSize: 22,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: COLORS.muted,
        },
      },
      person.location,
    ),
  ),
  h(
    "div",
    { style: { display: "flex", flexDirection: "column" } },
    h(
      "div",
      { style: { fontSize: 86, fontWeight: 700, letterSpacing: -3 } },
      person.name,
    ),
    h(
      "div",
      {
        style: {
          fontSize: 58,
          fontWeight: 700,
          letterSpacing: -2,
          color: COLORS.accent,
          marginTop: 2,
        },
      },
      person.title,
    ),
    h(
      "div",
      {
        style: {
          fontSize: 27,
          color: COLORS.muted,
          marginTop: 26,
          maxWidth: 950,
          lineHeight: 1.4,
        },
      },
      "LLM-powered applications and AI agents on Google Cloud.",
    ),
  ),
  h(
    "div",
    {
      style: {
        display: "flex",
        gap: 14,
        fontSize: 21,
        color: COLORS.muted,
        borderTop: `1px solid ${COLORS.line}`,
        paddingTop: 26,
      },
    },
    ...seo.keywords
      .slice(0, 5)
      .map((keyword) =>
        h(
          "div",
          {
            key: keyword,
            style: {
              border: `1px solid ${COLORS.line}`,
              borderRadius: 8,
              padding: "6px 14px",
            },
          },
          keyword,
        ),
      ),
  ),
);

const response = new ImageResponse(card, { width: 1200, height: 630 });
const buffer = Buffer.from(await response.arrayBuffer());
await writeFile(new URL("../public/og.png", import.meta.url), buffer);
console.log(`generate-og: wrote public/og.png (${buffer.length} bytes)`);
